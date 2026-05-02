-- ============================================
-- SCRIPT DE VERIFICACIÓN: Sistema de Progreso IALab
-- Ejecutar DESPUÉS de ejecutar el script principal
-- ============================================

-- 1. Verificar que la tabla quiz_attempts existe
SELECT '✅ Tabla quiz_attempts' AS check_item, 
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'quiz_attempts') 
            THEN 'EXISTS' ELSE 'MISSING' END AS status;

-- 2. Verificar columnas de user_progress
SELECT '✅ Columna activity_type' AS check_item,
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_progress' AND column_name = 'activity_type')
            THEN 'EXISTS' ELSE 'MISSING' END AS status;

SELECT '✅ Columna resource_id' AS check_item,
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_progress' AND column_name = 'resource_id')
            THEN 'EXISTS' ELSE 'MISSING' END AS status;

SELECT '✅ Columna module_score' AS check_item,
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_progress' AND column_name = 'module_score')
            THEN 'EXISTS' ELSE 'MISSING' END AS status;

SELECT '✅ Columna resources_viewed' AS check_item,
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_progress' AND column_name = 'resources_viewed')
            THEN 'EXISTS' ELSE 'MISSING' END AS status;

SELECT '✅ Columna total_resources' AS check_item,
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_progress' AND column_name = 'total_resources')
            THEN 'EXISTS' ELSE 'MISSING' END AS status;

SELECT '✅ Columna community_comment' AS check_item,
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_progress' AND column_name = 'community_comment')
            THEN 'EXISTS' ELSE 'MISSING' END AS status;

-- 3. Verificar constraint unique
SELECT '✅ Unique constraint' AS check_item,
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'user_progress' AND constraint_name = 'uq_user_progress_activity_resource')
            THEN 'EXISTS' ELSE 'MISSING' END AS status;

-- 4. Verificar funciones
SELECT '✅ Función calculate_module_score' AS check_item,
       CASE WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'calculate_module_score')
            THEN 'EXISTS' ELSE 'MISSING' END AS status;

SELECT '✅ Función calculate_global_progress' AS check_item,
       CASE WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'calculate_global_progress')
            THEN 'EXISTS' ELSE 'MISSING' END AS status;

SELECT '✅ Función get_module_breakdown' AS check_item,
       CASE WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_module_breakdown')
            THEN 'EXISTS' ELSE 'MISSING' END AS status;

-- 5. Verificar trigger
SELECT '✅ Trigger trg_update_module_score' AS check_item,
       CASE WHEN EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_update_module_score')
            THEN 'EXISTS' ELSE 'MISSING' END AS status;

-- 6. Verificar índices
SELECT '✅ Índice idx_user_progress_user' AS check_item,
       CASE WHEN EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_progress_user')
            THEN 'EXISTS' ELSE 'MISSING' END AS status;

SELECT '✅ Índice idx_quiz_attempts_user_module' AS check_item,
       CASE WHEN EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_quiz_attempts_user_module')
            THEN 'EXISTS' ELSE 'MISSING' END AS status;

-- 7. Resumen final
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '📋 RESUMEN DE VERIFICACIÓN';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Si todas las verificaciones muestran "EXISTS", el schema está correcto.';
  RAISE NOTICE 'Si alguna muestra "MISSING", ejecuta el script principal nuevamente.';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️ IMPORTANTE: Asegúrate de que las políticas RLS permitan';
  RAISE NOTICE '   que tu usuario pueda INSERT y SELECT en ambas tablas.';
  RAISE NOTICE '========================================';
END $$;
