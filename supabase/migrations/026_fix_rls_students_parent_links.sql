-- ============================================================================
-- Migration 026 — Fix RLS students + parent_student_links
--
-- Cierre de las fugas CRITICAL encontradas en la auditoría:
--   A4: "Service role manage all students" (011) era FOR ALL USING(true)
--       WITH CHECK(true) sin TO service_role -> la anon key podia leer,
--       crear, editar y borrar los perfiles de TODOS los menores.
--   A5: "service role manage links" (023) igualmente USING(true) sin
--       rol -> cualquiera podia leer todos los vinculos padre-hijo, y
--       "parents manage own links" (FOR ALL) permitia a un padre
--       auto-vincularse a cualquier estudiante (escalada de lectura).
--
-- El backend opera con service_role (bypasea RLS); estas policies solo
-- abren el acceso legítimo del cliente autenticado.
-- ============================================================================

BEGIN;

-- --- STUDENTS ----------------------------------------------------------------
-- El frontend solo LEE su propio perfil (auth_id = auth.uid()); los
-- INSERT/UPDATE/DELETE los hace el backend con service_role. Restringimos
-- la policy "manage all" al rol service_role y dejamos al estudiante
-- unicamente la seleccion de su propio perfil. Se elimina el UPDATE propio
-- para impedir que un menor se auto-exima del gate de edad editando su
-- students.age (la edad confiable vive en parent_consents.student_age).
DROP POLICY IF EXISTS "Service role manage all students" ON students;
CREATE POLICY "Service role manage all students"
  ON students FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Students update own profile" ON students;

-- --- PARENT_STUDENT_LINKS ----------------------------------------------------
-- Los vínculos SOLO los crea el backend tras verificar el consentimiento
-- (authService.js). El padre puede listar sus propios vínculos y eliminar
-- los suyos (derecho de supresión); ningún cliente puede insertar vínculos.
DROP POLICY IF EXISTS "parents manage own links" ON parent_student_links;
CREATE POLICY "Parents read own links"
  ON parent_student_links FOR SELECT
  USING (auth.uid()::TEXT = parent_user_id);
CREATE POLICY "Parents delete own links"
  ON parent_student_links FOR DELETE
  USING (auth.uid()::TEXT = parent_user_id);

DROP POLICY IF EXISTS "service role manage links" ON parent_student_links;
CREATE POLICY "service role manage links"
  ON parent_student_links FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

COMMIT;