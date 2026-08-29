-- ============================================================================
-- Certificates — Migration 024 (IALab)
-- Tabla de certificados EDL: emitida por la app al completar los 5 módulos
-- (useIALabUI.generateCertificate) y consultada por CertificatesModal.
-- El número EDL-YYYY-######## se genera solo a partir del id (UUID).
-- ============================================================================

-- 1. Tabla de certificados
CREATE TABLE IF NOT EXISTS certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  cert_name TEXT DEFAULT 'Certificado de Especialista en IA - Edutechlife',
  overall_score INT CHECK (overall_score BETWEEN 0 AND 100),
  modules_completed INT DEFAULT 5 CHECK (modules_completed = 5),
  cert_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

COMMENT ON TABLE certificates IS 'Certificados otorgados al completar los 5 módulos del curso';

-- El número EDL-YYYY-######## se calcula en un trigger BEFORE INSERT: una
-- columna GENERATED no puede usar EXTRACT(YEAR FROM timestamptz) (stable, no
-- immutable → SQLSTATE 42P17).
CREATE OR REPLACE FUNCTION set_cert_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.cert_number := 'EDL-' || EXTRACT(YEAR FROM NEW.issued_at) || '-' || LPAD(NEW.id::TEXT, 8, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_cert_number ON certificates;
CREATE TRIGGER trg_cert_number
  BEFORE INSERT ON certificates
  FOR EACH ROW EXECUTE FUNCTION set_cert_number();

-- 2. Índices (perfil de carga: lecturas por user_id y listado por emisión)
CREATE INDEX IF NOT EXISTS idx_certificates_user ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_issued ON certificates(issued_at DESC);

-- 3. RLS: cada usuario ve y crea su propio certificado
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own certificates" ON certificates;
CREATE POLICY "Users can view own certificates"
  ON certificates FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own certificates" ON certificates;
CREATE POLICY "Users can insert own certificates"
  ON certificates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can view all certificates" ON certificates;
CREATE POLICY "Service role can view all certificates"
  ON certificates FOR SELECT
  USING (auth.jwt() ->> 'role' = 'service_role');

DROP POLICY IF EXISTS "Service role can insert certificates" ON certificates;
CREATE POLICY "Service role can insert certificates"
  ON certificates FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');
