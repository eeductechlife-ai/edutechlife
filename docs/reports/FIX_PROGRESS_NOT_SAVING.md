# 🔧 Cómo Arreglar: El Progreso no se Guarda en IALab

**Fecha identificado:** 2026-08-01  
**Estatus:** Investigación completada - Solución identificada

## Problema

El progreso del estudiante (módulos completados, contenido visto, puntuaciones) **no se guarda en Supabase**. Los datos quedan solo en localStorage del navegador y se pierden al cambiar de dispositivo.

**Síntoma:** El contenido completado no se pone "verde" permanentemente.

## Causa Raíz

La tabla `user_progress` en Supabase tiene **Row-Level Security (RLS) habilitada pero SIN policies configuradas**. Esto significa:

- ❌ Ningún usuario puede leer su propio progreso
- ❌ Ningún usuario puede escribir su propio progreso
- ❌ Las escrituras retornan error `403 (Forbidden)` o se silencian

## Solución

Ejecuta este SQL en **Supabase Console** → **SQL Editor**:

```sql
-- 1. Crear policies para user_progress
-- Permite que cada usuario SOLO vea/modifique su propio progreso

CREATE POLICY "user_progress_select_own" ON public.user_progress
  FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "user_progress_insert_own" ON public.user_progress
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "user_progress_update_own" ON public.user_progress
  FOR UPDATE
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "user_progress_delete_own" ON public.user_progress
  FOR DELETE
  USING (auth.uid()::text = user_id);
```

### Pasos:

1. Abre [Supabase](https://app.supabase.com)
2. Selecciona proyecto **edutechlife**
3. Menú izquierdo → **SQL Editor**
4. Pega el SQL anterior
5. Click **RUN**
6. Verifica que las 4 policies se crearon sin errores

## Verificación

Después de aplicar el SQL:

1. Entra a edutechlife.co/ialab (autenticado)
2. Abre **DevTools** → **Console**
3. Busca mensajes `[RLS FIX]`:
   - ✓ `✓ RLS test passed, can write records` = **Funciona**
   - ✗ `RLS is blocking writes` = Aún hay problema

## Detalles Técnicos

### ¿Por qué sucede?

- La tabla se creó (probablemente manualmente) con RLS habilitada
- Pero no se asignaron policies que permitan acceso
- El código frontend intenta escribir → Supabase rechaza (403)
- El error se silencia porque hay fallback a localStorage

### ¿Qué hace el fix?

Las policies crean reglas así:

| Operación | Quién puede | Condición |
|-----------|------------|-----------|
| SELECT | Usuario autenticado | Solo su propio `user_id` |
| INSERT | Usuario autenticado | Solo su propio `user_id` |
| UPDATE | Usuario autenticado | Solo su propio `user_id` |
| DELETE | Usuario autenticado | Solo su propio `user_id` |

Esto garantiza **multi-tenancy segura**: cada estudiante ve solo SU progreso.

## Si el SQL Falla

### Error: "Policy already exists"

```
ERROR: policy "user_progress_select_own" for table "user_progress" already exists
```

→ Las policies ya existen, el problema está en otra parte. Contactar soporte.

### Error: "Column 'user_id' does not exist"

```
ERROR: column "user_id" does not exist
```

→ La tabla existe pero tiene estructura diferente. Revisar el schema en Supabase.

### Error: "Table 'user_progress' does not exist"

```
ERROR: relation "user_progress" does not exist
```

→ La tabla **no existe en Supabase**. Necesario crear toda la infraestructura desde migraciones.

## Diagnóstico Automático

El código frontend ahora ejecuta un diagnóstico automático:

- Se ejecuta al cargar IALab
- Intenta escribir un registro de prueba
- Reporta si RLS está bloqueando
- **No causa daño** (se elimina el registro de prueba)

Busca en la consola: `[RLS FIX]`

## Próximos Pasos (Si Sigue Fallando)

Si después del fix aún no guarda:

1. ✅ Verificar que las 4 policies se crearon (Supabase → Table Editor → user_progress → Policies)
2. ✅ Limpiar cache/localStorage (`localStorage.clear()` en console)
3. ✅ Reload de la página
4. ✅ Intentar guardar progreso de nuevo
5. ❌ Si aún falla: revisar logs de Supabase (Database → Logs)

## Files

- **SQL fix:** `edutechlife-frontend/sql/fix_user_progress_rls.sql`
- **Diagnóstico:** `edutechlife-frontend/src/lib/rls-fixer.js`
- **Integración:** `edutechlife-frontend/src/hooks/IALab/useIALabProgress/useIALabProgress.js`

---

**Versión:** v1.0  
**Aplicable a:** edutechlife.co  
**Depende de:** Supabase RLS  
