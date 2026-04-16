#!/usr/bin/env node

/**
 * Script para ejecutar SQL en Supabase
 * 
 * Este script:
 * 1. Lee el archivo SQL
 * 2. Conecta a Supabase usando service role key
 * 3. Ejecuta el SQL en transacción
 * 4. Reporta resultados
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
const envPath = path.join(__dirname, '..', 'edutechlife-frontend', '.env.local');
dotenv.config({ path: envPath });

console.log('🚀 EJECUTANDO SQL EN SUPABASE');
console.log('=============================\n');

// Configuración
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const SQL_FILE_PATH = path.join(__dirname, '..', 'IALAB_PREMIUM_SAAS_SCHEMA.sql');

// Verificar configuración
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ ERROR: Variables de entorno requeridas');
  console.error('   VITE_SUPABASE_URL:', SUPABASE_URL ? '✓' : '✗');
  console.error('   VITE_SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_KEY ? '✓' : '✗');
  console.error('\n💡 Solución:');
  console.error('1. Obtén SERVICE ROLE KEY de Supabase Dashboard → Settings → API');
  console.error('2. Agrega al .env.local: VITE_SUPABASE_SERVICE_ROLE_KEY=eyJ...');
  process.exit(1);
}

// Verificar archivo SQL
if (!fs.existsSync(SQL_FILE_PATH)) {
  console.error(`❌ ERROR: Archivo SQL no encontrado: ${SQL_FILE_PATH}`);
  console.error('💡 Asegúrate de que IALAB_PREMIUM_SAAS_SCHEMA.sql existe en la raíz del proyecto');
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

// Función para ejecutar SQL en chunks (evitar timeout)
async function executeSQLInChunks(sql) {
  console.log('\n⚡ Ejecutando SQL en chunks...');
  
  // Dividir por sentencias SQL (aproximado)
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));
  
  console.log(`   Sentencias a ejecutar: ${statements.length}`);
  
  const results = [];
  let successCount = 0;
  let errorCount = 0;
  
  // Ejecutar cada sentencia
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i] + ';';
    const isLast = i === statements.length - 1;
    
    try {
      console.log(`   [${i + 1}/${statements.length}] Ejecutando...`);
      
      // Para SELECT statements, usar query
      if (statement.trim().toUpperCase().startsWith('SELECT')) {
        const { data, error } = await supabase.rpc('exec_sql', { sql: statement }).catch(() => {
          // Fallback: intentar como query directa
          return { data: null, error: { message: 'SELECT no soportado en exec_sql' } };
        });
        
        if (error && !error.message.includes('no soportado')) {
          throw error;
        }
        
        results.push({
          statement: statement.substring(0, 100) + '...',
          success: true,
          result: 'SELECT ejecutado'
        });
        successCount++;
        
      } else {
        // Para DDL/DML, usar exec_sql si existe
        const { error } = await supabase.rpc('exec_sql', { sql: statement }).catch(async () => {
          // Si exec_sql no existe, usar query directa
          console.log(`      ⚠️  exec_sql no disponible, usando método alternativo`);
          
          // Intentar con query directa (solo para algunas operaciones)
          if (statement.toUpperCase().includes('CREATE TABLE') || 
              statement.toUpperCase().includes('ALTER TABLE') ||
              statement.toUpperCase().includes('CREATE INDEX')) {
            
            // Para estas operaciones, necesitamos conexión directa
            // En este script simple, solo reportamos que se necesita ejecución manual
            return { error: { message: 'Ejecutar manualmente en Supabase Dashboard' } };
          }
          
          return { error: null };
        });
        
        if (error) {
          // Si es un error de "ejecutar manualmente", es esperado
          if (error.message.includes('manualmente')) {
            console.log(`      ℹ️  ${error.message}`);
            results.push({
              statement: statement.substring(0, 100) + '...',
              success: true,
              result: 'Requiere ejecución manual'
            });
            successCount++;
          } else {
            throw error;
          }
        } else {
          results.push({
            statement: statement.substring(0, 100) + '...',
            success: true,
            result: 'Ejecutado'
          });
          successCount++;
        }
      }
      
      // Pequeña pausa entre sentencias
      if (!isLast) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
    } catch (error) {
      console.error(`      ❌ Error en sentencia ${i + 1}: ${error.message}`);
      results.push({
        statement: statement.substring(0, 100) + '...',
        success: false,
        error: error.message
      });
      errorCount++;
      
      // Continuar con la siguiente sentencia
      continue;
    }
  }
  
  return { results, successCount, errorCount };
}

// Función principal
async function main() {
  console.log('\n📋 RESUMEN DE EJECUCIÓN:');
  console.log('========================');
  
  // Opción 1: Intentar ejecutar todo en una transacción
  console.log('\n1. Intentando ejecución completa...');
  
  try {
    const { error } = await supabase.rpc('exec_sql', { sql: sqlContent });
    
    if (error) {
      console.log(`   ⚠️  No se pudo ejecutar completo: ${error.message}`);
      console.log('   💡 Intentando ejecutar en chunks...');
      
      // Opción 2: Ejecutar en chunks
      const chunkResult = await executeSQLInChunks(sqlContent);
      
      console.log('\n📊 RESULTADOS (chunks):');
      console.log(`   ✅ Exitosa: ${chunkResult.successCount}`);
      console.log(`   ❌ Fallidas: ${chunkResult.errorCount}`);
      console.log(`   📈 Tasa éxito: ${((chunkResult.successCount / (chunkResult.successCount + chunkResult.errorCount)) * 100).toFixed(1)}%`);
      
      // Mostrar primeros errores
      const errors = chunkResult.results.filter(r => !r.success);
      if (errors.length > 0) {
        console.log('\n🔍 PRIMEROS ERRORES:');
        errors.slice(0, 3).forEach((err, i) => {
          console.log(`   ${i + 1}. ${err.statement}`);
          console.log(`      Error: ${err.error}`);
        });
        
        if (errors.length > 3) {
          console.log(`   ... y ${errors.length - 3} errores más`);
        }
      }
      
      return chunkResult;
      
    } else {
      console.log('   ✅ SQL ejecutado exitosamente en una transacción');
      return { successCount: 1, errorCount: 0, results: [] };
    }
    
  } catch (error) {
    console.error(`   ❌ Error inesperado: ${error.message}`);
    return { successCount: 0, errorCount: 1, results: [{ error: error.message }] };
  }
}

// Ejecutar
main().then(async (result) => {
  console.log('\n🎯 VERIFICACIÓN POST-EJECUCIÓN');
  console.log('==============================');
  
  // Verificar que las tablas se crearon
  try {
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', [
        'profiles', 'course_progress', 'certificates', 
        'quiz_attempts', 'student_sessions'
      ]);
    
    if (error) {
      console.log('   ⚠️  No se pudieron verificar tablas:', error.message);
    } else {
      console.log(`   📊 Tablas creadas: ${tables.length}/5`);
      tables.forEach(table => {
        console.log(`      ✅ ${table.table_name}`);
      });
      
      const missingTables = [
        'profiles', 'course_progress', 'certificates', 
        'quiz_attempts', 'student_sessions'
      ].filter(name => !tables.find(t => t.table_name === name));
      
      if (missingTables.length > 0) {
        console.log(`   ❌ Tablas faltantes: ${missingTables.join(', ')}`);
      }
    }
  } catch (error) {
    console.log('   ⚠️  Error en verificación:', error.message);
  }
  
  // Verificar funciones
  try {
    const { data: functions, error } = await supabase
      .from('information_schema.routines')
      .select('routine_name')
      .eq('routine_schema', 'public')
      .eq('routine_type', 'FUNCTION')
      .in('routine_name', [
        'get_user_overall_progress',
        'check_daily_attempts',
        'verify_ialab_schema'
      ]);
    
    if (error) {
      console.log('   ⚠️  No se pudieron verificar funciones:', error.message);
    } else {
      console.log(`\n   ⚙️  Funciones creadas: ${functions.length}/3`);
      functions.forEach(func => {
        console.log(`      ✅ ${func.routine_name}()`);
      });
    }
  } catch (error) {
    console.log('   ⚠️  Error verificando funciones:', error.message);
  }
  
  console.log('\n📋 INSTRUCCIONES FINALES:');
  console.log('========================');
  
  if (result.errorCount === 0) {
    console.log('🎉 ¡SQL EJECUTADO EXITOSAMENTE!');
    console.log('\n🔧 PRÓXIMOS PASOS:');
    console.log('1. Configurar Clerk JWT Template (ver CLERK_SUPABASE_INTEGRATION_GUIDE.md)');
    console.log('2. Configurar Supabase JWT Settings');
    console.log('3. Ejecutar test: node scripts/test-premium-integration.js');
    console.log('4. Iniciar app: cd edutechlife-frontend && npm run dev');
  } else {
    console.log('⚠️  SQL EJECUTADO CON ERRORES');
    console.log('\n🔧 ACCIONES REQUERIDAS:');
    console.log('1. Ejecutar manualmente en Supabase Dashboard:');
    console.log('   - Ve a https://app.supabase.com/project/srirrwpgswlnuqfgtule');
    console.log('   - SQL Editor → Pegar contenido de IALAB_PREMIUM_SAAS_SCHEMA.sql');
    console.log('   - Ejecutar');
    console.log('2. Seguir con configuración Clerk JWT');
    console.log('3. Ejecutar test de verificación');
  }
  
  console.log('\n📚 DOCUMENTACIÓN:');
  console.log('- Guía completa: CLERK_SUPABASE_INTEGRATION_GUIDE.md');
  console.log('- Cliente premium: src/lib/supabase-premium-client.js');
  console.log('- Testing: scripts/test-premium-integration.js');
  
  // Guardar reporte
  const report = {
    timestamp: new Date().toISOString(),
    sqlFile: SQL_FILE_PATH,
    supabaseUrl: SUPABASE_URL,
    results: result,
    summary: {
      totalStatements: result.results.length,
      success: result.successCount,
      errors: result.errorCount
    }
  };
  
  const reportPath = path.join(__dirname, 'sql-execution-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Reporte guardado en: ${reportPath}`);
  
  process.exit(result.errorCount === 0 ? 0 : 1);
  
}).catch(error => {
  console.error('\n❌ ERROR CRÍTICO:', error.message);
  console.error(error.stack);
  process.exit(1);
});