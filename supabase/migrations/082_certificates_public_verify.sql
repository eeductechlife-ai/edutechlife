-- ============================================================================
-- Certificates — Migration 025: verificación pública (Fase 6)
-- Expone una RPC SECURITY DEFINER que devuelve SOLO los campos públicos de un
-- certificado a partir de su número, para la página /verificar/:certNumber.
-- No expone user_id ni datos personales más allá del nombre impreso.
-- ============================================================================

CREATE OR REPLACE FUNCTION verify_certificate(p_cert_number TEXT)
RETURNS TABLE (
  cert_number TEXT,
  cert_name TEXT,
  overall_score INT,
  modules_completed INT,
  issued_at TIMESTAMPTZ,
  is_valid BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
    SELECT
      c.cert_number,
      c.cert_name,
      c.overall_score,
      c.modules_completed,
      c.issued_at,
      TRUE AS is_valid
    FROM certificates c
    WHERE upper(c.cert_number) = upper(trim(p_cert_number))
    LIMIT 1;
END;
$$;

COMMENT ON FUNCTION verify_certificate(TEXT) IS
  'Verificación pública de certificados EDL (solo campos públicos).';

-- Cualquiera (incluido anónimo) puede verificar un certificado por su número.
GRANT EXECUTE ON FUNCTION verify_certificate(TEXT) TO anon, authenticated;
