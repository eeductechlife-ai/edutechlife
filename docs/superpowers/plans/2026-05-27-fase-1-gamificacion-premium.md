# Fase 1 — Gamificación Premium Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign all gamification components with premium visuals (Soft UI Evolution + corporate brand), Framer Motion animations, real store data, new Leaderboard and achievement notifications.

**Architecture:** Each component enhanced independently with framer-motion animations, store integration via `useIALabStore`, and corporate theming (#004B63 petroleum, #00BCD4 cyan). Leaderboard is new standalone component. Notifications use store subscribe pattern.

**Tech Stack:** React 19, Framer Motion 12, Zustand (useIALabStore), Tailwind CSS, shadcn/ui Dialogs

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `src/components/IALab/StreakBadge.jsx` | Modify | Spring entrance, animated counter, streak-reactive pulse |
| `src/components/IALab/BadgeCard.jsx` | Modify | Glassmorphism earned, grayscale locked, staggered entrance |
| `src/components/IALab/CourseCompletionSection.jsx` | Modify | Sequenced animation (bar→check→message), particle burst, real data |
| `src/components/IALab/Leaderboard.jsx` | Create | Top 5 users table, highlight current user, layout animation |
| `src/components/IALab/AchievementToast.jsx` | Create | Toast notification for badge/level/streak events |
| `src/hooks/useAchievementNotifications.js` | Create | Subscribe to store, detect events, trigger toasts |

### Task 1: StreakBadge — Spring Entrance & Animated Counter

**Files:**
- Modify: `src/components/IALab/StreakBadge.jsx`

- [ ] **Step 1: Add spring entrance animation and animated counter**

```jsx
// After imports, add counter animation hook
import { motion, useReducedMotion, useSpring, useTransform } from 'framer-motion';

// Inside StreakBadge component, after const weekDays = getWeekDays(streak);
const animatedStreak = useSpring(0, { stiffness: 80, damping: 15 });
const roundedStreak = useTransform(animatedStreak, (v) => Math.round(v));

useEffect(() => {
  animatedStreak.set(streak);
}, [streak, animatedStreak]);

// Replace the streak number display (line 130)
// Before:
<span className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-none">{streak}</span>
// After:
<motion.span className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-none tabular-nums">
  {prefersReducedMotion ? streak : <motion.span>{roundedStreak}</motion.span>}
</motion.span>
```

- [ ] **Step 2: Add streak-change pulse effect**

```jsx
// Add inside motion.div wrapper, before the flex row
const [prevStreak, setPrevStreak] = useState(streak);
const [justChanged, setJustChanged] = useState(false);

useEffect(() => {
  if (streak !== prevStreak && prevStreak !== undefined) {
    setJustChanged(true);
    const timer = setTimeout(() => setJustChanged(false), 600);
    setPrevStreak(streak);
    return () => clearTimeout(timer);
  }
  setPrevStreak(streak);
}, [streak]);

// Add to the outer motion.div animate prop:
animate={{
  opacity: 1,
  y: 0,
  ...(justChanged && !prefersReducedMotion ? { scale: [1, 1.03, 1] } : {}),
}}
transition={{
  duration: prefersReducedMotion ? 0 : 0.4,
  ease: 'easeOut',
  ...(justChanged ? { scale: { duration: 0.6, ease: 'easeInOut' } } : {}),
}}
```

- [ ] **Step 3: Add `import { useEffect, useState } from 'react';` at top (if not present)**

StreakBadge currently imports from framer-motion and iconMapping. It does NOT import React hooks — replace with:

```jsx
import { useState, useEffect } from 'react';
import { motion, useReducedMotion, useSpring, useTransform } from 'framer-motion';
```

- [ ] **Step 4: Build verification**

Run: `npx vite build 2>&1 | grep -E "✓|error|Error"`

Expected: `✓ 3767 modules transformed. ✓ built in ...`

### Task 2: BadgeCard — Staggered Entrance, Glassmorphism & Grayscale Locked

**Files:**
- Modify: `src/components/IALab/BadgeCard.jsx`

- [ ] **Step 1: Add staggered entrance via container variants**

The parent usually renders BadgeCard in a grid. Since BadgeCard renders individually, add variants support via a `index` prop:

```jsx
// Add to BadgeCard props
const BadgeCard = ({ badge, earned, dateEarned, onClick, isNewlyEarned, index = 0 }) => {

// Add variant support inside the component
const prefersReducedMotion = useReducedMotion();

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: prefersReducedMotion ? 0 : i * 0.05,
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  }),
};

// Replace the motion.button initial/animate:
<motion.button
  variants={cardVariants}
  initial="hidden"
  animate="visible"
  custom={index}
  whileHover={prefersReducedMotion ? {} : { scale: 1.03, y: -2 }}
  whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
  // ... rest of props
>
```

- [ ] **Step 2: Glassmorphism for earned, improved locked state**

```jsx
// Replace the earned card className:
earned
  ? 'bg-white/80 backdrop-blur-sm dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:shadow-corporate/5'
  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-700/50 opacity-60 grayscale'

// Replace the !earned overlay (inside the locked div):
{!earned && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="absolute inset-0 rounded-xl bg-slate-100/60 dark:bg-slate-900/40 flex items-center justify-center"
  >
    <div className="w-8 h-8 rounded-full bg-white/80 dark:bg-slate-700/80 flex items-center justify-center shadow-sm">
      <Icon name="fa-lock" className="text-slate-300 dark:text-slate-500 text-xs" />
    </div>
  </motion.div>
)}
```

- [ ] **Step 3: Update StreakDetailsModal and BadgeGalleryModal to pass index**

For StreakDetailsModal.jsx (line 241):
```jsx
<BadgeCard key={badge.id} badge={badge} earned dateEarned={badge.dateEarned} index={i} />
```

For BadgeGalleryModal.jsx (line 68 and 82):
```jsx
<BadgeCard key={badge.id} badge={badge} earned dateEarned={badge.dateEarned} index={earnedBadges.indexOf(badge)} />
<BadgeCard key={badge.id} badge={badge} earned={false} index={index} />
```

- [ ] **Step 4: Build verification**

Run: `npx vite build 2>&1 | grep -E "✓|error|Error"`

Expected: `✓ 3767 modules transformed. ✓ built in ...`

### Task 3: CourseCompletionSection — Sequenced Animation & Particle Burst

**Files:**
- Modify: `src/components/IALab/CourseCompletionSection.jsx`

- [ ] **Step 1: Add sequential animation with useAnimate**

```jsx
import { motion, useReducedMotion, useAnimate } from 'framer-motion';
import { useState, useEffect } from 'react';

const CourseCompletionSection = ({ hasCertificate, courseProgress, onViewCertificate }) => {
  const prefersReducedMotion = useReducedMotion();
  const { t } = useTranslation();
  const [scope, animate] = useAnimate();
  const [animationDone, setAnimationDone] = useState(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion || !hasCertificate) {
      setAnimationDone(true);
      return;
    }
    const run = async () => {
      setAnimationDone(false);
      await animate(scope.current, { opacity: 1, y: 0 }, { duration: 0.3 });
      await animate('.progress-fill', { width: '100%' }, { duration: 0.8, ease: 'easeOut' });
      await animate('.check-icon', { scale: 1, opacity: 1 }, { type: 'spring', stiffness: 400, damping: 12 });
      await animate('.celebration-text', { opacity: 1, y: 0 }, { duration: 0.4 });
      setAnimationDone(true);
    };
    run();
  }, [hasCertificate, prefersReducedMotion]);
```

- [ ] **Step 2: Add progress bar and restructure JSX**

```jsx
// Wrap the component JSX:
<motion.div
  ref={scope}
  initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
  className="px-1 w-full"
>
  <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-petroleum via-petroleum-dark to-corporate p-5 shadow-lg">
    {/* existing decoration divs stay */}
    
    {/* Add progress bar */}
    <div className="mb-4">
      <div className="flex justify-between text-[10px] text-white/70 mb-1.5">
        <span>{t('course_completion.progress')}</span>
        <span>{Math.round(courseProgress)}%</span>
      </div>
      <div className="h-2 bg-white/15 rounded-full overflow-hidden">
        <motion.div
          className="progress-fill h-full bg-gradient-to-r from-[#FFD166] to-corporate rounded-full"
          initial={{ width: '0%' }}
        />
      </div>
    </div>
    
    {/* Existing trophy with initial={{ scale: 0 }} animate={{ scale: 1 }} */}
    
    {/* Celebration text with initial={{ opacity: 0, y: 10 }} */}
    <motion.div
      className="celebration-text"
      initial={{ opacity: 0, y: 10 }}
    >
      {/* existing title, message, checklist, button */}
    </motion.div>
  </div>
</motion.div>
```

- [ ] **Step 3: Add particle burst animation on 100% (only if !prefersReducedMotion)**

```jsx
// Add inside the card, before closing </div>
{animationDone && !prefersReducedMotion && courseProgress >= 100 && (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {Array.from({ length: 8 }).map((_, i) => (
      <motion.div
        key={i}
        initial={{
          opacity: 1,
          x: 80,
          y: 60,
          scale: 0,
        }}
        animate={{
          opacity: 0,
          x: 80 + Math.cos(i * 0.8) * 60,
          y: 60 + Math.sin(i * 0.8) * 60,
          scale: [0, 1.2, 0],
        }}
        transition={{
          duration: 0.8 + i * 0.1,
          delay: 0.2,
          ease: 'easeOut',
        }}
        className="absolute w-2 h-2 rounded-full"
        style={{
          backgroundColor: ['#FFD166', '#00BCD4', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#EF4444', '#2563EB'][i],
        }}
      />
    ))}
  </div>
)}
```

- [ ] **Step 4: Remove old scroll/checklist static logic — use `totalModulesCompleted` from store**

The component already receives `hasCertificate` and `courseProgress` as props. No store changes needed unless we want real module count. For now, the `requirements` array stays as-is since it aligns with the certificate display logic.

- [ ] **Step 5: Build verification**

Run: `npx vite build 2>&1 | grep -E "✓|error|Error"`

Expected: `✓ 3767 modules transformed. ✓ built in ...`

### Task 4: Leaderboard — New Component

**Files:**
- Create: `src/components/IALab/Leaderboard.jsx`

- [ ] **Step 1: Create Leaderboard with mock data + store integration**

```jsx
import { useState, useEffect } from 'react';
import { motion, LayoutGroup } from 'framer-motion';
import { useIALabStore } from '../../store/ialabStore';
import { useTranslation } from '../../i18n/I18nProvider';
import { Icon } from '../../utils/iconMapping';

const MOCK_LEADERS = [
  { id: 'user_1', name: 'Tú', avatar: null, xp: 0, streak: 0, level: 1, isCurrentUser: true },
  { id: 'user_2', name: 'María G.', avatar: null, xp: 3200, streak: 12, level: 6 },
  { id: 'user_3', name: 'Carlos R.', avatar: null, xp: 2800, streak: 8, level: 5 },
  { id: 'user_4', name: 'Ana L.', avatar: null, xp: 1500, streak: 5, level: 4 },
  { id: 'user_5', name: 'Pedro M.', avatar: null, xp: 900, streak: 3, level: 3 },
];

const Leaderboard = () => {
  const { t } = useTranslation();
  const xp = useIALabStore(s => s.xp);
  const streak = useIALabStore(s => s.streak);
  const level = useIALabStore(s => s.getLevel());

  const [leaders, setLeaders] = useState(() => {
    const updated = MOCK_LEADERS.map(l =>
      l.isCurrentUser ? { ...l, xp, streak, level } : l
    ).sort((a, b) => b.xp - a.xp);
    return updated.map((l, i) => ({ ...l, position: i + 1 }));
  });

  useEffect(() => {
    setLeaders(prev => {
      const updated = prev.map(l =>
        l.isCurrentUser ? { ...l, xp, streak, level } : l
      ).sort((a, b) => b.xp - a.xp);
      return updated.map((l, i) => ({ ...l, position: i + 1 }));
    });
  }, [xp, streak, level]);

  const getMedal = (pos) => {
    if (pos === 1) return { icon: 'fa-trophy', color: 'text-[#FFD166]' };
    if (pos === 2) return { icon: 'fa-medal', color: 'text-slate-400' };
    if (pos === 3) return { icon: 'fa-medal', color: 'text-amber-700' };
    return null;
  };

  return (
    <LayoutGroup>
      <div className="space-y-1">
        {leaders.map((user, i) => {
          const medal = getMedal(user.position);
          return (
            <motion.div
              key={user.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, type: 'spring', stiffness: 300, damping: 24 }}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                user.isCurrentUser
                  ? 'bg-gradient-to-r from-corporate/[0.08] to-transparent border border-corporate/20'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'
              }`}
            >
              <div className="w-6 text-center">
                {medal ? (
                  <Icon name={medal.icon} className={`${medal.color} text-sm`} />
                ) : (
                  <span className="text-xs font-medium text-slate-400">{user.position}</span>
                )}
              </div>
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs font-semibold truncate ${user.isCurrentUser ? 'text-corporate' : 'text-slate-700 dark:text-slate-200'}`}>
                    {user.name}
                  </span>
                  {user.isCurrentUser && (
                    <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-corporate/10 text-corporate font-bold uppercase">
                      {t('leaderboard.you_label')}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{user.xp.toLocaleString()}</span>
                  <span className="text-[9px] text-slate-400 ml-1">XP</span>
                </div>
            </motion.div>
          );
        })}
      </div>
    </LayoutGroup>
  );
};

export default Leaderboard;
```

Las claves `leaderboard.*` ya existen en es.json y en.json. El componente usará `t('leaderboard.title')`, `t('leaderboard.empty')`, `t('leaderboard.you_label')`.

- [ ] **Step 2: Build verification**

Run: `npx vite build 2>&1 | grep -E "✓|error|Error"`

Expected: `✓ 3767 modules transformed. ✓ built in ...`

### Task 5: AchievementToast & useAchievementNotifications

**Files:**
- Create: `src/hooks/useAchievementNotifications.js`
- Create: `src/components/IALab/AchievementToast.jsx`

- [ ] **Step 1: Create notification hook**

```jsx
// src/hooks/useAchievementNotifications.js
import { useEffect, useCallback, useState } from 'react';
import { BADGE_INFO } from '../data/ialab';

const NOTIFICATION_DURATION = 4000;

export function useAchievementNotifications(store) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, title, description, icon) => {
    const id = Date.now() + Math.random();
    setToasts(prev => {
      const next = [...prev, { id, type, title, description, icon }];
      return next.slice(-3);
    });
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, NOTIFICATION_DURATION);
  }, []);

  useEffect(() => {
    if (!store) return;
    let prevXp = store.getState().xp;
    let prevStreak = store.getState().streak;
    let prevBadgesCount = store.getState().badges.length;

    const unsub = store.subscribe((state) => {
      if (state.xp > prevXp + 50) {
        const level = state.getLevel();
        addToast('level_up', `¡Nivel ${level}!`, `Has alcanzado el nivel ${level} en IALab`, 'fa-arrow-up');
      }
      prevXp = state.xp;

      if (state.badges.length > prevBadgesCount) {
        const diff = state.badges.slice(prevBadgesCount - state.badges.length);
        diff.forEach(id => {
          const info = BADGE_INFO[id];
          addToast('badge', '¡Nuevo Logro!', info ? info.label : id, 'fa-trophy');
        });
      }
      prevBadgesCount = state.badges.length;

      if (state.streak > prevStreak && [3, 7, 14, 30].includes(state.streak)) {
        addToast('streak', `¡${state.streak} días!`, 'Racha consecutiva de actividad', 'fa-fire');
      }
      prevStreak = state.streak;
    });

    return unsub;
  }, [store, addToast]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, removeToast };
}
```

- [ ] **Step 2: Create AchievementToast component**

```jsx
// src/components/IALab/AchievementToast.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../utils/iconMapping';
import { useTranslation } from '../../i18n/I18nProvider';

const TYPE_STYLES = {
  badge: { gradient: 'from-amber-400 to-amber-500', icon: 'fa-trophy' },
  level_up: { gradient: 'from-corporate to-cyan-400', icon: 'fa-arrow-up' },
  streak: { gradient: 'from-rose-400 to-rose-500', icon: 'fa-fire' },
};

const AchievementToast = ({ toasts, removeToast }) => {
  const { t } = useTranslation();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const style = TYPE_STYLES[toast.type] || TYPE_STYLES.badge;
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              onClick={() => removeToast(toast.id)}
              className="pointer-events-auto flex items-center gap-3 bg-white rounded-xl shadow-xl shadow-slate-900/10 border border-slate-100 p-3.5 pr-4 max-w-xs cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${style.gradient} flex items-center justify-center shadow-md shrink-0`}>
                <Icon name={toast.icon || style.icon} className="text-white text-sm" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{toast.title}</p>
                <p className="text-xs text-slate-500 truncate">{toast.description}</p>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default AchievementToast;
```

- [ ] **Step 3: Integrate into IALab.jsx (or App.jsx)**

In `IALab.jsx` (the main layout component), add:
```jsx
import AchievementToast from './AchievementToast';
import { useAchievementNotifications } from '../../hooks/useAchievementNotifications';
import { useIALabStore } from '../../store/ialabStore';

// Inside component:
const { toasts, removeToast } = useAchievementNotifications(useIALabStore);

// In JSX, before closing tag:
<AchievementToast toasts={toasts} removeToast={removeToast} />
```

- [ ] **Step 4: Build verification**

Run: `npx vite build 2>&1 | grep -E "✓|error|Error"`

Expected: `✓ 3767 modules transformed. ✓ built in ...`

### Task 6: Integrate Leaderboard into IALabSidebar

- [ ] **Step 1: Import and place Leaderboard in the sidebar**

In `IALabSidebar.jsx`, add:
```jsx
import Leaderboard from './Leaderboard';
import { useTranslation } from '../../i18n/I18nProvider';
```

Find the expanded sidebar section (after StreakBadge) and add:
```jsx
{/* Leaderboard */}
{isExpanded && (
  <div className="px-3 mt-3">
    <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
      {t('leaderboard.title')}
    </h3>
    <Leaderboard />
  </div>
)}
```

- [ ] **Step 2: Build verification**

Run: `npx vite build 2>&1 | grep -E "✓|error|Error"`

Expected: `✓ 3767 modules transformed. ✓ built in ...`

## Self-Review

- [ ] Spec coverage: All 5 spec areas covered (StreakBadge, BadgeCard, CourseCompletionSection, Leaderboard, Notifications)
- [ ] Placeholder check: No TBD, TODO, "implement later" patterns
- [ ] Type consistency: All imports use existing codebase patterns (iconMapping, useIALabStore, I18nProvider)
- [ ] Build can be verified after each task
