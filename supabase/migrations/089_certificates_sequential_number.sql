-- ============================================================================
-- Certificates — Migration 089: número secuencial legible y trigger idempotente
--
-- Problema: en la BD remota el trigger de `cert_number` (migración 024) no está
-- aplicado, por lo que la columna queda NULL y el frontend muestra su fallback
-- "EDL-2026-00000000".
--
-- Esta migración:
--   1) Garantiza una secuencia para el consecutivo.
--   2) Recrea el trigger de forma idempotente (CREATE OR REPLACE / DROP IF EXISTS).
--   3) Rellena los certificados existentes que tengan `cert_number` NULL.
--
-- No cambia el frontend ni la forma de insertar: sigue sin enviar cert_number y
-- el trigger lo calcula. Es seguro re-ejecutarla.
-- ============================================================================

-- 1. Secuencia del consecutivo (compartida por año implícito en el prefijo)
CREATE SEQUENCE IF NOT EXISTS certificate_seq START WITH 1;

-- 2. Trigger: número EDL-<año>-<consecutivo 6 dígitos>. Usa COALESCE por si
--    issued_at llega NULL en el INSERT.
CREATE OR REPLACE FUNCTION set_cert_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.cert_number IS NULL OR NEW.cert_number = '' THEN
    NEW.cert_number :=
      'EDL-' || EXTRACT(YEAR FROM COALESCE(NEW.issued_at, NOW()))::TEXT ||
      '-' || LPAD(nextval('certificate_seq')::TEXT, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_cert_number ON certificates;
CREATE TRIGGER trg_cert_number
  BEFORE INSERT ON certificates
  FOR EACH ROW EXECUTE FUNCTION set_cert_number();

-- 3. Rellenar certificados existentes sin número (una sola vez por fila NULL).
UPDATE certificates
SET cert_number =
  'EDL-' || EXTRACT(YEAR FROM COALESCE(issued_at, NOW()))::TEXT ||
  '-' || LPAD(nextval('certificate_seq')::TEXT, 6, '0')
WHERE cert_number IS NULL OR cert_number = '';

-- 4. Unicidad del número (si la tabla aún no tiene la restricción).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'certificates_cert_number_key'
  ) THEN
    ALTER TABLE certificates ADD CONSTRAINT certificates_cert_number_key UNIQUE (cert_number);
  END IF;
END $$;
