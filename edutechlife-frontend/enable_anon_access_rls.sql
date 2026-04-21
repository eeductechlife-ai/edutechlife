-- Configurar políticas RLS para permitir acceso anónimo (solo desarrollo)
-- Este script permite acceso de lectura anónimo a tablas críticas

-- 1. Asegurar que RLS está habilitado
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- 2. Eliminar políticas existentes si las hay (para desarrollo)
DROP POLICY IF EXISTS "anon_select_forum_posts" ON forum_posts;
DROP POLICY IF EXISTS "anon_select_profiles" ON profiles;
DROP POLICY IF EXISTS "anon_select_forum_votes" ON forum_votes;
DROP POLICY IF EXISTS "anon_select_user_progress" ON user_progress;

-- 3. Crear políticas de SELECT para anon (acceso de lectura público)
-- forum_posts: permitir a cualquier usuario ver posts
CREATE POLICY "anon_select_forum_posts" ON forum_posts
FOR SELECT TO anon
USING (true);

-- profiles: permitir a cualquier usuario ver perfiles (solo desarrollo)
CREATE POLICY "anon_select_profiles" ON profiles
FOR SELECT TO anon
USING (true);

-- forum_votes: permitir a cualquier usuario ver votos
CREATE POLICY "anon_select_forum_votes" ON forum_votes
FOR SELECT TO anon
USING (true);

-- user_progress: permitir a cualquier usuario ver progreso (solo desarrollo)
CREATE POLICY "anon_select_user_progress" ON user_progress
FOR SELECT TO anon
USING (true);

-- 4. Políticas para INSERT (solo desarrollo - permitir creación anónima)
-- forum_posts: permitir creación anónima (solo desarrollo)
CREATE POLICY "anon_insert_forum_posts" ON forum_posts
FOR INSERT TO anon
WITH CHECK (true);

-- forum_votes: permitir creación anónima de votos (solo desarrollo)
CREATE POLICY "anon_insert_forum_votes" ON forum_votes
FOR INSERT TO anon
WITH CHECK (true);

-- 5. Verificar políticas creadas
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
  AND tablename IN ('forum_posts', 'profiles', 'forum_votes', 'user_progress')
ORDER BY tablename, policyname;

-- 6. Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE '✅ Políticas RLS configuradas para acceso anónimo (solo desarrollo)';
    RAISE NOTICE '   - forum_posts: SELECT e INSERT permitidos para anon';
    RAISE NOTICE '   - profiles: SELECT permitido para anon';
    RAISE NOTICE '   - forum_votes: SELECT e INSERT permitidos para anon';
    RAISE NOTICE '   - user_progress: SELECT permitido para anon';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  ADVERTENCIA: Estas políticas son solo para desarrollo';
    RAISE NOTICE '   En producción, reemplazar con políticas para usuarios autenticados';
END $$;