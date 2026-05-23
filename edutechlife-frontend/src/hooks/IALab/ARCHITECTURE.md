# Hooks Architecture — IALab

## Resumen

11 hooks principales + 5 sub-hooks de foro. ~4,100 líneas totales.
Solo 1 tiene tests (useSidebarState: 17 tests, 223 líneas).

## Hooks principales

| Hook | Lines | Store | Context | API externa | Tests |
|------|-------|-------|---------|-------------|-------|
| useIALabQuiz | 934 | ✅ getState() | ✅ | ❌ | ❌ |
| useIALabProgress | 550 | ✅ getState() | ✅ | Supabase | ❌ |
| useIALabSynthesizer | 535 | ❌ | ✅ | DeepSeek | ❌ |
| useIALabEvaluation | 417 | ❌ | ❌ | DeepSeek | ❌ |
| useIALabForum | 364 | ❌ | ❌ | Supabase | ❌ |
| useSidebarState | 164 | ✅ full hook | ❌ | ❌ | ✅ (17) |
| useSupabaseContent | 177 | ❌ | ❌ | Supabase | ❌ |
| useStudyNotesSync | 154 | ❌ | ❌ | Supabase | ❌ |
| useScreenshotProtection | 72 | ❌ | ❌ | ❌ | ❌ |
| useIALabKeyboardShortcuts | 39 | ✅ getState() | ❌ | ❌ | ❌ |

## Sub-hooks de foro

| Hook | Lines | Store | API |
|------|-------|-------|-----|
| useForumPosts | 193 | ❌ | Supabase |
| useForumComments | 138 | ❌ | Supabase |
| useForumVotes | 90 | ❌ | Supabase |
| useForumNotifications | 194 | ❌ | Supabase + LS |
| useForumProfile | 106 | ❌ | Supabase |

## Patrones de acceso al store

Se usan 3 patrones distintos (inconsistencia arquitectónica):

| # | Patrón | Hooks | Riesgo |
|---|--------|-------|--------|
| 1 | Granular selectors `useIALabStore(s => s.x)` | Via IALabContext (indirecto) | ✅ Óptimo |
| 2 | Full hook `useIALabStore()` + destructure | useSidebarState | ⚠️ Re-renderiza en cualquier cambio |
| 3 | Imperativo `getState()` | useIALabProgress, useIALabQuiz, useIALabKeyboardShortcuts | ⚠️ No reactivo, difícil de trackear |

**Objetivo:** Estandarizar a patrón #1 (selectores granulares) para toda lectura reactiva,
y patrón #3 solo para operaciones fire-and-forget.

## Responsabilidades

### useIALabQuiz (934 lines)
- Ciclo de vida del examen (timer, preguntas, resultados)
- 40 preguntas hardcodeadas (450 líneas) — **deberían ser data externa**
- Seguridad (anti-copia, detección de screenshot)
- Límite de intentos diarios
- **Bug conocido:** stale closure en calculateQuizScore
- **Bug conocido:** mutación in-place de source data (shuffle)

### useIALabProgress (550 lines)
- Carga/guarda progreso desde Supabase
- Cache con localStorage para UX instantánea
- Track de actividades (examen, desafío, comunidad, recursos)
- beforeunload handler para persistencia
- 7 queries a Supabase en carga inicial

### useIALabEvaluation (417 lines)
- Genera 3 ejercicios vía DeepSeek API
- Evalúa respuestas con scoring pedagógico
- Fallback local cuando API no disponible
- Sin dependencias del store (todo local state)

### useIALabSynthesizer (535 lines)
- Text-to-speech vía DeepSeek API
- Prompt analysis, optimization, evaluation
- Local prompt evaluator utilities

### useIALabForum (364 lines)
- CRUD de posts, comentarios, likes
- Supabase Realtime subscriptions
- Estadísticas de foro

### useSidebarState (164 lines)
- Colapso/expansión de secciones
- Responsive breakpoint detection
- Datos estáticos (SECTION_DATA, MODULE_DATA, COURSE_DATA)

### useSupabaseContent (177 lines)
- Fetch de contenido desde Supabase (module_content, lessons, topics, resources)
- localStorage cache con TTL 5 min
- Fallback a constantes hardcodeadas

## Reglas para hooks nuevos
1. No mezclar data estática con lógica — extraer a archivos data/
2. Devolver objeto agrupado (máximo 5-7 propiedades), no 55+ valores sueltos
3. Usar `useIALabStore(s => s.valor)` para lecturas reactivas
4. Marcar con comentario `// FIRETARGET` las operaciones fire-and-forget con getState()
5. Mantener <400 líneas por hook
