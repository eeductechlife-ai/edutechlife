-- ============================================================================
-- 104_aviso_padre_login.sql
-- Registro anti-spam del aviso al padre/acudiente cuando un menor inicia
-- sesión en IngenIA (services/avisoPadreLogin.js). Máximo un correo por niño
-- cada 24 horas.
--
-- NO APLICADA. Se aplica manualmente tras revisión del CEO (SQL Editor de
-- Supabase). Hasta entonces el servicio registra "error_inesperado" en logs y
-- no envía nada: el inicio de sesión sigue funcionando.
--
-- Convención de 095: tablas de niños y padres en el esquema smartboard, con
-- una vista pública security_invoker para que PostgREST (el backend) las vea.
-- ============================================================================

CREATE TABLE IF NOT EXISTS smartboard.aviso_padre_login (
  student_id      UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  ultimo_aviso_at TIMESTAMPTZ NOT NULL
);

ALTER TABLE smartboard.aviso_padre_login ENABLE ROW LEVEL SECURITY;

-- Sin políticas: solo el backend (service_role, que omite RLS) lee y escribe.
-- Ni alumnos ni padres acceden a este registro desde el cliente.

CREATE OR REPLACE VIEW public.aviso_padre_login
  WITH (security_invoker = on) AS
  SELECT * FROM smartboard.aviso_padre_login;

GRANT USAGE ON SCHEMA smartboard TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON smartboard.aviso_padre_login TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.aviso_padre_login TO service_role;
