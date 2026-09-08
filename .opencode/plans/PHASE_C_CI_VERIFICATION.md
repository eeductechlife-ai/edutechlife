# PHASE_C_CI_VERIFICATION — FRESH DB + MIGRATIONS

**Fecha:** 2026-08-29
**Rama:** `recovery/foundation-phase-a`
**Resultado:** **CI_GREEN** para el job `Migrations (fresh DB)`.

---

## 1. Estado del job `Migrations (fresh DB)`

**Run:** https://github.com/eeductechlife-ai/edutechlife/actions/runs/33264200790
**Conclusión del job:** `success`
**Pasos (todos `success`):**

| Paso | Resultado |
|---|---|
| Set up job | success |
| checkout | success |
| supabase/setup-cli | success |
| **Start Supabase local** | success (imágenes Docker + Postgres 17.6 con auth schema) |
| **Apply migrations from scratch** | success — **000 → 059 aplicadas en orden sobre base limpia** |
| Install postgresql-client | success |
| **Validate schema** | success — `supabase/validate_schema.sql` (32 tablas + 16 columnas críticas) |
| **Backend contract tests** | success — `npm test` (331/331) |
| Complete job | success |

## 2. Commits en la rama (branch SHA)

| SHA | Contenido |
|---|---|
| `9a4f3a8` | FASE A-C: env unificado, schema align, 14 migraciones reescritas, baseline 000, reconcile 059, CI job |
| `c7c0693` | fix baseline 000: DROP POLICY sin cláusula FOR |
| `bb07084` | fix 005/006: `auth.uid()::text` (text=uuid) |
| `0a80d4b` | fix 024: GENERATED column no inmutable → trigger |
| `ba58b39` | fix 032/041/045: `CREATE POLICY IF NOT EXISTS` → guard |
| `fe8ce50` | fix 032: índice parcial con NOW() (volátil) → no parcial |

**Commit HEAD de la verificación: `fe8ce50`.**

## 3. Correcciones que CI detectó (los 6 ciclos)

La ejecución real de fresh DB encontró 6 errores SQL que la validación estática/adversarial no detectó (solo ejecutarlos los revela):

1. **000** `DROP POLICY ... ON x FOR UPDATE` — sintaxis inválida (el FOR pertenece al CREATE).
2. **005/006** `user_id = auth.uid()` — `text = uuid` sin operador (falta `::text`).
3. **024** `GENERATED ALWAYS AS (EXTRACT(YEAR FROM timestamptz))` — función stable ≠ immutable (42P17) → columna plana + trigger.
4. **032** `CREATE POLICY IF NOT EXISTS` — sintaxis inexistente en PostgreSQL → guard `pg_policies`.
5. **041/045** ídem `CREATE POLICY IF NOT EXISTS`.
6. **032** índice parcial `WHERE last_activity > NOW()` — NOW() volátil en predicado (42P17) → índice no parcial.

Todas corregidas y verificadas en CI.

## 4. Conclusión del run completo

El **overall** del run es `failure` por el job preexistente **Smoke Test** (`npm ci` del frontend: `package-lock.json` desincronizado — `Missing: esbuild@0.28.2`). Este fallo es **independiente** de las migraciones (está documentado desde FASE A como issue de FASE G) y NO bloquea la validación de fresh DB.

## 5. Salvaguardas cumplidas

- ✅ Sin merge a `main`.
- ✅ Sin ejecutar `059` en producción.
- ✅ Sin modificar producción.
- ✅ Sin reset de ninguna base.
- ✅ IALab intacto.
- ✅ Push únicamente de la rama `recovery/foundation-phase-a`.

## 6. Estado

- **Fresh DB reproducible: VERIFIED** (000→059 en CI sobre base limpia).
- **Schema validado: VERIFIED** (`validate_schema.sql`).
- **Migrations correctas: VERIFIED** en el pipeline de CI.
- **FASE C NO es VERIFIED todavía** (según protocolo): faltan staging + live tests + RLS/IDOR (FASE D/E).
- Próximos pasos bloqueados hasta aprobación: staging, FASE D (RLS/IDOR), release.
