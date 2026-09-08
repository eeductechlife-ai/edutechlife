# MIGRATION DIFF SUMMARY — PRE-PUSH REVIEW

**Fecha:** 2026-08-29
**Base:** `7653a9d` (feature/smartboard-3.0)
**Rama:** `recovery/foundation-phase-a`
**Alcance:** `supabase/migrations/` + `supabase/config.toml` + `supabase/validate_schema.sql`
**Dimensión:** 15 modificados (-946/+520) + 4 nuevos.

---

## 1. Resumen del diff

| Archivo | Δ | Tablas | Columnas | Índices | FK | RLS | Funciones | Triggers |
|---|---|---|---|---|---|---|---|---|
| `000_baseline_core.sql` (NEW) | +130 | users, profiles, forum_posts, forum_votes, notifications | varias | 4 | users.auth→none; forum_posts→self | own + service(TO) | update_updated_at_column | notifications update_at |
| `023_parent_dashboard_rls.sql` | ±41 | — | — | — | — | **guard table-exists** para smartboard_kids_data | — | — |
| `033_create_parent_alerts.sql` | -81 | parent_alerts | 13 | 6 | composite→parent_student_links | parent own + service(TO) | — | — |
| `034_parent_alerts_retention.sql` | -125 | parent_alerts_archive, archive_audit_log | ~20 | 8 | composite→parent_student_links | parent + service(TO) | archive_old_alerts, restore_archived_alert, log_archive_operation, trigger_log_alert_archived | archive trigger (guard) |
| `035_achievements_system.sql` | -144 | achievement_categories, student_achievements, achievement_stats (**sin duplicar `achievements`**) | ~20 | 3 | student_achievements→achievements(id) | own + public read | — | — |
| `036_multiplayer_system.sql` | -187 | leaderboards, leaderboard_snapshots, competition_events, competition_participants, student_competition_stats | ~35 | 10 | **text→uuid removidos**; participants→events | public read / own-or-ended | compute_leaderboards (**corregido**: points_history.student_id→students.auth_id) | — |
| `037_predictions_system.sql` | -215 | student_risk_scores, predictive_alerts, learning_gap_predictions, alert_actions, prediction_metrics | ~35 | 13 | **text→uuid removidos**; composite→parent_student_links; alert_actions→predictive_alerts | own / parent-or-student | compute_risk_scores (**corregido**: sessions, learning_streaks, points_history) | — |
| `038_parent_chat_system.sql` | -226 | parent_dani_conversations, conversation_messages, conversation_summaries, dani_response_templates, conversation_attachments | ~30 | 12 | **text→uuid removidos**; composite→parent_student_links | parent-only | archive_old_conversations, generate_conversation_summary (**SRF corregido**) | — |
| `039_grade_analyses.sql` | -65 | grade_analyses | 7 | 2 | — | own read/insert/delete (guard) | — | — |
| `042_student_timetable.sql` | -116 | student_timetable, timetable_slots, student_exams | ~25 | 8 | student_timetable→students; slots→timetable; exams→students/slots | permissive TO authenticated (guard) | set_updated_at | 3× updated_at (guard) |
| `043_student_grades_json.sql` | -30 | (ALTER students) | +grades_json jsonb | 1 | — | — | — | — |
| `044_student_progress_json.sql` | -30 | (ALTER students) | +progress_json jsonb | 1 | — | — | — | — |
| `046_create_smartboard_kids_data.sql` | -66 | smartboard_kids_data | 5 | 2 | — | own + parent-link + service(**TO** agregado) | — | — |
| `047_fix_students_age_constraint.sql` | -55 | (ALTER students) | constraint age 5-25 | — | — | — | — | — |
| `050_create_improvement_plans.sql` | -55 | improvement_plans | 8 | 2 | student FK | own FOR ALL (guard) | update_improvement_plans_updated_at | update_at (guard) |
| `051_students_grade_country.sql` | -30 | (ALTER students) | +grade_level, +country_code | 1 | — | — | — | — |
| `059_reconcile_smartboard.sql` (NEW) | +430 | sessions, points_history, conversations, achievements, crisis_alerts, academic_context, achievement_categories, student_achievements, achievement_stats | ~60 | ~30 | uuid→uuid válidas | **políticas endurecidas** (student-own; ninguna anon-reachable) | update_student_last_activity, update_academic_context_on_session, update_learning_streak, award_achievement | 4× AFTER INSERT (guard) |
| `config.toml` (NEW) | +230 | — | — | — | — | — | — | — |
| `validate_schema.sql` (NEW) | +60 | — | — | — | — | — | — | — |

## 2. Cambios de comportamiento intencionales

1. **035**: `achievements` ya no se crea/seed (011 la define). Solo tablas nuevas del catálogo.
2. **036/037/038**: se eliminan FKs `text→uuid` inválidos; el ownership queda en capa de app + RLS.
3. **036/037**: funciones de cómputo reparadas para leer las tablas reales.
4. **059**: políticas de escritura usan la convención endurecida de 025 (student-own), **no** las "Service role ..." alcanzables por anon.
5. **046/000**: políticas de service_role con `TO service_role`.

## 3. Sin cambios

- Ningún `DROP TABLE`, `DROP COLUMN`, `TRUNCATE`.
- Ningún `ALTER COLUMN TYPE`, `ALTER TYPE`.
- Ningún cambio a tablas existentes de prod salvo ALTERs aditivos (`ADD COLUMN IF NOT EXISTS`).
- Sin cambio de datos.

## 4. Revisión adversarial aplicada

Los hallazgos CRITICAL/HIGH del revisor (doubt-driven) fueron corregidos en este diff:
- **C1** (023 referenciaba smartboard_kids_data antes de existir) → guard agregado.
- **C2** (059 reintroducía políticas anon-reachables) → reemplazadas por versiones endurecidas.
- **C3** (046 policy service sin TO) → `TO service_role`.
- **H1** (seed tournament 036 no idempotente) → `WHERE NOT EXISTS`.
- **H2** (034 pg_cron unschedule crasheaba en primer run) → check `cron.job`.
- **LOW** (pgcrypto en 059; notifications insert anon) → corregidos.
