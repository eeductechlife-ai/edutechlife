-- ============================================================================
-- 116_avisos_padres_whatsapp.sql
-- Avisos a padres por WhatsApp: uno cada vez que el niño se conecta a IngenIA y
-- un informe semanal. Decisión del CEO (2026-10-21).
--
-- Dos tablas, solo para el backend (service_role; sin acceso de anon ni
-- authenticated):
--
-- 1. whatsapp_padres: el consentimiento del padre. WhatsApp exige que quien
--    recibe mensajes de una empresa los haya aceptado antes, así que no se usa
--    users.phone_number: el padre da su número y acepta desde su panel, y debe
--    VERIFICARLO con un código que llega a ese WhatsApp (si no, un número mal
--    escrito o ajeno recibiría el nombre de un menor). Se guarda cuándo aceptó
--    y la versión del texto que vio. Darse de baja pone activo = false y
--    conserva la evidencia.
-- 2. avisos_padres_envios: registro de envíos. La clave única impide enviar
--    dos veces lo mismo aunque dos procesos coincidan:
--      - conexión: una fila por padre, niño y ventana corta de tiempo
--        (referencia = número de ventana), para no avisar dos veces por un
--        mismo inicio de sesión repetido;
--      - semanal: una fila por padre, niño, canal y semana (referencia = el
--        lunes de esa semana).
--
-- NO APLICADA. Se aplica manualmente tras revisión del CEO, primero en staging.
-- Idempotente. Deshacer: DROP TABLE public.avisos_padres_envios, public.whatsapp_padres;
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.whatsapp_padres (
  parent_user_id     UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Número VERIFICADO (el padre confirmó con un código que llegó a ese WhatsApp).
  telefono           TEXT CHECK (telefono IS NULL OR telefono ~ '^\+[1-9][0-9]{7,14}$'),
  verificado_at      TIMESTAMPTZ,
  -- Verificación en curso: número por confirmar y código (solo su hash).
  telefono_pendiente TEXT CHECK (telefono_pendiente IS NULL OR telefono_pendiente ~ '^\+[1-9][0-9]{7,14}$'),
  codigo_hash        TEXT,
  codigo_expira_at   TIMESTAMPTZ,
  codigo_enviado_at  TIMESTAMPTZ,
  codigo_intentos    INTEGER NOT NULL DEFAULT 0,
  -- Consentimiento: cuándo aceptó y la versión del texto que vio.
  opt_in_at          TIMESTAMPTZ,
  opt_in_version     TEXT,
  aviso_conexion     BOOLEAN NOT NULL DEFAULT true,
  informe_semanal    BOOLEAN NOT NULL DEFAULT true,
  activo             BOOLEAN NOT NULL DEFAULT false,
  opt_out_at         TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Nada se envía a un número sin verificar ni sin consentimiento.
  CONSTRAINT whatsapp_padres_activo_verificado
    CHECK (NOT activo OR (telefono IS NOT NULL AND verificado_at IS NOT NULL AND opt_in_at IS NOT NULL))
);

COMMENT ON TABLE public.whatsapp_padres IS
  'Consentimiento y número de WhatsApp del padre para avisos de conexión e informe semanal. Solo backend.';

CREATE TABLE IF NOT EXISTS public.avisos_padres_envios (
  id             BIGSERIAL PRIMARY KEY,
  tipo           TEXT NOT NULL CHECK (tipo IN ('conexion', 'semanal')),
  canal          TEXT NOT NULL CHECK (canal IN ('whatsapp', 'correo')),
  parent_user_id UUID NOT NULL,
  student_id     UUID NOT NULL,
  referencia     TEXT NOT NULL,
  estado         TEXT NOT NULL DEFAULT 'reservado' CHECK (estado IN ('reservado', 'enviado', 'error')),
  mensaje_id     TEXT,
  error          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT avisos_padres_envios_unico UNIQUE (tipo, canal, parent_user_id, student_id, referencia)
);

CREATE INDEX IF NOT EXISTS idx_avisos_padres_envios_creado
  ON public.avisos_padres_envios (created_at DESC);

COMMENT ON TABLE public.avisos_padres_envios IS
  'Registro anti-duplicado de avisos a padres (conexión y semanal). Solo backend.';

ALTER TABLE public.whatsapp_padres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avisos_padres_envios ENABLE ROW LEVEL SECURITY;

-- Sin políticas: solo el backend (service_role, que omite RLS) lee y escribe.
REVOKE ALL ON public.whatsapp_padres FROM anon, authenticated;
REVOKE ALL ON public.avisos_padres_envios FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.whatsapp_padres TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.avisos_padres_envios TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.avisos_padres_envios_id_seq TO service_role;
