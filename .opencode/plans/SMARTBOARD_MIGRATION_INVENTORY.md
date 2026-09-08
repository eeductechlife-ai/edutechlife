# SMARTBOARD MIGRATION INVENTORY

**Fecha:** 2026-08-29
**Rama:** `recovery/foundation-phase-a`
**Método:** lectura de los 50 archivos + patrones (guard `'IF'`, BEGIN/COMMIT en DO, FKs text→uuid) + **sondeo read-only de producción** (service key, 200/400/404).

## Leyenda de estados
- **OK** = SQL válido para fresh DB (con sus dependencias cubiertas).
- **FIXED** = estaba roto; reescrito en esta fase (idempotente).
- **NEW** = creado en esta fase.
- **Prod** = existencia REAL en Supabase remoto (sondeo): ✅ existe / ❌ falta / n/d no sondeado.

---

## Inventario

| # | Migración | Tablas que crea | Depende de | Estado local | Prod | Errores/riesgos |
|---|---|---|---|---|---|---|
| 000 | **baseline_core** (NEW) | users, profiles, forum_posts, forum_votes, notifications | auth.users, pgcrypto | NEW | n/d | Cierra el hueco 001/002 que 003+ asumía |
| 003 | forum_premium | forum_comments, forum_profiles, forum_notifications, forum_bookmarks, forum_reports | forum_posts/votes (000) | OK | ✅ | Triggers usan NEW.user_name (000 lo provee); CREATE POLICY sin guard (no re-ejecutar en prod) |
| 004 | module_content | module_content, module_lessons, module_topics, module_resources, quiz_questions | — | OK | n/d | Cluster huérfano (sin FK) |
| 005 | fix_rls_policies | — | forum | OK | n/d | — |
| 006 | push_subscriptions | push_subscriptions | — | OK | n/d | Sin FK |
| 007 | league_rankings | league_rankings | — | OK | n/d | Sin FK |
| 008 | parent_consents | parent_consents | auth.users | OK | n/d | — |
| 009 | crisis_alerts | crisis_alerts | auth.users | OK | ❌ **falta** | → conciliado en 059 |
| 010 | study_groups | study_groups, study_group_members, study_group_sessions | — | OK | n/d | Políticas usan `current_user` (rol, nunca matchea) — FASE D |
| 011 | smartboard core | students, sessions, points_history, vak_results, student_tasks, conversations, academic_context, parent_dashboards, achievements, learning_streaks, smartboard_settings | auth.users, pgcrypto | OK | sessions/points/conversations/achievements ❌ (resto ✅) | → 059 crea las 4 faltantes |
| 020 | valerio_academic_memory | valerio_academic_memory | — | OK | n/d | Sin FK |
| 021 | students_grade | (ALTER students +grade) | students | OK | n/d | — |
| 022 | native_auth_clerk_nullable | (ALTER users) | users (000) | OK | n/d | Requiere users.clerk_id (000) |
| 023 | parent_dashboard_rls | parent_student_links | — | OK | ✅ | is_active ✓ (verificado) |
| 024 | certificates | certificates | — | OK | n/d | Duplica definición en loose sql |
| 025–031 | hardening/columns | (ALTERs) | students/users/profiles | OK | n/d | BEGIN/COMMIT top-level válidos |
| 032 | heartbeat | (ALTER students last_activity) | students | OK | n/d | — |
| 033 | parent_alerts (FIXED) | parent_alerts | parent_student_links | **FIXED** (era no-op) | ❌ falta | Políticas con guard |
| 034 | parent_alerts_retention (FIXED) | parent_alerts_archive, archive_audit_log | parent_alerts | **FIXED** | ❌ | pg_cron opcional (guard); trigger con guard |
| 035 | achievements_system (FIXED) | achievement_categories, student_achievements, achievement_stats | achievements(011) | **FIXED** | ❌ | **DUPLICADO eliminado**: achievements ya existía en 011 (schema distinto) |
| 036 | multiplayer (FIXED) | leaderboards, snapshots, events, participants, stats | points_history, students | **FIXED** | ❌ | **FK text→uuid eliminados**; compute_leaderboards lee points_history.student_id |
| 037 | predictions (FIXED) | risk_scores, alerts, gaps, actions, metrics | parent_student_links, sessions, learning_streaks | **FIXED** | ❌ | FK text→uuid eliminados; compute_risk_scores corregido |
| 038 | parent_chat (FIXED) | conversations, messages, summaries, templates, attachments | parent_student_links | **FIXED** | ❌ | FK text→uuid eliminados; SRF bug corregido |
| 039 | grade_analyses (FIXED) | grade_analyses | — | **FIXED** | ✅ | Políticas con guard |
| 040 | students_profile_columns | (ALTER students vak_style/school/grade; age nullable) | students | OK | n/d | — |
| 041 | vak_results_rls | (policy) | vak_results | OK | ⚠️ | **RLS permisiva FOR ALL** — FASE D |
| 042 | student_timetable (FIXED) | student_timetable, timetable_slots, student_exams | students | **FIXED** | ✅ timetable/slots; exams n/d | Políticas permisivas con guard |
| 043 | grades_json (FIXED) | (ALTER students) | students | **FIXED** (fallaba) | ✅ grades_json | — |
| 044 | progress_json (FIXED) | (ALTER students) | students | **FIXED** | ✅ progress_json | — |
| 045 | students_insert_rls | (policy) | students | OK | n/d | — |
| 046 | smartboard_kids_data (FIXED) | smartboard_kids_data | parent_student_links | **FIXED** | n/d (sí existe, hand-made) | Políticas DROP/CREATE (idempotente) |
| 047 | fix_age_constraint (FIXED) | (ALTER students) | students | **FIXED** (fallaba) | n/d | DROP/ADD students_age_check con guard |
| 048 | drop_vak_trigger | (drop trigger) | — | OK | n/d | — |
| 049 | fix_rls_authenticated | (policy) | students/vak_results | OK | ⚠️ | **RLS permisiva FOR ALL** — FASE D |
| 050 | improvement_plans (FIXED) | improvement_plans | students | **FIXED** | ❌ | Política/trigger con guard |
| 051 | grade_country (FIXED) | (ALTER students grade_level/country_code) | students | **FIXED** | ✅ grade_level/country_code | Guard schema-qualified corregido |
| 052 | smartboard3_base | dani_memory, early_warnings, learning_plans, feature_flags | students | OK | ✅ | Columnas tipadas verificadas en prod |
| 053 | learning_graph | competencies, student_competency_mastery (+seed MEN) | students | OK | ✅ | RLS con guard |
| 054 | gamification2 | missions, student_missions, badges, student_badges (+seed) | students | OK | ✅ | RLS con guard |
| 055 | content_model | learning_content (+seed) | competencies | OK | ✅ | — |
| 056 | recommendations | recommendations | students, content, competencies | OK | ✅ | RLS con guard |
| 057 | feedback_log | feedback_log | students | OK | n/d | — |
| 058 | rewards | rewards, student_rewards (+seed) | students | OK | n/d | — |
| 059 | **reconcile_smartboard** (NEW) | sessions, points_history, crisis_alerts, conversations, achievements, achievement_categories, student_achievements, achievement_stats | students, parent_student_links, auth.users | NEW | **para aplicar en prod** | Solo ADD; sin DROP; políticas con guard |

---

## Resumen

| Categoría | Cantidad |
|---|---|
| Migraciones **OK** (fresh DB) | 33 |
| Migraciones **FIXED** (eran no-op/hard-fail) | **14** |
| Migraciones **NEW** (000 baseline, 059 reconciliación) | 2 (+validate_schema.sql) |
| **Tablas críticas faltantes en PROD** | sessions, points_history, crisis_alerts, conversations, achievements (+catálogo 035) → creadas por **059** |

## Bugs encontrados y corregidos en esta fase

1. **Guard invertido** (`IF EXISTS table_name='IF'` → no-op silencioso) en 033–039, 042, 046, 050 → reescritas.
2. **`BEGIN;`/`COMMIT;` dentro de `DO $$`** (error runtime) en 043, 044, 047 → reescritas.
3. **Guard schema-qualified** `'public.students'` nunca matchea (051) → corregido.
4. **FK `text REFERENCES auth.users(uuid)`** (tipos incompatibles → fallaría en fresh DB) en 036/037/038 → eliminados (ownership por app/RLS).
5. **Funciones rotas**: 036 `compute_leaderboards` (`points_history.user_id`→`student_id`+join), 037 `compute_risk_scores` (`learning_sessions`→`sessions`, `student_streaks`→`learning_streaks`, `ph.user_id`→join, `days_inactive` siempre 0→real), 038 SRF-in-aggregate → corregidas.
6. **Duplicado `achievements`** (011 vs 035): 035 ya no crea la tabla (la deja a 011) ni su seed conflictivo.

## Riesgos restantes
- 003–032, 040–058 conservan **CREATE POLICY sin guard**: OK para fresh DB; **no re-ejecutables sobre prod** (solo 059 debe correrse en prod).
- 041/049 dejan RLS permisiva en `students`/`vak_results` → **FASE D**.
- 010 políticas `current_user` rotas → FASE D.
- `config.toml` nuevo (generado con `supabase init`): verificar que no rompe otros flujos locales.
