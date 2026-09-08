# MIGRATION RISK REPORT — PRE-PUSH REVIEW

**Fecha:** 2026-08-29
**Alcance:** 15 migraciones modificadas + 000/059/validate_schema/config.toml nuevos.
**Método:** diff vs `7653a9d`, destructive-change scan, FK analysis, RLS matrix, doble-ejecución estática, revisión adversarial fresh-context.

---

## Tabla de riesgos

| Migración | Cambio | Riesgo | Motivo | Recomendación |
|---|---|---|---|---|
| 000 (NEW) | baseline users/profiles/forum/notifications | **MEDIUM** | Crear `users`/`profiles` es la primera definición "oficial" de tablas que existían sueltas; si prod ya las tiene con schema distinto, solo se aplica en fresh DB (000 no se corre en prod) | Aplicar 000 SOLO en fresh DB/staging; no en prod |
| 023 | guard en smartboard_kids_data | **LOW** | Cambio aditivo y condicional; si la tabla no existe, skipea | Verificar en fresh DB (CI) |
| 033–039, 042, 046, 050, 051 | reescritura de guards/BEGIN-COMMIT/FKs | **LOW** | Antes eran no-op/fallos; ahora crean tablas que antes no existían (cambia schema efectivo de prod solo vía 059) | Validar con `migrations-check` |
| 034 | pg_cron scheduler | **LOW** | Corregido con check de `cron.job`; si pg_cron no está, skipea | — |
| 035 | achievements catalog | **MEDIUM** | `student_achievements`/`achievement_stats` referencian `achievements(id)` de 011 que es un *ledger por estudiante* (no catálogo) → stats sin significado semántico. Compila y aplica, pero la feature está muerta (routers sin montar) | Mantener tablas por completitud; decidir en FASE D (montar o eliminar) |
| 036 | leaderboards + compute_leaderboards | **LOW** | Función corregida; `achievement_count = COUNT(points_history)` es aproximado. Feature sin montar | — |
| 037 | predictions + compute_risk_scores | **LOW** | `performance_score=50` placeholder; `emotional_risk_score`/`streak_broken_count` nunca se escriben. Feature sin montar | — |
| 038 | parent chat | **LOW** | `message_count`/`last_message_at`/`updated_at` nunca se actualizan (dead columns); resumen duplica mensajes por keyword. Feature sin montar | — |
| 042 | timetable RLS | **MEDIUM** | Políticas `FOR ALL TO authenticated USING(true)` → cualquier usuario autenticado lee/modifica horarios de cualquier menor | FASE D (RLS) |
| 046 | kids_data service policy | **LOW** | Corregido con `TO service_role` | — |
| 047 | age constraint | **MEDIUM** | En prod, si el CHECK viejo tiene otro nombre (no `students_age_check`), queda un CHECK 6-16 solapado y edades 17-25 siguen rechazadas. Fresh DB OK | En prod: verificar constraint names ANTES de aplicar |
| 059 (NEW) | reconciliación prod | **MEDIUM** | Aditivo y no destructivo; pero **no ejecutado** contra una base real (sin entorno). Triggers de sessions dependen de academic_context/learning_streaks (059 los crea/asegura); la primera INSERT de session valida el runtime | Backup + dry-run + correr en CI `migrate-db` primero; observar la primera sesión insertada |
| 059 | políticas endurecidas | **LOW** | Revisado: ninguna "Service role" sin `TO service_role`; ninguna anon-reachable | — |
| 020/024 (no tocadas) | valerio/certificates policies sin TO | **MEDIUM** | Anon puede leer/escribir `valerio_academic_memory` y ver/insertar `certificates`. No fueron endurecidas por 025. Alcance IALab/proyecto separado | Decidir con el equipo IALab (fuera de SmartBoard) |
| 041/049 (no tocadas) | RLS permisiva students/vak_results | **CRITICAL** | `FOR ALL TO authenticated USING(true)` → cualquier autenticado lee/edita/borra perfiles de menores y resultados VAK | **FASE D obligatoria antes de producción real** |
| `config.toml` (NEW) | config local Supabase | **LOW** | Generado por `supabase init`; puede diferir de configs locales previas | Verificar `supabase doctor` |
| validate_schema.sql (NEW) | assert de schema | **LOW** | Lista fija de tablas/columnas; si una tabla legítima no está listada, no se valida (no falso positivo) | Extender al crecer schema |

## Destructive-change scan (resultado)

| Patrón | Resultado |
|---|---|
| `DROP TABLE` | **0** (ninguno, ni IF EXISTS) |
| `DROP COLUMN` | **0** |
| `TRUNCATE` | **0** |
| `DELETE FROM` | 1 — `003:179` dentro de `clean_old_notifications()` (mantenimiento >90 días, runtime, no en migración) → **SAFE** |
| `DROP FUNCTION` | 1 — `048` `sync_vak_to_student_profile()` con su trigger dropeado antes → **SAFE** |
| `ALTER COLUMN TYPE` / `ALTER TYPE` | **0** |
| `DROP POLICY` | múltiples — patrón idempotente (guard) → **SAFE** |
| `DROP TRIGGER IF EXISTS` | múltiples — patrón idempotente → **SAFE** |

## Data-loss analysis

- **Ninguna** instrucción puede borrar/truncar datos existentes.
- **FK invalidadas**: ninguna nueva; las removidas (036/037/038 text→uuid) nunca se materializaron (fallaban al crearse).
- **NULL inesperados**: 059 agrega `students.last_activity` con DEFAULT now() (backfill implícito). `grade_level`/`country_code` (051) con DEFAULT/CHECK → no generan NULL.
- **Cambio de significado**: `achievements` (035) ya no se duplica; `mastery_level`/`plan_json` ya alineados (FASE B). Sin cambio semántico.

## FK analysis (036/037/038)

| | ANTES | DESPUÉS | POR QUÉ | IMPACTO |
|---|---|---|---|---|
| leaderboards.student_user_id | `TEXT REFERENCES auth.users(id)` | sin FK | text≠uuid → FK inválida en Postgres (fallaría fresh DB) | Integridad por RLS/app; sin FK en DB |
| leaderboard_snapshots / competition_participants / student_competition_stats | `TEXT REFERENCES auth.users(id)` | sin FK | idem | idem |
| student_risk_scores / predictive_alerts / learning_gap_predictions | `TEXT REFERENCES auth.users(id)` | sin FK | idem | idem |
| parent_dani_conversations | 2× `TEXT REFERENCES auth.users(id)` | sin FK (conserva FK compuesto→parent_student_links, text→text) | idem | idem |

**Confirmación:** no quedan relaciones inválidas (grep `TEXT.*REFERENCES auth\.users` = 0). Las FKs conservadas son text→text (parent_student_links) o uuid→uuid.

## RLS matrix (SmartBoard, tras el conjunto completo 000→059)

| Tabla | SELECT | INSERT | UPDATE | DELETE | student | parent | admin/content |
|---|---|---|---|---|---|---|---|
| students | ✅ own | (service) | ⚠️ removido por 026 (solo heartbeat 032) | (service) | ✅ | vía backend (service) | — |
| sessions | ✅ own | ✅ own | ✅ own | (service) | ✅ | vía backend | — |
| points_history | ✅ own | ✅ own (025/059) | — | — | ✅ | vía backend | — |
| conversations | ✅ own | ✅ own | — | — | ✅ | vía backend | — |
| achievements | ✅ own | ✅ own (025/059) | — | — | ✅ | vía backend | — |
| dani_memory | ✅ own | ✅ own (FOR ALL) | ✅ own | ✅ own | ✅ | vía backend | — |
| learning_plans | ✅ own | (service) | (service) | (service) | ✅ read | vía backend | — |
| early_warnings | ✅ own | — | — | — | ✅ read | vía backend | — |
| student_competency_mastery | ✅ own | ✅ own | ✅ own | ✅ own | ✅ | vía backend | — |
| smartboard_kids_data | ✅ own+parent | ✅ own | ✅ own | (service) | ✅ | ✅ parent-link | — |
| grade_analyses | ✅ own | ✅ own | — | ✅ own | ✅ | vía backend | — |
| timetable (042) | ⚠️ PERMISSIVE | ⚠️ PERMISSIVE | ⚠️ PERMISSIVE | ⚠️ PERMISSIVE | ⚠️ | ⚠️ | ⚠️ → **FASE D** |
| parent_alerts | ✅ parent | — | ✅ parent | ✅ parent | — | ✅ | — |
| crisis_alerts | ✅ admin | ✅ student | — | — | ✅ insert | — | ✅ admin view |
| parent_student_links | ✅ parent | (service) | — | ✅ parent | — | ✅ | — |
| notifications | ✅ own | ✅ authenticated | ✅ own | ✅ own | ✅ | ✅ | — |
| improvement_plans | ✅ own | ✅ own | ✅ own | ✅ own | ✅ | vía backend | — |
| students/vak_results (041/049) | ⚠️ **PERMISSIVE anon/authenticated** | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ → **CRITICAL, FASE D** |

**Conclusión RLS:** ownership por estudiante ✓ y padre (vía parent-link o backend service) ✓ para la mayoría. **NO se declara RLS segura**: quedan 2 familias de riesgo (041/049 y 042) que se resuelven en FASE D. admin = solo crisis_alerts (vía `raw_user_meta_data->>'role'` — campo editable → FASE D). content_creator = sin policies.

## Clasificación agregada

- **CRITICAL**: RLS 041/049 (preexistente, FASE D).
- **HIGH**: ninguno en el diff revisado.
- **MEDIUM**: 000 en fresh-only; 035/036/037/038 features semánticamente muertas; 042 RLS permisiva; 047 nombre de constraint en prod; 020/024 IALab.
- **LOW**: resto (idempotencia corregida, pgcrypto, notifications).
