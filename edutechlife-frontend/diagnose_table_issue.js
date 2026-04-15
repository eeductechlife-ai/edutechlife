// Diagnóstico específico de problemas con tabla profiles
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://srirrwpgswlnuqfgtule.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyaXJyd3Bnc3dsbnVxZmd0dWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNTE5MjcsImV4cCI6MjA5MDkyNzkyN30.ElxGbhsfncV2m3OVr3P5X3HqAfwGMbAOGBEGzKqRV0A';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function diagnoseTableIssue() {
  console.log('🔍 DIAGNÓSTICO DE PROBLEMAS CON TABLA PROFILES');
  console.log('==============================================\n');
  
  try {
    // 1. Intentar consulta simple sin columnas específicas
    console.log('1. Consulta básica para verificar acceso...');
    const { data: simpleData, error: simpleError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (simpleError) {
      console.log('❌ Error en consulta básica:', simpleError.message);
      console.log('💡 La tabla puede no existir o tener problemas de permisos');
      return;
    }
    console.log('✅ Consulta básica exitosa');
    
    // 2. Intentar insertar con solo columnas críticas
    console.log('\n2. Probando inserción con columnas mínimas...');
    
    const testDataBasic = {
      id: 'diagnostic-test-' + Date.now(),
      email: 'diagnostic@test.com',
      full_name: 'Diagnóstico Test'
    };
    
    const { data: insertBasic, error: insertBasicError } = await supabase
      .from('profiles')
      .insert([testDataBasic])
      .select('id, email, full_name');
    
    if (insertBasicError) {
      console.log('❌ Error en inserción básica:', insertBasicError.message);
      
      // Análisis del error
      if (insertBasicError.message.includes('column') && insertBasicError.message.includes('does not exist')) {
        console.log('\n🔍 ANÁLISIS DE ERROR:');
        console.log('El mensaje sugiere que alguna columna no existe');
        console.log('Columnas intentadas: id, email, full_name');
        console.log('\n💡 POSIBLES SOLUCIONES:');
        console.log('1. Verificar que el script SQL se ejecutó completamente');
        console.log('2. Revisar logs de ejecución en Supabase SQL Editor');
        console.log('3. Ejecutar este comando en Supabase SQL Editor:');
        console.log(`
          SELECT column_name, data_type, is_nullable
          FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'profiles'
          ORDER BY ordinal_position;
        `);
      }
    } else {
      console.log('✅ Inserción básica exitosa:', insertBasic[0]);
      
      // Limpiar
      await supabase.from('profiles').delete().eq('id', testDataBasic.id);
      console.log('✅ Registro de diagnóstico eliminado');
    }
    
    // 3. Verificar estructura actual con query SQL (si fuera posible)
    console.log('\n3. Recomendaciones para diagnóstico manual:');
    console.log('===========================================');
    console.log('\nA. Ejecutar en Supabase SQL Editor:');
    console.log(`
      -- Verificar columnas existentes
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'profiles'
      ORDER BY ordinal_position;
    `);
    
    console.log('\nB. Ejecutar en Supabase SQL Editor:');
    console.log(`
      -- Verificar triggers
      SELECT tgname, tgrelid::regclass, tgfoid::regproc
      FROM pg_trigger 
      WHERE tgname = 'on_auth_user_created';
    `);
    
    console.log('\nC. Ejecutar en Supabase SQL Editor:');
    console.log(`
      -- Verificar función handle_new_user
      SELECT proname, prosrc
      FROM pg_proc 
      WHERE proname = 'handle_new_user';
    `);
    
    console.log('\nD. Si faltan columnas, ejecutar esto:');
    console.log(`
      -- Agregar columnas críticas manualmente
      ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;
      ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
      ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
      ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student';
    `);
    
    console.log('\n🎯 ACCIÓN INMEDIATA REQUERIDA:');
    console.log('==============================');
    console.log('1. Ve a Supabase SQL Editor');
    console.log('2. Ejecuta la consulta A (ver columnas)');
    console.log('3. Comparte los resultados para diagnóstico');
    
  } catch (error) {
    console.error('❌ Error en diagnóstico:', error);
  }
}

diagnoseTableIssue().then(() => {
  console.log('\n📋 SIGUIENTE PASO:');
  console.log('Ejecuta las consultas SQL recomendadas y comparte los resultados.');
});