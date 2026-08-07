-- ============================================================================
-- Migration 025 — Hardening RLS SmartBoard
-- Reemplaza policies "Service role ... USING(true)/WITH CHECK(true)" que eran
-- alcanzables por la anon key. Las operaciones del backend usan el rol real
-- service_role (bypasea RLS); estas policies protegen el acceso directo desde
-- el cliente con la anon key.
-- ============================================================================

BEGIN;

-- --- POINTS_HISTORY ---------------------------------------------------------
DROP POLICY IF EXISTS "Service role insert points" ON points_history;
CREATE POLICY "Students insert own points"
  ON points_history FOR INSERT
  WITH CHECK (
    student_id = (SELECT id FROM students WHERE auth_id = auth.uid())
  );

-- --- ACADEMIC_CONTEXT -------------------------------------------------------
DROP POLICY IF EXISTS "Service role manage academic context" ON academic_context;
CREATE POLICY "Students insert own academic context"
  ON academic_context FOR INSERT
  WITH CHECK (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()));
CREATE POLICY "Students update own academic context"
  ON academic_context FOR UPDATE
  USING (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()))
  WITH CHECK (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()));

-- --- PARENT_DASHBOARDS ------------------------------------------------------
-- parent_dashboards.student_id -> students.id (UUID de BD). El vinculo
-- parent_student_links usa auth uid (TEXT). El JOIN resuelve ambas.
DROP POLICY IF EXISTS "Parents read own dashboards" ON parent_dashboards;
CREATE POLICY "Parents read linked student dashboards"
  ON parent_dashboards FOR SELECT
  USING (
    parent_email = auth.jwt() ->> 'email'
    OR EXISTS (
      SELECT 1 FROM parent_student_links psl
      JOIN students s ON s.id = parent_dashboards.student_id
      WHERE psl.parent_user_id = auth.uid()::TEXT
        AND psl.student_user_id = s.auth_id::TEXT
        AND psl.is_active = true
    )
  );
DROP POLICY IF EXISTS "Service role manage parent dashboards" ON parent_dashboards;
CREATE POLICY "Parents insert own dashboards"
  ON parent_dashboards FOR INSERT
  WITH CHECK (parent_email = auth.jwt() ->> 'email');

-- --- ACHIEVEMENTS -----------------------------------------------------------
DROP POLICY IF EXISTS "Service role award achievements" ON achievements;
CREATE POLICY "Students insert own achievements"
  ON achievements FOR INSERT
  WITH CHECK (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()));

-- --- LEARNING_STREAKS -------------------------------------------------------
DROP POLICY IF EXISTS "Service role manage streaks" ON learning_streaks;
CREATE POLICY "Students insert own streaks"
  ON learning_streaks FOR INSERT
  WITH CHECK (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()));
CREATE POLICY "Students update own streaks"
  ON learning_streaks FOR UPDATE
  USING (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()))
  WITH CHECK (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()));

-- --- SMARTBOARD_SETTINGS ----------------------------------------------------
DROP POLICY IF EXISTS "Service role create settings" ON smartboard_settings;
CREATE POLICY "Students insert own settings"
  ON smartboard_settings FOR INSERT
  WITH CHECK (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()));

-- --- PARENT_CONSENTS (migration 008) ---------------------------------------
-- student_id referencia auth.users(id) = auth uid del estudiante.
DROP POLICY IF EXISTS "Service role can insert consent records" ON parent_consents;
DROP POLICY IF EXISTS "Service role can update consent records" ON parent_consents;
CREATE POLICY "Students insert own consent"
  ON parent_consents FOR INSERT
  WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students update own consent"
  ON parent_consents FOR UPDATE
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

-- --- CRISIS_ALERTS (migration 009) -----------------------------------------
-- Solo el estudiante crea su propia alerta (backend usa service_role)
DROP POLICY IF EXISTS "Service role can manage crisis alerts" ON crisis_alerts;
CREATE POLICY "Students insert own crisis alerts"
  ON crisis_alerts FOR INSERT
  WITH CHECK (auth.uid() = student_id);

COMMIT;
