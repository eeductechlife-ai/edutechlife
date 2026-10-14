-- ============================================================================
-- Migración 103 — Suscripciones y fuentes de pago de Wompi (IngenIA)
--
-- NO APLICADA. Probar primero en staging. Aplicarla en producción solo con
-- aprobación del CEO (nivel 0 de docs/agentes/AUTONOMIA.md).
--
-- Guarda la suscripción del padre y la referencia a la fuente de pago de Wompi
-- (un ID, nunca número de tarjeta, CVC ni fecha de vencimiento). La fuente solo
-- puede existir si el padre aceptó guardar su medio de pago para renovaciones.
-- Idempotente: IF NOT EXISTS en todo.
-- ============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.wompi_suscripciones (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id                 text NOT NULL,
  monto_centavos          bigint NOT NULL CHECK (monto_centavos > 0),
  moneda                  text NOT NULL DEFAULT 'COP' CHECK (moneda = 'COP'),
  estado                  text NOT NULL DEFAULT 'pendiente'
    CHECK (estado IN ('pendiente', 'activa', 'en_reintento', 'vencida', 'cancelada')),
  autoriza_guardar_medio  boolean NOT NULL DEFAULT false,
  payment_source_id       text,
  periodo_inicio          timestamptz,
  periodo_fin             timestamptz,
  proximo_cobro           timestamptz,
  intentos_fallidos       integer NOT NULL DEFAULT 0 CHECK (intentos_fallidos >= 0),
  cancelada_at            timestamptz,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now(),
  -- Sin autorización explícita no se guarda ninguna fuente de pago.
  CONSTRAINT wompi_fuente_requiere_autorizacion
    CHECK (payment_source_id IS NULL OR autoriza_guardar_medio = true)
);

CREATE INDEX IF NOT EXISTS idx_wompi_suscripciones_user
  ON public.wompi_suscripciones (user_id);

CREATE INDEX IF NOT EXISTS idx_wompi_suscripciones_cobros
  ON public.wompi_suscripciones (estado, proximo_cobro);

-- Registro de eventos ya procesados (idempotencia del webhook).
-- La clave se arma con evento + id de transacción + estado.
CREATE TABLE IF NOT EXISTS public.wompi_eventos (
  clave        text PRIMARY KEY,
  tipo         text NOT NULL,
  recibido_at  timestamptz NOT NULL DEFAULT now()
);

-- Solo el backend (service role) lee y escribe estas tablas.
ALTER TABLE public.wompi_suscripciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wompi_eventos ENABLE ROW LEVEL SECURITY;

COMMIT;
