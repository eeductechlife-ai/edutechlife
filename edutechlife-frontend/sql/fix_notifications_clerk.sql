-- ============================================
-- FIX: NOTIFICATIONS TABLE - Clerk Compatibility
-- Ejecutar en Supabase SQL Editor
-- ============================================
-- ORDEN IMPORTANTE: Primero eliminar políticas, luego cambiar tipo

-- Paso 1: Eliminar TODAS las políticas existentes (dependen de user_id)
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "System can insert notifications" ON notifications;
DROP POLICY IF EXISTS "Users can insert own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON notifications;
DROP POLICY IF EXISTS "Service role can manage all notifications" ON notifications;
DROP POLICY IF EXISTS "Service role full access" ON notifications;

-- Paso 2: Ahora SÍ se puede cambiar el tipo
ALTER TABLE notifications ALTER COLUMN user_id TYPE TEXT;

-- Paso 3: Eliminar la foreign key (ya no aplica a auth.users)
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;

-- Paso 4: Verificar cambio
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'notifications' AND column_name = 'user_id';
-- Debe mostrar: user_id | text

-- Paso 5: Recrear políticas compatibles con Clerk JWT
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert own notifications" ON notifications
  FOR INSERT WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can delete own notifications" ON notifications
  FOR DELETE USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Service role full access" ON notifications
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Paso 6: Verificar políticas creadas
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'notifications';
-- Debe mostrar 5 políticas
