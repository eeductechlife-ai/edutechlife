-- ============================================================================
-- 114_cerrar_rls_permisiva.sql
-- Re-auditoría de seguridad oct-2026, hallazgo S2 (paso 2 de 2).
--
-- Verificado en producción el 2026-10-20: cinco tablas tenían políticas
-- USING (true) / WITH CHECK (true) para el rol public, además de todos los
-- privilegios de tabla para anon. Con la clave pública (va en el JS del sitio)
-- cualquiera podía:
--   profiles           leer, crear, modificar y borrar (nombre, correo, teléfono)
--   activity_log       leer, crear, modificar y borrar
--   notifications      leer, crear, modificar y borrar
--   quiz_attempts      leer, crear, modificar y borrar
--   notification_logs  crear y modificar (envíos de alertas de crisis)
--
-- Las políticas se suman con OR: una sola USING (true) anula las correctas.
-- notifications, quiz_attempts y notification_logs ya tenían políticas "solo
-- lo propio"; aquí se quitan las abiertas y quedan esas. profiles y
-- activity_log reciben políticas "solo lo propio" nuevas.
--
-- Qué sigue funcionando (revisado en el frontend de main):
--   - Perfil: el usuario lee y cambia su teléfono (useProfileData).
--   - Actividad: el usuario lee e inserta su actividad (useActivityTracker,
--     useSessionTracker). El padre vinculado lee la de su hijo activo
--     (activity_log_select_padre) para el panel en vivo.
--   - Notificaciones: leer, marcar como leídas, borrar e insertar las propias.
--   - Nombres de otros en ranking, racha y foro: función perfiles_publicos (113).
--   - El backend usa service_role, que omite RLS.
--   - Las filas de profiles las crea handle_new_user (SECURITY DEFINER).
--
-- Orden: 113 → desplegar el frontend de este PR → 114.
-- NO APLICADA. Se aplica manualmente tras revisión del CEO (SQL Editor de
-- Supabase), con copia de seguridad previa.
--
-- Deshacer (restaura el estado abierto; solo ante una rotura grave):
--   ver el bloque comentado al final del archivo.
-- ============================================================================

BEGIN;

-- ── profiles ────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Allow anon to read profiles"   ON public.profiles;
DROP POLICY IF EXISTS "Allow anon to insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow anon to update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow anon to delete profiles" ON public.profiles;

DROP POLICY IF EXISTS profiles_select_own ON public.profiles;
CREATE POLICY profiles_select_own ON public.profiles
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid())::text = id);

DROP POLICY IF EXISTS profiles_update_own ON public.profiles;
CREATE POLICY profiles_update_own ON public.profiles
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid())::text = id)
  WITH CHECK ((SELECT auth.uid())::text = id);

REVOKE ALL ON public.profiles FROM anon;
REVOKE ALL ON public.profiles FROM authenticated;
GRANT SELECT ON public.profiles TO authenticated;
-- Solo columnas de datos personales editables: nunca role ni security_violations.
GRANT UPDATE (full_name, avatar_url, phone, updated_at) ON public.profiles TO authenticated;

-- ── activity_log ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Enable all for authenticated users" ON public.activity_log;

DROP POLICY IF EXISTS activity_log_select_own ON public.activity_log;
CREATE POLICY activity_log_select_own ON public.activity_log
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid())::text = user_id);

DROP POLICY IF EXISTS activity_log_insert_own ON public.activity_log;
CREATE POLICY activity_log_insert_own ON public.activity_log
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid())::text = user_id);

-- El padre vinculado ve la actividad de su hijo (panel de padres, en vivo).
DROP POLICY IF EXISTS activity_log_select_padre ON public.activity_log;
CREATE POLICY activity_log_select_padre ON public.activity_log
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.parent_student_links l
    WHERE l.student_user_id = activity_log.user_id
      AND l.parent_user_id = (SELECT auth.uid())::text
      AND l.is_active
  ));

REVOKE ALL ON public.activity_log FROM anon;
REVOKE ALL ON public.activity_log FROM authenticated;
GRANT SELECT, INSERT ON public.activity_log TO authenticated;

-- ── notifications ───────────────────────────────────────────────────────────
-- Quedan notifications_select_own / insert_own / update_own / delete_own.
DROP POLICY IF EXISTS "Enable all for authenticated users" ON public.notifications;

REVOKE ALL ON public.notifications FROM anon;
REVOKE TRUNCATE, REFERENCES, TRIGGER ON public.notifications FROM authenticated;

-- ── quiz_attempts ───────────────────────────────────────────────────────────
-- Quedan quiz_attempts_own (SELECT) y quiz_attempts_insert_own (INSERT).
DROP POLICY IF EXISTS quiz_all_policy    ON public.quiz_attempts;
DROP POLICY IF EXISTS quiz_insert_policy ON public.quiz_attempts;

REVOKE ALL ON public.quiz_attempts FROM anon;
REVOKE UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.quiz_attempts FROM authenticated;

-- ── notification_logs ───────────────────────────────────────────────────────
-- Las escribe solo el backend (service_role omite RLS). Queda
-- notification_logs_select_own para que el padre lea las suyas.
DROP POLICY IF EXISTS notification_logs_service_insert ON public.notification_logs;
DROP POLICY IF EXISTS notification_logs_service_update ON public.notification_logs;

REVOKE ALL ON public.notification_logs FROM anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.notification_logs FROM authenticated;

-- ── Comprobación: ninguna política abierta para clientes en estas tablas ────
DO $$
DECLARE
  abiertas text;
BEGIN
  SELECT string_agg(tablename || '.' || policyname, ', ')
    INTO abiertas
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename IN ('profiles', 'activity_log', 'notifications', 'quiz_attempts', 'notification_logs')
    AND (qual = 'true' OR with_check = 'true')
    AND NOT roles <@ ARRAY['service_role']::name[];

  IF abiertas IS NOT NULL THEN
    RAISE EXCEPTION 'Siguen abiertas: %', abiertas;
  END IF;
END $$;

COMMIT;

-- ── Deshacer (NO ejecutar salvo rotura grave; reabre la exposición) ─────────
-- BEGIN;
-- DROP POLICY IF EXISTS profiles_select_own ON public.profiles;
-- DROP POLICY IF EXISTS profiles_update_own ON public.profiles;
-- DROP POLICY IF EXISTS activity_log_select_own ON public.activity_log;
-- DROP POLICY IF EXISTS activity_log_insert_own ON public.activity_log;
-- CREATE POLICY "Allow anon to read profiles" ON public.profiles FOR SELECT USING (true);
-- CREATE POLICY "Allow anon to update profiles" ON public.profiles FOR UPDATE USING (true);
-- CREATE POLICY "Enable all for authenticated users" ON public.activity_log FOR ALL USING (true);
-- CREATE POLICY "Enable all for authenticated users" ON public.notifications FOR ALL USING (true);
-- GRANT ALL ON public.profiles, public.activity_log, public.notifications TO anon, authenticated;
-- COMMIT;
