-- ============================================================================
-- Migration 060 — RLS OWNERSHIP FIX
--
-- Cierra las vulnerabilidades confirmadas en staging (2026-08-29):
--   - 041/049: "Enable all for authenticated users" FOR ALL USING(true) en
--     students y vak_results → cualquier autenticado leía/edita/borra perfiles
--     de menores.
--   - 042: políticas permisivas FOR ALL TO authenticated en timetable.
--
-- Reemplaza por políticas de OWN-ROW + service_role. Los padres acceden vía
-- backend (service_role); no hay políticas RLS de padre directo en estas
-- tablas (diseño: el backend impone ownership con requireStudentAccess).
-- Idempotente: DROP POLICY IF EXISTS + CREATE con guard.
-- ============================================================================

-- ── 1. Eliminar políticas permisivas ────────────────────────────────────────
DROP POLICY IF EXISTS "Enable all for authenticated users" ON students;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON vak_results;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON student_timetable;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON timetable_slots;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON student_exams;

-- ── 2. students: SELECT own (011) + INSERT own (045) + heartbeat (032) ya
--         existen. Asegurar service_role FOR ALL (026 lo crea, guard por
--         si acaso).
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'students' AND policyname = 'Service role manage all students') THEN
    CREATE POLICY "Service role manage all students" ON students
      FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ── 3. vak_results: uses user_id (TEXT = auth_id), not student_id ──────────
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'vak_results' AND policyname = 'Students read own vak') THEN
    CREATE POLICY "Students read own vak" ON vak_results
      FOR SELECT USING (user_id = auth.uid()::TEXT);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'vak_results' AND policyname = 'Students create vak') THEN
    CREATE POLICY "Students create vak" ON vak_results
      FOR INSERT WITH CHECK (user_id = auth.uid()::TEXT);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'vak_results' AND policyname = 'Service role manage vak') THEN
    CREATE POLICY "Service role manage vak" ON vak_results
      FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ── 4. student_timetable: own-row + service ────────────────────────────────
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'student_timetable' AND policyname = 'Students read own timetable') THEN
    CREATE POLICY "Students read own timetable" ON student_timetable
      FOR SELECT USING (student_id IN (SELECT id FROM students WHERE auth_id = auth.uid()));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'student_timetable' AND policyname = 'Students write own timetable') THEN
    CREATE POLICY "Students write own timetable" ON student_timetable
      FOR INSERT WITH CHECK (student_id IN (SELECT id FROM students WHERE auth_id = auth.uid()));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'student_timetable' AND policyname = 'Students update own timetable') THEN
    CREATE POLICY "Students update own timetable" ON student_timetable
      FOR UPDATE USING (student_id IN (SELECT id FROM students WHERE auth_id = auth.uid()))
      WITH CHECK (student_id IN (SELECT id FROM students WHERE auth_id = auth.uid()));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'student_timetable' AND policyname = 'Service role manage timetable') THEN
    CREATE POLICY "Service role manage timetable" ON student_timetable
      FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ── 5. timetable_slots: own-row vía timetable + service ────────────────────
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'timetable_slots' AND policyname = 'Students read own slots') THEN
    CREATE POLICY "Students read own slots" ON timetable_slots
      FOR SELECT USING (timetable_id IN (
        SELECT id FROM student_timetable WHERE student_id IN (SELECT id FROM students WHERE auth_id = auth.uid())
      ));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'timetable_slots' AND policyname = 'Students write own slots') THEN
    CREATE POLICY "Students write own slots" ON timetable_slots
      FOR INSERT WITH CHECK (timetable_id IN (
        SELECT id FROM student_timetable WHERE student_id IN (SELECT id FROM students WHERE auth_id = auth.uid())
      ));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'timetable_slots' AND policyname = 'Students update own slots') THEN
    CREATE POLICY "Students update own slots" ON timetable_slots
      FOR UPDATE USING (timetable_id IN (
        SELECT id FROM student_timetable WHERE student_id IN (SELECT id FROM students WHERE auth_id = auth.uid())
      ))
      WITH CHECK (timetable_id IN (
        SELECT id FROM student_timetable WHERE student_id IN (SELECT id FROM students WHERE auth_id = auth.uid())
      ));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'timetable_slots' AND policyname = 'Students delete own slots') THEN
    CREATE POLICY "Students delete own slots" ON timetable_slots
      FOR DELETE USING (timetable_id IN (
        SELECT id FROM student_timetable WHERE student_id IN (SELECT id FROM students WHERE auth_id = auth.uid())
      ));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'timetable_slots' AND policyname = 'Service role manage slots') THEN
    CREATE POLICY "Service role manage slots" ON timetable_slots
      FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ── 6. student_exams: own-row + service ────────────────────────────────────
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'student_exams' AND policyname = 'Students read own exams') THEN
    CREATE POLICY "Students read own exams" ON student_exams
      FOR SELECT USING (student_id IN (SELECT id FROM students WHERE auth_id = auth.uid()));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'student_exams' AND policyname = 'Students write own exams') THEN
    CREATE POLICY "Students write own exams" ON student_exams
      FOR INSERT WITH CHECK (student_id IN (SELECT id FROM students WHERE auth_id = auth.uid()));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'student_exams' AND policyname = 'Students update own exams') THEN
    CREATE POLICY "Students update own exams" ON student_exams
      FOR UPDATE USING (student_id IN (SELECT id FROM students WHERE auth_id = auth.uid()))
      WITH CHECK (student_id IN (SELECT id FROM students WHERE auth_id = auth.uid()));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'student_exams' AND policyname = 'Students delete own exams') THEN
    CREATE POLICY "Students delete own exams" ON student_exams
      FOR DELETE USING (student_id IN (SELECT id FROM students WHERE auth_id = auth.uid()));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'student_exams' AND policyname = 'Service role manage exams') THEN
    CREATE POLICY "Service role manage exams" ON student_exams
      FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;
