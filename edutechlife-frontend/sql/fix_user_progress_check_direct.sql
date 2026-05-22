-- ============================================
-- Fix directo: CHECK constraint de user_progress
-- Sin DO blocks - ejecución directa
-- ============================================

-- 1. Ver constraint actual
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'public.user_progress'::regclass 
AND contype = 'c';

-- 2. Eliminar constraint existente
ALTER TABLE public.user_progress DROP CONSTRAINT IF EXISTS user_progress_activity_type_check;

-- 3. Crear nuevo constraint con 'gamification'
ALTER TABLE public.user_progress ADD CONSTRAINT user_progress_activity_type_check
  CHECK (activity_type IN ('video', 'document', 'pdf', 'ova', 'interactive', 'exam', 'challenge', 'community_comment', 'gamification'));

-- 4. Verificar
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'public.user_progress'::regclass 
AND contype = 'c';
