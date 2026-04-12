// Script para inspeccionar estructura de tablas
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://srirrwpgswlnuqfgtule.supabase.co',
  'sb_publishable_k08noZw4qI-0oytgCaUAhg_V3cEIkfn'
);

async function checkTableStructure() {
  console.log('🔍 Inspeccionando estructura de tablas...\n');
  
  // 1. Verificar si podemos obtener información del schema
  console.log('📋 Intentando obtener información del schema...');
  
  try {
    // Método 1: Intentar obtener información de columnas
    const { data: columnsData, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: 'profiles' });
    
    if (!columnsError && columnsData) {
      console.log('✅ Columnas de profiles:');
      columnsData.forEach(col => {
        console.log(`   - ${col.column_name} (${col.data_type})`);
      });
    } else {
      console.log('⚠️  No se pudo obtener columnas via RPC:', columnsError?.message);
    }
  } catch (err) {
    console.log('❌ Error en RPC:', err.message);
  }
  
  console.log('\n🔧 Probando consultas directas...');
  
  // 2. Probar diferentes combinaciones de columnas
  const columnTests = [
    ['id', 'full_name', 'avatar_url'],
    ['id', 'username', 'avatar_url'],
    ['id', 'name', 'avatar_url'],
    ['id', 'display_name', 'avatar_url'],
    ['id', 'email'],
    ['*']  // Todas las columnas
  ];
  
  for (const columns of columnTests) {
    const columnsStr = columns.join(', ');
    console.log(`\n🔎 Probando: SELECT ${columnsStr} FROM profiles...`);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(columnsStr)
        .limit(1);
      
      if (error) {
        console.log(`   ❌ Error: ${error.message}`);
        
        // Analizar el error para entender qué columna falta
        if (error.message.includes('display_name')) {
          console.log('   💡 La columna display_name no existe en profiles');
        }
        if (error.message.includes('avatar_url')) {
          console.log('   💡 La columna avatar_url no existe en profiles');
        }
        if (error.message.includes('role')) {
          console.log('   💡 La columna role no existe en profiles');
        }
      } else {
        console.log(`   ✅ Consulta exitosa`);
        if (data && data.length > 0) {
          console.log('   📊 Datos del primer registro:');
          const first = data[0];
          Object.keys(first).forEach(key => {
            console.log(`      ${key}: ${first[key]}`);
          });
          
          // Si encontramos la estructura, salir del loop
          console.log('\n🎯 ESTRUCTURA ENCONTRADA!');
          console.log('Columnas disponibles:', Object.keys(first));
          return;
        } else {
          console.log('   📭 Tabla vacía');
        }
      }
    } catch (err) {
      console.log(`   ❌ Excepción: ${err.message}`);
    }
  }
  
  console.log('\n⚠️  No se pudo determinar la estructura de profiles.');
  console.log('💡 Posibles soluciones:');
  console.log('   1. Verifica en Supabase Dashboard → Table Editor');
  console.log('   2. La tabla profiles puede tener otro nombre');
  console.log('   3. Ejecuta el script SQL de instalación limpia');
  console.log('   4. Crea manualmente la tabla con:');
  console.log('      CREATE TABLE profiles (');
  console.log('        id UUID PRIMARY KEY REFERENCES auth.users,');
  console.log('        display_name TEXT,');
  console.log('        avatar_url TEXT,');
  console.log('        role TEXT DEFAULT \'user\'');
  console.log('      );');
}

checkTableStructure();