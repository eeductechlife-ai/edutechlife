-- =============================================
-- SmartBoard Kids Data - Tabla de estado completo
-- Almacena todo el estado del dashboard infantil
-- en una sola fila por usuario con JSONB
-- =============================================

CREATE TABLE IF NOT EXISTS smartboard_kids_data (
  user_id UUID PRIMARY KEY,
  platform TEXT NOT NULL DEFAULT 'smartboard',
  
  -- Estado completo del dashboard (equivalente a localStorage)
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Metadatos
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para búsqueda por user_id (ya es PK, pero explícito)
CREATE INDEX IF NOT EXISTS idx_smartboard_kids_user ON smartboard_kids_data(user_id);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_smartboard_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_smartboard_updated_at ON smartboard_kids_data;
CREATE TRIGGER trg_smartboard_updated_at
  BEFORE UPDATE ON smartboard_kids_data
  FOR EACH ROW
  EXECUTE FUNCTION update_smartboard_updated_at();

-- =============================================
-- RLS: Solo el propio usuario puede ver/modificar
-- sus datos. Los administradores pueden ver todo.
-- =============================================
ALTER TABLE smartboard_kids_data ENABLE ROW LEVEL SECURITY;

-- Policy: SELECT solo propia fila
CREATE POLICY "smartboard_select_own" ON smartboard_kids_data
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: INSERT solo propia fila
CREATE POLICY "smartboard_insert_own" ON smartboard_kids_data
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: UPDATE solo propia fila
CREATE POLICY "smartboard_update_own" ON smartboard_kids_data
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: DELETE solo propia fila
CREATE POLICY "smartboard_delete_own" ON smartboard_kids_data
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Admin puede ver todo
CREATE POLICY "smartboard_admin_all" ON smartboard_kids_data
  FOR ALL
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );
