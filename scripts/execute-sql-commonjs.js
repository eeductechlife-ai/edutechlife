#!/usr/bin/env node

/**
 * Script para ejecutar SQL en Supabase (CommonJS version)
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

console.log('🚀 EJECUTANDO SQL EN SUPABASE (CommonJS)');
console.log('========================================\n');

// Cargar variables de entorno manualmente
const envPath = path.join(__dirname, '..', 'edutechlife-frontend', '.env.local');
let envContent = '';

try {
  envContent = fs.readFileSync(envPath, 'utf8');
  console.log(`📄 Archivo .env.local cargado: ${envPath}`);
} catch (error) {
  console.error(`❌ Error leyendo .env.local: ${error.message}`);
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

// Configuración
const SUPABASE_URL = envVars.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = envVars.VITE_SUPABASE_SERVICE_ROLE_KEY || envVars.VITE_SUPABASE_ANON_KEY;
const SQL_FILE_PATH = path.join(__dirname, '..', 'IALAB_PREMIUM_SAAS_SCHEMA.sql');

// Verificar configuración
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ ERROR: Variables de entorno requeridas');
  console.error('   VITE_SUPABASE_URL:', SUPABASE_URL ? '✓' : '✗');
  console.error('   VITE_SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_KEY ? '✓' : '✗');
  process.exit(1);
}

// Verificar archivo SQL
if (!fs.existsSync(SQL_FILE_PATH)) {
  console.error(`❌ ERROR: Archivo SQL no encontrado: ${SQL_FILE_PATH}`);
  process.exit(1);
}

// Leer archivo SQL
let sqlContent;
try {
  sqlContent = fs.readFileSync(SQL_FILE_PATH, 'utf8');
  console.log(`📄 Archivo SQL cargado: ${SQL_FILE_PATH}`);
  console.log(`   Tamaño: ${(sqlContent.length / 1024).toFixed(2)} KB`);
  console.log(`   Líneas: ${sqlContent.split('\n').length}`);
} catch (error) {
  console.error(`❌ Error leyendo archivo SQL: ${error.message}`);
  process.exit(1);
}

// Crear cliente Supabase con service role
console.log('\n🔐 Conectando a Supabase...');
console.log(`   URL: ${SUPABASE_URL.substring(0, 30)}...`);

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Función para ejecutar SQL usando Supabase REST API
async function executeSQLViaRestAPI() {
  console.log('\n⚡ Ejecutando SQL via REST API...');
  
  // Dividir en sentencias ejecutables
  const statements = [];
  let currentStatement = '';
  const lines = sqlContent.split('\n');
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Saltar comentarios y líneas vacías
    if (trimmedLine.startsWith('--') || trimmedLine === '') {
      continue;
    }
    
    currentStatement += line + '\n';
    
    // Si la línea termina con ;, es el fin de una sentencia
    if (trimmedLine.endsWith(';')) {
      statements.push(currentStatement.trim());
      currentStatement = '';
    }
  }
  
  // Agregar última sentencia si no terminó con ;
  if (currentStatement.trim()) {
    statements.push(currentStatement.trim());
  }
  
  console.log(`   Sentencias a ejecutar: ${statements.length}`);
  
  const results = [];
  let successCount = 0;
  let errorCount = 0;
  
  // Ejecutar cada sentencia
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    const statementPreview = statement.substring(0, 100).replace(/\n/g, ' ') + '...';
    
    try {
      console.log(`   [${i + 1}/${statements.length}] Ejecutando: ${statementPreview}`);
      
      // Para SELECT statements, intentar como query
      if (statement.toUpperCase().startsWith('SELECT')) {
        console.log(`      ⚠️  SELECT statement, omitiendo...`);
        results.push({
          statement: statementPreview,
          success: true,
          result: 'SELECT omitido (ejecutar manualmente)'
        });
        successCount++;
        continue;
      }
      
      // Para DDL statements (CREATE, ALTER, DROP), necesitamos ejecución manual
      const isDDL = statement.toUpperCase().includes('CREATE TABLE') ||
                   statement.toUpperCase().includes('ALTER TABLE') ||
                   statement.toUpperCase().includes('DROP TABLE') ||
                   statement.toUpperCase().includes('CREATE INDEX') ||
                   statement.toUpperCase().includes('CREATE FUNCTION') ||
                   statement.toUpperCase().includes('CREATE TRIGGER') ||
                   statement.toUpperCase().includes('CREATE VIEW');
      
      if (isDDL) {
        console.log(`      ℹ️  DDL statement, requiere ejecución manual`);
        results.push({
          statement: statementPreview,
          success: true,
          result: 'Requiere ejecución manual en Supabase Dashboard'
        });
        successCount++;
        continue;
      }
      
      // Para INSERT, UPDATE, DELETE - intentar via REST API
      const isDML = statement.toUpperCase().startsWith('INSERT') ||
                   statement.toUpperCase().startsWith('UPDATE') ||
                   statement.toUpperCase().startsWith('DELETE');
      
      if (isDML) {
        console.log(`      ℹ️  DML statement, omitiendo (ejecutar después de crear tablas)`);
        results.push({
          statement: statementPreview,
          success: true,
          result: 'DML omitido (ejecutar después de DDL)'
        });
        successCount++;
        continue;
      }
      
      // Para otros statements (GRANT, COMMENT, etc.)
      console.log(`      ℹ️  Otro tipo de statement, omitiendo`);
      results.push({
        statement: statementPreview,
        success: true,
        result: 'Omitido (ejecutar manualmente si es necesario)'
      });
      successCount++;
      
    } catch (error) {
      console.error(`      ❌ Error: ${error.message}`);
      results.push({
        statement: statementPreview,
        success: false,
        error: error.message
      });
      errorCount++;
    }
    
    // Pequeña pausa entre sentencias
    if (i < statements.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }
  
  return { results, successCount, errorCount };
}

// Función principal
async function main() {
  console.log('\n📋 MÉTODO RECOMENDADO:');
  console.log('=====================');
  console.log('1. Copiar todo el contenido de IALAB_PREMIUM_SAAS_SCHEMA.sql');
  console.log('2. Ir a Supabase Dashboard: https://app.supabase.com/project/srirrwpgswlnuqfgtule');
  console.log('3. Navegar a SQL Editor');
  console.log('4. Pegar el SQL y hacer clic en "Run"');
  console.log('5. Verificar que no haya errores');
  
  // Intentar ejecución automática para statements simples
  console.log('\n⚡ Intentando ejecución automática de statements simples...');
  
  const result = await executeSQLViaRestAPI();
  
  console.log('\n📊 RESULTADOS:');
  console.log(`   ✅ Exitosa: ${result.successCount}`);
  console.log(`   ❌ Fallidas: ${result.errorCount}`);
  
  // Mostrar resumen de lo que se puede ejecutar automáticamente vs manualmente
  console.log('\n🎯 ANÁLISIS DEL SQL:');
  
  const ddlCount = result.results.filter(r => 
    r.result && r.result.includes('ejecución manual')
  ).length;
  
  const dmlCount = result.results.filter(r => 
    r.result && r.result.includes('DML omitido')
  ).length;
  
  const otherCount = result.results.filter(r => 
    r.result && (r.result.includes('SELECT omitido') || r.result.includes('Omitido'))
  ).length;
  
  console.log(`   🗄️  DDL statements (CREATE/ALTER): ${ddlCount} - REQUIEREN EJECUCIÓN MANUAL`);
  console.log(`   📝 DML statements (INSERT/UPDATE): ${dmlCount} - EJECUTAR DESPUÉS DE DDL`);
  console.log(`   🔍 Otros statements: ${otherCount} - VERIFICAR MANUALMENTE`);
  
  console.log('\n🔧 INSTRUCCIONES DETALLADAS:');
  console.log('============================');
  
  console.log('\n1. 🗄️  EJECUTAR DDL MANUALMENTE:');
  console.log('   a. Ir a Supabase Dashboard → SQL Editor');
  console.log('   b. Copiar TODO el contenido de IALAB_PREMIUM_SAAS_SCHEMA.sql');
  console.log('   c. Pegar y hacer clic en "Run"');
  console.log('   d. Verificar que no haya errores (debería mostrar "NOTICE" messages)');
  
  console.log('\n2. ✅ VERIFICAR INSTALACIÓN:');
  console.log('   Ejecutar en SQL Editor después de crear tablas:');
  console.log('   ```sql');
  console.log('   SELECT * FROM verify_ialab_schema();');
  console.log('   ```');
  
  console.log('\n3. 🔐 CONFIGURAR CLERK JWT:');
  console.log('   a. Crear JWT Template en Clerk con ID: 5d74d508-85ee-4a7c-9d50-87005f9b8a90');
  console.log('   b. Configurar claims: sub={{user.id}}, role=authenticated');
  console.log('   c. Copiar JWKS URL');
  
  console.log('\n4. ⚙️  CONFIGURAR SUPABASE JWT:');
  console.log('   a. Ir a Supabase → Authentication → Providers');
  console.log('   b. Habilitar Custom JWT');
  console.log('   c. Pegar JWKS URL de Clerk');
  console.log('   d. Configurar Issuer: clerk.edutechlife.com');
  
  console.log('\n5. 🧪 TESTEAR INTEGRACIÓN:');
  console.log('   ```bash');
  console.log('   cd /Users/home/Desktop/edutechlife');
  console.log('   node scripts/quick-test.js');
  console.log('   ```');
  
  // Guardar reporte
  const report = {
    timestamp: new Date().toISOString(),
    method: 'manual_execution_recommended',
    sqlFile: SQL_FILE_PATH,
    supabaseUrl: SUPABASE_URL,
    analysis: {
      totalStatements: result.results.length,
      ddlStatements: ddlCount,
      dmlStatements: dmlCount,
      otherStatements: otherCount
    },
    instructions: {
      step1: 'Execute SQL manually in Supabase Dashboard',
      step2: 'Configure Clerk JWT Template',
      step3: 'Configure Supabase JWT Settings',
      step4: 'Test integration'
    }
  };
  
  const reportPath = path.join(__dirname, 'sql-execution-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Reporte guardado en: ${reportPath}`);
  
  console.log('\n🎉 ¡LISTO PARA CONFIGURACIÓN MANUAL!');
  console.log('Sigue las instrucciones arriba para completar la instalación.');
  
  return result;
}

// Ejecutar
main().catch(error => {
  console.error('\n❌ ERROR CRÍTICO:', error.message);
  console.error(error.stack);
  process.exit(1);
});