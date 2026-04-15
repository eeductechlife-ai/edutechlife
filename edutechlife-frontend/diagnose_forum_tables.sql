-- DIAGNÓSTICO DE TABLAS FORUM Y USER_PROGRESS
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar si tabla forum_posts existe
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'forum_posts'
) AS forum_posts_exists;

-- 2. Verificar estructura de forum_posts si existe
DO $$ 
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'forum_posts'
  ) THEN
    RAISE NOTICE '✅ Tabla forum_posts existe. Verificando estructura...';
    
    SELECT column_name, data_type, is_nullable, column_default
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'forum_posts'
    ORDER BY ordinal_position;
  ELSE
    RAISE NOTICE '❌ Tabla forum_posts NO existe';
  END IF;
END $$;

-- 3. Verificar si tabla forum_votes existe
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'forum_votes'
) AS forum_votes_exists;

-- 4. Verificar si tabla user_progress existe
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'user_progress'
) AS user_progress_exists;

-- 5. Verificar estructura de user_progress si existe
DO $$ 
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'user_progress'
  ) THEN
    RAISE NOTICE '✅ Tabla user_progress existe. Verificando estructura...';
    
    SELECT column_name, data_type, is_nullable, column_default
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_progress'
    ORDER BY ordinal_position;
  ELSE
    RAISE NOTICE '❌ Tabla user_progress NO existe';
  END IF;
END $$;

-- 6. Si falta tabla forum_posts, crearla
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
  END IF;
END $$;

-- 7. Si falta tabla forum_votes, crearla
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
  END IF;
END $$;

-- 8. Si falta tabla user_progress, crearla
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'user_progress'
  ) THEN
    RAISE NOTICE '⚠️ Creando tabla user_progress...';
    
    CREATE TABLE public.user_progress (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      module_id INTEGER NOT NULL,
      progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
      completed BOOLEAN DEFAULT false,
      last_accessed TIMESTAMPTZ DEFAULT now(),
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now(),
      UNIQUE(user_id, module_id)
    );
    
    RAISE NOTICE '✅ Tabla user_progress creada';
  END IF;
END $$;

-- 9. Verificar columnas críticas en user_progress
DO $$ 
BEGIN
  -- Verificar module_id
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'user_progress'
  ) AND NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_progress' 
    AND column_name = 'module_id'
  ) THEN
    RAISE NOTICE '⚠️ Agregando columna module_id a user_progress...';
    ALTER TABLE public.user_progress ADD COLUMN module_id INTEGER;
    RAISE NOTICE '✅ Columna module_id agregada';
  END IF;
  
  -- Verificar user_id
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'user_progress'
  ) AND NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_progress' 
    AND column_name = 'user_id'
  ) THEN
    RAISE NOTICE '⚠️ Agregando columna user_id a user_progress...';
    ALTER TABLE public.user_progress ADD COLUMN user_id UUID;
    RAISE NOTICE '✅ Columna user_id agregada';
  END IF;
END $$;

-- 10. Mensaje final
DO $$ 
BEGIN
  RAISE NOTICE '🎯 DIAGNÓSTICO COMPLETADO';
  RAISE NOTICE 'Ahora debería funcionar:';
  RAISE NOTICE '1. forum_posts → Consultas exitosas (sin error 400)';
  RAISE NOTICE '2. user_progress → Consultas exitosas (sin error 406)';
  RAISE NOTICE '3. useInfiniteScroll → Sin errores JavaScript';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️ Después de ejecutar este script:';
  RAISE NOTICE '   - Refresca la página de la aplicación';
  RAISE NOTICE '   - Verifica que no haya errores 400/406';
  RAISE NOTICE '   - Prueba abrir el perfil de usuario';
END $$;