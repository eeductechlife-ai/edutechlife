-- ============================================================================
-- 100_leads.sql
--
-- Leads de los formularios públicos del sitio (contacto, demo, método,
-- automatización). Hasta ahora esos formularios guardaban el lead solo en el
-- localStorage del visitante: Edutechlife nunca los recibía.
--
-- Escritura: SOLO el backend (POST /api/leads) con la service role, que salta RLS.
-- Lectura:   solo administradores (app_metadata.role = 'admin'), mismo patrón
--            que 071_admin_rbac. content_creator NO lee: son datos personales.
-- anon y authenticated no tienen INSERT/UPDATE/DELETE (ni política ni permiso).
-- Idempotente: se puede ejecutar más de una vez.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.leads (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  nombre             TEXT NOT NULL CHECK (char_length(nombre) BETWEEN 2 AND 120),
  email              TEXT NOT NULL CHECK (char_length(email) BETWEEN 5 AND 254),
  telefono           TEXT CHECK (char_length(telefono) <= 30),
  ciudad             TEXT CHECK (char_length(ciudad) <= 80),
  perfil             TEXT NOT NULL DEFAULT 'otro'
                     CHECK (perfil IN ('padre', 'docente', 'colegio', 'empresa', 'estudiante', 'otro')),
  producto_interes   TEXT CHECK (char_length(producto_interes) <= 80),
  mensaje            TEXT CHECK (char_length(mensaje) <= 2000),
  fuente             TEXT NOT NULL CHECK (char_length(fuente) <= 60),
  pagina             TEXT CHECK (char_length(pagina) <= 500),
  utm_source         TEXT CHECK (char_length(utm_source) <= 150),
  utm_medium         TEXT CHECK (char_length(utm_medium) <= 150),
  utm_campaign       TEXT CHECK (char_length(utm_campaign) <= 150),
  referrer           TEXT CHECK (char_length(referrer) <= 500),
  -- Ley 1581 de 2012: sin autorización expresa no se guarda el lead.
  autorizacion_datos BOOLEAN NOT NULL CHECK (autorizacion_datos = true),
  autorizacion_fecha TIMESTAMPTZ NOT NULL DEFAULT now(),
  estado             TEXT NOT NULL DEFAULT 'nuevo'
                     CHECK (estado IN ('nuevo', 'contactado', 'reunion_agendada', 'reunion_hecha',
                                       'propuesta_enviada', 'ganado', 'perdido', 'descartado')),
  notas              TEXT
);

CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_estado_idx ON public.leads (estado);
CREATE INDEX IF NOT EXISTS leads_email_idx ON public.leads (lower(email));

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Supabase da por defecto todos los permisos a anon/authenticated en public.
-- Se quitan y solo se devuelve SELECT a authenticated, filtrado por la política.
REVOKE ALL ON public.leads FROM anon, authenticated;
GRANT SELECT ON public.leads TO authenticated;

DROP POLICY IF EXISTS leads_admin_select ON public.leads;
CREATE POLICY leads_admin_select
  ON public.leads
  FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
