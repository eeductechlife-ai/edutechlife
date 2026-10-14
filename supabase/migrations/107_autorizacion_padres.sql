-- ============================================================================
-- 103 — Autorización previa de padre/madre para datos de menores (Ley 1581/2012)
--
-- NO SE APLICA AUTOMÁTICAMENTE. Aplicar primero en staging. Con la variable
-- CONSENTIMIENTO_PADRES apagada (valor por defecto) el backend no lee ni
-- escribe estas estructuras, así que desplegar el código antes de la migración
-- no cambia nada para nadie.
--
-- Idempotente: IF NOT EXISTS / DROP POLICY IF EXISTS.
-- ============================================================================

-- 1. Marca de cuenta. DEFAULT false = cuentas existentes (grandfathered):
--    no se bloquean. Solo los registros creados con la variable encendida
--    reciben true (ver authService.signUp).
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS autorizacion_padres_requerida BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN public.users.autorizacion_padres_requerida IS
  'true = cuenta de estudiante creada con CONSENTIMIENTO_PADRES encendida; requiere autorización de padre/madre. false = cuenta existente (grandfathered).';

-- 2. Registro de autorizaciones: estudiante, adulto, versión de la política,
--    fecha, estado. El token NUNCA se guarda en claro: solo su hash SHA-256.
CREATE TABLE IF NOT EXISTS public.autorizaciones_padres (
  id               BIGSERIAL PRIMARY KEY,
  estudiante_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  adulto_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  version_politica TEXT,
  estado           TEXT NOT NULL DEFAULT 'pendiente'
                   CHECK (estado IN ('pendiente', 'autorizada', 'revocada', 'vencida')),
  token_hash       TEXT UNIQUE,
  token_expira_at  TIMESTAMPTZ,
  autorizada_at    TIMESTAMPTZ,
  revocada_at      TIMESTAMPTZ,
  ip               TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_autorizaciones_padres_estudiante
  ON public.autorizaciones_padres (estudiante_id, id DESC);
CREATE INDEX IF NOT EXISTS idx_autorizaciones_padres_adulto
  ON public.autorizaciones_padres (adulto_id);

-- 3. RLS. Los clientes solo leen; las escrituras las hace el backend con
--    service_role (que salta RLS). Se oculta token_hash e ip al cliente.
ALTER TABLE public.autorizaciones_padres ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "estudiante lee su autorizacion" ON public.autorizaciones_padres;
CREATE POLICY "estudiante lee su autorizacion"
  ON public.autorizaciones_padres FOR SELECT
  TO authenticated
  USING (auth.uid() = estudiante_id);

DROP POLICY IF EXISTS "adulto lee sus autorizaciones" ON public.autorizaciones_padres;
CREATE POLICY "adulto lee sus autorizaciones"
  ON public.autorizaciones_padres FOR SELECT
  TO authenticated
  USING (auth.uid() = adulto_id);

REVOKE ALL ON public.autorizaciones_padres FROM anon, authenticated;
GRANT SELECT (id, estudiante_id, adulto_id, version_politica, estado,
              token_expira_at, autorizada_at, revocada_at, created_at)
  ON public.autorizaciones_padres TO authenticated;
