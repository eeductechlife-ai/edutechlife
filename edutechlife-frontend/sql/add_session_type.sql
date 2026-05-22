-- ============================================
-- Migración: Agregar tipo 'session' y columna duration_seconds
-- Propósito: Trackear sesiones reales de estudio
-- ============================================

-- Paso 1: Eliminar CHECK constraint existente
ALTER TABLE activity_log DROP CONSTRAINT IF EXISTS activity_log_activity_type_check;

-- Paso 2: Crear nuevo CHECK con 'session' y 'lesson' incluidos
ALTER TABLE activity_log ADD CONSTRAINT activity_log_activity_type_check
  CHECK (activity_type IN ('video', 'infographic', 'exam', 'challenge', 'resource', 'community', 'lesson', 'session'));

-- Paso 3: Agregar columna duration_seconds
ALTER TABLE activity_log ADD COLUMN IF NOT EXISTS duration_seconds INT;

-- Paso 4: Actualizar tipo de completed_at a TIMESTAMPTZ si no lo es (por si se creó sin zona horaria)
-- No es necesario si ya es TIMESTAMPTZ

-- Paso 5: Verificar
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'activity_log'
ORDER BY ordinal_position;
