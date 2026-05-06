-- Verificar que user_id es ahora TEXT
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'notifications' AND column_name = 'user_id';

-- Debe mostrar: user_id | text | NO

-- Test: insertar una notificación de prueba (reemplazar con user_id real de Clerk)
-- Descomentar y ejecutar con un user_id real:
-- INSERT INTO notifications (user_id, type, title, message) 
-- VALUES ('user_TU_ID_REAL_AQUI', 'general', 'Test', 'Notificación de prueba');

-- Verificar inserción
-- SELECT * FROM notifications ORDER BY created_at DESC LIMIT 5;
