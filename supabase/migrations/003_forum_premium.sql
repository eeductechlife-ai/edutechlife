-- Forum Premium: Estructura completa para comunidad IALab
-- Extiende las tablas forum_posts y forum_votes existentes

-- 1. Comments anidados (threaded)
CREATE TABLE IF NOT EXISTS forum_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES forum_comments(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ,
  is_edited BOOLEAN DEFAULT false,
  is_hidden BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_forum_comments_post ON forum_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_comments_parent ON forum_comments(parent_id);

-- 2. Perfiles públicos de comunidad
CREATE TABLE IF NOT EXISTS forum_profiles (
  user_id TEXT PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT DEFAULT '',
  title TEXT DEFAULT 'Estudiante',
  reputation INTEGER DEFAULT 0,
  post_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  likes_received INTEGER DEFAULT 0,
  answers_received INTEGER DEFAULT 0,
  badges TEXT[] DEFAULT '{}',
  joined_at TIMESTAMPTZ DEFAULT now(),
  last_active TIMESTAMPTZ DEFAULT now()
);

-- 3. Notificaciones
CREATE TABLE IF NOT EXISTS forum_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('reply', 'like', 'mention', 'system', 'answer')),
  source_user_id TEXT,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES forum_comments(id) ON DELETE CASCADE,
  title TEXT DEFAULT '',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_forum_notifications_user ON forum_notifications(user_id, is_read);

-- 4. Bookmarks
CREATE TABLE IF NOT EXISTS forum_bookmarks (
  user_id TEXT NOT NULL,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, post_id)
);

-- 5. Reports (moderación)
CREATE TABLE IF NOT EXISTS forum_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES forum_comments(id) ON DELETE CASCADE,
  reported_by TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT
);

-- 6. Agregar columna category a forum_posts si no existe
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'forum_posts' AND column_name = 'category') THEN
    ALTER TABLE forum_posts ADD COLUMN category TEXT DEFAULT 'discussion' CHECK (category IN ('question', 'discussion', 'resource', 'announcement', 'feedback'));
  END IF;
END $$;

-- 7. Función auto-create perfil al primer post
CREATE OR REPLACE FUNCTION auto_create_forum_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO forum_profiles (user_id, full_name, last_active)
  VALUES (NEW.user_id, NEW.user_name, now())
  ON CONFLICT (user_id) DO UPDATE SET last_active = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_auto_profile_on_post ON forum_posts;
CREATE TRIGGER trg_auto_profile_on_post
  AFTER INSERT ON forum_posts
  FOR EACH ROW EXECUTE FUNCTION auto_create_forum_profile();

-- 8. Función para incrementar contadores al crear post
CREATE OR REPLACE FUNCTION increment_post_count()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO forum_profiles (user_id, full_name, post_count, last_active)
  VALUES (NEW.user_id, NEW.user_name, 1, now())
  ON CONFLICT (user_id) DO UPDATE SET
    post_count = forum_profiles.post_count + 1,
    last_active = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_increment_post_count ON forum_posts;
CREATE TRIGGER trg_increment_post_count
  AFTER INSERT ON forum_posts
  FOR EACH ROW EXECUTE FUNCTION increment_post_count();

-- 9. Función para reputación
CREATE OR REPLACE FUNCTION update_reputation()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE forum_profiles
  SET reputation = (
    COALESCE(post_count, 0) * 5 +
    COALESCE(comment_count, 0) * 2 +
    COALESCE(likes_received, 0) * 1
  )
  WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. Función para notificación de like
CREATE OR REPLACE FUNCTION notify_post_liked()
RETURNS TRIGGER AS $$
DECLARE
  post_author TEXT;
  post_title TEXT;
BEGIN
  SELECT user_id, COALESCE(title, 'Un post') INTO post_author, post_title
  FROM forum_posts WHERE id = NEW.post_id;

  IF post_author != NEW.user_id THEN
    INSERT INTO forum_notifications (user_id, type, source_user_id, post_id, title)
    VALUES (post_author, 'like', NEW.user_id, NEW.post_id, post_title);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_notify_like ON forum_votes;
CREATE TRIGGER trg_notify_like
  AFTER INSERT ON forum_votes
  FOR EACH ROW EXECUTE FUNCTION notify_post_liked();

-- 11. Función para notificación de comentario
CREATE OR REPLACE FUNCTION notify_comment_added()
RETURNS TRIGGER AS $$
DECLARE
  post_author TEXT;
  post_title TEXT;
BEGIN
  SELECT user_id, COALESCE(title, 'Un post') INTO post_author, post_title
  FROM forum_posts WHERE id = NEW.post_id;

  IF post_author != NEW.user_id THEN
    INSERT INTO forum_notifications (user_id, type, source_user_id, post_id, comment_id, title)
    VALUES (post_author, 'reply', NEW.user_id, NEW.post_id, NEW.id, post_title);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_notify_comment ON forum_comments;
CREATE TRIGGER trg_notify_comment
  AFTER INSERT ON forum_comments
  FOR EACH ROW EXECUTE FUNCTION notify_comment_added();

-- 12. Función limpiar notificaciones viejas (>90 días)
CREATE OR REPLACE FUNCTION clean_old_notifications()
RETURNS void AS $$
BEGIN
  DELETE FROM forum_notifications
  WHERE created_at < now() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- 13. Políticas RLS (Row Level Security)
ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_reports ENABLE ROW LEVEL SECURITY;

-- Políticas: todos pueden leer
CREATE POLICY "comments_read_all" ON forum_comments FOR SELECT USING (true);
CREATE POLICY "profiles_read_all" ON forum_profiles FOR SELECT USING (true);
CREATE POLICY "notifications_read_own" ON forum_notifications FOR SELECT USING (user_id = current_user);
CREATE POLICY "bookmarks_read_own" ON forum_bookmarks FOR SELECT USING (user_id = current_user);
CREATE POLICY "reports_read_all" ON forum_reports FOR SELECT USING (true);

-- Políticas: solo el dueño puede insertar/modificar
CREATE POLICY "comments_insert_own" ON forum_comments FOR INSERT WITH CHECK (user_id = current_user);
CREATE POLICY "comments_update_own" ON forum_comments FOR UPDATE USING (user_id = current_user);
CREATE POLICY "bookmarks_insert_own" ON forum_bookmarks FOR INSERT WITH CHECK (user_id = current_user);
CREATE POLICY "bookmarks_delete_own" ON forum_bookmarks FOR DELETE USING (user_id = current_user);
CREATE POLICY "reports_insert" ON forum_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "notifications_update_own" ON forum_notifications FOR UPDATE USING (user_id = current_user);
