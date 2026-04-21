-- Configuración de políticas RLS para EdutechLife
-- Este script configura políticas que permiten acceso autenticado con Clerk JWT

-- 1. Habilitar RLS en las tablas necesarias
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- 2. Políticas para forum_posts
-- Permitir a usuarios autenticados ver todos los posts
CREATE POLICY "Usuarios autenticados pueden ver posts" 
ON forum_posts FOR SELECT 
TO authenticated 
USING (true);

-- Permitir a usuarios autenticados crear posts
CREATE POLICY "Usuarios autenticados pueden crear posts" 
ON forum_posts FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Permitir a usuarios autenticados actualizar sus propios posts
CREATE POLICY "Usuarios pueden actualizar sus posts" 
ON forum_posts FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

-- Permitir a usuarios autenticados eliminar sus propios posts
CREATE POLICY "Usuarios pueden eliminar sus posts" 
ON forum_posts FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

-- 3. Políticas para forum_votes
-- Permitir a usuarios autenticados ver todos los votos
CREATE POLICY "Usuarios autenticados pueden ver votos" 
ON forum_votes FOR SELECT 
TO authenticated 
USING (true);

-- Permitir a usuarios autenticados crear votos
CREATE POLICY "Usuarios autenticados pueden crear votos" 
ON forum_votes FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Permitir a usuarios autenticados eliminar sus votos
CREATE POLICY "Usuarios pueden eliminar sus votos" 
ON forum_votes FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

-- 4. Políticas para profiles
-- Permitir a usuarios autenticados ver todos los perfiles
CREATE POLICY "Usuarios autenticados pueden ver perfiles" 
ON profiles FOR SELECT 
TO authenticated 
USING (true);

-- Permitir a usuarios autenticados actualizar su propio perfil
CREATE POLICY "Usuarios pueden actualizar su perfil" 
ON profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

-- Permitir inserción automática de perfiles (manejado por trigger)
CREATE POLICY "Inserción automática de perfiles" 
ON profiles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

-- 5. Políticas para user_progress
-- Permitir a usuarios autenticados ver su propio progreso
CREATE POLICY "Usuarios pueden ver su progreso" 
ON user_progress FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Permitir a usuarios autenticados crear/actualizar su progreso
CREATE POLICY "Usuarios pueden gestionar su progreso" 
ON user_progress FOR ALL 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 6. Política especial para desarrollo: permitir acceso anónimo a forum_posts (solo desarrollo)
-- COMENTAR ESTA LÍNEA EN PRODUCCIÓN
CREATE POLICY "Acceso anónimo a posts (solo desarrollo)" 
ON forum_posts FOR SELECT 
TO anon 
USING (true);

-- 7. Verificar políticas creadas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;