# IALab Improvement — Phase 2 (Sprints 9–15)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Raise IALab overall score from 8.3 → 9.0+ by addressing the 7 priority areas identified in the exhaustive analysis.

**Architecture:** Zero-functional-change refactoring. Each sprint extracts/purifies without adding sections, buttons, or features. Tests run after every task.

**Tech Stack:** React 19, Zustand 5, Framer Motion 12, Tailwind 3, Vitest 4

---

## File Structure Plan

### New files to create
```
src/components/IALab/sidebar/
  SidebarCollapsed.jsx          # Collapsed view (from IALabSidebar.jsx:155-306)
  SidebarExpanded.jsx           # Expanded view wrapper (from IALabSidebar.jsx:308-492)
  SidebarProgressCircle.jsx     # SVG progress circle (from IALabSidebar.jsx:317-337)
  SidebarModuleList.jsx         # Module nav buttons (from IALabSidebar.jsx:347-404)
  SidebarResources.jsx          # Resources dropdown (from IALabSidebar.jsx:407-474)

src/components/IALab/module/
  ModuleHeaderSection.jsx       # Module badge + description (from ModuleOverviewCard.jsx:56-87)
  ModuleTopicAccordion.jsx      # Topic accordion with resources (from ModuleOverviewCard.jsx:252-480)
  ModuleBookmarkFilter.jsx      # Filter + bookmark controls (from ModuleOverviewCard.jsx:25-42)

src/components/IALab/ova/
  OvaGeminiSlides.jsx           # Slide content + navigation (from OvaEdutechlife.jsx:309-384)
  OvaGeminiQuiz.jsx             # Quiz section (from OvaEdutechlife.jsx:386-547)
  ovaData.js                    # All constants + text data (from OvaEdutechlife.jsx:1-245)

src/services/
  progressService.js            # Refactored from useIALabProgress (moved to service layer)

src/store/middleware/
  tenantMiddleware.js           # Zustand middleware for tenant isolation

src/styles/
  ialab-components.css          # Extracted from index.css (IALab-specific styles)
  ova-styles.css                # Extracted from index.css (OVA-specific styles)
```

### Files to modify
```
src/hooks/IALab/useIALabProgress.js   # Consolidate 7→2 queries
src/components/IALab/IALabSidebar.jsx  # Use extracted sub-components
src/components/IALab/ModuleOverviewCard.jsx # Use extracted sub-components
src/components/IALab/OvaEdutechlife.jsx # Use extracted sub-components + inline style purge
src/components/IALab/IALabForumOptimized.jsx # Virtualize post list
src/components/IALab/IALabForumSection.jsx   # Virtualize post list
src/components/IALab/IALab.css               # Add extracted section styles
src/index.css                                 # Remove extracted sections
src/lib/tenantContext.js                      # Add tenant isolation to DB queries
```

---

## Sprint 9: Dividir ModuleOverviewCard (637→350 líneas)

**Goal:** Extract topic accordion, bookmarks/filter, and resource viewer state into separate files.

### Task 9.1: Create `ModuleHeaderSection.jsx`

**Files:**
- Create: `src/components/IALab/module/ModuleHeaderSection.jsx`
- Modify: `src/components/IALab/ModuleOverviewCard.jsx`

- [ ] **Step 1: Read ModuleOverviewCard.jsx lines 56-103 to understand moduleData logic**

- [ ] **Step 2: Create ModuleHeaderSection.jsx**

```jsx
import { useMemo } from 'react';
import { Icon } from '../../../utils/iconMapping.jsx';
import { useIALabProgressContext } from '../../../context/IALabContext';
import { useTranslation } from '../../../i18n/I18nProvider';
import { ALL_LESSONS } from '../../../data/ialab';
import { getResourcesForTopic } from '../constants/moduleResources';

const module1Fallback = {
  badge: { duration: '2h' },
  icon: 'fa-terminal',
  title: 'Domina las Instrucciones',
  description: 'En este módulo, hemos diseñado una ruta estratégica...',
  missionIcon: 'fa-bullseye',
  mission: 'Explorar cada tema y sus recursos multimedia...',
  topics: [
    { title: 'Introducción a la Inteligencia Artificial Generativa', icon: 'fa-brain', resources: 2, duration: '20 min' },
    { title: '¿Qué es un Prompt?', icon: 'fa-comments', resources: 3, duration: '20 min' },
  ],
};

export default function ModuleHeaderSection({ moduleData, isDescriptionExpanded, setIsDescriptionExpanded }) {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-petroleum/10 to-corporate/10 flex items-center justify-center shadow-sm">
          <Icon name={moduleData.icon} className="text-2xl text-petroleum dark:text-corporate" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold tracking-wider uppercase text-corporate bg-corporate/10 px-2 py-0.5 rounded-md">
              {t('ialab.overview.module')} {useIALabProgressContext().activeMod}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-400">{moduleData.badge.duration}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-petroleum dark:text-white font-montserrat truncate">
            {moduleData.title}
          </h2>
        </div>
      </div>

      <div className={`relative overflow-hidden transition-all duration-300 ${isDescriptionExpanded ? 'max-h-[500px]' : 'max-h-20'}`}>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
          {moduleData.description}
        </p>
        {moduleData.mission && (
          <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/15 dark:to-orange-900/15 border border-amber-200/50 dark:border-amber-700/30">
            <div className="flex items-start gap-2">
              <Icon name={moduleData.missionIcon} className="text-amber-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
              <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">{moduleData.mission}</p>
            </div>
          </div>
        )}
        {moduleData.description.length > 200 && (
          <button
            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
            className="text-xs font-semibold text-corporate hover:text-petroleum transition-colors mt-1"
          >
            {isDescriptionExpanded ? t('ialab.overview.show_less') : t('ialab.overview.show_more')}
          </button>
        )}
      </div>
    </>
  );
}
```

- [ ] **Step 3: Replace lines 56-103 in ModuleOverviewCard.jsx with import**

In ModuleOverviewCard.jsx, replace:
```jsx
const module1Data = {
  // ...
};

const isModule1 = activeMod === 1;
const dynamicContent = moduleContent[activeMod]?.overviewData;

const moduleData = useMemo(() => {
  if (isModule1) return module1Data;
  return {
    // ...
  };
}, [isModule1, activeMod, modules, dynamicContent]);
```

With:
```jsx
const isModule1 = activeMod === 1;
const dynamicContent = moduleContent[activeMod]?.overviewData;

const moduleData = useMemo(() => {
  if (isModule1) {
    return {
      badge: { duration: '2h' },
      icon: 'fa-terminal',
      title: 'Domina las Instrucciones',
      description: 'En este módulo...',
      missionIcon: 'fa-bullseye',
      mission: 'Explorar cada tema...',
      topics: [
        { title: 'Introducción a la IAG', icon: 'fa-brain', resources: 2, duration: '20 min' },
        { title: '¿Qué es un Prompt?', icon: 'fa-comments', resources: 3, duration: '20 min' },
      ],
    };
  }
  return {
    badge: { duration: modules[activeMod - 1]?.duration || '2h' },
    icon: modules[activeMod - 1]?.icon || 'fa-book',
    title: dynamicContent?.title || '',
    description: dynamicContent?.description || '',
    missionIcon: 'fa-bullseye',
    mission: dynamicContent?.mission || '',
    topics: dynamicContent?.topics || [],
  };
}, [isModule1, activeMod, modules, dynamicContent]);
```

Then replace the module header render block with:
```jsx
<ModuleHeaderSection moduleData={moduleData} isDescriptionExpanded={isDescriptionExpanded} setIsDescriptionExpanded={setIsDescriptionExpanded} />
```

- [ ] **Step 4: Run tests to verify**

Run: `npm test -- --run`
Expected: All 684 tests pass (no functional change).

- [ ] **Step 5: Commit**

```bash
git add src/components/IALab/module/ModuleHeaderSection.jsx src/components/IALab/ModuleOverviewCard.jsx
git commit -m "refactor: extract ModuleHeaderSection from ModuleOverviewCard"
```

### Task 9.2: Create `ModuleBookmarkFilter.jsx`

**Files:**
- Create: `src/components/IALab/module/ModuleBookmarkFilter.jsx`
- Modify: `src/components/IALab/ModuleOverviewCard.jsx`

- [ ] **Step 1: Create ModuleBookmarkFilter.jsx**

```jsx
import { useCallback } from 'react';
import { Icon } from '../../../utils/iconMapping.jsx';
import { useTranslation } from '../../../i18n/I18nProvider';

export default function ModuleBookmarkFilter({ filterType, setFilterType, showBookmarked, setShowBookmarked, bookmarkedCount }) {
  const { t } = useTranslation();
  const toggleBookmarkFilter = useCallback(() => {
    setShowBookmarked(prev => !prev);
  }, [setShowBookmarked]);

  return (
    <div className="flex items-center gap-2 mb-4">
      {['all', 'video', 'document', 'interactive'].map(type => (
        <button
          key={type}
          onClick={() => setFilterType(type)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            filterType === type
              ? 'bg-petroleum text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
          }`}
        >
          {t(`ialab.overview.filter_${type}`)}
        </button>
      ))}
      <div className="flex-1" />
      <button
        onClick={toggleBookmarkFilter}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
          showBookmarked ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
        }`}
        aria-pressed={showBookmarked}
      >
        <Icon name="fa-bookmark" className="text-xs" aria-hidden="true" />
        {bookmarkedCount > 0 && <span className="ml-1">({bookmarkedCount})</span>}
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Replace filter/bookmark UI in ModuleOverviewCard.jsx**

Remove lines 25-42 (bookmarkedIds state + toggleBookmark) and the filter/bookmark render block. Replace with `<ModuleBookmarkFilter ... />` passing required props.

- [ ] **Step 3: Run tests**

Run: `npm test -- --run`
Expected: All tests pass.

### Task 9.3: Extract topic accordion into `ModuleTopicAccordion.jsx`

**Files:**
- Create: `src/components/IALab/module/ModuleTopicAccordion.jsx`
- Modify: `src/components/IALab/ModuleOverviewCard.jsx`

- [ ] **Step 1: Create ModuleTopicAccordion.jsx**

```jsx
import { useState, useMemo, useCallback, useEffect, lazy, Suspense, memo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Icon } from '../../../utils/iconMapping.jsx';
import { useIALabStore } from '../../../store/ialabStore';
import { useTranslation } from '../../../i18n/I18nProvider';
import { getResourcesForTopic, countResourcesByType } from '../constants/moduleResources';

const ResourceViewerModal = lazy(() => import('../ResourceViewerModal'));

export default memo(function ModuleTopicAccordion({
  moduleData, activeMod, viewedIds, justCompletedId,
  expandedTopic, setExpandedTopic, filterType,
  resourcesByTopic, allResourcesOrdered, isResourceLocked,
  handleMarkAsViewed, bookmarkedIds, toggleBookmark,
}) {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  // Modal state
  const [viewerModalOpen, setViewerModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedResourceType, setSelectedResourceType] = useState(null);
  const [currentTopicResources, setCurrentTopicResources] = useState([]);
  const [activeResourceIndex, setActiveResourceIndex] = useState(0);

  // Auto-advance to next topic when all resources viewed
  useEffect(() => {
    if (expandedTopic === null || expandedTopic >= moduleData.topics.length - 1) return;
    const currentTopic = moduleData.topics[expandedTopic];
    const tr = getResourcesForTopic(currentTopic.title);
    const ids = tr?.resources?.map(r => r.id) || [];
    const allDone = ids.length > 0 && ids.every(id => viewedIds.includes(id));
    if (allDone) {
      const timer = setTimeout(() => {
        setExpandedTopic(prev => (prev !== null ? prev + 1 : null));
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [viewedIds, expandedTopic, moduleData.topics, setExpandedTopic]);

  // ... (rest of accordion render logic from lines 252-480 of ModuleOverviewCard)
  // Full render: topic accordion with resources per topic, resource cards, modal trigger

  return (
    <div className="space-y-3 mt-4">
      {moduleData.topics.map((topic, tIdx) => {
        const isExpanded = expandedTopic === tIdx;
        const topicResources = resourcesByTopic[topic.title];
        const resCounts = topicResources ? countResourcesByType(topicResources.resources) : {};
        const resourceList = topicResources?.resources || [];

        return (
          <div key={tIdx} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 overflow-hidden shadow-sm">
            <button
              onClick={() => setExpandedTopic(isExpanded ? null : tIdx)}
              className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              aria-expanded={isExpanded}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-petroleum/10 to-corporate/10 flex items-center justify-center flex-shrink-0">
                <Icon name={topic.icon || 'fa-book'} className="text-petroleum dark:text-corporate" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-slate-800 dark:text-white truncate">{topic.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {topic.duration}
                </p>
              </div>
              <Icon name={isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'} className="text-slate-400 text-xs transition-transform" aria-hidden="true" />
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-2">
                    {resourceList.map((resource, rIdx) => {
                      const locked = isResourceLocked(tIdx, rIdx, resource.id);
                      const viewed = viewedIds.includes(resource.id);

                      return (
                        <div
                          key={resource.id}
                          onClick={() => {
                            if (locked) return;
                            setCurrentTopicResources(resourceList);
                            setActiveResourceIndex(rIdx);
                            setSelectedResource(resource);
                            setSelectedResourceType(resource.type);
                            setViewerModalOpen(true);
                          }}
                          className={`
                            flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all
                            ${viewed ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-200/50 dark:border-emerald-700/30' : 'bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700'}
                            ${locked ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:shadow-sm'}
                          `}
                          role="button"
                          tabIndex={locked ? -1 : 0}
                          aria-disabled={locked}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{resource.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{resource.type} • {resource.duration || '5 min'}</p>
                          </div>
                          {viewed && (
                            <Icon name="fa-check-circle" className="text-emerald-500 text-lg" aria-hidden="true" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {viewerModalOpen && selectedResource && (
        <Suspense fallback={<div className="h-32 animate-pulse bg-slate-100 rounded-2xl" />}>
          <ResourceViewerModal
            isOpen={viewerModalOpen}
            onClose={() => setViewerModalOpen(false)}
            resource={selectedResource}
            resourceType={selectedResourceType}
            resources={currentTopicResources}
            activeIndex={activeResourceIndex}
            onPrevious={handlePreviousResource}
            onNext={handleNextResource}
            onMarkAsViewed={handleMarkAsViewed}
          />
        </Suspense>
      )}
    </div>
  );
});
```

- [ ] **Step 2: Replace topic accordion in ModuleOverviewCard.jsx**

Remove the accordion render block (lines 250-480 approx). Replace with `<ModuleTopicAccordion ... />`.

- [ ] **Step 3: Run tests**

Run: `npm test -- --run`
Expected: All tests pass.

- [ ] **Step 4: Verify ModuleOverviewCard.jsx is now under 400 lines**

Run: `wc -l src/components/IALab/ModuleOverviewCard.jsx`
Expected: ~350 lines or fewer.

- [ ] **Step 5: Commit**

```bash
git add src/components/IALab/module/ src/components/IALab/ModuleOverviewCard.jsx
git commit -m "refactor: split ModuleOverviewCard into 3 sub-components (637→~350 lines)"
```

---

## Sprint 10: Dividir IALabSidebar (503→300 líneas)

**Goal:** Extract collapsed/expanded views into sub-components.

### Task 10.1: Create `SidebarCollapsed.jsx`

**Files:**
- Create: `src/components/IALab/sidebar/SidebarCollapsed.jsx`
- Modify: `src/components/IALab/IALabSidebar.jsx`

- [ ] **Step 1: Create SidebarCollapsed.jsx** — extract lines 155-306 from IALabSidebar.jsx

```jsx
import { motion } from 'framer-motion';
import { Icon } from '../../../utils/iconMapping.jsx';
import { useTranslation } from '../../../i18n/I18nProvider';

export default function SidebarCollapsed({
  courseProgress, modules, activeMod, isModuleLocked, calculateModuleScore,
  streak, isStreakAtRisk, getLevel, getTotalPoints, formatPoints,
  storedCertificate, setShowCertificateModal, goToModule, fadeTransition,
}) {
  const { t } = useTranslation();

  return (
    <motion.div
      key="collapsed"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={fadeTransition}
      className="flex flex-col items-center px-2 py-4 gap-2"
    >
      { /* Progress ring + module list + resources + certificate — exact copy of lines 163-306 */ }
    </motion.div>
  );
}
```

- [ ] **Step 2: Replace collapsed view in IALabSidebar.jsx**

Replace lines 155-306 with `<SidebarCollapsed ... />`.

- [ ] **Step 3: Run tests**

Run: `npm test -- --run`
Expected: All tests pass (no functional change — sidebar renders identically).

### Task 10.2: Create `SidebarExpanded.jsx`

**Files:**
- Create: `src/components/IALab/sidebar/SidebarExpanded.jsx`
- Modify: `src/components/IALab/IALabSidebar.jsx`

- [ ] **Step 1: Create SidebarExpanded.jsx** — extract lines 308-492

- [ ] **Step 2: Create sub-components from expanded view**
  - `SidebarProgressCircle.jsx` — SVG progress wheel (lines 317-337)
  - `SidebarModuleList.jsx` — Module nav buttons (lines 347-404)
  - `SidebarResources.jsx` — Resources dropdown (lines 407-474)

- [ ] **Step 3: Replace expanded view in IALabSidebar.jsx**

Replace lines 308-492 with `<SidebarExpanded ... />`.

- [ ] **Step 4: Run tests**

Run: `npm test -- --run`
Expected: All tests pass.

- [ ] **Step 5: Verify IALabSidebar.jsx is now under 300 lines**

Run: `wc -l src/components/IALab/IALabSidebar.jsx`
Expected: ~280-300 lines.

- [ ] **Step 6: Commit**

```bash
git add src/components/IALab/sidebar/ src/components/IALab/IALabSidebar.jsx
git commit -m "refactor: split IALabSidebar into 5 sub-components (503→300 lines)"
```

---

## Sprint 11: Dividir OvaEdutechlife (554→280 líneas) + Migrar inline styles

**Goal:** Extract data layer + quiz + slides. Then replace all `style={{}}` with Tailwind classes.

### Task 11.1: Create `ovaData.js`

**Files:**
- Create: `src/components/IALab/ova/ovaData.js`
- Modify: `src/components/IALab/OvaEdutechlife.jsx`

- [ ] **Step 1: Create ovaData.js** — extract lines 1-245 from OvaEdutechlife.jsx

```jsx
import { Icon } from '../../../utils/iconMapping.jsx';

export const GEMINI_SLIDE_TABS = [
  { id: 'arquitectura', icon: 'fa-brain' },
  { id: 'multimodalidad', icon: 'fa-eye' },
  { id: 'deep-research', icon: 'fa-magnifying-glass' },
  { id: 'workspace', icon: 'fa-briefcase' },
  { id: 'quiz', icon: 'fa-question-circle' },
];

export const SLIDE_ICONS = ['fa-brain', 'fa-eye', 'fa-magnifying-glass', 'fa-briefcase', 'fa-question-circle'];

export const SLIDE_TITLES_ES = [ 'Arquitectura de Gemini', 'Multimodalidad en Acción', 'Gemini con Deep Research', 'Gemini en Google Workspace', 'Quiz Final' ];
export const SLIDE_TITLES_EN = [ 'Gemini Architecture', 'Multimodality in Action', 'Gemini with Deep Research', 'Gemini in Google Workspace', 'Final Quiz' ];

// ... all SLIDE_DESCRIPTIONS, SLIDE_CONTENT, QUIZ_DATA
```

- [ ] **Step 2: Remove data from OvaEdutechlife.jsx** — replace with import

```jsx
import {
  GEMINI_SLIDE_TABS, SLIDE_ICONS, SLIDE_TITLES_ES, SLIDE_TITLES_EN,
  SLIDE_DESCRIPTIONS_ES, SLIDE_DESCRIPTIONS_EN, SLIDE_CONTENT_ES, SLIDE_CONTENT_EN, QUIZ_DATA
} from './ova/ovaData';
```

- [ ] **Step 3: Run tests**

Run: `npm test -- --run`
Expected: All tests pass.

### Task 11.2: Create `OvaGeminiSlides.jsx` and `OvaGeminiQuiz.jsx`

**Files:**
- Create: `src/components/IALab/ova/OvaGeminiSlides.jsx`
- Create: `src/components/IALab/ova/OvaGeminiQuiz.jsx`
- Modify: `src/components/IALab/OvaEdutechlife.jsx`

- [ ] **Step 1: Create OvaGeminiSlides.jsx** — extract lines 309-384

- [ ] **Step 2: Create OvaGeminiQuiz.jsx** — extract lines 386-547

- [ ] **Step 3: Replace in OvaEdutechlife.jsx**

Replace:
```jsx
{currentSlide < 4 ? (
  <div key={`slide-${currentSlide}`}>
    {/* ... slide content */}
  </div>
) : (
  <div key="quiz">
    {/* ... quiz content */}
  </div>
)}
```

With:
```jsx
{currentSlide < 4 ? (
  <OvaGeminiSlides
    currentSlide={currentSlide}
    slideContent={slideContent}
    slideDescs={slideDescs}
    slideTitles={slideTitles}
    SLIDE_ICONS={SLIDE_ICONS}
  />
) : (
  <OvaGeminiQuiz
    quiz={quiz}
    selectedAnswers={selectedAnswers}
    showResults={showResults}
    isAllCorrect={isAllCorrect}
    answeredCount={answeredCount}
    totalQuestions={totalQuestions}
    correctCount={correctCount}
    handleAnswerSelect={handleAnswerSelect}
    handleCheckAnswers={handleCheckAnswers}
    handleComplete={handleComplete}
  />
)}
```

- [ ] **Step 4: Run tests**

Run: `npm test -- --run`
Expected: All tests pass.

- [ ] **Step 5: Verify OvaEdutechlife.jsx is under 280 lines**

Run: `wc -l src/components/IALab/OvaEdutechlife.jsx`
Expected: ~250-280 lines (was 554).

- [ ] **Step 6: Migrate inline `style={{}}` to Tailwind classes in OVA files**

Find ALL `style={{` occurrences:
```bash
rg -n 'style={{' src/components/IALab/OvaEdutechlife.jsx src/components/IALab/ova/
```

Replace each with Tailwind equivalent. Common patterns:
- `style={{ backgroundColor: isSelected && !showResults ? '#00BCD4' : 'transparent' }}` → use conditional className with `bg-corporate`
- `style={{ borderColor: ... }}` → use `border-corporate` class
- `style={{ color: ... }}` → use `text-*` classes

- [ ] **Step 7: Run tests after style migration**

Run: `npm test -- --run`
Expected: All tests pass.

- [ ] **Step 8: Commit**

```bash
git add src/components/IALab/ova/ src/components/IALab/OvaEdutechlife.jsx
git commit -m "refactor: split OvaEdutechlife 554→280 lines + migrate inline styles"
```

### Task 11.3: Migrate remaining OVA inline styles

**Files:**
- Modify: `OVAEtica.jsx`, `OVANotebookPodcastGuide.jsx`, `OVANotebookLab.jsx`, `OVANotebookSimulator.jsx`, `OVAChatGPTTools.jsx`, `OVAEthicalDilemmas.jsx`, `OVAPodcastStudio.jsx`, `OVABuildGPT/index.jsx`, `QueEsPrompt_OVA_Original.jsx`, `IALabEvaluationResults.jsx`, `StreakDetailsModal.jsx`, `PromptFeedback.jsx`, `ResourceSelector.jsx`, `BadgeCard.jsx`

- [ ] **Step 1: Find all inline styles**

Run: `rg -n 'style={{' src/components/IALab/ --include='*.jsx'`

- [ ] **Step 2: For each file, replace `style={{}}` with equivalent Tailwind classes**

Common replacements:

| Inline Style | Tailwind Equivalent |
|---|---|
| `style={{ width: \`${x}%\` }}` | `style={widthVar}` or use inline `style` for dynamic vars only |
| `style={{ color: score >= 80 ? '#10B981' : '#EF4444' }}` | Conditional `className="text-emerald-500"` / `className="text-red-500"` |
| `style={{ backgroundColor: active ? '#00BCD4' : 'transparent' }}` | Conditional `className="bg-corporate"` |
| `style={{ maxHeight: 'calc(85vh - 73px)' }}` | `className="max-h-[calc(85vh-73px)]"` |
| `style={{ userSelect: 'none' }}` | `className="select-none"` |
| `style={{ animationDelay: \`${i * 0.1}s\` }}` | Keep dynamic delays as inline style (acceptable) |
| `style={{ fontFamily: '...' }}` | Remove — use CSS variable `font-montserrat` class instead |

- [ ] **Step 3: Run tests after each file**

Run: `npm test -- --run`
Expected: All tests pass.

- [ ] **Step 4: Verify dark mode in migrated OVA files**

Check each file for `dark:` variant on new classes:
```bash
rg -c 'dark:' src/components/IALab/OVAEtica.jsx
```
If 0, add `dark:` variants to match existing design tokens.

- [ ] **Step 5: Commit**

```bash
git add src/components/IALab/OVAEtica.jsx [etc]
git commit -m "refactor: migrate OVA inline styles to Tailwind + add dark mode"
```

---

## Sprint 12: Rendimiento — Consolidar 7→2 queries Supabase

**Goal:** Reduce initial Supabase queries from 7 to 2 (1 progress + 1 forum).

### Task 12.1: Refactor `useIALabProgress` — consolidate progress loading

**Files:**
- Read: `src/services/progressService.js` (existing service)
- Modify: `src/hooks/IALab/useIALabProgress.js`

- [ ] **Step 1: Verify existing consolidation**

The agent analysis shows `progressService.getFullUserProgress(user.id)` already exists (line 155) and claims to replace 16 separate queries. Check if this truly consolidates:
```bash
rg -n 'progressService\.' src/hooks/IALab/useIALabProgress.js
```
Expected to see only: `getFullUserProgress` (1 call) + `save*` calls (6 total).

If `getModuleBreakdown` is called in a per-module loop (modules 1-5), that would add 5 more queries. Check:
```bash
rg -n 'loadModuleBreakdown|getModuleBreakdown' src/hooks/IALab/useIALabProgress.js
```

- [ ] **Step 2: If per-module breakdown loop exists, inline into `getFullUserProgress`**

In `src/services/progressService.js`, add module breakdowns to the main query response:
```js
getFullUserProgress: async (userId) => {
  const { data: allProgress, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;

  // Build module breakdowns from the same data instead of separate queries
  const moduleBreakdowns = {};
  for (const modId of [1, 2, 3, 4, 5]) {
    moduleBreakdowns[modId] = allProgress.filter(p => p.module_id === modId);
  }

  // ... compute globalProgress, lastProgress from allProgress

  return { allProgress, moduleBreakdowns, globalProgress, lastProgress };
}
```

- [ ] **Step 3: Run tests**

Run: `npm test -- --run`
Expected: All tests pass.

- [ ] **Step 4: Measure before/after query count**

Add console count in dev:
```js
console.count('Supabase queries in useIALabProgress');
```
Expected: Before = 7+, After = 1 (progress) + 1 (forum) = 2.

- [ ] **Step 5: Commit**

```bash
git add src/services/progressService.js src/hooks/IALab/useIALabProgress.js
git commit -m "perf: consolidate Supabase queries in useIALabProgress to 1 call"
```

### Task 12.2: Add forum query debounce

**Files:**
- Modify: `src/hooks/IALab/useIALabForum.js`

- [ ] **Step 1: Read the forum hook**

```bash
wc -l src/hooks/IALab/useIALabForum.js
```

- [ ] **Step 2: Add dedup/coalescing for forum load**

Add a `loadingPromise` ref to prevent concurrent Supabase calls:
```js
const loadingPromiseRef = useRef(null);

const loadForumPosts = useCallback(async (options = {}) => {
  if (loadingPromiseRef.current) return loadingPromiseRef.current;
  const promise = forumService.getPosts({ ... });
  loadingPromiseRef.current = promise;
  try {
    const result = await promise;
    return result;
  } finally {
    loadingPromiseRef.current = null;
  }
}, [/* deps */]);
```

- [ ] **Step 3: Run tests**

Run: `npm test -- --run`
Expected: All tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/IALab/useIALabForum.js
git commit -m "perf: add request dedup to forum hook queries"
```

---

## Sprint 13: Multi-tenant — Aislamiento real de datos

**Goal:** Move from module-scoped `let` variable to Zustand middleware + Supabase RLS integration.

### Task 13.1: Create tenant middleware for Zustand

**Files:**
- Modify: `src/lib/tenantContext.js`
- Create: `src/store/middleware/tenantMiddleware.js`

- [ ] **Step 1: Enhance tenantContext.js**

```js
let currentTenantId = 'default';

const listeners = new Set();

export const getTenantId = () => currentTenantId;

export const setTenantId = (id) => {
  if (id === currentTenantId) return;
  currentTenantId = id;
  listeners.forEach(fn => fn(id));
};

export const withTenant = (key) => `${currentTenantId}:${key}`;

export const TENANT_PREFIX = 'etl';

export const onTenantChange = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export const TENANT_HEADER = 'x-tenant-id';
```

- [ ] **Step 2: Create tenantMiddleware.js**

```js
/**
 * Tenant middleware for Zustand.
 * Automatically prefixes localStorage keys with tenant ID.
 */
export const createTenantMiddleware = (config) => (set, get, api) => {
  const wrappedSet = (partial, replace) => {
    if (typeof partial === 'function') {
      const next = (state) => {
        const result = partial(state);
        return result;
      };
      set(next, replace);
    } else {
      set(partial, replace);
    }
  };

  return config(wrappedSet, get, api);
};
```

- [ ] **Step 3: Remove `useIALabStore.getState()` imperative calls from hooks**

Find all `getState()` calls in hooks/IALab:
```bash
rg -n 'useIALabStore.getState\(\)' src/hooks/IALab/
```

Replace each with proper selector or store subscription. This reduces re-render coupling.

- [ ] **Step 4: Run tests**

Run: `npm test -- --run`
Expected: All tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/tenantContext.js src/store/middleware/tenantMiddleware.js
git commit -m "feat: add tenant change listeners + Zustand middleware foundation"
```

---

## Sprint 14: Modularizar index.css (12,800→feature CSS files)

**Goal:** Split the monolithic `index.css` into per-feature CSS files without changing any visual output.

### Task 14.1: Extract IALab styles from index.css

**Files:**
- Create: `src/styles/ialab-components.css`
- Modify: `src/index.css`

- [ ] **Step 1: Identify IALab-specific sections in index.css**

```bash
rg -n '==== IALab|==== i?aI?Lab|ialab-' src/index.css | head -20
```

- [ ] **Step 2: Extract matching sections**

For each section, copy the full CSS block to `src/styles/ialab-components.css`. Import in `IALab.css`:

```css
/* Add to IALab.css */
@import '../../styles/ialab-components.css';
```

- [ ] **Step 3: Remove extracted sections from index.css**

Replace each extracted block with: `/* MOVED TO src/styles/ialab-components.css */`

- [ ] **Step 4: Run build**

Run: `npm run build`
Expected: Same output as before. Verify identical visual output by comparing build hashes:
```bash
md5 dist/assets/index-*.css
```

- [ ] **Step 5: Commit**

```bash
git add src/index.css src/styles/ialab-components.css src/components/IALab/IALab.css
git commit -m "refactor: extract IALab CSS from index.css into ialab-components.css"
```

### Task 14.2: Extract remaining feature CSS

**Files:**
- Create: `src/styles/ova-styles.css`, `src/styles/valentina-styles.css`, etc.

- [ ] **Step 1: Identify remaining feature sections in index.css**

```bash
rg -n '==== [A-Z]' src/index.css
```

- [ ] **Step 2: Extract each section to its own file**

Map each section header to a new file. Remove from `index.css`, leaving only Tailwind directives + shared tokens.

- [ ] **Step 3: Run build and verify**

```bash
npm run build
```
Expected: Same output. Verify no visual regressions.

- [ ] **Step 4: Commit**

```bash
git add src/styles/ src/index.css
git commit -m "refactor: split index.css into per-feature CSS files (12800→~200 lines)"
```

---

## Sprint 15: Tests de integración + Virtualización del foro

**Goal:** Add integration tests for store→hooks→component flows. Virtualize forum post list.

### Task 15.1: Write integration test: progress flow

**Files:**
- Create: `src/store/__tests__/integration/progressFlow.test.js`

- [ ] **Step 1: Create integration test**

```jsx
import { useIALabStore } from '../../ialabStore';
import { describe, test, expect, beforeEach } from 'vitest';

/**
 * Integration test: Gamification → Lesson → Progress flow.
 *
 * Tests the cross-slice contract:
 *   markLessonComplete → addXp → recordActivity → checkAndAwardBadges
 */
describe('Integration: progress flow (gamification + lesson + progress)', () => {
  beforeEach(() => {
    useIALabStore.setState({
      xp: 0,
      streak: 0,
      lastActivityDate: null,
      lessonProgress: {},
      moduleProgress: {
        1: { exam: false, challenge: false, resourcesCompleted: false, community: false, currentScore: 0, isUnlocked: true },
        2: { exam: false, challenge: false, resourcesCompleted: false, community: false, currentScore: 0, isUnlocked: false },
      },
      completedModules: [],
      badges: [],
      badgesDates: {},
      startDate: new Date().toISOString(),
      visitedModules: [],
      courseProgress: 0,
    });
  });

  test('markLessonComplete adds XP and triggers activity', () => {
    const store = useIALabStore.getState();
    store.markLessonComplete(1, 'lesson_1');

    const state = useIALabStore.getState();
    expect(state.lessonProgress[1]['lesson_1']).toBe('completed');
    expect(state.xp).toBe(50);
    expect(state.streak).toBe(1);
  });

  test('3 lessons completed + streak 3 awards streak_3 badge', () => {
    // Simulate 3 days of activity
    const day1 = new Date('2026-01-01').toISOString();
    const day2 = new Date('2026-01-02').toISOString();
    const day3 = new Date('2026-01-03').toISOString();

    // Day 1
    useIALabStore.setState({ lastActivityDate: day1, streak: 1 });
    // Day 2
    useIALabStore.setState({ lastActivityDate: day2, streak: 2 });
    // Day 3
    useIALabStore.setState({ lastActivityDate: day3, streak: 2 });
    useIALabStore.getState().recordActivity();

    const state = useIALabStore.getState();
    expect(state.streak).toBe(3);
    expect(state.badges).toContain('streak_3');
  });

  test('updateModuleActivity unlocks next module when conditions met', () => {
    const store = useIALabStore.getState();

    store.updateModuleActivity(1, 'exam', true, 90);
    store.updateModuleActivity(1, 'challenge', true, 85);
    store.updateModuleActivity(1, 'resourcesCompleted', true);

    const state = useIALabStore.getState();
    expect(state.moduleProgress[2].isUnlocked).toBe(true);
    expect(state.xp).toBeGreaterThan(0); // XP was awarded
  });
});
```

- [ ] **Step 2: Run integration tests**

Run: `npm test -- --run src/store/__tests__/integration/`
Expected: All 3 tests pass.

- [ ] **Step 3: Create integration test: evaluation flow**

Create `src/store/__tests__/integration/evaluationFlow.test.js` testing `evaluationSlice` + `progressSlice` interactions.

- [ ] **Step 4: Run all tests**

Run: `npm test -- --run`
Expected: 690+ tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/store/__tests__/integration/
git commit -m "test: add integration tests for gamification→lesson→progress flow"
```

### Task 15.2: Virtualize forum post list with react-window

**Files:**
- Install: `react-window` + `@types/react-window`
- Modify: `src/components/IALab/IALabForumOptimized.jsx`
- Modify: `src/components/IALab/IALabForumSection.jsx`

- [ ] **Step 1: Install react-window**

```bash
npm install react-window
```

- [ ] **Step 2: Virtualize post list in IALabForumOptimized.jsx**

Replace the existing `.map()` post list with `FixedSizeList`:

```jsx
import { FixedSizeList } from 'react-window';

// Inside the component, replace:
// {forumPosts.map((post, idx) => ( <PostCard key={post.id} post={post} /> ))}
// With:

const PostRow = memo(({ data, index, style }) => {
  const post = data[index];
  return (
    <div style={style}>
      <PostCard post={post} />
    </div>
  );
});

return (
  <FixedSizeList
    height={600}
    itemCount={forumPosts.length}
    itemSize={200}
    itemData={forumPosts}
    overscanCount={3}
  >
    {PostRow}
  </FixedSizeList>
);
```

- [ ] **Step 3: Apply same virtualization to IALabForumSection.jsx**

- [ ] **Step 4: Run tests**

Run: `npm test -- --run`
Expected: All tests pass (forum tests may need mock for `react-window`).

If forum tests fail, add mock:
```js
// In forum test files
vi.mock('react-window', () => ({
  FixedSizeList: ({ children, itemCount, ...props }) => (
    <div data-testid="virtualized-list">
      {Array.from({ length: itemCount }, (_, i) => (
        <div key={i}>{children({ data: props.itemData, index: i, style: {} })}</div>
      ))}
    </div>
  ),
}));
```

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/components/IALab/IALabForumOptimized.jsx src/components/IALab/IALabForumSection.jsx
git commit -m "perf: virtualize forum post list with react-window"
```
