# SmartBoard Minimalist Redesign Implementation Plan

> **For agentic workers:** single-file refactor of SmartBoardKidsDashboard.jsx

**Goal:** Reduce visual overload by grouping 19 tabs into 5 collapsible categories. Sidebar shows 5 groups, bottom bar shows 5 fixed tabs.

**Architecture:** Category constants + refactored PremiumSidebar (collapsible) + MobileBottomBar (5 fixed tabs). No changes to context, CinematicContent, or child components.

**Tech Stack:** React, framer-motion, Tailwind CSS, localStorage

---

### Task: Refactor SmartBoardKidsDashboard Navigation

**Files:**
- Modify: `src/components/kids-dashboard/SmartBoardKidsDashboard.jsx`

- [ ] **Step 1: Add category constants at module level**

After the imports (after line 28), add:

```jsx
const CATEGORY_MAP = {
  inicio: 'home',
  materias: 'learn', curriculo: 'learn', libros: 'learn', podcast: 'learn',
  examenes: 'practice', flashcards: 'practice', oral: 'practice', escaner: 'practice',
  vak: 'progress', progreso: 'progress', analitica: 'progress', calendario: 'progress',
  misiones: 'explore', actividades: 'explore', noticias: 'explore',
};

const CATEGORIES = [
  { id: 'home',    icon: '🏠', label: 'Inicio',    color: '#4DA8C4', tabs: ['inicio'], premium: false },
  { id: 'learn',   icon: '📚', label: 'Aprender',  color: '#66CCCC', tabs: ['materias', 'curriculo', 'libros', 'podcast'], premium: false },
  { id: 'practice',icon: '✏️', label: 'Practicar', color: '#FF6B9D', tabs: ['examenes', 'flashcards', 'oral', 'escaner'], premium: false },
  { id: 'progress',icon: '📊', label: 'Progreso',  color: '#FFD166', tabs: ['vak', 'progreso', 'analitica', 'calendario'], premium: false },
  { id: 'explore', icon: '🎮', label: 'Explorar',  color: '#A855F7', tabs: ['misiones', 'actividades', 'noticias'], premium: false },
];

const CATEGORY_TAB_LABELS = {
  materias: 'Materias', curriculo: 'Currículo', libros: 'Libros', podcast: 'Podcast',
  examenes: 'Exámenes', flashcards: 'Flashcards', oral: 'Oral', escaner: 'Escáner',
  vak: 'VAK', progreso: 'Progreso', analitica: 'Analítica', calendario: 'Calendario',
  misiones: 'Misiones', actividades: 'Actividades', noticias: 'Noticias',
  inicio: 'Inicio',
};

const PREMIUM_TABS = ['libros', 'noticias', 'analitica'];
```

- [ ] **Step 2: Add age-based mode helper**

After the constants block, add:

```jsx
const useAgeMode = () => {
  const [ageMode, setAgeMode] = useState('standard');
  useEffect(() => {
    const stored = localStorage.getItem('edutechlife_age_mode');
    if (stored) setAgeMode(stored);
  }, []);
  const setMode = (mode) => {
    setAgeMode(mode);
    localStorage.setItem('edutechlife_age_mode', mode);
  };
  return { ageMode, setAgeMode: setMode };
};
```

Note: This will be used later when we get grade info from context. For now default to 'standard'.

- [ ] **Step 3: Refactor PremiumSidebar to collapsible categories**

Replace the entire `PremiumSidebar` component (current lines 116-278) with:

```jsx
const PremiumSidebar = ({ activeTab, onTabChange, totalPoints, vakCompleted, darkMode, streak, onNavigate, onLogout, subscriptionTier }) => {
  const { t } = useTranslation();
  const isPremium = subscriptionTier === 'premium';
  const [expandedCat, setExpandedCat] = useState(() => {
    return localStorage.getItem('edutechlife_sidebar_cat') || 'home';
  });

  const activeCategory = CATEGORY_MAP[activeTab] || 'home';

  useEffect(() => {
    localStorage.setItem('edutechlife_sidebar_cat', activeCategory);
    setExpandedCat(activeCategory);
  }, [activeCategory]);

  const toggleCategory = (catId) => {
    setExpandedCat(prev => prev === catId ? null : catId);
  };

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className={`hidden md:flex w-56 flex-col h-full backdrop-blur-xl border-r relative z-20 transition-colors duration-500 ${
        darkMode ? 'bg-[#1E293B]/80 border-[#334155]/50' : 'bg-white/80 border-[#E2E8F0]'
      }`}
    >
      {/* Logo + Stats */}
      <div className="p-4 border-b border-[#E2E8F0]/50">
        <motion.h2 initial={{ scale: 0 }} animate={{ scale: 1 }}
          className="text-lg font-black bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] bg-clip-text text-transparent"
        >
          SmartBoard
        </motion.h2>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center gap-1 text-xs">
            <span>🔥</span>
            <span className={`font-bold ${darkMode ? 'text-[#FFD166]' : 'text-[#FF8E53]'}`}>{streak || 0}</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span>💎</span>
            <span className={`font-bold ${darkMode ? 'text-white' : 'text-[#004B63]'}`}>{totalPoints?.toLocaleString() || 0}</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {CATEGORIES.map((cat) => {
          const isActiveCategory = expandedCat === cat.id;
          const hasActiveTab = activeCategory === cat.id;
          const anyPremiumInCategory = cat.tabs.some(t => PREMIUM_TABS.includes(t));
          const catLocked = anyPremiumInCategory && !isPremium;
          const showChildren = isActiveCategory;

          return (
            <div key={cat.id}>
              {/* Category Button */}
              <motion.button
                onClick={() => toggleCategory(cat.id)}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold ${
                  hasActiveTab
                    ? 'text-white shadow-sm'
                    : darkMode
                      ? 'text-[#94A3B8] hover:bg-[#334155]/50'
                      : 'text-[#64748B] hover:bg-[#F1F5F9]'
                }`}
                style={hasActiveTab ? { background: `linear-gradient(135deg, ${cat.color}, ${cat.color}dd)` } : {}}
              >
                <span className="text-lg">{cat.icon}</span>
                <span className="flex-1 text-left">{cat.label}</span>
                <motion.span
                  animate={{ rotate: showChildren ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-[10px] opacity-50"
                >▾</motion.span>
              </motion.button>

              {/* Sub-tabs */}
              <AnimatePresence initial={false}>
                {showChildren && (
                  <motion.div
                    key="sub"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="ml-2 mt-0.5 space-y-0.5 border-l-2 pl-2"
                      style={{ borderColor: `${cat.color}40` }}>
                      {cat.tabs.map((tabId) => {
                        const isActive = activeTab === tabId;
                        const isPremiumTab = PREMIUM_TABS.includes(tabId);

                        if (cat.id === 'home') return null;

                        return (
                          <motion.button
                            key={tabId}
                            onClick={() => onTabChange(tabId)}
                            whileTap={{ scale: 0.97 }}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                              isActive
                                ? darkMode ? 'bg-[#334155] text-white' : 'bg-[#F1F5F9] text-[#004B63]'
                                : darkMode ? 'text-[#94A3B8] hover:bg-[#334155]/30' : 'text-[#64748B] hover:bg-[#F8FAFC]'
                            }`}
                            style={isActive ? { borderLeft: `3px solid ${cat.color}` } : {}}
                          >
                            <span className="text-base">{cat.id === 'home' ? '🏠' : ''}</span>
                            <span className="flex-1 text-left">{CATEGORY_TAB_LABELS[tabId] || tabId}</span>
                            {isPremiumTab && !isPremium && <span className="text-[9px]">🔒</span>}
                            {isPremiumTab && isPremium && <span className="text-[9px]">⭐</span>}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* Parents + Logout */}
      <div className="p-3 border-t border-[#E2E8F0]/50 space-y-1">
        <motion.button
          onClick={() => onNavigate?.('/smartboard/padres')}
          whileTap={{ scale: 0.98 }}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            darkMode ? 'text-[#94A3B8] hover:bg-[#334155]/50' : 'text-[#64748B] hover:bg-[#F1F5F9]'
          }`}
        >
          <span className="text-lg">👨‍👩‍👧</span>
          <span>{t('smartboard.tab_parents')}</span>
        </motion.button>
        <motion.button
          onClick={onLogout}
          whileTap={{ scale: 0.98 }}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all ${
            darkMode ? 'text-[#64748B] hover:bg-[#334155]/30' : 'text-[#94A3B8] hover:bg-[#F1F5F9]'
          }`}
        >
          <span>🚪</span>
          <span>{t('smartboard.logout')}</span>
        </motion.button>
      </div>
    </motion.aside>
  );
};
```

- [ ] **Step 4: Remove old PREMIUM_TABS constant (moved to module level)**

Delete the old `const PREMIUM_TABS = ['libros', 'noticias', 'analitica', 'padres'];` line (current line 114).

- [ ] **Step 5: Refactor MobileBottomBar to 5 fixed category tabs**

Replace the entire `MobileBottomBar` component (current lines 284-340) with:

```jsx
const MobileBottomBar = ({ activeTab, onTabChange, darkMode, subscriptionTier }) => {
  const { t } = useTranslation();
  const isPremium = subscriptionTier === 'premium';
  const activeCategory = CATEGORY_MAP[activeTab] || 'home';

  const getFirstTab = (catId) => {
    const cat = CATEGORIES.find(c => c.id === catId);
    return cat ? cat.tabs[0] : 'inicio';
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className={`md:hidden fixed bottom-0 left-0 right-0 backdrop-blur-xl border-t z-50 transition-colors duration-500 ${
        darkMode ? 'bg-[#1E293B]/90 border-[#334155]/50' : 'bg-white/90 border-[#E2E8F0]'
      }`}
    >
      <nav className="flex justify-around items-center py-1 px-2">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          const hasPremium = cat.tabs.some(t => PREMIUM_TABS.includes(t));
          const locked = hasPremium && !isPremium;
          return (
            <motion.button
              key={cat.id}
              onClick={() => onTabChange(activeCategory === cat.id ? activeTab : getFirstTab(cat.id))}
              whileTap={{ scale: 0.9 }}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all min-w-[56px] ${
                isActive ? 'text-white shadow-sm' : darkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'
              }`}
              style={isActive ? { background: `linear-gradient(135deg, ${cat.color}, ${cat.color}dd)` } : {}}
            >
              <span className="text-xl">{cat.icon}</span>
              <span className="text-[9px] font-semibold whitespace-nowrap">{cat.label}</span>
              {locked && <span className="text-[8px] absolute top-0 right-1">🔒</span>}
            </motion.button>
          );
        })}
      </nav>
    </motion.div>
  );
};
```

- [ ] **Step 6: Clean up unused references**

Find and remove the `PREMIUM_TABS` reference in `MOBILE_PREMIUM_TABS` constant (line 284) — replace with the module-level `PREMIUM_TABS`:

Change line 284 from:
```jsx
const MOBILE_PREMIUM_TABS = ['libros', 'noticias', 'analitica'];
```
to:
```jsx
const MOBILE_PREMIUM_TABS = PREMIUM_TABS;
```

And in the mobile label rendering section (around line 320), remove the long ternary chain — simplify with `CATEGORY_TAB_LABELS`.

Actually, the CATEGORY_TAB_LABELS already has entries for all tabs. Let me keep the current label logic but ensure it uses CATEGORY_TAB_LABELS where possible.

Wait — in the MobileBottomBar we removed the individual tab rendering. The mobile bottom bar now shows categories, not individual tabs. So the `MOBILE_PREMIUM_TABS` and labels for individual tabs are no longer needed in that component. 

But let me keep the MOBILE_PREMIUM_TABS constant available as `PREMIUM_TABS` since it's used in the premium lock logic.

Actually, looking more carefully, the old `MOBILE_PREMIUM_TABS` was used in the mobile bottom bar to show lock icons on premium tabs. Since we now show categories instead of individual tabs, this is no longer needed there. Instead, the lock icon shows on the category if it contains a premium tab.

Let me remove the MOBILE_PREMIUM_TABS line entirely.

- [ ] **Step 7: Verify top bar handles all tabs**

The top bar (around line 928-937) shows the current tab name. It has a conditional chain for each tab. Replace it with a simpler lookup:

Change the `h1` section (lines 928-937) from:
```jsx
<h1 className={`text-xl font-bold ...`}>
  {activeTab === 'inicio' && t('smartboard.topbar_home')}
  {activeTab === 'vak' && t('smartboard.topbar_vak')}
  ...
</h1>
```

to:
```jsx
<h1 className={`text-xl font-bold transition-colors duration-500 ${darkMode ? 'text-white' : 'text-[#004B63]'}`}>
  <span className="flex items-center gap-2">
    <span className="text-base">{CATEGORIES.find(c => c.tabs.includes(activeTab))?.icon}</span>
    <span>{TOP_BAR_LABELS[activeTab] || activeTab}</span>
  </span>
</h1>
```

And add after the CATEGORIES constant block:
```jsx
const TOP_BAR_LABELS = {
  inicio: 'Inicio',
  materias: 'Materias', curriculo: 'Currículo', libros: 'Libros Intel.', podcast: 'Podcast',
  examenes: 'Exámenes', flashcards: 'Flashcards', oral: 'Oral', escaner: 'Escáner',
  vak: 'Diagnóstico VAK', progreso: 'Progreso', analitica: 'Analítica', calendario: 'Calendario',
  misiones: 'Misiones', actividades: 'Actividades', noticias: 'Noticias',
};
```

- [ ] **Step 8: Build and verify**

Run: `npx vite build` from edutechlife-frontend. Expect 0 errors.
