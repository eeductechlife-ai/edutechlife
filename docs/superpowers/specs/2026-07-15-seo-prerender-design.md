# SEO: Prerendering + Meta Tags Dinámicos — Design Doc

## Problema
SPA puro con Vite+React. Google crawlea un `<div id="root"></div>` vacío.
Todas las rutas comparten el mismo `<title>` y meta tags hardcodeados en `index.html`.

## Stack objetivo
- **Prerendering:** `vite-plugin-prerender` + `@prerenderer/renderer-puppeteer`
- **Meta tags:** `react-helmet-async`
- **Hosting:** Vercel (static, sin cambios)

## Principios
- Cero cambios al runtime del SPA
- Solo rutas públicas se prerenderizan (14 rutas)
- Meta tags únicos por ruta pública
- Rutas protegidas (IALab, SmartBoard, Admin) sin cambios — Google no las indexa

## Archivos a modificar/crear

### 1. `vite.config.js` — Agregar plugin de prerendering
```js
import { vitePluginPrerender } from 'vite-plugin-prerender'

plugins: [
  react(),
  VitePWA({...}),
  vitePluginPrerender({
    routes: [
      '/',
      '/neuroentorno',
      '/proyectos',
      '/consultoria',
      '/consultoria-b2b',
      '/automation',
      '/vak',
      '/vak-simple',
      '/vak-premium',
      '/ialab-academic',
      '/conoce-smartboard',
      '/smartboard',
      '/smartboard/padres',
      '/sign-up/ialab',
      '/sign-up/smartboard',
      '/login',
    ],
    renderer: '@prerenderer/renderer-puppeteer'
  })
]
```

### 2. `src/main.jsx` — Agregar HelmetProvider
```jsx
import { HelmetProvider } from 'react-helmet-async'

root.render(
  <HelmetProvider>
    <BrowserRouter>
      {/* ... providers existentes ... */}
    </BrowserRouter>
  </HelmetProvider>
)
```

### 3. `src/components/SEO.jsx` — Componente SEO (nuevo)
```jsx
const SEO = ({ title, description, ogImage }) => (
  <Helmet>
    <title>{title} | Edutechlife</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={ogImage || '/og-image.png'} />
  </Helmet>
)
```

### 4. Cada página pública — Agregar `<SEO>`
- LandingPage.jsx
- NeuroEntornoPage.jsx
- ProyectosNacionalPage.jsx
- ConsultoriaPage.jsx
- ConsultoriaB2BPage.jsx
- AutomationArchitectPage.jsx
- VAKDiagnosisPage.jsx (3 variantes)
- IALabProLandingPage.jsx
- SmartBoardInfoPage.jsx
- SmartBoardLandingPage.jsx
- SmartBoardParentDashboard.jsx
- IALabSignUpPage.jsx
- SmartBoardSignUpPage.jsx
- WelcomeScreen.jsx (login)
- NotFoundPage.jsx

## Data flow
```
Build time:
  vite-plugin-prerender → Puppeteer navega cada ruta → espera JS → captura HTML
  → genera dist/<ruta>/index.html con contenido real + meta tags

Runtime (post-hidratación):
  react-helmet-async inyecta meta tags en <head>
  Crawler ve HTML completo + meta tags correctos

Vercel:
  Sirve dist/ como estático → cada ruta tiene su propio index.html
  SPA fallback ya no es necesario para rutas prerenderizadas
```

## Rutas NO prerenderizadas (protegidas)
- /ialab, /ialab/:moduleId
- /smartboard/app, /smartboard/estadisticas
- /admin
- /sign-up (generic redirect)
- /auth-router
- /ialab-pro (redirect)

## Meta tags por página

| Ruta | title | description |
|------|-------|-------------|
| / | Inicio | Liderando la Educación del Futuro con Pedagogía e IA |
| /neuroentorno | NeuroEntorno | Explora el NeuroEntorno y transforma la educación |
| /proyectos | Proyectos | Conoce nuestros proyectos educativos nacionales |
| /consultoria | Consultoría | Consultoría educativa especializada |
| /consultoria-b2b | Consultoría B2B | Soluciones educativas para empresas |
| /automation | Automation Architect | Automatización educativa con IA |
| /vak | Diagnóstico VAK | Descubre tu estilo de aprendizaje |
| /vak-simple | Test VAK | Test rápido de estilo de aprendizaje |
| /vak-premium | Diagnóstico VAK Premium | Evaluación completa de aprendizaje |
| /ialab-academic | IALab Pro | Plataforma educativa con IA |
| /conoce-smartboard | SmartBoard | Pizarra inteligente para niños |
| /smartboard | SmartBoard Kids | Dashboard infantil SmartBoard |
| /smartboard/padres | SmartBoard Padres | Panel de control para padres |
| /login | Iniciar Sesión | Accede a tu cuenta Edutechlife |
| /sign-up/ialab | Registro IALab | Crea tu cuenta IALab |
| /sign-up/smartboard | Registro SmartBoard | Crea tu cuenta SmartBoard |
| * (404) | Página no encontrada | La página que buscas no existe |

## Dependencias nuevas
- `vite-plugin-prerender` (dev)
- `@prerenderer/renderer-puppeteer` (dev)
- `react-helmet-async` (runtime)

## Riesgos y mitigaciones
- **Puppeteer en build:** Aumenta tiempo de build (~30s extra en CI). Mitigación: solo rutas públicas.
- **Rutas con auth:** Prerendering intentaría renderizar páginas protegidas y fallaría. Mitigación: no incluirlas en routes[].
- **Rutas con datos dinámicos:** El HTML prerenderizado muestra datos "frescos" del build, no en tiempo real. Aceptable para landing pages.
- **Compatibilidad Vite:** Verificar que `vite-plugin-prerender` funcione con la versión actual de Vite.

## Criterios de éxito
1. `curl http://localhost:4173/` devuelve HTML con contenido visible (no solo `<div id="root">`)
2. Google Search Console muestra páginas indexadas con contenido
3. Sharing en redes sociales muestra título y descripción correctos por ruta
4. `npm run build` complete exitosamente con prerendering
5. Deploy a Vercel funciona sin cambios en `vercel.json`
