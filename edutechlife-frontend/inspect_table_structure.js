// Inspeccionar estructura real de las tablas
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://srirrwpgswlnuqfgtule.supabase.co';
const supabaseKey = 'sb_publishable_k08noZw4qI-0oytgCaUAhg_V3cEIkfn';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectTables() {
  console.log('🔍 INSPECCIÓN DE ESTRUCTURA DE TABLAS');
  console.log('='.repeat(50));
  
  const tables = ['forum_posts', 'profiles', 'user_progress', 'forum_votes'];
  
  for (const table of tables) {
    console.log(`\\n📊 TABLA: ${table.toUpperCase()}`);
    console.log('-'.repeat(30));
    
    try {
      // Intentar obtener una fila para ver columnas
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`   ❌ Error: ${error.message}`);
        console.log(`   Código: ${error.code}`);
        
        // Si es error de RLS, intentar con count
        if (error.code === '42501') {
          const { count, error: countError } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });
          
          if (countError) {
            console.log(`   ⚠️  También error al contar: ${countError.message}`);
          } else {
            console.log(`   📈 Tabla existe, RLS activado, ${count || 0} registros`);
          }
        }
      } else if (data && data.length > 0) {
        const sampleRow = data[0];
        console.log(`   ✅ Tabla accesible, ${Object.keys(sampleRow).length} columnas:`);
        
        // Mostrar columnas y tipos de datos (aproximado)
        Object.keys(sampleRow).forEach((col, index) => {
          const value = sampleRow[col];
          const type = typeof value;
          const preview = value !== null && value !== undefined 
            ? (type === 'string' ? `"${value.toString().substring(0, 30)}${value.toString().length > 30 ? '...' : ''}"` : value)
            : 'null';
          
          console.log(`      ${index + 1}. ${col}: ${type} = ${preview}`);
        });
      } else {
        console.log(`   📭 Tabla vacía o sin acceso`);
        
        // Intentar insertar una fila de prueba para inferir estructura
        console.log(`   🔍 Intentando inferir estructura...`);
        
        const testData = {
          test_field: 'test_value',
          created_at: new Date().toISOString()
        };
        
        // Solo para forum_posts intentaremos esto
        if (table === 'forum_posts') {
          const { error: insertError } = await supabase
            .from(table)
            .insert(testData);
          
          if (insertError) {
            // El error puede darnos pistas sobre las columnas requeridas
            console.log(`   💡 Error de inserción: ${insertError.message}`);
            if (insertError.message.includes('column')) {
              const match = insertError.message.match(/column "([^"]+)"/);
              if (match) {
                console.log(`   💡 Columna requerida: ${match[1]}`);
              }
            }
          }
        }
      }
    } catch (err) {
      console.log(`   💥 Error general: ${err.message}`);
    }
  }
  
  console.log('\\n' + '='.repeat(50));
  console.log('💡 RECOMENDACIONES:');
  console.log('   1. Para desarrollo rápido: usar datos simulados (ya implementado)');
  console.log('   2. Para producción: configurar RLS y estructura correcta en Supabase');
  console.log('   3. Verificar SQL de creación de tablas en scripts/');
}

inspectTables();