-- Idempotent: Add RLS policies — only if tables exist
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'students') THEN
    CREATE POLICY IF NOT EXISTS "Enable all for authenticated users" ON students
      FOR ALL TO public USING (true) WITH CHECK (true);
  END IF;

  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'vak_results') THEN
    CREATE POLICY IF NOT EXISTS "Enable all for authenticated users" ON vak_results
      FOR ALL TO public USING (true) WITH CHECK (true);
  END IF;
END
$$;
