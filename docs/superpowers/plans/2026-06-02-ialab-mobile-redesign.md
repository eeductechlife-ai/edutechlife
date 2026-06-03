# iLAB Mobile-First Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Subir Mobile/Responsive iLAB de 7.0 → 9.0+ (touch targets 44px, safe areas reales, device-aware loading, OVA responsive)

**Architecture:** 7 fases secuenciales (C1→C7), ~25 archivos modificados, 3 archivos creados. Cada fase produce cambios autónomos y verificables.

**Tech Stack:** React 18, Tailwind 3.4, Framer Motion 12, Vite 5, Playwright 1.60, Workbox/PWA

---

## File Structure

**Create:**
- `src/hooks/useDeviceType.js` — Detección responsive vía matchMedia
- `src/components/IALab/shared/TouchableIcon.jsx` — Botón icono con hitSlop+44px
- `e2e/mobile.spec.js` — Tests Playwright mobile

**Modify:**
1. `src/design-system/tokens.css` — `--safe-area-*` CSS vars
2. `src/components/IALab/IALab.css` — `.safe-area-top`, `.touch-manipulation`
3. `src/components/IALab/IALab.jsx` — clase raíz + conditional loading
4. `src/components/IALab/shared/MobileHeader.jsx` — safe-top real
5. `src/components/IALab/constants/styles.js` — TOUCH_TARGET_MIN token
6. `src/components/IALab/IALabMobileMenu.jsx` — touch targets + TouchableIcon
7. `src/components/IALab/OVAIntroPrompt.jsx` — touch targets + grid responsive
8. `src/components/IALab/forum/IALabForumPostCard.jsx` — touch targets
9. `src/components/IALab/forum/IALabForumComment.jsx` — touch targets
10. `src/components/IALab/forum/IALabForumSearchBar.jsx` — 44px + input type
11. `src/components/IALab/forum/IALabForumFilterBar.jsx` — 44px
12. `src/components/IALab/IALabQuizModal/index.jsx` — 44px
13. `src/components/IALab/sidebar/SidebarModuleList.jsx` — 44px
14. `src/components/IALab/shared/TabPills.jsx` — 44px
15. `src/components/IALab/shared/OVAValerioBar.jsx` — 44px + input type
16. `src/components/IALab/shared/ToastNotification.jsx` — close 44px
17. `src/components/IALab/shared/EmptyState.jsx` — CTA 44px
18. `src/components/IALab/LeaderboardModal.jsx` — close 44px
19. `src/components/IALab/StreakDetailsModal.jsx` — close 44px
20. `src/components/IALab/OVABuildGPT/index.jsx` — input 44px + text-base
21. `vite.config.optimized.js` — verify chunks
22. `src/components/IALab/IALabValerioPanel/index.jsx` — input type chat

---

### Task 1: Safe Areas CSS + Utility Classes

**Files:**
- Modify: `src/design-system/tokens.css` — añadir al final
- Modify: `src/components/IALab/IALab.css` — añadir al final

- [ ] **Step 1: Añadir safe area CSS vars a tokens.css**

```css
/* Safe area insets para notch + Dynamic Island */
:root {
  --safe-area-top: env(safe-area-inset-top, 0px);
  --safe-area-bottom: env(safe-area-inset-bottom, 0px);
  --safe-area-left: env(safe-area-inset-left, 0px);
  --safe-area-right: env(safe-area-inset-right, 0px);
}
```

Pegar al final del archivo `src/design-system/tokens.css`.

- [ ] **Step 2: Añadir utilidades mobile a IALab.css**

```css
.safe-area-top {
  padding-top: var(--safe-area-top);
}
.safe-area-bottom {
  padding-bottom: var(--safe-area-bottom);
}
.touch-manipulation {
  touch-action: manipulation;
  -webkit-touch-callout: none;
}
```

Pegar al final del archivo `src/components/IALab/IALab.css`.

- [ ] **Step 3: Commit**

```bash
git add src/design-system/tokens.css src/components/IALab/IALab.css
git commit -m "feat(mobile): add safe area CSS vars and touch utility classes"
```

---

### Task 2: IALab.jsx — Touch-Action Global + Conditional Loading

**Files:**
- Modify: `src/components/IALab/IALab.jsx`
- Create: `src/hooks/useDeviceType.js`

- [ ] **Step 1: Crear hook useDeviceType**

```js
import { useState, useEffect } from 'react';

export function useDeviceType() {
  const [device, setDevice] = useState(() => {
    if (typeof window === 'undefined') return { isMobile: false, isTablet: false, isDesktop: true };
    const w = window.innerWidth;
    return {
      isMobile: w < 768,
      isTablet: w >= 768 && w < 1024,
      isDesktop: w >= 1024,
    };
  });

  useEffect(() => {
    const mqMobile = window.matchMedia('(max-width: 767px)');
    const mqTablet = window.matchMedia('(min-width: 768px) and (max-width: 1023px)');
    const handler = () => {
      const w = window.innerWidth;
      setDevice({
        isMobile: w < 768,
        isTablet: w >= 768 && w < 1024,
        isDesktop: w >= 1024,
      });
    };
    mqMobile.addEventListener('change', handler);
    mqTablet.addEventListener('change', handler);
    return () => {
      mqMobile.removeEventListener('change', handler);
      mqTablet.removeEventListener('change', handler);
    };
  }, []);

  return device;
}
```

- [ ] **Step 2: Añadir touch-manipulation al div raíz en IALab.jsx**

Localizar `<div className="flex flex-col h-dvh bg-bg-light dark:bg-slate-900"` y añadir clase:

```jsx
<div className="flex flex-col h-dvh bg-bg-light dark:bg-slate-900 touch-manipulation" onTouchStart={swipeStart} onTouchEnd={swipeEnd}>
```

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useDeviceType.js src/components/IALab/IALab.jsx
git commit -m "feat(mobile): add useDeviceType hook and touch-action: manipulation"
```

---

### Task 3: MobileHeader Safe Areas Reales

**Files:**
- Modify: `src/components/IALab/shared/MobileHeader.jsx`

- [ ] **Step 1: Reemplazar clase muerta safe-area-top**

Cambiar:
```jsx
<div role="banner" className="md:hidden fixed top-0 left-0 right-0 h-16 landscape:h-12 bg-white dark:bg-slate-800 z-50 flex items-center justify-between px-4 landscape:px-3 border-b border-slate-200 dark:border-slate-700 safe-area-top">
```
Por:
```jsx
<div role="banner" className="md:hidden fixed top-0 left-0 right-0 h-16 landscape:h-12 bg-white dark:bg-slate-800 z-50 flex items-center justify-between px-4 landscape:px-3 border-b border-slate-200 dark:border-slate-700 pt-[var(--safe-area-top)]">
```

- [ ] **Step 2: Commit**

```bash
git add src/components/IALab/shared/MobileHeader.jsx
git commit -m "fix(mobile): replace dead safe-area-top class with real CSS var"
```

---

### Task 4: TOUCH_TARGET_MIN Token + TouchableIcon Component

**Files:**
- Modify: `src/components/IALab/constants/styles.js`
- Create: `src/components/IALab/shared/TouchableIcon.jsx`

- [ ] **Step 1: Añadir TOUCH_TARGET_MIN a styles.js**

Al final del archivo, antes del export si existe, o simplemente:

```js
export const TOUCH_TARGET_MIN = 'min-w-[44px] min-h-[44px] flex items-center justify-center';
```

- [ ] **Step 2: Crear TouchableIcon.jsx**

```jsx
import { memo } from 'react';
import { Icon } from '../../../utils/iconMapping';

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export const TouchableIcon = memo(({ icon, label, onClick, size = 'md', className = '', ...props }) => {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`relative touch-manipulation 
        min-w-[44px] min-h-[44px] flex items-center justify-center
        active:scale-95 transition-transform duration-100 ease-out
        before:content-[''] before:absolute before:-inset-2 before:rounded-xl before:z-[-1]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/50
        ${className}`}
      {...props}
    >
      <Icon name={icon} className={`${sizeMap[size]} pointer-events-none`} aria-hidden="true" />
    </button>
  );
});

TouchableIcon.displayName = 'TouchableIcon';
export default TouchableIcon;
```

- [ ] **Step 3: Commit**

```bash
git add src/components/IALab/constants/styles.js src/components/IALab/shared/TouchableIcon.jsx
git commit -m "feat(mobile): add TOUCH_TARGET_MIN token and TouchableIcon component"
```

---

### Task 5: IALabMobileMenu — Touch Targets 44px

**Files:**
- Modify: `src/components/IALab/IALabMobileMenu.jsx`

- [ ] **Step 1: Perfil avatar clickable → 44px**

Cambiar:
```jsx
<div className="w-10 h-10 rounded-full ...">
```
Por:
```jsx
<button onClick={onOpenProfile} className="min-w-[44px] min-h-[44px] rounded-full ...">
```

(Revisar si el avatar ya es clickable; si tiene onClick, envolver en elemento con 44px)

- [ ] **Step 2: Botón cerrar sesión**

Cambiar `p-2` por `p-2.5 min-w-[44px] min-h-[44px]` en el logout button.

- [ ] **Step 3: Módulos en lista — asegurar 44px**

Cada `<button>` de módulo debe tener `min-h-[44px]`. Localizar los module buttons y añadir.

- [ ] **Step 4: Commit**

```bash
git add src/components/IALab/IALabMobileMenu.jsx
git commit -m "fix(mobile): IALabMobileMenu touch targets min 44px"
```

---

### Task 6: OVAIntroPrompt — Touch Targets + Grid Responsive

**Files:**
- Modify: `src/components/IALab/OVAIntroPrompt.jsx`

- [ ] **Step 1: Menu toggle button → 44px**

Localizar `<button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menú de navegación" className="p-2 ...">`
Cambiar `p-2` por `min-w-[44px] min-h-[44px] p-2.5`.

- [ ] **Step 2: Menu close X button → 44px**

Localizar `className="self-end p-1.5 hover:... rounded-full"` close button.
Cambiar `p-1.5` por `min-w-[44px] min-h-[44px] p-2`.

- [ ] **Step 3: Prev/Next navigation buttons → 44px**

Localizar ambos `<button>` de navegación (ChevronLeft y "Siguiente").
Cambiar `p-3` por `min-w-[44px] min-h-[44px]` en anterior.
Siguiente: `px-6 py-3` → `px-6 min-h-[44px]`.

- [ ] **Step 4: Grid responsive**

Localizar `className="grid grid-cols-5 gap-2"` y cambiar por `className="grid grid-cols-3 sm:grid-cols-5 gap-2"`.

- [ ] **Step 5: Commit**

```bash
git add src/components/IALab/OVAIntroPrompt.jsx
git commit -m "fix(mobile): OVAIntroPrompt touch targets 44px + grid responsive"
```

---

### Task 7: Foro — Touch Targets + Input Types

**Files:**
- Modify: `src/components/IALab/forum/IALabForumPostCard.jsx`
- Modify: `src/components/IALab/forum/IALabForumComment.jsx`
- Modify: `src/components/IALab/forum/IALabForumSearchBar.jsx`
- Modify: `src/components/IALab/forum/IALabForumFilterBar.jsx`

- [ ] **Step 1: IALabForumPostCard — action buttons 44px**

Localizar botones de acción (edit, delete, reply, etc.). Añadir `min-w-[44px] min-h-[44px]` a cada uno.

- [ ] **Step 2: IALabForumComment — edit/delete 44px**

Añadir `min-w-[44px] min-h-[44px]` a botones de comentario.

- [ ] **Step 3: IALabForumSearchBar — 44px + search type**

Localizar `<input>` de búsqueda y añadir `type="search" inputMode="search"`.
Localizar botón search y añadir `min-w-[44px] min-h-[44px]`.

- [ ] **Step 4: IALabForumFilterBar — filter pills 44px**

Localizar filter pills. Cambiar `py-1` por `min-h-[44px] py-0 flex items-center`.

- [ ] **Step 5: Commit**

```bash
git add src/components/IALab/forum/IALabForumPostCard.jsx src/components/IALab/forum/IALabForumComment.jsx src/components/IALab/forum/IALabForumSearchBar.jsx src/components/IALab/forum/IALabForumFilterBar.jsx
git commit -m "fix(mobile): forum touch targets 44px + search input type"
```

---

### Task 8: Quiz, Challenges, Sidebar — Touch Targets

**Files:**
- Modify: `src/components/IALab/IALabQuizModal/index.jsx`
- Modify: `src/components/IALab/sidebar/SidebarModuleList.jsx`

- [ ] **Step 1: Quiz — option/nav buttons 44px**

Localizar option buttons (los que tienen `onClick` y `p-4`). Verificar que tengan `min-h-[44px]` (p-4 ya da ~40px). Añadir `min-h-[44px]` si no lo tienen.
Localizar navigation prev/next buttons. Añadir `min-h-[44px]`.

- [ ] **Step 2: SidebarModuleList — module buttons 44px**

Localizar `<button className="w-full group flex items-center gap-2 p-2.5 ..."`. Cambiar `p-2.5` por `min-h-[44px] p-2.5`.

- [ ] **Step 3: Commit**

```bash
git add src/components/IALab/IALabQuizModal/index.jsx src/components/IALab/sidebar/SidebarModuleList.jsx
git commit -m "fix(mobile): quiz and sidebar touch targets 44px"
```

---

### Task 9: Shared Components — Touch Targets

**Files:**
- Modify: `src/components/IALab/shared/TabPills.jsx`
- Modify: `src/components/IALab/shared/OVAValerioBar.jsx`
- Modify: `src/components/IALab/shared/ToastNotification.jsx`
- Modify: `src/components/IALab/shared/EmptyState.jsx`

- [ ] **Step 1: TabPills — pills 44px**

Localizar los `<button>` de tabs. Añadir `min-h-[44px] flex items-center` a cada pill.

- [ ] **Step 2: OVAValerioBar — mic + send 44px**

Localizar botón micrófono y botón enviar. Añadir `min-w-[44px] min-h-[44px]`.

- [ ] **Step 3: ToastNotification — close 44px**

Localizar close button. Añadir `min-w-[44px] min-h-[44px]`.

- [ ] **Step 4: EmptyState — CTA 44px**

Localizar CTA button (el que tiene `onClick` dentro de EmptyState). Añadir `min-h-[44px]`.

- [ ] **Step 5: Commit**

```bash
git add src/components/IALab/shared/TabPills.jsx src/components/IALab/shared/OVAValerioBar.jsx src/components/IALab/shared/ToastNotification.jsx src/components/IALab/shared/EmptyState.jsx
git commit -m "fix(mobile): shared components touch targets 44px"
```

---

### Task 10: Modales — Close Buttons 44px

**Files:**
- Modify: `src/components/IALab/LeaderboardModal.jsx`
- Modify: `src/components/IALab/StreakDetailsModal.jsx`

- [ ] **Step 1: LeaderboardModal close**

Localizar modal close button (icon X). Añadir `min-w-[44px] min-h-[44px]`.

- [ ] **Step 2: StreakDetailsModal close**

Localizar modal close button. Añadir `min-w-[44px] min-h-[44px]`.

- [ ] **Step 3: Commit**

```bash
git add src/components/IALab/LeaderboardModal.jsx src/components/IALab/StreakDetailsModal.jsx
git commit -m "fix(mobile): modal close buttons 44px"
```

---

### Task 11: OVA BuildGPT — Input Type + Touch Targets

**Files:**
- Modify: `src/components/IALab/OVABuildGPT/index.jsx`
- Modify: `src/components/IALab/IALabValerioPanel/index.jsx`

- [ ] **Step 1: OVABuildGPT input — 44px + text-base**

Localizar el `<input>` o `<textarea>` de prompt. Añadir `min-h-[44px] text-base` (text-base evita zoom automático iOS).

- [ ] **Step 2: OVABuildGPT action buttons — 44px**

Localizar botones de acción. Añadir `min-h-[44px]`.

- [ ] **Step 3: ValerioPanel chat input — inputMode**

Localizar el input de chat. Añadir `inputMode="text" autoCapitalize="sentences"`.

- [ ] **Step 4: Commit**

```bash
git add src/components/IALab/OVABuildGPT/index.jsx src/components/IALab/IALabValerioPanel/index.jsx
git commit -m "fix(mobile): OVA BuildGPT + Valerio input types and touch targets"
```

---

### Task 12: QA Mobile — Playwright Tests

**Files:**
- Create: `e2e/mobile.spec.js`

- [ ] **Step 1: Crear e2e/mobile.spec.js**

```js
import { test, expect } from '@playwright/test';

test.describe('iLAB Mobile Responsive', () => {
  test('no horizontal scroll on iPhone 12/13 (390x844)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/ialab');
    await page.waitForLoadState('networkidle');
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });

  test('no horizontal scroll on iPhone SE (375x812)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/ialab');
    await page.waitForLoadState('networkidle');
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });

  test('touch targets respect 44px minimum', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/ialab');
    await page.waitForLoadState('networkidle');
    const smallButtons = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button, a[href], [role="button"]');
      const violations = [];
      buttons.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.width < 44 && rect.height < 44 && rect.width > 0 && rect.height > 0) {
          violations.push({
            tag: el.tagName,
            text: (el.textContent || '').trim().substring(0, 30),
            w: Math.round(rect.width),
            h: Math.round(rect.height),
          });
        }
      });
      return violations;
    });
    expect(smallButtons.length).toBe(0);
  });

  test('PWA manifest loads correctly', async ({ page }) => {
    await page.goto('/ialab');
    const manifest = await page.evaluate(() => {
      const link = document.querySelector('link[rel="manifest"]');
      return link ? link.getAttribute('href') : null;
    });
    expect(manifest).toBeTruthy();
  });

  test('tablet layout works on iPad Mini (768x1024)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/ialab');
    await page.waitForLoadState('networkidle');
    const sidebar = page.locator('[data-tour="tour-sidebar"]');
    await expect(sidebar).toBeVisible();
  });
});
```

- [ ] **Step 2: Verificar que los tests pasan**

```bash
npx playwright test e2e/mobile.spec.js --project=chromium
```

- [ ] **Step 3: Commit**

```bash
git add e2e/mobile.spec.js
git commit -m "test(mobile): add Playwright tests for responsive layout"
```

---

### Task 13: Build Verification

- [ ] **Step 1: Build con optimizaciones**

```bash
npm run build
```

Verificar que build pasa sin errores.

- [ ] **Step 2: Verificar chunks**

```bash
ls -la dist/assets/ | grep -E 'pdf|chart|vendor'
```

Verificar que pdf-vendor y charts-vendor existen como chunks separados.

- [ ] **Step 3: Commit final**

```bash
git add -A
git commit -m "chore: mobile redesign implementation complete"
```
