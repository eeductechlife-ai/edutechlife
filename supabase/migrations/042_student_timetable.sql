-- ============================================================================
-- Migration 042 — Student Timetable + Exams (Horario Escolar)
-- Idempotente. El ownership se valida en capa de app; las políticas de 041/049
-- son permisivas (TO authenticated). Se mantienen con guard.
-- ============================================================================

CREATE TABLE IF NOT EXISTS student_timetable (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  school_name TEXT,
  term_label TEXT,
  term_start DATE,
  term_end DATE,
  timezone TEXT NOT NULL DEFAULT 'America/Bogota',
  source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'scan', 'import')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_student_timetable_student ON student_timetable(student_id);
CREATE INDEX IF NOT EXISTS idx_student_timetable_active ON student_timetable(student_id, is_active);
CREATE UNIQUE INDEX IF NOT EXISTS uq_student_timetable_active
  ON student_timetable(student_id) WHERE is_active = true;

CREATE TABLE IF NOT EXISTS timetable_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timetable_id UUID NOT NULL REFERENCES student_timetable(id) ON DELETE CASCADE,
  day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  subject TEXT NOT NULL,
  subject_label TEXT,
  teacher TEXT,
  room TEXT,
  color TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (end_time > start_time)
);

CREATE INDEX IF NOT EXISTS idx_timetable_slots_timetable ON timetable_slots(timetable_id);
CREATE INDEX IF NOT EXISTS idx_timetable_slots_day ON timetable_slots(timetable_id, day_of_week, start_time);

CREATE TABLE IF NOT EXISTS student_exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  slot_id UUID REFERENCES timetable_slots(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  exam_name TEXT,
  exam_date DATE NOT NULL,
  exam_time TIME,
  topic TEXT,
  desired_grade INTEGER CHECK (desired_grade BETWEEN 0 AND 100),
  source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'scan', 'timetable_inferred')),
  file_url TEXT,
  reminded_at JSONB DEFAULT '[]'::JSONB,
  completed BOOLEAN NOT NULL DEFAULT false,
  result_score NUMERIC(4,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_student_exams_student ON student_exams(student_id);
CREATE INDEX IF NOT EXISTS idx_student_exams_upcoming ON student_exams(student_id, exam_date) WHERE completed = false;
CREATE INDEX IF NOT EXISTS idx_student_exams_date ON student_exams(exam_date);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_student_timetable_updated_at ON student_timetable;
CREATE TRIGGER trg_student_timetable_updated_at
  BEFORE UPDATE ON student_timetable
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_timetable_slots_updated_at ON timetable_slots;
CREATE TRIGGER trg_timetable_slots_updated_at
  BEFORE UPDATE ON timetable_slots
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_student_exams_updated_at ON student_exams;
CREATE TRIGGER trg_student_exams_updated_at
  BEFORE UPDATE ON student_exams
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE student_timetable ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_exams ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'student_timetable' AND policyname = 'Enable all for authenticated users') THEN
    CREATE POLICY "Enable all for authenticated users" ON student_timetable FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'timetable_slots' AND policyname = 'Enable all for authenticated users') THEN
    CREATE POLICY "Enable all for authenticated users" ON timetable_slots FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'student_exams' AND policyname = 'Enable all for authenticated users') THEN
    CREATE POLICY "Enable all for authenticated users" ON student_exams FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;
