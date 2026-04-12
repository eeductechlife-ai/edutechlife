// Verificación final después de ejecutar supabase_simple_fix.sql
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://srirrwpgswlnuqfgtule.supabase.co',
  'sb_publishable_k08noZw4qI-0oytgCaUAhg_V3cEIkfn'
);

async function finalVerification() {
  console.log('🔍 VERIFICACIÓN FINAL DEL FORO EDUTECHLIFE\n');
  console.log('='.repeat(60));
  
  let allGood = true;
  const results = [];
  
  // ==================== 1. VERIFICAR ESTRUCTURA COMPLETA ====================
  console.log('\n1. 🏗️  VERIFICANDO ESTRUCTURA COMPLETA');
  console.log('-'.repeat(40));
  
  // Verificar forum_posts
  const postsCheck = await checkTable('forum_posts', ['id', 'content', 'upvotes', 'tags', 'is_verified', 'created_at', 'updated_at']);
  results.push({ table: 'forum_posts', ok: postsCheck.ok, message: postsCheck.message });
  if (!postsCheck.ok) allGood = false;
  
  // Verificar forum_comments
  const commentsCheck = await checkTable('forum_comments', ['id', 'post_id', 'user_id', 'content', 'created_at']);
  results.push({ table: 'forum_comments', ok: commentsCheck.ok, message: commentsCheck.message });
  if (!commentsCheck.ok) allGood = false;
  
  // Verificar forum_votes
  const votesCheck = await checkTable('forum_votes', ['id', 'post_id', 'user_id', 'created_at']);
  results.push({ table: 'forum_votes', ok: votesCheck.ok, message: votesCheck.message });
  if (!votesCheck.ok) allGood = false;
  
  // ==================== 2. VERIFICAR FUNCIONES RPC ====================
  console.log('\n2. ⚡ VERIFICANDO FUNCIONES RPC');
  console.log('-'.repeat(40));
  
  const functions = ['increment_post_upvote', 'decrement_post_upvote', 'has_user_voted'];
  for (const funcName of functions) {
    const funcCheck = await checkRPCFunction(funcName);
    results.push({ table: `RPC:${funcName}`, ok: funcCheck.ok, message: funcCheck.message });
    if (!funcCheck.ok) allGood = false;
  }
  
  // ==================== 3. VERIFICAR DATOS DE EJEMPLO ====================
  console.log('\n3. 📦 VERIFICANDO DATOS DE EJEMPLO');
  console.log('-'.repeat(40));
  
  const { data: posts, error: postsError } = await supabase
    .from('forum_posts')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (postsError) {
    console.log(`❌ Error obteniendo posts: ${postsError.message}`);
    results.push({ table: 'datos_ejemplo', ok: false, message: `Error: ${postsError.message}` });
    allGood = false;
  } else {
    console.log(`📝 Posts encontrados: ${posts?.length || 0}`);
    
    if (posts && posts.length > 0) {
      console.log('✅ Posts de ejemplo insertados correctamente');
      posts.slice(0, 3).forEach((post, i) => {
        console.log(`   ${i+1}. ${post.content.substring(0, 50)}...`);
        console.log(`      👍 ${post.upvotes} votos | ${post.tags?.length || 0} tags`);
      });
      results.push({ table: 'datos_ejemplo', ok: true, message: `${posts.length} posts insertados` });
    } else {
      console.log('⚠️  No hay posts. Verifica que haya al menos un usuario en auth.users');
      results.push({ table: 'datos_ejemplo', ok: false, message: 'No hay posts (¿usuarios registrados?)' });
      allGood = false;
    }
  }
  
  // ==================== 4. RESUMEN FINAL ====================
  console.log('\n4. 📋 RESUMEN FINAL');
  console.log('-'.repeat(40));
  
  console.log('\n📊 RESULTADOS:');
  results.forEach(result => {
    const icon = result.ok ? '✅' : '❌';
    console.log(`${icon} ${result.table}: ${result.message}`);
  });
  
  console.log('\n🎯 ESTADO GENERAL:', allGood ? '✅ LISTO PARA USAR' : '❌ REQUIERE AJUSTES');
  
  if (allGood) {
    console.log('\n🚀 ¡EL FORO ESTÁ LISTO!');
    console.log('\n🔧 PARA PROBAR:');
    console.log('   1. Ve a http://localhost:5175/');
    console.log('   2. Inicia sesión (si no estás logueado)');
    console.log('   3. Navega al IALab → Muro de Insights');
    console.log('   4. El cuadro de escritura debería estar SIEMPRE visible');
    console.log('   5. Deberías ver 5 posts de ejemplo');
    console.log('   6. Prueba crear un post, votar y comentar');
  } else {
    console.log('\n🔧 PROBLEMAS DETECTADOS:');
    console.log('   1. Ejecuta supabase_simple_fix.sql en Supabase SQL Editor');
    console.log('   2. Verifica que haya al menos un usuario registrado');
    console.log('   3. Revisa la consola de Supabase SQL Editor por errores');
    console.log('   4. Ejecuta esta verificación de nuevo');
  }
  
  console.log('\n🔍 VERIFICACIÓN ADICIONAL:');
  console.log('   - Realtime habilitado: Database → Replication');
  console.log('   - Usuario autenticado necesario para interactuar');
  console.log('   - Posts requieren 10-500 caracteres');
  console.log('   - Máximo 3 tags por post');
}

// Función auxiliar para verificar tablas
async function checkTable(tableName, expectedColumns) {
  try {
    // Probar con todas las columnas esperadas
    const columnStr = expectedColumns.join(', ');
    const { error } = await supabase
      .from(tableName)
      .select(columnStr)
      .limit(1);
    
    if (error) {
      return { 
        ok: false, 
        message: `Error: ${error.message}` 
      };
    }
    
    // Contar registros
    const { count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
    
    return { 
      ok: true, 
      message: `OK (${count || 0} registros)` 
    };
    
  } catch (err) {
    return { 
      ok: false, 
      message: `Excepción: ${err.message}` 
    };
  }
}

// Función auxiliar para verificar funciones RPC
async function checkRPCFunction(funcName) {
  try {
    // Probar con parámetros dummy
    const { error } = await supabase
      .rpc(funcName, { 
        post_id: '00000000-0000-0000-0000-000000000000', 
        user_id: '00000000-0000-0000-0000-000000000000' 
      });
    
    if (error) {
      if (error.message.includes('invalid input syntax')) {
        // Esto es OK - la función existe pero los parámetros son inválidos
        return { ok: true, message: 'OK (parámetros inválidos esperados)' };
      }
      return { ok: false, message: `Error: ${error.message}` };
    }
    
    return { ok: true, message: 'OK' };
    
  } catch (err) {
    return { ok: false, message: `Excepción: ${err.message}` };
  }
}

finalVerification();