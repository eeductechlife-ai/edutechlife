# Store Architecture — IALab

## Stack
- **Zustand** (`create` from `zustand`) — vanilla, no middleware
- **6 slices** compuestos en `src/store/ialabStore.js`
- **7 funciones cross-cutting** (getDailyRoute, syncFromPersistence, analytics) mantenidas en el store principal

## Slices

### persistenceSlice (200 lines)
- **Propósito:** localStorage wrappers, syncFromPersistence, attempt limits (examen/desafío), bookmark CRUD
- **Estado clave:** bookmarked resources, progress cache, sidebar state, gamification persistence
- **Dependencias:** `@/constants/ialab` (LS_KEYS), `@/utils/ialab` (ls)
- **Usado por:** IALabContext.syncFromPersistence, useIALabProgress, useIALabQuiz, useSidebarState
- **Side effects:** localStorage writes via ls.set(), ls.remove()

### gamificationSlice (135 lines)
- **Propósito:** XP, streak, badges, levels, recordActivity
- **Estado clave:** xp, streak, lastActivityDate, badges, forumPostCount, forumCommentCount, startDate
- **Cross-slice calls:** persistGamificationState (persistenceSlice), checkAndAwardBadges → lee lessonProgress (lessonSlice) + completedModules (progressSlice)
- **Side effects:** localStorage persist, window.dispatchEvent('ialab:badgesAwarded')

### lessonSlice (133 lines)
- **Propósito:** Lesson progress, checkpoint answers, last visited lesson, video/resource tracking
- **Estado clave:** lessonProgress, checkpointAnswers, lastVisitedLesson
- **Dependencias:** `@/data/ialab` (ALL_LESSONS), `@/constants/ialab` (LS_KEYS), `@/utils/ialab` (ls)
- **Cross-slice calls:** markLessonComplete → addXp (gamification), recordActivity, checkAndAwardBadges, persistGamificationState

### progressSlice (247 lines)
- **Propósito:** Module progress, exam/challenge/resource/community tracking, scoring calculations
- **Estado clave:** moduleProgress, completedModules, courseProgress, completedExams, completedVideos, completedInfographics, completedActivities, challengeScores, isLoadingProgress, syncStatus, isUsingJWT, userId, userRole
- **Dependencias:** `@/constants/ialab` (WEIGHTS, INITIAL_MODULE_PROGRESS, MODULE_RESOURCE_COUNTS, XP_MAP), `@/utils/ialab` (calcModuleScore, calcGlobalProgress, memoize, clearMemoCache)
- **Cross-slice calls:** updateModuleActivity → addXp (gamification), recordActivity, checkAndAwardBadges; markCommunityComment → addXp
- **Side effects:** localStorage persist (completedExams), clearMemoCache()

### evaluationSlice (62 lines)
- **Propósito:** Quiz/exam/evaluation transient state, challenge state, quiz navigation
- **Estado clave:** quizAnswers, quizScore, quizPassed, quizResult, quizAttempts, dailyAttemptsCount, evalAnswers, currentQuestion, currentPage, challengeScore
- **Dependencias:** ninguna (solo set/get)
- **Cross-slice:** ninguno (estado puramente transaccional)

### uiSlice (119 lines)
- **Propósito:** Navigation, sidebar, accordions, security, timer, coach (Valerio), synthesizer, certificate, device info, static data references
- **Estado clave:** activeMod, activeTab, visitedModules, sidebarDropdowns, openAccordions, security state, timer state, coach/synthesizer state, certificate state, device info, loading flags
- **Dependencias:** `@/data/ialab` (modules, ALL_LESSONS), `@/constants/ialab` (LAST_MODULE_ID)
- **Nota:** Contiene datos estáticos de referencia (modules, ALL_LESSONS) para acceso rápido desde el store

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
                           → localStorage persist (ls.set)
                           → window.dispatchEvent (para notificaciones)
                           → clearMemoCache()
```
