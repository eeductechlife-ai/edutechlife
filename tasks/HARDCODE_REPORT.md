# Reporte de Valores Hardcodeados — SmartBoard Kids Dashboard

**Fecha**: 2026-08-27  
**Alcance**: `edutechlife-frontend/src/components/kids-dashboard/`  
**Tipo**: Auditoría de solo lectura

---

## 1. Listas de materias hardcodeadas (repetidas en 6+ archivos)

| Archivo | Línea(s) | Qué está hardcodeado | Severidad | Sugerencia |
|---------|----------|----------------------|-----------|------------|
| `examPrep/examUtils.js` | 1–7 | Array `subjects` con 6 materias (mate, lenguaje, ciencias, historia, inglés, arte) — no incluye sociales, ed. física, tecnología | ALTO | Usar `getSubjects()` de `gradeUtils.js` o centralizar en `subjectMappings.js` |
| `oralExamUtils.js` | 1–25 | `getSubjects()` con 5 materias y colores hex hardcodeados — lista distinta a las demás | ALTO | Centralizar en un solo catálogo de materias compartido |
| `ProblemScanner.jsx` | 9–16 | `getSubjects()` con 6 materias — duplica la de examUtils con nombres distintos | ALTO | Unificar con catálogo central |
| `activityUploader/components/UploadForm.jsx` | 5–16 | `getSubjects()` con 6 materias — otra copia más | ALTO | Unificar con catálogo central |
| `dani/chatUtils.js` | 74–140 | `SUBJECT_KEYWORDS` — 7 materias con keywords de detección de tema | MEDIO | Mover keywords al catálogo central de materias |
| `schedule/ScheduleEditor.jsx` | 13–24 | `COMMON_SUBJECTS` — 11 materias en español plano, sin i18n | MEDIO | Usar catálogo central + i18n |
| `gradeUtils.js` | 28–36 | `DEFAULT_SUBJECTS` — 8 materias (la lista canónica, pero aún hardcodeada) | MEDIO | Migrar a tabla `subjects` en Supabase o a config compartida |

---

## 2. Rangos de grado/edad hardcodeados

| Archivo | Línea(s) | Qué está hardcodeado | Severidad | Sugerencia |
|---------|----------|----------------------|-----------|------------|
| `GenerateFlashcards.jsx` | 10–30 | `getGrades()` con 4 rangos (1-3, 4-6, 7-9, 10-12) y gradientes de color | MEDIO | Derivar del grado del estudiante en contexto |
| `flashcardSystem/components/ScannerTab.jsx` | 83–88 | `GRADES` — mismos 4 rangos duplicados | MEDIO | Reusar la misma fuente que GenerateFlashcards |
| `ProblemScanner.jsx` | 18–23 | `getAges()` con 4 rangos de edad (6-8, 9-11, 12-14, 15-17) | BAJO | Derivar del perfil del estudiante |
| `gradeUtils.js` | 80–93 | `GRADE_NUMBER_WORDS` — mapeo de palabras en español a números de grado | BAJO | Aceptable como utilidad de normalización |

---

## 3. Colores y temas que ignoran smartboardTheme.js

| Archivo | Línea(s) | Qué está hardcodeado | Severidad | Sugerencia |
|---------|----------|----------------------|-----------|------------|
| `smartBoardProgress/gamificationData.js` | 1–9 | `COLORS` — paleta completa de 8 colores hex duplicando smartboardTheme | MEDIO | Importar de `smartboardTheme.js` |
| `dani/chartColors.js` | 1–7 | `COLORS` — 6 colores hex para gráficos, duplican la paleta del tema | MEDIO | Importar de `smartboardTheme.js` |
| `examPrep/examUtils.js` | 52–55 | `inpCls` y `gdCls` — clases CSS con colores hex inline (#004B63, #4DA8C4, etc.) | MEDIO | Usar tokens de smartboardTheme o clases de Tailwind del tema |
| `oralExamUtils.js` | 4–24 | Colores hex por materia (#4DA8C4, #FF6B9D, etc.) dentro del array | BAJO | Usar `subjectColor()` de timetableUtils |
| `schedule/timetableUtils.js` | 46–58 | `SUBJECT_COLORS` — paleta de colores por materia (11 colores hex) | BAJO | Aceptable como fuente canónica si se centraliza |
| `FutureExplorer.jsx` | 7–62 | `AREAS` — 7 áreas con colores hex hardcodeados | BAJO | Migrar colores a smartboardTheme |
| `adaptiveNextStep.js` | 24–34 | `MODE_STYLE` — gradientes y colores por modo pedagógico | BAJO | Importar de smartboardTheme |
| `gradeUtils.js` | 49–55 | `gradeColor()` — 4 colores hex para semáforo de notas (#22C55E, etc.) | BAJO | Usar tokens de smartboardTheme |

---

## 4. Datos de gamificación y recompensas hardcodeados

| Archivo | Línea(s) | Qué está hardcodeado | Severidad | Sugerencia |
|---------|----------|----------------------|-----------|------------|
| `smartBoardProgress/gamificationData.js` | 12–47 | `REWARDS` — 6 recompensas con nombres, costos (500–3000) y descripciones en español | ALTO | Mover a tabla `rewards` en Supabase para administración dinámica |
| `smartBoardProgress/gamificationData.js` | 49–82 | `getLevel()` — umbrales de nivel (500, 1000, 2500, 5000 puntos) hardcodeados | MEDIO | Mover umbrales a config/backend para poder ajustar sin deploy |
| `QuizCard.jsx` | 7–50+ | `CONFIDENCE_LEVELS` — 4+ niveles de confianza con puntos, colores y animaciones | BAJO | Aceptable como config UI, pero mover strings a i18n |

---

## 5. Contenido de onboarding y UX en español sin i18n

| Archivo | Línea(s) | Qué está hardcodeado | Severidad | Sugerencia |
|---------|----------|----------------------|-----------|------------|
| `onboarding/OnboardingWizard.jsx` | 12–54 | `NAV_STEPS` — 3 pasos con títulos, mensajes por edad y CTAs en español plano | MEDIO | Pasar por `t()` para soporte multi-idioma |
| `onboarding/OnboardingWizard.jsx` | 46–54 | `PARENT_GOAL_OPTIONS` — 6 metas parentales hardcodeadas en español | MEDIO | Pasar por `t()` |
| `onboarding/OnboardingWizard.jsx` | 56–65 | `INTEREST_OPTIONS` — 8 intereses hardcodeados en español | MEDIO | Pasar por `t()` |
| `kidsDashboardConfig.js` | 66–78 | `CATEGORY_TAB_LABELS` y `TOP_BAR_LABELS` — etiquetas de tabs en español | MEDIO | Pasar por `t()` |
| `kidsDashboardConfig.js` | 82–95 | `PREMIUM_FEATURES` — títulos y descripciones en español | MEDIO | Pasar por `t()` |
| `adaptiveNextStep.js` | 40–70 | Mensajes pedagógicos (`title`, `why`, `cta`) en español plano | MEDIO | Pasar por `t()` |
| `examPrep/examUtils.js` | 30–40 | `getTips()` — tips de estudio VAK en español plano | BAJO | Pasar por `t()` |
| `SkillPassport.jsx` | 43 | Texto "Completa actividades para ver tus competencias aquí" inline | BAJO | Pasar por `t()` |

---

## 6. Áreas vocacionales y exploración hardcodeadas

| Archivo | Línea(s) | Qué está hardcodeado | Severidad | Sugerencia |
|---------|----------|----------------------|-----------|------------|
| `FutureExplorer.jsx` | 6–62 | `AREAS` — 7 áreas vocacionales con títulos, descripciones, competencias y colores | MEDIO | Mover a config o tabla para poder agregar áreas sin deploy |

---

## 7. Configuración de navegación y categorías

| Archivo | Línea(s) | Qué está hardcodeado | Severidad | Sugerencia |
|---------|----------|----------------------|-----------|------------|
| `kidsDashboardConfig.js` | 3–16 | `CATEGORY_MAP` — mapeo tab→categoría (13 entradas) | BAJO | Aceptable como config de routing |
| `kidsDashboardConfig.js` | 18–64 | `CATEGORIES` — 5 categorías con colores, gradientes y tabs | BAJO | Migrar colores a smartboardTheme |
| `kidsDashboardConfig.js` | 80 | `PREMIUM_TABS` — `["oral", "misiones"]` | MEDIO | Mover a feature flags o backend para flexibilidad |
| `kidsDashboardConfig.js` | 97–126 | `FEATURE_FLAGS` — flags hardcodeadas, comentario dice "Eventually from Supabase" | MEDIO | Migrar a tabla `feature_flags` en Supabase como indica el TODO |

---

## 8. Nombre de estudiante fallback

| Archivo | Línea(s) | Qué está hardcodeado | Severidad | Sugerencia |
|---------|----------|----------------------|-----------|------------|
| `SmartBoardKidsDashboard.jsx` | 111 | Fallback `"Estudiante"` si no hay nombre en localStorage | BAJO | Usar `t("kid.default_name")` |

---

## Resumen por severidad

| Severidad | Cantidad | Descripción |
|-----------|----------|-------------|
| **ALTO** | 4 | Listas de materias duplicadas e inconsistentes; recompensas no administrables |
| **MEDIO** | 16 | Strings sin i18n, colores fuera de tema, config que debería ser dinámica |
| **BAJO** | 10 | Fallbacks menores, utilidades de normalización, config UI aceptable |
| **Total** | **30** | |

---

## Acciones prioritarias recomendadas

1. **Unificar catálogo de materias** — Hay 6+ listas distintas de materias. Crear una sola fuente en `config/subjectMappings.js` (que ya existe) y que todos los componentes la consuman.
2. **Migrar recompensas y niveles a Supabase** — `REWARDS` y umbrales de `getLevel()` deberían ser administrables sin deploy.
3. **i18n de onboarding y adaptiveNextStep** — Los mensajes pedagógicos y de onboarding están solo en español; pasar por `t()`.
4. **Centralizar colores en smartboardTheme.js** — `gamificationData.COLORS`, `chartColors.COLORS` y colores inline duplican la paleta.
5. **Migrar feature flags a Supabase** — El propio código lo indica como TODO pendiente.
