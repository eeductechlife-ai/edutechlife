-- CONFIGURACIÓN RLS SIMPLIFICADA PARA DESARROLLO
-- Ejecutar este SQL en el SQL Editor de Supabase Dashboard

-- 1. Habilitar RLS en las tablas (si no está habilitado)
ALTER TABLE IF EXISTS forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS forum_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_progress ENABLE ROW LEVEL SECURITY;

-- 2. Eliminar políticas existentes para desarrollo
DROP POLICY IF EXISTS "Allow anon to read forum_posts" ON forum_posts;
DROP POLICY IF EXISTS "Allow anon to read profiles" ON profiles;
DROP POLICY IF EXISTS "Allow anon to read forum_votes" ON forum_votes;
DROP POLICY IF EXISTS "Allow anon to read user_progress" ON user_progress;

DROP POLICY IF EXISTS "Allow anon to insert forum_posts" ON forum_posts;
DROP POLICY IF EXISTS "Allow anon to insert forum_votes" ON forum_votes;

-- 3. Crear políticas simples para desarrollo
-- Permite a usuarios anónimos leer forum_posts
CREATE POLICY "Allow anon to read forum_posts" ON forum_posts
FOR SELECT USING (true);

-- Permite a usuarios anónimos leer profiles  
CREATE POLICY "Allow anon to read profiles" ON profiles
FOR SELECT USING (true);

-- Permite a usuarios anónimos leer forum_votes
CREATE POLICY "Allow anon to read forum_votes" ON forum_votes
FOR SELECT USING (true);

-- Permite a usuarios anónimos leer user_progress
CREATE POLICY "Allow anon to read user_progress" ON user_progress
FOR SELECT USING (true);

-- Permite a usuarios anónimos crear posts (solo desarrollo)
CREATE POLICY "Allow anon to insert forum_posts" ON forum_posts
FOR INSERT WITH CHECK (true);

-- Permite a usuarios anónimos crear votos (solo desarrollo)
CREATE POLICY "Allow anon to insert forum_votes" ON forum_votes
FOR INSERT WITH CHECK (true);

-- 4. Verificar que las políticas se crearon
SELECT 
    tablename,
    policyname,
    cmd,
    roles
FROM pg_policies 
WHERE schemaname = 'public'
  AND tablename IN ('forum_posts', 'profiles', 'forum_votes', 'user_progress')
ORDER BY tablename, policyname;

-- 5. Mensaje de éxito
SELECT '✅ Políticas RLS configuradas para desarrollo' as message;