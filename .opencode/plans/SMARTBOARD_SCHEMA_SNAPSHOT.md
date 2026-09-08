# SMARTBOARD SCHEMA SNAPSHOT — POST-MIGRATIONS (000–059)

**Fecha:** 2026-08-29
**Definición:** schema final que produce una fresh DB tras aplicar 000→059 (validado por `supabase/validate_schema.sql`). Referencia cruzada: `SMARTBOARD_SCHEMA_CONTRACT.md`.

---

## 1. Tablas y su fuente

| Tabla | Migración | Estado esperado |
|---|---|---|
| users | 000 | base |
| profiles | 000 | base |
| forum_posts, forum_votes, notifications | 000 | base |
| forum_comments, forum_profiles, forum_notifications, forum_bookmarks, forum_reports | 003 | ok |
| module_content, module_lessons, module_topics, module_resources, quiz_questions | 004 | ok |
| push_subscriptions | 006 | ok |
| league_rankings | 007 | ok |
| parent_consents | 008 | ok |
| crisis_alerts | 009 (+059) | ok |
| study_groups, study_group_members, study_group_sessions | 010 | ok (⚠️ policies current_user, FASE D) |
| students, sessions, points_history, vak_results, student_tasks, conversations, academic_context, parent_dashboards, achievements, learning_streaks, smartboard_settings | 011 (+059) | ok |
| valerio_academic_memory | 020 | ok |
| parent_student_links | 023 | ok |
| certificates | 024 | ok |
| parent_alerts | 033 | ok |
| parent_alerts_archive, archive_audit_log | 034 | ok |
| achievement_categories, student_achievements, achievement_stats | 035/059 | ok (semántica muerta, FASE D) |
| leaderboards, leaderboard_snapshots, competition_events, competition_participants, student_competition_stats | 036 | ok |
| student_risk_scores, predictive_alerts, learning_gap_predictions, alert_actions, prediction_metrics | 037 | ok |
| parent_dani_conversations, conversation_messages, conversation_summaries, dani_response_templates, conversation_attachments | 038 | ok |
| grade_analyses | 039 | ok |
| student_timetable, timetable_slots, student_exams | 042 | ok |
| smartboard_kids_data | 046 | ok |
| improvement_plans | 050 | ok |
| dani_memory, early_warnings, learning_plans, feature_flags | 052 | ok |
| competencies, student_competency_mastery | 053 | ok |
| missions, student_missions, badges, student_badges | 054 | ok |
| learning_content | 055 | ok |
| recommendations | 056 | ok |
| feedback_log | 057 | ok |
| rewards, student_rewards | 058 | ok |

**Total:** 58+ tablas.

## 2. Columnas críticas (contrato ↔ snapshot)

| Contrato | Snapshot (migración) | Check validate_schema |
|---|---|---|
| mastery: `mastery_level`, `practice_count`, `updated_at` | 053 | ✅ |
| memory: `communication_style`, `strengths`, `interests`, `pending_topics`, `last_mood` | 052 | ✅ (2 checkeadas) |
| plans: `plan_json` | 052 | ✅ |
| sessions: `duration_minutes` | 011 | ✅ |
| schedule: `timetable_slots.day_of_week` (SMALLINT 1-7) | 042 | ✅ |
| profile: `school`, `grade`, `grade_level`, `country_code`, `grades_json`, `progress_json`, `vak_style` | 000/021/040/043/044/051 | ✅ (4 checkeadas) |
| streaks: `best_streak` | 011 | ✅ |
| warnings: `evidence_json` | 052 | ✅ |
| grades: `grade_analyses.student_user_id` | 039 | ✅ |
| kids data: `smartboard_kids_data.user_id` | 046 | ✅ |

## 3. Tipos, índices, FKs, RLS, funciones, triggers (por tabla clave)

- **students**: uuid PK; FK auth.users(auth_id); CHECK age 5-25 (047); RLS own + heartbeat (032) + **PERMISSIVE 041/049 ⚠️ FASE D**; índices 9.
- **sessions**: uuid PK; FK students; CHECK subject/type; RLS own (011/059); triggers 3 (last_activity, academic_context, streak) (059); índices 5.
- **points_history**: uuid PK; FK students + sessions(related_session_id); CHECK points≠0/category; RLS own (025/059); índices 4.
- **student_competency_mastery**: uuid PK; FK students + competencies(id text); UNIQUE(student,competency); CHECK mastery 0-1; RLS own (053); índices 3.
- **dani_memory**: uuid PK; FK students; UNIQUE(student); CHECK communication_style; RLS own (052); 1 índice.
- **learning_plans**: uuid PK; FK students; CHECK type; `plan_json` jsonb; RLS own + service (052); índice parcial activo.
- **timetable_slots**: uuid PK; FK student_timetable; CHECK day_of_week 1-7 + end>start; RLS **permisiva TO authenticated ⚠️ FASE D**; 2 índices.
- **smartboard_kids_data**: TEXT PK user_id; RLS own+parent+service(TO); 2 índices.
- **059 additiva**: academic_context (uuid PK, UNIQUE(student,subject)) + `students.last_activity` asegurada + 4 triggers de sesión.

## 4. RLS — veredicto por rol

| Rol | Acceso |
|---|---|
| student | own-row en ~20 tablas ✅ |
| parent | parent-link en smartboard_kids_data/parent_alerts/predictive_alerts; resto vía backend (service_role) ✅ |
| admin | solo crisis_alerts (vía `raw_user_meta_data` ⚠️ editable, FASE D) |
| content_creator | sin policies |
| anon | público: competencies, missions, badges, learning_content, categories, templates ✅; **NO** debe poder leer/insertar datos de menores → ⚠️ 041/049 lo permiten hoy (FASE D) |

## 5. Diferencias con el contrato documentado

| Contrato dice | Snapshot | Acción |
|---|---|---|
| analytics tables (user_sessions, lesson_attempts, parent_dashboard_views, feature_usage) | **no existen** en migraciones | FASE D: crear con schema real o eliminar stub `metricsService` |
| RLS segura | 041/049/042 permisivas | FASE D obligatoria |
| parent access directo en learning graph | solo vía backend | aceptado (diseño) |
