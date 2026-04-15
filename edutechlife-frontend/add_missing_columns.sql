-- AGREGAR COLUMNAS FALTANTES A TABLA PROFILES
-- Ejecutar en Supabase SQL Editor

-- 1. Agregar columna created_at si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'created_at'
    ) THEN
        ALTER TABLE public.profiles 
        ADD COLUMN created_at TIMESTAMPTZ DEFAULT now();
        RAISE NOTICE '✅ Columna created_at agregada';
    ELSE
        RAISE NOTICE '⚠️ Columna created_at ya existe';
    END IF;
END $$;

-- 2. Agregar columna updated_at si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE public.profiles 
        ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();
        RAISE NOTICE '✅ Columna updated_at agregada';
    ELSE
        RAISE NOTICE '⚠️ Columna updated_at ya existe';
    END IF;
END $$;

-- 3. Agregar columna avatar_url si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'avatar_url'
    ) THEN
        ALTER TABLE public.profiles 
        ADD COLUMN avatar_url TEXT;
        RAISE NOTICE '✅ Columna avatar_url agregada';
    ELSE
        RAISE NOTICE '⚠️ Columna avatar_url ya existe';
    END IF;
END $$;

-- 4. Verificar estructura actualizada
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 5. Actualizar función handle_new_user para usar columnas correctas
-- (Opcional - solo si el trigger sigue fallando)
DO $$ 
BEGIN
    -- Verificar si la función existe
    IF EXISTS (
        SELECT 1 
        FROM pg_proc 
        WHERE proname = 'handle_new_user'
    ) THEN
        RAISE NOTICE 'ℹ️ Función handle_new_user existe. Verificar que use columnas correctas.';
    ELSE
        RAISE NOTICE '⚠️ Función handle_new_user NO existe. Crear con:';
        RAISE NOTICE '
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS TRIGGER AS $$
        BEGIN
            INSERT INTO public.profiles (id, email, full_name, phone, role, created_at, updated_at)
            VALUES (
                NEW.id,
                NEW.email,
                NEW.raw_user_meta_data->>''full_name'',
                NEW.raw_user_meta_data->>''phone'',
                COALESCE(NEW.raw_user_meta_data->>''role'', ''student''),
                NOW(),
                NOW()
            );
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
        ';
    END IF;
END $$;

-- 6. Mensaje final
DO $$ 
BEGIN
    RAISE NOTICE '🎯 COLUMNAS ACTUALIZADAS';
    RAISE NOTICE 'Ahora debería funcionar:';
    RAISE NOTICE '1. Registro de usuarios → Creación automática en profiles';
    RAISE NOTICE '2. AuthContext → Consultas exitosas';
    RAISE NOTICE '3. UserProfileSmartCard → Guardado de teléfono';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️ Si persisten errores, verificar:';
    RAISE NOTICE '   - Políticas RLS para UPDATE en profiles';
    RAISE NOTICE '   - Trigger on_auth_user_created está activo';
END $$;