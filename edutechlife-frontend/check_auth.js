// Script para verificar autenticación y perfiles
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://srirrwpgswlnuqfgtule.supabase.co',
  'sb_publishable_k08noZw4qI-0oytgCaUAhg_V3cEIkfn'
);

async function checkAuthAndProfiles() {
  console.log('🔐 Verificando autenticación y perfiles...\n');
  
  // 1. Verificar usuarios en auth.users
  console.log('👥 Usuarios en auth.users...');
  try {
    // Nota: No podemos acceder directamente a auth.users desde cliente
    // Verificamos indirectamente a través de profiles
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, display_name, avatar_url, role, created_at')
      .limit(5);
    
    if (error) {
      console.log('❌ Error obteniendo perfiles:', error.message);
    } else {
      console.log(`✅ Perfiles encontrados: ${profiles?.length || 0}`);
      if (profiles && profiles.length > 0) {
        profiles.forEach((profile, i) => {
          console.log(`   ${i+1}. ${profile.display_name} (${profile.role}) - ID: ${profile.id.substring(0, 8)}...`);
        });
      }
    }
  } catch (err) {
    console.log('❌ Excepción:', err.message);
  }
  
  console.log('\n📊 Verificando tablas del foro...');
  
  // 2. Verificar posts
  const { data: posts, error: postsError } = await supabase
    .from('forum_posts')
    .select('id, content, upvotes, created_at')
    .limit(3);
  
  if (postsError) {
    console.log('❌ Error en forum_posts:', postsError.message);
  } else {
    console.log(`✅ Posts en foro: ${posts?.length || 0}`);
  }
  
  // 3. Verificar funciones RPC
  console.log('\n⚡ Probando funciones RPC...');
  
  try {
    // Probar con IDs dummy
    const { data: rpcResult, error: rpcError } = await supabase
      .rpc('has_user_voted', { 
        post_id: '00000000-0000-0000-0000-000000000000', 
        user_id: '00000000-0000-0000-0000-000000000000' 
      });
    
    if (rpcError) {
      console.log('❌ Función RPC error:', rpcError.message);
    } else {
      console.log('✅ Función RPC disponible, resultado:', rpcResult);
    }
  } catch (err) {
    console.log('❌ Excepción RPC:', err.message);
  }
  
  console.log('\n🎯 RECOMENDACIONES:');
  
  if (!profiles || profiles.length === 0) {
    console.log('1. ⚠️  No hay perfiles. Necesitas crear al menos un usuario.');
    console.log('   - Ve a la aplicación y regístrate');
    console.log('   - O usa el sistema de autenticación automática si existe');
  } else {
    console.log('1. ✅ Hay perfiles. El foro debería funcionar para usuarios autenticados.');
  }
  
  if (!posts || posts.length === 0) {
    console.log('2. ⚠️  No hay posts. El script SQL debería haber insertado posts de ejemplo.');
    console.log('   - Ejecuta el script supabase_fix_missing.sql completo');
  } else {
    console.log('2. ✅ Hay posts. El foro mostrará contenido.');
  }
  
  console.log('\n🔧 Para probar el foro:');
  console.log('   - Asegúrate de estar logueado en la aplicación');
  console.log('   - Ve a http://localhost:5175/');
  console.log('   - Navega al IALab (Muro de Insights)');
  console.log('   - El cuadro de escritura ahora debería estar siempre visible');
}

checkAuthAndProfiles();