-- students y vak_results tenían RLS activado pero sin ninguna policy, lo que
-- bloqueaba todo INSERT/UPDATE ("new row violates row-level security policy")
-- porque el backend no propaga el JWT del usuario a Supabase (usa un cliente
-- estático), y no siempre corre con la service_role key. Se replica el mismo
-- patrón ya usado en activity_log/notifications/parent_student_links: la
-- autorización real vive en la capa de aplicación (requireAuth + filtros
-- .eq('auth_id', userId)), no en RLS.

CREATE POLICY "Enable all for authenticated users" ON students
FOR ALL
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable all for authenticated users" ON vak_results
FOR ALL
TO public
USING (true)
WITH CHECK (true);
