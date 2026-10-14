-- ============================================================================
-- 108_push_subscriptions_padres.sql
-- Avisos push en el celular del padre/acudiente cuando su hijo/a inicia
-- sesión en IngenIA (services/webPush.js, routes/notificationsPush.js).
--
-- Un padre puede tener varios dispositivos, así que la clave es
-- (user_id, endpoint) y no user_id sola (006 tenía UNIQUE(user_id)).
--
-- NO APLICADA. Se aplica manualmente tras revisión del CEO (SQL Editor de
-- Supabase), ANTES de fusionar el PR: la ruta POST /api/notifications/push/subscribe
-- usa upsert con onConflict 'user_id,endpoint' y el hook useBrowserNotifications
-- también. Hasta entonces el alta de suscripciones responde 500 y el aviso
-- por correo sigue funcionando.
--
-- Nota: en el proyecto de Supabase revisado (srirrwpgswlnuqfgtule) la tabla
-- push_subscriptions NO existe, ni en public ni en smartboard. Por eso la
-- migración la crea completa; si ya existe, solo se ajusta.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      TEXT NOT NULL,
  subscription JSONB NOT NULL,
  user_agent   TEXT DEFAULT '',
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- Si existe la restricción antigua UNIQUE(user_id) (migración 006), se quita.
DO $$
DECLARE
  restriccion RECORD;
BEGIN
  FOR restriccion IN
    SELECT c.conname
    FROM pg_constraint c
    WHERE c.conrelid = 'public.push_subscriptions'::regclass
      AND c.contype = 'u'
      AND c.conkey = ARRAY[
        (SELECT a.attnum FROM pg_attribute a
          WHERE a.attrelid = 'public.push_subscriptions'::regclass AND a.attname = 'user_id')
      ]::smallint[]
  LOOP
    EXECUTE format('ALTER TABLE public.push_subscriptions DROP CONSTRAINT %I', restriccion.conname);
  END LOOP;
END $$;

-- Columna derivada del JSON: permite el upsert por (user_id, endpoint).
ALTER TABLE public.push_subscriptions
  ADD COLUMN IF NOT EXISTS endpoint TEXT GENERATED ALWAYS AS (subscription->>'endpoint') STORED;

CREATE UNIQUE INDEX IF NOT EXISTS push_subscriptions_user_endpoint_key
  ON public.push_subscriptions (user_id, endpoint);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user ON public.push_subscriptions (user_id);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Solo el backend (service_role, que omite RLS) escribe. Cada usuario ve
-- únicamente sus propias suscripciones (misma regla que la 006).
DROP POLICY IF EXISTS push_select_own ON public.push_subscriptions;
DROP POLICY IF EXISTS push_insert_own ON public.push_subscriptions;
DROP POLICY IF EXISTS push_update_own ON public.push_subscriptions;
DROP POLICY IF EXISTS push_delete_own ON public.push_subscriptions;

CREATE POLICY push_select_own ON public.push_subscriptions
  FOR SELECT USING (user_id = auth.uid()::text);
CREATE POLICY push_insert_own ON public.push_subscriptions
  FOR INSERT WITH CHECK (user_id = auth.uid()::text);
CREATE POLICY push_update_own ON public.push_subscriptions
  FOR UPDATE USING (user_id = auth.uid()::text);
CREATE POLICY push_delete_own ON public.push_subscriptions
  FOR DELETE USING (user_id = auth.uid()::text);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.push_subscriptions TO service_role;
