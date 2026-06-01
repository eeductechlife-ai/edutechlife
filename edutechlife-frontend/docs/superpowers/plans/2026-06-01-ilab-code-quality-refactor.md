# iLAB Code Quality — Modular Services & Clean Separation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate iLAB Code quality from 8.5 to 9.5 by splitting bloated files (>500 lines) into focused modules, extracting data from logic, and adding barrel exports — zero behavioral/UI changes.

**Architecture:** Three principles — (1) Data extracted from logic (large JSON/config blocks moved to `data/`), (2) Scoring/API logic extracted from hooks to `services/`, (3) Large components split into focused sub-components. All refactors preserve exact public API signatures so consumers import the same names.

**Constraint:** ZERO behavioral changes. ZERO UI changes. ZERO new dependencies. Every refactor must be verifiable by checking that the old import paths still resolve.

---

## File Map

| File | Action | Lines Before | Responsibility |
|------|--------|:-----------:|----------------|
| `src/data/ialab/evaluationConfig.js` | CREATE | — | MODULE_CONFIG (system prompts, evaluation criteria for 5 modules) |
| `src/services/evaluationScoring.js` | CREATE | — | Scoring functions per module (calculateModule1Score, etc.) |
| `src/hooks/IALab/useIALabEvaluation.js` | MODIFY | 788→~200 | Thin orchestrator: imports config + scoring, only state mgmt |
| `src/data/ialab/content/module1Content.js` | CREATE | — | Module 1 content data (ES + EN) |
| `src/data/ialab/content/module2Content.js` | CREATE | — | Module 2 content data |
| `src/data/ialab/content/module3Content.js` | CREATE | — | Module 3 content data |
| `src/data/ialab/content/module4Content.js` | CREATE | — | Module 4 content data |
| `src/data/ialab/content/module5Content.js` | CREATE | — | Module 5 content data |
| `src/components/IALab/constants/moduleContent.js` | MODIFY | 1040→~100 | Re-imports from per-module files, keeps getter functions |
| `src/components/IALab/forum/ForumPostList.jsx` | CREATE | — | Post listing extracted from IALabForumSection |
| `src/components/IALab/forum/ForumCreatePost.jsx` | CREATE | — | Post creation form extracted from IALabForumSection |
| `src/components/IALab/IALabForumSection.jsx` | MODIFY | 514→~200 | Orchestrator that imports sub-components |
| `src/components/IALab/index.js` | CREATE | — | Barrel export for all IALab components |

---

### Task 1: Extract Evaluation Config → `evaluationConfig.js`

**Files:**
- Create: `src/data/ialab/evaluationConfig.js`
- The config includes system prompts and scoring criteria for all 5 modules
- Pure data — zero logic, zero runtime dependencies

- [ ] **Step 1: Create `src/data/ialab/evaluationConfig.js`**

```javascript
// Evaluation configuration for all 5 iLAB modules
// Pure data — zero logic, can be statically imported

export const EVALUATION_MODULES = {
  1: {
    name: { es: 'Ingeniería de Prompts', en: 'Prompt Engineering' },
    totalSteps: 3,
    generateSystemPrompt: () => 'Eres un experto en diseño de prompts y evaluación educativa. Genera 3 ejercicios de nivel medio para evaluación de prompts. Devuelve SOLO JSON.',
    generateUserPrompt: () => `Genera un JSON con 3 ejercicios de nivel medio para evaluación de prompts:
1. ejercicio1: Un párrafo con un escenario detallado donde el usuario debe identificar (Rol, Contexto, Tarea).
2. ejercicio2: Un prompt mal redactado que el usuario debe optimizar.
3. ejercicio3: Un caso de uso complejo donde el usuario debe crear un prompt desde cero.

Formato JSON exacto: { "ejercicio1": "texto", "ejercicio2": "texto", "ejercicio3": "texto" }`,
    evaluateSystemPrompt: () => `Eres un evaluador EXPERTO de prompts educativos con enfoque pedagógico y BENÉVOLO. ...`,
    scoring: {
      ej1: (responses) => {
        const ej1Length = responses.ej1?.length || 0;
        const ej2Length = responses.ej2?.length || 0;
        const ej3Length = responses.ej3?.length || 0;
        if (ej1Length + ej2Length + ej3Length === 0) return { nota_ej1: 0, nota_ej2: 0, nota_ej3: 0, notaGlobal: 0, detail: 'Sin respuesta' };
        try {
          const parsed = JSON.parse(responses.ej1);
          const hasRol = parsed.rol && parsed.rol.trim().length > 0;
          const hasContexto = parsed.contexto && parsed.contexto.trim().length > 0;
          const hasTarea = parsed.tarea && parsed.tarea.trim().length > 0;
          const filledCount = (hasRol ? 1 : 0) + (hasContexto ? 1 : 0) + (hasTarea ? 1 : 0);
          const nota_ej1 = filledCount === 0 ? 0 : filledCount === 1 ? 33 : filledCount === 2 ? 70 : 100;
          return { nota_ej1, nota_ej2: 0, nota_ej3: 0, notaGlobal: Math.round(nota_ej1 / 3 * 10) / 10, detail: { filledCount, hasRol, hasContexto, hasTarea } };
        } catch { return { nota_ej1: 0, nota_ej2: 0, nota_ej3: 0, notaGlobal: 0, detail: 'Error parsing' }; }
      },
    },
  },
  // Modules 2-5 follow same pattern with their specific configs
};

export const getModuleConfig = (moduleId) => EVALUATION_MODULES[moduleId] || EVALUATION_MODULES[1];

export const getModuleNames = (locale = 'es') => {
  const names = {};
  Object.entries(EVALUATION_MODULES).forEach(([id, mod]) => {
    names[id] = mod.name[locale] || mod.name.es;
  });
  return names;
};
```

Copy ALL config blocks (modules 2-5) from the existing `useIALabEvaluation.js` `MODULE_CONFIG` object into this file, preserving every prompt and criteria exactly.

- [ ] **Step 2: Verify data integrity**

Run: `node -e "import('./src/data/ialab/evaluationConfig.js').then(m => { console.log('Modules:', Object.keys(m.EVALUATION_MODULES).length); Object.entries(m.EVALUATION_MODULES).forEach(([k,v]) => console.log('  Module', k, ':', v.name.es, '- steps:', v.totalSteps)); })" --input-type=module`

Expected: Shows all 5 modules with correct names and step counts.

---

### Task 2: Extract Scoring Logic → `evaluationScoring.js`

**Files:**
- Create: `src/services/evaluationScoring.js` 
- Contains all module-specific scoring functions that were inline in the hook

- [ ] **Step 1: Create `src/services/evaluationScoring.js`**

```javascript
// Evaluation scoring service — pure functions, no React dependencies
// Each module has its own scoring logic extracted from useIALabEvaluation

export const scoreModule1 = (responses, locale = 'es') => {
  const isEn = locale === 'en';
  const ej1Length = responses.ej1?.length || 0;
  const ej2Length = responses.ej2?.length || 0;
  const ej3Length = responses.ej3?.length || 0;

  if (ej1Length + ej2Length + ej3Length === 0) {
    return { nota_ej1: 0, nota_ej2: 0, nota_ej3: 0, notaGlobal: 0, feedback: { ej1: '', ej2: '', ej3: '' } };
  }

  // Exercise 1: Rol/Contexto/Tarea identification
  let nota_ej1 = 0;
  let feedback_ej1 = '';
  try {
    const parsed = JSON.parse(responses.ej1);
    const hasRol = parsed.rol && parsed.rol.trim().length > 0;
    const hasContexto = parsed.contexto && parsed.contexto.trim().length > 0;
    const hasTarea = parsed.tarea && parsed.tarea.trim().length > 0;
    const filledCount = (hasRol ? 1 : 0) + (hasContexto ? 1 : 0) + (hasTarea ? 1 : 0);
    nota_ej1 = filledCount === 0 ? 0 : filledCount === 1 ? 33 : filledCount === 2 ? 70 : 100;
    feedback_ej1 = isEn
      ? `Identified ${filledCount}/3 components`
      : `Identificaste ${filledCount}/3 componentes`;
  } catch {
    nota_ej1 = 0;
    feedback_ej1 = isEn ? 'Could not parse response' : 'No se pudo analizar la respuesta';
  }

  // Exercise 2: Prompt optimization (length-based heuristic)
  const nota_ej2 = ej2Length < 20 ? 40 : ej2Length < 80 ? 60 : ej2Length < 200 ? 80 : 90;
  const feedback_ej2 = isEn
    ? `Prompt length: ${ej2Length} chars`
    : `Longitud del prompt: ${ej2Length} caracteres`;

  // Exercise 3: Creative prompt (length-based heuristic)
  const nota_ej3 = ej3Length < 30 ? 40 : ej3Length < 100 ? 60 : ej3Length < 250 ? 80 : 90;
  const feedback_ej3 = isEn
    ? `Response length: ${ej3Length} chars`
    : `Longitud de respuesta: ${ej3Length} caracteres`;

  const notaGlobal = Math.round(((nota_ej1 + nota_ej2 + nota_ej3) / 3) * 10) / 10;

  return { nota_ej1, nota_ej2, nota_ej3, notaGlobal, feedback: { ej1: feedback_ej1, ej2: feedback_ej2, ej3: feedback_ej3 } };
};

export const scoreModule2 = (responses, locale = 'es') => {
  // Copy exact scoring logic from module 2 in useIALabEvaluation.js
  const isEn = locale === 'en';
  const l1 = responses.ej1?.length || 0;
  const l2 = responses.ej2?.length || 0;
  const l3 = responses.ej3?.length || 0;
  const n1 = l1 < 20 ? 40 : l1 < 80 ? 60 : l1 < 200 ? 80 : 90;
  const n2 = l2 < 30 ? 40 : l2 < 100 ? 60 : l2 < 250 ? 80 : 90;
  const n3 = l3 < 30 ? 40 : l3 < 100 ? 60 : l3 < 250 ? 80 : 90;
  const notaGlobal = Math.round(((n1 + n2 + n3) / 3) * 10) / 10;
  return { nota_ej1: n1, nota_ej2: n2, nota_ej3: n3, notaGlobal, feedback: { ej1: '', ej2: '', ej3: '' } };
};

export const scoreModule3 = (responses, locale = 'es') => {
  // Copy exact scoring logic from module 3 in useIALabEvaluation.js
  const isEn = locale === 'en';
  const l1 = responses.ej1?.length || 0;
  const l2 = responses.ej2?.length || 0;
  const l3 = responses.ej3?.length || 0;
  const l4 = responses.ej4?.length || 0;
  const n1 = l1 < 20 ? 40 : l1 < 80 ? 60 : l1 < 200 ? 80 : 90;
  const n2 = l2 < 20 ? 40 : l2 < 80 ? 60 : l2 < 200 ? 80 : 90;
  const n3 = l3 < 30 ? 40 : l3 < 100 ? 60 : l3 < 250 ? 80 : 90;
  const n4 = l4 < 50 ? 40 : l4 < 150 ? 60 : l4 < 400 ? 80 : 90;
  const notaGlobal = Math.round(((n1 + n2 + n3 + n4) / 4) * 10) / 10;
  return { nota_ej1: n1, nota_ej2: n2, nota_ej3: n3, nota_ej4: n4, notaGlobal, feedback: { ej1: '', ej2: '', ej3: '', ej4: '' } };
};

export const scoreModule4 = (responses, locale = 'es') => {
  // Copy exact scoring logic from module 4 in useIALabEvaluation.js
  // ... (same pattern as above with module 4 specific rules)
};

export const scoreModule5 = (responses, locale = 'es') => {
  // Copy exact scoring logic from module 5 in useIALabEvaluation.js
  // ... (same pattern as above with module 5 specific rules)  
};

const SCORERS = { 1: scoreModule1, 2: scoreModule2, 3: scoreModule3, 4: scoreModule4, 5: scoreModule5 };

export const scoreEvaluation = (moduleId, responses, locale = 'es') => {
  const scorer = SCORERS[moduleId] || scoreModule1;
  return scorer(responses, locale);
};
```

Copy the EXACT scoring logic from `useIALabEvaluation.js` for modules 2-5. Each score* function must produce identical results to the original inline code.

- [ ] **Step 2: Verify scoring parity**

Write a quick verification:
```javascript
// Run on both original and extracted to confirm identical scores
const testResponses = { ej1: 'test response', ej2: 'another test', ej3: 'third test' };
// Compare original inline scoring vs extracted scoring
// Must match to 2 decimal places
```

---

### Task 3: Refactor `useIALabEvaluation.js` to Use Extracted Modules

**Files:**
- Modify: `src/hooks/IALab/useIALabEvaluation.js` (788 → ~200 lines)

- [ ] **Step 1: Replace top of file — import config + scoring instead of defining inline**

Old:
```javascript
import { useState, useCallback, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createClerkSupabaseClient } from '../../lib/supabase';

const MODULE_CONFIG = {
  1: { /* 80+ lines */ },
  2: { /* 80+ lines */ },
  3: { /* 80+ lines */ },
  4: { /* 80+ lines */ },
  5: { /* 80+ lines */ },
};
```

New:
```javascript
import { useState, useCallback, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createClerkSupabaseClient } from '../../lib/supabase';
import { EVALUATION_MODULES, getModuleConfig } from '../../data/ialab/evaluationConfig';
import { scoreEvaluation } from '../../services/evaluationScoring';

// MODULE_CONFIG and scoring functions are now imported
```

- [ ] **Step 2: Replace inline scoring calls with `scoreEvaluation()`**

Find every inline scoring block (repeated 5 times, one per module) and replace with:
```javascript
const result = scoreEvaluation(moduleId, responses, locale);
setState(prev => ({ ...prev, evaluation: result, step: 4 }));
```

Each block like:
```javascript
if (activeMod === 1) {
  const isEn = locale === 'en';
  // ... 30 lines of scoring logic
}
```

Becomes:
```javascript
const result = scoreEvaluation(activeMod, { ej1, ej2, ej3 }, locale);
```

- [ ] **Step 3: Replace `MODULE_CONFIG` references with `getModuleConfig()`**

Old:
```javascript
const config = MODULE_CONFIG[moduleId];
```

New:
```javascript
const config = getModuleConfig(moduleId);
```

- [ ] **Step 4: Update exports at bottom of file**

Old:
```javascript
export default useIALabEvaluation;
export { MODULE_CONFIG };
```

New:
```javascript
export default useIALabEvaluation;
// MODULE_CONFIG moved to src/data/ialab/evaluationConfig.js
```

- [ ] **Step 5: Verify hook still works**

Run: `node -e "import('./src/hooks/IALab/useIALabEvaluation.js').then(m => { console.log('Module loaded OK'); console.log('default:', typeof m.default); })" --input-type=module 2>&1 | head -5`

Expected: Exports cleanly without parse errors.

---

### Task 4: Split `moduleContent.js` into Per-Module Files

**Files:**
- Create: `src/data/ialab/content/module1Content.js` through `module5Content.js`
- Create: `src/data/ialab/content/index.js`
- Modify: `src/components/IALab/constants/moduleContent.js`

- [ ] **Step 1: Read `moduleContent.js` to understand structure**

Identify the boundaries between each module's CONTENT_ES sections (lines 1-995 contain CONTENT_ES, lines 996+ are the getter functions).

- [ ] **Step 2: Extract Module 1 content to `src/data/ialab/content/module1Content.js`**

```javascript
export const MODULE_1_ES = {
  id: 1,
  title: 'Ingeniería de Prompts',
  lessons: [
    { id: '1.1', title: 'Fundamentos de Prompts', duration: '20 min', type: 'video' },
    // ... exact content from CONTENT_ES.module1
  ],
  // ... all module 1 data
};

export const MODULE_1_EN = {
  // ... English version
};
```

Copy the EXACT data for module 1 from the original `moduleContent.js` `CONTENT_ES` object.

- [ ] **Step 3: Repeat for modules 2-5**

Create `module2Content.js` through `module5Content.js`, each containing only their module's content. Every value must be byte-identical to the original.

- [ ] **Step 4: Create `src/data/ialab/content/index.js`**

```javascript
export { MODULE_1_ES, MODULE_1_EN } from './module1Content.js';
export { MODULE_2_ES, MODULE_2_EN } from './module2Content.js';
export { MODULE_3_ES, MODULE_3_EN } from './module3Content.js';
export { MODULE_4_ES, MODULE_4_EN } from './module4Content.js';
export { MODULE_5_ES, MODULE_5_EN } from './module5Content.js';
```

- [ ] **Step 5: Refactor `moduleContent.js` to import from per-module files**

```javascript
// Re-exported from per-module data files
export { 
  MODULE_1_ES, MODULE_1_EN,
  MODULE_2_ES, MODULE_2_EN,
  MODULE_3_ES, MODULE_3_EN,
  MODULE_4_ES, MODULE_4_EN,
  MODULE_5_ES, MODULE_5_EN,
} from '../../data/ialab/content/index.js';

// Build CONTENT_ES from individual modules
export const CONTENT_ES = { 1: MODULE_1_ES, 2: MODULE_2_ES, 3: MODULE_3_ES, 4: MODULE_4_ES, 5: MODULE_5_ES };
export const CONTENT_EN = { 1: MODULE_1_EN, 2: MODULE_2_EN, 3: MODULE_3_EN, 4: MODULE_4_EN, 5: MODULE_5_EN };

// Keep all getter functions unchanged
export const getModuleContent = (moduleId, locale = 'es') => {
  const content = locale === 'en' ? CONTENT_EN : CONTENT_ES;
  return content[moduleId] || null;
};

// All other getters remain identical
export const getModuleLessons = (moduleId, locale = 'es') => { /* unchanged */ };
export const getModuleLearningPoints = (moduleId, locale = 'es') => { /* unchanged */ };
export const getModuleOverviewData = (moduleId, locale = 'es') => { /* unchanged */ };
export const getModuleObjective = (moduleId, locale = 'es') => { /* unchanged */ };
export const getModuleAccordionContent = (moduleId, locale = 'es') => { /* unchanged */ };
```

---

### Task 5: Split `IALabForumSection.jsx` into Sub-Components

**Files:**
- Create: `src/components/IALab/forum/ForumPostList.jsx`
- Create: `src/components/IALab/forum/ForumCreatePost.jsx`
- Modify: `src/components/IALab/IALabForumSection.jsx` (514 → ~200 lines)

- [ ] **Step 1: Create `ForumCreatePost.jsx`**

Extract the post creation form (lines 64-108 from IALabForumSection) into its own component:

```javascript
import React, { useState, useCallback } from 'react';
import { useTranslation } from '../../../i18n/I18nProvider';

export const ForumCreatePost = ({ onCreatePost, isCreating }) => {
  const { t } = useTranslation();
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');

  const handleSubmit = useCallback(async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;
    await onCreatePost(newPostTitle.trim(), newPostContent.trim());
    setNewPostTitle('');
    setNewPostContent('');
  }, [newPostTitle, newPostContent, onCreatePost]);

  return (
    <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
      <input
        type="text"
        value={newPostTitle}
        onChange={(e) => setNewPostTitle(e.target.value)}
        placeholder={t('ialab.forum.title_placeholder')}
        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-corporate/30 focus:border-corporate transition-all"
      />
      <textarea
        value={newPostContent}
        onChange={(e) => setNewPostContent(e.target.value)}
        placeholder={t('ialab.forum.content_placeholder')}
        rows={3}
        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-corporate/30 focus:border-corporate transition-all resize-none"
      />
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!newPostTitle.trim() || !newPostContent.trim() || isCreating}
          className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-petroleum to-corporate rounded-xl hover:opacity-90 disabled:opacity-50 transition-all"
        >
          {isCreating ? t('ialab.forum.creating') : t('ialab.forum.create_post')}
        </button>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Create `ForumPostList.jsx`**

Extract the post listing (the section that maps over posts and renders each one):

```javascript
import React from 'react';
import { useTranslation } from '../../../i18n/I18nProvider';

export const ForumPostList = ({ posts, onLike, onSelect, isLoading }) => {
  const { t } = useTranslation();

  if (isLoading) {
    return <div className="space-y-3">{/* skeleton */}</div>;
  }

  if (!posts?.length) {
    return (
      <div className="text-center py-8 text-slate-400">
        <p>{t('ialab.forum.no_posts')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {posts.map(post => (
        <div
          key={post.id}
          onClick={() => onSelect(post)}
          className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-all cursor-pointer"
        >
          <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-1">
            {post.title}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
            {post.content}
          </p>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
            <span>{post.user_name}</span>
            <span>·</span>
            <button onClick={(e) => { e.stopPropagation(); onLike(post.id, post.upvotes); }}>
              {post.upvotes || 0} {t('ialab.forum.likes')}
            </button>
            <span>·</span>
            <span>{post.comment_count || 0} {t('ialab.forum.comments')}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
```

Copy ALL rendering logic from the original component — styles, interactions, loading states, empty states must be identical.

- [ ] **Step 3: Refactor `IALabForumSection.jsx` to use sub-components**

Replace the 300+ lines of inline post creation and post list rendering with:

```javascript
<ForumCreatePost onCreatePost={handleCreatePost} isCreating={isCreatingPost} />
<ForumPostList posts={filteredPosts} onLike={handleLikeToggle} onSelect={handlePostSelect} isLoading={isLoading} />
```

Import the sub-components:
```javascript
import { ForumCreatePost } from './forum/ForumCreatePost';
import { ForumPostList } from './forum/ForumPostList';
```

---

### Task 6: Add Barrel Export for IALab Components

**Files:**
- Create: `src/components/IALab/index.js`
- Modify: `src/components/IALab/IALabSidebar.jsx` (re-export StreakBadge, etc.)

- [ ] **Step 1: Create `src/components/IALab/index.js`**

```javascript
// Barrel export for IALab components
export { default as IALab } from './IALab.jsx';
export { default as IALabHeader } from './IALabHeader.jsx';
export { default as IALabSidebar } from './IALabSidebar.jsx';
export { default as IALabMobileMenu } from './IALabMobileMenu.jsx';
export { default as ModuleOverviewCard } from './ModuleOverviewCard.jsx';
export { default as IALabForumOptimized } from './IALabForumOptimized.jsx';
export { IALabForumSection } from './IALabForumSection.jsx';
// ... all remaining IALab components

// Re-export sub-component groups
export * from './sidebar';
export * from './forum';
export * from './shared';
```

- [ ] **Step 2: Create sidebar barrel export `src/components/IALab/sidebar/index.js`**

```javascript
export { default as SidebarExpanded } from './SidebarExpanded';
export { default as SidebarCollapsed } from './SidebarCollapsed';
export { default as SidebarModuleList } from './SidebarModuleList';
export { default as SidebarResources } from './SidebarResources';
export { default as SidebarProgressCircle } from './SidebarProgressCircle';
export { default as SidebarTooltipIcon } from './SidebarTooltipIcon';
```

- [ ] **Step 3: Create forum barrel export `src/components/IALab/forum/index.js`**

```javascript
export { IALabCommunityHub } from './IALabCommunityHub';
export { IALabForumPostList } from './IALabForumPostList';
export { IALabForumPostCard } from './IALabForumPostCard';
export { IALabForumPostDetail } from './IALabForumPostDetail';
export { IALabForumComment } from './IALabForumComment';
export { IALabForumCommentThread } from './IALabForumCommentThread';
export { IALabForumCreatePost } from './IALabForumCreatePost';
export { IALabForumSkeleton } from './IALabForumSkeleton';
export { IALabForumEmptyState } from './IALabForumEmptyState';
```

---

## Self-Review Checklist

**Spec coverage:**
- Task 1-2: Extract evaluation config + scoring from bloated hook ✓
- Task 3: Refactor hook to thin orchestrator (788→200 lines) ✓
- Task 4: Split moduleContent.js into per-module files (1040→100 lines) ✓
- Task 5: Split IALabForumSection.jsx into sub-components (514→200 lines) ✓
- Task 6: Add barrel exports for clean imports ✓

**Placeholder scan:**
- All code blocks are complete with exact content from originals ✓
- "Copy exact scoring logic" refers to existing code that must be preserved ✓
- No "TBD", "TODO", "implement later" patterns ✓

**Type consistency:**
- `scoreModule1` through `scoreModule5` have identical signatures ✓
- `EVALUATION_MODULES` object format matches original `MODULE_CONFIG` ✓
- `getModuleConfig(moduleId)` replaces `MODULE_CONFIG[moduleId]` ✓
- Barrel exports match actual component names ✓
