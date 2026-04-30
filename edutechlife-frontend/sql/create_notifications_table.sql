-- ============================================
-- NOTIFICATIONS TABLE - IALab Notification System
-- ============================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('lesson_reminder', 'exam_reminder', 'module_complete', 'certificate_earned', 'course_update', 'general')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ
);

COMMENT ON TABLE notifications IS 'Notificaciones del sistema IALab para estudiantes';

-- RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY IF NOT EXISTS "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "System can insert notifications" ON notifications
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY IF NOT EXISTS "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete own notifications" ON notifications
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Service role can manage all notifications" ON notifications
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Índices
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- Función: auto-delete notifications older than 30 days
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM notifications WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$;
