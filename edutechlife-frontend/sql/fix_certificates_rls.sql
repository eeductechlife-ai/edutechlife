-- ============================================
-- FIX: Create certificates table + RLS Policies
-- Ejecutar en Supabase Dashboard → SQL Editor
-- ============================================

-- 1. Crear tabla certificates
CREATE TABLE IF NOT EXISTS certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  cert_name TEXT DEFAULT 'Estudiante',
  overall_score INT CHECK (overall_score BETWEEN 0 AND 100),
  modules_completed INT DEFAULT 5,
  cert_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 2. Crear índice
CREATE INDEX IF NOT EXISTS idx_certificates_user ON certificates(user_id);

-- 3. Habilitar RLS
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- 4. Eliminar políticas existentes
DROP POLICY IF EXISTS "System can insert certificates" ON certificates;
DROP POLICY IF EXISTS "Users can view own certificates" ON certificates;
DROP POLICY IF EXISTS "Service role can view all certificates" ON certificates;
DROP POLICY IF EXISTS "Users can insert own certificate" ON certificates;
DROP POLICY IF EXISTS "Users can update own certificate" ON certificates;

-- 5. Crear políticas permissivas
CREATE POLICY "Users can view own certificates" ON certificates
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own certificate" ON certificates
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own certificate" ON certificates
  FOR UPDATE USING (true);

-- 6. Verificación
DO $$
DECLARE
  v_table_exists BOOLEAN;
  v_policies INT;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'certificates'
  ) INTO v_table_exists;
  
  SELECT COUNT(*) INTO v_policies
  FROM pg_policies 
  WHERE schemaname = 'public' AND tablename = 'certificates';
  
  RAISE NOTICE '========================================';
  RAISE NOTICE ' CERTIFICATES - Resultado';
  RAISE NOTICE '========================================';
  RAISE NOTICE ' Tabla creada: %', CASE WHEN v_table_exists THEN 'SI (OK)' ELSE 'NO (ERROR)' END;
  RAISE NOTICE ' Políticas RLS: %', v_policies;
  RAISE NOTICE '========================================';
END $$;
