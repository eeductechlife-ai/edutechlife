-- Safety net: rechazar scores decimales en activity_log
-- Previene 22P02 si el frontend envía floats

ALTER TABLE activity_log DROP CONSTRAINT IF EXISTS activity_log_score_int_check;
ALTER TABLE activity_log ADD CONSTRAINT activity_log_score_int_check
  CHECK (score IS NULL OR score = ROUND(score));

-- Verificar
SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'public.activity_log'::regclass
AND contype = 'c';
