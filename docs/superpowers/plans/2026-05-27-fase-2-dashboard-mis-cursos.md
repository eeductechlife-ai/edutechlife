# Fase 2 — Dashboard Mis Cursos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a "Mis Cursos y Certificados" modal dashboard accessible from the existing "Mis Certificados" menu item in UserDropdownMenuPremium.

**Architecture:** New `UserCoursesDashboard` component renders inside a shadcn Dialog, opened by modifying `handleCertificates` in UserDropdownMenuPremium. Reuses existing `CourseCard` with store data overrides. No new navigation buttons.

**Tech Stack:** React 19, Zustand (useIALabStore), shadcn/ui Dialog, framer-motion, Tailwind CSS

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `src/components/IALab/UserCoursesDashboard.jsx` | **Create** | Dashboard modal content: tabs, course grid, certificates section |
| `src/components/UserDropdownMenuPremium.jsx` | **Modify** | Change `handleCertificates` to open the modal |

### Task 1: Create UserCoursesDashboard Component

**Files:**
- Create: `src/components/IALab/UserCoursesDashboard.jsx`

- [ ] **Step 1: Create the UserCoursesDashboard component**

```jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../utils/iconMapping';
import { useIALabStore } from '../../store/ialabStore';
import { useTranslation } from '../../i18n/I18nProvider';
import { courses as ALL_COURSES } from './data/landingPageData';
import CourseCard from './CourseCard';

const FILTER_TABS = [
  { id: 'all', label: 'Todos' },
  { id: 'in-progress', label: 'En Progreso' },
  { id: 'completed', label: 'Completados' },
];

const UserCoursesDashboard = () => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');

  const storeXp = useIALabStore(s => s.xp);
  const storeLevel = useIALabStore(s => s.getLevel());
  const storeStreak = useIALabStore(s => s.streak);

  const courses = ALL_COURSES.map(c => {
    if (c.id === 'ia-generativa' && c.status === 'active') {
      return { ...c, progress: Math.min(Math.round((storeXp / 5000) * 100), 100) };
    }
    return c;
  });

  const filtered = courses.filter(c => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'in-progress') return c.status === 'active' && c.progress > 0 && c.progress < 100;
    if (activeFilter === 'completed') return c.progress >= 100;
    return true;
  });

  const activeCourse = courses.find(c => c.id === 'ia-generativa');
  const hasCert = activeCourse?.progress >= 80;

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-petroleum/[0.06] to-corporate/[0.04] rounded-xl p-3 border border-petroleum/10">
          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{t('streak.xp')}</p>
          <p className="text-lg font-bold text-petroleum mt-0.5">{storeXp.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-petroleum/[0.06] to-corporate/[0.04] rounded-xl p-3 border border-petroleum/10">
          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{t('streak.level')}</p>
          <p className="text-lg font-bold text-petroleum mt-0.5">{storeLevel}</p>
        </div>
        <div className="bg-gradient-to-br from-petroleum/[0.06] to-corporate/[0.04] rounded-xl p-3 border border-petroleum/10">
          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{t('streak.days')}</p>
          <p className="text-lg font-bold text-petroleum mt-0.5">{storeStreak}</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 bg-slate-100 rounded-xl p-1 w-fit">
        {FILTER_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeFilter === tab.id
                ? 'bg-white text-petroleum shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Course grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-8 text-slate-400">
              <Icon name="fa-book-open" className="text-2xl mb-2 mx-auto" />
              <p className="text-sm font-medium">{t('leaderboard.empty')}</p>
            </div>
          ) : (
            filtered.map(course => (
              <CourseCard key={course.id} course={course} isSignedIn />
            ))
          )}
        </motion.div>
      </AnimatePresence>

      {/* Certificates section */}
      {hasCert && (
        <div className="border-t border-slate-100 pt-6">
          <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Icon name="fa-award" className="text-corporate" />
            Certificados Obtenidos
          </h3>
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl p-4 border border-emerald-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
              <Icon name="fa-check-circle" className="text-emerald-600 text-lg" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">{activeCourse.title}</p>
              <p className="text-xs text-slate-500">Completado al {Math.round(activeCourse.progress)}%</p>
            </div>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('ialab:viewCertificate'))}
              className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors"
            >
              Ver Certificado
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCoursesDashboard;
```

- [ ] **Step 2: Build verification**

Run: `npx vite build 2>&1 | grep -E "✓|error|Error" | head -5`

Expected: `✓ 37xx modules transformed. ✓ built in ...`

### Task 2: Integrate into UserDropdownMenuPremium

**Files:**
- Modify: `src/components/UserDropdownMenuPremium.jsx`

- [ ] **Step 1: Add import and state**

```jsx
// Add with existing imports:
import UserCoursesDashboard from './IALab/UserCoursesDashboard';

// Add state with existing states:
const [showCourses, setShowCourses] = useState(false);
```

- [ ] **Step 2: Replace handleCertificates to open modal**

Change `handleCertificates`:
```jsx
// Before:
const handleCertificates = () => {
  if (onNavigate) {
    onNavigate('certificados');
  } else {
    alert('Página de certificados en desarrollo');
  }
};

// After:
const handleCertificates = () => {
  setShowCourses(true);
};
```

- [ ] **Step 3: Add modal JSX before closing `</>` fragment**

```jsx
      {showCourses && (
        <Dialog open={showCourses} onOpenChange={setShowCourses}>
          <DialogContent className="sm:max-w-[800px] max-h-[85vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border-0">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-[#334155]">
                Mis Cursos y Certificados
              </DialogTitle>
            </DialogHeader>
            <ErrorBoundary>
              <UserCoursesDashboard />
            </ErrorBoundary>
          </DialogContent>
        </Dialog>
      )}
```

- [ ] **Step 4: Build verification**

Run: `npx vite build 2>&1 | grep -E "✓|error|Error" | head -5`

Expected: `✓ 37xx modules transformed. ✓ built in ...`

## Self-Review

- [ ] **Spec coverage:** All requirements covered — modal from "Mis Certificados", course grid, progress from store, certificates section
- [ ] **Placeholder check:** No TBDs, TODOs, or "implement later" patterns
- [ ] **Consistency:** UserCoursesDashboard uses same import patterns as rest of codebase (useIALabStore, useTranslation, Icon, CourseCard)
- [ ] **No new buttons:** Reuses existing "Mis Certificados" menu item — only the destination changes from navigation to modal
