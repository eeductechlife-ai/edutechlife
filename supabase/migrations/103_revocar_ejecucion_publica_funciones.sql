-- ============================================================================
-- 103_revocar_ejecucion_publica_funciones.sql
--
-- Asesor de seguridad de Supabase (2026-10-13): funciones SECURITY DEFINER
-- ejecutables por el rol anon.
--   * handle_new_user: disparador de auth.users. Nadie la invoca por API.
--   * assign_peer_reviews: la app la llama solo con sesión iniciada.
-- No se tocan get_my_institution_id (la usan las políticas RLS), ialab_leaderboard
-- ni verify_certificate (consulta pública de certificados, intencional).
-- Aplicada en producción el 2026-10-13. Idempotente.
-- ============================================================================

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.assign_peer_reviews(text, integer, timestamptz) FROM anon, public;
