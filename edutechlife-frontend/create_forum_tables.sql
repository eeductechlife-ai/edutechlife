-- CREAR TABLAS FALTANTES DEL FORO
-- Ejecutar en Supabase SQL Editor

-- 1. Crear tabla forum_posts si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'forum_posts'
  ) THEN
    RAISE NOTICE '⚠️ Creando tabla forum_posts...';
    
    CREATE TABLE public.forum_posts (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      upvotes INTEGER DEFAULT 0,
      downvotes INTEGER DEFAULT 0,
      comment_count INTEGER DEFAULT 0,
      tags TEXT[] DEFAULT '{}',
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
    
    RAISE NOTICE '✅ Tabla forum_posts creada';
  ELSE
    RAISE NOTICE '✅ Tabla forum_posts ya existe';
  END IF;
END $$;

-- 2. Crear vista forum_posts_with_users si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.views 
    WHERE table_schema = 'public' 
    AND table_name = 'forum_posts_with_users'
  ) THEN
    RAISE NOTICE '⚠️ Creando vista forum_posts_with_users...';
    
    CREATE OR REPLACE VIEW public.forum_posts_with_users AS
    SELECT 
      fp.id,
      fp.title,
      fp.content,
      fp.author_id,
      fp.upvotes,
      fp.downvotes,
      fp.comment_count,
      fp.tags,
      fp.created_at,
      fp.updated_at,
      COALESCE(p.full_name, 'Usuario Anónimo') AS author_name,
      COALESCE(p.email, '') AS author_email,
      COALESCE(p.avatar_url, '') AS author_avatar,
      (fp.upvotes - fp.downvotes) AS net_votes,
      EXTRACT(EPOCH FROM (NOW() - fp.created_at)) / 3600 AS hours_ago
    FROM public.forum_posts fp
    LEFT JOIN public.profiles p ON fp.author_id = p.id;
    
    RAISE NOTICE '✅ Vista forum_posts_with_users creada';
  ELSE
    RAISE NOTICE '✅ Vista forum_posts_with_users ya existe';
  END IF;
END $$;

-- 3. Crear tabla forum_comments si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'forum_comments'
  ) THEN
    RAISE NOTICE '⚠️ Creando tabla forum_comments...';
    
    CREATE TABLE public.forum_comments (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
      author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
    
    RAISE NOTICE '✅ Tabla forum_comments creada';
  ELSE
    RAISE NOTICE '✅ Tabla forum_comments ya existe';
  END IF;
END $$;

-- 4. Verificar todas las tablas del foro
SELECT 
  table_name,
  table_type,
  CASE 
    WHEN table_type = 'VIEW' THEN '👁️ Vista'
    WHEN table_type = 'BASE TABLE' THEN '📊 Tabla'
    ELSE '❓ Otro'
  END AS tipo
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('forum_posts', 'forum_votes', 'forum_comments', 'forum_posts_with_users')
ORDER BY table_name;

-- 5. Mensaje final
DO $$ 
BEGIN
  RAISE NOTICE '🎯 TABLAS DEL FORO CONFIGURADAS';
  RAISE NOTICE 'Ahora debería funcionar:';
  RAISE NOTICE '1. forumService → Sin errores 404';
  RAISE NOTICE '2. getPostsOptimized → Consultas exitosas';
  RAISE NOTICE '3. ForumCommunity → Carga completa';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️ Problemas pendientes:';
  RAISE NOTICE '   - Clerk publishableKey necesita actualizarse';
  RAISE NOTICE '   - UserProfileSmartCard necesita usuario Clerk';
END $$;