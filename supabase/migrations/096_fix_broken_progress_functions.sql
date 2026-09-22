-- ============================================================================
-- 096_fix_broken_progress_functions.sql
--
-- Arregla cuatro funciones de progreso que estaban ROTAS en producción (bugs
-- de cuerpo preexistentes, independientes de la separación por schemas: los
-- tres errores se reproducen en cualquier PostgreSQL y no dependen del
-- search_path ni de en qué schema viva la tabla).
--
-- Evidencia (antes del arreglo):
--   * get_module_full(module_id)      → `column reference "module_id" is ambiguous`
--       (el parámetro `module_id` choca con la columna `module_id` de
--        module_lessons/module_topics; PL/pgSQL lo trata como error).
--       La ruta /api/ialab/modules/:id lo usa y hoy cae al catálogo estático.
--   * get_module_breakdown(...)       → `function round(double precision, integer) does not exist`
--       (v_resources_pct es FLOAT y ROUND(x, n) sólo existe para numeric).
--   * get_user_overall_progress(uuid) → `column "lesson_id" does not exist`
--       (user_progress no tiene lesson_id; sí last_lesson_id y completed_lessons).
--   * get_global_progress(text)       → `operator does not exist: json || json`
--       (concatenación de json; hay que usar jsonb).
--
-- Ninguna de las cuatro la llama el código de la app (0 referencias en
-- frontend y backend) salvo get_module_full (que tiene fallback), pero se
-- arreglan para que la base sea consistente y no queden rutas muertas.
-- Sólo se redefinen cuerpos: mismas firmas, mismos tipos de retorno.
-- ============================================================================

BEGIN;

-- ── 1. get_module_full: evitar la ambigüedad del parámetro ──────────────────
-- Se referencia el parámetro posicionalmente ($1) en lugar de por nombre.
CREATE OR REPLACE FUNCTION public.get_module_full(module_id integer)
RETURNS jsonb
LANGUAGE plpgsql
SET search_path TO 'ialab', 'smartboard', 'public'
AS $function$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'module', row_to_json(mc)::jsonb,
    'lessons', COALESCE(jsonb_agg(ml ORDER BY ml.lesson_index) FILTER (WHERE ml.id IS NOT NULL), '[]'::jsonb),
    'topics', COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'topic', row_to_json(mt)::jsonb,
          'resources', COALESCE(
            (SELECT jsonb_agg(row_to_json(mr)::jsonb ORDER BY mr.sort_order)
               FROM module_resources mr
              WHERE mr.topic_id = mt.id AND mr.is_active),
            '[]'::jsonb)
        ) ORDER BY mt.sort_order
      ) FILTER (WHERE mt.id IS NOT NULL), '[]'::jsonb),
    'quiz', COALESCE(jsonb_agg(qq ORDER BY qq.sort_order) FILTER (WHERE qq.id IS NOT NULL), '[]'::jsonb)
  )
  INTO result
  FROM module_content mc
  LEFT JOIN module_lessons ml ON ml.module_id = mc.id AND ml.is_active
  LEFT JOIN module_topics mt ON mt.module_id = mc.id AND mt.is_active
  LEFT JOIN quiz_questions qq ON qq.module_id = mc.id AND qq.is_active
  WHERE mc.id = $1
  GROUP BY mc.id;

  RETURN result;
END;
$function$;

-- ── 2. get_module_breakdown: ROUND sólo admite numeric con precisión ────────
CREATE OR REPLACE FUNCTION public.get_module_breakdown(p_user_id text, p_module_id integer)
RETURNS json
LANGUAGE plpgsql
SET search_path TO 'ialab', 'smartboard', 'public'
AS $function$
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
  SELECT is_completed, score INTO v_exam_passed, v_exam_score
    FROM user_progress
   WHERE user_id = p_user_id AND module_id = p_module_id AND activity_type = 'exam'
   LIMIT 1;
  IF v_exam_score IS NULL THEN
    v_exam_passed := FALSE; v_exam_score := 0;
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

  SELECT COALESCE(BOOL_OR(community_comment), FALSE) INTO v_has_comment
    FROM user_progress
   WHERE user_id = p_user_id AND module_id = p_module_id;

  v_module_score := calculate_module_score(p_user_id, p_module_id);
  v_mod_progress := (v_module_score::FLOAT / 100.0) * 20;

  v_result := json_build_object(
    'module_id', p_module_id,
    'exam', json_build_object('passed', v_exam_passed, 'score', v_exam_score, 'weight', 35,
                              'earned', CASE WHEN v_exam_passed THEN 35 ELSE 0 END),
    'challenge', json_build_object('score', v_challenge_score, 'weight', 30,
                                   'earned', ROUND((v_challenge_score / 100.0) * 30, 1)),
    'resources', json_build_object('viewed', v_resources_viewed, 'total', v_total_resources, 'weight', 30,
                                   'earned', ROUND(v_resources_pct::numeric, 1)),
    'community', json_build_object('commented', v_has_comment, 'weight', 5,
                                   'earned', CASE WHEN v_has_comment THEN 5 ELSE 0 END),
    'module_score', v_module_score,
    'module_progress_pct', ROUND(v_mod_progress::numeric, 1)
  );
  RETURN v_result;
END;
$function$;

-- ── 3. get_user_overall_progress: usar columnas reales de user_progress ─────
-- user_progress no tiene `lesson_id`: se cuentan los recursos del módulo
-- (resources_viewed) y los módulos aprobados por module_score >= 80.
CREATE OR REPLACE FUNCTION public.get_user_overall_progress(p_user_id uuid)
RETURNS TABLE(
  completed_lessons bigint,
  total_lessons bigint,
  percentage numeric,
  completed_modules integer,
  total_modules integer
)
LANGUAGE plpgsql
SET search_path TO 'ialab', 'smartboard', 'public'
AS $function$
DECLARE
  v_total bigint := 0;
  v_done bigint := 0;
BEGIN
  SELECT COALESCE(SUM(COALESCE(total_resources, 0)), 0),
         COALESCE(SUM(COALESCE(resources_viewed, 0)), 0)
    INTO v_total, v_done
    FROM user_progress
   WHERE user_id = p_user_id::text AND activity_type IS NULL;

  RETURN QUERY
  SELECT v_done,
         v_total,
         CASE WHEN v_total > 0
              THEN ROUND(v_done::numeric / v_total::numeric * 100, 2)
              ELSE 0::numeric END,
         (SELECT count(DISTINCT module_id)::int
            FROM user_progress
           WHERE user_id = p_user_id::text AND COALESCE(module_score, 0) >= 80),
         5;
END;
$function$;

-- ── 4. get_global_progress: jsonb en lugar de json (json||json no existe) ───
CREATE OR REPLACE FUNCTION public.get_global_progress(p_user_id text)
RETURNS json
LANGUAGE plpgsql
SET search_path TO 'ialab', 'smartboard', 'public'
AS $function$
DECLARE
  v_result JSONB;
  v_total FLOAT := 0;
  v_mod_score INT;
  v_mod INT;
BEGIN
  v_result := jsonb_build_object(
    'user_id', p_user_id,
    'modules', '[]'::jsonb,
    'global_progress', 0
  );

  FOR v_mod IN 1..5 LOOP
    v_mod_score := calculate_module_score(p_user_id, v_mod);
    v_total := v_total + (v_mod_score / 100.0) * 20;
    v_result := v_result || jsonb_build_object(
      'modules',
      (v_result->'modules') || COALESCE(get_module_breakdown(p_user_id, v_mod)::jsonb, '[]'::jsonb)
    );
  END LOOP;

  v_result := v_result || jsonb_build_object('global_progress', LEAST(100, ROUND(v_total::numeric)));
  RETURN v_result::json;
END;
$function$;

COMMIT;
