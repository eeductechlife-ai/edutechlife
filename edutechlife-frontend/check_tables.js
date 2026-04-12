// Script para verificar tablas en Supabase
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://srirrwpgswlnuqfgtule.supabase.co',
  'sb_publishable_k08noZw4qI-0oytgCaUAhg_V3cEIkfn'
);

async function checkTables() {
  console.log('🔍 Verificando tablas del foro...\n');
  
  const tables = [
    { name: 'forum_posts', desc: 'Posts principales' },
    { name: 'forum_comments', desc: 'Comentarios' },
    { name: 'forum_votes', desc: 'Votos' }
  ];
  
  for (const table of tables) {
    console.log(`📊 ${table.desc} (${table.name})...`);
    
    try {
      const { data, error } = await supabase
        .from(table.name)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`   ❌ ERROR: ${error.message}`);
        
        // Intentar crear la tabla si no existe
        if (error.message.includes('Could not find the table')) {
          console.log(`   ⚠️  La tabla ${table.name} no existe.`);
        }
      } else {
        console.log(`   ✅ EXISTE (${data?.length || 0} registros)`);
      }
    } catch (err) {
      console.log(`   ❌ EXCEPCIÓN: ${err.message}`);
    }
    
    console.log('');
  }
  
  // Probar funciones RPC
  console.log('⚡ Probando funciones RPC...\n');
  
  const functions = [
    { name: 'increment_post_upvote', params: { post_id: '00000000-0000-0000-0000-000000000000', user_id: '00000000-0000-0000-0000-000000000000' } },
    { name: 'decrement_post_upvote', params: { post_id: '00000000-0000-0000-0000-000000000000', user_id: '00000000-0000-0000-0000-000000000000' } },
    { name: 'has_user_voted', params: { post_id: '00000000-0000-0000-0000-000000000000', user_id: '00000000-0000-0000-0000-000000000000' } }
  ];
  
  for (const func of functions) {
    console.log(`📝 ${func.name}...`);
    
    try {
      const { data, error } = await supabase
        .rpc(func.name, func.params);
      
      if (error) {
        console.log(`   ❌ ERROR: ${error.message}`);
        
        if (error.message.includes('Could not find the function')) {
          console.log(`   ⚠️  La función ${func.name} no existe.`);
        }
      } else {
        console.log(`   ✅ DISPONIBLE (resultado: ${data})`);
      }
    } catch (err) {
      console.log(`   ❌ EXCEPCIÓN: ${err.message}`);
    }
    
    console.log('');
  }
  
  console.log('🎉 Verificación completada');
}

checkTables();