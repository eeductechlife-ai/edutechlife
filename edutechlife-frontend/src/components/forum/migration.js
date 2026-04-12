/**
 * MIGRACIÓN DE DATOS - Posts hardcodeados a Supabase
 * 
 * Este script migra los posts hardcodeados del Muro de Insights
 * a la base de datos Supabase para mantener consistencia.
 */

import { supabase } from '../../lib/supabase';
import { forumService } from '../../lib/forumService';

/**
 * Posts hardcodeados originales del IALab.jsx (líneas 2216-2387)
 */
const HARDCODED_POSTS = [
  {
    username: 'María Solano',
    display_name: 'María Solano',
    content: 'Actúa como un arquitecto de sistemas educativos. Diseña un framework de evaluación que combine métricas cuantitativas, análisis cualitativo y retroalimentación en tiempo real.',
    tags: ['educación', 'evaluación', 'framework'],
    upvotes: 24,
    is_verified: true,
    created_at_offset: '2 hours',
    user_level: 'Prompt Master Nivel 3',
    comments: [
      { username: 'Carlos M.', content: 'Excelente framework, lo he aplicado en mi institución con resultados sorprendentes.' },
      { username: 'Ana L.', content: '¿Podrías compartir ejemplos de métricas cuantitativas específicas?' }
    ]
  },
  {
    username: 'Andrés Cortés',
    display_name: 'Andrés Cortés',
    content: 'Analiza dataset de feedback: categoriza en críticas, bugs, sugerencias, elogios. Prioriza por impacto UX, esfuerzo, roadmap.',
    tags: ['IA', 'análisis', 'feedback'],
    upvotes: 17,
    is_verified: false,
    created_at_offset: '5 hours',
    user_level: 'Arquitecto de IA',
    comments: [
      { username: 'Laura G.', content: 'Muy útil para equipos de producto. ¿Tienes algún template para el análisis?' }
    ]
  },
  {
    username: 'Valeria Ríos',
    display_name: 'Valeria Ríos',
    content: 'Mentor pensamiento crítico: 3 pasos para identificar sesgos, formular preguntas desafiantes, proponer alternativas.',
    tags: ['pensamiento crítico', 'mentoría', 'innovación'],
    upvotes: 31,
    is_verified: true,
    created_at_offset: '1 day',
    user_level: 'Innovación',
    comments: [
      { username: 'Pedro S.', content: 'Los 3 pasos son clave para desarrollar pensamiento crítico en estudiantes.' },
      { username: 'Marta R.', content: '¿Cómo aplicas esto en entornos corporativos?' },
      { username: 'Valeria Ríos', content: 'En corporaciones, adapto los pasos a sesiones de brainstorming y análisis de decisiones estratégicas.' }
    ]
  }
];

/**
 * Obtiene un usuario existente para asignar los posts
 * Si no existe, usa el usuario actual o crea uno dummy
 */
const getMigrationUser = async () => {
  try {
    // Intentar obtener el usuario actual
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Verificar si existe en profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        return { id: user.id, ...profile };
      }
    }
    
    // Si no hay usuario, buscar cualquier usuario existente
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (profiles && profiles.length > 0) {
      return profiles[0];
    }
    
    console.warn('No se encontraron usuarios para la migración');
    return null;
    
  } catch (error) {
    console.error('Error obteniendo usuario para migración:', error);
    return null;
  }
};

/**
 * Crea perfiles ficticios para los posts hardcodeados
 */
const createMockProfiles = async () => {
  const mockProfiles = [
    {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'maria.solano@edutechlife.com',
      display_name: 'María Solano',
      avatar_url: null,
      role: 'educator'
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      email: 'andres.cortes@edutechlife.com',
      display_name: 'Andrés Cortés',
      avatar_url: null,
      role: 'ai_architect'
    },
    {
      id: '00000000-0000-0000-0000-000000000003',
      email: 'valeria.rios@edutechlife.com',
      display_name: 'Valeria Ríos',
      avatar_url: null,
      role: 'innovation_lead'
    }
  ];
  
  return mockProfiles;
};

/**
 * Migra un post hardcodeado a Supabase
 */
const migratePost = async (postData, user) => {
  try {
    // Calcular fecha de creación
    const created_at = new Date();
    created_at.setHours(created_at.getHours() - parseInt(postData.created_at_offset));
    
    // Crear el post en esquema public
    const { data: post, error: postError } = await supabase
      .from('forum_posts')
      .insert({
        user_id: user.id,
        content: postData.content,
        tags: postData.tags,
        upvotes: postData.upvotes,
        is_verified: postData.is_verified,
        created_at: created_at.toISOString(),
        updated_at: created_at.toISOString()
      })
      .select()
      .single();
    
    if (postError) {
      console.error(`Error creando post para ${postData.username}:`, postError);
      return null;
    }
    
    console.log(`✓ Post migrado: ${postData.username}`);
    
    // Migrar comentarios si existen
    if (postData.comments && postData.comments.length > 0) {
      for (const comment of postData.comments) {
        const commentDate = new Date(created_at);
        commentDate.setMinutes(commentDate.getMinutes() + Math.floor(Math.random() * 120)); // Comentarios dentro de 2 horas
        
        await supabase
          .from('forum_comments')
          .insert({
            post_id: post.id,
            user_id: user.id, // Mismo usuario por ahora
            content: comment.content,
            created_at: commentDate.toISOString()
          });
      }
      console.log(`  → ${postData.comments.length} comentarios migrados`);
    }
    
    // Crear votos simulados
    const voteCount = Math.floor(postData.upvotes * 0.8); // 80% de los votos como reales
    for (let i = 0; i < voteCount; i++) {
      await supabase
        .from('forum_votes')
        .insert({
          post_id: post.id,
          user_id: user.id // Mismo usuario por ahora
        })
        .onConflict(['post_id', 'user_id'])
        .ignore();
    }
    
    return post;
    
  } catch (error) {
    console.error(`Error en migración de post ${postData.username}:`, error);
    return null;
  }
};

/**
 * Ejecuta la migración completa
 */
export const runMigration = async () => {
  console.log('🚀 Iniciando migración de posts hardcodeados...');
  
  try {
    // Verificar si ya hay posts en la base de datos
    const { data: existingPosts, error: checkError } = await supabase
      .from('forum_posts')
      .select('id')
      .limit(1);
    
    if (checkError) {
      console.error('Error verificando posts existentes:', checkError);
      return { success: false, error: checkError.message };
    }
    
    // Si ya hay posts, no migrar
    if (existingPosts && existingPosts.length > 0) {
      console.log('⚠️ Ya existen posts en la base de datos. Saltando migración.');
      return { success: true, skipped: true, message: 'Migration skipped - posts already exist' };
    }
    
    // Obtener usuario para migración
    const user = await getMigrationUser();
    
    if (!user) {
      console.warn('No se pudo obtener usuario para migración. Usando perfiles mock.');
      const mockProfiles = await createMockProfiles();
      if (!mockProfiles || mockProfiles.length === 0) {
        return { success: false, error: 'No users available for migration' };
      }
      // Usar el primer perfil mock
      user = mockProfiles[0];
    }
    
    // Migrar cada post
    const results = [];
    for (const postData of HARDCODED_POSTS) {
      const result = await migratePost(postData, user);
      if (result) {
        results.push(result);
      }
    }
    
    console.log(`✅ Migración completada: ${results.length}/${HARDCODED_POSTS.length} posts migrados`);
    
    return {
      success: true,
      migrated: results.length,
      total: HARDCODED_POSTS.length,
      results
    };
    
  } catch (error) {
    console.error('❌ Error en migración:', error);
    return {
      success: false,
      error: error.message,
      migrated: 0,
      total: HARDCODED_POSTS.length
    };
  }
};

/**
 * Verifica el estado de la migración
 */
export const checkMigrationStatus = async () => {
  try {
    const { data: posts, error } = await supabase
      .from('forum_posts')
      .select('id, content, created_at, user_id')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return {
      success: true,
      postCount: posts?.length || 0,
      posts: posts || [],
      needsMigration: posts?.length === 0
    };
    
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Limpia datos de migración (solo para desarrollo/testing)
 */
export const cleanupMigration = async () => {
  console.log('🧹 Limpiando datos de migración...');
  
  try {
    // Eliminar en orden para respetar constraints
    const { error: votesError } = await supabase
      .from('forum_votes')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Eliminar todos
    
    const { error: commentsError } = await supabase
      .from('forum_comments')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    const { error: postsError } = await supabase
      .from('forum_posts')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (votesError || commentsError || postsError) {
      console.error('Error en limpieza:', { votesError, commentsError, postsError });
      return { success: false, errors: { votesError, commentsError, postsError } };
    }
    
    console.log('✅ Datos de migración limpiados');
    return { success: true };
    
  } catch (error) {
    console.error('Error en limpieza:', error);
    return { success: false, error: error.message };
  }
};

// Exportar funciones principales
export default {
  runMigration,
  checkMigrationStatus,
  cleanupMigration,
  HARDCODED_POSTS
};