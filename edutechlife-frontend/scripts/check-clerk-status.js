#!/usr/bin/env node

/**
 * Script para verificar el estado de Clerk
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando estado de Clerk...\n');

// Verificar archivo .env
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ No se encontró archivo .env');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');

let clerkPublishableKey = '';
let clerkSecretKey = '';

envLines.forEach(line => {
  if (line.includes('VITE_CLERK_PUBLISHABLE_KEY')) {
    clerkPublishableKey = line.split('=')[1];
  }
  if (line.includes('VITE_CLERK_SECRET_KEY')) {
    clerkSecretKey = line.split('=')[1];
  }
});

console.log('📋 Variables de entorno Clerk:');
console.log(`   VITE_CLERK_PUBLISHABLE_KEY: ${clerkPublishableKey ? '✅ Configurada' : '❌ No configurada'}`);
console.log(`   VITE_CLERK_SECRET_KEY: ${clerkSecretKey ? '✅ Configurada' : '❌ No configurada'}`);

if (clerkPublishableKey) {
  console.log(`\n🔑 Publishable Key: ${clerkPublishableKey.substring(0, 20)}...`);
  console.log(`   Longitud: ${clerkPublishableKey.length} caracteres`);
  console.log(`   Formato correcto: ${clerkPublishableKey.startsWith('pk_test_') ? '✅' : '❌ (debe comenzar con pk_test_)'}`);
}

if (clerkSecretKey) {
  console.log(`\n🔐 Secret Key: ${clerkSecretKey.substring(0, 20)}...`);
  console.log(`   Longitud: ${clerkSecretKey.length} caracteres`);
  console.log(`   Formato correcto: ${clerkSecretKey.startsWith('sk_test_') ? '✅' : '❌ (debe comenzar con sk_test_)'}`);
}

// Verificar node_modules
const clerkReactPath = path.join(__dirname, '..', 'node_modules', '@clerk', 'react');
const clerkUiPath = path.join(__dirname, '..', 'node_modules', '@clerk', 'ui');

console.log('\n📦 Dependencias instaladas:');
console.log(`   @clerk/react: ${fs.existsSync(clerkReactPath) ? '✅ Instalado' : '❌ No instalado'}`);
console.log(`   @clerk/ui: ${fs.existsSync(clerkUiPath) ? '✅ Instalado' : '❌ No instalado'}`);

// Verificar package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const deps = packageJson.dependencies || {};
  
  console.log('\n📄 package.json:');
  console.log(`   @clerk/react: ${deps['@clerk/react'] ? `✅ ${deps['@clerk/react']}` : '❌ No en dependencias'}`);
  console.log(`   @clerk/ui: ${deps['@clerk/ui'] ? `✅ ${deps['@clerk/ui']}` : '❌ No en dependencias'}`);
}

// Verificar archivos de configuración
const configFiles = [
  'src/lib/clerk-config.js',
  'src/providers/ClerkProviderWrapper.jsx',
  'src/utils/clerk-utils.js'
];

console.log('\n⚙️ Archivos de configuración:');
configFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  console.log(`   ${file}: ${fs.existsSync(filePath) ? '✅ Existe' : '❌ No existe'}`);
});

// Recomendaciones
console.log('\n💡 Recomendaciones:');

if (!fs.existsSync(clerkReactPath) || !fs.existsSync(clerkUiPath)) {
  console.log('   1. Instalar Clerk: npm install @clerk/react @clerk/ui');
}

if (!clerkPublishableKey || !clerkSecretKey) {
  console.log('   2. Configurar variables de entorno en .env');
}

if (clerkPublishableKey && !clerkPublishableKey.startsWith('pk_test_')) {
  console.log('   3. Verificar que la publishable key comience con pk_test_');
}

if (clerkSecretKey && !clerkSecretKey.startsWith('sk_test_')) {
  console.log('   4. Verificar que la secret key comience con sk_test_');
}

console.log('\n🎯 Estado general:');
const allGood = clerkPublishableKey && clerkSecretKey && 
                clerkPublishableKey.startsWith('pk_test_') && 
                clerkSecretKey.startsWith('sk_test_') &&
                fs.existsSync(clerkReactPath) && 
                fs.existsSync(clerkUiPath);

if (allGood) {
  console.log('✅ Clerk está configurado correctamente');
} else {
  console.log('⚠️  Hay problemas con la configuración de Clerk');
  console.log('   El sistema funcionará en modo simulación hasta que se resuelvan');
}

console.log('\n🔗 Dashboard Clerk: https://dashboard.clerk.com');
console.log('📚 Documentación: https://clerk.com/docs');