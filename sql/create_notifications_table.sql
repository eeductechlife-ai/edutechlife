-- ============================================
-- TABLA: notifications
-- Sistema de notificaciones IALab - Edutechlife
-- Colores corporativos: #004B63 (Azul Petroleo), #00BCD4 (Cyan)
-- ============================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices para rendimiento
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(user_id, created_at DESC);

-- Tipos de notificacion soportados:
-- certificate_earned  : Certificado generado
-- module_complete     : Modulo completado (score >= 80%)
-- course_update       : Hitos de progreso (25%, 50%, 75%, 100%)
-- lesson_reminder     : Recordatorio de inactividad (3+ dias)
-- exam_reminder       : Examen pendiente
-- general             : Notificacion general del sistema

-- Comentarios
COMMENT ON TABLE notifications IS 'Notificaciones IALab - Sistema de alertas corporativas Edutechlife';
COMMENT ON COLUMN notifications.type IS 'certificate_earned, module_complete, course_update, lesson_reminder, exam_reminder, general';
COMMENT ON COLUMN notifications.metadata IS 'Datos adicionales: moduleId, score, milestone, daysInactive, etc';

-- RLS: Cada usuario solo ve/edita sus propias notificaciones
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid()::text OR user_id = (current_setting('request.jwt.claims', true)::json->>'sub'));

DROP POLICY IF EXISTS "Users can insert own notifications" ON notifications;
CREATE POLICY "Users can insert own notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid()::text OR user_id = (current_setting('request.jwt.claims', true)::json->>'sub'));

DROP POLICY IF EXISTS "Users can delete own notifications" ON notifications;
CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (user_id = auth.uid()::text OR user_id = (current_setting('request.jwt.claims', true)::json->>'sub'));

-- Trigger para actualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_notifications_updated_at ON notifications;
CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Realtime para la tabla
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

DO $$
BEGIN
  RAISE NOTICE 'Tabla notifications creada exitosamente con RLS y Realtime habilitado';
END $$;
