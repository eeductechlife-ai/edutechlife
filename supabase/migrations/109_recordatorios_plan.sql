-- ============================================================================
-- 109_recordatorios_plan.sql
-- Registro anti-spam de los recordatorios de vencimiento de planes pagados
-- (edutechlife-backend/src/services/recordatorioVencimiento.js). Un correo a
-- 7 días y otro a 1 día antes de paidUntil, una sola vez por tipo y periodo.
--
-- NO APLICADA. Se aplica manualmente tras revisión del CEO (SQL Editor de
-- Supabase, primero en staging). Hasta entonces el job registra un error y no
-- envía nada: sin esta tabla no hay anti-spam, así que no se envía.
--
-- Un periodo se identifica por periodo_hasta (la fecha de vencimiento pagada).
-- Cuando el titular paga otra vez, el nuevo periodo tiene otra fecha y recibe
-- sus propios avisos.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.recordatorios_plan (
  id            BIGSERIAL PRIMARY KEY,
  titular_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  producto      TEXT NOT NULL CHECK (producto IN ('ialab', 'ingenia')),
  tipo          TEXT NOT NULL CHECK (tipo IN ('7d', '1d')),
  periodo_hasta TIMESTAMPTZ NOT NULL,
  enviado_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT recordatorios_plan_unico UNIQUE (titular_id, producto, tipo, periodo_hasta)
);

ALTER TABLE public.recordatorios_plan ENABLE ROW LEVEL SECURITY;

-- Sin políticas: solo el backend (service_role, que omite RLS) lee y escribe.
-- Ni alumnos ni padres acceden a este registro desde el cliente.
REVOKE ALL ON public.recordatorios_plan FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.recordatorios_plan TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.recordatorios_plan_id_seq TO service_role;
