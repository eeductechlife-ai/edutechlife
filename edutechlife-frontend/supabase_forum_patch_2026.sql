-- ============================================
-- EDUTECHLIFE FORUM - PATCH DE SEGURIDAD Y COMPATIBILIDAD 2026
-- Parche para resolver: TypeError: popularTags.slice is not a function
-- Script consolidado para Supabase
-- ============================================

-- 1. Asegurar estructura y limpiar nulos de tags
ALTER TABLE public.forum_posts 
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS recent timestamp with time zone DEFAULT now();

-- Actualizar tags nulos a array vacío
UPDATE public.forum_posts 
SET tags = '{}' 
WHERE tags IS NULL;

-- 2. Inserción de 5 posts de prueba para el IALab (Usando ID de John Edison Beltran)
-- Primero verificamos que el usuario existe
DO $$
DECLARE
    user_exists BOOLEAN;
BEGIN
    -- Verificar si el usuario existe en auth.users
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE id = '6e7b2fee-491f-4741-a783-9531953799e2') INTO user_exists;
    
    IF user_exists THEN
        -- Insertar posts de prueba solo si el usuario existe
        INSERT INTO public.forum_posts (user_id, content, tags, upvotes, is_verified, created_at, recent)
        VALUES 
        ('6e7b2fee-491f-4741-a783-9531953799e2', 'Explorando el IA-Lab: Diseñando prompts éticos para la educación y el futuro de Manizales.', ARRAY['IA', 'Ética', 'Educación'], 25, true, now(), now()),
        ('6e7b2fee-491f-4741-a783-9531953799e2', '¿Sabían que pueden automatizar el registro de asistencia usando n8n y nuestra API?', ARRAY['Automation', 'n8n'], 15, true, now(), now()),
        ('6e7b2fee-491f-4741-a783-9531953799e2', 'Bienvenidos a la Fase 2. Aquí transformaremos prototipos en soluciones reales.', ARRAY['Prototipado', 'IBM'], 10, true, now(), now()),
        ('6e7b2fee-491f-4741-a783-9531953799e2', 'El uso de metodologías VAK permite que la IA personalice el aprendizaje para cada estudiante.', ARRAY['VAK', 'STEAM'], 8, false, now(), now()),
        ('6e7b2fee-491f-4741-a783-9531953799e2', 'Compartan sus dudas sobre la integración de Gemini en sus proyectos escolares.', ARRAY['Gemini', 'Ayuda'], 5, false, now(), now())
        ON CONFLICT DO NOTHING;
        
        RAISE NOTICE 'Posts de prueba insertados exitosamente para el usuario 6e7b2fee-491f-4741-a783-9531953799e2';
    ELSE
        RAISE NOTICE 'Usuario 6e7b2fee-491f-4741-a783-9531953799e2 no encontrado en auth.users. Saltando inserción de posts de prueba.';
    END IF;
END $$;

-- 3. Crear función para obtener tags populares (si no existe)
CREATE OR REPLACE FUNCTION public.get_popular_tags(limit_count INTEGER DEFAULT 10)
RETURNS TABLE(name TEXT, count BIGINT) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    UNNEST(tags) as name,
    COUNT(*) as count
  FROM public.forum_posts
  WHERE tags IS NOT NULL AND array_length(tags, 1) > 0
  GROUP BY UNNEST(tags)
  ORDER BY count DESC
  LIMIT limit_count;
$$;

-- 4. Crear función para obtener estadísticas del foro (si no existe)
CREATE OR REPLACE FUNCTION public.get_forum_stats()
RETURNS TABLE(
  total_posts BIGINT,
  total_comments BIGINT,
  total_votes BIGINT,
  active_users BIGINT,
  recent_posts BIGINT
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    (SELECT COUNT(*) FROM public.forum_posts) as total_posts,
    (SELECT COUNT(*) FROM public.forum_comments) as total_comments,
    (SELECT COUNT(*) FROM public.forum_votes) as total_votes,
    (SELECT COUNT(DISTINCT user_id) FROM public.forum_posts WHERE created_at > NOW() - INTERVAL '7 days') as active_users,
    (SELECT COUNT(*) FROM public.forum_posts WHERE created_at > NOW() - INTERVAL '1 day') as recent_posts;
$$;

-- 5. Verificar y crear políticas RLS si es necesario
DO $$
BEGIN
    -- Verificar si las políticas RLS existen para forum_posts
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'forum_posts' AND schemaname = 'public') THEN
        -- Habilitar RLS
        ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
        
        -- Política para lectura pública
        CREATE POLICY "forum_posts_read_policy" ON public.forum_posts
        FOR SELECT USING (true);
        
        -- Política para inserción (solo usuarios autenticados)
        CREATE POLICY "forum_posts_insert_policy" ON public.forum_posts
        FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
        
        -- Política para actualización (solo el dueño del post)
        CREATE POLICY "forum_posts_update_policy" ON public.forum_posts
        FOR UPDATE USING (auth.uid() = user_id);
        
        RAISE NOTICE 'Políticas RLS creadas para forum_posts';
    END IF;
END $$;

-- 6. Verificar la estructura final
SELECT 
    'forum_posts' as table_name,
    COUNT(*) as row_count,
    (SELECT COUNT(*) FROM public.forum_posts WHERE tags IS NULL) as null_tags_count
FROM public.forum_posts
UNION ALL
SELECT 
    'forum_comments' as table_name,
    COUNT(*) as row_count,
    0 as null_tags_count
FROM public.forum_comments
UNION ALL
SELECT 
    'forum_votes' as table_name,
    COUNT(*) as row_count,
    0 as null_tags_count
FROM public.forum_votes;

-- 7. Mensaje de confirmación
RAISE NOTICE '✅ PATCH APLICADO EXITOSAMENTE:';
RAISE NOTICE '   - Estructura de tags asegurada';
RAISE NOTICE '   - Posts de prueba insertados (si el usuario existe)';
RAISE NOTICE '   - Funciones de soporte creadas/actualizadas';
RAISE NOTICE '   - Políticas RLS verificadas';