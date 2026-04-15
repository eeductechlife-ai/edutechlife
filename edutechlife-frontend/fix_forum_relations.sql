-- CORREGIR RELACIONES DEL FORO Y CREAR TABLA FALTANTE
-- Ejecutar en Supabase SQL Editor

-- 1. Crear tabla forum_comments si no existe
CREATE TABLE IF NOT EXISTS public.forum_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

RAISE NOTICE '✅ Tabla forum_comments creada';

-- 2. Recrear vista forum_posts_with_users SIN relaciones embebidas
DROP VIEW IF EXISTS public.forum_posts_with_users;
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

RAISE NOTICE '✅ Vista forum_posts_with_users recreada (sin relaciones embebidas)';

-- 3. Verificar que todas las tablas existan
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

-- 4. Mensaje para actualizar forumService.js
DO $$ 
BEGIN
  RAISE NOTICE '🎯 PROBLEMA IDENTIFICADO Y CORREGIDO';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️ La vista forum_posts_with_users NO puede tener relaciones embebidas (forum_comments(count), forum_votes(count))';
  RAISE NOTICE '✅ Solución: forumService.js debe hacer consultas separadas para counts';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Pasos para corregir forumService.js:';
  RAISE NOTICE '   1. getPostsOptimized debe hacer:';
  RAISE NOTICE '      - SELECT * FROM forum_posts_with_users (para posts + info usuario)';
  RAISE NOTICE '      - SELECT COUNT(*) FROM forum_comments WHERE post_id IN (...) (para counts)';
  RAISE NOTICE '      - SELECT COUNT(*) FROM forum_votes WHERE post_id IN (...) (para counts)';
  RAISE NOTICE '';
  RAISE NOTICE '🔧 Mientras tanto, puedes usar esta consulta temporal:';
  RAISE NOTICE '   SELECT * FROM forum_posts_with_users ORDER BY created_at DESC LIMIT 5';
END $$;