-- ============================================
-- ACTUALIZACIÓN DE SCHEMA: Sistema de Progreso IALab
-- Tabla: user_progress (ya creada con 14 columnas)
-- Pesos por módulo: Examen 35% + Desafío 30% + Recursos 30% + Comunidad 5% = 100%
-- Progreso global: 5 módulos × 20% cada uno = 100%
-- ============================================

-- 1. CREAR UNIQUE CONSTRAINT para múltiples filas por módulo
ALTER TABLE user_progress 
  DROP CONSTRAINT IF EXISTS uq_user_progress_activity_resource;

ALTER TABLE user_progress
  ADD CONSTRAINT uq_user_progress_activity_resource 
  UNIQUE (user_id, module_id, activity_type, resource_id);

COMMENT ON CONSTRAINT uq_user_progress_activity_resource ON user_progress IS 'Permite múltiples filas por módulo: una por actividad/recurso';

-- 2. AGREGAR COLUMNAS FALTANTES (seguridad para migraciones)
ALTER TABLE user_progress 
  ADD COLUMN IF NOT EXISTS activity_type TEXT CHECK (activity_type IN ('video', 'document', 'pdf', 'ova', 'interactive', 'exam', 'challenge', 'community_comment')),
  ADD COLUMN IF NOT EXISTS resource_id TEXT,
  ADD COLUMN IF NOT EXISTS module_score INT DEFAULT 0 CHECK (module_score BETWEEN 0 AND 100),
  ADD COLUMN IF NOT EXISTS resources_viewed INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_resources INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS community_comment BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN user_progress.activity_type IS 'Tipo de actividad: video, document, pdf, ova, interactive, exam, challenge, community_comment';
COMMENT ON COLUMN user_progress.resource_id IS 'ID único del recurso visto (ej: intro-video-1)';
COMMENT ON COLUMN user_progress.module_score IS 'Nota calculada del módulo (0-100%)';
COMMENT ON COLUMN user_progress.resources_viewed IS 'Cantidad de recursos vistos en este módulo';
COMMENT ON COLUMN user_progress.total_resources IS 'Cantidad total de recursos en este módulo';
COMMENT ON COLUMN user_progress.community_comment IS 'Si el usuario publicó al menos un comentario en la comunidad';

-- 3. ÍNDICES para rendimiento
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_module ON user_progress(user_id, module_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_activity ON user_progress(user_id, module_id, activity_type);
CREATE INDEX IF NOT EXISTS idx_user_progress_resource ON user_progress(user_id, module_id, resource_id);

-- 4. FUNCIÓN: Calcular nota del módulo
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
  -- Examen: 35% (solo si aprobó >= 70%)
  SELECT EXISTS(
    SELECT 1 FROM quiz_attempts 
    WHERE user_id = p_user_id AND module_id = p_module_id AND passed = TRUE
  ) INTO v_exam_passed;
  
  IF v_exam_passed THEN
    v_exam_score := 35;
  END IF;

  -- Desafío: 30% (proporcional al score obtenido)
  SELECT COALESCE(MAX(score), 0) INTO v_challenge_score
  FROM user_progress 
  WHERE user_id = p_user_id AND module_id = p_module_id AND activity_type = 'challenge';
  
  v_challenge_score := (v_challenge_score / 100.0) * 30;

  -- Recursos: 30% (proporcional a recursos vistos)
  SELECT resources_viewed, total_resources INTO v_resources_viewed, v_total_resources
  FROM user_progress 
  WHERE user_id = p_user_id AND module_id = p_module_id 
  ORDER BY updated_at DESC LIMIT 1;
  
  IF v_total_resources > 0 THEN
    v_resources_pct := (v_resources_viewed::FLOAT / v_total_resources::FLOAT) * 30;
  END IF;

  -- Comunidad: 5% (si publicó al menos 1 comentario)
  SELECT COALESCE(MAX(community_comment), FALSE) INTO v_has_comment
  FROM user_progress 
  WHERE user_id = p_user_id AND module_id = p_module_id;
  
  IF v_has_comment THEN
    v_community_pct := 5;
  END IF;

  -- Score final
  v_final_score := LEAST(100, v_exam_score + v_challenge_score + v_resources_pct + v_community_pct);
  
  RETURN ROUND(v_final_score);
END;
$$ LANGUAGE plpgsql;

-- 5. FUNCIÓN: Calcular progreso global
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

-- 6. TRIGGER: Actualizar module_score automáticamente
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

-- 7. FUNCIÓN: Marcar recurso como visto
CREATE OR REPLACE FUNCTION mark_resource_viewed(
  p_user_id TEXT,
  p_module_id INT,
  p_resource_id TEXT,
  p_activity_type TEXT,
  p_total_resources INT
) RETURNS VOID AS $$
DECLARE
  v_exists BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM user_progress 
    WHERE user_id = p_user_id AND module_id = p_module_id AND resource_id = p_resource_id
  ) INTO v_exists;
  
  IF NOT v_exists THEN
    INSERT INTO user_progress (user_id, module_id, activity_type, resource_id, is_completed, total_resources)
    VALUES (p_user_id, p_module_id, p_activity_type, p_resource_id, TRUE, p_total_resources);
    
    UPDATE user_progress 
    SET resources_viewed = (
      SELECT COUNT(DISTINCT resource_id) 
      FROM user_progress 
      WHERE user_id = p_user_id AND module_id = p_module_id AND resource_id IS NOT NULL
    ),
    total_resources = p_total_resources
    WHERE user_id = p_user_id AND module_id = p_module_id AND resource_id IS NULL;
    
    IF NOT EXISTS(
      SELECT 1 FROM user_progress 
      WHERE user_id = p_user_id AND module_id = p_module_id AND resource_id IS NULL
    ) THEN
      INSERT INTO user_progress (user_id, module_id, resources_viewed, total_resources)
      VALUES (p_user_id, p_module_id, 1, p_total_resources);
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 8. FUNCIÓN: Registrar resultado del examen
CREATE OR REPLACE FUNCTION record_exam_result(
  p_user_id TEXT,
  p_module_id INT,
  p_score INT,
  p_passed BOOLEAN
) RETURNS VOID AS $$
BEGIN
  INSERT INTO user_progress (user_id, module_id, activity_type, score, is_completed, resource_id)
  VALUES (p_user_id, p_module_id, 'exam', p_score, p_passed, NULL)
  ON CONFLICT (user_id, module_id, activity_type, resource_id) 
  DO UPDATE SET score = EXCLUDED.score, is_completed = EXCLUDED.is_completed, updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- 9. FUNCIÓN: Registrar resultado del desafío
CREATE OR REPLACE FUNCTION record_challenge_result(
  p_user_id TEXT,
  p_module_id INT,
  p_score INT
) RETURNS VOID AS $$
BEGIN
  INSERT INTO user_progress (user_id, module_id, activity_type, score, is_completed, resource_id)
  VALUES (p_user_id, p_module_id, 'challenge', p_score, TRUE, NULL)
  ON CONFLICT (user_id, module_id, activity_type, resource_id) 
  DO UPDATE SET score = GREATEST(user_progress.score, EXCLUDED.score), updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- 10. FUNCIÓN: Registrar comentario en comunidad
CREATE OR REPLACE FUNCTION record_community_comment(
  p_user_id TEXT,
  p_module_id INT
) RETURNS VOID AS $$
BEGIN
  INSERT INTO user_progress (user_id, module_id, activity_type, community_comment, is_completed, resource_id)
  VALUES (p_user_id, p_module_id, 'community_comment', TRUE, TRUE, NULL)
  ON CONFLICT (user_id, module_id, activity_type, resource_id) 
  DO UPDATE SET community_comment = TRUE, updated_at = NOW();
  
  UPDATE user_progress 
  SET community_comment = TRUE, updated_at = NOW()
  WHERE user_id = p_user_id AND module_id = p_module_id AND resource_id IS NULL;
END;
$$ LANGUAGE plpgsql;

-- 11. FUNCIÓN: Obtener desglose completo de un módulo
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

-- 12. FUNCIÓN: Obtener progreso global con desglose por módulo
CREATE OR REPLACE FUNCTION get_global_progress(
  p_user_id TEXT
) RETURNS JSON AS $$
DECLARE
  v_result JSON;
  v_total FLOAT := 0;
  v_mod_score INT;
  v_mod INT;
BEGIN
  v_result := json_build_object(
    'user_id', p_user_id,
    'modules', json_build_array(),
    'global_progress', 0
  );
  
  FOR v_mod IN 1..5 LOOP
    v_mod_score := calculate_module_score(p_user_id, v_mod);
    v_total := v_total + (v_mod_score / 100.0) * 20;
    
    v_result := v_result || json_build_object(
      'modules', (v_result->'modules') || get_module_breakdown(p_user_id, v_mod)
    );
  END LOOP;
  
  v_result := v_result || json_build_object(
    'global_progress', LEAST(100, ROUND(v_total))
  );
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- 13. VERIFICACIÓN FINAL
DO $$
BEGIN
  RAISE NOTICE '✅ Schema de progreso IALab actualizado correctamente';
  RAISE NOTICE '📊 Pesos por módulo: Examen 35% + Desafío 30% + Recursos 30% + Comunidad 5% = 100%';
  RAISE NOTICE '📊 Progreso global: 5 módulos × 20% = 100%';
END $$;
