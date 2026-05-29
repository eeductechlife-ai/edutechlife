# IALab Academic Landing Page — Traducción inglés

**Fecha:** 2026-05-28
**Propósito:** Traducir la landing page `/ialab-academic` (`IALabProLandingPage.jsx`) al inglés cuando el usuario seleccione "EN" desde el `LocaleSwitcher` en el header, sin alterar funcionalidad ni diseño.

---

## Diagnóstico

### Componente target

| Archivo | Líneas | Rol |
|---|---|---|
| `src/components/pages/IALabProLandingPage.jsx` | 889 | Landing page del producto "AI Lab Academic" |
| `src/components/IALab/data/landingPageData.js` | 356 | Datos bilingües ES/EN (categorías, cursos, beneficios) |

### Estado actual

| Aspecto | Estado | Detalle |
|---|---|---|
| `useTranslation` import | ❌ No existe | 0 llamadas a `t()` |
| Datos de categorías | 🟡 Hardcodeado inline (líneas 50-56) | Ya existe `getCategories(locale)` en el data file pero no se usa |
| Datos de cursos | 🟡 Hardcodeado inline (líneas 58-195) | Ya existe `getCourses(locale)` en el data file pero no se usa |
| Datos de beneficios | 🟡 Hardcodeado inline (líneas 208-213) | Ya existe `getBenefits(locale)` en el data file pero no se usa |
| `statusConfig.badgeText` | ❌ Hardcodeado español (líneas 215-240) | "Disponible", "Próximamente", "Nuevo" |
| `statusConfig.buttonText` | ❌ Hardcodeado español | "Comenzar", "Inscríbete", "Explorar" |
| Stats | ❌ Hardcodeado español (líneas 201-206) | "Cursos", "Contenido", "Certificados", "Profesionales", "Soporte" |
| Hero badge | ❌ Hardcodeado español (línea 351) | "Laboratorio de Innovación Educativa" |
| Hero stats | ❌ Hardcodeado español (líneas 591-603) | "estudiantes", "Certificado profesional" |
| Botón "Volver" | ❌ Hardcodeado español (líneas 270-276) | "Volver al inicio", "Volver" |
| Section titles | ❌ Hardcodeado español | "¿Por qué AI Lab Academic?", "Catálogo de Cursos" |
| Course cards | ❌ Hardcodeado español | "módulos", "est.", "Progreso", "Certificado" |

### Datos ya disponibles en el data file

El archivo `landingPageData.js` YA CONTIENE datos en inglés:
- `CATEGORIES_EN` con labels: "All", "Generative AI", "Automations", "Productivity", "Development"
- `COURSES_EN` con descripciones, features, levels traducidos
- `BENEFITS_EN` con títulos y descripciones traducidos
- Funciones: `getCategories(locale)`, `getCourses(locale)`, `getBenefits(locale)`

Lo que falta en el data file:
- `statusConfig` con `badgeText` y `buttonText` en inglés (actualmente hardcodeado español)
- `stats` con labels en inglés (actualmente hardcodeado español en el componente)

---

## Plan de trabajo (6 fases)

### Fase 1: Agregar `statusConfig_EN` y `stats_EN` al data file

**Archivo:** `src/components/IALab/data/landingPageData.js`

Agregar:
```js
export const statusConfig_EN = {
  active: {
    ...statusConfig.active,
    badgeText: 'Available',
    buttonText: (isSignedIn) => isSignedIn ? 'Start' : 'Enroll',
  },
  'coming-soon': {
    ...statusConfig['coming-soon'],
    badgeText: 'Coming Soon',
    buttonText: () => 'Explore',
  },
  new: {
    ...statusConfig.new,
    badgeText: 'New',
    buttonText: () => 'Start',
  }
};

export const getStatusConfig = (locale) => locale === 'en' ? statusConfig_EN : statusConfig;

export const stats = [
  { icon: 'fa-brain', value: '8+', label: 'Cursos' },
  { icon: 'fa-clock', value: '200h+', label: 'Contenido' },
  { icon: 'fa-trophy', value: 'Certificados', label: 'Profesionales' },
  { icon: 'fa-headset', value: '24/7', label: 'Soporte' }
];

export const stats_EN = [
  { icon: 'fa-brain', value: '8+', label: 'Courses' },
  { icon: 'fa-clock', value: '200h+', label: 'Content' },
  { icon: 'fa-trophy', value: 'Certificates', label: 'Professional' },
  { icon: 'fa-headset', value: '24/7', label: 'Support' }
];

export const getStats = (locale) => locale === 'en' ? stats_EN : stats;
```

### Fase 2: Agregar claves i18n al `es.json` / `en.json`

Claves nuevas:
```
ialab.landing.hero_badge      → "Laboratorio de Innovación Educativa" / "Educational Innovation Lab"
ialab.landing.back_label      → "Volver" / "Back"
ialab.landing.back_aria       → "Volver al inicio" / "Back to home"
ialab.landing.students_label  → "estudiantes" / "students"
ialab.landing.certified_label → "Certificado profesional" / "Professional Certificate"
ialab.landing.why_title       → "¿Por qué AI Lab Academic?" / "Why AI Lab Academic?"
ialab.landing.why_subtitle    → "Una plataforma diseñada para tu éxito en la era de la inteligencia artificial" / "A platform designed for your success in the AI era"
ialab.landing.catalog_title   → "Catálogo de Cursos" / "Course Catalog"
ialab.landing.catalog_subtitle → "Explora nuestro catálogo..." / "Explore our catalog..."
ialab.landing.modules_label   → "módulos" / "modules"
ialab.landing.certified_badge → "Certificado" / "Certified"
ialab.landing.progress_label  → "Progreso" / "Progress"
ialab.landing.students_abbr   → "est." / "std."
```

### Fase 3: Refactor `IALabProLandingPage.jsx` — importar `useTranslation`

Agregar:
```js
import { useTranslation } from '../../i18n/I18nProvider';
```

En el componente:
```js
const { t, locale } = useTranslation();
```

### Fase 4: Reemplazar datos inline con funciones del data file

```js
// ANTES (hardcodeado en el componente):
const categories = [
  { id: 'all', label: 'Todos', icon: 'fa-bolt' },
  ...
];

// DESPUÉS (usar data file con locale):
import { getCategories, getCourses, getBenefits, getStats, getStatusConfig } from '../../components/IALab/data/landingPageData';
const categories = getCategories(locale);
const coursesData = getCourses(locale);
const benefits = getBenefits(locale);
const stats = getStats(locale);
const statusConfig = getStatusConfig(locale);
```

### Fase 5: Reemplazar strings hardcodeados con `t()`

Buscar y reemplazar en el JSX:
| Línea | Texto actual | Reemplazo |
|---|---|---|
| 270 | `aria-label="Volver al inicio"` | `aria-label={t('ialab.landing.back_aria')}` |
| 275 | `Volver` | `{t('ialab.landing.back_label')}` |
| 351 | `Laboratorio de Innovación Educativa` | `{t('ialab.landing.hero_badge')}` |
| 591 | `estudiantes` | `{t('ialab.landing.students_label')}` |
| 603 | `Certificado profesional` | `{t('ialab.landing.certified_label')}` |
| 631-632 | `¿Por qué AI Lab Academic?` | `{t('ialab.landing.why_title')}` |
| 634-635 | `Una plataforma diseñada...` | `{t('ialab.landing.why_subtitle')}` |
| 681-682 | `Catálogo de Cursos` | `{t('ialab.landing.catalog_title')}` |
| 684-685 | `Explora nuestro catálogo...` | `{t('ialab.landing.catalog_subtitle')}` |
| 821 | `{course.modules} módulos` | `{course.modules} {t('ialab.landing.modules_label')}` |
| 826 | `Certificado` | `{t('ialab.landing.certified_badge')}` |
| 838 | `Progreso` | `{t('ialab.landing.progress_label')}` |
| 798 | `{course.students} est.` | `{course.students} {t('ialab.landing.students_abbr')}` |

### Fase 6: Validación

1. `npm run build` → debe compilar sin errores
2. Prueba manual:
   - Navegar a `/ialab-academic` en español → todo OK
   - Click "EN" en el header → todo el texto cambia a inglés
   - Click "ES" → vuelve a español
   - Verificar que botones, tarjetas de curso, stats, hero badge se traduzcan
   - Verificar que la funcionalidad (navegación, filtros) no se altere

---

## Resumen de cambios

| Archivo | Cambio |
|---|---|
| `IALabProLandingPage.jsx` | +1 import, +1 línea `useTranslation()`, +4 llamadas a getters del data file, ~15 reemplazos `texto` → `{t('clave')}` |
| `landingPageData.js` | +3 nuevos exports: `statusConfig_EN`, `stats_EN`, `getStatusConfig`, `getStats` |
| `es.json` | +15 claves nuevas con prefijo `ialab.landing.*` |
| `en.json` | +15 claves nuevas con prefijo `ialab.landing.*` (traducciones) |

**Tiempo estimado total:** 2-3 horas

**No-alcance:** No se traducen datos de usuario, contenido generado por IA, ni nombres propios de módulos. No se modifica el sistema i18n existente.
