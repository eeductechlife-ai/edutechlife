-- Habilitar Realtime para el progreso del estudiante
--
-- El canal de Realtime se suscribe correctamente con un JWT de Supabase, pero
-- no llegaba ningún evento porque las tablas de progreso no están incluidas en
-- la publicación `supabase_realtime`. Sin esto, un estudiante que termina un
-- examen en el celular no ve el cambio reflejado en el navegador que tiene
-- abierto en el computador.
--
-- Mismo patrón que ya se usó en sql/create_notifications_table.sql
--
-- Ejecutar en: Supabase Dashboard -> SQL Editor

-- REPLICA IDENTITY FULL hace que los eventos UPDATE/DELETE incluyan los valores
-- anteriores de la fila. Sin esto, `payload.old` sólo trae la clave primaria y
-- los filtros por user_id no funcionan al borrar.
ALTER TABLE public.user_progress REPLICA IDENTITY FULL;
ALTER TABLE public.activity_log REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'user_progress'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.user_progress;
    RAISE NOTICE 'Realtime habilitado para user_progress';
  ELSE
    RAISE NOTICE 'user_progress ya tenia Realtime habilitado';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'activity_log'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_log;
    RAISE NOTICE 'Realtime habilitado para activity_log';
  ELSE
    RAISE NOTICE 'activity_log ya tenia Realtime habilitado';
  END IF;
END $$;

-- Verificación: debe listar user_progress y activity_log
SELECT tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
ORDER BY tablename;
