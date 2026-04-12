-- ============================================
-- SOLUCIÓN SIMPLE Y DIRECTA PARA EL FORO
-- Crea todo desde cero sin complicaciones
-- ============================================

-- 1. ELIMINAR TODO LO EXISTENTE (si existe)
DROP TABLE IF EXISTS forum_comments CASCADE;
DROP TABLE IF EXISTS forum_votes CASCADE;
DROP TABLE IF EXISTS forum_posts CASCADE;

-- 2. CREAR TABLA FORUM_POSTS (posts principales)
CREATE TABLE forum_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) BETWEEN 10 AND 500),
  tags TEXT[] DEFAULT '{}',
  upvotes INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CREAR TABLA FORUM_COMMENTS (comentarios)
CREATE TABLE forum_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 300),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. CREAR TABLA FORUM_VOTES (votos)
CREATE TABLE forum_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id) -- Un voto por usuario por post
);

-- 5. CREAR ÍNDICES PARA MEJOR PERFORMANCE
CREATE INDEX idx_forum_posts_user_id ON forum_posts(user_id);
CREATE INDEX idx_forum_posts_created_at ON forum_posts(created_at DESC);
CREATE INDEX idx_forum_posts_upvotes ON forum_posts(upvotes DESC);
CREATE INDEX idx_forum_posts_tags ON forum_posts USING GIN(tags);

CREATE INDEX idx_forum_comments_post_id ON forum_comments(post_id);
CREATE INDEX idx_forum_comments_user_id ON forum_comments(user_id);
CREATE INDEX idx_forum_comments_created_at ON forum_comments(created_at DESC);

CREATE INDEX idx_forum_votes_post_id ON forum_votes(post_id);
CREATE INDEX idx_forum_votes_user_id ON forum_votes(user_id);

-- 6. CREAR FUNCIONES RPC SIMPLES

-- Función para incrementar votos
CREATE OR REPLACE FUNCTION increment_post_upvote(post_id UUID, user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  current_upvotes INTEGER;
BEGIN
  -- Insertar voto (ignorar si ya existe)
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
$$ LANGUAGE plpgsql;

-- Función para decrementar votos
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
    SET upvotes = GREATEST(upvotes - 1, 0)
    WHERE id = post_id
    RETURNING upvotes INTO current_upvotes;
  ELSE
    -- Si no existía, devolver el valor actual
    SELECT upvotes INTO current_upvotes FROM forum_posts WHERE id = post_id;
  END IF;
  
  RETURN COALESCE(current_upvotes, 0);
END;
$$ LANGUAGE plpgsql;

-- Función para verificar si un usuario ya votó
CREATE OR REPLACE FUNCTION has_user_voted(post_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM forum_votes 
    WHERE forum_votes.post_id = has_user_voted.post_id 
    AND forum_votes.user_id = has_user_voted.user_id
  );
END;
$$ LANGUAGE plpgsql;

-- 7. HABILITAR SEGURIDAD (RLS)
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_votes ENABLE ROW LEVEL SECURITY;

-- 8. CREAR POLÍTICAS DE SEGURIDAD SIMPLES

-- Para forum_posts
CREATE POLICY "Todos pueden ver posts" ON forum_posts
FOR SELECT USING (true);

CREATE POLICY "Usuarios autenticados pueden crear posts" ON forum_posts
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden editar sus posts" ON forum_posts
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus posts" ON forum_posts
FOR DELETE USING (auth.uid() = user_id);

-- Para forum_comments
CREATE POLICY "Todos pueden ver comentarios" ON forum_comments
FOR SELECT USING (true);

CREATE POLICY "Usuarios autenticados pueden crear comentarios" ON forum_comments
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Para forum_votes
CREATE POLICY "Todos pueden ver votos" ON forum_votes
FOR SELECT USING (true);

CREATE POLICY "Usuarios autenticados pueden crear votos" ON forum_votes
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus votos" ON forum_votes
FOR DELETE USING (auth.uid() = user_id);

-- 9. INSERTAR POSTS DE EJEMPLO (si hay usuarios)
DO $$
DECLARE
  sample_user_id UUID;
BEGIN
  -- Obtener cualquier usuario existente
  SELECT id INTO sample_user_id FROM auth.users LIMIT 1;
  
  IF sample_user_id IS NOT NULL THEN
    -- Insertar 5 posts de ejemplo
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
    ),
    (
      sample_user_id,
      'Crea un prompt para generar planes de estudio personalizados basados en estilos de aprendizaje VAK (Visual, Auditivo, Kinestésico).',
      ARRAY['VAK', 'aprendizaje', 'personalización'],
      12,
      true,
      NOW() - INTERVAL '3 hours'
    ),
    (
      sample_user_id,
      'Diseña un sistema de prompts para análisis de competencias profesionales y brechas de habilidades en equipos corporativos.',
      ARRAY['competencias', 'corporativo', 'análisis'],
      7,
      false,
      NOW() - INTERVAL '8 hours'
    );
    
    RAISE NOTICE '✅ 5 posts de ejemplo insertados para el usuario: %', sample_user_id;
  ELSE
    RAISE NOTICE '⚠️ No se encontraron usuarios. Registra un usuario en la aplicación primero.';
    RAISE NOTICE '💡 Posts de ejemplo NO se insertarán hasta que haya al menos un usuario.';
  END IF;
END $$;

-- 10. VERIFICACIÓN FINAL
SELECT '🎉 FORO CREADO EXITOSAMENTE' AS mensaje;
SELECT '📊 Tablas creadas:' AS seccion;
SELECT '   - forum_posts' AS tabla;
SELECT '   - forum_comments' AS tabla;
SELECT '   - forum_votes' AS tabla;

SELECT '⚡ Funciones RPC creadas:' AS seccion;
SELECT '   - increment_post_upvote()' AS funcion;
SELECT '   - decrement_post_upvote()' AS funcion;
SELECT '   - has_user_voted()' AS funcion;

SELECT '📈 Datos de ejemplo:' AS seccion;
SELECT COUNT(*) AS total_posts FROM forum_posts;
SELECT COUNT(*) AS total_comments FROM forum_comments;
SELECT COUNT(*) AS total_votes FROM forum_votes;

-- 11. INSTRUCCIONES PARA HABILITAR REALTIME
SELECT '🚀 SIGUIENTES PASOS EN SUPABASE DASHBOARD:' AS instrucciones;
SELECT '1. Ve a Database → Replication' AS paso;
SELECT '2. Haz clic en "Enable Realtime" para cada tabla:' AS paso;
SELECT '   - forum_posts' AS tabla;
SELECT '   - forum_comments' AS tabla;
SELECT '   - forum_votes' AS tabla;
SELECT '3. Selecciona "Source" y marca "Insert, Update, Delete"' AS paso;
SELECT '4. Guarda los cambios' AS paso;