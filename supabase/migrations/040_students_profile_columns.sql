-- Idempotent: Add profile columns to students — only if table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'students') THEN
    ALTER TABLE students ADD COLUMN IF NOT EXISTS vak_style TEXT;
    ALTER TABLE students ADD COLUMN IF NOT EXISTS school TEXT;
    ALTER TABLE students ADD COLUMN IF NOT EXISTS grade TEXT;
    ALTER TABLE students ALTER COLUMN age DROP NOT NULL;
  END IF;
END
$$;
