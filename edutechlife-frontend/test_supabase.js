// Script para probar conexión a Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://srirrwpgswlnuqfgtule.supabase.co';
const supabaseKey = 'sb_publishable_k08noZw4qI-0oytgCaUAhg_V3cEIkfn';

console.log('🔍 Probando conexión a Supabase...');
console.log('URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Probar consulta simple a forum_posts
    console.log('\n📊 Probando tabla forum_posts...');
    const { data: posts, error: postsError } = await supabase
      .from('forum_posts')
      .select('*')
      .limit(2);
    
    if (postsError) {
      console.log('❌ Error en forum_posts:', postsError.message);
    } else {
      console.log('✅ forum_posts accesible');
      console.log('   Posts encontrados:', posts?.length || 0);
    }
    
    // Probar tabla forum_comments
    console.log('\n📊 Probando tabla forum_comments...');
    const { data: comments, error: commentsError } = await supabase
      .from('forum_comments')
      .select('*')
      .limit(2);
    
    if (commentsError) {
      console.log('❌ Error en forum_comments:', commentsError.message);
    } else {
      console.log('✅ forum_comments accesible');
      console.log('   Comentarios encontrados:', comments?.length || 0);
    }
    
    // Probar tabla forum_votes
    console.log('\n📊 Probando tabla forum_votes...');
    const { data: votes, error: votesError } = await supabase
      .from('forum_votes')
      .select('*')
      .limit(2);
    
    if (votesError) {
      console.log('❌ Error en forum_votes:', votesError.message);
    } else {
      console.log('✅ forum_votes accesible');
      console.log('   Votos encontrados:', votes?.length || 0);
    }
    
    // Probar función RPC
    console.log('\n⚡ Probando función RPC has_user_voted...');
    const { data: rpcData, error: rpcError } = await supabase
      .rpc('has_user_voted', { 
        post_id: '00000000-0000-0000-0000-000000000000', 
        user_id: '00000000-0000-0000-0000-000000000000' 
      });
    
    if (rpcError) {
      console.log('⚠️  Función RPC:', rpcError.message);
    } else {
      console.log('✅ Función RPC disponible');
      console.log('   Resultado:', rpcData);
    }
    
    console.log('\n🎉 Prueba completada');
    
  } catch (err) {
    console.log('❌ Error general:', err.message);
  }
}

testConnection();