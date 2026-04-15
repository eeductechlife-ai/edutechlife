-- FIX CASCADE RELATION: Configurar ON DELETE CASCADE para auth.users -> public.profiles
-- Ejecutar en Supabase SQL Editor

-- 1. Primero, eliminar la restricción de clave foránea existente (si existe)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'profiles_id_fkey' 
        AND table_name = 'profiles'
    ) THEN
        ALTER TABLE public.profiles 
        DROP CONSTRAINT profiles_id_fkey;
        RAISE NOTICE 'Restricción profiles_id_fkey eliminada';
    ELSE
        RAISE NOTICE 'Restricción profiles_id_fkey no existe';
    END IF;
END $$;

-- 2. Crear nueva restricción con ON DELETE CASCADE
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_id_fkey 
FOREIGN KEY (id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- 3. Verificar que la restricción se creó correctamente
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
JOIN information_schema.referential_constraints AS rc
    ON rc.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name = 'profiles';

-- 4. Probar eliminación de usuario de prueba (opcional)
-- NOTA: Solo ejecutar si tienes un usuario de prueba específico
-- DELETE FROM auth.users WHERE email = 'test@example.com';

-- 5. Mensaje de confirmación
DO $$ 
BEGIN
    RAISE NOTICE '✅ Restricción ON DELETE CASCADE configurada correctamente';
    RAISE NOTICE 'Ahora puedes eliminar usuarios desde Authentication sin errores';
    RAISE NOTICE 'Los registros correspondientes en profiles se eliminarán automáticamente';
END $$;