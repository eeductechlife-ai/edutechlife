# SmartBoard Route Map

Auditoría de rutas y vistas del kids-dashboard SmartBoard.  
Generado: 2026-08-27 | Branch: `feature/smartboard-3.0`

---

## 1. Rutas del Router (routes/index.jsx)

| Ruta | Componente | Descripción | Auth | Estado |
|------|-----------|-------------|------|--------|
| `/conoce-smartboard` | `SmartBoardInfoPage` | Página informativa / landing marketing de SmartBoard | No | FUNCIONAL |
| `/smartboard` | `SmartBoardLandingPage` | Punto de entrada: muestra `SmartBoardKidsDashboard` (estudiante) o `SmartBoardParentDashboard` (padre, vía localStorage) | No | FUNCIONAL |
| `/smartboard/consent` | `SmartBoardConsentGate` | Gate de consentimiento parental (Habeas Data) antes de usar SmartBoard | No | FUNCIONAL |
| `/smartboard/login` | `SmartBoardLoginRedirect` | Redirect inteligente: sin auth -> `/sign-up/smartboard`; con auth -> `/smartboard` | No | FUNCIONAL |
| `/smartboard/padres` | `SmartBoardParentDashboard` | Dashboard exclusivo para padres con vista de progreso del hijo | Si (smartboard) | FUNCIONAL |
| `/smartboard/app` | `SmartBoardPage` -> `SmartBoardDashboard` | Dashboard legacy/alternativo del estudiante (componente `smartBoardDashboard/`) | Si (smartboard) | FUNCIONAL |
| `/smartboard/estadisticas` | `SmartBoardStatsPage` | Página de estadísticas detalladas del estudiante | Si (smartboard) | FUNCIONAL |
| `/sign-up/smartboard` | `SmartBoardSignUpPage` | Registro de usuario para SmartBoard | No | FUNCIONAL |

---

## 2. Tabs internas del KidsDashboard (SmartBoardKidsDashboard.jsx)

Se acceden via `?tab=<nombre>` dentro de `/smartboard`.  
Renderizadas por `CinematicContent.jsx` con lazy loading.

| Tab (`?tab=`) | Componente principal | Descripción | Auth | Estado |
|---------------|---------------------|-------------|------|--------|
| `inicio` | `HeroSection` + `RutaAprendizaje` + `MisionDelDia` + `FutureExplorer` + `PointsRewardsSystem` | Pantalla de inicio: saludo, progreso, siguiente acción, ruta, misión diaria, explorador futuro (10+), puntos | Si | FUNCIONAL |
| `perfil` | `SmartProfile` | Perfil del estudiante con datos personales y configuración | Si | FUNCIONAL |
| `materias` | `SubjectsView` | Lista de materias del estudiante | Si | FUNCIONAL |
| `horario` | `WeeklyScheduleView` | Horario semanal del estudiante | Si | FUNCIONAL |
| `flashcards` | `FlashcardSystem` | Sistema de tarjetas de repaso con repetición espaciada | Si | FUNCIONAL |
| `oral` | `OralExamSimulator` | Simulador de exámenes orales con Dani (TTS/STT) | Si | FUNCIONAL |
| `examenes` | `ExamPrep` | Preparación de exámenes con generación de preguntas | Si | FUNCIONAL |
| `vak` | `VAKDiagnosticEnhanced` + `PersonalizedPlan` | Diagnóstico VAK (Visual/Auditivo/Kinestésico) + plan personalizado post-resultado | Si | FUNCIONAL |
| `progreso` | `SmartBoardProgress` | Vista de progreso académico general | Si | FUNCIONAL |
| `calificaciones` | `GradeScanner` | Escáner de calificaciones (OCR de boletines) con análisis IA | Si | FUNCIONAL |
| `misiones` | `MissionsView` | Vista de misiones gamificadas activas y completadas | Si | FUNCIONAL |
| `noticias` | `TechNewsFeed` | Feed de noticias de tecnología curado para niños | Si | FUNCIONAL |
| `plan` | `ImprovementPlan` | Plan de mejora académica generado por IA basado en calificaciones | Si | FUNCIONAL |
| `puntos` | `PointsRewardsSystem` | Sistema de puntos y recompensas gamificado | Si | FUNCIONAL |

> Nota: `curriculo` aparece comentado como TODO en CinematicContent.jsx (sin implementación).

---

## 3. Componentes complementarios del KidsDashboard

| Componente | Archivo | Descripción |
|-----------|---------|-------------|
| `PremiumSidebar` | `components/` | Sidebar de navegación desktop con tabs y puntos |
| `TopBar` | `components/` | Barra superior con nombre, racha, puntos |
| `MobileSubTabBar` | `components/` | Barra de sub-tabs para mobile |
| `DaniFAB` | `DaniFAB.jsx` | Botón flotante para abrir chat con Dani |
| `DaniTutorChat` | `daniTutorChat/` | Chat conversacional con el tutor IA Dani |
| `OnboardingGuide` | `OnboardingGuide.jsx` | Guía de onboarding para nuevos usuarios |
| `PremiumGate` | `PremiumGate.jsx` | Modal gate para features premium |
| `SmartBoardConsentGate` | `SmartBoardConsentGate.jsx` | Gate de consentimiento (Habeas Data) |
| `SmartBoardAnalytics` | `SmartBoardAnalytics.jsx` | Componente de analíticas internas |
| `AcademicSemaphore` | `AcademicSemaphore.jsx` | Semáforo académico (rojo/amarillo/verde) |
| `StudyPodcast` | `StudyPodcast.jsx` | Generador de podcasts de estudio con TTS |
| `SkillPassport` | `SkillPassport.jsx` | Pasaporte de habilidades del estudiante |
| `KidsCalendar` | `KidsCalendar.jsx` | Calendario con eventos y exámenes |
| `WhatDoIDoToday` | `WhatDoIDoToday.jsx` | Widget "¿Qué hago hoy?" con sugerencia IA |
| `ParentalConsentBlocker` | `ParentalConsentBlocker.jsx` | Bloqueador si falta consentimiento parental |
| `CrisisResourcesModal` | `CrisisResourcesModal.jsx` | Modal de recursos de crisis (bienestar) |

---

## 4. Subdirectorios del KidsDashboard

| Directorio | Contenido |
|-----------|-----------|
| `dani/` | Avatar 3D y componentes de Dani |
| `daniTutorChat/` | Sistema de chat con tutor IA |
| `examPrep/` | Preparación de exámenes |
| `flashcardSystem/` | Sistema de flashcards |
| `improvementPlan/` | Plan de mejora académica |
| `news/` | Feed de noticias tech |
| `onboarding/` | Flujo de onboarding |
| `profile/` | Perfil del estudiante |
| `schedule/` | Horario semanal |
| `smartBoardProgress/` | Progreso académico |
| `smartBookReader/` | Lector de libros inteligente |
| `activityUploader/` | Subida de actividades |
| `components/` | Componentes compartidos (CinematicContent, Sidebar, TopBar, etc.) |
| `ui/` | Componentes UI base |
| `styles/` | Estilos CSS del dashboard |
| `__tests__/` | Tests unitarios |
