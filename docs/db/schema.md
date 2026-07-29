# Base de Datos — Esquema

## Supabase (PostgreSQL)

### Tablas

| Tabla | Propósito | Columnas clave |
|-------|-----------|----------------|
| `prompt_templates` | Plantillas de prompts IA | id, user_id, name, template, category, created_at, updated_at |
| `profiles` | Perfiles de usuario (sync Clerk) | id (PK = Clerk user_id), name, avatar_url, role, created_at |
| `student_progress` | Progreso por módulo IALab | id, user_id, module_id, score, completed, completed_at |
| `sessions` | Sesiones de estudio SmartBoard | id, user_id, subject, duration, start, end, date |
| `missions` | Misiones gamificadas | id, user_id, title, description, completed, points |
| `parent_consents` | Consentimiento parental | id, student_id, parent_email, student_age, created_at |
| `module_topics` | Topics por módulo | id, module_id, title, sort_order |
| `module_resources` | Recursos por topic | id, topic_id, title, type, url, description, sort_order |
| `crisis_incidents` | Incidentes de crisis detectados | id, student_id, age, message, level, parent_notified, created_at |

### Relaciones
- `profiles.id` ← `auth.users.id` (Clerk)
- `student_progress.user_id` → `profiles.id`
- `sessions.user_id` → `profiles.id`
- `missions.user_id` → `profiles.id`
- `parent_consents.student_id` → `profiles.id`
- `module_resources.topic_id` → `module_topics.id`

### Notas
- Todas las tablas usan `created_at` con DEFAULT `now()`
- `student_progress` usa `user_id + module_id` como unique constraint
- RLS policies deben configurarse por usuario autenticado
