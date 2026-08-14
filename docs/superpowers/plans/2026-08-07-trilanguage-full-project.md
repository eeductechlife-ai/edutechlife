# Internacionalización Total — 3 Idiomas (es / en / pt)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que TODO el proyecto EdutechLife (frontend React + backend Express) maneje correctamente 3 idiomas: español (base), inglés y portugués brasileño, sin alterar ningún comportamiento existente.

**Architecture:** El sistema i18n ya existe (`I18nProvider` + `es/en/pt.json` planas). El trabajo es: (1) completar traducciones pendientes (628 claves pt.json, ~170 en.json), (2) centralizar TODOS los selectores de contenido `locale === "en" ? EN : ES` hacia `resolveLocalized` con cascada `pt→en→es`, (3) migrar ~60 componentes con texto español hardcodeado a `t()`, (4) parametrizar el backend por idioma, (5) arreglar SEO/hreflang/sitemap y scripts de validación para 3 idiomas.

**Tech Stack:** React 18, Vite, Tailwind, `src/i18n/I18nProvider.jsx` (`t(key,{param})`), `src/utils/localeUtils.js` (`resolveLocalized`, `getCurrentLocale`), Express backend, Supabase, Resend.

**Estado actual verificado (2026-08-07):**
- `es.json` 4.606 claves · `en.json` 4.608 · `pt.json` 4.606. **`pt.json` tiene ~628 claves idénticas a `es.json` en español; `en.json` solo ~3 realmente sin traducir.**
- `validate-i18n.js` solo valida es↔en y **falla hoy** (2 claves en en.json ausentes en es.json). No valida pt.
- `keys.d.ts` obsoleto (faltan 751 claves).
- 280 archivos `.jsx` sin i18n; ~60 con español 100% hardcodeado.
- Backend 100% español hardcodeado (emails, crisis, auth, rate-limit, `DANI_SYSTEM_PROMPT`).
- `SEO.jsx` mapea `pt→es`; sitemap solo es/en; sin routing por URL de locale.
- Prompt de IA inconsistente: unos archivos `pt→es`, otros `pt→en`.

---

## Fase 0 — Fundación i18n (3 idiomas)

### Task 0.1: Arreglar `validate-i18n.js` para 3 idiomas y las 2 claves rotas

**Files:**
- Modify: `edutechlife-frontend/scripts/validate-i18n.js`
- Modify: `edutechlife-frontend/src/i18n/es.json`
- Test: `edutechlife-frontend/scripts/validate-i18n.js` (ejecución)

**Problema:** el script compara solo `es↔en`; `en.json` tiene 2 claves que `es.json` no (`ialab.flashcards.tab_study_icon`, `ialab.flashcards.tab_practice_icon`) → falla.

- [ ] **Step 1: Verificar el fallo actual**

Run: `cd edutechlife-frontend && npm run i18n:validate`
Expected: FAIL — `MISSING in es.json: ialab.flashcards.tab_study_icon`

- [ ] **Step 2: Añadir las 2 claves a `es.json` y `pt.json`**

Añadir a `edutechlife-frontend/src/i18n/es.json` (al final, antes de la llave de cierre):
```json
  "ialab.flashcards.tab_study_icon": "fa-book",
  "ialab.flashcards.tab_practice_icon": "fa-pen-to-square"
```
Añadir a `edutechlife-frontend/src/i18n/pt.json`:
```json
  "ialab.flashcards.tab_study_icon": "fa-book",
  "ialab.flashcards.tab_practice_icon": "fa-pen-to-square"
```

- [ ] **Step 3: Actualizar el script para validar 3 idiomas**

Replace el contenido de `edutechlife-frontend/scripts/validate-i18n.js` (leer primero) para validar `es↔en` y `es↔pt`:
```js
const fs = require('fs');
const path = require('path');

const load = (f) => JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'i18n', f), 'utf8'));
const es = load('es.json');
const en = load('en.json');
const pt = load('pt.json');

let failed = false;
const check = (a, b, nameA, nameB) => {
  const missingInA = Object.keys(b).filter((k) => !(k in a));
  const missingInB = Object.keys(a).filter((k) => !(k in b));
  missingInA.forEach((k) => { console.log(`MISSING in ${nameA}.json: ${k}`); failed = true; });
  missingInB.forEach((k) => { console.log(`MISSING in ${nameB}.json: ${k}`); failed = true; });
};
check(es, en, 'es', 'en');
check(es, pt, 'es', 'pt');

if (failed) { console.error('❌ Key mismatch detected.'); process.exit(1); }
console.log('✅ es/en/pt parity OK');
```

- [ ] **Step 4: Verificar**

Run: `cd edutechlife-frontend && npm run i18n:validate`
Expected: PASS — `✅ es/en/pt parity OK`

- [ ] **Step 5: Commit**

```bash
git add edutechlife-frontend/scripts/validate-i18n.js edutechlife-frontend/src/i18n/es.json edutechlife-frontend/src/i18n/pt.json
git commit -m "fix(i18n): validate 3 locales and add missing flashcard icon keys"
```

---

### Task 0.2: Regenerar `keys.d.ts` desde es.json

**Files:**
- Modify: `edutechlife-frontend/src/i18n/keys.d.ts` (generado)

- [ ] **Step 1: Ejecutar el generador**

Run: `cd edutechlife-frontend && npm run i18n:sync-types`
Expected: `keys.d.ts` regenerado con las 4.608 claves de es.json.

- [ ] **Step 2: Verificar paridad**

Run: `cd edutechlife-frontend && grep -c "TranslationKey;" src/i18n/keys.d.ts | head -1` (debe reflejar 4.608 en el set).

- [ ] **Step 3: Commit**

```bash
git add edutechlife-frontend/src/i18n/keys.d.ts
git commit -m "chore(i18n): regenerate keys.d.ts"
```

---

### Task 0.3: Completar `en.json` (solo ~3 claves reales)

**Files:**
- Modify: `edutechlife-frontend/src/i18n/en.json`

**Contexto:** las 170 claves de `en.json` idénticas a `es.json` son casi todas cognados legítimos, nombres propios, placeholders o formato. Solo 3-4 merecen revisión.

- [ ] **Step 1: Verificar cuáles requieren cambio**

Run: `cd edutechlife-frontend && python3 -c "
import json
es=json.load(open('src/i18n/es.json')); en=json.load(open('src/i18n/en.json'))
same=[k for k in en if es.get(k)==en[k] and en[k]!='']
print('idénticas:', len(same))
# solo las que tienen acentos/ñ/¿¡ (español visible)
import re
sp=[k for k in same if re.search(r'[áéíóúñ¿¡ÁÉÍÓÚ]', en[k])]
for k in sp: print(k, '=', en[k])
"`

- [ ] **Step 2: Traducir solo las que lo necesiten**

Para cada clave listada que sea español visible (no nombre propio), editar `en.json` con la traducción al inglés. Ejemplos esperados:
- `vak.ui.habeas_data_title` → `"Habeas Data"` (término legal, mantener)
- `sidebar.plan_elite` → `"Plan: Elite v2.286"` (marca, mantener)
- Nombres propios (`Ana García`, `Carlos López`) → mantener.

Si ninguna requiere cambio, marcar la tarea completada con el reporte de `python3`.

- [ ] **Step 3: Commit**

```bash
git add edutechlife-frontend/src/i18n/en.json
git commit -m "feat(i18n): finalize en.json translations"
```

---

### Task 0.4: Completar `pt.json` (628 claves pendientes)

**Files:**
- Modify: `edutechlife-frontend/src/i18n/pt.json`

**Problema:** ~628 claves de `pt.json` son copia del español (valores en español). Muchas son cognados legítimos, pero hay deuda real (namespace `ialab` 259 claves, `ova` 106, y decenas con caracteres españoles).

- [ ] **Step 1: Extraer las claves pendientes**

Run: `cd edutechlife-frontend && python3 -c "
import json, re
es=json.load(open('src/i18n/es.json')); pt=json.load(open('src/i18n/pt.json'))
same={k:v for k,v in pt.items() if es.get(k)==v and v!=''}
# Candidatas a traducción: con acentos/ñ españoles O frases de >=3 palabras
cand={k:v for k,v in same.items() if re.search(r'[áéíóúñ¿¡]', v) or len(v.split())>=3}
json.dump(cand, open('/tmp/pt_remaining.json','w'), ensure_ascii=False, indent=1)
print('candidatas a traducir:', len(cand))
"`

- [ ] **Step 2: Traducir las candidatas**

Despachar agentes paralelos (un agente por namespace: `ialab`, `ova`, `smartboard+automation+vak`, `resto`), cada uno leyendo `/tmp/pt_remaining.json` y escribiendo `/tmp/pt_remaining_<ns>.json` con {clave: valor_pt_brasilero}. Reglas: conservar `{placeholders}`, emojis, `\n`, HTML; NO traducir nombres propios/acrónimos/marcas; pt-BR natural y profesional.

- [ ] **Step 3: Fusionar en pt.json**

Run: `cd edutechlife-frontend && python3 -c "
import json, glob
es=json.load(open('src/i18n/es.json')); pt=json.load(open('src/i18n/pt.json'))
for f in glob.glob('/tmp/pt_remaining_*.json'):
    d=json.load(open(f))
    for k,v in d.items():
        if k in pt and es.get(k)==pt[k]: pt[k]=v
json.dump(pt, open('src/i18n/pt.json','w'), ensure_ascii=False, indent=2)
import re
same=[k for k in pt if es.get(k)==pt[k] and pt[k]!='']
cand=[k for k in same if re.search(r'[áéíóúñ¿¡]', pt[k])]
print('idénticas a ES restantes:', len(same))
print('con acentos españoles (deuda real):', len(cand))
"`

- [ ] **Step 4: Verificar**

Run: `cd edutechlife-frontend && npm run i18n:validate`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add edutechlife-frontend/src/i18n/pt.json
git commit -m "feat(i18n): translate remaining pt.json keys to Brazilian Portuguese"
```

---

### Task 0.5: SEO.jsx — soporte pt (hreflang, ogLocale, ogImage)

**Files:**
- Modify: `edutechlife-frontend/src/components/SEO.jsx`

- [ ] **Step 1: Leer el archivo actual**

Run: `sed -n '1,60p' edutechlife-frontend/src/components/SEO.jsx`

- [ ] **Step 2: Mapear locale pt a SEO**

Reemplazar el mapeo `isEn = locale === "en"` para que `pt` tenga su propio `ogLocale`, `currentLang` y `ogImage` (si existe `/og-image-pt.svg`; si no, reutilizar el de `es`):
```jsx
const langMap = { es: "es_CO", en: "en_US", pt: "pt_BR" };
const ogLocale = langMap[locale] || "es_CO";
const currentLang = locale || "es";
// hreflang: añadir pt cuando corresponda
const hreflangLinks = [
  { hrefLang: "es", href: canonical },
  { hrefLang: "en", href: enCanonical },
  ...(locale !== "es" ? [{ hrefLang: "pt", href: ptCanonical }] : []),
  { hrefLang: "x-default", href: canonical },
];
```
Leer el archivo completo y aplicar el cambio mínimo sin romper la API de props.

- [ ] **Step 3: Commit**

```bash
git add edutechlife-frontend/src/components/SEO.jsx
git commit -m "feat(seo): support pt locale in meta/hreflang"
```

---

### Task 0.6: Sitemap + index.html + routing de locale

**Files:**
- Modify: `edutechlife-frontend/scripts/generate-sitemap.mjs`
- Modify: `edutechlife-frontend/index.html`
- Modify: `edutechlife-frontend/vercel.json` (verificar rutas)

**Problema:** sitemap solo es/en (`/en/...`), `<html lang="es">` hardcodeado, sin rutas `/pt/...`.

- [ ] **Step 1: Actualizar sitemap**

Modificar `generate-sitemap.mjs` para generar también `hreflang="pt"` (URL `/pt/...`), manteniendo es/en/x-default. Leer el archivo primero.

- [ ] **Step 2: Actualizar index.html**

Cambiar `<html lang="es">` → `<html lang="es" data-locale="es">` (el runtime lo actualiza). Si hay meta OG en español, dejar como default (es).

- [ ] **Step 3: Verificar que no rompe el build**

Run: `cd edutechlife-frontend && npm run build:fast`
Expected: build OK.

- [ ] **Step 4: Commit**

```bash
git add edutechlife-frontend/scripts/generate-sitemap.mjs edutechlife-frontend/index.html
git commit -m "feat(seo): add pt to sitemap and default lang meta"
```

---

## Fase 1 — Centralizar selectores de contenido ES/EN → 3 idiomas

### Task 1.1: `dateUtils.js` — formatos de fecha pt

**Files:**
- Modify: `edutechlife-frontend/src/utils/dateUtils.js`

- [ ] **Step 1: Leer el archivo**

Run: `cat edutechlife-frontend/src/utils/dateUtils.js`

- [ ] **Step 2: Añadir locale pt**

Reemplazar los ternarios `locale === 'en' ? 'en-US' : 'es-ES'` por un mapa:
```js
const LOCALE_MAP = { en: "en-US", pt: "pt-BR", es: "es-ES" };
const getLocale = (locale) => LOCALE_MAP[locale] || "es-ES";
```
Aplicar en `formatDate`, `formatDateTime`, `formatDateShort`, `formatDateFull`.

- [ ] **Step 3: Commit**

```bash
git add edutechlife-frontend/src/utils/dateUtils.js
git commit -m "feat(i18n): pt date formatting in dateUtils"
```

---

### Task 1.2: `valentinaMessages.js` — mensajes de Valeria (VAK) en pt

**Files:**
- Modify: `edutechlife-frontend/src/utils/valentinaMessages.js`

- [ ] **Step 1: Leer el selector**

Run: `sed -n '460,492p' edutechlife-frontend/src/utils/valentinaMessages.js`

- [ ] **Step 2: Añadir variante PT**

Crear `VALENTINA_MESSAGES_PT` como traducción pt-BR completa de `VALENTINA_MESSAGES` (misma estructura: `{all, child, preteen, teen}` con todos los campos). Cambiar `getMessages(locale)` a:
```js
const getMessages = (locale) =>
  locale === "en" ? VALENTINA_MESSAGES_EN : locale === "pt" ? VALENTINA_MESSAGES_PT : VALENTINA_MESSAGES;
```
Traducir TODOS los textos (welcome, askName, askMood, progressMessages, results, etc.) manteniendo los placeholders `${current}`, `${total}`, `${name}`, `${age}`.

- [ ] **Step 3: Commit**

```bash
git add edutechlife-frontend/src/utils/valentinaMessages.js
git commit -m "feat(i18n): pt Valeria VAK voice messages"
```

---

### Task 1.3: `email/templates.js` — plantillas de email pt

**Files:**
- Modify: `edutechlife-frontend/src/utils/email/templates.js`

- [ ] **Step 1: Entender el helper `t(locale, es, en)`**

Run: `sed -n '1,15p' edutechlife-frontend/src/utils/email/templates.js`

- [ ] **Step 2: Ampliar el helper a 3 idiomas**

Reemplazar el helper local:
```js
function t(locale, es, en, pt) {
  if (locale === "en") return en;
  if (locale === "pt") return pt ?? en;
  return es;
}
```
Para cada una de las 4 plantillas (`getAppointmentConfirmationTemplate`, `getAppointmentReminder24hTemplate`, `getAppointmentReminder1hTemplate`, `getLeadWelcomeTemplate`), añadir el 3º argumento pt en cada llamada `t(locale, esVal, enVal, ptVal)`. Traducir al pt-BR profesional (confirmaciones, recordatorios, bienvenida). También `getLocaleDateString` con pt-BR.

- [ ] **Step 3: Commit**

```bash
git add edutechlife-frontend/src/utils/email/templates.js
git commit -m "feat(i18n): pt email templates"
```

---

### Task 1.4: `footerContent` — footer pt

**Files:**
- Modify: `edutechlife-frontend/src/data/footer/footerContent.js`
- Create: `edutechlife-frontend/src/data/footer/pt/` (contact, legal, navigation, social)

- [ ] **Step 1: Leer la estructura**

Run: `cat edutechlife-frontend/src/data/footer/footerContent.js` y listar `src/data/footer/`.

- [ ] **Step 2: Crear variantes pt**

Copiar `src/data/footer/es/*.js` → `src/data/footer/pt/*.js` con todo el texto traducido al pt-BR (misma estructura de exports). Añadir `index.js` en `pt/` que re-exporte con sufijo `...PT` siguiendo el patrón de `en/`.

- [ ] **Step 3: Actualizar el selector**

Cambiar `getFooterContent(locale)` para que `pt` use el contenido pt:
```js
const getFooterContent = (locale) => {
  if (locale === "en") return enContent;
  if (locale === "pt") return ptContent;
  return esContent;
};
```

- [ ] **Step 4: Commit**

```bash
git add edutechlife-frontend/src/data/footer/
git commit -m "feat(i18n): pt footer content"
```

---

### Task 1.5: `SmartBoardLandingData.js` — landing SmartBoard pt

**Files:**
- Modify: `edutechlife-frontend/src/components/SmartBoardLandingData.js`

- [ ] **Step 1: Leer el selector `getData`**

Run: `sed -n '200,227p' edutechlife-frontend/src/components/SmartBoardLandingData.js`

- [ ] **Step 2: Añadir variantes PT**

Para los 9 pares ES/EN (`VAK_STYLES`, `PRICING_PLANS`, `TESTIMONIALS`, `BENEFICIOS_HIJO`, `TRANQUILIDAD`, `PASOS`, `PAYMENT_METHODS`, `GUARANTEE`, `FAQ_ITEMS`), añadir la variante `_PT` (traducción pt-BR). Actualizar `getData(locale)` para devolver `{...}` con PT cuando `locale === "pt"`.

- [ ] **Step 3: Commit**

```bash
git add edutechlife-frontend/src/components/SmartBoardLandingData.js
git commit -m "feat(i18n): pt SmartBoard landing data"
```

---

### Task 1.6: `automationData/index.js` — landing Automatización pt

**Files:**
- Modify: `edutechlife-frontend/src/components/automationData/index.js`
- Modify: los 6 archivos fuente (`metrics.js`, `standards.js`, `questions.js`, `config.js`, `processes.js`, `cases.js`)

- [ ] **Step 1: Leer `index.js` y los 6 archivos**

Run: `sed -n '1,71p' edutechlife-frontend/src/components/automationData/index.js` y cada fuente.

- [ ] **Step 2: Añadir variantes `*_PT`**

En cada archivo fuente, añadir `*_PT` (traducción pt-BR de las constantes `*_ES`). En `index.js`, crear `METRICS_PT`, etc., y hacer que el selector `getData(locale)` use PT para `locale === "pt"`.

- [ ] **Step 3: Commit**

```bash
git add edutechlife-frontend/src/components/automationData/
git commit -m "feat(i18n): pt automation landing data"
```

---

### Task 1.7: `useValerioFallback.js` — respuestas de contingencia pt

**Files:**
- Modify: `edutechlife-frontend/src/hooks/IALab/useValerioFallback.js`

- [ ] **Step 1: Leer el selector**

Run: `sed -n '170,214p' edutechlife-frontend/src/hooks/IALab/useValerioFallback.js`

- [ ] **Step 2: Añadir claves pt**

En `FALLBACK_BY_MODULE`, cada entrada tiene `{en:{...}, es:{...}}`. Añadir `pt: {...}` (traducción pt-BR de `es`). Actualizar `smartFallback` para que resuelva `moduleFallback[locale]` y si `locale === "pt"` use la clave `pt` (cae a `es` si no existe). Cambiar `const isEn = locale === 'en'` a un mapa que incluya pt.

- [ ] **Step 3: Commit**

```bash
git add edutechlife-frontend/src/hooks/IALab/useValerioFallback.js
git commit -m "feat(i18n): pt Valerio fallback responses"
```

---

### Task 1.8: `moduleConfig.js` — evaluación IALab prompts pt

**Files:**
- Modify: `edutechlife-frontend/src/hooks/IALab/useIALabEvaluation/moduleConfig.js`

**Nota:** los prompts de generación/evaluación son data interna; el feedback visible (`localEvaluate`, `fallbackExercises`) sí se muestra. Priorizar: (1) `fallbackExercises(locale)` → añadir variante pt; (2) `name: {es,en}` → añadir `pt`; (3) feedback de `localEvaluate` → parametrizar por locale (pt).

- [ ] **Step 1: Leer el archivo (967 líneas)**

Run: `sed -n '60,140p' edutechlife-frontend/src/hooks/IALab/useIALabEvaluation/moduleConfig.js` y las secciones de feedback.

- [ ] **Step 2: Añadir pt a `name` y `fallbackExercises`**

Para cada módulo: `name: { es, en, pt }`. `fallbackExercises(locale)` → usar `resolveLocalized({ es, en, pt }, locale)`.

- [ ] **Step 3: Parametrizar feedback visible**

Los strings de feedback de `localEvaluate` que se muestran/leen al estudiante → mover a `t()` o a un mapa por locale. Dejar los prompts internos como están (es) o traducirlos si es factible en la misma tarea.

- [ ] **Step 4: Commit**

```bash
git add edutechlife-frontend/src/hooks/IALab/useIALabEvaluation/moduleConfig.js
git commit -m "feat(i18n): pt IALab evaluation module config"
```

---

### Task 1.9: `valerioKnowledgeBase.js` — base de conocimiento MAX pt

**Files:**
- Modify: `edutechlife-frontend/src/data/valerioKnowledgeBase.js`

- [ ] **Step 1: Leer la estructura**

Run: `sed -n '1,40p' edutechlife-frontend/src/data/valerioKnowledgeBase.js` y `sed -n '240,270p'`.

- [ ] **Step 2: Añadir `pt` a cada entrada**

Cada entrada es `{id, keywords[], en: {...}, es: {...}}`. Añadir `pt: {...}` (traducción pt-BR de `es`). Cambiar el selector `best.entry[locale === 'en' ? 'en' : 'es']` a `best.entry[locale] || best.entry.es` y añadir las entradas pt.

- [ ] **Step 3: Commit**

```bash
git add edutechlife-frontend/src/data/valerioKnowledgeBase.js
git commit -m "feat(i18n): pt Valerio knowledge base"
```

---

### Task 1.10: `prompts.js` — reactividad + política pt consistente

**Files:**
- Modify: `edutechlife-frontend/src/constants/prompts.js`
- Create: `edutechlife-frontend/src/constants/prompts.pt.js` (opcional)

**Problema:** `prompts.js` lee `localStorage` 1 vez al importar (no reactivo) y `pt→en`.

- [ ] **Step 1: Leer el archivo**

Run: `cat edutechlife-frontend/src/constants/prompts.js`

- [ ] **Step 2: Hacerlo reactivo y añadir pt**

Convertir el acceso de módulo a una función `getPrompts(locale)` que use `locale` como argumento (los consumidores deben llamarla con el locale actual). Para PT, si se crea `prompts.pt.js` (traducción pt-BR de los prompts), usarla; si no, PT→EN (documentado). Mantener el export backward-compat si hay consumidores que importan los prompts directamente.

- [ ] **Step 3: Buscar y actualizar consumidores**

Run: `cd edutechlife-frontend && grep -rn "from .*constants/prompts" src --include="*.js" --include="*.jsx" | head`

Para cada consumidor, llamar `getPrompts(locale)` con el locale del contexto. NO romper la firma si hay consumidores que esperan la constante.

- [ ] **Step 4: Commit**

```bash
git add edutechlife-frontend/src/constants/prompts.js edutechlife-frontend/src/constants/prompts.pt.js
git commit -m "feat(i18n): reactive prompts with pt support"
```

---

### Task 1.11: `CourseRepository.js` — lecciones PT

**Files:**
- Modify: `edutechlife-frontend/src/components/IALab/data/CourseRepository.js`

**Problema:** `getLessons` solo distingue `en ? ALL_LESSONS_EN : ALL_LESSONS` → PT recibe español.

- [ ] **Step 1: Verificar `ALL_LESSONS_PT`**

Run: `cd edutechlife-frontend && grep -c "ALL_LESSONS_PT" src/data/ialab.js` (debe ser >0; ya se creó en la fase IALab).

- [ ] **Step 2: Actualizar el selector**

Cambiar `getLessons` y los selectores que usan `locale === "en" ? ... : ...` a `resolveLocalized({ es, en, pt }, locale)`.

- [ ] **Step 3: Commit**

```bash
git add edutechlife-frontend/src/components/IALab/data/CourseRepository.js
git commit -m "feat(i18n): pt course lessons"
```

---

### Task 1.12: `useValerioVoice.js` + `useProfileData.js` — locale de voz/fechas pt

**Files:**
- Modify: `edutechlife-frontend/src/components/IALab/IALabValerioPanel/useValerioVoice.js`
- Modify: `edutechlife-frontend/src/components/userProfileSmartCard/useProfileData.js`

- [ ] **Step 1: Mapa de locales**

En `useValerioVoice.js` línea ~8: `recognitionLang = locale === "en" ? "en-US" : "es-CO"` → añadir `pt: "pt-BR"`:
```js
const RECOG_LANG = { en: "en-US", pt: "pt-BR", es: "es-CO" };
const recognitionLang = RECOG_LANG[locale] || "es-CO";
```
En `useProfileData.js` línea ~111: mismo patrón para fechas.

- [ ] **Step 2: Commit**

```bash
git add edutechlife-frontend/src/components/IALab/IALabValerioPanel/useValerioVoice.js edutechlife-frontend/src/components/userProfileSmartCard/useProfileData.js
git commit -m "feat(i18n): pt speech recognition and date locales"
```

---

## Fase 2 — Páginas sin i18n

### Task 2.1: `SmartBoardLogin.jsx` — internacionalizar

**Files:**
- Modify: `edutechlife-frontend/src/pages/SmartBoardLogin.jsx`

- [ ] **Step 1: Leer el archivo (612 líneas)**

Run: `sed -n '1,60p' edutechlife-frontend/src/pages/SmartBoardLogin.jsx` y las secciones de texto.

- [ ] **Step 2: Añadir `useTranslation`**

Importar `useTranslation` de `../../i18n/I18nProvider` y `const { t } = useTranslation();`. Reemplazar TODOS los strings visibles por `t("login.*")` / `t("auth.*")` con claves nuevas. Interpolar `{name}`, `{email}`.

- [ ] **Step 3: Añadir las claves a los 3 JSON**

Añadir ~60 claves a `es.json` (texto original), `en.json` (traducción EN), `pt.json` (traducción pt-BR).

- [ ] **Step 4: Verificar**

Run: `cd edutechlife-frontend && npx vitest run src/pages/ 2>&1 | tail -5` (si existen tests de esta página).

- [ ] **Step 5: Commit**

```bash
git add edutechlife-frontend/src/pages/SmartBoardLogin.jsx edutechlife-frontend/src/i18n/es.json edutechlife-frontend/src/i18n/en.json edutechlife-frontend/src/i18n/pt.json
git commit -m "feat(i18n): SmartBoardLogin in 3 languages"
```

---

### Task 2.2: `SmartBoardParentDashboard.jsx` + componentes — internacionalizar

**Files:**
- Modify: `edutechlife-frontend/src/components/pages/smartBoardParentDashboard/SmartBoardParentDashboard.jsx`
- Modify: `.../components/WeeklyReportCard.jsx`
- Modify: `.../components/ParentResources.jsx`
- Modify: `.../components/WellbeingCard.jsx`

- [ ] **Step 1: Identificar strings**

El componente raíz tiene `LEVELS`, `FEATURES`, `NAV`, `getWellness()`, Sidebar, y el JSX inline. Convertir a `t()` con claves `parent_dashboard.*`. Añadir claves a los 3 JSON.

- [ ] **Step 2: Convertir los 3 subcomponentes**

`WeeklyReportCard`, `ParentResources`, `WellbeingCard` → `useTranslation` + `t()`.

- [ ] **Step 3: Commit**

```bash
git add edutechlife-frontend/src/components/pages/smartBoardParentDashboard/ edutechlife-frontend/src/i18n/
git commit -m "feat(i18n): parent dashboard in 3 languages"
```

---

### Task 2.3: `SmartBoardConsentGate.jsx` + `OAuthCallbackHandler.jsx`

**Files:**
- Modify: `edutechlife-frontend/src/components/kids-dashboard/SmartBoardConsentGate.jsx`
- Modify: `edutechlife-frontend/src/pages/OAuthCallbackHandler.jsx` (buscar ruta real con `grep`)

- [ ] **Step 1: Convertir los strings**

"Cargando...", "Guardando consentimiento...", "Procesando autenticación..." → `t()`.

- [ ] **Step 2: Commit**

```bash
git add edutechlife-frontend/src/ edutechlife-frontend/src/i18n/
git commit -m "feat(i18n): consent gate and oauth callback in 3 languages"
```

---

### Task 2.4: `DashboardsDemo.jsx` — decisión

**Files:**
- Modify: `edutechlife-frontend/src/pages/DashboardsDemo.jsx` (o eliminar si es demo no enrutada)

Verificar si la página está enrutada (`grep -rn "DashboardsDemo" src/routes/`). Si no lo está, marcarla como demo (sin acción). Si lo está, convertir a `t()`.

---

## Fase 3 — Componentes con español hardcodeado (agrupar por área)

> Estrategia: cada tarea es un lote de componentes del mismo área. Para cada componente: leer, añadir `useTranslation`, reemplazar strings por `t("namespace.clave")`, añadir las claves a es/en/pt. Ejecutar los tests de la carpeta tras cada lote.

### Task 3.1: kids-dashboard (lote 1 — núcleo)
**Files:** `FlashcardSystem.jsx`, `OralExamSimulator.jsx`, `GradeScanner.jsx`, `ExamPrep.jsx`, `HeroSection.jsx`, `QuizCard.jsx`, `KidsCalendar.jsx`, `ActivityUploader.jsx`, `CrisisResourcesModal.jsx`, `StudyPodcast.jsx`
- [ ] **Step 1:** Para cada archivo: añadir `useTranslation` + `t()` a los strings visibles. NO traducir prompts internos que vayan a la IA salvo que el prompt ya sea parametrizado (dejarlos ES documentado, o traducirlos si la tarea lo permite).
- [ ] **Step 2:** Añadir claves a es/en/pt.
- [ ] **Step 3:** `npx vitest run src/components/kids-dashboard/ 2>&1 | tail -5`
- [ ] **Step 4:** Commit.

### Task 3.2: kids-dashboard (lote 2 — componentes)
**Files:** `UserMenu.jsx`, `GenerateFlashcards.jsx`, `SmartBookReader.jsx`, `daniTutorChat/components/*`, `examPrep/components/*`, `activityUploader/components/*`, `PremiumGate.jsx`, `VAKThemeProvider.jsx`, `DashboardErrorBoundary.jsx`, `components/MisionDelDia.jsx`
- [ ] Pasos iguales que 3.1.

### Task 3.3: Nico chatbot
**Files:** `src/components/Nico/NicoModern.jsx`, `nicoChatMessages.jsx`, `nicoChatInput.jsx`, `nicoChatComponents.jsx`, `src/components/Nico/__tests__/`
- [ ] Convertir a `t()` y añadir claves. NOTA: `PROMPT_NICO_SOPORTE` en `nicoPrompts.js` es data interna (mantener ES o parametrizar).

### Task 3.4: IALab restante
**Files:** `DeepSeekDashboard.jsx`, `forum/ForumOptimizedPostCard.jsx`, `sidebar/SidebarCollapsed.jsx`, `sidebar/SidebarProgressCircle.jsx`, `module/ModuleBookmarkFilter.jsx`, `shared/MobileMenuOverlay.jsx`, `ReadingModeOverlay.jsx`, `shared/TrafficLightControls.jsx`, `ValerioFloatingButton.jsx`, `challenges/module2/CaseContextBanner.jsx`
- [ ] Convertir y añadir claves.

### Task 3.5: smartboard landing sections
**Files:** `src/components/smartboard/*.jsx` (Hero, Planes, QueEs, Beneficios, Final, Tranquilidad, ComoFunciona, VakStyles, SectionNav, VakBadge)
- [ ] Convertir a `t()` las secciones (algunas ya reciben `t` por prop; completar).

### Task 3.6: neuroEntorno + misc
**Files:** `src/components/neuroEntorno/**`, `src/components/SubjectGrid.jsx`, `src/components/XPProgressBar.jsx`, `src/components/LeadsManager.jsx`, `src/components/common/ErrorBoundary.jsx`, `src/components/hero/AnimatedTitle.jsx`, `src/components/MissionCard.jsx`, `src/components/NotificationPanel.jsx`
- [ ] Convertir y añadir claves.

### Task 3.7: admin dashboard
**Files:** `src/components/adminDashboard/**` (AdminLeadsTable, AdminDashboard, adminLeadsTableUtils)
- [ ] Convertir strings visibles; prompts de IA internos documentar.

---

## Fase 4 — Backend parametrizado por idioma

### Task 4.1: `weeklyReport.js` — email semanal pt
**Files:**
- Modify: `edutechlife-backend/src/services/weeklyReport.js`

- [ ] **Step 1:** Leer el archivo.
- [ ] **Step 2:** Añadir parámetro `locale` a `buildWeeklySummary`/`renderWeeklyEmail`. Crear mapas `{es, en, pt}` para subject, plantilla HTML, textos y tips VAK. Añadir pt-BR.
- [ ] **Step 3:** Actualizar la ruta `POST /weekly-report` para aceptar `locale` del body y pasarlo.
- [ ] **Step 4:** Tests: `npx vitest run src/__tests__/services/weeklyReport.test.js` y `src/__tests__/routes/smartboard.test.js`.
- [ ] **Step 5:** Commit.

### Task 4.2: `emailService.js` + `crisisDetection.js` — emails transaccionales pt
**Files:**
- Modify: `edutechlife-backend/src/services/emailService.js`
- Modify: `edutechlife-backend/src/services/crisisDetection.js`

- [ ] **Step 1:** `sendConsentVerificationEmail` acepta `locale`; plantilla pt.
- [ ] **Step 2:** `formatCrisisAlertEmail` acepta `locale`; plantilla pt (líneas de ayuda pt-BR).
- [ ] **Step 3:** Commit.

### Task 4.3: `authService.js` + `rateLimiter.js` + rutas — mensajes de error pt
**Files:**
- Modify: `edutechlife-backend/src/services/authService.js`
- Modify: `edutechlife-backend/src/middleware/rateLimiter.js`
- Modify: `edutechlife-backend/src/routes/smartboard.js` (`DANI_SYSTEM_PROMPT`)
- Modify: `edutechlife-backend/src/routes/auth.js`

- [ ] **Step 1:** Crear `edutechlife-backend/src/utils/messages.js` con mapa `{es,en,pt}` para los mensajes de error comunes (password, email, invitación, rate-limit). Reemplazar los strings hardcodeados por `msg(key, locale)`.
- [ ] **Step 2:** `DANI_SYSTEM_PROMPT` → parametrizar por idioma (es/en/pt) seleccionado según `req.body.language` (el endpoint ya recibe `language`).
- [ ] **Step 3:** Tests: `npx vitest run src/__tests__/`.
- [ ] **Step 4:** Commit.

---

## Fase 5 — Verificación final

### Task 5.1: Validación completa
- [ ] **Step 1:** `cd edutechlife-frontend && npm run i18n:validate` → PASS.
- [ ] **Step 2:** `cd edutechlife-frontend && npm run build:fast` → build OK.
- [ ] **Step 3:** `cd edutechlife-frontend && npx vitest run src/tests/a11y/ src/store/__tests__/ 2>&1 | tail -5` → sin regresiones.
- [ ] **Step 4:** `cd edutechlife-backend && npx vitest run 2>&1 | tail -5` → sin regresiones (excepto los fallos preexistentes documentados).

### Task 5.2: Prueba manual de los 3 idiomas
- [ ] **Step 1:** `cd edutechlife-frontend && npm run dev`
- [ ] **Step 2:** Abrir `/`, cambiar a EN → la landing, footer, header, secciones en inglés.
- [ ] **Step 3:** Cambiar a PT → contenido en portugués (landing, footer, secciones, no español).
- [ ] **Step 4:** `/ialab` en PT → lecciones, exámenes, OVAs, sidebar, Valerio/MAX en portugués.
- [ ] **Step 5:** `/smartboard/login` en PT → página en portugués.

---

## Self-Review

**Cobertura del spec (3 idiomas en todo el proyecto):**
- pt.json → Task 0.4 ✅
- en.json → Task 0.3 ✅
- Selectores ES/EN → Fase 1 (Tasks 1.1–1.12) ✅
- Páginas sin i18n → Fase 2 ✅
- Componentes hardcodeados → Fase 3 (Tasks 3.1–3.7) ✅
- Backend → Fase 4 (Tasks 4.1–4.3) ✅
- SEO/hreflang/sitemap/scripts → Fase 0 (0.5, 0.6) ✅
- Validador 3 idiomas → Task 0.1 ✅
- keys.d.ts → Task 0.2 ✅

**Placeholder scan:** todos los pasos tienen código o comandos concretos. Las tareas de conversión de componentes indican el patrón exacto (`useTranslation` + `t()` + claves en 3 JSON) y el comando de verificación.

**Consistencia de tipos:** `resolveLocalized({ es, en, pt }, locale)` es el patrón uniforme de la Fase 1; `t("ns.clave", {var})` es el patrón de las Fases 2-3; `msg(key, locale)` del backend (Task 4.3) es consistente entre authService/rateLimiter/rutas.

**Decisiones documentadas:**
- Prompts internos de IA (DANI_SYSTEM_PROMPT, Nico, Valerio) se parametrizan en la Fase 4; los prompts visibles en componentes se traducen; los puramente internos se documentan.
- Política PT consistente: `pt→pt`, fallback `pt→en`, último `es` (unifica la inconsistencia actual `pt→es` vs `pt→en`).
- `SEO.jsx` y sitemap añaden pt; el routing por URL de locale queda como mejora futura (el idioma se maneja por localStorage).
