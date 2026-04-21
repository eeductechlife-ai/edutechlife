-- ============================================
-- TABLA STUDENT_GRADES PARA EVALUACIÓN PREMIUM
-- ============================================
-- Almacena las notas del desafío premium de 3 pasos
-- Integración con Clerk auth y DeepSeek API
-- ============================================

CREATE TABLE IF NOT EXISTS student_grades (
  -- Identificación
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  clerk_user_id TEXT, -- Para integración con Clerk
  
  -- Información del módulo y evaluación
  module_id INT NOT NULL CHECK (module_id BETWEEN 1 AND 5),
  evaluation_type TEXT NOT NULL DEFAULT 'premium_challenge' CHECK (evaluation_type IN ('premium_challenge', 'quiz', 'exam')),
  
  -- Resultados de la evaluación premium (3 pasos)
  overall_score INT NOT NULL CHECK (overall_score BETWEEN 0 AND 100),
  step1_score INT CHECK (step1_score BETWEEN 0 AND 100),
  step2_score INT CHECK (step2_score BETWEEN 0 AND 100),
  step3_score INT CHECK (step3_score BETWEEN 0 AND 100),
  
  -- Feedback detallado de DeepSeek API
  feedback_ej1 TEXT,
  feedback_ej2 TEXT,
  feedback_ej3 TEXT,
  overall_feedback TEXT,
  
  -- Datos de los ejercicios generados
  exercise1_data JSONB,
  exercise2_data JSONB,
  exercise3_data JSONB,
  
  -- Respuestas del estudiante
  student_response1 TEXT,
  student_response2 TEXT,
  student_response3 TEXT,
  
  -- Metadata
  is_approved BOOLEAN GENERATED ALWAYS AS (overall_score >= 70) STORED,
  completion_time_seconds INT, -- Tiempo total en segundos
  attempts_count INT DEFAULT 1,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(user_id, module_id, evaluation_type, created_at)
);

-- Comentarios
COMMENT ON TABLE student_grades IS 'Notas del desafío premium de 3 pasos con DeepSeek API';
COMMENT ON COLUMN student_grades.overall_score IS 'Nota global 0-100 (30% del módulo)';
COMMENT ON COLUMN student_grades.step1_score IS 'Puntuación del paso 1: Identificar Rol/Contexto/Tarea';
COMMENT ON COLUMN student_grades.step2_score IS 'Puntuación del paso 2: Optimizar prompt mal redactado';
COMMENT ON COLUMN student_grades.step3_score IS 'Puntuación del paso 3: Crear prompt desde cero';
COMMENT ON COLUMN student_grades.feedback_ej1 IS 'Feedback específico del ejercicio 1 por DeepSeek';
COMMENT ON COLUMN student_grades.feedback_ej2 IS 'Feedback específico del ejercicio 2 por DeepSeek';
COMMENT ON COLUMN student_grades.feedback_ej3 IS 'Feedback específico del ejercicio 3 por DeepSeek';
COMMENT ON COLUMN student_grades.exercise1_data IS 'Datos JSON del ejercicio 1 generado por DeepSeek';
COMMENT ON COLUMN student_grades.exercise2_data IS 'Datos JSON del ejercicio 2 generado por DeepSeek';
COMMENT ON COLUMN student_grades.exercise3_data IS 'Datos JSON del ejercicio 3 generado por DeepSeek';

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_student_grades_user_id ON student_grades(user_id);
CREATE INDEX IF NOT EXISTS idx_student_grades_module_id ON student_grades(module_id);
CREATE INDEX IF NOT EXISTS idx_student_grades_created_at ON student_grades(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_student_grades_is_approved ON student_grades(is_approved);
CREATE INDEX IF NOT EXISTS idx_student_grades_clerk_user_id ON student_grades(clerk_user_id);

-- Trigger para auto-update updated_at
CREATE OR REPLACE FUNCTION update_student_grades_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_student_grades_updated_at
  BEFORE UPDATE ON student_grades
  FOR EACH ROW
  EXECUTE FUNCTION update_student_grades_updated_at();

-- Función para obtener el mejor intento por módulo
CREATE OR REPLACE FUNCTION get_best_challenge_score(p_user_id UUID, p_module_id INT)
RETURNS TABLE (
  best_score INT,
  total_attempts INT,
  last_attempt_date TIMESTAMPTZ,
  is_approved BOOLEAN
) 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    MAX(sg.overall_score)::INT as best_score,
    COUNT(*)::INT as total_attempts,
    MAX(sg.created_at) as last_attempt_date,
    BOOL_OR(sg.is_approved) as is_approved
  FROM student_grades sg
  WHERE sg.user_id = p_user_id 
    AND sg.module_id = p_module_id
    AND sg.evaluation_type = 'premium_challenge'
  GROUP BY sg.user_id, sg.module_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_best_challenge_score IS 'Obtiene el mejor puntaje del desafío premium por módulo';

-- RLS (Row Level Security)
ALTER TABLE student_grades ENABLE ROW LEVEL SECURITY;

-- Política: Usuarios solo pueden ver sus propias notas
CREATE POLICY "Users can view own grades" ON student_grades
  FOR SELECT USING (auth.uid() = user_id);

-- Política: Usuarios solo pueden insertar sus propias notas
CREATE POLICY "Users can insert own grades" ON student_grades
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política: Usuarios solo pueden actualizar sus propias notas (solo admin puede actualizar)
CREATE POLICY "Users can update own grades" ON student_grades
  FOR UPDATE USING (auth.uid() = user_id);

-- Política: Admin puede ver todas las notas
CREATE POLICY "Admins can view all grades" ON student_grades
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Vista para dashboard de progreso
CREATE OR REPLACE VIEW student_challenge_progress AS
SELECT 
  sg.user_id,
  sg.module_id,
  sg.overall_score,
  sg.is_approved,
  sg.created_at as attempt_date,
  sg.attempts_count,
  p.full_name,
  p.email,
  ROW_NUMBER() OVER (PARTITION BY sg.user_id, sg.module_id ORDER BY sg.overall_score DESC) as attempt_rank
FROM student_grades sg
LEFT JOIN profiles p ON sg.user_id = p.id
WHERE sg.evaluation_type = 'premium_challenge'
ORDER BY sg.created_at DESC;

COMMENT ON VIEW student_challenge_progress IS 'Vista para dashboard de progreso en desafíos premium';

-- ============================================
-- MIGRACIÓN: Actualizar clerk_user_id si existe
-- ============================================
DO $$ 
BEGIN
  -- Actualizar clerk_user_id desde profiles si está disponible
  UPDATE student_grades sg
  SET clerk_user_id = p.clerk_user_id
  FROM profiles p
  WHERE sg.user_id = p.id
    AND sg.clerk_user_id IS NULL
    AND p.clerk_user_id IS NOT NULL;
    
  RAISE NOTICE '✅ Tabla student_grades creada y configurada exitosamente';
  RAISE NOTICE '📊 Para verificar: SELECT COUNT(*) FROM student_grades;';
  RAISE NOTICE '🎯 Para mejores puntajes: SELECT * FROM get_best_challenge_score([user_id], [module_id]);';
END $$;