// Script de prueba final del foro
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://srirrwpgswlnuqfgtule.supabase.co',
  'sb_publishable_k08noZw4qI-0oytgCaUAhg_V3cEIkfn'
);

async function testForumComplete() {
  console.log('🧪 PRUEBA COMPLETA DEL FORO EDUTECHLIFE\n');
  
  // ==================== 1. VERIFICAR ESTRUCTURA ====================
  console.log('1. 🔍 VERIFICANDO ESTRUCTURA DE BASE DE DATOS');
  console.log('='.repeat(50));
  
  const tables = ['forum_posts', 'forum_comments', 'forum_votes', 'profiles'];
  let allTablesExist = true;
  
  for (const table of tables) {
    console.log(`\n📊 ${table}...`);
    
    try {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1);
      
      if (error) {
        console.log(`   ❌ ERROR: ${error.message}`);
        allTablesExist = false;
        
        if (error.message.includes('Could not find the table')) {
          console.log(`   ⚠️  La tabla ${table} NO EXISTE`);
        }
      } else {
        console.log(`   ✅ EXISTE`);
        
        // Contar registros
        const { count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        console.log(`   📈 Registros: ${count || 0}`);
      }
    } catch (err) {
      console.log(`   ❌ EXCEPCIÓN: ${err.message}`);
      allTablesExist = false;
    }
  }
  
  // ==================== 2. VERIFICAR FUNCIONES RPC ====================
  console.log('\n\n2. ⚡ VERIFICANDO FUNCIONES RPC');
  console.log('='.repeat(50));
  
  const functions = [
    { name: 'increment_post_upvote', testParams: { post_id: '00000000-0000-0000-0000-000000000000', user_id: '00000000-0000-0000-0000-000000000000' } },
    { name: 'decrement_post_upvote', testParams: { post_id: '00000000-0000-0000-0000-000000000000', user_id: '00000000-0000-0000-0000-000000000000' } },
    { name: 'has_user_voted', testParams: { post_id: '00000000-0000-0000-0000-000000000000', user_id: '00000000-0000-0000-0000-000000000000' } }
  ];
  
  let allFunctionsExist = true;
  
  for (const func of functions) {
    console.log(`\n📝 ${func.name}...`);
    
    try {
      const { data, error } = await supabase
        .rpc(func.name, func.testParams);
      
      if (error) {
        console.log(`   ❌ ERROR: ${error.message}`);
        allFunctionsExist = false;
        
        if (error.message.includes('Could not find the function')) {
          console.log(`   ⚠️  La función ${func.name} NO EXISTE`);
        }
      } else {
        console.log(`   ✅ DISPONIBLE`);
        console.log(`   📊 Resultado de prueba: ${data}`);
      }
    } catch (err) {
      console.log(`   ❌ EXCEPCIÓN: ${err.message}`);
      allFunctionsExist = false;
    }
  }
  
  // ==================== 3. VERIFICAR DATOS DE EJEMPLO ====================
  console.log('\n\n3. 📦 VERIFICANDO DATOS DE EJEMPLO');
  console.log('='.repeat(50));
  
  try {
    const { data: posts, error: postsError } = await supabase
      .from('forum_posts')
      .select('id, content, upvotes, tags, is_verified')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (postsError) {
      console.log(`❌ Error obteniendo posts: ${postsError.message}`);
    } else {
      console.log(`\n📝 Posts encontrados: ${posts?.length || 0}`);
      
      if (posts && posts.length > 0) {
        posts.forEach((post, index) => {
          console.log(`\n   ${index + 1}. ${post.content.substring(0, 60)}...`);
          console.log(`      👍 Votos: ${post.upvotes} | Tags: ${post.tags?.join(', ') || 'ninguno'} | Verificado: ${post.is_verified ? '✅' : '❌'}`);
        });
      } else {
        console.log('   ⚠️  No hay posts. El script SQL debería haber insertado 5 posts de ejemplo.');
      }
    }
  } catch (err) {
    console.log(`❌ Excepción: ${err.message}`);
  }
  
  // ==================== 4. RESUMEN Y RECOMENDACIONES ====================
  console.log('\n\n4. 📋 RESUMEN FINAL');
  console.log('='.repeat(50));
  
  console.log('\n✅ CORRECCIONES APLICADAS EN CÓDIGO:');
  console.log('   - showInput ahora es siempre true (siempre visible)');
  console.log('   - Foro contraído muestra 5 posts (antes 1)');
  console.log('   - forumService.js actualizado para ser más robusto');
  console.log('   - Manejo de errores mejorado para perfiles faltantes');
  
  console.log('\n🔧 ESTADO DE LA BASE DE DATOS:');
  console.log(`   - Tablas existentes: ${allTablesExist ? '✅ TODAS' : '❌ FALTAN'}`);
  console.log(`   - Funciones RPC: ${allFunctionsExist ? '✅ TODAS' : '❌ FALTAN'}`);
  
  console.log('\n🚀 SIGUIENTES PASOS:');
  
  if (!allTablesExist || !allFunctionsExist) {
    console.log('   1. ❗ EJECUTA LOS SCRIPTS SQL EN SUPABASE:');
    console.log('      a) create_profiles.sql - Crea/actualiza tabla profiles');
    console.log('      b) supabase_clean_install.sql - Crea foro completo');
    console.log('   2. 🔄 Reinicia la aplicación');
    console.log('   3. 🔐 Asegúrate de estar logueado');
  } else {
    console.log('   1. ✅ La base de datos está lista');
    console.log('   2. 🌐 Ve a http://localhost:5175/');
    console.log('   3. 🔐 Inicia sesión (si no estás logueado)');
    console.log('   4. 🧠 Navega al IALab → Muro de Insights');
    console.log('   5. ✍️  El cuadro de escritura debería estar visible SIEMPRE');
    console.log('   6. 📝 Prueba crear un post (10-500 caracteres)');
    console.log('   7. 👍 Prueba votar posts');
    console.log('   8. 💬 Prueba comentar');
  }
  
  console.log('\n🎯 PARA PROBAR RÁPIDAMENTE:');
  console.log('   - Foro contraído: Muestra 5 posts + input visible');
  console.log('   - Click "Explorar toda la conversación" para expandir');
  console.log('   - Foro expandido: Muestra 20 posts + estadísticas');
  
  console.log('\n🔍 SI HAY PROBLEMAS:');
  console.log('   - Verifica la consola del navegador (F12 → Console)');
  console.log('   - Revisa errores de red en F12 → Network');
  console.log('   - Verifica que Realtime esté habilitado en Supabase');
}

testForumComplete();