# Plan de Refactorización — Archivos Monolito (>500 líneas)

**Objetivo:** Reducir 42 archivos monolitos a módulos <500 líneas sin alterar funcionalidad.
**Estrategia:** Progresiva, 4 fases — de lo más seguro/mecánico a lo más complejo.

---

## Fase 1 — Datos y Constantes (10 archivos)

Extraer datos puros de archivos mixtos. Mecánico, 100% seguro — barrel export mantiene compatibilidad.

| Archivo | Líneas | Estrategia |
|---------|--------|------------|
| `components/IALab/constants/moduleResources.js` | 1353 | Dividir en `moduleResources/{module1..5}.es.js`, `moduleResources/{module1..5}.en.js`, `moduleResources/helpers.js` |
| `components/IALab/constants/moduleContent.js` | 1040 | Dividir en `moduleContent/{module1..5}.es.js`, `moduleContent/{module1..5}.en.js`, `moduleContent/selectors.js` |
| `components/Nico/nicoKnowledge.js` | 904 | Dividir en `nicoKnowledge/intents/{precios,servicios,ventas,...}.js` (11 categorías) + `nicoKnowledge/engine.js` (matcher) |
| `data/ialabQuizData.js` | 701 | Dividir en `ialabQuizData/{module1..5}.js` + `ialabQuizData/config.js` |
| `data/ialabQuizData.en.js` | 672 | Dividir en `ialabQuizData/{module1..5}.en.js` |
| `data/footer/footerContent.es.js` | 661 | Dividir en `footerContent/es/{navigation,social,legal,contact}.js` |
| `data/footer/footerContent.en.js` | 661 | Dividir en `footerContent/en/{navigation,social,legal,contact}.js` |
| `components/AutomationData.js` | 518 | Dividir en `automationData/{metrics,cases,standards,processes}.js` |
| `components/IALab/constants/moduleResources.js` helpers | parte | Extraer `resourceHelpers.js` (getResourceIcon, formatDuration, etc.) |
| `components/IALab/constants/moduleContent.js` selectors | parte | Extraer `contentSelectors.js` (getModuleContent, etc.) |

---

## Fase 2 — Servicios y Utilidades (7 archivos)

Dividir servicios monolíticos por dominio. Barrel export mantiene API pública.

| Archivo | Líneas | Estrategia |
|---------|--------|------------|
| `lib/forumService.js` | 1338 | Dividir en `forum/{config,cache,posts,comments,votes,stats,realtime}.js` |
| `lib/progress.js` | 966 | Dividir en `progress/{constants,core,video,activity,exam,scoring,resources,challenge,legacy}.js` |
| `services/flashcardAI.js` | 819 | Dividir en `flashcard/{config,promptBuilder,generator,themeDetection,iconMap,iconDetection}.js` |
| `utils/analytics.js` | 1142 | Dividir en `analytics/{schema,storage,sessionTracker,leadTracker,appointmentTracker,abTesting,reports,optimization}.js` |
| `utils/speech.js` | 803 | Dividir en `speech/{voiceProfiles,audioCache,googleTtsClient,nativeSpeech,speechRecognition}.js` |
| `utils/emailService.js` | 528 | Dividir en `email/{templates,senders,config}.js` |
| `services/progressSync.js` | 547 | Dividir en `progressSync/{supabaseClient,syncQueue,transformer,syncActivity}.js` |

---

## Fase 3 — Hooks y Lógica Compartida (4 archivos)

Extraer configuraciones, utilidades y llamadas API de hooks hinchados.

| Archivo | Líneas | Estrategia |
|---------|--------|------------|
| `hooks/IALab/useIALabEvaluation.js` | 801 | Extraer `ialab/moduleConfig.js` (MODULE_CONFIG), `ialab/promptTemplates.js`, `ialab/evaluationApi.js`, `ialab/localEvaluation.js`. Hook queda como orquestador. |
| `hooks/usePersistentProgress.js` | 632 | Extraer `courseProgress/config.js`, `courseProgress/storageKeys.js`, `courseProgress/utils.js`. Hook queda como orquestador. |
| `hooks/IALab/useIALabSynthesizer.js` | 548 | Extraer `ialab/synthesizerConfig.js` (voice profiles, parámetros) |
| `hooks/IALab/useIALabProgress.js` | 546 | Extraer `ialab/progressCalculations.js` (scoring, métricas) |

---

## Fase 4 — Componentes UI Grandes (21 archivos)

Descomponer componentes >500 líneas extrayendo sub-componentes y hooks.

### 4A — Los más grandes (>1000 líneas)

| Archivo | Líneas | Estrategia |
|---------|--------|------------|
| `DiagnosticoVAK.jsx` | 2316 | Extraer 6 screens: `screens/WelcomeScreen`, `CalibrationScreen`, `TestScreen`, `ParentDataScreen`, `ResultsScreen`, y el PDF preview ya está separado. Extraer `useDiagnosticoVAK.js` (state, lógica, validación), `useValeriaVoice.js`, `vakPDFGenerator.js`. |
| `NicoModern.jsx` | 2027 | Extraer `NicoChatButton.jsx`, `NicoChatHeader.jsx`, `NicoChatMessages.jsx`, `NicoChatInput.jsx`, `NicoChatHistory.jsx`. Extraer hooks: `useNicoSendMessage.js`, `useNicoVoice.js`, `useNicoLeadCapture.js`, `useNicoKeyboard.js`. Config: `nicoConfig.js`. |
| `DocumentPreviewScreen.jsx` | 1600 | Extraer 12 secciones del PDF: `sections/StudentInfoSection`, `GuardianSection`, `ResultHeroSection`, `CareersSection`, `CharacteristicsSection`, `ParentTipsSection`, `ValentinaCommentarySection`, `QRSection`, `HeaderSection`, `FooterSection`. |
| `SmartBoardKidsDashboard.jsx` | 1484 | Extraer sub-componentes: `PremiumSidebar.jsx`, `MobileBottomBar.jsx`, `SkeletonLoader.jsx`, `CinematicContent.jsx`, `MissionsView.jsx`, `SubjectsView.jsx`. Extraer data: `smartBoardConfig.js` (CATEGORY_MAP, PREMIUM_TABS). |
| `ActivityHistory.jsx` | 1243 | Extraer: `activityPDFGenerator.js` (jsPDF completo), `ActivityStats.jsx` (charts), `ActivityList.jsx` (filtros + lista), `RecommendationsList.jsx`, `ActivityAccordion.jsx`. Data: `activityConfig.js`. |
| `NeuroEntorno.jsx` | 1125 | Extraer: `VAKInfoPanel.jsx`, `VAKChatPanel.jsx`, `VAKStats.jsx`, `useVAKChat.js` (Deepseek API). Data: `vakContent.js`. CSS: extraer keyframes a CSS module. |
| `DaniTutorChat.jsx` | 1088 | Extraer: `DaniChatMessages.jsx`, `DaniQuickActions.jsx`, `DaniVoiceController.js` (TTS/STT). Hooks: `useDaniChat.js` (send, stream, memory). |
| `AdminDashboard.jsx` | 1080 | Extraer: `AdminKPIs.jsx`, `AdminLeadsTable.jsx`, `AdminHeader.jsx`, `adminDataTransform.js`. |

### 4B — Medianos (500-1000 líneas)

| Archivo | Líneas | Estrategia |
|---------|--------|------------|
| `Consultoria.jsx` | 884 | Extraer: `ContactForm.jsx`, `useContactForm.js`, `CaseStudyCard.jsx`, `ServiceTabs.jsx`. Data: `consultingData.js`. |
| `FlashcardSystem.jsx` | 870 | Extraer: `QuizCard.jsx`, `FlashcardResults.jsx`, `FlashcardImporter.jsx`, `useFlashcardDeck.js`. |
| `IALabProLandingPage.jsx` | 831 | Extraer: `HeroSection.jsx`, `TrustBar.jsx`, `IAFeaturesSection.jsx`, `IACourseGrid.jsx`, `MobileCTA.jsx`. |
| `SmartBoardDashboard.jsx` | 657 | Extraer: `HomeView.jsx`, `ReportModal.jsx`, `useStudentProgress.js`, `reportGenerator.js`. |
| `SmartBoardProgress.jsx` | 672 | Extraer: `CalendarMonth.jsx`, `PointsHistory.jsx`, `SessionLog.jsx`, `RewardsGrid.jsx`. Data: `gamificationData.js`. |
| `ExamPrep.jsx` | 651 | Extraer: `ExamCard.jsx`, `ExamDetail.jsx`, `ExamList.jsx`, `useExamPrep.js`, `examUtils.js`. |
| `UserProfileSmartCard.jsx` | 606 | Extraer: `ProfileInfoSection.jsx`, `ProfileProgressSection.jsx`, `ProfileSecuritySection.jsx`, `useProfileData.js`. |
| `SmartBoardParentDashboard.jsx` | 594 | Extraer secciones de dashboard parental. |
| `UserDropdownMenuPremium.jsx` | 568 | Extraer: `UserMenuHeader.jsx`, `UserMenuItems.jsx`, `UserMenuFooter.jsx`. |
| `ActivityUploader.jsx` | 534 | Extraer: `useActivityUploader.js`, `UploadPreview.jsx`, `UploadProgress.jsx`. |
| `IALabUIProvider.jsx` | 525 | Extraer: `useCertificate.js`, `useIALabNotifications.js`, `deviceDetection.js`. |
| `SmartBookReader.jsx` | 514 | Extraer: `ReaderControls.jsx`, `ReaderNavigation.jsx`, `ReaderContent.jsx`. |

---

## Principios de Refactorización

1. **Barrel exports siempre**: El archivo original se convierte en un barrel (`export { ... } from './sub/file'`) para que los imports existentes NO se rompan.
2. **Sin cambios de lógica**: Cero refactorización de algoritmos. Solo mover código a archivos más pequeños.
3. **Un archivo por fase**: No refactorizar más de 2-3 archivos grandes seguidos sin correr tests y build.
4. **Tests primero**: Verificar que los tests existentes pasan ANTES y DESPUÉS de cada refactor.
5. **Sin deuda nueva**: No agregar imports circulares ni dependencias incorrectas.

## Pipeline de Verificación

```bash
# Después de CADA archivo refactorizado:
npm run build  # debe pasar sin errores
npm test       # 883 tests deben seguir pasando
git diff --stat  # revisar solo archivos esperados
```

## Estimación de Esfuerzo

| Fase | Archivos | Archivos Nuevos | Complejidad |
|------|----------|-----------------|-------------|
| 1 — Datos | 10 | ~45 | Baja (mecánico) |
| 2 — Servicios | 7 | ~35 | Baja (mecánico) |
| 3 — Hooks | 4 | ~10 | Media |
| 4A — UI grandes | 8 | ~45 | Alta |
| 4B — UI medianos | 13 | ~35 | Media |
| **Total** | **42** | **~170** | |

## Orden de Ejecución Recomendado

```
Fase 1 → Build/Test → Fase 2 → Build/Test → Fase 3 → Build/Test → Fase 4A → Build/Test → Fase 4B → Build/Test
```
