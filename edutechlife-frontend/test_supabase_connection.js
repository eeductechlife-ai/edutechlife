// Script para testear conexión con Supabase después de ejecutar fix
import { createClient } from '@supabase/supabase-js';

// Configuración desde .env
const supabaseUrl = 'https://srirrwpgswlnuqfgtule.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyaXJyd3Bnc3dsbnVxZmd0dWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNTE5MjcsImV4cCI6MjA5MDkyNzkyN30.ElxGbhsfncV2m3OVr3P5X3HqAfwGMbAOGBEGzKqRV0A';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabaseConnection() {
  console.log('🔍 Testeando conexión con Supabase...');
  
  try {
    // 1. Test de conexión básica
    console.log('1. Test de conexión básica...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.log('❌ Error de autenticación:', authError.message);
    } else {
      console.log('✅ Conexión básica OK');
    }
    
    // 2. Verificar estructura de tabla profiles
    console.log('\n2. Verificando estructura de tabla profiles...');
    const { data: tableInfo, error: tableError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.log('❌ Error al acceder a tabla profiles:', tableError.message);
      console.log('💡 Posible solución: Ejecutar fix_profiles_structure.sql en Supabase');
    } else {
      console.log('✅ Tabla profiles accesible');
      
      // Mostrar columnas del primer registro (si existe)
      if (tableInfo && tableInfo.length > 0) {
        console.log('📊 Columnas encontradas:', Object.keys(tableInfo[0]));
      }
    }
    
    // 3. Verificar trigger handle_new_user
    console.log('\n3. Verificando función handle_new_user...');
    // Nota: No podemos verificar funciones directamente desde JS
    // Pero podemos verificar si se crean perfiles automáticamente
    
    // 4. Contar perfiles existentes
    console.log('\n4. Contando perfiles existentes...');
    const { count, error: countError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.log('❌ Error contando perfiles:', countError.message);
    } else {
      console.log(`📊 Total de perfiles en la tabla: ${count}`);
    }
    
    // 5. Verificar columnas específicas
    console.log('\n5. Verificando columnas específicas...');
    const expectedColumns = ['id', 'email', 'full_name', 'phone', 'role'];
    
    if (tableInfo && tableInfo.length > 0) {
      const sampleRecord = tableInfo[0];
      const missingColumns = expectedColumns.filter(col => !(col in sampleRecord));
      
      if (missingColumns.length > 0) {
        console.log(`❌ Columnas faltantes: ${missingColumns.join(', ')}`);
        console.log('💡 Ejecutar fix_profiles_structure.sql para agregar columnas faltantes');
      } else {
        console.log('✅ Todas las columnas requeridas están presentes');
      }
    }
    
    console.log('\n🎯 RESUMEN DEL TEST:');
    console.log('====================');
    console.log('✅ Conexión Supabase: OK');
    console.log(tableError ? '❌ Tabla profiles: ERROR' : '✅ Tabla profiles: ACCESIBLE');
    console.log(countError ? '❌ Conteo perfiles: ERROR' : `✅ Conteo perfiles: ${count} registros`);
    
    if (tableInfo && tableInfo.length > 0) {
      const sampleRecord = tableInfo[0];
      const missingColumns = expectedColumns.filter(col => !(col in sampleRecord));
      console.log(missingColumns.length > 0 ? `❌ Columnas faltantes: ${missingColumns.length}` : '✅ Columnas: COMPLETAS');
    }
    
  } catch (error) {
    console.error('❌ Error crítico en test:', error);
  }
}

// Ejecutar test
testSupabaseConnection().then(() => {
  console.log('\n🚀 Test completado. Revisa los resultados arriba.');
  console.log('\n📋 RECOMENDACIONES:');
  console.log('1. Si hay errores, ejecuta fix_profiles_structure.sql en Supabase');
  console.log('2. Después de ejecutar el SQL, vuelve a correr este test');
  console.log('3. Si todo está OK, procede con testing manual del flujo');
});