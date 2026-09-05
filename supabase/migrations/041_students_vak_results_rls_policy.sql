-- Idempotent: Add RLS policies — only if tables exist
-- (CREATE POLICY no soporta IF NOT EXISTS; se guarda con pg_policies)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'students')
     AND NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'students' AND policyname = 'Enable all for authenticated users') THEN
    CREATE POLICY "Enable all for authenticated users" ON students
      FOR ALL TO public USING (true) WITH CHECK (true);
  END IF;

  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'vak_results')
     AND NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'vak_results' AND policyname = 'Enable all for authenticated users') THEN
    CREATE POLICY "Enable all for authenticated users" ON vak_results
      FOR ALL TO public USING (true) WITH CHECK (true);
  END IF;
END
$$;
