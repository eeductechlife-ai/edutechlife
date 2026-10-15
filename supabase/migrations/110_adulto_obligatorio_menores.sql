-- ============================================================================
-- 110 — Adulto obligatorio para menores de 18 años (Ley 1581 de 2012)
--
-- Decisión del CEO (2026-10-14, opción A): la regla de adulto obligatorio
-- REEMPLAZA CONSENTIMIENTO_PADRES (migración 107, PR #108). El código de esa
-- regla se retira en la PR de backend (etapa 2). Esta migración no toca las
-- tablas ni columnas de la 107: se conservan para no perder datos.
--
-- NO SE APLICA AUTOMÁTICAMENTE. Aplicar primero en staging.
-- Idempotente: IF NOT EXISTS / DROP POLICY IF EXISTS.
--
-- Cuentas existentes: adulto_obligatorio = false (no se bloquean). Los 16
-- menores sin vínculo activo solo reciben un aviso en su panel.
-- ============================================================================

-- 1. Marca de cuenta. Solo los registros nuevos de menores la reciben.
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS adulto_obligatorio BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN public.users.adulto_obligatorio IS
  'true = menor de 18 registrado después de la migración 110; exige adulto vinculado. false = cuenta existente (no bloqueada).';

-- 2. Deprecación explícita de la regla anterior (sin borrar datos).
COMMENT ON COLUMN public.users.autorizacion_padres_requerida IS
  'DEPRECADO (migración 110): reemplazado por users.adulto_obligatorio. No se usa para nuevos registros. Pendiente de retirar.';

-- 3. Invitaciones al adulto. Guarda la vinculación pendiente mientras el adulto
--    aún no tiene cuenta, por eso no usa parent_student_links (cuyo
--    parent_user_id exige un auth.uid existente). Al confirmar se crea el
--    vínculo activo en parent_student_links.
--    El token NUNCA se guarda en claro: solo su hash SHA-256.
CREATE TABLE IF NOT EXISTS public.invitaciones_adulto_menor (
  id               BIGSERIAL PRIMARY KEY,
  estudiante_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  adulto_email     TEXT NOT NULL CHECK (adulto_email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
  adulto_nombre    TEXT NOT NULL,
  token_hash       TEXT UNIQUE NOT NULL,
  estado           TEXT NOT NULL DEFAULT 'pendiente'
                   CHECK (estado IN ('pendiente', 'confirmada', 'vencida', 'revocada')),
  expira_at        TIMESTAMPTZ NOT NULL,
  adulto_id        UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  confirmada_at    TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Una sola invitación vigente por estudiante: una nueva invalida la anterior.
CREATE UNIQUE INDEX IF NOT EXISTS uq_invitacion_adulto_pendiente
  ON public.invitaciones_adulto_menor (estudiante_id)
  WHERE estado = 'pendiente';

CREATE INDEX IF NOT EXISTS idx_invitacion_adulto_estudiante
  ON public.invitaciones_adulto_menor (estudiante_id, id DESC);

-- 4. RLS. Solo el backend (service_role, que salta RLS) escribe o lee.
--    Ningún cliente accede directamente: el token y el correo del adulto
--    quedan fuera de la API pública.
ALTER TABLE public.invitaciones_adulto_menor ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.invitaciones_adulto_menor FROM anon, authenticated;
