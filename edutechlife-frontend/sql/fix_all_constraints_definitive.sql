-- ============================================
-- Fix DEFINITIVO de todos los CHECK constraints
-- Cubre TODOS los activity_type usados en la app
-- ============================================

-- ============================================
-- 1. user_progress
-- ============================================
ALTER TABLE public.user_progress DROP CONSTRAINT IF EXISTS user_progress_activity_type_check;

ALTER TABLE public.user_progress ADD CONSTRAINT user_progress_activity_type_check
  CHECK (activity_type IN (
    'activity',
    'challenge',
    'challenge_draft',
    'community',
    'community_comment',
    'document',
    'exam',
    'gamification',
    'image',
    'infographic',
    'interactive',
    'lab',
    'lesson',
    'module',
    'ova',
    'ova_interactive',
    'pdf',
    'reading',
    'resource',
    'session',
    'video'
  ));

-- ============================================
-- 2. activity_log
-- ============================================
-- Primero ver qué constraint existe
DO $$
DECLARE
    con_name text;
BEGIN
    SELECT con.conname INTO con_name
    FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    WHERE rel.relname = 'activity_log'
    AND con.contype = 'c'
    LIMIT 1;

    IF con_name IS NOT NULL THEN
        EXECUTE format('ALTER TABLE public.activity_log DROP CONSTRAINT IF EXISTS %I', con_name);
        RAISE NOTICE 'CHECK constraint % dropped from activity_log', con_name;
    ELSE
        RAISE NOTICE 'No CHECK constraint found on activity_log';
    END IF;
END $$;

ALTER TABLE public.activity_log ADD CONSTRAINT activity_log_activity_type_check
  CHECK (activity_type IN (
    'session',
    'lesson',
    'resource',
    'module',
    'exam',
    'challenge',
    'community_comment',
    'activity',
    'challenge_draft',
    'video',
    'document',
    'pdf',
    'ova',
    'interactive',
    'infographic',
    'image',
    'lab',
    'reading',
    'ova_interactive'
  ));

-- ============================================
-- 3. Verificación
-- ============================================
SELECT 'user_progress' AS table_name, conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'public.user_progress'::regclass
AND contype = 'c';

SELECT 'activity_log' AS table_name, conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'public.activity_log'::regclass
AND contype = 'c';
