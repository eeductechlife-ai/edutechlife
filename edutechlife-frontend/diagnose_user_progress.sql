-- DIAGNÓSTICO DE TABLA user_progress
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar estructura de tabla user_progress
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'user_progress'
ORDER BY ordinal_position;

-- 2. Si falta module_id, agregarla
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_progress' 
        AND column_name = 'module_id'
    ) THEN
        RAISE NOTICE '⚠️ Columna module_id NO existe en user_progress. Agregando...';
        
        -- Agregar columna module_id
        ALTER TABLE public.user_progress 
        ADD COLUMN module_id INTEGER;
        
        RAISE NOTICE '✅ Columna module_id agregada';
    ELSE
        RAISE NOTICE '✅ Columna module_id ya existe';
    END IF;
END $$;

-- 3. Verificar otras columnas críticas que podrían faltar
DO $$ 
BEGIN
    -- Verificar user_id
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_progress' 
        AND column_name = 'user_id'
    ) THEN
        RAISE NOTICE '⚠️ Columna user_id NO existe. Agregando...';
        ALTER TABLE public.user_progress ADD COLUMN user_id UUID;
        RAISE NOTICE '✅ Columna user_id agregada';
    END IF;
    
    -- Verificar progress_percentage
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_progress' 
        AND column_name = 'progress_percentage'
    ) THEN
        RAISE NOTICE '⚠️ Columna progress_percentage NO existe. Agregando...';
        ALTER TABLE public.user_progress ADD COLUMN progress_percentage INTEGER DEFAULT 0;
        RAISE NOTICE '✅ Columna progress_percentage agregada';
    END IF;
    
    -- Verificar completed
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_progress' 
        AND column_name = 'completed'
    ) THEN
        RAISE NOTICE '⚠️ Columna completed NO existe. Agregando...';
        ALTER TABLE public.user_progress ADD COLUMN completed BOOLEAN DEFAULT false;
        RAISE NOTICE '✅ Columna completed agregada';
    END IF;
    
    -- Verificar last_accessed
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_progress' 
        AND column_name = 'last_accessed'
    ) THEN
        RAISE NOTICE '⚠️ Columna last_accessed NO existe. Agregando...';
        ALTER TABLE public.user_progress ADD COLUMN last_accessed TIMESTAMPTZ DEFAULT now();
        RAISE NOTICE '✅ Columna last_accessed agregada';
    END IF;
END $$;

-- 4. Verificar estructura actualizada
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'user_progress'
ORDER BY ordinal_position;

-- 5. Mensaje final
DO $$ 
BEGIN
    RAISE NOTICE '🎯 TABLA user_progress DIAGNOSTICADA';
    RAISE NOTICE 'Ahora debería funcionar:';
    RAISE NOTICE '1. progress.js → Consultas exitosas';
    RAISE NOTICE '2. IALab.jsx → Carga de progreso sin errores';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️ Si persisten errores, verificar:';
    RAISE NOTICE '   - Políticas RLS para user_progress';
    RAISE NOTICE '   - Datos de prueba en la tabla';
END $$;