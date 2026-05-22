-- ============================================
-- Fix: Todos los CHECK constraints faltantes
-- 1. activity_log: agregar 'session' y 'lesson'
-- 2. user_progress: agregar 'gamification'
-- ============================================

-- ====================
-- 1. activity_log
-- ====================
DO $$
DECLARE
  constraint_name text;
BEGIN
  -- Encontrar el nombre real del CHECK constraint en activity_log
  SELECT con.conname INTO constraint_name
  FROM pg_constraint con
  JOIN pg_class rel ON rel.oid = con.conrelid
  WHERE rel.relname = 'activity_log'
  AND con.contype = 'c';

  IF constraint_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE activity_log DROP CONSTRAINT IF EXISTS %I', constraint_name);
    RAISE NOTICE '✅ CHECK constraint % eliminado de activity_log', constraint_name;
  ELSE
    RAISE NOTICE '⚠️ No se encontró CHECK constraint en activity_log';
  END IF;

  EXECUTE 'ALTER TABLE activity_log ADD CONSTRAINT activity_log_activity_type_check
    CHECK (activity_type IN (''video'', ''infographic'', ''exam'', ''challenge'', ''resource'', ''community'', ''lesson'', ''session''))';
  RAISE NOTICE '✅ Nuevo CHECK constraint creado en activity_log';
END $$;

-- ====================
-- 2. user_progress
-- ====================
DO $$
DECLARE
  constraint_name text;
  col_exists boolean;
BEGIN
  -- Agregar columna gamification_data si no existe
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'user_progress' AND column_name = 'gamification_data'
  ) INTO col_exists;

  IF NOT col_exists THEN
    ALTER TABLE public.user_progress ADD COLUMN gamification_data JSONB;
    RAISE NOTICE '✅ Columna gamification_data agregada a user_progress';
  ELSE
    RAISE NOTICE '✅ Columna gamification_data ya existe';
  END IF;

  -- Encontrar el nombre real del CHECK constraint en user_progress
  SELECT con.conname INTO constraint_name
  FROM pg_constraint con
  JOIN pg_class rel ON rel.oid = con.conrelid
  WHERE rel.relname = 'user_progress'
  AND con.contype = 'c';

  IF constraint_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE user_progress DROP CONSTRAINT IF EXISTS %I', constraint_name);
    RAISE NOTICE '✅ CHECK constraint % eliminado de user_progress', constraint_name;
  ELSE
    RAISE NOTICE '⚠️ No se encontró CHECK constraint en user_progress';
  END IF;

  EXECUTE 'ALTER TABLE user_progress ADD CONSTRAINT user_progress_activity_type_check
    CHECK (activity_type IN (''video'', ''document'', ''pdf'', ''ova'', ''interactive'', ''exam'', ''challenge'', ''community_comment'', ''gamification''))';
  RAISE NOTICE '✅ Nuevo CHECK constraint creado en user_progress (incluye gamification)';
END $$;

-- ====================
-- 3. Verificación
-- ====================
SELECT 'activity_log' AS tabla, column_name, data_type
FROM information_schema.columns
WHERE table_name = 'activity_log'
ORDER BY ordinal_position;

SELECT 'user_progress' AS tabla, column_name, data_type
FROM information_schema.columns
WHERE table_name = 'user_progress'
ORDER BY ordinal_position;
