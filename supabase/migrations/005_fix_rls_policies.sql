-- Fix RLS Policies: current_user → auth.uid()
-- Las políticas existentes usan `current_user` que retorna el rol de Postgres
-- (ej. 'authenticated', 'anon'), NO el ID del usuario. Esto significa que
-- cualquier usuario autenticado puede modificar datos de cualquier otro.
-- auth.uid() retorna el UUID real del usuario autenticado vía Clerk JWT.

-- Forum comments
DROP POLICY IF EXISTS "comments_insert_own" ON forum_comments;
DROP POLICY IF EXISTS "comments_update_own" ON forum_comments;
CREATE POLICY "comments_insert_own" ON forum_comments
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "comments_update_own" ON forum_comments
  FOR UPDATE USING (user_id = auth.uid());

-- Forum bookmarks
DROP POLICY IF EXISTS "bookmarks_insert_own" ON forum_bookmarks;
DROP POLICY IF EXISTS "bookmarks_delete_own" ON forum_bookmarks;
CREATE POLICY "bookmarks_insert_own" ON forum_bookmarks
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "bookmarks_delete_own" ON forum_bookmarks
  FOR DELETE USING (user_id = auth.uid());

-- Forum notifications
DROP POLICY IF EXISTS "notifications_read_own" ON forum_notifications;
DROP POLICY IF EXISTS "notifications_update_own" ON forum_notifications;
CREATE POLICY "notifications_read_own" ON forum_notifications
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "notifications_update_own" ON forum_notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Profiles (if exists)
DROP POLICY IF EXISTS "profiles_read_own" ON forum_profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON forum_profiles;
CREATE POLICY "profiles_read_own" ON forum_profiles
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "profiles_update_own" ON forum_profiles
  FOR UPDATE USING (user_id = auth.uid());

-- Verificar otras tablas existentes que puedan tener el mismo problema
DO $$
DECLARE
  pol record;
  affected integer := 0;
BEGIN
  FOR pol IN
    SELECT schemaname, tablename, policyname, qual
    FROM pg_policies
    WHERE qual IS NOT NULL
      AND (qual::text ~* 'current_user' OR with_check::text ~* 'current_user')
  LOOP
    RAISE WARNING 'Policy "%" on %.% uses current_user instead of auth.uid(): %', pol.policyname, pol.schemaname, pol.tablename, pol.qual;
    affected := affected + 1;
  END LOOP;
  IF affected = 0 THEN
    RAISE NOTICE '✓ No se encontraron más políticas con current_user';
  ELSE
    RAISE WARNING '⚠ Se encontraron % políticas con current_user — revisar manualmente', affected;
  END IF;
END $$;
