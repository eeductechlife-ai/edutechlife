-- Revisión humana (CEO) antes de enviar una alerta de crisis al padre.
-- Cada alerta de nivel alto queda pendiente hasta que el CEO la aprueba o rechaza
-- desde el enlace del correo. Solo el backend (service role) accede a la tabla.

CREATE TABLE IF NOT EXISTS crisis_alert_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  parent_email text NOT NULL,
  student_age integer,
  detected_content text,
  crisis_level text NOT NULL,
  token_hash text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  expires_at timestamptz NOT NULL,
  decided_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_crisis_alert_reviews_status
  ON crisis_alert_reviews(status);

ALTER TABLE crisis_alert_reviews ENABLE ROW LEVEL SECURITY;
-- Sin políticas: ningún rol de cliente puede leer ni escribir esta tabla.
