-- ============================================================================
-- 101_cerrar_vistas_expuestas.sql
--
-- parent_contact_info era una vista SECURITY DEFINER con SELECT para anon y
-- authenticated: cualquiera con la clave pública podía leer nombre, email y
-- teléfono de todos los padres de IngenIA vía /rest/v1/parent_contact_info.
-- v_users_by_product exponía conteos internos del negocio de la misma forma.
-- Ningún código del cliente las consulta; solo service_role/admin deben leerlas.
--
-- Aplicada en producción el 2026-10-13 (hallazgo del asesor de seguridad de Supabase).
-- Idempotente.
-- ============================================================================

REVOKE ALL ON public.parent_contact_info FROM anon, authenticated;
REVOKE ALL ON public.v_users_by_product FROM anon, authenticated;
ALTER VIEW public.parent_contact_info SET (security_invoker = on);
ALTER VIEW public.v_users_by_product SET (security_invoker = on);
