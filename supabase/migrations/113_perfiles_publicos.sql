-- ============================================================================
-- 113_perfiles_publicos.sql
-- Re-auditoría de seguridad oct-2026, hallazgo S2 (paso 1 de 2).
--
-- El ranking, la racha y el foro de IALab muestran nombre y avatar de OTROS
-- estudiantes leyendo la tabla profiles directamente. Hoy funciona porque
-- profiles está abierta a todo el mundo (USING (true)), incluido el correo y
-- el teléfono. La migración 114 cierra profiles para que cada usuario solo vea
-- su propia fila; esta función es la vía estrecha que reemplaza esa lectura:
-- devuelve únicamente id, full_name y avatar_url, solo a usuarios con sesión.
--
-- Solo agrega: no cambia ni quita nada. Aplicarla ANTES de 114 y antes de
-- desplegar el frontend que la llama (el frontend vuelve a la lectura directa
-- si la función todavía no existe).
--
-- NO APLICADA. Se aplica manualmente tras revisión del CEO (SQL Editor de
-- Supabase).
-- Deshacer: DROP FUNCTION IF EXISTS public.perfiles_publicos(text[]);
-- ============================================================================

-- plpgsql (y no sql): el cuerpo no se valida al crear la función. En una base
-- limpia (CI) profiles no tiene full_name ni avatar_url; en producción sí.
-- La comparación va como texto para servir con id uuid (CI) o text (prod).
CREATE OR REPLACE FUNCTION public.perfiles_publicos(p_ids text[])
RETURNS TABLE (id text, full_name text, avatar_url text)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
    SELECT p.id::text, p.full_name::text, p.avatar_url::text
    FROM public.profiles p
    WHERE auth.uid() IS NOT NULL
      AND p.id::text = ANY (p_ids[1:200]);
END;
$$;

COMMENT ON FUNCTION public.perfiles_publicos(text[]) IS
  'Nombre y avatar de hasta 200 perfiles para ranking, racha y foro. Sin correo ni teléfono. Solo usuarios con sesión.';

REVOKE ALL ON FUNCTION public.perfiles_publicos(text[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.perfiles_publicos(text[]) TO authenticated;
