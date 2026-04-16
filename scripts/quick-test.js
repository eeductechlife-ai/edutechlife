#!/usr/bin/env node

/**
 * Script rápido de testing sin dependencias externas
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 QUICK TEST - INTEGRACIÓN PREMIUM');
console.log('===================================\n');

// ============================================
// 1. LEER VARIABLES DE ENTORNO MANUALMENTE
// ============================================

console.log('1. Verificando variables de entorno...');

const envPath = path.join(__dirname, '..', 'edutechlife-frontend', '.env.local');
let envContent = '';

try {
  envContent = fs.readFileSync(envPath, 'utf8');
  console.log(`   ✅ Archivo .env.local encontrado: ${envPath}`);
} catch (error) {
  console.log(`   ❌ No se pudo leer .env.local: ${error.message}`);
  process.exit(1);
}

// Parsear variables manualmente
const envVars = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

// Verificar variables requeridas
const requiredVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_SUPABASE_SERVICE_ROLE_KEY',
  'VITE_CLERK_PUBLISHABLE_KEY'
];

let allEnvVarsPresent = true;
for (const envVar of requiredVars) {
  const value = envVars[envVar];
  const exists = !!value;
  
  console.log(`   ${exists ? '✅' : '❌'} ${envVar}: ${exists ? 'PRESENTE' : 'FALTANTE'}`);
  
  if (exists) {
    const isTestKey = value.includes('test') || value.includes('pk_test') || value.includes('sk_test');
    if (isTestKey) {
      console.log(`      ⚠️  Usando clave de TEST`);
    }
  } else {
    allEnvVarsPresent = false;
  }
}

if (!allEnvVarsPresent) {
  console.log('\n❌ Faltan variables de entorno requeridas');
  process.exit(1);
}

console.log('\n✅ Todas las variables de entorno están presentes');

// ============================================
// 2. VERIFICAR ARCHIVOS SQL Y SCRIPTS
// ============================================

console.log('\n2. Verificando archivos del proyecto...');

const requiredFiles = [
  '../IALAB_PREMIUM_SAAS_SCHEMA.sql',
  '../CLERK_SUPABASE_INTEGRATION_GUIDE.md',
  '../edutechlife-frontend/src/lib/supabase-premium-client.js',
  'execute-supabase-sql.js'
];

let allFilesPresent = true;
for (const file of requiredFiles) {
  const filePath = path.join(__dirname, file);
  const exists = fs.existsSync(filePath);
  
  console.log(`   ${exists ? '✅' : '❌'} ${file}: ${exists ? 'PRESENTE' : 'FALTANTE'}`);
  
  if (exists) {
    try {
      const stats = fs.statSync(filePath);
      console.log(`      Tamaño: ${(stats.size / 1024).toFixed(2)} KB`);
    } catch (e) {
      // Ignorar error de stats
    }
  } else {
    allFilesPresent = false;
  }
}

if (!allFilesPresent) {
  console.log('\n⚠️  Algunos archivos requeridos faltan');
} else {
  console.log('\n✅ Todos los archivos requeridos están presentes');
}

// ============================================
// 3. VERIFICAR SQL SCHEMA
// ============================================

console.log('\n3. Analizando SQL Schema...');

const sqlPath = path.join(__dirname, '..', 'IALAB_PREMIUM_SAAS_SCHEMA.sql');
try {
  const sqlContent = fs.readFileSync(sqlPath, 'utf8');
  
  // Contar tablas
  const tableMatches = sqlContent.match(/CREATE TABLE (\w+)/g) || [];
  const tables = tableMatches.map(match => match.replace('CREATE TABLE ', ''));
  
  // Contar funciones
  const functionMatches = sqlContent.match(/CREATE OR REPLACE FUNCTION (\w+)/g) || [];
  const functions = functionMatches.map(match => match.replace('CREATE OR REPLACE FUNCTION ', ''));
  
  // Contar índices
  const indexMatches = sqlContent.match(/CREATE INDEX (\w+)/g) || [];
  const indexes = indexMatches.map(match => match.replace('CREATE INDEX ', ''));
  
  console.log(`   📊 Tablas definidas: ${tables.length}`);
  tables.forEach(table => console.log(`      • ${table}`));
  
  console.log(`   ⚙️  Funciones definidas: ${functions.length}`);
  functions.slice(0, 5).forEach(func => console.log(`      • ${func}()`));
  if (functions.length > 5) console.log(`      ... y ${functions.length - 5} más`);
  
  console.log(`   ⚡ Índices definidos: ${indexes.length}`);
  indexes.slice(0, 5).forEach(index => console.log(`      • ${index}`));
  if (indexes.length > 5) console.log(`      ... y ${indexes.length - 5} más`);
  
  // Verificar tablas requeridas
  const requiredTables = ['profiles', 'course_progress', 'certificates', 'quiz_attempts', 'student_sessions'];
  const missingTables = requiredTables.filter(table => !tables.includes(table));
  
  if (missingTables.length > 0) {
    console.log(`\n   ⚠️  Tablas faltantes en SQL: ${missingTables.join(', ')}`);
  } else {
    console.log('\n   ✅ Todas las tablas requeridas están definidas');
  }
  
} catch (error) {
  console.log(`   ❌ Error leyendo SQL: ${error.message}`);
}

// ============================================
// 4. RESUMEN Y RECOMENDACIONES
// ============================================

console.log('\n📋 RESUMEN DE VERIFICACIÓN');
console.log('==========================');

const checks = {
  envVars: allEnvVarsPresent,
  files: allFilesPresent,
  sqlSchema: fs.existsSync(sqlPath)
};

const passedChecks = Object.values(checks).filter(Boolean).length;
const totalChecks = Object.keys(checks).length;
const score = Math.round((passedChecks / totalChecks) * 100);

console.log(`Puntaje: ${score}% (${passedChecks}/${totalChecks} verificaciones pasadas)\n`);

for (const [check, passed] of Object.entries(checks)) {
  console.log(`${passed ? '✅' : '❌'} ${check.toUpperCase().replace('_', ' ')}`);
}

console.log('\n🎯 PRÓXIMOS PASOS:');

if (score === 100) {
  console.log('1. 🗄️  EJECUTAR SQL EN SUPABASE:');
  console.log('   node scripts/execute-supabase-sql.js');
  console.log('\n2. 🔐 CONFIGURAR CLERK JWT TEMPLATE:');
  console.log('   - ID: 5d74d508-85ee-4a7c-9d50-87005f9b8a90');
  console.log('   - Claims: sub={{user.id}}, role=authenticated');
  console.log('\n3. ⚙️  CONFIGURAR SUPABASE JWT SETTINGS:');
  console.log('   - JWKS URL de Clerk');
  console.log('   - Issuer: clerk.edutechlife.com');
  console.log('\n4. 🚀 INICIAR APLICACIÓN:');
  console.log('   cd edutechlife-frontend && npm run dev');
} else {
  console.log('1. 🔧 COMPLETAR CONFIGURACIÓN FALTANTE');
  console.log('2. SEGUIR CON LOS PASOS ANTERIORES');
}

console.log('\n📚 DOCUMENTACIÓN DISPONIBLE:');
console.log('- Guía completa: CLERK_SUPABASE_INTEGRATION_GUIDE.md');
console.log('- Instrucciones: INSTRUCCIONES_EJECUCION.md');
console.log('- SQL Schema: IALAB_PREMIUM_SAAS_SCHEMA.sql');

// Guardar reporte
const report = {
  timestamp: new Date().toISOString(),
  score,
  checks,
  envVars: Object.keys(envVars).filter(k => k.startsWith('VITE_')),
  nextSteps: score === 100 ? 'Ejecutar SQL y configurar JWT' : 'Completar configuración'
};

const reportPath = path.join(__dirname, 'quick-test-report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`\n📄 Reporte guardado en: ${reportPath}`);

process.exit(score === 100 ? 0 : 1);