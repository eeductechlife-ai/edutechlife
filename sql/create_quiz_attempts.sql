-- ============================================
-- TABLA: quiz_attempts
-- Seguimiento de intentos de exámenes por módulo
-- ============================================

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  module_id INT NOT NULL,
  score INT NOT NULL CHECK (score BETWEEN 0 AND 100),
  passed BOOLEAN NOT NULL DEFAULT FALSE,
  answers JSONB DEFAULT '{}',
  total_questions INT DEFAULT 0,
  correct_answers INT DEFAULT 0,
  time_taken_seconds INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT fk_quiz_attempts_user FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Índices para rendimiento
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_module ON quiz_attempts(user_id, module_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_created ON quiz_attempts(created_at DESC);

-- RLS (Row Level Security)
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios solo pueden ver sus propios intentos
CREATE POLICY "Users can view own quiz attempts" ON quiz_attempts
  FOR SELECT
  USING (user_id = auth.uid() OR user_id IN (SELECT id FROM profiles WHERE id = user_id));

-- Política: Los usuarios pueden insertar sus propios intentos
CREATE POLICY "Users can insert own quiz attempts" ON quiz_attempts
  FOR INSERT
  WITH CHECK (user_id = auth.uid() OR user_id IN (SELECT id FROM profiles WHERE id = user_id));

-- Política: Los usuarios pueden actualizar sus propios intentos
CREATE POLICY "Users can update own quiz attempts" ON quiz_attempts
  FOR UPDATE
  USING (user_id = auth.uid() OR user_id IN (SELECT id FROM profiles WHERE id = user_id));

-- Política: Los usuarios pueden eliminar sus propios intentos
CREATE POLICY "Users can delete own quiz attempts" ON quiz_attempts
  FOR DELETE
  USING (user_id = auth.uid() OR user_id IN (SELECT id FROM profiles WHERE id = user_id));

-- Política de servicio (para operaciones internas si se usa service_role)
CREATE POLICY "Service role full access" ON quiz_attempts
  FOR ALL
  USING (true)
  WITH CHECK (true);

COMMENT ON TABLE quiz_attempts IS 'Registro de intentos de exámenes por usuario y módulo';
COMMENT ON COLUMN quiz_attempts.user_id IS 'Clerk User ID (formato: user_XXXXX)';
COMMENT ON COLUMN quiz_attempts.answers IS 'Respuestas del usuario en formato JSON';

DO $$
BEGIN
  RAISE NOTICE '✅ Tabla quiz_attempts creada correctamente';
  RAISE NOTICE '📋 Columnas: id, user_id (TEXT), module_id, score, passed, answers, created_at';
  RAISE NOTICE '🔒 RLS habilitado con políticas de acceso por usuario';
END $$;
