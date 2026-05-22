-- ============================================
-- OPCION B: Políticas RLS Seguras para Producción
-- Requiere: JWT de Clerk configurado en Supabase
-- Ejecutar DESPUES de configurar Clerk JWT Template
-- ============================================

-- PRE-REQUISITOS:
-- 1. En Clerk Dashboard → JWT Templates, crear template llamado 'supabase'
--    con claims: sub={{user.id}}, role=authenticated
-- 2. En Supabase Dashboard → Project Settings → API → JWT Settings:
--    - Habilitar "Use external JWT provider"
--    - Agregar la clave pública de Clerk
-- 3. Configurar las políticas RLS seguras:

-- 1. Habilitar RLS en user_progress
ALTER TABLE IF EXISTS user_progress ENABLE ROW LEVEL SECURITY;

-- 2. Eliminar políticas permissivas de desarrollo
DROP POLICY IF EXISTS "user_progress_select_policy" ON user_progress;
DROP POLICY IF EXISTS "user_progress_insert_policy" ON user_progress;
DROP POLICY IF EXISTS "user_progress_update_policy" ON user_progress;
DROP POLICY IF EXISTS "user_progress_delete_policy" ON user_progress;
DROP POLICY IF EXISTS "Allow anon to read user_progress" ON user_progress;

-- 3. Crear políticas seguras basadas en auth.uid()
-- NOTA: user_progress.user_id es TEXT, auth.uid() es UUID → castear con ::text
-- SELECT: usuarios solo pueden ver su propio progreso
CREATE POLICY "user_progress_select_policy" ON user_progress
  FOR SELECT
  USING (auth.uid()::text = user_id);

-- INSERT: usuarios solo pueden crear progreso para sí mismos
CREATE POLICY "user_progress_insert_policy" ON user_progress
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- UPDATE: usuarios solo pueden actualizar su propio progreso
CREATE POLICY "user_progress_update_policy" ON user_progress
  FOR UPDATE
  USING (auth.uid()::text = user_id);

-- DELETE: usuarios solo pueden eliminar su propio progreso
CREATE POLICY "user_progress_delete_policy" ON user_progress
  FOR DELETE
  USING (auth.uid()::text = user_id);

-- 4. Verificar políticas
SELECT 
    tablename,
    policyname,
    cmd,
    roles,
    qual
FROM pg_policies 
WHERE schemaname = 'public'
  AND tablename = 'user_progress'
ORDER BY policyname;

-- 5. Mensaje de éxito
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE ' OPCION B: RLS Seguro configurado';
  RAISE NOTICE '========================================';
  RAISE NOTICE '  user_progress - SELECT (auth.uid()::text = user_id) ✓';
  RAISE NOTICE '  user_progress - INSERT (auth.uid()::text = user_id) ✓';
  RAISE NOTICE '  user_progress - UPDATE (auth.uid()::text = user_id) ✓';
  RAISE NOTICE '  user_progress - DELETE (auth.uid()::text = user_id) ✓';
  RAISE NOTICE '========================================';
  RAISE NOTICE ' 🔒 REQUIERE JWT DE CLERK CONFIGURADO';
  RAISE NOTICE ' ========================================';
END $$;
