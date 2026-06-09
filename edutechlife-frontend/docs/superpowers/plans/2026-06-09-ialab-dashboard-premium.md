# IALabDashboard Premium — Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rediseñar IALabDashboard con hero full-width + stats flotantes glassmorphism + animaciones 3D spring + timer badge + módulos navegables, sin perder ningún dato existente.

**Architecture:** Modificación exclusiva de `IALabDashboard.jsx`. Se reestructura el layout en 3 zonas: Hero (con stats integradas) → Tabs → Module rows. Se actualizan los 3 estados (no progress, in progress, completed). Se elimina TimerBar (reemplazado por badge inline). Se mantienen BgPattern, MiniStat, ModuleRow helper components pero se les agregan animaciones 3D.

**Tech Stack:** React 18 + framer-motion 12 + Tailwind 3.4 + Recharts 3. Sin nuevas dependencias.

---

### Task 1: Actualizar Helper Components (MiniStat, TimerBar, ModuleRow)

**File:** `edutechlife-frontend/src/components/IALab/IALabDashboard.jsx`

- [ ] **Step 1: Eliminar TimerBar y agregar TimerBadge inline**

Reemplazar el componente `TimerBar` (que renderiza una barra de progreso horizontal) por un badge inline que se usa dentro del hero. Eliminar la función TimerBar completa.

- [ ] **Step 2: Actualizar MiniStat con glassmorphism y animación 3D**

Cambiar el estilo de MiniStat: fondo `bg-white/10 dark:bg-white/10` con `backdrop-blur-xl`, borde `border border-white/10`, hover con `whileHover={{ scale: 1.05, y: -4 }}`. Añadir `style={{ perspective: 600 }}` al contenedor del icono.

- [ ] **Step 3: Actualizar ModuleRow con animaciones 3D spring**

Agregar a ModuleRow:
- Contenedor principal: `whileHover={{ x: 4, scale: 1.01 }} transition={{ type: 'spring', stiffness: 300, damping: 16 }}`
- Icono: `whileHover={{ scale: 1.2, rotateY: 15 }} transition={{ type: 'spring', stiffness: 400, damping: 10 }}`
- Botón Continuar: `whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} transition={{ type: 'spring', stiffness: 500, damping: 12 }}`
- Fila activa: añadir `border-l-4 border-l-corporate` y sombra `shadow-[0_4px_16px_rgba(0,188,212,0.12)]`

---

### Task 2: Rediseñar Hero — Estado "En Progreso" (principal)

**File:** `edutechlife-frontend/src/components/IALab/IALabDashboard.jsx`

- [ ] **Step 1: Reestructurar Hero section**

El hero actual (líneas 321-353) debe reemplazarse por:

```jsx
<section onClick={doNavigate} className="relative overflow-hidden bg-gradient-to-r from-petroleum via-petroleum-dark to-corporate rounded-2xl shadow-lg cursor-pointer group">
  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.05] transition-colors duration-300" />
  <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/[0.06] rounded-full blur-3xl" />

  {/* Progress bar */}
  <div className="px-6 pt-5 pb-3">
    <div className="flex items-center justify-between mb-1">
      <span className="text-xs font-medium text-white/70">Progreso del curso</span>
      <span className="text-xs font-bold text-white">{courseProgress}%</span>
    </div>
    <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
      <div className={`h-full bg-gradient-to-r ${progressBarColor} rounded-full transition-all duration-1000`} style={{ width: `${courseProgress}%` }} />
    </div>
  </div>

  {/* CTA row */}
  <div className="flex items-center justify-between px-6 pb-4 pt-2">
    <div className="flex items-center gap-3">
      <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.25, rotateY: 20 }} style={{ perspective: 400 }}
        className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center group-hover:bg-white/30 transition-colors">
        <Icon name={actionIcon} className="w-5 h-5 text-white" />
      </motion.div>
      <div className="text-left">
        <p className="text-sm font-bold text-white">{suggestedAction.label}</p>
        <p className="text-xs text-white/60">{t('route.continue')}</p>
      </div>
    </div>
    <div className="flex items-center gap-1 bg-white/10 backdrop-blur rounded-lg px-3 py-1.5">
      <Icon name="fa-clock" className="w-3 h-3 text-white/50" />
      <span className="text-[10px] font-medium text-white/50">Auto en</span>
      <span className="text-sm font-bold text-white">{Math.ceil((1 - idlePct / 100) * (IDLE_TIMEOUT / 1000))}s</span>
    </div>
  </div>

  {/* Stats flotantes glassmorphism */}
  <div className="grid grid-cols-3 gap-2 px-6 pb-5">
    <div className="bg-white/10 backdrop-blur-xl rounded-xl py-3 px-2 text-center border border-white/[0.06]">
      <Icon name="fa-star" className="w-4 h-4 text-white/70 mx-auto mb-1" />
      <p className="text-lg font-bold text-white">{xp?.toLocaleString() || '0'}</p>
      <p className="text-[9px] text-white/50 uppercase tracking-wider">XP</p>
    </div>
    <div className="bg-white/10 backdrop-blur-xl rounded-xl py-3 px-2 text-center border border-white/[0.06]">
      <Icon name="fa-fire" className="w-4 h-4 text-white/70 mx-auto mb-1" />
      <p className="text-lg font-bold text-white">{streak || 0}</p>
      <p className="text-[9px] text-white/50 uppercase tracking-wider">{t('streak.days')}</p>
    </div>
    <div className="bg-white/10 backdrop-blur-xl rounded-xl py-3 px-2 text-center border border-white/[0.06]">
      <Icon name="fa-chart-line" className="w-4 h-4 text-white/70 mx-auto mb-1" />
      <p className="text-lg font-bold text-white">{stats.avgScore}%</p>
      <p className="text-[9px] text-white/50 uppercase tracking-wider">Score</p>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Agregar animación 3D al hero completo**

Envolver el section en un `motion.section` en lugar de `section`:

```jsx
<motion.section
  whileHover={{ scale: 1.015, rotateY: 1.5 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: 'spring', stiffness: 350, damping: 16 }}
  style={{ perspective: 800 }}
  onClick={doNavigate}
  className="relative overflow-hidden bg-gradient-to-r from-petroleum via-petroleum-dark to-corporate rounded-2xl shadow-lg cursor-pointer group origin-center"
>
```

---

### Task 3: Rediseñar Hero — Estado "Sin Progreso" (nuevo usuario)

**File:** `edutechlife-frontend/src/components/IALab/IALabDashboard.jsx`

- [ ] **Step 1: Simplificar hero de bienvenida**

Reemplazar la sección de bienvenida (líneas 227-240) con glassmorphism stats integradas y animación floating en el rocket:

```jsx
<section className="relative overflow-hidden bg-gradient-to-br from-petroleum via-petroleum-dark to-[#003549] rounded-2xl p-8 text-center shadow-xl">
  <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
    className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-3">
    <Icon name="fa-rocket" className="w-6 h-6 text-white" />
  </motion.div>
  <h2 className="text-xl font-bold text-white mb-1">¡Bienvenido a IALab!</h2>
  <p className="text-sm text-white/70 mb-5 max-w-md mx-auto">Comienza tu viaje por la inteligencia artificial.</p>
  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
    transition={{ type: 'spring', stiffness: 500, damping: 14 }}
    onClick={() => navigate('/ialab/1')}
    className="inline-flex items-center gap-2 bg-white text-petroleum font-bold px-7 py-3.5 rounded-xl shadow-lg">
    <Icon name="fa-play-circle" className="w-5 h-5" />
    {t('route.start')}
  </motion.button>
  {/* Stats en glassmorphism integradas */}
  <div className="grid grid-cols-3 gap-2 mt-6">
    <div className="bg-white/10 backdrop-blur rounded-xl py-3 text-center border border-white/[0.06]">
      <Icon name="fa-star" className="w-4 h-4 text-white/70 mx-auto mb-1" />
      <p className="text-lg font-bold text-white">0</p>
      <p className="text-[9px] text-white/50 uppercase tracking-wider">XP</p>
    </div>
    <div className="bg-white/10 backdrop-blur rounded-xl py-3 text-center border border-white/[0.06]">
      <Icon name="fa-fire" className="w-4 h-4 text-white/70 mx-auto mb-1" />
      <p className="text-lg font-bold text-white">0</p>
      <p className="text-[9px] text-white/50 uppercase tracking-wider">{t('streak.days')}</p>
    </div>
    <div className="bg-white/10 backdrop-blur rounded-xl py-3 text-center border border-white/[0.06]">
      <Icon name="fa-chart-line" className="w-4 h-4 text-white/70 mx-auto mb-1" />
      <p className="text-lg font-bold text-white">—</p>
      <p className="text-[9px] text-white/50 uppercase tracking-wider">Score</p>
    </div>
  </div>
</section>
```

Eliminar la sección separada de MiniStat (líneas 242-246) y el texto "Comienza el Módulo 1..." (línea 248).

---

### Task 4: Rediseñar Hero — Estado "Completado"

**File:** `edutechlife-frontend/src/components/IALab/IALabDashboard.jsx`

- [ ] **Step 1: Hero de completado con trophy + stats integradas**

Reemplazar sección de completado (líneas 255-269) y stats separadas (líneas 271-275):

```jsx
<section className="relative overflow-hidden bg-gradient-to-br from-petroleum/[0.03] to-corporate/[0.03] rounded-2xl border border-petroleum/10 p-6 sm:p-8 text-center">
  <div className="absolute -top-10 -right-10 w-40 h-40 bg-petroleum/[0.05] rounded-full blur-3xl" />
  <motion.div animate={{ y: [0, -4, 0], scale: [1, 1.03, 1] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    className="w-14 h-14 rounded-full bg-gradient-to-br from-corporate to-petroleum flex items-center justify-center mx-auto mb-3 shadow-lg shadow-corporate/30">
    <Icon name="fa-trophy" className="w-6 h-6 text-white" />
  </motion.div>
  <h2 className="text-xl font-bold text-petroleum">{t('route.course_complete')}</h2>
  <p className="text-sm text-petroleum/70 mt-1">Explora otros cursos o certificaciones</p>
  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
    transition={{ type: 'spring', stiffness: 500, damping: 14 }}
    onClick={() => navigate('/ialab/certificate')}
    className="mt-4 inline-flex items-center gap-2 bg-white text-petroleum font-semibold px-5 py-2.5 rounded-xl border border-petroleum/20 shadow-sm">
    <Icon name="fa-certificate" className="w-4 h-4" />
    {t('route.view_certificate')}
  </motion.button>
  {/* Stats integradas */}
  <div className="grid grid-cols-3 gap-2 mt-6">
    <div className="bg-white/80 backdrop-blur rounded-xl py-3 text-center border border-petroleum/10 shadow-sm">
      <Icon name="fa-star" className="w-4 h-4 text-corporate mx-auto mb-1" />
      <p className="text-lg font-bold text-petroleum">{xp?.toLocaleString() || '0'}</p>
      <p className="text-[9px] text-petroleum/50 uppercase tracking-wider">XP</p>
    </div>
    ...
  </div>
</section>
```

---

### Task 5: Rediseñar Tabs + Module Rows (estado "En Progreso")

**File:** `edutechlife-frontend/src/components/IALab/IALabDashboard.jsx`

- [ ] **Step 1: Actualizar Tabs con spring animation**

Reemplazar tabs (líneas 364-383) con:

```jsx
<div className="flex gap-2 mb-4">
  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}
    transition={{ type: 'spring', stiffness: 500, damping: 14 }}
    onClick={() => setActiveTab('modules')}
    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
      activeTab === 'modules'
        ? 'bg-gradient-to-r from-petroleum to-corporate text-white shadow-md'
        : 'bg-slate-100/80 text-slate-500 hover:text-slate-700'
    }`}>
    <Icon name="fa-layer-group" className="w-4 h-4" />
    {t('dashboard.modules_progress', { completed: stats.completed })}
  </motion.button>
  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}
    transition={{ type: 'spring', stiffness: 500, damping: 14 }}
    onClick={() => setActiveTab('activity')}
    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
      activeTab === 'activity'
        ? 'bg-gradient-to-r from-petroleum to-corporate text-white shadow-md'
        : 'bg-slate-100/80 text-slate-500 hover:text-slate-700'
    }`}>
    <Icon name="fa-chart-line" className="w-4 h-4" />
    {t('dashboard.activity_trends')}
  </motion.button>
</div>
```

- [ ] **Step 2: Module rows con stagger entrance**

Mantener el mapeo de módulos pero agregar `motion.div` wrapper con stagger:

```jsx
{activeTab === 'modules' && (
  <>
    {modules.filter(m => m.score > 0).length >= 2 && (
      <div className="mb-4 h-28">
        {/* BarChart existente - sin cambios */}
      </div>
    )}
    <div className="space-y-2">
      {modules.map((mod, index) => (
        <motion.div key={mod.id} initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.06, duration: 0.3, ease: 'easeOut' }}>
          <ModuleRow id={mod.id} title={moduleTitles[mod.id]}
            icon={moduleIcons[mod.id]} color={moduleColors[mod.id]}
            approved={mod.approved} unlocked={mod.unlocked} score={mod.score}
            examScore={mod.examScore} challengeScore={mod.challengeScore}
            onNavigate={() => navigate(`/ialab/${mod.id}`)} />
        </motion.div>
      ))}
    </div>
  </>
)}
```

- [ ] **Step 3: Tab Actividad (sin cambios estructurales)**

Mantener el contenido actual del tab Actividad (weekly chart, forecast, time stats). Solo agregar `motion.div` con fade-in:

```jsx
{activeTab === 'activity' && (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
    {/* contenido existente de actividad */}
  </motion.div>
)}
```

---

### Task 6: Unificar y Limpiar

**File:** `edutechlife-frontend/src/components/IALab/IALabDashboard.jsx`

- [ ] **Step 1: Eliminar secciones duplicadas de MiniStat**

Las 3 secciones de `<section className="grid grid-cols-3 gap-3">` con MiniStat (líneas 242-246, 271-275, 356-360) deben eliminarse porque las stats ahora están integradas dentro del hero.

- [ ] **Step 2: Compactar código repetitivo**

Unificar los estilos de tabs repetidos usando una variable `tabClass` o función helper inline.

- [ ] **Step 3: Verificar balance de etiquetas**

Correr verificación de balance después de todos los cambios.

---

### Task 7: Build Check y Commit

- [ ] **Step 1: Syntax check**

```bash
node -e "require('@babel/core').parseSync(require('fs').readFileSync('src/components/IALab/IALabDashboard.jsx','utf8'),{presets:['@babel/preset-react'],filename:'IALabDashboard.jsx'}); console.log('VALID')"
```

- [ ] **Step 2: Balance check**

```bash
for f in src/components/IALab/IALabDashboard.jsx; do node -e "const c=require('fs').readFileSync('$f','utf8');let d=0,ok=true;for(const ch of c){if(ch==='{')d++;if(ch==='}'){d--;if(d<0){ok=false;break}};if(ch==='(')d++;if(ch===')'){d--;if(d<0){ok=false;break}}}console.log('$f:',ok&&d===0?'balanced':'imbalanced ('+d+')')" 2>&1; done
```

- [ ] **Step 3: Verificar tamaño final**

```bash
wc -l src/components/IALab/IALabDashboard.jsx
# Objetivo: < 550 líneas
```

- [ ] **Step 4: Commit**

```bash
git add edutechlife-frontend/src/components/IALab/IALabDashboard.jsx \
        edutechlife-frontend/docs/superpowers/specs/2026-06-09-ialab-dashboard-premium-design.md
git commit -m "feat(ialab): dashboard premium Opción B - hero+stats glassmorphism, animaciones 3D, timer badge"
```
