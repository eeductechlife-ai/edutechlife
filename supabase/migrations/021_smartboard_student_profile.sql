-- SmartBoard Student Profile: Add school and grade info
-- Stores school context for personalized learning and institutional reporting

ALTER TABLE students
ADD COLUMN IF NOT EXISTS school TEXT,
ADD COLUMN IF NOT EXISTS grade TEXT;

-- Index for school-based queries (for institutional analytics)
CREATE INDEX IF NOT EXISTS idx_students_school ON students(school);
CREATE INDEX IF NOT EXISTS idx_students_grade ON students(grade);

-- RLS policies already cover these new columns (inherited from students table)
