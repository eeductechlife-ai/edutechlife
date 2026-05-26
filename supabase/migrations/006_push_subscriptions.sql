-- Push Subscriptions para notificaciones push nativas (VAPID Web Push)
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  subscription JSONB NOT NULL,
  user_agent TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user ON push_subscriptions(user_id);

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Los usuarios solo pueden ver/modificar sus propias suscripciones
CREATE POLICY "push_select_own" ON push_subscriptions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "push_insert_own" ON push_subscriptions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "push_update_own" ON push_subscriptions
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "push_delete_own" ON push_subscriptions
  FOR DELETE USING (user_id = auth.uid());
