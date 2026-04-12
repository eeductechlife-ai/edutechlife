-- ============================================
-- EDUTECHLIFE FORUM COMMUNITY - SCHEMA SQL
-- Tablas para el "Muro de Insights" funcional
-- ============================================

-- ==================== TABLAS PRINCIPALES ====================

-- 1. forum_posts (posts principales del muro de insights)
CREATE TABLE IF NOT EXISTS forum_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) BETWEEN 10 AND 500),
  tags TEXT[] DEFAULT '{}',
  upvotes INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_forum_posts_user_id ON forum_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_created_at ON forum_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_posts_upvotes ON forum_posts(upvotes DESC);
CREATE INDEX IF NOT EXISTS idx_forum_posts_tags ON forum_posts USING GIN(tags);

-- 2. forum_comments (comentarios a posts)
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

-- 3. forum_votes (votos para evitar concurrencia y doble votación)
CREATE TABLE IF NOT EXISTS forum_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id) -- Un voto por usuario por post
);

-- Índices para votos
CREATE INDEX IF NOT EXISTS idx_forum_votes_post_id ON forum_votes(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_votes_user_id ON forum_votes(user_id);

-- ==================== FUNCIONES RPC ====================

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

-- ==================== POLÍTICAS RLS (ROW LEVEL SECURITY) ====================

-- Habilitar RLS en todas las tablas
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_votes ENABLE ROW LEVEL SECURITY;

-- ==================== POLÍTICAS PARA forum_posts ====================

-- Todos los usuarios autenticados pueden ver posts
CREATE POLICY "forum_posts_select_policy" ON forum_posts
FOR SELECT USING (auth.role() = 'authenticated');

-- Solo usuarios autenticados pueden crear posts
CREATE POLICY "forum_posts_insert_policy" ON forum_posts
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Usuarios solo pueden actualizar sus propios posts
CREATE POLICY "forum_posts_update_policy" ON forum_posts
FOR UPDATE USING (auth.uid() = user_id);

-- Usuarios solo pueden eliminar sus propios posts
CREATE POLICY "forum_posts_delete_policy" ON forum_posts
FOR DELETE USING (auth.uid() = user_id);

-- ==================== POLÍTICAS PARA forum_comments ====================

-- Todos los usuarios autenticados pueden ver comentarios
CREATE POLICY "forum_comments_select_policy" ON forum_comments
FOR SELECT USING (auth.role() = 'authenticated');

-- Solo usuarios autenticados pueden crear comentarios
CREATE POLICY "forum_comments_insert_policy" ON forum_comments
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Usuarios solo pueden actualizar sus propios comentarios
CREATE POLICY "forum_comments_update_policy" ON forum_comments
FOR UPDATE USING (auth.uid() = user_id);

-- Usuarios solo pueden eliminar sus propios comentarios
CREATE POLICY "forum_comments_delete_policy" ON forum_comments
FOR DELETE USING (auth.uid() = user_id);

-- ==================== POLÍTICAS PARA forum_votes ====================

-- Todos los usuarios autenticados pueden ver votos
CREATE POLICY "forum_votes_select_policy" ON forum_votes
FOR SELECT USING (auth.role() = 'authenticated');

-- Solo usuarios autenticados pueden crear votos
CREATE POLICY "forum_votes_insert_policy" ON forum_votes
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Usuarios solo pueden eliminar sus propios votos
CREATE POLICY "forum_votes_delete_policy" ON forum_votes
FOR DELETE USING (auth.uid() = user_id);

-- ==================== TRIGGERS ====================

-- Trigger para actualizar automáticamente updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_forum_posts_updated_at
BEFORE UPDATE ON forum_posts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ==================== VISTAS ÚTILES ====================

-- Vista para obtener posts con información de usuario
CREATE OR REPLACE VIEW forum_posts_with_users AS
SELECT 
  fp.*,
  p.display_name,
  p.avatar_url,
  p.role as user_role,
  EXISTS (
    SELECT 1 FROM forum_votes fv 
    WHERE fv.post_id = fp.id AND fv.user_id = auth.uid()
  ) as has_voted
FROM forum_posts fp
LEFT JOIN profiles p ON fp.user_id = p.id;

-- Vista para obtener estadísticas de usuario
CREATE OR REPLACE VIEW user_forum_stats AS
SELECT 
  user_id,
  COUNT(DISTINCT fp.id) as post_count,
  COUNT(DISTINCT fc.id) as comment_count,
  COALESCE(SUM(fp.upvotes), 0) as total_upvotes_received,
  COUNT(DISTINCT CASE WHEN fp.is_verified THEN fp.id END) as verified_posts_count
FROM forum_posts fp
LEFT JOIN forum_comments fc ON fp.user_id = fc.user_id
GROUP BY user_id;

-- ==================== DATOS DE EJEMPLO (OPCIONAL) ====================

-- Insertar algunos posts de ejemplo (opcional - para testing)
INSERT INTO forum_posts (user_id, content, tags, upvotes, is_verified, created_at) VALUES
(
  (SELECT id FROM auth.users LIMIT 1),
  'Actúa como un arquitecto de sistemas educativos. Diseña un framework de evaluación que combine métricas cuantitativas, análisis cualitativo y retroalimentación en tiempo real.',
  ARRAY['educación', 'evaluación', 'framework'],
  24,
  true,
  NOW() - INTERVAL '2 hours'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'Como experto en prompt engineering, crea un sistema de prompts anidados para resolver problemas complejos de negocio en 3 niveles: diagnóstico, estrategia y ejecución.',
  ARRAY['prompt-engineering', 'negocios', 'estrategia'],
  15,
  false,
  NOW() - INTERVAL '5 hours'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'Desarrolla un prompt que transforme datos crudos en insights accionables para equipos de marketing, incluyendo visualizaciones y recomendaciones específicas.',
  ARRAY['marketing', 'datos', 'visualización'],
  8,
  true,
  NOW() - INTERVAL '1 day'
);

-- ==================== COMENTARIOS ====================

/*
INSTRUCCIONES DE USO:

1. Ejecutar este script en el SQL Editor de Supabase
2. Habilitar Realtime para las tablas:
   - Ir a Database → Replication
   - Habilitar replication para forum_posts, forum_comments, forum_votes
   - Seleccionar "Source" y "Insert, Update, Delete"

3. Configurar almacenamiento para avatares (opcional):
   - Ir a Storage → Create New Bucket
   - Nombre: "avatars"
   - Configurar políticas RLS según sea necesario

NOTAS:
- Todas las tablas requieren autenticación (auth.role() = 'authenticated')
- Los usuarios solo pueden modificar/eliminar sus propios contenidos
- El sistema de votación es atómico y evita doble votación
- Las vistas proporcionan datos enriquecidos para la UI
*/