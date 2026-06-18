-- Fix: smartboard_kids_data.user_id debe ser TEXT, no UUID
-- Clerk usa IDs tipo "user_3DxkPuia6YoJf66AKOc0j36CeSA" que no son UUIDs
-- Primero hay que dropear las políticas que dependen de user_id

DROP POLICY IF EXISTS smartboard_select_own ON smartboard_kids_data;
DROP POLICY IF EXISTS smartboard_insert_own ON smartboard_kids_data;
DROP POLICY IF EXISTS smartboard_update_own ON smartboard_kids_data;
DROP POLICY IF EXISTS smartboard_delete_own ON smartboard_kids_data;
DROP POLICY IF EXISTS smartboard_admin_all ON smartboard_kids_data;

ALTER TABLE smartboard_kids_data ALTER COLUMN user_id TYPE TEXT;

-- Recrear políticas con user_id como TEXT
CREATE POLICY "smartboard_select_own" ON smartboard_kids_data
  FOR SELECT
  USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "smartboard_insert_own" ON smartboard_kids_data
  FOR INSERT
  WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "smartboard_update_own" ON smartboard_kids_data
  FOR UPDATE
  USING (auth.jwt() ->> 'sub' = user_id)
  WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "smartboard_delete_own" ON smartboard_kids_data
  FOR DELETE
  USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "smartboard_admin_all" ON smartboard_kids_data
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');
