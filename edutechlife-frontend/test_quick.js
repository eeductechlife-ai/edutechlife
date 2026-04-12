// Prueba rápida de conexión
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://srirrwpgswlnuqfgtule.supabase.co',
  'sb_publishable_k08noZw4qI-0oytgCaUAhg_V3cEIkfn'
);

async function quickTest() {
  console.log('⚡ PRUEBA RÁPIDA DEL FORO\n');
  
  // 1. Probar conexión básica
  console.log('1. 🔌 Probando conexión a Supabase...');
  try {
    const { data, error } = await supabase
      .from('forum_posts')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log(`   ❌ Error: ${error.message}`);
    } else {
      console.log(`   ✅ Conexión exitosa`);
    }
  } catch (err) {
    console.log(`   ❌ Excepción: ${err.message}`);
  }
  
  // 2. Verificar columnas de forum_posts
  console.log('\n2. 📋 Verificando columnas de forum_posts...');
  try {
    const { data, error } = await supabase
      .from('forum_posts')
      .select('id, content, upvotes, tags, created_at')
      .limit(1);
    
    if (error) {
      console.log(`   ❌ Error: ${error.message}`);
      
      // Probar con columnas mínimas
      const { data: simpleData, error: simpleError } = await supabase
        .from('forum_posts')
        .select('id')
        .limit(1);
      
      if (simpleError) {
        console.log(`   ❌ Error incluso con columna id: ${simpleError.message}`);
      } else {
        console.log(`   ✅ Tabla existe pero faltan columnas`);
      }
    } else {
      console.log(`   ✅ Todas las columnas existen`);
    }
  } catch (err) {
    console.log(`   ❌ Excepción: ${err.message}`);
  }
  
  // 3. Probar función RPC más simple
  console.log('\n3. ⚡ Probando función RPC simple...');
  try {
    // Primero crear un post de prueba si no hay
    const { data: posts } = await supabase
      .from('forum_posts')
      .select('id')
      .limit(1);
    
    if (posts && posts.length > 0) {
      const postId = posts[0].id;
      const { data: rpcResult, error: rpcError } = await supabase
        .rpc('has_user_voted', { 
          post_id: postId, 
          user_id: '00000000-0000-0000-0000-000000000000' 
        });
      
      if (rpcError) {
        console.log(`   ❌ Error RPC: ${rpcError.message}`);
      } else {
        console.log(`   ✅ Función RPC funciona, resultado: ${rpcResult}`);
      }
    } else {
      console.log(`   ⚠️  No hay posts para probar RPC`);
    }
  } catch (err) {
    console.log(`   ❌ Excepción RPC: ${err.message}`);
  }
  
  console.log('\n🎯 DIAGNÓSTICO:');
  console.log('Si ves errores de "column does not exist", ejecuta:');
  console.log('1. supabase_simple_fix.sql en Supabase SQL Editor');
  console.log('2. Luego prueba de nuevo');
}

quickTest();