-- ============================================
-- FORUM IALAB - Tablas compatibles con Clerk Auth
-- ============================================
-- user_id = TEXT (acepta Clerk IDs como "user_2xyz...")
-- RLS permissivo (filtramos user_id en la app)
-- ============================================

-- 1. Eliminar tablas viejas (si existen con FK UUID)
DROP TABLE IF EXISTS forum_votes CASCADE;
DROP TABLE IF EXISTS forum_comments CASCADE;
DROP TABLE IF EXISTS forum_posts CASCADE;

-- 2. Eliminar funciones RPC viejas
DROP FUNCTION IF EXISTS increment_post_upvote CASCADE;
DROP FUNCTION IF EXISTS decrement_post_upvote CASCADE;
DROP FUNCTION IF EXISTS has_user_voted CASCADE;

-- 3. Crear forum_posts (user_id TEXT para Clerk)
CREATE TABLE forum_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  upvotes INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_forum_posts_user_id ON forum_posts(user_id);
CREATE INDEX idx_forum_posts_created_at ON forum_posts(created_at DESC);
CREATE INDEX idx_forum_posts_upvotes ON forum_posts(upvotes DESC);

-- 4. Crear forum_comments (user_id TEXT para Clerk)
CREATE TABLE forum_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_forum_comments_post_id ON forum_comments(post_id);
CREATE INDEX idx_forum_comments_created_at ON forum_comments(created_at DESC);

-- 5. Crear forum_votes (user_id TEXT para Clerk)
CREATE TABLE forum_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  vote_type TEXT DEFAULT 'upvote',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

CREATE INDEX idx_forum_votes_post_id ON forum_votes(post_id);

-- 6. RLS permissivo (filtramos user_id en la app)
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_votes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access" ON forum_posts;
CREATE POLICY "Allow all access" ON forum_posts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access" ON forum_comments;
CREATE POLICY "Allow all access" ON forum_comments FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access" ON forum_votes;
CREATE POLICY "Allow all access" ON forum_votes FOR ALL USING (true) WITH CHECK (true);

-- 7. Trigger para updated_at
CREATE OR REPLACE FUNCTION update_forum_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_forum_posts_updated_at ON forum_posts;
CREATE TRIGGER update_forum_posts_updated_at
  BEFORE UPDATE ON forum_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_forum_posts_updated_at();

-- 8. Verificación
SELECT '=== TABLAS CREADAS ===' AS info;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('forum_posts', 'forum_comments', 'forum_votes')
ORDER BY table_name;

SELECT '=== COLUMNAS ===' AS info;
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('forum_posts', 'forum_comments', 'forum_votes')
ORDER BY table_name, ordinal_position;

SELECT '=== RLS POLICIES ===' AS info;
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('forum_posts', 'forum_comments', 'forum_votes')
ORDER BY tablename;
