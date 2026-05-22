-- Crear tabla forum_notifications (independiente, sin FK constraints)
CREATE TABLE IF NOT EXISTS forum_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('reply', 'like', 'mention', 'system', 'answer')),
  source_user_id TEXT,
  post_id UUID,
  comment_id UUID,
  title TEXT DEFAULT '',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_forum_notifications_user ON forum_notifications(user_id, is_read);

ALTER TABLE forum_notifications ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
DROP POLICY IF EXISTS "notifications_read_own" ON forum_notifications;
CREATE POLICY "notifications_read_own" ON forum_notifications
  FOR SELECT USING (user_id = current_user);

DROP POLICY IF EXISTS "notifications_update_own" ON forum_notifications;
CREATE POLICY "notifications_update_own" ON forum_notifications
  FOR UPDATE USING (user_id = current_user);

DROP POLICY IF EXISTS "notifications_insert_own" ON forum_notifications;
CREATE POLICY "notifications_insert_own" ON forum_notifications
  FOR INSERT WITH CHECK (user_id = current_user);
