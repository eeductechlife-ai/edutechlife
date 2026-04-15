-- VERIFICAR Y ACTIVAR TRIGGER handle_new_user
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar si la función handle_new_user existe
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- 2. Verificar si el trigger on_auth_user_created existe
SELECT tgname, tgrelid::regclass, tgfoid::regproc, tgenabled
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

-- 3. Si no existe la función, crearla
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_proc WHERE proname = 'handle_new_user'
    ) THEN
        RAISE NOTICE '⚠️ Función handle_new_user NO existe. Creando...';
        
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS TRIGGER AS $$
        BEGIN
            INSERT INTO public.profiles (id, email, full_name, phone, role)
            VALUES (
                NEW.id,
                NEW.email,
                NEW.raw_user_meta_data->>'full_name',
                NEW.raw_user_meta_data->>'phone',
                COALESCE(NEW.raw_user_meta_data->>'role', 'student')
            );
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
        
        RAISE NOTICE '✅ Función handle_new_user creada';
    ELSE
        RAISE NOTICE '✅ Función handle_new_user ya existe';
    END IF;
END $$;

-- 4. Si no existe el trigger, crearlo
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
    ) THEN
        RAISE NOTICE '⚠️ Trigger on_auth_user_created NO existe. Creando...';
        
        CREATE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
        
        RAISE NOTICE '✅ Trigger on_auth_user_created creado';
    ELSE
        RAISE NOTICE '✅ Trigger on_auth_user_created ya existe';
    END IF;
END $$;

-- 5. Verificar que el trigger esté activo (tgenabled = 'O')
SELECT 
    tgname,
    tgrelid::regclass AS table_name,
    tgfoid::regproc AS function_name,
    CASE tgenabled 
        WHEN 'O' THEN '✅ ACTIVO'
        WHEN 'D' THEN '❌ DESACTIVADO'
        WHEN 'R' THEN '⚠️ REHABILITADO'
        ELSE '❓ DESCONOCIDO'
    END AS status
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

-- 6. Si el trigger está desactivado, activarlo
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'on_auth_user_created' 
        AND tgenabled != 'O'
    ) THEN
        RAISE NOTICE '⚠️ Trigger está desactivado. Activando...';
        ALTER TABLE auth.users ENABLE TRIGGER on_auth_user_created;
        RAISE NOTICE '✅ Trigger activado';
    END IF;
END $$;

-- 7. Probar con un usuario existente (solo si hay usuarios sin perfil)
-- NOTA: Esto creará perfiles para usuarios existentes
DO $$ 
DECLARE
    user_count INTEGER;
BEGIN
    -- Contar usuarios auth.users sin perfil en public.profiles
    SELECT COUNT(*) INTO user_count
    FROM auth.users u
    LEFT JOIN public.profiles p ON u.id = p.id
    WHERE p.id IS NULL;
    
    IF user_count > 0 THEN
        RAISE NOTICE '⚠️ Hay % usuarios sin perfil. Creando perfiles...', user_count;
        
        -- Crear perfiles para usuarios existentes
        INSERT INTO public.profiles (id, email, full_name, phone, role)
        SELECT 
            u.id,
            u.email,
            COALESCE(u.raw_user_meta_data->>'full_name', ''),
            COALESCE(u.raw_user_meta_data->>'phone', ''),
            COALESCE(u.raw_user_meta_data->>'role', 'student')
        FROM auth.users u
        LEFT JOIN public.profiles p ON u.id = p.id
        WHERE p.id IS NULL;
        
        RAISE NOTICE '✅ % perfiles creados para usuarios existentes', user_count;
    ELSE
        RAISE NOTICE '✅ Todos los usuarios tienen perfil';
    END IF;
END $$;

-- 8. Mensaje final
DO $$ 
BEGIN
    RAISE NOTICE '🎯 TRIGGER CONFIGURADO';
    RAISE NOTICE 'Ahora, cuando un usuario se registre en Clerk:';
    RAISE NOTICE '1. Clerk crea usuario en auth.users';
    RAISE NOTICE '2. Trigger on_auth_user_created se activa';
    RAISE NOTICE '3. Función handle_new_user crea perfil automáticamente';
    RAISE NOTICE '4. AuthContext puede cargar el perfil sin errores';
END $$;