-- Agrega columna gamification_data a user_progress para sincronizar XP, streak, badges
-- Ejecutar en Supabase SQL Editor

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'user_progress'
    AND column_name = 'gamification_data'
  ) THEN
    ALTER TABLE public.user_progress ADD COLUMN gamification_data JSONB;
    RAISE NOTICE '✅ Columna gamification_data agregada a user_progress';
  ELSE
    RAISE NOTICE '✅ Columna gamification_data ya existe';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.check_constraints cc
    JOIN information_schema.constraint_column_usage ccu ON cc.constraint_name = ccu.constraint_name
    WHERE ccu.table_name = 'user_progress'
    AND ccu.column_name = 'activity_type'
    AND cc.constraint_schema = 'public'
  ) THEN
    ALTER TABLE public.user_progress DROP CONSTRAINT IF EXISTS user_progress_activity_type_check;
    ALTER TABLE public.user_progress ADD CONSTRAINT user_progress_activity_type_check
      CHECK (activity_type IN ('video', 'document', 'pdf', 'ova', 'interactive', 'exam', 'challenge', 'community_comment', 'gamification'));
    RAISE NOTICE '✅ CHECK constraint de activity_type actualizado';
  ELSE
    RAISE NOTICE '⚠️ No se encontró CHECK constraint para activity_type, se crea uno nuevo';
    ALTER TABLE public.user_progress ADD CONSTRAINT user_progress_activity_type_check
      CHECK (activity_type IN ('video', 'document', 'pdf', 'ova', 'interactive', 'exam', 'challenge', 'community_comment', 'gamification'));
  END IF;

  RAISE NOTICE '✅ Migración gamification_data completada';
END $$;
