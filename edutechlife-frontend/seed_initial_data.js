// Script para poblar datos iniciales en Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://srirrwpgswlnuqfgtule.supabase.co';
const supabaseKey = 'sb_publishable_k08noZw4qI-0oytgCaUAhg_V3cEIkfn';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedInitialData() {
  console.log('🌱 POBLANDO DATOS INICIALES EN SUPABASE');
  console.log('='.repeat(50));
  
  // 1. Crear perfiles de prueba
  console.log('\\n1. 👥 CREANDO PERFILES DE PRUEBA...');
  
  const testProfiles = [
    {
      id: 'test-user-1',
      full_name: 'Carlos López',
      email: 'carlos@edutechlife.com',
      role: 'Mentor',
      avatar_url: null
    },
    {
      id: 'test-user-2', 
      full_name: 'Ana García',
      email: 'ana@edutechlife.com',
      role: 'Estudiante',
      avatar_url: null
    },
    {
      id: 'test-user-3',
      full_name: 'Miguel Torres',
      email: 'miguel@edutechlife.com',
      role: 'Estudiante',
      avatar_url: null
    }
  ];
  
  let profilesCreated = 0;
  for (const profile of testProfiles) {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert(profile, { onConflict: 'id' });
      
      if (error) {
        if (error.code === '42501') {
          console.log(`   ⚠️  Perfil ${profile.full_name}: RLS bloquea inserción`);
        } else {
          console.log(`   ❌ Perfil ${profile.full_name}: ${error.message}`);
        }
      } else {
        console.log(`   ✅ Perfil ${profile.full_name}: Creado/Actualizado`);
        profilesCreated++;
      }
    } catch (err) {
      console.log(`   ❌ Error con perfil ${profile.full_name}: ${err.message}`);
    }
  }
  
  // 2. Crear posts de foro de prueba
  console.log('\\n2. 📝 CREANDO POSTS DE FORO...');
  
  const testPosts = [
    {
      id: 'test-post-1',
      title: 'Cómo optimizar prompts para ChatGPT',
      content: 'He descubierto que estructurar los prompts con contexto claro, instrucciones específicas y formato esperado mejora significativamente los resultados. ¿Alguien más tiene tips?',
      user_id: 'test-user-1',
      upvote_count: 24,
      comment_count: 8,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 días atrás
    },
    {
      id: 'test-post-2',
      title: 'Gemini vs ChatGPT: comparativa práctica',
      content: 'Después de probar ambas plataformas en el módulo 3, encontré que Gemini es mejor para tareas de investigación y análisis, mientras que ChatGPT destaca en creatividad. ¿Cuál prefieren ustedes?',
      user_id: 'test-user-2',
      upvote_count: 18,
      comment_count: 12,
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 día atrás
    },
    {
      id: 'test-post-3',
      title: 'Errores comunes al usar NotebookLM',
      content: 'Muchos estudiantes cometen el error de no proporcionar suficiente contexto al usar NotebookLM. Recuerden: cuanta más información relevante proporcionen, mejores serán los resultados.',
      user_id: 'test-user-3',
      upvote_count: 15,
      comment_count: 5,
      created_at: new Date().toISOString() // Hoy
    }
  ];
  
  let postsCreated = 0;
  for (const post of testPosts) {
    try {
      const { error } = await supabase
        .from('forum_posts')
        .upsert(post, { onConflict: 'id' });
      
      if (error) {
        if (error.code === '42501') {
          console.log(`   ⚠️  Post "${post.title}": RLS bloquea inserción`);
          console.log(`      Necesita política: CREATE POLICY "Inserción anónima para desarrollo" ON forum_posts FOR INSERT TO anon WITH CHECK (true);`);
        } else {
          console.log(`   ❌ Post "${post.title}": ${error.message}`);
        }
      } else {
        console.log(`   ✅ Post "${post.title}": Creado`);
        postsCreated++;
      }
    } catch (err) {
      console.log(`   ❌ Error con post "${post.title}": ${err.message}`);
    }
  }
  
  // 3. Crear progreso de usuario de prueba
  console.log('\\n3. 📊 CREANDO PROGRESO DE USUARIO...');
  
  const testProgress = [
    {
      id: 'test-progress-1',
      user_id: 'test-user-1',
      module_id: 1,
      is_completed: true,
      score: 95,
      completed_lessons: [1, 2, 3, 4, 5],
      updated_at: new Date().toISOString()
    },
    {
      id: 'test-progress-2',
      user_id: 'test-user-2',
      module_id: 2,
      is_completed: true,
      score: 88,
      completed_lessons: [1, 2, 3],
      updated_at: new Date().toISOString()
    }
  ];
  
  let progressCreated = 0;
  for (const progress of testProgress) {
    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert(progress, { onConflict: 'id' });
      
      if (error) {
        console.log(`   ⚠️  Progreso módulo ${progress.module_id}: ${error.message}`);
      } else {
        console.log(`   ✅ Progreso módulo ${progress.module_id}: Creado`);
        progressCreated++;
      }
    } catch (err) {
      console.log(`   ❌ Error con progreso: ${err.message}`);
    }
  }
  
  // 4. Resumen
  console.log('\\n' + '='.repeat(50));
  console.log('📊 RESUMEN DE POBLACIÓN:');
  console.log(`   👥 Perfiles: ${profilesCreated}/${testProfiles.length} creados`);
  console.log(`   📝 Posts: ${postsCreated}/${testPosts.length} creados`);
  console.log(`   📊 Progreso: ${progressCreated}/${testProgress.length} creados`);
  
  if (postsCreated === 0) {
    console.log('\\n⚠️  NOTA IMPORTANTE:');
    console.log('   Los posts no se pudieron crear debido a RLS.');
    console.log('   Para desarrollo, puedes:');
    console.log('   1. Desactivar RLS temporalmente en Supabase Dashboard');
    console.log('   2. Crear política: CREATE POLICY "anon_insert" ON forum_posts FOR INSERT TO anon WITH CHECK (true);');
    console.log('   3. Usar datos simulados (el sistema ya lo hace)');
  }
  
  console.log('\\n🎉 PROCESO DE POBLACIÓN COMPLETADO');
}

seedInitialData();