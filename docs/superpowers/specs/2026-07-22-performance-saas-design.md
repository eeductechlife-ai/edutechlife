# Fase 5 — Performance SaaS

**Goal:** Optimizar performance de carga y red sin alterar funcionalidad existente.
**Constraint:** Todos los cambios son aditivos o de configuración. No se modifica lógica de negocio, componentes funcionales, o rutas.

**Estado actual pre-Fase 5:**
| Dimensión | Antes | Ahora |
|-----------|-------|-------|
| Videos públicos | 42MB | 4.7MB (ya comprimidos) |
| PNG → WebP | 772KB PNGs | WebP generados (optimize-images.mjs) |
| Route lazy loading | Manual | ✅ Todas las rutas con `lazy()` |
| Terser + manualChunks | No | ✅ Configurado |
| lighthouserc.js | No | ✅ Existente |

---

## A. Bundle Real — CSS y assets

### A.1 CSS Purge — Tailwind content paths
- Verificar que `content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]` en tailwind.config.js está correcto
- Si hay CSS grande no purgado, revisar si `@import` de archivos CSS grandes (librerías third-party) causan el peso
- Ejecutar build y medir CSS resultante (<200KB target vs 489KB actual)

### A.2 Actualizar optimize-images.mjs
- El script ya existe y convierte PNG→WebP
- Agregar soporte para JPG/JPEG
- Agregar conteo de bytes ahorrados en output
- Agregar `npm run optimize-images` al build (opcional, no destructivo)

### A.3 Video compression adicional
- `dashboard.mp4` 1.9MB → comprimir a 720p (~1MB)
- `smarboard.mp4` 2.8MB → comprimir a 720p (~1.5MB)
- Usar `ffmpeg` externo, no código nuevo
- Actualizar archivos en `/public`

---

## B. Carga Inicial — Skeleton Screens

### B.1 Componente Skeleton reutilizable
- Crear `src/components/ui/Skeleton.jsx`
- Props: `width`, `height`, `rounded`, `className`
- Usa `animate-pulse` de Tailwind + `bg-gray-200`
- No reemplaza PageLoader existente — es un componente nuevo

### B.2 Skeleton para Dashboard
- Crear `src/components/skeletons/DashboardSkeleton.jsx`
- Placeholder para: chart cards (4 rects), KPIs row, activity list
- Se renderiza en el Suspense de la ruta dashboard

### B.3 Skeleton para IALab
- Crear `src/components/skeletons/IALabSkeleton.jsx`
- Placeholder para: módulos de curso, cards de progreso
- Se renderiza en Suspense de ruta IALab

### B.4 Skeleton para SmartBoard
- Crear `src/components/skeletons/SmartBoardSkeleton.jsx`
- Placeholder para: dashboard kids, activity cards

### B.5 Skeleton para VAK Diagnosis
- Crear `src/components/skeletons/VAKSkeleton.jsx`
- Placeholder para: test questions, result cards

---

## C. Wire — Red y servidor

### C.1 Brotli en backend Express
- Verificar si `compression` middleware ya existe en backend
- Agregar si no existe: `npm install compression`
- Configurar con prioridad brotli: `app.use(compression({ brotli: { enabled: true, quality: 11 } }))`
- Sin DSN/credenciales — puramente configuración de middleware

### C.2 Performance Budget CI
- Verificar que `check-budget.mjs` se ejecute en CI (test.yml)
- Agregar step de performance budget después del build
- Umbrales: JS chunks <250KB, CSS total <200KB, imágenes <200KB

---

## D. Exclusiones
- ❌ No modificar routing existente (ya lazy)
- ❌ No modificar ClerkProvider, auth, o providers
- ❌ No modificar componentes funcionales (Hero, Cards, etc.)
- ❌ No eliminar assets existentes (solo agregar versiones optimizadas)
- ❌ No modificar Tailwind theme ni colores existentes
- ❌ No modificar PageLoader existente

## Riesgos
| Riesgo | Mitigación |
|--------|------------|
| Tailwind purge elimina clases usadas | Verificar build visualmente después |
| Video compression pierde calidad | Usar CRF 23 (buena calidad/tamaño) |
| Skeletons parpadean si carga es muy rápida | Usar `minimumLoadTime` o `animate-appear` |
| compression middleware rompe streaming | Solo config, no toca lógica de rutas |
