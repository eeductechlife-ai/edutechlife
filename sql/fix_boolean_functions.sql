-- ============================================
-- FIX: Funciones corregidas para tipos BOOLEAN y TEXT
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- 1. FUNCIÓN corregida: Calcular nota del módulo (BOOL_OR en vez de MAX para boolean)
CREATE OR REPLACE FUNCTION calculate_module_score(
  p_user_id TEXT,
  p_module_id INT
) RETURNS INT AS $$
DECLARE
  v_exam_score INT := 0;
  v_challenge_score FLOAT := 0;
  v_resources_pct FLOAT := 0;
  v_community_pct INT := 0;
  v_final_score INT := 0;
  v_resources_viewed INT := 0;
  v_total_resources INT := 0;
  v_has_comment BOOLEAN := FALSE;
  v_exam_passed BOOLEAN := FALSE;
BEGIN
  -- Examen: 35% (desde user_progress)
  SELECT is_completed INTO v_exam_passed
  FROM user_progress
  WHERE user_id = p_user_id AND module_id = p_module_id AND activity_type = 'exam'
  LIMIT 1;
  
  IF v_exam_passed THEN
    v_exam_score := 35;
  END IF;

  -- Desafío: 30% (proporcional)
  SELECT COALESCE(MAX(score), 0) INTO v_challenge_score
  FROM user_progress 
  WHERE user_id = p_user_id AND module_id = p_module_id AND activity_type = 'challenge';
  
  v_challenge_score := (v_challenge_score / 100.0) * 30;

  -- Recursos: 30% (proporcional)
  SELECT resources_viewed, total_resources INTO v_resources_viewed, v_total_resources
  FROM user_progress 
  WHERE user_id = p_user_id AND module_id = p_module_id 
  ORDER BY updated_at DESC LIMIT 1;
  
  IF v_total_resources > 0 THEN
    v_resources_pct := (v_resources_viewed::FLOAT / v_total_resources::FLOAT) * 30;
  END IF;

  -- Comunidad: 5% (FIX: BOOL_OR en vez de MAX para boolean)
  SELECT COALESCE(BOOL_OR(community_comment), FALSE) INTO v_has_comment
  FROM user_progress 
  WHERE user_id = p_user_id AND module_id = p_module_id;
  
  IF v_has_comment THEN
    v_community_pct := 5;
  END IF;

  v_final_score := LEAST(100, ROUND(v_exam_score + v_challenge_score + v_resources_pct + v_community_pct));
  
  RETURN v_final_score;
END;
$$ LANGUAGE plpgsql;

-- 2. FUNCIÓN corregida: get_module_breakdown (BOOL_OR en vez de MAX)
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
  -- Examen desde user_progress
  SELECT is_completed, score INTO v_exam_passed, v_exam_score
  FROM user_progress
  WHERE user_id = p_user_id AND module_id = p_module_id AND activity_type = 'exam'
  LIMIT 1;
  
  IF v_exam_score IS NULL THEN
    v_exam_passed := FALSE;
    v_exam_score := 0;
  END IF;

  -- Desafío
  SELECT COALESCE(MAX(score), 0) INTO v_challenge_score
  FROM user_progress 
  WHERE user_id = p_user_id AND module_id = p_module_id AND activity_type = 'challenge';

  -- Recursos
  SELECT COALESCE(MAX(resources_viewed), 0), COALESCE(MAX(total_resources), 0) 
  INTO v_resources_viewed, v_total_resources
  FROM user_progress 
  WHERE user_id = p_user_id AND module_id = p_module_id;
  
  IF v_total_resources > 0 THEN
    v_resources_pct := (v_resources_viewed::FLOAT / v_total_resources::FLOAT) * 30;
  ELSE
    v_resources_pct := 0;
  END IF;

  -- Comunidad (FIX: BOOL_OR en vez de MAX para boolean)
  SELECT COALESCE(BOOL_OR(community_comment), FALSE) INTO v_has_comment
  FROM user_progress 
  WHERE user_id = p_user_id AND module_id = p_module_id;

  v_module_score := calculate_module_score(p_user_id, p_module_id);
  v_mod_progress := (v_module_score::FLOAT / 100.0) * 20;

  v_result := json_build_object(
    'module_id', p_module_id,
    'exam', json_build_object('passed', v_exam_passed, 'score', v_exam_score, 'weight', 35, 'earned', CASE WHEN v_exam_passed THEN 35 ELSE 0 END),
    'challenge', json_build_object('score', v_challenge_score, 'weight', 30, 'earned', ROUND((v_challenge_score / 100.0) * 30, 1)),
    'resources', json_build_object('viewed', v_resources_viewed, 'total', v_total_resources, 'weight', 30, 'earned', ROUND(v_resources_pct, 1)),
    'community', json_build_object('commented', v_has_comment, 'weight', 5, 'earned', CASE WHEN v_has_comment THEN 5 ELSE 0 END),
    'module_score', v_module_score,
    'module_progress_pct', ROUND(v_mod_progress, 1)
  );

  RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- 3. FUNCIÓN corregida: calculate_global_progress
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

-- 4. TRIGGER: Actualizar module_score automáticamente
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

-- 5. HABILITAR RLS en quiz_attempts con políticas permissivas
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "quiz_insert_policy" ON quiz_attempts;
CREATE POLICY "quiz_insert_policy" ON quiz_attempts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "quiz_select_policy" ON quiz_attempts;
CREATE POLICY "quiz_select_policy" ON quiz_attempts FOR SELECT USING (true);

-- 6. VERIFICACIÓN FINAL
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ Funciones corregidas';
  RAISE NOTICE '========================================';
  RAISE NOTICE '  - calculate_module_score (BOOL_OR fix)';
  RAISE NOTICE '  - calculate_global_progress';
  RAISE NOTICE '  - get_module_breakdown (BOOL_OR fix)';
  RAISE NOTICE '  - update_module_score [TRIGGER]';
  RAISE NOTICE '  - quiz_attempts RLS policies';
  RAISE NOTICE '========================================';
END $$;
