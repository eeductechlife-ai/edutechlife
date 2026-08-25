-- Idempotent: Fix RLS Policies to restrict TO authenticated users
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'students') THEN
    DROP POLICY IF EXISTS "Enable all for authenticated users" ON students;
    CREATE POLICY "Enable all for authenticated users" ON students
      FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;

  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'vak_results') THEN
    DROP POLICY IF EXISTS "Enable all for authenticated users" ON vak_results;
    CREATE POLICY "Enable all for authenticated users" ON vak_results
      FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END
$$;
