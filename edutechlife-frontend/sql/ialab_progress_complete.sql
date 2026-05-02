-- ============================================
-- SCRIPT COMPLETO: Sistema de Progreso IALab
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- 1. TABLA: quiz_attempts
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  module_id INT NOT NULL,
  score INT NOT NULL CHECK (score BETWEEN 0 AND 100),
  passed BOOLEAN NOT NULL DEFAULT FALSE,
  answers JSONB DEFAULT '{}',
  total_questions INT DEFAULT 0,
  correct_answers INT DEFAULT 0,
  time_taken_seconds INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_module ON quiz_attempts(user_id, module_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_created ON quiz_attempts(created_at DESC);

-- 2. UNIQUE CONSTRAINT en user_progress
ALTER TABLE user_progress 
  DROP CONSTRAINT IF EXISTS uq_user_progress_activity_resource;

ALTER TABLE user_progress
  ADD CONSTRAINT uq_user_progress_activity_resource 
  UNIQUE (user_id, module_id, activity_type, resource_id);

-- 3. COLUMNAS FALTANTES en user_progress
ALTER TABLE user_progress 
  ADD COLUMN IF NOT EXISTS activity_type TEXT CHECK (activity_type IN ('video', 'document', 'pdf', 'ova', 'interactive', 'exam', 'challenge', 'community_comment')),
  ADD COLUMN IF NOT EXISTS resource_id TEXT,
  ADD COLUMN IF NOT EXISTS module_score INT DEFAULT 0 CHECK (module_score BETWEEN 0 AND 100),
  ADD COLUMN IF NOT EXISTS resources_viewed INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_resources INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS community_comment BOOLEAN DEFAULT FALSE;

-- 4. ÍNDICES en user_progress
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_module ON user_progress(user_id, module_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_activity ON user_progress(user_id, module_id, activity_type);
CREATE INDEX IF NOT EXISTS idx_user_progress_resource ON user_progress(user_id, module_id, resource_id);

-- 5. FUNCIÓN: Calcular nota del módulo
CREATE OR REPLACE FUNCTION calculate_module_score(
  p_user_id TEXT,
  p_module_id INT
) RETURNS INT AS $$
DECLARE
  v_exam_score INT := 0;
  v_challenge_score INT := 0;
  v_resources_pct INT := 0;
  v_community_pct INT := 0;
  v_final_score INT := 0;
  v_resources_viewed INT := 0;
  v_total_resources INT := 0;
  v_has_comment BOOLEAN := FALSE;
  v_exam_passed BOOLEAN := FALSE;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM quiz_attempts 
    WHERE user_id = p_user_id AND module_id = p_module_id AND passed = TRUE
  ) INTO v_exam_passed;
  
  IF v_exam_passed THEN
    v_exam_score := 35;
  END IF;

  SELECT COALESCE(MAX(score), 0) INTO v_challenge_score
  FROM user_progress 
  WHERE user_id = p_user_id AND module_id = p_module_id AND activity_type = 'challenge';
  
  v_challenge_score := (v_challenge_score / 100.0) * 30;

  SELECT resources_viewed, total_resources INTO v_resources_viewed, v_total_resources
  FROM user_progress 
  WHERE user_id = p_user_id AND module_id = p_module_id 
  ORDER BY updated_at DESC LIMIT 1;
  
  IF v_total_resources > 0 THEN
    v_resources_pct := (v_resources_viewed::FLOAT / v_total_resources::FLOAT) * 30;
  END IF;

  SELECT COALESCE(MAX(community_comment), FALSE) INTO v_has_comment
  FROM user_progress 
  WHERE user_id = p_user_id AND module_id = p_module_id;
  
  IF v_has_comment THEN
    v_community_pct := 5;
  END IF;

  v_final_score := LEAST(100, v_exam_score + v_challenge_score + v_resources_pct + v_community_pct);
  
  RETURN ROUND(v_final_score);
END;
$$ LANGUAGE plpgsql;

-- 6. FUNCIÓN: Calcular progreso global
CREATE OR REPLACE FUNCTION calculate_global_progress(
  p_user_id TEXT
) RETURNS INT AS $$
DECLARE
  v_total FLOAT := 0;
  v_module_score INT;
  v_mod INT;
BEGIN
  FOR v_mod IN 1..5 LOOP
    v_module_score := calculate_module_score(p_user_id, v_mod);
    v_total := v_total + (v_module_score / 100.0) * 20;
  END LOOP;
  
  RETURN LEAST(100, ROUND(v_total));
END;
$$ LANGUAGE plpgsql;

-- 7. TRIGGER: Actualizar module_score automáticamente
CREATE OR REPLACE FUNCTION update_module_score() RETURNS TRIGGER AS $$
BEGIN
  NEW.module_score := calculate_module_score(NEW.user_id, NEW.module_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_module_score ON user_progress;
CREATE TRIGGER trg_update_module_score
  BEFORE INSERT OR UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_module_score();

-- 8. FUNCIÓN: Obtener desglose completo de un módulo
CREATE OR REPLACE FUNCTION get_module_breakdown(
  p_user_id TEXT,
  p_module_id INT
) RETURNS JSON AS $$
DECLARE
  v_result JSON;
  v_exam_passed BOOLEAN;
  v_exam_score INT;
  v_challenge_score INT;
  v_resources_viewed INT;
  v_total_resources INT;
  v_resources_pct FLOAT;
  v_has_comment BOOLEAN;
  v_module_score INT;
  v_mod_progress FLOAT;
BEGIN
  SELECT passed, score INTO v_exam_passed, v_exam_score
  FROM quiz_attempts 
  WHERE user_id = p_user_id AND module_id = p_module_id 
  ORDER BY created_at DESC LIMIT 1;
  
  IF v_exam_score IS NULL THEN
    v_exam_passed := FALSE;
    v_exam_score := 0;
  END IF;

  SELECT COALESCE(MAX(score), 0) INTO v_challenge_score
  FROM user_progress 
  WHERE user_id = p_user_id AND module_id = p_module_id AND activity_type = 'challenge';

  SELECT COALESCE(MAX(resources_viewed), 0), COALESCE(MAX(total_resources), 0) 
  INTO v_resources_viewed, v_total_resources
  FROM user_progress 
  WHERE user_id = p_user_id AND module_id = p_module_id;
  
  IF v_total_resources > 0 THEN
    v_resources_pct := (v_resources_viewed::FLOAT / v_total_resources::FLOAT) * 30;
  ELSE
    v_resources_pct := 0;
  END IF;

  SELECT COALESCE(MAX(community_comment), FALSE) INTO v_has_comment
  FROM user_progress 
  WHERE user_id = p_user_id AND module_id = p_module_id;

  v_module_score := calculate_module_score(p_user_id, p_module_id);
  v_mod_progress := (v_module_score::FLOAT / 100.0) * 20;

  v_result := json_build_object(
    'module_id', p_module_id,
    'exam', json_build_object(
      'passed', v_exam_passed,
      'score', v_exam_score,
      'weight', 35,
      'earned', CASE WHEN v_exam_passed THEN 35 ELSE 0 END
    ),
    'challenge', json_build_object(
      'score', v_challenge_score,
      'weight', 30,
      'earned', ROUND((v_challenge_score / 100.0) * 30, 1)
    ),
    'resources', json_build_object(
      'viewed', v_resources_viewed,
      'total', v_total_resources,
      'weight', 30,
      'earned', ROUND(v_resources_pct, 1)
    ),
    'community', json_build_object(
      'commented', v_has_comment,
      'weight', 5,
      'earned', CASE WHEN v_has_comment THEN 5 ELSE 0 END
    ),
    'module_score', v_module_score,
    'module_progress_pct', ROUND(v_mod_progress, 1)
  );

  RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- 9. VERIFICACIÓN FINAL
DO $$
BEGIN
  RAISE NOTICE '✅ Schema de progreso IALab actualizado correctamente';
  RAISE NOTICE '📊 Pesos: Examen 35% + Desafío 30% + Recursos 30% + Comunidad 5% = 100%';
  RAISE NOTICE '📊 Global: 5 módulos × 20% = 100%';
END $$;
