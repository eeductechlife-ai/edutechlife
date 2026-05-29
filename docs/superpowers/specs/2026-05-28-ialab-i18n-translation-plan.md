# IALab Academic — Traducción completo al inglés

**Fecha:** 2026-05-28
**Propósito:** Asegurar que toda la sección IALab Academic se traduzca al inglés cuando el usuario seleccione "EN" desde el `LocaleSwitcher` en el header, sin alterar funcionalidad ni romper el sistema existente.

---

## Arquitectura actual (diagnóstico)

### Sistema i18n existente

| Componente | Archivo | Estado |
|---|---|---|
| **Provider** | `src/i18n/I18nProvider.jsx` | ✅ Context + `useTranslation()` hook. Guarda locale en `localStorage` clave `edutechlife_locale`. |
| **Traducciones ES** | `src/i18n/es.json` | ✅ ~600+ claves `ialab.*` |
| **Traducciones EN** | `src/i18n/en.json` | ✅ ~600+ claves `ialab.*` (misma estructura que ES) |
| **Toggle idioma** | `src/components/LocaleSwitcher.jsx` | ✅ Renderizado en `IALabHeader`. Alterna entre `'es'` y `'en'`. |
| **Script validación** | `scripts/validate-i18n.js` | ✅ Verifica paridad de claves entre ES/EN. |
| **Script extracción** | `scripts/extract-hardcoded.js` | ✅ Escanea texto español hardcodeado en JSX. |

### Cobertura actual de `t()` en componentes IALab

| Grupo | Components | Usan `t()` | Cobertura |
|---|---|---|---|
| Core (Header, Sidebar, Breadcrumbs, Tour) | 6 | ✅ Sí | 100% |
| Contenido (ModuleOverviewCard, ModuleInfo, ModuleActions, ModuleHeader) | 4 | ✅ Sí | 100% |
| Ruta (TuRutaDeHoy) | 1 | ✅ Sí (claves `route.*`) | 100% |
| Recomendaciones (RecommendationsPanel) | 1 | ✅ Sí | 100% |
| Evaluaciones (EvaluationModal, Steps, Results, Quiz) | 6 | ✅ Sí | 100% |
| Foro (CommunityHub, PostCard, PostDetail, PostList, CreatePost, Comment, etc.) | 12 | ✅ Sí | 100% |
| Síntesis (Synthesizer, SynthesizerInput) | 2 | ✅ Sí | 100% |
| Gamificación (BadgeCard, StreakBadge, Leaderboard, Certificate) | 6 | ✅ Sí | 100% |
| Recursos (ResourceViewer, ResourceSelector, PDFThumbnail, OVAThumbnail) | 6 | ✅ Sí | 100% |
| Seguridad (ScreenshotProtection, SecurityWarning) | 2 | ✅ Sí | 100% |
| OVAs (IntroPrompt, BuildGPT, Etica, BiasLab, RiskSim, PodcastStudio, etc.) | 12 | ✅ Sí | 100% |
| Planificador (StudyPlanner) | 1 | ✅ Sí | 100% |
| **Data constants** (moduleContent, moduleResources, sidebarData) | 3 | ⚠️ No usa `t()` | Usa patrón dual ES/EN |

### Patrones de traducción (4 existentes)

| Patrón | Dónde | Cómo funciona |
|---|---|---|
| **A — `t('clave')`** | Componentes JSX (~207 imports) | Busca en JSON plano (ES/EN) vía `useTranslation()`. **Patrón preferido.** |
| **B — `get*Data(locale)`** | `moduleContent.js`, `moduleResources.js`, `sidebarData.js` | Dual object ES/EN + getter con `locale` param. Funcional pero no reactivo a cambios runtime. |
| **C — `useOVATranslations`** | `src/hooks/useOVATranslations.js` | Hook dedicado con embed ES/EN. Reactivo. |
| **D — `localStorage` directo** | `biasLab.js`, `podcastGuide.js`, `ecosystemGuide.js`, etc. | Lee del storage al importar. **No reactivo.** |

---

## Brechas identificadas

### 1. Data constants NO usan `t()` (Patrón B)

**Archivos:**
- `src/components/IALab/constants/moduleContent.js` — texto de módulos 1-5
- `src/components/IALab/constants/moduleResources.js` — títulos de recursos, `RESOURCE_TYPE_CONFIG`
- `src/components/IALab/constants/sidebarData.js` — secciones del sidebar

**Impacto:** Ya están bilingües (dual ES/EN) pero el patrón no es consistente con el resto. Si se cambia idioma en runtime, algunos componentes que leen estas constantes fuera del hook pueden no re-renderizar.

### 2. OVAs con `localStorage` directo (Patrón D)

**Archivos en `src/data/ova/`:**
- `biasLab.js`, `podcastGuide.js`, `ecosystemGuide.js`, `chatGPTTools.js`
- `notebookSim.js`, `podcastStudio.js`, `notebookLab.js`, `riskSim.js`

**Impacto:** Leen `localStorage` al importarse (`module level`), no al renderizar. Si el usuario cambia idioma, estos datos NO se actualizan hasta recargar la página.

### 3. `RESOURCE_TYPE_CONFIG` en `moduleResources.js`

Las etiquetas están hardcodeadas en español (`label: "Documento"`, `label: "Video"`, etc.). No usan `t()`.

### 4. Componentes que faltan auditar (~30 archivos chicos)

Componentes como `CourseCompletionSection.jsx`, `LEDIndicator.jsx`, `GlassDesignSystem.js`, `PromptFeedback.jsx`, `AchievementToast.jsx`, etc. Pueden tener texto hardcodeado.

---

## Plan de trabajo (9 fases)

### Fase 1: Migrar `moduleResources.js` a `t()` — `RESOURCE_TYPE_CONFIG`

**Archivo:** `src/components/IALab/constants/moduleResources.js`

**Qué hacer:**
1. Reemplazar `label: "Documento"` → `label: t('ialab.resource_type.document')`, etc.
2. Agregar claves al `es.json` / `en.json`:
   - `ialab.resource_type.video` → "Video" / "Video"
   - `ialab.resource_type.document` → "Documento" / "Document"
   - `ialab.resource_type.pdf` → "PDF" / "PDF"
   - `ialab.resource_type.image` → "Imagen" / "Image"
   - `ialab.resource_type.ova` → "Laboratorio" / "Lab"
3. El `RESOURCE_TYPE_CONFIG` se convierte en función: `getResourceTypeConfig(locale)` o se accede via `t()` directamente.

**Tiempo estimado:** 30 min

### Fase 2: Migrar `sidebarData.js` a `t()`

**Archivo:** `src/components/IALab/constants/sidebarData.js`

**Qué hacer:**
1. Reemplazar texto hardcodeado en `SECTION_DATA`/`SECTION_DATA_EN` con claves `t()`.
2. Agregar claves:
   - `ialab.sidebar.videos_title` → "Videos del Módulo" / "Module Videos"
   - `ialab.sidebar.resources_title` → "Recursos Adicionales" / "Additional Resources"
   - `ialab.sidebar.module_title_N` (para cada módulo)
   - `ialab.sidebar.level_beginner` → "Principiante" / "Beginner"
   - `ialab.sidebar.level_intermediate` → "Intermedio" / "Intermediate"

**Tiempo estimado:** 30 min

### Fase 3: Migrar OVAs de `localStorage` directo al Provider

**Archivos:** 8 archivos en `src/data/ova/`

**Qué hacer:**
1. En cada archivo, reemplazar:
   ```js
   const locale = localStorage.getItem('edutechlife_locale') || 'es';
   ```
   Por un export de función:
   ```js
   export const getData = (locale) => locale === 'en' ? DATA_EN : DATA_ES;
   ```
2. Actualizar los componentes que importan estos datos para que pasen `locale` desde `useTranslation()`.
3. Alternativa más simple: crear un hook unificado `useOVAData(ovaId)` que lea del Provider.

**Tiempo estimado:** 1-2 h

### Fase 4: Migrar `moduleContent.js` a hook con `t()`

**Archivo:** `src/components/IALab/constants/moduleContent.js`

**Qué hacer:**
1. Crear hook `useModuleContent(moduleId)` que retorna el contenido usando `locale` del Provider y `t()` para las cadenas dinámicas.
2. O mantener la estructura dual existente (ya funciona) y solo asegurar que los componentes que la usen reciban `locale` reactivo.
3. Auditoría: verificar que todos los callers de `getModuleContent()` reciban `locale` de `useTranslation()`, no de `localStorage`.

**Tiempo estimado:** 1 h

### Fase 5: Auditar componentes pequeños (texto hardcodeado)

**Componentes a revisar:**
- `CourseCompletionSection.jsx`
- `AchievementToast.jsx`
- `PromptFeedback.jsx`
- `LEDIndicator.jsx`
- `CertificatePreview.jsx`
- `StreakDetailsModal.jsx`
- `BenefitsSection.jsx`
- `CourseCard.jsx`
- `UserCoursesDashboard.jsx`

**Qué hacer:**
1. Buscar strings español en el JSX.
2. Mover a `es.json` / `en.json` con claves `ialab.*`.
3. Reemplazar con `t('ialab.nueva_clave')`.

**Tiempo estimado:** 1 h

### Fase 6: Agregar claves faltantes a `es.json` / `en.json`

**Qué hacer:**
1. Ejecutar `npm run i18n:validate` para detectar discrepancias entre ES/EN.
2. Ejecutar `npm run i18n:extract` para encontrar texto hardcodeado nuevo.
3. Agregar todas las claves faltantes a ambos archivos.

**Tiempo estimado:** 30 min

### Fase 7: Verificar reactividad del Provider

**Qué hacer:**
1. Confirmar que todos los componentes que usan `t()` re-renderizan al cambiar locale (el Provider cambia el objeto `translations` en el contexto → React re-renderiza hijos).
2. Confirmar que ningún componente lee `localStorage` directamente para lenguaje (solo el Provider debe hacerlo).
3. Buscar `localStorage.getItem('edutechlife_locale')` en toda la carpeta `src/` y migrar los hallazgos.

**Tiempo estimado:** 30 min

### Fase 8: Validación y testing

**Qué hacer:**
1. `npm run i18n:validate` → debe dar 0 discrepancias.
2. `npm run build` → debe compilar sin errores.
3. Prueba manual:
   - Abrir IALab en español → todo OK.
   - Click en "EN" en el header → todo el IALab cambia a inglés.
   - Click en "ES" → vuelve a español.
   - Verificar que todos los acordeones, modales, OVAs, foro, sidebar, breadcrumbs se traduzcan.
4. Verificar que datos de usuario (puntajes, progreso) NO se traduzcan (son datos, no UI).

**Tiempo estimado:** 1 h

### Fase 9: Mantenimiento preventivo

**Qué hacer:**
1. Agregar el `validate-i18n.js` al CI (pre-commit hook o GitHub Action).
2. Documentar en `CONTRIBUTING.md` el patrón correcto: siempre usar `t('ialab.*')`.
3. Eliminar scripts legacy (Patrón D) gradualmente.

**Tiempo estimado:** 30 min

---

## Resumen de claves nuevas a agregar

| Clave | ES | EN |
|---|---|---|
| `ialab.resource_type.video` | Video | Video |
| `ialab.resource_type.document` | Documento | Document |
| `ialab.resource_type.pdf` | PDF | PDF |
| `ialab.resource_type.image` | Imagen | Image |
| `ialab.resource_type.ova` | Laboratorio | Lab |
| `ialab.sidebar.videos_title` | Videos del Módulo | Module Videos |
| `ialab.sidebar.resources_title` | Recursos Adicionales | Additional Resources |
| `ialab.sidebar.level_beginner` | Principiante | Beginner |
| `ialab.sidebar.level_intermediate` | Intermedio | Intermediate |
| (otras según auditoría Fase 5) | | |

---

## No-alcance (out of scope)

- Traducir datos de usuario (nombres, puntajes, progreso).
- Traducir contenido generado por IA (recomendaciones dinámicas).
- Traducir títulos de módulos (son nombres propios del curso).
- Cambiar el sistema i18n (no migrar a i18next).
- Internacionalizar fechas/horas (ya usan `toLocaleDateString('es-ES')`).
