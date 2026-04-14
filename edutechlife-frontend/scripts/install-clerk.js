#!/usr/bin/env node

/**
 * Script para instalar Clerk correctamente
 * Soluciona problemas de instalación de npm
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== INSTALADOR DE CLERK ===\n');

// Verificar Node.js version
const nodeVersion = process.version;
console.log(`Node.js version: ${nodeVersion}`);

if (parseInt(nodeVersion.replace('v', '').split('.')[0]) < 18) {
  console.error('❌ Error: Clerk requiere Node.js 18 o superior');
  process.exit(1);
}

// Verificar si estamos en el directorio correcto
const packageJsonPath = path.join(__dirname, '..', 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ Error: No se encontró package.json');
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
console.log(`Proyecto: ${packageJson.name} v${packageJson.version}`);

// Verificar dependencias actuales
console.log('\n=== VERIFICANDO DEPENDENCIAS ===');
const dependencies = packageJson.dependencies || {};
const devDependencies = packageJson.devDependencies || {};

if (dependencies['@clerk/react']) {
  console.log(`✓ @clerk/react: ${dependencies['@clerk/react']}`);
} else {
  console.log('✗ @clerk/react: No instalado');
}

if (dependencies['@clerk/ui']) {
  console.log(`✓ @clerk/ui: ${dependencies['@clerk/ui']}`);
} else {
  console.log('✗ @clerk/ui: No instalado');
}

// Verificar si Clerk está en node_modules
const clerkReactPath = path.join(__dirname, '..', 'node_modules', '@clerk', 'react');
const clerkUiPath = path.join(__dirname, '..', 'node_modules', '@clerk', 'ui');

const isClerkReactInstalled = fs.existsSync(clerkReactPath);
const isClerkUiInstalled = fs.existsSync(clerkUiPath);

console.log('\n=== ESTADO DE INSTALACIÓN ===');
console.log(`@clerk/react en node_modules: ${isClerkReactInstalled ? '✓' : '✗'}`);
console.log(`@clerk/ui en node_modules: ${isClerkUiInstalled ? '✗' : '✗'}`);

if (isClerkReactInstalled && isClerkUiInstalled) {
  console.log('\n✅ Clerk ya está instalado correctamente');
  process.exit(0);
}

// Opciones de instalación
console.log('\n=== OPCIONES DE INSTALACIÓN ===');
console.log('1. Instalar con npm (recomendado)');
console.log('2. Instalar con pnpm (más rápido)');
console.log('3. Instalar versiones específicas');
console.log('4. Salir');

// Leer opción del usuario
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question('\nSelecciona una opción (1-4): ', (option) => {
  readline.close();
  
  switch (option) {
    case '1':
      installWithNpm();
      break;
    case '2':
      installWithPnpm();
      break;
    case '3':
      installSpecificVersions();
      break;
    case '4':
      console.log('Saliendo...');
      process.exit(0);
      break;
    default:
      console.log('Opción inválida');
      process.exit(1);
  }
});

function installWithNpm() {
  console.log('\n=== INSTALANDO CON NPM ===');
  
  try {
    // Limpiar cache
    console.log('Limpiando cache de npm...');
    execSync('npm cache clean --force', { stdio: 'inherit' });
    
    // Instalar Clerk
    console.log('\nInstalando @clerk/react...');
    execSync('npm install @clerk/react@latest --no-audit --progress=false', { stdio: 'inherit' });
    
    console.log('\nInstalando @clerk/ui...');
    execSync('npm install @clerk/ui@latest --no-audit --progress=false', { stdio: 'inherit' });
    
    console.log('\n✅ Instalación completada con éxito');
    
    // Verificar instalación
    verifyInstallation();
    
  } catch (error) {
    console.error('❌ Error durante la instalación:', error.message);
    process.exit(1);
  }
}

function installWithPnpm() {
  console.log('\n=== INSTALANDO CON PNPM ===');
  
  try {
    // Verificar si pnpm está instalado
    execSync('pnpm --version', { stdio: 'pipe' });
    
    console.log('Instalando Clerk con pnpm...');
    execSync('pnpm add @clerk/react @clerk/ui', { stdio: 'inherit' });
    
    console.log('\n✅ Instalación completada con éxito');
    verifyInstallation();
    
  } catch (error) {
    console.error('❌ pnpm no está instalado o hubo un error:', error.message);
    console.log('Intentando instalar pnpm primero...');
    
    try {
      execSync('npm install -g pnpm', { stdio: 'inherit' });
      installWithPnpm();
    } catch (pnpmError) {
      console.error('❌ No se pudo instalar pnpm:', pnpmError.message);
      console.log('Intentando con npm en su lugar...');
      installWithNpm();
    }
  }
}

function installSpecificVersions() {
  console.log('\n=== INSTALANDO VERSIONES ESPECÍFICAS ===');
  
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  readline.question('Versión de @clerk/react (ej: 6.2.1): ', (reactVersion) => {
    readline.question('Versión de @clerk/ui (ej: 1.5.0): ', (uiVersion) => {
      readline.close();
      
      try {
        console.log(`\nInstalando @clerk/react@${reactVersion}...`);
        execSync(`npm install @clerk/react@${reactVersion} --no-audit --progress=false`, { stdio: 'inherit' });
        
        console.log(`\nInstalando @clerk/ui@${uiVersion}...`);
        execSync(`npm install @clerk/ui@${uiVersion} --no-audit --progress=false`, { stdio: 'inherit' });
        
        console.log('\n✅ Instalación completada con éxito');
        verifyInstallation();
        
      } catch (error) {
        console.error('❌ Error durante la instalación:', error.message);
        process.exit(1);
      }
    });
  });
}

function verifyInstallation() {
  console.log('\n=== VERIFICANDO INSTALACIÓN ===');
  
  try {
    // Verificar que los paquetes estén instalados
    const clerkReactCheck = fs.existsSync(clerkReactPath);
    const clerkUiCheck = fs.existsSync(clerkUiPath);
    
    if (clerkReactCheck && clerkUiCheck) {
      console.log('✅ Clerk instalado correctamente en node_modules');
      
      // Verificar versiones
      const clerkReactPackage = JSON.parse(fs.readFileSync(path.join(clerkReactPath, 'package.json'), 'utf8'));
      const clerkUiPackage = JSON.parse(fs.readFileSync(path.join(clerkUiPath, 'package.json'), 'utf8'));
      
      console.log(`📦 @clerk/react v${clerkReactPackage.version}`);
      console.log(`📦 @clerk/ui v${clerkUiPackage.version}`);
      
      console.log('\n🎉 ¡Clerk está listo para usar!');
      console.log('\nReinicia el servidor de desarrollo:');
      console.log('  npm run dev');
      
    } else {
      console.error('❌ Clerk no se instaló completamente');
      console.log(`@clerk/react: ${clerkReactCheck ? '✓' : '✗'}`);
      console.log(`@clerk/ui: ${clerkUiCheck ? '✓' : '✗'}`);
    }
    
  } catch (error) {
    console.error('❌ Error verificando instalación:', error.message);
  }
}