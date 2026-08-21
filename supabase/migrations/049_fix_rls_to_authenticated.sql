-- Fix RLS Policies: Change TO public to TO authenticated
-- This restricts access to authenticated users only (JWT tokens required)
-- Previously: TO public USING(true) allowed anonymous users
-- Now: TO authenticated USING(true) requires Supabase JWT

-- Drop the overly permissive policies created in migration 041
DROP POLICY IF EXISTS "Enable all for authenticated users" ON students;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON vak_results;

-- Create replacement policies restricted to authenticated users
CREATE POLICY "Enable all for authenticated users" ON students
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable all for authenticated users" ON vak_results
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
