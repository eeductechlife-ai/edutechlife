# IALab Component Guide - SaaS Premium Platform

## Overview
IALab.jsx es el componente principal de la plataforma SaaS Premium de Edutechlife, transformado de estilo neo-brutalista a estética elite (Linear/Stripe/Framer) con sistema pedagógico estructurado.

## Architecture

### Layout Structure (25%/75%)
```
┌─────────────────────────────────────┐
│  Header Global (User Profile)       │
├─────────────┬───────────────────────┤
│ Sidebar     │ Main Content          │
│ (25%)       │ (75%)                 │
│ Navigation  │ Module Content        │
│             │ Evaluation/Certificate│
└─────────────┴───────────────────────┘
```

### Core Components

#### 1. Header Global (lines 123-140)
- **Botón de Perfil de Usuario:** Dropdown funcional con opciones
- **Estilo:** `rounded-[28px] p-4 shadow-[0_30px_60px_rgba(0,0,0,0.05)]`
- **Colores:** `bg-[#004B63] text-white hover:bg-[#00374A]`

#### 2. Module Header (lines 438-492)
- **Objetivo Central:** Icono Lightbulb con alta legibilidad
- **Jerarquía Visual:**
  - H1: `text-[24px] font-bold text-[#00374A]`
  - H2: `text-[20px] font-semibold text-slate-600`
  - H3: `text-[18px] font-medium text-slate-500`

#### 3. Evaluation Button Logic (lines 464-493)
```javascript
// Lógica de bloqueo secuencial
const isEvaluationLocked = (currentModule) => {
  if (currentModule === 1) return false; // Módulo 1 siempre accesible
  return !completedModules.includes(currentModule - 1);
};
```

#### 4. Certificate Button (lines 496-504)
- **Visibilidad:** Solo Módulo 5
- **Estilo:** Degradado dorado `bg-gradient-to-r from-yellow-400 to-yellow-600`
- **Tooltip:** "¡Felicidades! Has completado todos los módulos"

#### 5. Sidebar Navigation (lines 343-389)
- **Navegación Libre:** Siempre accesible
- **Candados Visuales:** Iconos de candado para módulos no completados
- **Estado Activo:** `bg-[#004B63]/10 border-l-4 border-[#004B63]`

#### 6. Dashboard Grid Layout (lines 767-996)
- **Estructura:** Grid de 2 columnas responsive `grid-cols-1 lg:grid-cols-2`
- **Columna Izquierda:** Desafío del Curso con botones naranja/amarillo
- **Columna Derecha:** Muro de Insights (comunidad premium)
- **Responsive:** `max-w-[calc(100%-2rem)] mx-auto` para alineación perfecta

#### 7. Muro de Insights (lines 799-996)
- **Estado:** Expandible/colapsable con `isInsightsExpanded`
- **Contenido:** Feed tipo Discord Premium/LinkedIn de Élite
- **Interacciones:** Upvotes, comentarios, badges de verificación
- **Diseño:** `flex flex-col` para mantener simetría de columna

#### 8. AI Prompt Synthesizer (lines 1159-1197)
- **Framework RTF:** Role-Task-Format para prompts estructurados
- **Feedback Técnico:** Validación en tiempo real
- **Interactividad:** Botón de copia y aplicación práctica

## Design System

### Typography Scale (Base 16px)
```
H1: 24px (1.5rem) - font-bold
H2: 20px (1.25rem) - font-semibold  
H3: 18px (1.125rem) - font-medium
Body: 14px (0.875rem) - font-normal
Small: 12px (0.75rem) - font-normal
X-Small: 11px (0.6875rem) - font-normal (solo etiquetas)
```

### Color Palette
- **Primary:** `#004B63` (Azul Petróleo)
- **Secondary:** `#00BCD4` (Cyan)
- **Text Primary:** `#00374A`
- **Text Secondary:** `#64748B` (slate-600)
- **Text Tertiary:** `#94A3B8` (slate-500)

### Card Architecture
```css
.rounded-[28px]
.p-10
.shadow-[0_30px_60px_rgba(0,0,0,0.05)]
.border border-slate-200
```

## Pedagogical Logic

### Access Model
1. **Contenidos:** Siempre visibles (exploración libre)
2. **Evaluaciones:** Secuenciales (requiere módulo anterior completado)
3. **Certificado:** Solo último módulo (Módulo 5)

### State Management
```javascript
// Estados clave
const [currentModule, setCurrentModule] = useState(1);
const [completedModules, setCompletedModules] = useState([]);
const [showCertificate, setShowCertificate] = useState(false);
const [isInsightsExpanded, setIsInsightsExpanded] = useState(false); // Control Muro de Insights
```

## Performance Optimizations

### Bundle Size
- **IALab Component:** 61.54 kB (gzipped: 13.37 kB)
- **CSS Total:** 361.89 kB (gzipped: 56.08 kB)
- **Build Time:** ~50-60 segundos

### Code Splitting
- Importación dinámica de `progress.js`
- Chunks optimizados por funcionalidad

## Development Guidelines

### Adding New Modules
1. Actualizar `modulesData` array
2. Añadir contenido en `moduleContents`
3. Verificar lógica de navegación en sidebar
4. Testear secuencia de evaluaciones

### Styling Conventions
- Usar clases Tailwind CSS consistentes
- Seguir jerarquía tipográfica establecida
- Mantener paleta de colores corporativos
- Aplicar `rounded-[28px]` para todos los cards

### Testing Checklist
- [ ] Navegación entre módulos
- [ ] Lógica de bloqueo de evaluaciones
- [ ] Visibilidad de certificado (solo Módulo 5)
- [ ] Responsive design (grid dashboard)
- [ ] Estados hover/disabled
- [ ] Tooltips informativos
- [ ] Expansión del Muro de Insights
- [ ] Sintetizador de prompts interactivo
- [ ] Alineación perfecta de cuadros

## Future Enhancements (FASE 6)
- Certificados NFT
- Gamificación avanzada
- Analytics de progreso
- Integración con LMS externos

## Dependencies
- React 18.2.0
- Tailwind CSS 3.4.1
- Lucide React (icons)
- Framer Motion (animations)
- Vite (build tool)

---
**Last Updated:** April 8, 2026  
**Component Version:** SaaS Premium v4 (Dashboard Grid + Community Hub)  
**Status:** Production Ready - Testing Complete