-- ============================================
-- CORRECCIÓN DE TABLAS FALTANTES - EDUTECHLIFE FORUM
-- Solo crea lo que falta para no duplicar
-- ============================================

-- 1. Crear tabla forum_comments si no existe
CREATE TABLE IF NOT EXISTS forum_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 300),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para comentarios
CREATE INDEX IF NOT EXISTS idx_forum_comments_post_id ON forum_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_comments_user_id ON forum_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_comments_created_at ON forum_comments(created_at DESC);

-- 2. Crear funciones RPC si no existen

-- Función para incrementar votos de forma atómica y segura
CREATE OR REPLACE FUNCTION increment_post_upvote(post_id UUID, user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  current_upvotes INTEGER;
BEGIN
  -- Insertar voto (ignorar si ya existe por UNIQUE constraint)
  INSERT INTO forum_votes (post_id, user_id) 
  VALUES (post_id, user_id)
  ON CONFLICT (post_id, user_id) DO NOTHING;
  
  -- Si se insertó un nuevo voto, incrementar contador
  IF FOUND THEN
    UPDATE forum_posts 
    SET upvotes = upvotes + 1
    WHERE id = post_id
    RETURNING upvotes INTO current_upvotes;
  ELSE
    -- Si ya existía, devolver el valor actual
    SELECT upvotes INTO current_upvotes FROM forum_posts WHERE id = post_id;
  END IF;
  
  RETURN COALESCE(current_upvotes, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para decrementar votos (remover voto)
CREATE OR REPLACE FUNCTION decrement_post_upvote(post_id UUID, user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  current_upvotes INTEGER;
BEGIN
  -- Eliminar voto si existe
  DELETE FROM forum_votes 
  WHERE post_id = post_id AND user_id = user_id;
  
  -- Si se eliminó un voto, decrementar contador
  IF FOUND THEN
    UPDATE forum_posts 
    SET upvotes = GREATEST(upvotes - 1, 0) -- No permitir valores negativos
    WHERE id = post_id
    RETURNING upvotes INTO current_upvotes;
  ELSE
    -- Si no existía, devolver el valor actual
    SELECT upvotes INTO current_upvotes FROM forum_posts WHERE id = post_id;
  END IF;
  
  RETURN COALESCE(current_upvotes, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para verificar si un usuario ya votó un post
CREATE OR REPLACE FUNCTION has_user_voted(post_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM forum_votes 
    WHERE forum_votes.post_id = has_user_voted.post_id 
    AND forum_votes.user_id = has_user_voted.user_id
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- 3. Habilitar RLS en las tablas si no está habilitado
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_votes ENABLE ROW LEVEL SECURITY;

-- 4. Crear políticas RLS si no existen

-- Políticas para forum_posts
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'forum_posts_select_policy' AND tablename = 'forum_posts'
  ) THEN
    CREATE POLICY "forum_posts_select_policy" ON forum_posts
    FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'forum_posts_insert_policy' AND tablename = 'forum_posts'
  ) THEN
    CREATE POLICY "forum_posts_insert_policy" ON forum_posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'forum_posts_update_policy' AND tablename = 'forum_posts'
  ) THEN
    CREATE POLICY "forum_posts_update_policy" ON forum_posts
    FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'forum_posts_delete_policy' AND tablename = 'forum_posts'
  ) THEN
    CREATE POLICY "forum_posts_delete_policy" ON forum_posts
    FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Políticas para forum_comments
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'forum_comments_select_policy' AND tablename = 'forum_comments'
  ) THEN
    CREATE POLICY "forum_comments_select_policy" ON forum_comments
    FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'forum_comments_insert_policy' AND tablename = 'forum_comments'
  ) THEN
    CREATE POLICY "forum_comments_insert_policy" ON forum_comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Políticas para forum_votes
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'forum_votes_select_policy' AND tablename = 'forum_votes'
  ) THEN
    CREATE POLICY "forum_votes_select_policy" ON forum_votes
    FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'forum_votes_insert_policy' AND tablename = 'forum_votes'
  ) THEN
    CREATE POLICY "forum_votes_insert_policy" ON forum_votes
    FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- 5. Crear trigger para updated_at si no existe
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_forum_posts_updated_at'
  ) THEN
    CREATE TRIGGER update_forum_posts_updated_at
    BEFORE UPDATE ON forum_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- 6. Insertar posts de ejemplo si la tabla está vacía
DO $$
DECLARE
  sample_user_id UUID;
  post_count INTEGER;
BEGIN
  -- Verificar si hay posts
  SELECT COUNT(*) INTO post_count FROM forum_posts;
  
  -- Solo insertar si está vacía
  IF post_count = 0 THEN
    -- Obtener un usuario existente
    SELECT id INTO sample_user_id FROM auth.users LIMIT 1;
    
    -- Solo insertar si hay un usuario
    IF sample_user_id IS NOT NULL THEN
      INSERT INTO forum_posts (user_id, content, tags, upvotes, is_verified, created_at) VALUES
      (
        sample_user_id,
        'Actúa como un arquitecto de sistemas educativos. Diseña un framework de evaluación que combine métricas cuantitativas, análisis cualitativo y retroalimentación en tiempo real.',
        ARRAY['educación', 'evaluación', 'framework'],
        24,
        true,
        NOW() - INTERVAL '2 hours'
      ),
      (
        sample_user_id,
        'Como experto en prompt engineering, crea un sistema de prompts anidados para resolver problemas complejos de negocio en 3 niveles: diagnóstico, estrategia y ejecución.',
        ARRAY['prompt-engineering', 'negocios', 'estrategia'],
        15,
        false,
        NOW() - INTERVAL '5 hours'
      ),
      (
        sample_user_id,
        'Desarrolla un prompt que transforme datos crudos en insights accionables para equipos de marketing, incluyendo visualizaciones y recomendaciones específicas.',
        ARRAY['marketing', 'datos', 'visualización'],
        8,
        true,
        NOW() - INTERVAL '1 day'
      );
      
      RAISE NOTICE '✅ Posts de ejemplo insertados correctamente';
    ELSE
      RAISE NOTICE '⚠️ No se encontraron usuarios. Los posts de ejemplo no se insertarán.';
    END IF;
  ELSE
    RAISE NOTICE '📊 La tabla ya tiene % posts. No se insertarán datos de ejemplo.', post_count;
  END IF;
END $$;

-- 7. Mensaje final
SELECT '✅ Corrección completada. Verificar:' AS status,
  (SELECT COUNT(*) FROM forum_posts) AS total_posts,
  (SELECT COUNT(*) FROM forum_comments) AS total_comments,
  (SELECT COUNT(*) FROM forum_votes) AS total_votes;