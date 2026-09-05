-- ============================================
-- FIX DEFINITIVO: user_progress column type change
-- ============================================
-- Paso a paso: 1) Drop policies 2) Drop views 3) ALTER 4) Recrear todo
-- ============================================

-- PASO 1: Eliminar TODAS las políticas de user_progress
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT policyname FROM pg_policies WHERE tablename = 'user_progress'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON user_progress', r.policyname);
    RAISE NOTICE 'Dropped policy: %', r.policyname;
  END LOOP;
END $$;

-- PASO 2: Eliminar TODAS las views que dependen de user_progress
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT dependent_ns.nspname as schema_name,
           dependent_view.relname as view_name
    FROM pg_depend 
    JOIN pg_rewrite ON pg_depend.objid = pg_rewrite.oid
    JOIN pg_class as dependent_view ON pg_rewrite.ev_class = dependent_view.oid
    JOIN pg_namespace dependent_ns ON dependent_ns.oid = dependent_view.relnamespace
    WHERE pg_depend.refobjid = 'user_progress'::regclass
    AND dependent_view.relkind = 'v'
  LOOP
    EXECUTE format('DROP VIEW IF EXISTS %I.%I CASCADE', r.schema_name, r.view_name);
    RAISE NOTICE 'Dropped view: %.%', r.schema_name, r.view_name;
  END LOOP;
END $$;

-- PASO 3: Verificar que NO quedan políticas
SELECT count(*) as policies_left 
FROM pg_policies WHERE tablename = 'user_progress';
-- Debe ser 0

-- PASO 4: Cambiar tipos de columnas
ALTER TABLE user_progress 
  ALTER COLUMN user_id TYPE TEXT,
  ALTER COLUMN resource_id TYPE TEXT;

-- PASO 5: Recrear índice
DROP INDEX IF EXISTS idx_user_progress_unique;
CREATE UNIQUE INDEX idx_user_progress_unique 
ON user_progress (user_id, module_id, activity_type, resource_id) NULLS NOT DISTINCT;

-- PASO 6: Crear política permissiva para desarrollo
CREATE POLICY "Allow all access" ON user_progress
  FOR ALL USING (true) WITH CHECK (true);

-- PASO 7: Verificación final
SELECT '=== COLUMN TYPES ===' AS info;
SELECT column_name, data_type, udt_name 
FROM information_schema.columns 
WHERE table_name = 'user_progress' 
ORDER BY ordinal_position;

SELECT '=== INDEX ===' AS info;
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'user_progress' 
AND indexname = 'idx_user_progress_unique';

SELECT '=== POLICIES ===' AS info;
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'user_progress';
