-- Tabla study_notes: notas de estudio por usuario
-- Compatible con Clerk JWT + RLS

CREATE TABLE IF NOT EXISTS study_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  note_type TEXT NOT NULL CHECK (note_type IN ('module', 'day')),
  key TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, note_type, key)
);

CREATE INDEX IF NOT EXISTS idx_study_notes_user_id ON study_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_study_notes_user_type ON study_notes(user_id, note_type);

ALTER TABLE study_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuarios pueden ver sus propias notas" ON study_notes;
CREATE POLICY "Usuarios pueden ver sus propias notas" ON study_notes
  FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

DROP POLICY IF EXISTS "Usuarios pueden insertar sus propias notas" ON study_notes;
CREATE POLICY "Usuarios pueden insertar sus propias notas" ON study_notes
  FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);

DROP POLICY IF EXISTS "Usuarios pueden actualizar sus propias notas" ON study_notes;
CREATE POLICY "Usuarios pueden actualizar sus propias notas" ON study_notes
  FOR UPDATE USING (auth.jwt() ->> 'sub' = user_id);

DROP POLICY IF EXISTS "Usuarios pueden eliminar sus propias notas" ON study_notes;
CREATE POLICY "Usuarios pueden eliminar sus propias notas" ON study_notes
  FOR DELETE USING (auth.jwt() ->> 'sub' = user_id);

CREATE OR REPLACE FUNCTION update_study_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_study_notes_updated_at ON study_notes;
CREATE TRIGGER trg_study_notes_updated_at
  BEFORE UPDATE ON study_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_study_notes_updated_at();

COMMENT ON TABLE study_notes IS 'Notas de estudio personales por módulo y por día';
COMMENT ON COLUMN study_notes.note_type IS 'Tipo: module (nota de módulo) o day (nota de día calendario)';
COMMENT ON COLUMN study_notes.key IS 'Clave: moduleId para module, fecha YYYY-MM-DD para day';
