# Release — separación física de datos por producto (schemas `ialab` / `smartboard`)

Rama: `feat/separacion-schemas-productos` · Fecha: 2026-09-21
Estado: **preparado y validado en dry-run; NO aplicado a producción**

## 1. Objetivo

Guardar los datos de cada producto en su propio schema de Postgres, dentro del **mismo
proyecto Supabase**, dejando la identidad compartida en `public`:

- `public` → `auth.users`, `public.users` (directorio con `account_type`), `profiles`
- `ialab` → curso, progreso, lecciones y foro
- `smartboard` → niños/padres (segunda fase)

Por qué no dos proyectos: duplicaría la identidad, rompería el vínculo padre↔hijo y duplicaría
operación. Postgres no se degrada por tener ambos productos en `public`; se degrada por falta de
índices (ya verificados: `user_progress` tiene 7, y `forum_*`, `students`, `parent_student_links`,
`lesson_attempts` y las tablas nuevas están indexadas).

## 2. Evidencia del dry-run (Postgres local, migración 093 real)

| Prueba | Resultado |
|---|---|
| `calculate_module_score('u1',1)` antes de mover | **64** |
| Mover tablas a `ialab` + `ALTER FUNCTION … SET search_path = ialab, public` | tablas en `ialab`, función con `search_path=ialab, public` |
| `calculate_module_score('u1',1)` **después** de mover | **64** (la función resuelve las tablas movidas) |
| Re-ejecutar la migración | OK, sin error (idempotente) |
| Consulta directa `public.user_progress` | ya no existe (el cliente debe usar el schema) |
| Rollback `ALTER TABLE ialab.user_progress SET SCHEMA public` | vuelve y el score sigue en 64 |

Hallazgos que el dry-run corrigió antes de tocar producción:
1. La 093 dependía de que existiera el schema (creado por la 092) → ahora crea el schema si falta.
2. Los `GRANT` a `anon/authenticated/service_role` fallaban en un Postgres sin esos roles → ahora se
   conceden solo si existen.

## 3. Alcance del primer movimiento (tablas solo-IALab)

**Se mueven a `ialab`**: `module_content`, `module_lessons`, `module_topics`, `module_resources`,
`user_progress`, `user_video_progress`, `user_exams`, `user_activities`, `lesson_answers`,
`lesson_answer_votes`, `lesson_questions`, `forum_comments`, `forum_votes`, `forum_profiles`,
`forum_notifications`.

**NO se mueven todavía** (el código de SmartBoard también las usa): `learning_streaks`
(11 referencias en gamificación), `certificates`, `forum_posts`, `lesson_attempts`.

## 4. Acoplamiento y cambios de cliente

- **11 funciones** del curso referencian estas tablas **sin calificar** (verificado en
  `calculate_module_score`: `FROM user_progress`). No hay que reescribir cuerpos: la migración fija
  `search_path = ialab, public` en todas las funciones de `public` que mencionan esas tablas
  (generado desde el catálogo, sin firmas hardcodeadas).
- **RPC** (`mark_resource_viewed`, `calculate_module_score`, `get_module_full`, …) siguen en `public`
  y **el cliente no cambia** en esas llamadas.
- **Llamadas directas a tablas**: ~70 en total (57 frontend / 13 backend). Deben pasar a
  `.schema('ialab')`. Inventario por archivo:
  - Frontend: `hooks/IALab/useIALabForum.js` (8), `hooks/IALab/forum/useForumPosts.js` (5),
    `useForumVotes.js` (4), `useForumNotifications.js` (3), `useForumComments.js` (3),
    `context/ialab/ialabUIProvider/useIALabUI.js` (3),
    `IALabEvaluationModal/hooks/useEvaluationDraft.js` (3), `lib/rls-fixer.js` (2),
    `lib/progress/{videoProgress,examProgress,activityProgress}.js` (2 c/u), `lib/forum/posts.js` (2),
    `IALab/forum/useForumProfile.js` (2), `services/aiEvaluationService.js` (1),
    `hooks/IALab/useIALabEvaluation/supabase.js` (1).
  - Backend: `controllers/ialab/progressController.js` (5), `routes/ialab/resources.js` (2),
    `routes/admin.js` (2), y servicios varios (1 c/u).

## 5. Pasos del release (atómicos)

1. **Exponer el schema** en Dashboard → Integrations → Data API → Exposed schemas: añadir `ialab`
   (mantener `public`). Aditivo.
2. **Aplicar la migración 093** (mueve tablas + fija `search_path`).
3. **Desplegar el cliente** con `.schema('ialab')` para las tablas movidas (mismo release: si el
   cliente va antes que la migración, las tablas siguen en `public` y `.schema('ialab')` falla; si la
   migración va antes que el cliente, el cliente busca en `public` y falla). **Ventana de bajo uso.**
4. **Verificar**: curso (módulos, recursos, progreso, examen, desafío, foro), certificado, y que
   SmartBoard siga igual.

## 6. Rollback

`psql`: `ALTER TABLE ialab.<t> SET SCHEMA public;` para las tablas movidas (metadata-only, instantáneo)
+ revertir el cliente (redeploy del commit anterior). Las políticas/índices/constraints viajan con la
tabla, así que el estado previo se recupera sin pérdida de datos.

## 7. Segunda pasada (después de validar la primera)

`learning_streaks`, `certificates`, `forum_posts`, `lesson_attempts` (actualizando sus consumidores
de SmartBoard) y luego el equivalente de SmartBoard → schema `smartboard`.
