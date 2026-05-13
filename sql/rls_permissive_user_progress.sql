-- ============================================
-- OPCION A: Políticas RLS Permissivas para user_progress
-- Para DESARROLLO - Permite acceso con anon key
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- 1. Habilitar RLS en user_progress
ALTER TABLE IF EXISTS user_progress ENABLE ROW LEVEL SECURITY;

-- 2. Eliminar políticas existentes
DROP POLICY IF EXISTS "user_progress_select_policy" ON user_progress;
DROP POLICY IF EXISTS "user_progress_insert_policy" ON user_progress;
DROP POLICY IF EXISTS "user_progress_update_policy" ON user_progress;
DROP POLICY IF EXISTS "user_progress_delete_policy" ON user_progress;
DROP POLICY IF EXISTS "Allow anon to read user_progress" ON user_progress;

-- 3. Crear políticas permissivas para desarrollo
-- SELECT: cualquier usuario autenticado o anónimo puede leer (filtrado por user_id en la app)
CREATE POLICY "user_progress_select_policy" ON user_progress
  FOR SELECT
  USING (true);

-- INSERT: cualquier usuario puede crear progreso
CREATE POLICY "user_progress_insert_policy" ON user_progress
  FOR INSERT
  WITH CHECK (true);

-- UPDATE: cualquier usuario puede actualizar su progreso
CREATE POLICY "user_progress_update_policy" ON user_progress
  FOR UPDATE
  USING (true);

-- DELETE: cualquier usuario puede eliminar su progreso
CREATE POLICY "user_progress_delete_policy" ON user_progress
  FOR DELETE
  USING (true);

-- 4. Verificar políticas creadas
SELECT 
    tablename,
    policyname,
    cmd,
    roles
FROM pg_policies 
WHERE schemaname = 'public'
  AND tablename = 'user_progress'
ORDER BY policyname;

-- 5. Mensaje de éxito
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE ' OPCION A: RLS Permissivo configurado';
  RAISE NOTICE '========================================';
  RAISE NOTICE '  user_progress - SELECT policy ✓';
  RAISE NOTICE '  user_progress - INSERT policy ✓';
  RAISE NOTICE '  user_progress - UPDATE policy ✓';
  RAISE NOTICE '  user_progress - DELETE policy ✓';
  RAISE NOTICE '========================================';
  RAISE NOTICE ' ⚠️ SOLO PARA DESARROLLO';
  RAISE NOTICE ' ========================================';
END $$;
