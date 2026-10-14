-- ============================================================================
-- Migración 105 — Colegios: estudiantes ligados, rectores/docentes y códigos
--
-- Piloto para colegios (docs del proyecto: plan-colegios.md):
--   * smartboard.students.institution_id / grupo: el niño pertenece a un
--     colegio y a un grupo ("7A"). Lo liga el padre con un código de colegio.
--   * public.institution_members: rector o docente de un colegio.
--   * public.institution_codes: códigos que reparte el colegio, con cupo.
--   * public.redeem_institution_code(): gasta un uso del código de forma
--     atómica (solo la service role del backend la puede llamar).
-- No toca precios. Idempotente: se puede ejecutar más de una vez.
-- Requiere la 104 (premium_until), que el backend limpia al ligar al colegio.
-- ============================================================================

ALTER TABLE smartboard.students
  ADD COLUMN IF NOT EXISTS institution_id UUID REFERENCES public.institutions(id) ON DELETE SET NULL;
ALTER TABLE smartboard.students ADD COLUMN IF NOT EXISTS grupo TEXT;

CREATE OR REPLACE VIEW public.students WITH (security_invoker = on) AS
  SELECT * FROM smartboard.students;

CREATE INDEX IF NOT EXISTS idx_students_institution
  ON smartboard.students (institution_id) WHERE institution_id IS NOT NULL;

-- Rectores y docentes ------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.institution_members (
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  user_id        UUID NOT NULL,
  rol            TEXT NOT NULL CHECK (rol IN ('rector', 'docente')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (institution_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_institution_members_user ON public.institution_members (user_id);

ALTER TABLE public.institution_members ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'institution_members'
      AND policyname = 'Miembro lee su propia membresia'
  ) THEN
    CREATE POLICY "Miembro lee su propia membresia"
      ON public.institution_members FOR SELECT TO authenticated
      USING (user_id = auth.uid());
  END IF;
END $$;

-- Códigos de colegio (solo backend: RLS activo y sin políticas) ----------
CREATE TABLE IF NOT EXISTS public.institution_codes (
  code           TEXT PRIMARY KEY CHECK (code ~ '^[A-Z0-9]{6,20}$'),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  grupo          TEXT,
  max_uses       INTEGER NOT NULL CHECK (max_uses > 0),
  uses           INTEGER NOT NULL DEFAULT 0 CHECK (uses >= 0 AND uses <= max_uses),
  expires_at     TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_institution_codes_institution ON public.institution_codes (institution_id);

ALTER TABLE public.institution_codes ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.redeem_institution_code(p_code TEXT)
RETURNS TABLE (institution_id UUID, grupo TEXT)
LANGUAGE sql
SET search_path = public
AS $$
  UPDATE public.institution_codes c
     SET uses = c.uses + 1
   WHERE c.code = upper(p_code)
     AND c.uses < c.max_uses
     AND (c.expires_at IS NULL OR c.expires_at > now())
     AND EXISTS (
       SELECT 1 FROM public.institutions i
        WHERE i.id = c.institution_id AND i.is_active
     )
  RETURNING c.institution_id, c.grupo;
$$;

REVOKE ALL ON FUNCTION public.redeem_institution_code(TEXT) FROM PUBLIC;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    REVOKE ALL ON FUNCTION public.redeem_institution_code(TEXT) FROM anon;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    REVOKE ALL ON FUNCTION public.redeem_institution_code(TEXT) FROM authenticated;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
    GRANT EXECUTE ON FUNCTION public.redeem_institution_code(TEXT) TO service_role;
  END IF;
END $$;
