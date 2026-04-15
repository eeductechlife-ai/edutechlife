-- CREAR TABLA FORUM_VOTES (FALTANTE)
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar si tabla forum_votes existe
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'forum_votes'
) AS forum_votes_exists;

-- 2. Si no existe, crearla
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'forum_votes'
  ) THEN
    RAISE NOTICE '⚠️ Creando tabla forum_votes...';
    
    CREATE TABLE public.forum_votes (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      vote_type INTEGER CHECK (vote_type IN (1, -1)), -- 1 = upvote, -1 = downvote
      created_at TIMESTAMPTZ DEFAULT now(),
      UNIQUE(post_id, user_id)
    );
    
    RAISE NOTICE '✅ Tabla forum_votes creada';
  ELSE
    RAISE NOTICE '✅ Tabla forum_votes ya existe';
  END IF;
END $$;

-- 3. Verificar estructura
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'forum_votes'
ORDER BY ordinal_position;

-- 4. Crear índice para mejor performance
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_indexes 
    WHERE tablename = 'forum_votes' 
    AND indexname = 'forum_votes_post_user_idx'
  ) THEN
    CREATE INDEX forum_votes_post_user_idx ON public.forum_votes(post_id, user_id);
    RAISE NOTICE '✅ Índice forum_votes_post_user_idx creado';
  END IF;
END $$;

-- 5. Mensaje final
DO $$ 
BEGIN
  RAISE NOTICE '🎯 TABLA FORUM_VOTES CONFIGURADA';
  RAISE NOTICE 'Ahora debería funcionar:';
  RAISE NOTICE '1. forumService → Sin error 404 en forum_votes';
  RAISE NOTICE '2. PostCard → Votación funcional';
  RAISE NOTICE '3. ForumCommunity → Estadísticas correctas';
END $$;