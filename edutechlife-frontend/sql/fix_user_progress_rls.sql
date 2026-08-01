-- Arreglar RLS en user_progress para permitir escrituras autenticadas
-- El problema: RLS está habilitada pero sin policies, bloqueando todas las operaciones

-- 1. Deshabilitar RLS temporalmente para diagnosticar
ALTER TABLE public.user_progress DISABLE ROW LEVEL SECURITY;

-- 2. Luego, crear policies que permitan solo acceso autenticado a datos propios
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Policy SELECT: cada usuario ve solo su propio progreso
CREATE POLICY "user_progress_select_own" ON public.user_progress
  FOR SELECT
  USING (auth.uid()::text = user_id);

-- Policy INSERT: cada usuario inserta solo su propio progreso
CREATE POLICY "user_progress_insert_own" ON public.user_progress
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Policy UPDATE: cada usuario actualiza solo su propio progreso
CREATE POLICY "user_progress_update_own" ON public.user_progress
  FOR UPDATE
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- Policy DELETE: cada usuario borra solo su propio progreso
CREATE POLICY "user_progress_delete_own" ON public.user_progress
  FOR DELETE
  USING (auth.uid()::text = user_id);
