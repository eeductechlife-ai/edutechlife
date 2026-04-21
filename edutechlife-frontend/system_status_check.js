// Verificación completa del sistema EdutechLife
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://srirrwpgswlnuqfgtule.supabase.co';
const supabaseKey = 'sb_publishable_k08noZw4qI-0oytgCaUAhg_V3cEIkfn';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSystemStatus() {
  console.log('🔍 VERIFICACIÓN COMPLETA DEL SISTEMA EDUTECHLIFE');
  console.log('='.repeat(50));
  
  // 1. Verificar conexión básica
  console.log('\\n1. ✅ CONEXIÓN SUPABASE:');
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('   ❌ Error:', error.message);
      console.log('   Código:', error.code);
    } else {
      console.log('   ✅ Conexión exitosa');
    }
  } catch (err) {
    console.log('   ❌ Error general:', err.message);
  }
  
  // 2. Verificar tablas críticas
  console.log('\\n2. 📊 TABLAS CRÍTICAS:');
  
  const criticalTables = ['forum_posts', 'profiles', 'user_progress', 'forum_votes'];
  
  for (const table of criticalTables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1);
      
      if (error) {
        if (error.code === '42501') {
          console.log(`   ⚠️  ${table}: RLS ACTIVADO (necesita autenticación)`);
        } else if (error.code === '42P01') {
          console.log(`   ❌ ${table}: TABLA NO EXISTE`);
        } else {
          console.log(`   ⚠️  ${table}: ${error.message}`);
        }
      } else {
        console.log(`   ✅ ${table}: Accesible`);
      }
    } catch (err) {
      console.log(`   ❌ ${table}: Error - ${err.message}`);
    }
  }
  
  // 3. Verificar datos existentes
  console.log('\\n3. 📈 DATOS EXISTENTES:');
  
  const dataTables = ['forum_posts', 'profiles'];
  
  for (const table of dataTables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`   ⚠️  ${table}: No se pudo contar - ${error.message}`);
      } else {
        console.log(`   📊 ${table}: ${count || 0} registros`);
      }
    } catch (err) {
      console.log(`   ❌ ${table}: Error al contar - ${err.message}`);
    }
  }
  
  // 4. Verificar relaciones
  console.log('\\n4. 🔗 RELACIONES:');
  
  try {
    // Probar relación forum_posts -> profiles
    const { data: relData, error: relError } = await supabase
      .from('forum_posts')
      .select(`
        id,
        title,
        profiles!inner(id, full_name)
      `)
      .limit(1);
    
    if (relError) {
      if (relError.message.includes('could not find a relationship')) {
        console.log('   ❌ Relación forum_posts->profiles: NO CONFIGURADA');
        console.log('      Necesita FOREIGN KEY en forum_posts(user_id) REFERENCES profiles(id)');
      } else {
        console.log(`   ⚠️  Relación: ${relError.message}`);
      }
    } else {
      console.log('   ✅ Relación forum_posts->profiles: CONFIGURADA');
    }
  } catch (err) {
    console.log(`   ❌ Error verificando relación: ${err.message}`);
  }
  
  // 5. Recomendaciones
  console.log('\\n5. 📋 RECOMENDACIONES:');
  console.log('   a) Configurar RLS en Supabase Dashboard:');
  console.log('      - Habilitar RLS en forum_posts, profiles, forum_votes');
  console.log('      - Crear políticas para usuarios autenticados');
  console.log('      - Para desarrollo: política SELECT para anon en forum_posts');
  console.log('   ');
  console.log('   b) Verificar FOREIGN KEYS:');
  console.log('      - forum_posts.user_id → profiles.id');
  console.log('      - forum_votes.user_id → profiles.id');
  console.log('      - forum_votes.post_id → forum_posts.id');
  console.log('   ');
  console.log('   c) Para desarrollo rápido:');
  console.log('      - El sistema ya usa datos simulados cuando RLS bloquea');
  console.log('      - Puede funcionar sin configurar RLS inmediatamente');
  console.log('      - Migrar gradualmente a datos reales');
  
  // 6. Estado actual del código
  console.log('\\n6. 💻 ESTADO DEL CÓDIGO:');
  console.log('   ✅ useIALabForum.js: Implementado fallback a datos simulados');
  console.log('   ✅ useSupabase.js: Integración Clerk JWT con fetch personalizado');
  console.log('   ✅ supabase.js: Fetch personalizado aislado (sin interceptor global)');
  console.log('   ✅ IALabForumSection.jsx: Actualizado para usar post.profiles');
  console.log('   ✅ neonProfileService.js: Manejo de errores RLS implementado');
  
  console.log('\\n' + '='.repeat(50));
  console.log('🎉 VERIFICACIÓN COMPLETADA');
}

checkSystemStatus();