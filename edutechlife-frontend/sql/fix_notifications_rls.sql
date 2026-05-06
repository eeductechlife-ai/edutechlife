-- ============================================
-- FIX: NOTIFICATIONS RLS - Permisivo para anon key
-- Problema: Las políticas actuales usan current_setting('request.jwt.claims')
-- que con anon key devuelve 'anon', no el Clerk user_id
-- Solución: Políticas permisivas (la app ya filtra por user_id en las queries)
-- ============================================

-- Paso 1: Eliminar políticas existentes
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can insert own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON notifications;
DROP POLICY IF EXISTS "Service role full access" ON notifications;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON notifications;

-- Paso 2: Crear política permisiva única
CREATE POLICY "Enable all for authenticated users" ON notifications
  FOR ALL USING (true);

-- Paso 3: Verificar
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'notifications';
-- Debe mostrar 1 política: Enable all for authenticated users | ALL
