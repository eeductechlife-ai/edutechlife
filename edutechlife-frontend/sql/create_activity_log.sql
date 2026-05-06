-- ============================================
-- TABLA: activity_log
-- Propósito: Registro detallado de cada acción del estudiante en IA Lab
-- Compatible con Clerk (user_id TEXT)
-- ============================================

-- Paso 1: Crear tabla
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  module_id INT NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('video', 'infographic', 'exam', 'challenge', 'resource', 'community')),
  resource_id TEXT,
  title TEXT NOT NULL,
  score INT,
  metadata JSONB DEFAULT '{}',
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Paso 2: Crear índices para queries rápidas
CREATE INDEX IF NOT EXISTS idx_activity_user_module ON activity_log(user_id, module_id);
CREATE INDEX IF NOT EXISTS idx_activity_user_type ON activity_log(user_id, activity_type);
CREATE INDEX IF NOT EXISTS idx_activity_user_completed ON activity_log(user_id, completed_at DESC);

-- Paso 3: Habilitar RLS
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Paso 4: Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "Enable all for authenticated users" ON activity_log;

-- Paso 5: Crear política permissiva (la app filtra por user_id)
CREATE POLICY "Enable all for authenticated users" ON activity_log
  FOR ALL USING (true);

-- Paso 6: Verificar creación
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'activity_log'
ORDER BY ordinal_position;

-- Debe mostrar: id, user_id (text), module_id (int), activity_type (text), 
-- resource_id (text), title (text), score (int), metadata (jsonb), 
-- completed_at (timestamptz), created_at (timestamptz)
