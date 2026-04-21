#!/usr/bin/env node

/**
 * Script para crear tabla student_grades en Supabase
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

console.log('🚀 CREANDO TABLA STUDENT_GRADES EN SUPABASE');
console.log('===========================================\n');

// Configuración
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const SQL_FILE_PATH = path.join(__dirname, '..', 'create_student_grades_table.sql');

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

// Función para ejecutar SQL directamente
async function executeSQLDirectly() {
  console.log('\n⚡ Ejecutando SQL directamente...');
  
  try {
    // Dividir en sentencias y ejecutar una por una
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`   Sentencias a ejecutar: ${statements.length}`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      console.log(`   [${i + 1}/${statements.length}] Ejecutando: ${statement.substring(0, 80)}...`);
      
      try {
        // Usar rpc exec_sql si existe
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          console.log(`      ⚠️  Error con exec_sql: ${error.message}`);
          console.log(`      ℹ️  Esta sentencia debe ejecutarse manualmente en Supabase Dashboard`);
          console.log(`      📋 Sentencia para copiar:`);
          console.log(`      ${statement}`);
          console.log('');
        } else {
          console.log(`      ✅ Ejecutado`);
        }
      } catch (rpcError) {
        console.log(`      ⚠️  exec_sql no disponible: ${rpcError.message}`);
        console.log(`      ℹ️  Ejecutar manualmente en Supabase Dashboard`);
        console.log(`      📋 Sentencia para copiar:`);
        console.log(`      ${statement}`);
        console.log('');
      }
      
      // Pequeña pausa
      if (i < statements.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    return { success: true };
    
  } catch (error) {
    console.error(`   ❌ Error ejecutando SQL: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Función principal
async function main() {
  console.log('\n📋 EJECUTANDO SCRIPT...');
  console.log('=====================');
  
  const result = await executeSQLDirectly();
  
  console.log('\n🎯 VERIFICACIÓN');
  console.log('===============');
  
  // Verificar si la tabla existe
  try {
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'student_grades')
      .single();
    
    if (error || !data) {
      console.log('   ❌ Tabla student_grades NO encontrada');
      console.log('   💡 Ejecutar manualmente en Supabase Dashboard:');
      console.log('   1. Ve a https://app.supabase.com/project/srirrwpgswlnuqfgtule');
      console.log('   2. SQL Editor → Pegar contenido de create_student_grades_table.sql');
      console.log('   3. Ejecutar');
    } else {
      console.log('   ✅ Tabla student_grades encontrada');
      
      // Verificar columnas
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type')
        .eq('table_schema', 'public')
        .eq('table_name', 'student_grades')
        .order('ordinal_position');
      
      if (!columnsError && columns && columns.length > 0) {
        console.log(`   📊 Columnas (${columns.length}):`);
        columns.forEach(col => {
          console.log(`      • ${col.column_name} (${col.data_type})`);
        });
      }
    }
  } catch (error) {
    console.log(`   ⚠️  Error verificando tabla: ${error.message}`);
  }
  
  console.log('\n📋 INSTRUCCIONES FINALES:');
  console.log('========================');
  
  if (result.success) {
    console.log('🎉 ¡SCRIPT EJECUTADO!');
    console.log('\n🔧 PRÓXIMOS PASOS:');
    console.log('1. Verificar que la tabla student_grades existe en Supabase');
    console.log('2. Probar la funcionalidad del desafío premium');
    console.log('3. Verificar que las notas se guardan correctamente');
  } else {
    console.log('⚠️  EJECUCIÓN CON ERRORES');
    console.log('\n🔧 ACCIONES REQUERIDAS:');
    console.log('1. Ejecutar manualmente en Supabase Dashboard:');
    console.log('   - Ve a https://app.supabase.com/project/srirrwpgswlnuqfgtule');
    console.log('   - SQL Editor → Pegar contenido de create_student_grades_table.sql');
    console.log('   - Ejecutar');
    console.log('2. Verificar que la tabla se creó correctamente');
  }
  
  console.log('\n📚 DOCUMENTACIÓN:');
  console.log('- Hook useIALabEvaluation: src/hooks/IALab/useIALabEvaluation.js');
  console.log('- Modal de evaluación: src/components/IALab/IALabEvaluationModal.jsx');
  console.log('- Integración DeepSeek API: src/utils/api.js');
  
  // Guardar reporte
  const report = {
    timestamp: new Date().toISOString(),
    sqlFile: SQL_FILE_PATH,
    supabaseUrl: SUPABASE_URL,
    result: result,
    verification: {
      tableExists: result.success ? 'unknown' : 'failed'
    }
  };
  
  const reportPath = path.join(__dirname, 'student-grades-execution-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Reporte guardado en: ${reportPath}`);
  
  process.exit(result.success ? 0 : 1);
}

// Ejecutar
main().catch(error => {
  console.error('\n❌ ERROR CRÍTICO:', error.message);
  console.error(error.stack);
  process.exit(1);
});