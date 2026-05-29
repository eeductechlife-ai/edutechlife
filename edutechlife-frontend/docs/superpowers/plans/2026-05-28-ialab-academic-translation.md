# IALab Academic Translation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** All IALab Academic components show English text when the platform locale is `en`, matching the pattern used by the landing page.

**Architecture:** Use the existing `useTranslation()` hook from `src/i18n/I18nProvider.jsx`. Each component imports the hook, calls `t('ialab.section.key')`, and all key-value pairs exist in both `src/i18n/es.json` and `src/i18n/en.json`. Data files (moduleContent, moduleResources, landingPageData, sidebarData) get locale-aware selector functions.

**Tech Stack:** React, custom React Context i18n (`I18nProvider`), JSON locale files (`src/i18n/es.json`, `src/i18n/en.json`)

**Key naming convention:**
- `ialab.{component}.{key}` — UI components (e.g., `ialab.synthesizer.title`)
- `ialab.ova.{name}.{key}` — OVA components (e.g., `ialab.ova.etica.welcome`)
- `ialab.forum.{key}` — Forum components
- `ialab.data.{file}.{key}` — Data file content translations

---

### Task 1: Infrastructure — Create HOC for class components, add locale helper

**Files:**
- Create: `src/i18n/withTranslation.jsx`
- No locale file changes yet (keys added per-task)

- [ ] **Step 1: Create withTranslation HOC**

Only `SectionErrorBoundary` is a class component and can't use hooks directly. Create an HOC wrapper:

```jsx
// src/i18n/withTranslation.jsx
import React from 'react';
import { useTranslation } from './I18nProvider';

export function withTranslation(Component) {
  return function WrappedComponent(props) {
    const { t } = useTranslation();
    return <Component {...props} t={t} />;
  };
}
```

- [ ] **Step 2: Verify the file exists and is importable**

Run: `node -e "require('./src/i18n/withTranslation.jsx')"` (will error on JSX but module resolution should find the file)

---

### Task 2: Phase 1 — UI Main Components (sidebar, header, error boundary, breadcrumbs, offline banner, security warning)

**Files:**
- Modify: `src/components/IALab/SectionErrorBoundary.jsx`
- Modify: `src/components/IALab/OfflineBanner.jsx`
- Modify: `src/components/IALab/SecurityWarningModal.jsx`
- Modify: `src/i18n/es.json`
- Modify: `src/i18n/en.json`

- [ ] **Step 1: Translate SectionErrorBoundary.jsx**

```jsx
import React, { Component } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import { withTranslation } from '../../i18n/withTranslation';

class SectionErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error(`[ErrorBoundary:${this.props.name || 'unknown'}]`, error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onRetry) this.props.onRetry();
  };

  render() {
    const { t } = this.props;
    if (this.state.hasError) {
      const { fallback } = this.props;
      if (fallback) return fallback;

      return (
        <div className="flex flex-col items-center justify-center py-12 px-6">
          <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mb-4">
            <Icon name="fa-circle-exclamation" className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
            {this.props.title || t('ialab.error_boundary.title')}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-5 max-w-sm">
            {this.props.message || t('ialab.error_boundary.message')}
          </p>
          <div className="flex gap-3">
            <button
              onClick={this.handleRetry}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-petroleum to-corporate rounded-xl hover:opacity-90 transition-opacity shadow-sm"
            >
              {t('ialab.error_boundary.retry')}
            </button>
            {this.props.showReload !== false && (
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {t('ialab.error_boundary.reload')}
              </button>
            )}
          </div>
          {this.props.showDetails && this.state.error && (
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 text-left w-full max-w-md">
              <details className="text-xs">
                <summary className="cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 mb-2 font-medium">
                  {t('ialab.error_boundary.details')}
                </summary>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg font-mono text-xs overflow-auto max-h-40 border border-slate-200 dark:border-slate-700">
                  <div className="text-red-600 font-semibold mb-1">
                    {this.state.error.toString()}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 whitespace-pre-wrap">
                    {this.state.errorInfo?.componentStack}
                  </div>
                </div>
              </details>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default withTranslation(SectionErrorBoundary);
```

- [ ] **Step 2: Translate OfflineBanner.jsx**

```jsx
import React from 'react';
import useConnectivity from '../../hooks/useConnectivity';
import { useTranslation } from '../../i18n/I18nProvider';

const OfflineBanner = () => {
  const isOnline = useConnectivity();
  const { t } = useTranslation();

  if (isOnline) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[200] bg-amber-500 text-white px-4 py-2 flex items-center justify-center gap-2 text-xs font-semibold shadow-lg safe-area-top"
      role="alert"
      aria-live="assertive"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m-2.829-2.829a5 5 0 000-7.07m-4.243 4.243a1 1 0 010-1.414" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
      </svg>
      <span>{t('ialab.offline_banner.message')}</span>
    </div>
  );
};

export default React.memo(OfflineBanner);
```

- [ ] **Step 3: Translate SecurityWarningModal.jsx**

```jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import { useTranslation } from '../../i18n/I18nProvider';

const WARNING_LEVELS = (t) => ({
  1: {
    title: t('ialab.security_warning.level_1_title'),
    variant: 'warning',
    icon: 'fa-shield-halved',
  },
  2: {
    title: t('ialab.security_warning.level_2_title'),
    variant: 'warning',
    icon: 'fa-shield-halved',
  },
  3: {
    title: t('ialab.security_warning.level_3_title'),
    variant: 'danger',
    icon: 'fa-shield-alt',
  },
  penalty: {
    title: t('ialab.security_warning.penalty_title'),
    variant: 'danger',
    icon: 'fa-exclamation-triangle',
  },
});

const SecurityWarningModal = ({ isOpen, message, level = 1, onClose }) => {
  const { t } = useTranslation();
  const config = WARNING_LEVELS(t)[level] || WARNING_LEVELS(t)[1];
  const isDanger = config.variant === 'danger';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          role="alertdialog"
          aria-modal="true"
          aria-label={config.title}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md mx-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-petroleum via-petroleum-dark to-corporate rounded-t-2xl" />
            <div className="p-6">
              <div className="flex flex-col items-center text-center">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
                    isDanger
                      ? 'bg-gradient-to-br from-red-500 to-red-400 shadow-lg shadow-red-500/20'
                      : 'bg-gradient-to-br from-amber-500 to-amber-400 shadow-lg shadow-amber-500/20'
                  }`}
                >
                  <Icon name={config.icon} className="text-white text-2xl" />
                </div>
                <h3 className={`text-lg font-bold mb-2 font-montserrat ${isDanger ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {config.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 max-w-sm">
                  {message}
                </p>
                <div className="w-full flex flex-col gap-3">
                  {level < 3 && (
                    <div className="flex items-center gap-2 justify-center text-xs text-slate-600 dark:text-slate-500">
                      <Icon name="fa-info-circle" className="text-slate-600" />
                      <span>
                        {level === 1
                          ? t('ialab.security_warning.level_1_hint')
                          : level === 2
                          ? t('ialab.security_warning.level_2_hint')
                          : ''}
                      </span>
                    </div>
                  )}
                  {isDanger && level === 3 && (
                    <div className="flex items-center gap-2 justify-center text-xs text-red-500 dark:text-red-400">
                      <Icon name="fa-exclamation-circle" className="text-red-500" />
                      <span>{t('ialab.security_warning.level_3_hint')}</span>
                    </div>
                  )}
                  {level === 3 && (
                    <div className="flex items-center gap-2 justify-center text-xs text-red-400">
                      <Icon name="fa-clock" className="text-red-400" />
                      <span>{t('ialab.security_warning.lost_attempt')}</span>
                    </div>
                  )}
                  <button
                    onClick={onClose}
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                      isDanger
                        ? 'bg-gradient-to-r from-red-500 to-red-400 text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                        : 'bg-gradient-to-r from-petroleum to-corporate text-white hover:shadow-[0_0_20px_rgba(0,188,212,0.3)]'
                    }`}
                  >
                    <Icon name="fa-check" className="text-sm" />
                    {t('ialab.security_warning.understood')}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SecurityWarningModal;
```

- [ ] **Step 4: Translate Breadcrumbs.jsx (aria-label only)**

```jsx
import React, { memo } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import { useTranslation } from '../../i18n/I18nProvider';

const Breadcrumbs = memo(function Breadcrumbs({ segments, className = '', separator = '/', size = 'text-xs' }) {
  const { t } = useTranslation();
  if (!segments || segments.length === 0) return null;
  const visibleSegments = segments.slice(0, -1);
  const lastSegment = segments[segments.length - 1];

  return (
    <nav aria-label={t('ialab.breadcrumb.aria_label')} className={`mb-2 ${className}`}>
      <ol className={`flex items-center gap-1.5 ${size} text-slate-500 dark:text-slate-400`}>
        {visibleSegments.map((seg, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <li className="text-slate-300 dark:text-slate-600" aria-hidden="true">{separator}</li>
            )}
            <li>
              {seg.onClick ? (
                <button
                  onClick={seg.onClick}
                  className="font-medium text-slate-500 hover:text-petroleum dark:text-slate-400 dark:hover:text-corporate transition-colors cursor-pointer truncate max-w-[120px] inline-block align-bottom"
                >
                  {seg.icon && <Icon name={seg.icon} className="text-[9px] mr-1 inline" />}
                  {seg.label}
                </button>
              ) : seg.href ? (
                <a
                  href={seg.href}
                  className="font-medium text-slate-500 hover:text-petroleum dark:text-slate-400 dark:hover:text-corporate transition-colors truncate max-w-[120px] inline-block align-bottom"
                >
                  {seg.icon && <Icon name={seg.icon} className="text-[9px] mr-1 inline" />}
                  {seg.label}
                </a>
              ) : (
                <span className="text-slate-500 dark:text-slate-400 truncate max-w-[120px] inline-block align-bottom">
                  {seg.label}
                </span>
              )}
            </li>
          </React.Fragment>
        ))}
        {visibleSegments.length > 0 && (
          <li className="text-slate-300 dark:text-slate-600" aria-hidden="true">{separator}</li>
        )}
        <li>
          <span className="font-semibold text-petroleum dark:text-corporate truncate max-w-[120px] sm:max-w-[200px] inline-block align-bottom">
            {lastSegment.icon && <Icon name={lastSegment.icon} className="text-[9px] mr-1 inline" />}
            {lastSegment.label}
          </span>
        </li>
      </ol>
    </nav>
  );
});

export default Breadcrumbs;
```

- [ ] **Step 5: Add Phase 1 keys to es.json**

Add to `src/i18n/es.json`:

```json
  "ialab.error_boundary.title": "Sección no disponible",
  "ialab.error_boundary.message": "Ocurrió un error al cargar esta sección. Puedes intentar de nuevo.",
  "ialab.error_boundary.retry": "Reintentar",
  "ialab.error_boundary.reload": "Recargar página",
  "ialab.error_boundary.details": "Detalles del error",
  "ialab.offline_banner.message": "Sin conexión. Los cambios se guardarán cuando tengas internet.",
  "ialab.security_warning.level_1_title": "Advertencia de seguridad",
  "ialab.security_warning.level_2_title": "Segunda advertencia",
  "ialab.security_warning.level_3_title": "Última advertencia",
  "ialab.security_warning.penalty_title": "Penalización aplicada",
  "ialab.security_warning.level_1_hint": "Si cambias de ventana 2 veces más, el examen se cerrará automáticamente.",
  "ialab.security_warning.level_2_hint": "Si cambias de ventana 1 vez más, el examen se cerrará automáticamente.",
  "ialab.security_warning.level_3_hint": "El examen se cerrará al cambiar de ventana nuevamente.",
  "ialab.security_warning.lost_attempt": "Has perdido 1 intento por infracción de seguridad.",
  "ialab.security_warning.understood": "Entendido",
  "ialab.breadcrumb.aria_label": "Breadcrumb",
```

- [ ] **Step 6: Add Phase 1 keys to en.json**

Add to `src/i18n/en.json`:

```json
  "ialab.error_boundary.title": "Section unavailable",
  "ialab.error_boundary.message": "An error occurred while loading this section. You can try again.",
  "ialab.error_boundary.retry": "Retry",
  "ialab.error_boundary.reload": "Reload page",
  "ialab.error_boundary.details": "Error details",
  "ialab.offline_banner.message": "No connection. Changes will be saved when you're back online.",
  "ialab.security_warning.level_1_title": "Security warning",
  "ialab.security_warning.level_2_title": "Second warning",
  "ialab.security_warning.level_3_title": "Final warning",
  "ialab.security_warning.penalty_title": "Penalty applied",
  "ialab.security_warning.level_1_hint": "If you switch windows 2 more times, the exam will close automatically.",
  "ialab.security_warning.level_2_hint": "If you switch windows 1 more time, the exam will close automatically.",
  "ialab.security_warning.level_3_hint": "The exam will close if you switch windows again.",
  "ialab.security_warning.lost_attempt": "You have lost 1 attempt due to a security violation.",
  "ialab.security_warning.understood": "Got it",
  "ialab.breadcrumb.aria_label": "Breadcrumb",
```

- [ ] **Step 7: Run lint to verify no syntax errors**

Run: `npx eslint src/components/IALab/SectionErrorBoundary.jsx src/components/IALab/OfflineBanner.jsx src/components/IALab/SecurityWarningModal.jsx src/components/IALab/Breadcrumbs.jsx --no-error-on-unmatched-pattern 2>&1 || true`

Expected: No errors (or warnings only).

---

### Task 3: Phase 2 — Modules & Progress Components

**Files:**
- Modify: `src/components/IALab/ModuleProgressBar.jsx`
- Modify: `src/components/IALab/ModuleProgressCard.jsx`
- Modify: `src/components/IALab/IALabModuleRoadmap.jsx`
- Modify: `src/components/IALab/CourseCard.jsx`
- Modify: `src/components/IALab/CourseCatalog.jsx`
- Modify: `src/components/IALab/BadgeCard.jsx` (already has useTranslation)
- Modify: `src/components/IALab/BadgeGalleryModal.jsx`
- Modify: `src/components/IALab/CertificatePreview.jsx`
- Modify: `src/components/IALab/CertificateProgressBar.jsx`
- Modify: `src/i18n/es.json`
- Modify: `src/i18n/en.json`

**Pattern for each file:**
- Add `import { useTranslation } from '../../i18n/I18nProvider';`
- Add `const { t } = useTranslation();` at component start
- Replace each hardcoded Spanish string with `t('ialab.{component}.{key}')`

**Keys to add in es.json:**

```json
  "ialab.module_progress_bar.label": "Progreso",
  "ialab.module_progress_card.completed": "Completado",
  "ialab.module_progress_card.pending": "Pendiente",
  "ialab.module_progress_card.in_progress": "En progreso",
  "ialab.module_roadmap.title": "Tu ruta de aprendizaje",
  "ialab.module_roadmap.subtitle": "5 módulos hacia tu certificación",
  "ialab.badge_gallery.title": "Insignias",
  "ialab.badge_gallery.count": "{earned}/{total} obtenidas",
  "ialab.certificate_preview.title": "Certificado",
  "ialab.certificate_preview.view": "Ver certificado",
  "ialab.certificate_progress.label": "Progreso del certificado",
```

**Keys to add in en.json:**

```json
  "ialab.module_progress_bar.label": "Progress",
  "ialab.module_progress_card.completed": "Completed",
  "ialab.module_progress_card.pending": "Pending",
  "ialab.module_progress_card.in_progress": "In progress",
  "ialab.module_roadmap.title": "Your learning path",
  "ialab.module_roadmap.subtitle": "5 modules towards your certification",
  "ialab.badge_gallery.title": "Badges",
  "ialab.badge_gallery.count": "{earned}/{total} earned",
  "ialab.certificate_preview.title": "Certificate",
  "ialab.certificate_preview.view": "View certificate",
  "ialab.certificate_progress.label": "Certificate progress",
```

---

### Task 4: Phase 3 — Dashboard & Panels

**Files:**
- Modify: `src/components/IALab/UserCoursesDashboard.jsx` (already has useTranslation)
- Modify: `src/components/IALab/TuRutaDeHoy.jsx` (already has useTranslation)
- Modify: `src/components/IALab/GlobalSearchBar.jsx`
- Modify: `src/components/IALab/LeaderboardModal.jsx`
- Modify: `src/components/IALab/TopicResourcesModal.jsx`
- Modify: `src/components/IALab/ResourceSelector.jsx`
- Modify: `src/components/IALab/ResourceViewer.jsx` (already has useTranslation)
- Modify: `src/components/IALab/ResourceViewerModal/*.jsx` (already have useTranslation — just ensure all strings use t())
- Modify: `src/components/IALab/BenefitsSection.jsx`
- Modify: `src/i18n/es.json`
- Modify: `src/i18n/en.json`

**Keys to add in es.json:**

```json
  "ialab.global_search.placeholder": "Buscar módulos, temas, recursos...",
  "ialab.global_search.module_label": "Módulo {id}",
  "ialab.global_search.topic_label": "Tema",
  "ialab.global_search.no_results": "Sin resultados",
  "ialab.leaderboard_modal.title": "Leaderboard",
  "ialab.leaderboard_modal.empty": "Aún no hay datos en el leaderboard",
  "ialab.topic_resources.title": "Recursos del tema",
  "ialab.topic_resources.no_resources": "No hay recursos disponibles",
  "ialab.resource_selector.select": "Seleccionar recurso",
  "ialab.resource_selector.no_options": "No hay opciones disponibles",
  "ialab.benefits.title": "¿Por qué I.Alab Academic?",
  "ialab.benefits.subtitle": "Una plataforma diseñada para tu éxito académico",
```

**Keys to add in en.json:**

```json
  "ialab.global_search.placeholder": "Search modules, topics, resources...",
  "ialab.global_search.module_label": "Module {id}",
  "ialab.global_search.topic_label": "Topic",
  "ialab.global_search.no_results": "No results",
  "ialab.leaderboard_modal.title": "Leaderboard",
  "ialab.leaderboard_modal.empty": "No leaderboard data yet",
  "ialab.topic_resources.title": "Topic resources",
  "ialab.topic_resources.no_resources": "No resources available",
  "ialab.resource_selector.select": "Select resource",
  "ialab.resource_selector.no_options": "No options available",
  "ialab.benefits.title": "Why I.Alab Academic?",
  "ialab.benefits.subtitle": "A platform designed for your academic success",
```

---

### Task 5: Phase 4 — Evaluation Components

**Files:**
- Modify: `src/components/IALab/IALabEvaluationModal.jsx`
- Modify: `src/components/IALab/IALabEvaluationModalPremium.jsx`
- Modify: `src/components/IALab/IALabEvaluationResults.jsx`
- Modify: `src/components/IALab/IALabEvaluationStep1.jsx`
- Modify: `src/components/IALab/IALabEvaluationStep2.jsx`
- Modify: `src/components/IALab/IALabEvaluationStep3.jsx`
- Modify: `src/components/IALab/ExamResultViewer.jsx`
- Modify: `src/components/IALab/ChallengeResultViewer.jsx`
- Modify: `src/components/IALab/IALabQuizModal.jsx` (already has useTranslation)
- Modify: `src/i18n/es.json`
- Modify: `src/i18n/en.json`

**Pattern:** Same as Phase 1 — add `useTranslation`, replace hardcoded strings.

**Key prefix:** `ialab.evaluation.{component}.{key}`, `ialab.exam.{key}`, `ialab.challenge_result.{key}`

Example keys for es.json:
```json
  "ialab.evaluation.results.no_results": "No hay resultados disponibles",
  "ialab.evaluation.results.error": "Ocurrió un error al procesar tu evaluación",
  "ialab.evaluation.results.back": "Volver al inicio",
  "ialab.evaluation.results.wait": "Debes esperar {hours}h para intentar de nuevo",
  "ialab.evaluation.results.exam_title": "Examen Módulo {module}",
  "ialab.evaluation.step1.identify": "Identificar elementos en un escenario",
  "ialab.evaluation.step1.role": "Rol",
  "ialab.evaluation.step1.context": "Contexto",
  "ialab.evaluation.step1.task": "Tarea",
  "ialab.evaluation.step3.create_prompt": "Crear un prompt desde cero",
  "ialab.evaluation.step3.marketing_expert": "Eres un experto en marketing digital",
  "ialab.evaluation.modal.title": "Evaluación",
  "ialab.evaluation.modal.close": "Cerrar",
  "ialab.exam.viewer.title": "Resultado del examen",
  "ialab.exam.viewer.score": "Puntuación: {score}",
  "ialab.challenge_result.title": "Resultado del desafío",
  "ialab.challenge_result.score": "Puntuación: {score}%",
```

Example keys for en.json:
```json
  "ialab.evaluation.results.no_results": "No results available",
  "ialab.evaluation.results.error": "An error occurred processing your evaluation",
  "ialab.evaluation.results.back": "Back to start",
  "ialab.evaluation.results.wait": "You must wait {hours}h to try again",
  "ialab.evaluation.results.exam_title": "Exam Module {module}",
  "ialab.evaluation.step1.identify": "Identify elements in a scenario",
  "ialab.evaluation.step1.role": "Role",
  "ialab.evaluation.step1.context": "Context",
  "ialab.evaluation.step1.task": "Task",
  "ialab.evaluation.step3.create_prompt": "Create a prompt from scratch",
  "ialab.evaluation.step3.marketing_expert": "You are a digital marketing expert",
  "ialab.evaluation.modal.title": "Evaluation",
  "ialab.evaluation.modal.close": "Close",
  "ialab.exam.viewer.title": "Exam result",
  "ialab.exam.viewer.score": "Score: {score}",
  "ialab.challenge_result.title": "Challenge result",
  "ialab.challenge_result.score": "Score: {score}%",
```

---

### Task 6: Phase 5 — OVA Components

**Files:**
- Modify: `src/components/IALab/OVAEtica.jsx` (already uses useOVATranslations — add to its en dict)
- Modify: `src/components/IALab/OVABiasLab.jsx` (already has useTranslation)
- Modify: `src/components/IALab/OVABuildGPT.jsx` (already has useTranslation)
- Modify: `src/components/IALab/OVAChatGPTTools.jsx` (already has useTranslation)
- Modify: `src/components/IALab/OVAEcosystemGuide.jsx` (already has useTranslation)
- Modify: `src/components/IALab/OVAIntroPrompt.jsx` (already has useTranslation)
- Modify: `src/components/IALab/OVANotebookLab.jsx` (already has useTranslation)
- Modify: `src/components/IALab/OVANotebookPodcastGuide.jsx` (already has useTranslation)
- Modify: `src/components/IALab/OVANotebookSimulator.jsx` (already has useTranslation)
- Modify: `src/components/IALab/OVAPodcastStudio.jsx` (already has useTranslation)
- Modify: `src/components/IALab/OVARiskSimulator.jsx` (already has useTranslation)
- Modify: `src/components/IALab/OVAThumbnail.jsx`
- Modify: `src/components/IALab/QueEsPrompt_OVA_Original.jsx`
- Modify: `src/components/IALab/ReactivePromptStation.jsx`
- Modify: `src/components/IALab/IALabSynthesizer.jsx`
- Modify: `src/components/IALab/SynthesizerInput.jsx`
- Modify: `src/components/IALab/SynthesizerSkeleton.jsx` (structural — likely no strings)
- Modify: `src/components/IALab/PromptFeedback.jsx`
- Modify: `src/components/IALab/ToolTutorAccordion.jsx`
- Modify: `src/components/IALab/IALabInteractionAdvisor.jsx`
- Modify: `src/components/IALab/VoiceReader.jsx`
- Modify: `src/components/IALab/IALabTour.jsx`
- Modify: `src/components/IALab/IALabTutoriasVirtuales.jsx`
- Modify: `src/components/IALab/PDFThumbnail.jsx`
- Modify: `src/components/IALab/EthicsExplorer.jsx`
- Modify: `src/components/IALab/StudyPlannerModal.jsx`
- Modify: `src/components/IALab/AchievementToast.jsx`
- Modify: `src/components/IALab/ScreenshotProtectionOverlay.jsx`
- Modify: `src/hooks/useOVATranslations.js` (add English translations for OVAEtica)
- Modify: `src/i18n/es.json`
- Modify: `src/i18n/en.json`

**Note:** Most OVA components already have `useTranslation` imported. The task is to:
1. Ensure EVERY hardcoded Spanish string uses `t('ova.{name}.{key}')` 
2. Add any missing keys to both locale files (most already exist in en.json)

**Special case: OVAEtica.jsx and useOVATranslations.js**
This is the only OVA using `useOVATranslations`. Add English translations for the `etica` entry:

In `src/hooks/useOVATranslations.js`, find the `etica` translations object and add the `en` locale counterpart (approx 140 keys).

**Special case: IALabSynthesizer.jsx** (~37 Spanish strings)
Add `useTranslation`, replace all strings with `t('ialab.synthesizer.{key}')`.

**Special case: EthicsExplorer.jsx** (~24 Spanish strings)
Add `useTranslation`, replace all strings with `t('ialab.ethics_explorer.{key}')`.

**Special case: StudyPlannerModal.jsx** (day/month names + UI labels)
```jsx
const { t, locale } = useTranslation();
// Replace DAYS/MONTHS constants with locale-aware data:
const DAYS = locale === 'en' 
  ? ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  : ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
const MONTHS = locale === 'en'
  ? ['January','February','March','April','May','June','July','August','September','October','November','December']
  : ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
```

---

### Task 7: Phase 6 — Forum Components

**Files:**
- Modify: `src/components/IALab/IALabForumSection.jsx`
- Modify: `src/components/IALab/IALabForumOptimized.jsx`
- Add `useTranslation`, replace ~30+ hardcoded Spanish strings with `t('ialab.forum.{key}')`

**Key prefix:** `ialab.forum.{key}`

---

### Task 8: Phase 7 — Data Files

**Files:**
- Modify: `src/components/IALab/constants/moduleContent.js`
- Modify: `src/components/IALab/constants/moduleResources.js`
- Modify: `src/components/IALab/data/landingPageData.js`
- Modify: `src/components/IALab/IALabConfig.js` (if it has Spanish strings)
- Modify: `src/components/IALab/constants/sidebarData.js`

**Strategy for data files:**
Each data file gets a locale-aware selector. The data is duplicated in Spanish (default) and English.

**moduleContent.js pattern:**
```js
const CONTENT_ES = { /* existing Spanish content */ };
const CONTENT_EN = { /* English translation of same structure */ };

export const getModuleContent = (locale = 'es') => {
  return locale === 'en' ? CONTENT_EN : CONTENT_ES;
};
```

Existing imports like `getModuleContent()` need to pass locale:
```js
const { locale } = useTranslation();
const modules = getModuleContent(locale);
```

**landingPageData.js pattern:**
```js
export const getCourses = (locale) => locale === 'en' ? COURSES_EN : COURSES_ES;
export const getCategories = (locale) => locale === 'en' ? CATEGORIES_EN : CATEGORIES_ES;
// etc.
```

---

### Task 9: Verification

- [ ] **Step 1: Verify es.json is valid JSON**

Run: `node -e "JSON.parse(require('fs').readFileSync('src/i18n/es.json','utf8'))" && echo "Valid"`

- [ ] **Step 2: Verify en.json is valid JSON**

Run: `node -e "JSON.parse(require('fs').readFileSync('src/i18n/en.json','utf8'))" && echo "Valid"`

- [ ] **Step 3: Verify i18n key parity**

Run: `node -e "
const es = require('./src/i18n/es.json');
const en = require('./src/i18n/en.json');
const esKeys = Object.keys(es).sort();
const enKeys = Object.keys(en).sort();
const missingInEN = esKeys.filter(k => !enKeys.includes(k));
const missingInES = enKeys.filter(k => !esKeys.includes(k));
if(missingInEN.length) console.log('Missing in en.json:', missingInEN.join(', '));
if(missingInES.length) console.log('Missing in es.json:', missingInES.join(', '));
if(!missingInEN.length && !missingInES.length) console.log('All keys are in sync!');
"`

- [ ] **Step 4: Check lint on all modified files**

Run: `npx eslint src/components/IALab/ --no-error-on-unmatched-pattern --max-warnings 200 2>&1 | tail -20`

---

## Execution Handoff

Plan complete. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per phase, review between phases, fast iteration. Each phase produces working, testable code independently.

**2. Inline Execution** — Execute phases sequentially in this session, with checkpoints for review.

**Which approach?**
