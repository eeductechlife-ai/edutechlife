# 🚀 INSTRUCCIONES: Corregir Error "Database error saving new user"

## 📋 **Problema Identificado**
**Error:** `AuthApiError: Database error saving new user`
**Ubicación:** `AuthContext.jsx:175`
**Causa:** El trigger SQL intenta insertar en columnas que NO EXISTEN en la tabla `profiles`

## 🎯 **Solución**
Ejecutar el script SQL `fix_profiles_structure.sql` que:
1. **Agrega columnas faltantes** (`email`, `full_name`, `phone`)
2. **Actualiza el trigger** `handle_new_user` para usar estructura correcta
3. **Es idempotente** (se puede ejecutar múltiples veces)

## 📁 **Archivo a Ejecutar**
`fix_profiles_structure.sql` (creado automáticamente)

## 🔧 **Pasos para Ejecutar**

### **Paso 1: Acceder a Supabase**
1. Ve a https://app.supabase.com
2. Inicia sesión con tus credenciales
3. Selecciona el proyecto: `srirrwpgswlnuqfgtule`
4. URL: https://srirrwpgswlnuqfgtule.supabase.co

### **Paso 2: Ir a SQL Editor**
1. En el menú lateral izquierdo, haz clic en **"SQL Editor"**
2. Haz clic en **"New query"**

### **Paso 3: Copiar y Ejecutar Script**
1. **Abre el archivo:** `fix_profiles_structure.sql`
2. **Copia TODO el contenido** (aproximadamente 400 líneas)
3. **Pega** en el editor SQL de Supabase
4. **Haz clic en "Run"** (botón azul)

### **Paso 4: Verificar Resultados**
El script mostrará mensajes como:
- `✅ Columna EMAIL agregada (CRÍTICA para trigger)`
- `✅ Función handle_new_user ACTUALIZADA (estructura corregida)`
- `✅ Trigger on_auth_user_created creado`

**IMPORTANTE:** Verifica que NO haya errores en rojo.

### **Paso 5: Revisar Estructura Final**
El script incluye una sección de verificación que muestra:
```
🎯 ESTRUCTURA ACTUAL DE LA TABLA PROFILES
```
- Todas las columnas deben mostrar `✅ PRESENTE`
- Especialmente: `email`, `full_name`, `phone`

## 🧪 **Testing Después de Ejecutar**

### **Test 1: Registrar Nuevo Usuario**
1. Ve a tu aplicación en `http://localhost:5174` (o producción)
2. Intenta registrar un nuevo usuario
3. **Verifica que NO aparezca el error:** `Database error saving new user`

### **Test 2: Verificar en Supabase**
1. Ve a **"Table Editor"** en Supabase
2. Busca la tabla `profiles`
3. Verifica que se haya creado un nuevo registro para el usuario

### **Test 3: Verificar Logs**
1. Revisa la consola del navegador (F12 → Console)
2. Deberías ver mensajes como:
   - `Usuario creado en auth.users, userId: ...`
   - `=== REGISTRO EXITOSO ===`

## ⚠️ **Posibles Problemas y Soluciones**

### **Problema 1: Permisos Insuficientes**
**Síntoma:** Error al ejecutar script SQL
**Solución:** Asegúrate de tener permisos de administrador en Supabase

### **Problema 2: Columnas Ya Existen**
**Síntoma:** Mensajes como `📊 Columna EMAIL ya existe`
**Solución:** Es normal, el script es idempotente

### **Problema 3: Trigger No Se Crea**
**Síntoma:** Error al crear trigger
**Solución:** Verifica que no haya otro trigger con el mismo nombre

### **Problema 4: Error Persiste**
**Síntoma:** Sigue apareciendo `Database error saving new user`
**Solución:**
1. Revisa los logs de error en Supabase (Database → Logs)
2. Verifica que las columnas se hayan creado correctamente
3. Ejecuta el script nuevamente

## 📊 **Verificación Manual en Supabase**

### **1. Verificar Estructura de Tabla:**
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;
```

### **2. Verificar Función:**
```sql
SELECT proname, prosrc
FROM pg_proc 
WHERE proname = 'handle_new_user';
```

### **3. Verificar Trigger:**
```sql
SELECT tgname, tgrelid::regclass, tgfoid::regproc
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';
```

## 🔄 **Rollback (Solo si es Necesario)**

Si necesitas revertir los cambios, ejecuta:
```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user;
-- NOTA: Las columnas agregadas se mantienen para compatibilidad
```

## 📞 **Soporte**

Si encuentras problemas:
1. **Captura pantalla** de los errores en Supabase
2. **Revisa los logs** en Database → Logs
3. **Verifica permisos** de usuario en Supabase
4. **Contacta al equipo técnico** si persisten los problemas

## 🎉 **Resultado Esperado**

Después de ejecutar el script correctamente:
- ✅ **Usuarios pueden registrarse** sin errores
- ✅ **Perfiles se crean automáticamente** en tabla `profiles`
- ✅ **Metadata** (`full_name`, `phone`) se guarda correctamente
- ✅ **Trigger funciona** automáticamente
- ✅ **Error "Database error saving new user" DESAPARECE**

## 📝 **Notas Importantes**

1. **El script es seguro:** Usa `IF NOT EXISTS` para evitar errores
2. **Mantiene datos existentes:** Copia `display_name` → `full_name` si es necesario
3. **Actualiza trigger:** Usa la estructura CORRECTA de la tabla
4. **Incluye verificación:** Muestra estado actual después de ejecutar
5. **Tiene rollback:** Opciones para revertir si es necesario

## 🚀 **Próximos Pasos Después de Corregir**

1. **Configurar emails de Clerk** (ver `CLERK_EMAIL_CONFIG.md`)
2. **Probar flujo completo:** Registro → Email → Confirmación → IALab
3. **Monitorear logs** por 24 horas
4. **Documentar** la solución para referencia futura

---

**Estado Actual:** ✅ Script listo para ejecutar  
**Urgencia:** 🔴 ALTA (sistema de registro roto)  
**Tiempo Estimado:** 5-10 minutos para ejecutar script