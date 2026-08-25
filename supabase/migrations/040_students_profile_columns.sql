-- Idempotent: only applies if table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'students') THEN
    -- Add missing profile columns to students table
    -- vak_style: short text label (visual/auditivo/kinestesico)
    -- school: institution name
    -- grade: school grade (e.g. "Quinto", "7")
    -- All use IF NOT EXISTS to be safe on databases that already have them

ALTER TABLE students ADD COLUMN IF NOT EXISTS vak_style TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS school  TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS grade   TEXT;

    -- Also make age nullable so profiles can be created without age first
ALTER TABLE students ALTER COLUMN age DROP NOT NULL;

    -- Note: vak_result_json does not exist in production; no data migration needed.
  END IF;
END
$$;
