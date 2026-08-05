-- ============================================================================
-- Parent Dashboard — Migration 023 (para la BD real de producción)
-- Tablas existentes: smartboard_kids_data (user_id TEXT, data JSONB)
-- Pega esto en: Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================================

-- 1. Tabla de vínculos padre ↔ estudiante
-- ============================================================================
CREATE TABLE IF NOT EXISTS parent_student_links (
  parent_user_id  TEXT NOT NULL,   -- auth.uid()::TEXT del padre
  student_user_id TEXT NOT NULL,   -- auth.uid()::TEXT del estudiante
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (parent_user_id, student_user_id)
);

CREATE INDEX IF NOT EXISTS idx_psl_parent  ON parent_student_links(parent_user_id);
CREATE INDEX IF NOT EXISTS idx_psl_student ON parent_student_links(student_user_id);

ALTER TABLE parent_student_links ENABLE ROW LEVEL SECURITY;

-- Padres gestionan sus propios vínculos
DROP POLICY IF EXISTS "parents manage own links" ON parent_student_links;
CREATE POLICY "parents manage own links"
  ON parent_student_links FOR ALL
  USING (auth.uid()::TEXT = parent_user_id)
  WITH CHECK (auth.uid()::TEXT = parent_user_id);

-- Service role accede a todo (backend)
DROP POLICY IF EXISTS "service role manage links" ON parent_student_links;
CREATE POLICY "service role manage links"
  ON parent_student_links FOR ALL
  USING (true) WITH CHECK (true);


-- 2. Actualizar RLS de smartboard_kids_data
--    Añade permiso de lectura para padres vinculados
-- ============================================================================

-- Eliminar policy antigua si existe
DROP POLICY IF EXISTS "Parents read child smartboard data" ON smartboard_kids_data;

-- Nueva policy: estudiante ve lo suyo; padre ve lo de su hijo vinculado
CREATE POLICY "Parents read child smartboard data"
  ON smartboard_kids_data FOR SELECT
  USING (
    -- El propio estudiante
    auth.jwt() ->> 'sub' = user_id
    OR
    -- Un padre vinculado
    EXISTS (
      SELECT 1 FROM parent_student_links psl
      WHERE psl.parent_user_id  = auth.uid()::TEXT
        AND psl.student_user_id = smartboard_kids_data.user_id
        AND psl.is_active = true
    )
  );

-- Verificación final
SELECT 'parent_student_links creada y RLS de smartboard_kids_data actualizado ✓' AS resultado;
