# iLAB Mobile-First Redesign — Design Spec

**Goal:** Subir Mobile/Responsive de 7.0 → 9.0+ mediante refactor completo mobile-first sin alterar funcionalidad ni características de iLAB.

**Principio rector:** 44px mínimo en todo target táctil, safe areas reales, device-aware loading, OVA responsive.

---

## Fase C1: Infraestructura Base Mobile

### 1.1 Safe Areas CSS
- Archivo: `src/design-system/tokens.css`
- Añadir custom properties `--safe-area-top`, `--safe-area-bottom`, `--safe-area-left`, `--safe-area-right`
- Mapear con `env(safe-area-inset-*)` con fallback 0px

### 1.2 Clases Utilitarias Mobile
- Archivo: `src/components/IALab/IALab.css`
- `.safe-area-top { padding-top: var(--safe-area-top) }`
- `.safe-area-bottom { padding-bottom: var(--safe-area-bottom) }`
- `.touch-manipulation { touch-action: manipulation }`

### 1.3 Touch-Action Global
- Archivo: `src/components/IALab/IALab.jsx`
- Añadir clase `touch-manipulation` al div raíz `flex-col h-dvh`

### 1.4 MobileHeader Safe Areas
- Archivo: `src/components/IALab/shared/MobileHeader.jsx`
- Reemplazar clase `safe-area-top` (muerta) por `pt-[calc(var(--safe-area-top)+theme(spacing.4))]`

### 1.5 Design Token Touch Target
- Archivo: `src/components/IALab/constants/styles.js`
- Exportar `TOUCH_TARGET_MIN = 'min-w-[44px] min-h-[44px]'`

---

## Fase C2: Touch Targets Audit & Fix

**Regla:** Todo `<button>`, `<a>`, `role="button"`, `onClick` handler debe tener mínimo `min-w-[44px] min-h-[44px]` en viewports < 768px.

### 2.1 IALabMobileMenu.jsx
| Elemento | Fix |
|---|---|
| Profile avatar es clickable | `min-w-[44px] min-h-[44px]` |
| Cerrar sesión button `p-2` | `min-w-[44px] min-h-[44px] p-2.5` |
| Module item buttons `p-2.5` | `min-h-[44px]` |

### 2.2 OVAIntroPrompt.jsx
| Elemento | Fix |
|---|---|
| Menu toggle `p-2` | `min-w-[44px] min-h-[44px] p-2.5` |
| Menu close (X) `p-1.5` | `min-w-[44px] min-h-[44px] p-2.5` |
| Navigation prev/next `p-3` | `min-w-[44px] min-h-[44px]` |
| Grid `grid-cols-5` en mobile | `grid-cols-3 sm:grid-cols-5` |

### 2.3 Foro (forum/*.jsx)
- Action buttons en PostCard, Comment: `min-w-[44px] min-h-[44px]`
- Search button: `min-w-[44px] min-h-[44px]`
- Filter pills: `min-h-[44px] py-0` en vez de `py-1`

### 2.4 Quiz, Challenges, Shared Components
- Quiz option buttons: `min-h-[44px]`
- Challenges step nav: `min-h-[44px]`
- TabPills: `min-h-[44px]`
- OVAValerioBar: mic+send `min-w-[44px] min-h-[44px]`
- ToastNotification close: `min-w-[44px] min-h-[44px]`
- EmptyState CTA: `min-h-[44px]`
- Modales close button: `min-w-[44px] min-h-[44px]`

---

## Fase C3: Device-Aware Code Splitting

### 3.1 Hook `useDeviceType`
- Archivo: `src/hooks/useDeviceType.js`
- Detecta `window.innerWidth < 768` via `matchMedia`
- Retorna `{ isMobile, isTablet, isDesktop }`

### 3.2 PDF Viewer Conditional Loading
- En mobile, pdfjs-dist (1MB) no se carga a menos que usuario haga clic explícito
- Mostrar placeholder con opción "Ver PDF" que carga bajo demanda

### 3.3 Charts Conditional Loading
- recharts (394KB) solo carga en desktop
- En mobile, mostrar tabla simple de datos en lugar de gráfico

### 3.4 Vite Chunk Config
- Validar que `pdf-vendor` y `charts-vendor` ya estén separados en `vite.config.optimized.js`

---

## Fase C4: HitSlop + Touch Feedback

### 4.1 Componente `TouchableIcon`
- Archivo: `src/components/IALab/shared/TouchableIcon.jsx`
- Props: `icon`, `label` (aria-label), `onClick`, `size` (sm/md/lg)
- HitSlop via `::before` pseudoelemento (-8px inset)
- Press feedback: `active:scale-95 transition-transform duration-100`
- Siempre `min-w-[44px] min-h-[44px]`

### 4.2 Migración de icon buttons pequeños
Reemplazar con TouchableIcon en:
- IALabMobileMenu, MobileHeader, OVAIntroPrompt, Foro, Modales

### 4.3 Press Feedback en botones existentes
Añadir `active:scale-[0.97] transition-transform duration-100` en botones no cubiertos por TouchableIcon

---

## Fase C5: Input Types + Teclado Móvil

| Archivo | Input | Type |
|---|---|---|
| `IALabForumSearchBar.jsx` | search | `search inputMode="search"` |
| `IALabForumCreatePost.jsx` | title | `text autoCapitalize="sentences"` |
| `IALabForumRichEditor.jsx` | content | textarea `autoCapitalize="sentences"` |
| `IALabValerioPanel/index.jsx` | chat | `text inputMode="text"` |
| `challenges/*.jsx` | code input | `text inputMode="text" autoComplete="off"` |
| `IALabQuizModal/index.jsx` | numeric answer | `number inputMode="numeric"` |

---

## Fase C6: OVA Responsive

### 6.1 OVAIntroPrompt
- Grid `grid-cols-5` → `grid-cols-3 sm:grid-cols-5`
- Menu lateral `w-[260px]` → `w-full max-w-[320px]` en mobile
- Botones navegación: `min-w-[44px] min-h-[44px]`

### 6.2 OVABuildGPT + OVAs Legacy
- Input prompt: `min-h-[44px] text-base`
- Navegación: solo añadir `min-h-[44px]` a botones
- Contenedor: verificar `overflow-y-auto` + safe padding

---

## Fase C7: QA Mobile

### 7.1 Playwright Tests
- Archivo: `e2e/mobile.spec.js`
- Tests: no horizontal scroll en 375x812, touch targets ≥44px, layout tablet 1024x1366

### 7.2 Checklist Manual
- [ ] 44px touch targets
- [ ] Sin horizontal scroll en 375/390/414/768px
- [ ] Teclado no oculta inputs
- [ ] Landscape usable
- [ ] PWA add-to-home-screen funciona
- [ ] Safe areas: contenido no bajo notch
- [ ] Dark mode: contraste ok en mobile
- [ ] Press animation visible
