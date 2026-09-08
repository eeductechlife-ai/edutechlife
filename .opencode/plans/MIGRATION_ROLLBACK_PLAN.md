# MIGRATION ROLLBACK PLAN — PRE-PUSH REVIEW

**Fecha:** 2026-08-29
**Aplica a:** aplicar `supabase/migrations/` (fresh DB / staging) y `059_reconcile_smartboard.sql` (producción).
**Principio:** las migraciones son **aditivas y no destructivas** (0 DROP TABLE/COLUMN, 0 TRUNCATE). El rollback de datos nunca es necesario; el rollback de *aplicación* es deshacer el archivo.

---

## 1. BACKUP (antes de aplicar en producción)

| Método | Comando / ruta |
|---|---|
| Supabase Dashboard | Settings → Database → **Backups** (PITR recomendado si está activo) |
| Dump completo | `supabase db dump --linked --data-only -f backup_pre_059_$(date +%Y%m%d).sql` (o con `supabase link` + token) |
| Dump del schema | `supabase db dump --linked --schema public -f schema_pre_059_$(date +%Y%m%d).sql` |
| Verificación | El dump debe abrir y contener las tablas esperadas (grep `CREATE TABLE`) |

**Regla:** NO aplicar 059 sin un backup verificable.

## 2. DRY RUN

1. **Local/staging (fresh DB):** `supabase start` → `supabase db reset` → `psql ... -f supabase/validate_schema.sql`. Si el job CI `migrations-check` está en verde, el conjunto 000–059 es válido.
2. **Producción:** ejecutar el contenido de `059` en una **transacción explícita** que termina en `ROLLBACK` contra un **clon** de prod (Supabase → Create clone) o contra la propia prod con `BEGIN; ... ROLLBACK;` (no comete nada):
   ```sql
   BEGIN;
   \i 059_reconcile_smartboard.sql
   ROLLBACK;
   ```
   Si no hay error, el dry-run pasó.
3. **Verificación pre-aplicación:** sondeo read-only de columnas (el script usado en FASE B) → confirmar el estado "antes".

## 3. MIGRATION (aplicación)

- **Staging / fresh DB:** `supabase db reset` (aplica 000→059 en orden) o `supabase db push` contra el proyecto staging.
- **Producción (SOLO 059):**
  ```bash
  # vía CLI (requiere SUPABASE_ACCESS_TOKEN + supabase link)
  supabase link --project-ref srirrwpgswlnuqfgtule
  supabase db push --include-all
  ```
  O vía **SQL Editor** (Dashboard) pegando el contenido de `059` dentro de `BEGIN; ... COMMIT;`.
- **NO** correr 000–058 sobre producción (CREATE POLICY sin guard en 003–032/040–058 fallaría o, peor, 041/049 re-abrirían RLS — FASE D los corrige).

## 4. VERIFICATION

| Check | Cómo |
|---|---|
| Tablas creadas | sondeo read-only (service key): `sessions`, `points_history`, `crisis_alerts`, `conversations`, `achievements` → 200 |
| Schema correcto | `psql ... -f supabase/validate_schema.sql` (si hay acceso DB) |
| Aplicación idempotente | **re-ejecutar 059** → debe terminar sin error y sin duplicados (segunda corrida) |
| Backend sano | `curl https://edutechlife-backend.onrender.com/api/health` → 200 |
| Funcionalidad | insertar 1 fila en `sessions` (test controlado en staging) para ejercitar los triggers |
| No regresión | `npm test` backend (331/331) |

## 5. ROLLBACK

| Escenario | Acción |
|---|---|
| 059 falla a mitad (transacción) | **Nada que hacer**: la transacción revierte todo automáticamente |
| 059 aplicó pero algo no funciona | **Deshacer**: `DROP TABLE IF EXISTS` de las tablas que 059 creó (solo las que no existían antes: sessions, points_history, crisis_alerts, conversations, achievements, academic_context, achievement_categories, student_achievements, achievement_stats) + `DROP FUNCTION` de las 4 funciones con su trigger. NOTA: verificar antes que no tengan datos que se quieran conservar (si ya hay datos, mejor reparar que dropear) |
| Aplicación parcial fuera de transacción | Re-aplicar el resto de 059 (idempotente) y luego verificar |
| Datos de usuarios dañados | Restaurar del **backup** (PITR o dump) |
| Migraciones 000–058 equivocadas en staging | `supabase db reset` (fresh) — en staging no hay datos que perder |

**Checklist de rollback (antes de tocar prod):**
- [ ] Backup tomado y verificado.
- [ ] Dry-run con ROLLBACK OK.
- [ ] Se conoce la lista exacta de tablas que 059 crea (para DROP selectivo si hiciera falta).
- [ ] `migrations-check` en CI en verde (prueba que el conjunto 000–059 es válido).
- [ ] Ventana de mantenimiento comunicada (059 es rápido: solo DDL + funciones).

## 6. SALVAGUARDAS

- **Nunca** `supabase db reset` en producción.
- **Nunca** correr 000–058 sobre producción.
- **Siempre** ejecutar 059 dentro de una transacción.
- El job CI `migrate-db` (deploy.yml) debe apuntar a 059 (no a 000–058) para producción.
