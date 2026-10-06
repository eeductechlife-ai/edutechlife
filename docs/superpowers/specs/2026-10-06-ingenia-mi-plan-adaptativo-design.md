# Mi Plan adaptativo — IngenIA

Fecha: 2026-10-06
Estado: Aprobado (diseño). Pendiente de plan de implementación.
Producto: IngenIA (account_type `smartboard`)

## 1. Problema

La sección **Mi Plan** (`?tab=plan` → `MateriasTab` → `ImprovementPlan.jsx`) promete
un plan personalizado que "se adapta a lo que el estudiante debe mejorar y en las
materias en que está mal". Hoy no lo cumple:

- El plan lo produce un **LLM de un solo tiro** (`callDeepseekSmartboard`,
  `useImprovementPlan.js:253`) con las notas que el niño escribió a mano una vez.
- Existe un **motor adaptativo real** en el backend (`services/adaptiveLearning.js`)
  con dominio por competencia, priorización y contenido, pero **Mi Plan no lo usa**.
- El avance es solo marcar checkboxes; **nada recalcula** el plan según el desempeño.

### Evidencia en producción (2026-10-06, cuenta `mateo.ingenia`)

| Prueba | Resultado |
|---|---|
| `POST /api/ingenia/adaptive/daily-plan` (20 min) | `activities: []` — plan de 20 min con 0 actividades |
| `GET /api/ingenia/adaptive/next-action` | Genérico ("No has estudiado hoy"), `mastery {}` |
| `POST /adaptive/recommendations` | Fallback a contenido no relacionado con la debilidad real |

Estado de tablas de personalización:

| Tabla | Filas | Implicación |
|---|---|---|
| `student_competency_mastery` | 0 | Dominio por competencia nunca tiene datos |
| `grade_analyses` | 0 | El motor no ve ninguna nota |
| `sessions` | 0 | Sin actividad/tiempo → sin racha real |
| `learning_content` | 4 | Casi no hay contenido |
| `learning_streaks` | 6 | Poblado por script, no por uso |
| `students` | 16 | 4 con notas, en `grades_json` crudo (`"MATEMÁTICAS"`) |
| `learning_plans` | 16 monthly | Sí se generan planes (los del LLM) |
| `students.grade_level` | `null` | El currículo por grado no aplica |

### Causas raíz

1. **Sistemas duplicados y desconectados**: LLM one-shot vs motor adaptativo.
2. **Pipeline de datos muerto**: mastery=0, `grade_analyses`=0, `sessions`=0.
3. **Falló el registro de sesiones**: `IngenIAKidsContext.jsx:530` inserta
   `subject:"dashboard"`/`type:"dashboard"`, que violan los CHECK de `sessions`
   (`supabase/migrations/059_reconcile_smartboard.sql:36`).
4. **Dos fuentes de verdad para notas**: `students.grades_json` (lo que ve Mi Plan)
   vs `grade_analyses` (lo que lee el motor, vacío; escrito por REST directo con RLS).
5. **Sin bucle de feedback**: completar actividades no actualiza dominio ni reordena.
6. **Sin secuencia por competencia**: se ataca la materia, no la competencia débil.
7. **Bugs de contacto**: daily-plan vacío (`adaptiveLearning.js:269-309,535`);
   `PersonalizedPlan` no llama al endpoint por `studentId` vacío;
   frontend espera `act.title` y backend envía `label`.

## 2. Objetivos y no-objetivos

**Objetivos**
- Que Mi Plan se arme con **debilidades reales** (dominio por competencia + notas).
- Que **se re-secuencie** al completar actividades (adaptación real).
- Que un estudiante nuevo arranque personalizado vía **diagnóstico inicial**.
- Que el backend sea la **fuente de verdad** del plan.

**No-objetivos (fuera de alcance)**
- Modelo psicométrico avanzado (IRT/CAT) ni panel docente nuevo.
- Reescritura de la UX de 4 semanas (se conserva).
- Reemplazo del motor adaptativo existente.

## 3. Arquitectura

Backend manda. `services/adaptiveLearning.js` gana:

- `buildImprovementPlan(studentId)` → 4 semanas desde el estado real.
- `resequenceImprovementPlan(studentId)` → reordena semanas restantes sin perder `done`.

Endpoints en `routes/smartboard/adaptive.js` (alias `/api/ingenia` y `/api/smartboard`):

- `POST /adaptive/improvement-plan` → genera/reemplaza y persiste
  (`learning_plans` type=`monthly`, `is_active=true`).
- `POST /adaptive/improvement-plan/resequence` → reordena conservando progreso.
- `GET /improvement-plan` (existente en `progress.js`) → `{ plan, needsDiagnostic, currentFocus }`.

El LLM (`callDeepseekSmartboard`) **solo redacta** `danTip`/copy motivacional.
Toda decisión de semana/competencia/actividad es determinista y testeable.

### 3.1 Contrato del plan (compatible con `normalizePlan`)

```json
{
  "weeks": [
    {
      "week": 1,
      "title": "string",
      "focus": "string",
      "competencyId": "co_matematicas_g6_dba1",
      "mastery": 0.35,
      "danTip": "string",
      "activities": [
        { "titulo": "string", "duracion": "20 min", "tipo": "visual",
          "done": false, "competencyId": "co_matematicas_g6_dba1",
          "contentId": "uuid|null", "reason": "string" }
      ]
    }
  ],
  "topActions": ["..."],
  "weakSubjects": ["Matemáticas"],
  "source": "plan",
  "generatedAt": 1791299573770,
  "needsDiagnostic": false
}
```

`normalizePlan` (`planModel.js:26`) se mantiene; se le añaden los campos nuevos
de forma tolerante (ignorarlos si faltan) para no romper planes viejos.

## 4. Arreglos del pipeline de datos

1. **Sesiones** — `IngenIAKidsContext.jsx:530`: usar valores válidos del CHECK
   (`subject:'general'`, `type:'free_practice'`); setear `duration_minutes` en
   `useSessionEnd` (`useIngenIASupabase.ts:400-449`). Esto reactiva el trigger
   `learning_streaks`.
2. **Notas → motor** — `fetchGrades` (`adaptiveLearning.js:47`): leer como fuente
   primaria `students.grades_json` normalizando el subject (`MATEMÁTICAS→matematicas`,
   `QUÍMICA→ciencias_naturales`, etc.), y `grade_analyses` como histórico.
3. **Escritura de `grade_analyses`** — moverla del REST directo del frontend
   (`useGradeScanner.js:199`) a un endpoint backend `POST /api/ingenia/grade-analysis`
   (service role, subject normalizado).
4. **Dominio** — reparar `useCompetencyTracking` → `POST /adaptive/mastery`:
   verificar `students.id` (no auth id) y que los IDs DBA existan (en prod existen
   `co_matematicas_g*_dba*`); añadir telemetría para detectar fallos.
5. **Grado/edad** — capturar `grade_level`/`age` en signup/onboarding
   (`routes/auth/session.js:71` hoy fija `age:12` y no setea `grade_level`).

## 5. Algoritmo `buildImprovementPlan`

1. `getStudentState(studentId)` (ya existe).
2. **Ranking de competencias**: para cada `masteryRow`, `déficit = 1 − mastery`;
   multiplicar por peso de materia si su nota `< 3.5`; ordenar descendente y tomar
   las **4 peores** (una por semana).
3. **Completar faltantes** hasta 4: materias con nota baja sin competencias →
   competencias base del grado (DBA) → tema de diagnóstico.
4. **Actividades por semana** (3): de `learning_content` filtrado por
   `competency_id`/subject/difficulty si hay; si no, plantilla con **handoff a
   Practicar** (`activityRoute`, `planActivity.js`), `tipo` según VAK.
5. `danTip` por semana: 1 frase LLM con fallback local.
6. `topActions` y `weakSubjects` derivados del ranking.
7. **Nunca vacío**: fallbacks escalonados (contenido relacionado → prerrequisito →
   diagnóstico → exploración), reutilizando la lógica de `recommendContent`.

## 6. Re-secuencia

- Al completar una actividad con `competencyId`: `POST /adaptive/mastery`
  (`score` según resultado) y luego `POST /adaptive/improvement-plan/resequence`.
- `resequence` recomputa el orden de las **semanas no completadas**, conserva los
  `done` y devuelve `plan` + `changed: true/false`.
- Regenerar de cero solo si el usuario lo pide (se mantiene confirmación actual).

## 7. Cold-start

- Si no hay `masteryRows` ni notas: `GET /improvement-plan` responde
  `needsDiagnostic: true` con un diagnóstico de 5-10 preguntas por grado.
- Al responder, siembra dominio vía `/adaptive/mastery` y genera el plan.

## 8. Frontend

- `useImprovementPlan.js`: reemplaza `callDeepseekSmartboard` por
  `POST /api/ingenia/adaptive/improvement-plan`; `done` viene del servidor;
  `localStorage improvement_plan_<userId>` queda como caché offline.
- `ImprovementPlan.jsx`: por semana muestra **competencia foco + % de dominio** y
  aviso "tu plan se actualizó" al re-secuenciar. Respetar darkMode y a11y actuales.
- `planFromAnalysis` (Notas) converge al mismo shape.
- `PersonalizedPlan.jsx`: arreglar `studentId` (login debe devolver `studentId`, o
  resolverlo por `auth_id`) y el render `title`/`label`.

## 9. Degradación y errores

- Si el motor falla → fallback al plan LLM actual (nunca pantalla vacía).
- Offline → `localStorage`.
- Errores de tracking no deben romper la UI (ya se tragan; añadir telemetría).

## 10. Verificación

- Unit reales de `buildImprovementPlan`: estado vacío, dominio parcial, notas duras
  y "mastery 0.4-0.7 con racha>0" (el caso que hoy da 0 actividades).
- Integración: insert válido en `sessions` → `learning_streaks`; upsert de mastery →
  `student_competency_mastery`.
- E2E con `src/scripts/golden-journey-test.js`.
- Verificación manual contra producción con `mateo.ingenia` (debe devolver ≥1
  actividad y foco por competencia).

## 11. Decisiones tomadas

- **D1 Alcance**: unificar + arreglar datos (no solo bugs, no rediseño total).
- **D2 Estructura**: híbrido — 4 semanas que se re-secuencian.
- **D3 Prioridad**: notas + dominio por competencia + diagnóstico inicial.
- **D4 Enfoque**: motor decide, LLM redacta.

## 12. Riesgos

- Migraciones reales desalineadas (`CLAUDE.md`): verificar CHECK de `sessions` y FK de
  mastery en staging antes de tocar producción.
- `learning_content` casi vacío (4 filas): el plan dependerá de generación on-the-fly
  hasta ampliar el catálogo.
- Normalización de subjects del boletín: mantener un mapa explícito y testeado.
