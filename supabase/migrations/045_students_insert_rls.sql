-- Idempotent: Allow authenticated users to INSERT their own student row
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'students')
     AND NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'students' AND policyname = 'Students insert own profile') THEN
    CREATE POLICY "Students insert own profile"
      ON students FOR INSERT TO authenticated
      WITH CHECK (auth.uid() = auth_id);
  END IF;
END
$$;
