-- Idempotent: Allow authenticated users to INSERT their own student row
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'students') THEN
    CREATE POLICY IF NOT EXISTS "Students insert own profile"
      ON students FOR INSERT TO authenticated
      WITH CHECK (auth.uid() = auth_id);
  END IF;
END
$$;
