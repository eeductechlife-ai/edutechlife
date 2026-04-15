-- CREAR SISTEMA COMPLETO DEL FORO DESDE CERO
-- Ejecutar en Supabase SQL Editor

-- 1. Crear tabla forum_posts
CREATE TABLE IF NOT EXISTS public.forum_posts (
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

-- 2. Crear tabla forum_votes
CREATE TABLE IF NOT EXISTS public.forum_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_type INTEGER CHECK (vote_type IN (1, -1)), -- 1 = upvote, -1 = downvote
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(post_id, user_id)
);

RAISE NOTICE '✅ Tabla forum_votes creada';

-- 3. Crear tabla forum_comments
CREATE TABLE IF NOT EXISTS public.forum_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

RAISE NOTICE '✅ Tabla forum_comments creada';

-- 4. Crear vista forum_posts_with_users
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

-- 5. Crear índices para mejor performance
CREATE INDEX IF NOT EXISTS forum_posts_author_idx ON public.forum_posts(author_id);
CREATE INDEX IF NOT EXISTS forum_posts_created_idx ON public.forum_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS forum_votes_post_user_idx ON public.forum_votes(post_id, user_id);
CREATE INDEX IF NOT EXISTS forum_comments_post_idx ON public.forum_comments(post_id);

RAISE NOTICE '✅ Índices creados';

-- 6. Crear función para actualizar contador de votos
CREATE OR REPLACE FUNCTION public.update_post_votes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.vote_type = 1 THEN
      UPDATE public.forum_posts 
      SET upvotes = upvotes + 1 
      WHERE id = NEW.post_id;
    ELSIF NEW.vote_type = -1 THEN
      UPDATE public.forum_posts 
      SET downvotes = downvotes + 1 
      WHERE id = NEW.post_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.vote_type = 1 THEN
      UPDATE public.forum_posts 
      SET upvotes = upvotes - 1 
      WHERE id = OLD.post_id;
    ELSIF OLD.vote_type = -1 THEN
      UPDATE public.forum_posts 
      SET downvotes = downvotes - 1 
      WHERE id = OLD.post_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Si cambia el tipo de voto
    IF OLD.vote_type = 1 AND NEW.vote_type = -1 THEN
      UPDATE public.forum_posts 
      SET upvotes = upvotes - 1, downvotes = downvotes + 1 
      WHERE id = NEW.post_id;
    ELSIF OLD.vote_type = -1 AND NEW.vote_type = 1 THEN
      UPDATE public.forum_posts 
      SET upvotes = upvotes + 1, downvotes = downvotes - 1 
      WHERE id = NEW.post_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 7. Crear trigger para actualizar votos automáticamente
DROP TRIGGER IF EXISTS update_post_votes_trigger ON public.forum_votes;
CREATE TRIGGER update_post_votes_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.forum_votes
  FOR EACH ROW EXECUTE FUNCTION public.update_post_votes();

RAISE NOTICE '✅ Trigger de votos creado';

-- 8. Crear función para actualizar contador de comentarios
CREATE OR REPLACE FUNCTION public.update_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.forum_posts 
    SET comment_count = comment_count + 1 
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.forum_posts 
    SET comment_count = comment_count - 1 
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 9. Crear trigger para actualizar contador de comentarios
DROP TRIGGER IF EXISTS update_comment_count_trigger ON public.forum_comments;
CREATE TRIGGER update_comment_count_trigger
  AFTER INSERT OR DELETE ON public.forum_comments
  FOR EACH ROW EXECUTE FUNCTION public.update_comment_count();

RAISE NOTICE '✅ Trigger de comentarios creado';

-- 10. Verificar todas las tablas creadas
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

-- 11. Mensaje final
DO $$ 
BEGIN
  RAISE NOTICE '🎯 SISTEMA DEL FORO CREADO COMPLETAMENTE';
  RAISE NOTICE '✅ Tablas: forum_posts, forum_votes, forum_comments';
  RAISE NOTICE '✅ Vista: forum_posts_with_users';
  RAISE NOTICE '✅ Triggers: update_post_votes_trigger, update_comment_count_trigger';
  RAISE NOTICE '✅ Índices: Optimizados para performance';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Ahora debería funcionar:';
  RAISE NOTICE '   - forumService.getPostsOptimized → Sin errores';
  RAISE NOTICE '   - ForumCommunity → Carga completa';
  RAISE NOTICE '   - PostCard → Votación funcional';
  RAISE NOTICE '   - useInfiniteScroll → Scroll infinito';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️ Siguiente paso:';
  RAISE NOTICE '   - Refrescar la aplicación';
  RAISE NOTICE '   - Verificar que Clerk cargue correctamente';
  RAISE NOTICE '   - Probar "Mi Perfil"';
END $$;