# Store Architecture — IALab

## Stack
- **Zustand** (`create` from `zustand`) con `persist` middleware
- **10 slices** compuestos en `src/store/ialabStore.js`
- **7 funciones cross-cutting** (getDailyRoute, syncFromPersistence, analytics) mantenidas en el store principal
- **Persist middleware**: clave `ialab-store`, partialize para 10 propiedades de gamificación
  (xp, streak, lastActivityDate, startDate, badges, badgesDates, forumPostCount,
  forumCommentCount, lessonProgress, checkpointAnswers). El resto del estado
  (UI, navegación, bookmarks, completedVideos, attempts) usa persistencia manual.

## Slices

### persistenceSlice (~172 lines)
- **Propósito:** localStorage wrappers, syncFromPersistence, attempt limits (examen/desafío), bookmark CRUD
- **Estado clave:** bookmarked resources, progress cache, sidebar state
- **Dependencias:** `@/constants/ialab` (LS_KEYS), `@/utils/ialab` (ls)
- **Usado por:** IALabContext.syncFromPersistence, useIALabProgress, useIALabQuiz, useSidebarState
- **Side effects:** localStorage writes via ls.set(), ls.remove()

### gamificationSlice (150 lines)
- **Propósito:** XP, streak, badges, levels, recordActivity
- **Estado clave:** xp, streak, lastActivityDate, badges, forumPostCount, forumCommentCount, startDate
- **Cross-slice calls:** checkAndAwardBadges → lee lessonProgress (lessonSlice) + completedModules (progressSlice)
- **Side effects:** window.dispatchEvent('ialab:badgesAwarded'); persistencia automática vía Zustand persist

### lessonSlice (103 lines)
- **Propósito:** Lesson progress, checkpoint answers, last visited lesson, video/resource tracking
- **Estado clave:** lessonProgress, checkpointAnswers, lastVisitedLesson, completedVideos
- **Dependencias:** `@/data/ialab` (ALL_LESSONS), `@/constants/ialab` (LS_KEYS), `@/utils/ialab` (ls)
- **Cross-slice calls:** markLessonComplete → addXp (gamification), recordActivity, checkAndAwardBadges

### progressSlice (210 lines)
- **Propósito:** Module progress, exam/challenge/resource/community tracking, scoring calculations
- **Estado clave:** moduleProgress, completedModules, courseProgress, completedExams, completedInfographics, completedActivities, challengeScores, isLoadingProgress, syncStatus, isUsingJWT, userId, userRole
- **Dependencias:** `@/constants/ialab` (WEIGHTS, INITIAL_MODULE_PROGRESS, MODULE_RESOURCE_COUNTS, XP_MAP), `@/utils/ialab` (calcModuleScore, calcGlobalProgress, memoize, clearMemoCache)
- **Cross-slice calls:** updateModuleActivity → addXp (gamification), recordActivity, checkAndAwardBadges; markCommunityComment → addXp
- **Side effects:** localStorage persist (completedExams), clearMemoCache()

### evaluationSlice (61 lines)
- **Propósito:** Quiz/exam/evaluation transient state, challenge state, quiz navigation
- **Estado clave:** quizAnswers, quizScore, quizPassed, quizResult, quizAttempts, dailyAttemptsCount, evalAnswers, currentQuestion, currentPage, challengeScore
- **Dependencias:** ninguna (solo set/get)
- **Cross-slice:** ninguno (estado puramente transaccional)

### navigationSlice (40 lines)
- **Propósito:** Navegación entre módulos, tabs y secciones
- **Estado clave:** activeTab, visitedModules, sidebarDropdowns
- **Cross-slice:** ninguna

### synthesizerSlice (26 lines)
- **Propósito:** Estado del sintetizador de prompts
- **Estado clave:** synthesizer history, estado actual
- **Cross-slice:** ninguna

### certificateSlice (12 lines)
- **Propósito:** Estado del certificado de finalización
- **Estado clave:** certificate data, generación de certificado
- **Cross-slice:** ninguna

### seguridadSlice (22 lines)
- **Propósito:** Seguridad, anti-copia, protección de pantalla
- **Estado clave:** security state, timer de inactividad
- **Cross-slice:** ninguna

### uiSlice (18 lines)
- **Propósito:** UI state restante (loading flags, device info)
- **Estado clave:** loading flags, device info
- **Dependencias:** ninguna
- **Nota:** Se redujo significativamente al extraer navigationSlice y otros

## Funciones cross-cutting (en ialabStore.js)
Estas funciones dependen de 3+ slices y se mantienen en el store principal:

| Función | Slices que usa | Propósito |
|---------|---------------|-----------|
| getCurrentModule | uiSlice (activeMod, modules) | Devuelve el módulo activo actual |
| checkCourseCompletion | progressSlice (moduleProgress, completedModules) + uiSlice (courseCompleted) | Verifica si el curso está completo |
| generateModuleActivityList | uiSlice (ALL_LESSONS), lessonSlice (lessonProgress), progressSlice (moduleProgress) | Genera lista de actividades del módulo |
| determinePrimaryAction | lessonSlice (lastVisitedLesson), progressSlice (moduleProgress), persistenceSlice (storageGet) | Determina la siguiente acción recomendada |
| getDailyRoute | Todas (activeMod, moduleProgress, xp, streak, courseProgress, lessonProgress) | Compone la vista "Tu Ruta de Hoy" |
| getWeeklyXP | gamificationSlice (xp, startDate) | Calcula XP semanal |
| getDetailedRecommendations | persistenceSlice (storageGet), progressSlice (moduleProgress, completedExams, challengeScores) | Genera recomendaciones personalizadas |

## Reglas de uso
1. **Componentes de UI** → leer del store vía `IALabContext` (no directamente)
2. **Hooks** → usar `useIALabStore(s => s.valor)` para selectores granulares
3. **Fire-and-forget** → usar `useIALabStore.getState().metodo()` (persistencia, cache, side effects sin re-render)
4. **No mutar** arrays/objetos del store — siempre spread operator o inmutabilidad
5. **Cross-slice calls** están permitidas vía `get()` — es el patrón de zustand slices

## Flujo de datos
```
User Action → Store Method → set() actualiza estado local
                            → get().otroSliceMethod() (cross-slice)
                            → Zustand persist middleware (10 propiedades gamificación)
                            → localStorage directo (bookmarks, sidebar, attempts)
                            → window.dispatchEvent (para notificaciones)
                            → clearMemoCache()
```
