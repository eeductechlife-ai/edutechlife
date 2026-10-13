-- ============================================================================
-- 102_leads_boletin_y_telefono.sql
--
-- Ajusta la tabla `leads` (100) para dos formularios:
--   * Boletín del footer (fuente 'boletin'): solo pide correo, no nombre.
--   * Nico: pide teléfono/WhatsApp y el correo es opcional.
-- Reglas: el nombre es obligatorio salvo en el boletín, y todo lead trae al
-- menos un medio de contacto (correo o teléfono). RLS y permisos no cambian.
-- Idempotente: se puede ejecutar más de una vez.
-- ============================================================================

ALTER TABLE public.leads ALTER COLUMN nombre DROP NOT NULL;
ALTER TABLE public.leads ALTER COLUMN email DROP NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'leads_nombre_requerido' AND conrelid = 'public.leads'::regclass
  ) THEN
    ALTER TABLE public.leads
      ADD CONSTRAINT leads_nombre_requerido CHECK (nombre IS NOT NULL OR fuente = 'boletin');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'leads_medio_contacto' AND conrelid = 'public.leads'::regclass
  ) THEN
    ALTER TABLE public.leads
      ADD CONSTRAINT leads_medio_contacto CHECK (email IS NOT NULL OR telefono IS NOT NULL);
  END IF;
END $$;
