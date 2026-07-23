# Fase 6 — Premium Edge

**Goal:** Elevar UI/UX con micro-interacciones consistentes, SEO polish, y animaciones de entrada. Todo aditivo — sin alterar lógica existente.

---

## A. Micro-interacciones consistentes

Agregar clases CSS aditivas a componentes que ya funcionan — solo hover/active/transition:

| Componente | Clases a agregar |
|---|---|
| Cards en LandingPage (`AIToolsSection`, `FeaturesSection`, etc.) | `hover:shadow-lg transition-all duration-300 active:scale-[0.98]` |
| Botones secundarios | `hover:opacity-90 active:scale-[0.97] transition-all duration-200` |
| Nav links (mobile) | `hover:bg-gray-50 active:scale-[0.98] transition-all duration-200` |
| Service cards | `hover:-translate-y-1 hover:shadow-xl transition-all duration-300` |

Patrón consistente usado en HeaderFluidIsland: `transition-all duration-300`, `active:scale-[0.97]`, cubic-bezier `[0.32, 0.72, 0, 1]`.

---

## B. SEO polish

### B.1 Sitemap generation
- El script `scripts/generate-sitemap.mjs` ya existe
- Asegurar que se ejecute en `npm run build` y produzca `public/sitemap.xml`
- Verificar que incluya todas las rutas públicas

### B.2 Favicon fallback
- Generar `favicon.ico` (32x32) a partir de `favicon.svg`
- Colocar en `/public/`
- Sin modificar el SVG existente

### B.3 OG Image PNG
- Convertir `og-image.svg` a `og-image.png` (1200x630px)
- Colocar en `/public/`
- El SEO component ya referencia `og:image`, usará la PNG como fallback

---

## C. Animaciones de entrada

Agregar entrance animations con framer-motion en secciones de LandingPage que aún no tienen:

- `initial={{ opacity: 0, y: 24 }}`
- `whileInView={{ opacity: 1, y: 0 }}`
- `viewport={{ once: true, margin: "-100px" }}`
- `transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}`
- Respetar `prefersReducedMotion` ya presente en el proyecto

---

## D. Exclusiones
- ❌ No modificar lógica de negocio, routing, Clerk, providers
- ❌ No cambiar colores, fuentes, o layout existente
- ❌ No reemplazar componentes — solo agregar props/clases
- ❌ No modificar HeaderFluidIsland, Hero, o componentes ya pulidos
