-- ============================================
-- FIX: auth.uid() → auth.jwt() ->> 'sub'
-- 
-- auth.uid() SIEMPRE retorna UUID en PostgreSQL.
-- El JWT de Clerk usa sub = user_xxx (no UUID),
-- causando: "invalid input syntax for type uuid"
-- 
-- auth.jwt() retorna el payload del JWT como JSON.
-- auth.jwt() ->> 'sub' extrae 'sub' como texto,
-- compatible con user_progress.user_id (TEXT).
-- ============================================

-- 1. Eliminar políticas actuales
DROP POLICY IF EXISTS "user_progress_select_policy" ON user_progress;
DROP POLICY IF EXISTS "user_progress_insert_policy" ON user_progress;
DROP POLICY IF EXISTS "user_progress_update_policy" ON user_progress;
DROP POLICY IF EXISTS "user_progress_delete_policy" ON user_progress;

-- 2. Crear políticas con auth.jwt() en vez de auth.uid()
-- SELECT
CREATE POLICY "user_progress_select_policy" ON user_progress
  FOR SELECT
  USING ((auth.jwt() ->> 'sub') = user_id);

-- INSERT
CREATE POLICY "user_progress_insert_policy" ON user_progress
  FOR INSERT
  WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

-- UPDATE
CREATE POLICY "user_progress_update_policy" ON user_progress
  FOR UPDATE
  USING ((auth.jwt() ->> 'sub') = user_id);

-- DELETE
CREATE POLICY "user_progress_delete_policy" ON user_progress
  FOR DELETE
  USING ((auth.jwt() ->> 'sub') = user_id);

-- 3. Verificar políticas actualizadas
SELECT
    tablename,
    policyname,
    cmd,
    roles,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'user_progress'
ORDER BY policyname;

-- 4. Mensaje de éxito
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '===============================================';
  RAISE NOTICE ' FIX: auth.jwt() ->> sub aplicado';
  RAISE NOTICE '===============================================';
  RAISE NOTICE '  user_progress - SELECT (auth.jwt()->sub) ✓';
  RAISE NOTICE '  user_progress - INSERT (auth.jwt()->sub) ✓';
  RAISE NOTICE '  user_progress - UPDATE (auth.jwt()->sub) ✓';
  RAISE NOTICE '  user_progress - DELETE (auth.jwt()->sub) ✓';
  RAISE NOTICE '===============================================';
  RAISE NOTICE ' Compatible con Clerk sub = user_xxx';
  RAISE NOTICE '===============================================';
END $$;
