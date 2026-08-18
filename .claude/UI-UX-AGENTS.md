# 🎨 UI/UX Agents PRO - EdutechLife

**Nivel:** PRO-MAX  
**Agentes Especializados:** 4  
**Skills Disponibles:** 5+

---

## 🤖 Los 4 Agentes UI/UX Principales

### 1. **UI Engineer** (Frontend UI Engineering)
```javascript
Agent({
  subagent_type: "agent-skills:frontend-ui-engineering",
  name: "ui-engineer",
  prompt: `
    Diseña/implementa componente: [NOMBRE]
    
    Requerimientos:
    - WCAG 2.1 AA accessibility compliance
    - Mobile-first responsive (320px-1440px)
    - Dark mode support
    - Keyboard navigation (Tab, Enter, Escape)
    - Loading/Error/Empty states
    
    Deliverables:
    - React component con props bien documentados
    - Tailwind CSS (solo utility classes)
    - ARIA labels donde necesario
    - Screenshot light/dark mode
  `,
  run_in_background: true
})
```

**Cuándo usarla:**
- Componentes nuevos
- Rediseño de componentes
- Issues de UI/UX
- Cambios de design system

**Tiempo:** 1-2 horas por componente

---

### 2. **Performance Visual Lead** (Performance Optimization)
```javascript
Agent({
  subagent_type: "agent-skills:performance-optimization",
  name: "perf-visual",
  prompt: `
    Audita performance visual de [PÁGINA/COMPONENTE]
    
    Mide:
    - Core Web Vitals (LCP, INP, CLS)
    - Bundle size (CSS, JS)
    - Image optimization
    - Animation performance (60fps)
    
    Deliverables:
    - Before/after Core Web Vitals
    - Optimization recommendations
    - Implementation strategy
  `,
  run_in_background: true
})
```

**Cuándo usarla:**
- Dashboard lento
- Performance regression
- Bundle size creció
- Animaciones jank

**Tiempo:** 1-3 horas

---

### 3. **Data Visualization Expert** (dataviz)
```javascript
Agent({
  name: "dataviz-expert",
  prompt: `
    Crea visualización profesional de [DATA]
    
    Requerimientos:
    - Usa Recharts (React library)
    - Responsive (mobile-first)
    - Dark mode support
    - Accesible (color-blind safe palettes)
    - Interactive (tooltips, legend)
    
    Datos de ejemplo:
    [PASTE DATA STRUCTURE]
    
    Deliverables:
    - React component
    - CSS (Tailwind)
    - Screenshot light/dark mode
  `,
  run_in_background: true
})
```

**Cuándo usarla:**
- Dashboards con gráficas
- Analytics/Reports
- Real-time data visualization
- KPI cards

**Tiempo:** 2-4 horas

---

### 4. **Accessibility Auditor** (Security Auditor adaptado para a11y)
```javascript
Agent({
  subagent_type: "agent-skills:security-auditor",
  name: "a11y-auditor",
  prompt: `
    Audita accesibilidad WCAG 2.1 AA de [COMPONENTE/PÁGINA]
    
    Verifica:
    - Color contrast (4.5:1 para normal text)
    - Keyboard navigation (Tab order)
    - Screen reader compatibility (ARIA labels)
    - Touch targets (≥44px en mobile)
    - Focus indicators (visible)
    - Form labels (cada input tiene <label>)
    
    Deliverables:
    - Lista de issues encontrados
    - Severity (Critical, High, Medium, Low)
    - Fix recommendations
    - Estimated effort
  `,
  run_in_background: true
})
```

**Cuándo usarla:**
- Pre-launch audit
- Después de rediseño
- Complaints de usuarios
- Compliance requerido

**Tiempo:** 2-3 horas

---

## 🎯 Workflows de Uso

### Workflow A: Componente Nuevo (PRO)
```
1. Especificación clara (nombre, props, states)
   ↓
2. UI Engineer implementa
   Agent({ subagent_type: "agent-skills:frontend-ui-engineering", ... })
   ↓
3. A11y Auditor valida accesibilidad
   Agent({ name: "a11y-auditor", prompt: "Audita [COMPONENTE]" })
   ↓
4. Perf Visual Lead optimiza
   Agent({ subagent_type: "agent-skills:performance-optimization", ... })
   ↓
5. Code Review
   /code-review --level high
   ↓
6. Merge & Deploy
```
**Tiempo Total:** 3-4 horas

---

### Workflow B: Dashboard con Visualización
```
1. Data schema definido
   ↓
2. DataViz Expert crea gráficas
   Agent({ name: "dataviz-expert", ... })
   ↓
3. UI Engineer integra en layout
   Agent({ subagent_type: "agent-skills:frontend-ui-engineering", ... })
   ↓
4. A11y Auditor valida (colors accessible)
   ↓
5. Perf Lead verifica CWV
   ↓
6. Deploy
```
**Tiempo Total:** 4-6 horas

---

### Workflow C: Performance Optimization
```
1. Identificar problema (LCP lento, bundle grande, etc)
   ↓
2. Perf Lead audita
   Agent({ subagent_type: "agent-skills:performance-optimization", ... })
   ↓
3. UI Engineer implementa optimizaciones
   - Image optimization
   - Code splitting
   - Animation tuning
   ↓
4. Verify Core Web Vitals
   ↓
5. Deploy
```
**Tiempo Total:** 2-3 horas

---

### Workflow D: Auditoría Accesibilidad Completa
```
1. A11y Auditor escanea app
   Agent({ name: "a11y-auditor", ... })
   ↓
2. UI Engineer arregla issues
   - Keyboard navigation
   - Color contrast
   - ARIA labels
   - Focus management
   ↓
3. QA testa con screen reader
   ↓
4. Final validation
   ↓
5. Deploy
```
**Tiempo Total:** 4-6 horas

---

## 🛠️ Comandos Rápidos

### Run UI Audit
```bash
npm run ui:full
# Ejecuta todos los audits:
# - ui:audit (design system)
# - ui:a11y (accesibilidad)
# - ui:colors (color contrast)
# - ui:performance (visual performance)
```

### Individual Audits
```bash
npm run ui:audit         # Design system consistency
npm run ui:a11y          # Accessibility check
npm run ui:colors        # Color contrast validation
npm run ui:images        # Image optimization
npm run ui:performance   # Visual performance metrics
```

---

## 📊 Casos de Uso Reales

### Caso 1: Rediseñar Dashboard IALab
```javascript
// Paso 1: UI Engineer diseña nuevo layout
Agent({
  subagent_type: "agent-skills:frontend-ui-engineering",
  name: "ui-dashboard",
  prompt: `
    Rediseña IALab Dashboard con:
    - Dark mode elegante
    - Responsive (mobile-first)
    - Componentes modular
    - Loading states
    - WCAG 2.1 AA compliant
  `
})

// Paso 2: DataViz Expert crea gráficas
Agent({
  name: "dataviz-expert",
  prompt: `
    Visualiza progreso del usuario:
    - Módulos completados (bar chart)
    - Tiempo gastado por módulo (line chart)
    - Quiz scores (gauge/meter)
    - Certificaciones (badges)
  `
})

// Paso 3: A11y Auditor valida
Agent({
  name: "a11y-auditor",
  prompt: "Audita accesibilidad de nuevo dashboard"
})

// Paso 4: Perf verifica Core Web Vitals
/code-review --performance
```

---

### Caso 2: Crear Sistema de Colores Dark/Light
```javascript
Agent({
  subagent_type: "agent-skills:frontend-ui-engineering",
  name: "color-system",
  prompt: `
    Define color system para EdutechLife:
    
    Light mode:
    - Primary: #0F766E (teal)
    - Secondary: #1E293B (dark blue)
    - Accent: #06B6D4 (cyan)
    
    Dark mode:
    - Primary: #004B63 (dark teal)
    - Secondary: #0A3550 (darker blue)
    - Accent: #00D9FF (bright cyan)
    
    Valida:
    - WCAG AA contrast (4.5:1)
    - Colorblind safe
    - Tokens CSS (--color-*)
  `
})
```

---

### Caso 3: Optimizar Imágenes & Animaciones
```javascript
Agent({
  subagent_type: "agent-skills:performance-optimization",
  name: "perf-images",
  prompt: `
    Optimiza performance visual:
    
    Imágenes:
    - Convierte a WebP/AVIF
    - Lazy loading
    - Responsive srcset
    - Sizes attribute
    
    Animaciones:
    - Usa CSS (no JS)
    - GPU acceleration (transform, opacity)
    - 60fps target
    - Reduce motion support
  `
})
```

---

## 📋 UI/UX Checklist Pre-Launch

- [ ] Design System
  - [ ] Colors defined (light & dark)
  - [ ] Typography scale defined
  - [ ] Spacing scale consistent
  - [ ] All colors have CSS tokens

- [ ] Responsive Design
  - [ ] Mobile (320px-480px)
  - [ ] Tablet (481px-768px)
  - [ ] Desktop (769px-1440px)
  - [ ] All breakpoints tested

- [ ] Dark Mode
  - [ ] Light mode complete
  - [ ] Dark mode complete
  - [ ] Colors contrast OK
  - [ ] Toggle works

- [ ] Accessibility (WCAG 2.1 AA)
  - [ ] Color contrast 4.5:1
  - [ ] Keyboard navigation working
  - [ ] All images have alt text
  - [ ] Form labels present
  - [ ] ARIA labels where needed
  - [ ] Focus indicators visible
  - [ ] Touch targets ≥44px

- [ ] Performance Visual
  - [ ] LCP < 2.5s
  - [ ] INP < 200ms
  - [ ] CLS < 0.1
  - [ ] Bundle < 200KB
  - [ ] Images optimized
  - [ ] Animations 60fps

- [ ] States Designed
  - [ ] Loading state
  - [ ] Error state
  - [ ] Empty state
  - [ ] Success state
  - [ ] Hover/Focus states

- [ ] Testing
  - [ ] Visual regression test
  - [ ] Accessibility audit (axe)
  - [ ] Manual screen reader test
  - [ ] Manual keyboard navigation
  - [ ] Cross-browser tested

---

## 🎓 Recursos PRO

### Color Accessibility
```
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Color Contrast Analyzer: https://www.tpgi.com/color-contrast-checker/
- Colorblind simulation: https://www.color-blindness.com/coblis-color-blindness-simulator/
```

### Performance
```
- Web Vitals: https://web.dev/vitals/
- PageSpeed Insights: https://pagespeed.web.dev/
- Lighthouse: DevTools → Lighthouse tab
```

### Accessibility
```
- WCAG 2.1 Quickref: https://www.w3.org/WAI/WCAG21/quickref/
- A11y Project: https://www.a11yproject.com/
- WebAIM: https://webaim.org/
```

### Design Tools
```
- Figma: https://www.figma.com
- Coolors: https://coolors.co
- Figma to HTML: https://www.figma.com/dev-mode
```

---

**Status:** ✅ UI/UX AGENTS READY

Comienza: `npm run ui:full` para audit inicial
