-- ============================================================================
-- 112 — Activación única de la cuenta del niño por su adulto (Ley 1581 de 2012)
--
-- Decisión del CEO (2026-10-15): el padre, madre o acudiente activa la cuenta
-- de IngenIA UNA sola vez; desde ahí el niño usa todas las herramientas de su
-- plan y nunca se le vuelve a pedir (otra sesión, otro dispositivo, invitación
-- vencida). Antes de activar, el backend responde 403 ADULTO_PENDIENTE en las
-- herramientas de IA (solo con ADULTO_OBLIGATORIO=true).
--
-- Esta tabla es la evidencia: quién activó, cuándo, por qué camino y qué
-- versión del texto de autorización aceptó. Una fila por estudiante: la
-- primera activación nunca se sobrescribe (el backend usa ON CONFLICT DO NOTHING).
-- El backend copia además la marca en auth.users.raw_app_meta_data
-- (ingenia_adulto_activado_at) para no consultar esta tabla en cada petición;
-- esa copia la hace el propio backend en el primer acceso, no esta migración.
--
-- NO SE APLICA AUTOMÁTICAMENTE. Aplicar primero en staging, después de la 110.
-- Idempotente: IF NOT EXISTS / ON CONFLICT DO NOTHING.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.activaciones_adulto_menor (
  estudiante_id        UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  adulto_id            UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  adulto_email         TEXT,
  metodo               TEXT NOT NULL CHECK (metodo IN (
                         'invitacion',               -- el adulto confirmó el enlace del correo
                         'codigo_padre',             -- el padre se registró con el código del hijo
                         'vinculo_existente',        -- ya tenía vínculo activo en parent_student_links
                         'consentimiento_existente'  -- ya tenía consentimiento verificado en parent_consents
                       )),
  -- NULL en activaciones heredadas (vínculo o consentimiento anterior a este texto).
  version_autorizacion TEXT,
  -- id de invitaciones_adulto_menor (sin FK: la evidencia no depende de esa fila).
  invitacion_id        BIGINT,
  activada_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.activaciones_adulto_menor IS
  'Evidencia de la activación única de la cuenta de IngenIA de un menor por su adulto responsable (Ley 1581). Solo backend.';

-- RLS: solo el backend (service_role, que salta RLS) lee o escribe.
ALTER TABLE public.activaciones_adulto_menor ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.activaciones_adulto_menor FROM anon, authenticated;

-- ── Backfill: estudiantes existentes que ya cuentan como activados ──────────
-- 1. Vínculo activo con un adulto (se toma el más antiguo).
INSERT INTO public.activaciones_adulto_menor (estudiante_id, adulto_id, metodo, activada_at)
SELECT DISTINCT ON (l.student_user_id)
       l.student_user_id::uuid,
       CASE WHEN l.parent_user_id ~* '^[0-9a-f-]{36}$'
                 AND EXISTS (SELECT 1 FROM auth.users p WHERE p.id = l.parent_user_id::uuid)
            THEN l.parent_user_id::uuid END,
       'vinculo_existente',
       coalesce(l.created_at, now())
FROM public.parent_student_links l
WHERE l.is_active IS TRUE
  AND l.student_user_id ~* '^[0-9a-f-]{36}$'
  AND EXISTS (SELECT 1 FROM auth.users u WHERE u.id = l.student_user_id::uuid)
ORDER BY l.student_user_id, l.created_at ASC NULLS LAST
ON CONFLICT (estudiante_id) DO NOTHING;

-- 2. Consentimiento verificado en la tabla antigua (si existe).
DO $$
BEGIN
  IF to_regclass('public.parent_consents') IS NOT NULL THEN
    INSERT INTO public.activaciones_adulto_menor (estudiante_id, adulto_email, metodo, activada_at)
    SELECT DISTINCT ON (c.student_id)
           c.student_id,
           lower(c.parent_email),
           'consentimiento_existente',
           coalesce(c.verified_at, c.consent_timestamp, now())
    FROM public.parent_consents c
    WHERE c.verification_status = 'verified'
      AND EXISTS (SELECT 1 FROM auth.users u WHERE u.id = c.student_id)
    ORDER BY c.student_id, c.verified_at ASC NULLS LAST
    ON CONFLICT (estudiante_id) DO NOTHING;
  END IF;
END $$;
