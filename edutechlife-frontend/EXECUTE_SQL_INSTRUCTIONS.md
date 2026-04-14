# Instrucciones para ejecutar el trigger SQL en Supabase

## URL del proyecto Supabase
**URL:** https://srirrwpgswlnuqfgtule.supabase.co

## Pasos para ejecutar el SQL

1. **Acceder al dashboard de Supabase:**
   - Ve a https://app.supabase.com
   - Inicia sesión con las credenciales del proyecto
   - Selecciona el proyecto `srirrwpgswlnuqfgtule`

2. **Ir a la consola SQL:**
   - En el menú lateral izquierdo, haz clic en **"SQL Editor"**
   - Haz clic en **"New query"**

3. **Copiar y pegar el script completo:**
   - Abre el archivo `supabase_auto_profile_trigger.sql`
   - Copia TODO el contenido (208 líneas)
   - Pégalo en el editor SQL de Supabase

4. **Ejecutar el script:**
   - Haz clic en **"Run"** (botón azul)
   - Espera a que se complete la ejecución

5. **Verificar resultados:**
   - El script mostrará mensajes de estado:
     - `✅ Función handle_new_user creada` (o `📊 ya existe`)
     - `✅ Trigger on_auth_user_created creado` (o `📊 ya existe`)
     - `✅ Tabla form_submissions creada con RLS` (o `📊 ya existe`)
     - `✅ Trigger update_form_submissions_updated_at creado` (o `📊 ya existe`)

6. **Probar el trigger:**
   - Registra un nuevo usuario en la aplicación
   - Verifica que se cree automáticamente un registro en la tabla `profiles`
   - Los datos del formulario se guardarán en `form_submissions`

## Verificación manual en Supabase

Después de ejecutar el script, puedes verificar:

1. **Tablas creadas:**
   - Ve a **"Table Editor"** → Busca `profiles` y `form_submissions`

2. **Funciones:**
   - Ve a **"Database"** → **"Functions"** → Busca `handle_new_user`

3. **Triggers:**
   - Ve a **"Database"** → **"Triggers"** → Busca `on_auth_user_created`

## Script de rollback (por si acaso)

Si necesitas revertir los cambios, ejecuta:

```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user;
DROP TABLE IF EXISTS public.form_submissions CASCADE;
```

## Notas importantes

- El script es **idempotente**: se puede ejecutar múltiples veces sin problemas
- Usa `DO $$` blocks para verificar existencia antes de crear
- Incluye políticas RLS (Row Level Security) para seguridad
- Crea índices para mejor performance
- Incluye trigger para actualizar `updated_at` automáticamente

## Próximos pasos después de ejecutar

1. **Configurar templates de email en Clerk** (ver `CLERK_EMAIL_CONFIG.md`)
2. **Probar flujo completo de registro**
3. **Verificar que los emails de confirmación lleguen**
4. **Confirmar redirección a IALabDashboard**

## Contacto para soporte

Si encuentras errores al ejecutar el SQL:
1. Revisa los mensajes de error en la consola SQL
2. Verifica que tengas permisos de administrador en Supabase
3. Contacta al equipo técnico si persisten los problemas