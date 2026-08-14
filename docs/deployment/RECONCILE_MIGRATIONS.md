# Runbook — Reconciliar historial de migraciones antes de desplegar

**Objetivo:** dejar el historial de `supabase_migrations.schema_migrations` alineado
con la realidad (la BD de producción se construyó a mano), para que
`supabase db push` deje de fallar y aplique limpio de aquí en adelante.

**Contexto del problema:**
- El historial remoto nunca se registró bien → `db push` intenta aplicar 003–030
  completas y falla en migraciones viejas ya aplicadas de facto.
- Se resolvió una colisión de versión: `026_profile_user_columns.sql` →
  `030_profile_user_columns.sql` (dos archivos tenían prefijo 026).
- Las migraciones 027, 028 y 029 **ya se aplicaron a mano** en el SQL Editor
  (columnas verificadas existentes vía PostgREST). La 030 (phone/avatar) también
  está aplicada de facto.

> ⚠️ Ejecuta esto tú: el CLI de Supabase requiere tu login (no puede correr en
> la sesión de Claude). Todos los comandos son de historial/idempotentes; no
> reescriben datos.

---

## 0. Requisitos

```bash
supabase --version           # instala con: brew install supabase/tap/supabase
export SUPABASE_ACCESS_TOKEN=...   # token de tu cuenta
supabase link --project-ref <PROJECT_REF>   # el ref del proyecto de producción
```

## 1. Ver el estado real (Local vs Remote)

```bash
supabase migration list
```

- Columna **Local** = archivos en `supabase/migrations/`.
- Columna **Remote** = lo que la BD cree tener aplicado.
- Lo esperable: muchas versiones aparecen en Local pero **no** en Remote → eso
  es lo que hay que reconciliar.

## 2. Marcar como aplicadas las migraciones que YA existen en producción

Todas están aplicadas de facto (BD hecha a mano + 027–029 por SQL Editor).
`migration repair` solo escribe en la tabla de historial, **no** corre el SQL:

```bash
supabase migration repair --status applied \
  003 004 005 006 007 008 009 010 011 \
  020 021 022 023 024 025 026 \
  027 028 029 030
```

> Si `migration list` mostró que ALGUNA versión ya estaba en Remote, quítala de
> la lista (no pasa nada si la repites, pero mantenlo limpio).

## 3. Confirmar que el push queda en no-op

```bash
supabase migration list      # Local y Remote deben coincidir ahora
supabase db push             # debe decir "Remote database is up to date" (nada que aplicar)
```

Si `db push` intentara aplicar algo, DETENTE y revisa qué versión y por qué
(alguna realmente no estaba aplicada). No fuerces.

## 4. A partir de aquí

- El merge a `main` corre `supabase db push` en CI. Con el historial ya
  reconciliado, solo aplicará migraciones **nuevas** (031+), como debe ser.
- Verifica en Supabase → Database → Migrations que la lista coincide.

---

## Anexo — Verificación de columnas (independiente del CLI)

Si quieres confirmar el esquema sin el CLI, en el SQL Editor:

```sql
SELECT table_name, column_name
FROM information_schema.columns
WHERE (table_name = 'users' AND column_name IN
        ('plan','subscription_id','subscription_status','account_type'))
   OR (table_name = 'students' AND column_name = 'subscription_tier')
ORDER BY table_name, column_name;
-- Deben aparecer las 5 filas.
```
