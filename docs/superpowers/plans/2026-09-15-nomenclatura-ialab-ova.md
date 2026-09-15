# Nomenclatura iLAB (OVA, módulos y metodologías) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Política de commits:** este repo no permite commitear sin autorización explícita del usuario. Los pasos de commit están marcados como **opcionales**; omítelos salvo que el usuario lo pida.

**Goal:** Unificar la nomenclatura de los OVA, módulos y metodologías del curso en una fuente única (registro canónico) y propagarla a los recursos trilingües, catálogo, registro de render, i18n y base de conocimiento.

**Architecture:** Se introduce `ovaNaming.js` como fuente única de verdad (código `ILAB-M#-OVA#`, nombre propio localizado, descriptor, principio). Un script idempotente propaga los nombres a `resourcesEs/En/Pt.js` localizando por `id`. Luego se alinean `ovaData.js` (catálogo + módulos), `ovaComponents.jsx` (render) e i18n. Cada cambio queda cubierto por tests de Vitest.

**Tech Stack:** React 18 + Vite, Vitest, ESM. Datos en `src/components/IALab/constants/`.

---

## Scope Check

Una sola unidad de trabajo: **metadatos de nomenclatura**. No se crean componentes nuevos ni se renombran archivos de componentes (Fase 2 opcional). No se tocan las **claves de tema** de `RESOURCES_*` (romperían `contentIntegrity.test.js`) ni los conteos de recursos.

## File Structure

| Archivo | Responsabilidad | Acción |
|---|---|---|
| `src/components/IALab/constants/ovaNaming.js` | Fuente única: OVA_REGISTRY, MODULE_PRINCIPLES, METHODOLOGY_PRINCIPLES | Crear |
| `src/components/IALab/__tests__/ovaNaming.test.js` | Valida formato, unicidad y conteos del registro | Crear |
| `scripts/apply-ova-names.mjs` | Propaga nombres del registro a `resourcesEs/En/Pt.js` | Crear |
| `src/components/IALab/__tests__/ovaTitles.test.js` | Verifica que los recursos usan los nombres nuevos | Crear |
| `src/components/IALab/constants/moduleResources/resourcesEs.js` | Títulos OVA (ES) | Modificar |
| `src/components/IALab/constants/moduleResources/resourcesEn.js` | Títulos OVA (EN) | Modificar |
| `src/components/IALab/constants/moduleResources/resourcesPt.js` | Títulos OVA (PT) | Modificar |
| `src/components/IALab/ova/ovaData.js` | Catálogo OVA + `MODULE_NAMES` | Modificar |
| `src/components/IALab/ResourceViewerModal/ovaComponents.jsx` | Registro de render por id | Modificar |
| `src/i18n/es.json`, `en.json`, `pt.json` | Claves de nombre por OVA | Modificar |

**Comando de tests (siempre desde `edutechlife-frontend/`):** `npx vitest run <ruta>` y `npm test`.

---

### Task 1: Registro canónico de nomenclatura

**Files:**
- Create: `edutechlife-frontend/src/components/IALab/constants/ovaNaming.js`
- Test: `edutechlife-frontend/src/components/IALab/__tests__/ovaNaming.test.js`

- [ ] **Step 1: Escribir el test que falla**

```javascript
// src/components/IALab/__tests__/ovaNaming.test.js
import { describe, it, expect } from "vitest";
import {
  OVA_REGISTRY,
  MODULE_PRINCIPLES,
  METHODOLOGY_PRINCIPLES,
} from "../constants/ovaNaming.js";

const CODE_RE = /^ILAB-M[1-5]-OVA\d+$/;

describe("Registro canónico de OVA", () => {
  it("cada OVA tiene código, nombre, descriptor y principio", () => {
    for (const o of OVA_REGISTRY) {
      expect(o.code).toMatch(CODE_RE);
      expect(o.name.es?.length).toBeGreaterThan(0);
      expect(o.name.en?.length).toBeGreaterThan(0);
      expect(o.name.pt?.length).toBeGreaterThan(0);
      expect(o.descriptor.es?.length).toBeGreaterThan(0);
      expect(o.principle?.length).toBeGreaterThan(0);
      expect([1, 2, 3, 4, 5]).toContain(o.module);
    }
  });

  it("no hay códigos ni nombres duplicados", () => {
    const codes = OVA_REGISTRY.map((o) => o.code);
    const names = OVA_REGISTRY.map((o) => o.name.es);
    expect(new Set(codes).size).toBe(codes.length);
    expect(new Set(names).size).toBe(names.length);
  });

  it("los OVA activos tienen resourceId; los planificados no", () => {
    for (const o of OVA_REGISTRY) {
      if (o.status === "active") expect(o.resourceId).toBeTruthy();
      if (o.status === "planned") expect(o.resourceId).toBeFalsy();
    }
  });

  it("los resourceId activos son únicos", () => {
    const ids = OVA_REGISTRY.filter((o) => o.resourceId).map((o) => o.resourceId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("los módulos tienen principio", () => {
    for (const m of [1, 2, 3, 4, 5]) {
      expect(MODULE_PRINCIPLES[m]?.es?.length).toBeGreaterThan(0);
    }
  });

  it("las metodologías tienen nombre y principio", () => {
    expect(METHODOLOGY_PRINCIPLES.length).toBeGreaterThanOrEqual(7);
    for (const m of METHODOLOGY_PRINCIPLES) {
      expect(m.name.es?.length).toBeGreaterThan(0);
      expect(m.principle?.length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 2: Ejecutar el test y verificar que falla**

Run: `npx vitest run src/components/IALab/__tests__/ovaNaming.test.js`
Expected: FAIL — no existe `../constants/ovaNaming.js`.

- [ ] **Step 3: Crear el registro**

```javascript
// src/components/IALab/constants/ovaNaming.js

export const MODULE_PRINCIPLES = {
  1: { role: { es: "El Artesano Digital", en: "The Digital Artisan", pt: "O Artesão Digital" }, principle: "Precisión", principleLine: "Una instrucción precisa transforma el resultado" },
  2: { role: { es: "El Arquitecto de Automatización", en: "The Automation Architect", pt: "O Arquiteto de Automação" }, principle: "Estructura", principleLine: "Lo que se diseña bien se automatiza mejor" },
  3: { role: { es: "El Detective de Datos", en: "The Data Detective", pt: "O Detetive de Dados" }, principle: "Evidencia", principleLine: "Solo lo verificado es conocimiento" },
  4: { role: { es: "El Alquimista del Conocimiento", en: "The Knowledge Alchemist", pt: "O Alquimista do Conhecimento" }, principle: "Síntesis", principleLine: "Todo documento puede transmutarse en conocimiento" },
  5: { role: { es: "El Guardián de la IA", en: "The AI Guardian", pt: "O Guardião da IA" }, principle: "Responsabilidad", principleLine: "El poder sin ética es riesgo" },
};

export const METHODOLOGY_PRINCIPLES = [
  { id: "vak", name: { es: "Brújula VAK", en: "VAK Compass", pt: "Bússola VAK" }, principle: "Personalización" },
  { id: "steam", name: { es: "Enfoque STEAM", en: "STEAM Approach", pt: "Abordagem STEAM" }, principle: "Integración" },
  { id: "abr", name: { es: "Método Reto", en: "Challenge Method", pt: "Método Desafio" }, principle: "Aplicación" },
  { id: "neuro", name: { es: "Diseño Neurocognitivo", en: "Neurocognitive Design", pt: "Design Neurocognitivo" }, principle: "Retención" },
  { id: "max", name: { es: "Acompañamiento MAX", en: "MAX Companionship", pt: "Acompanhamento MAX" }, principle: "Acompañamiento" },
  { id: "gamification", name: { es: "Motor de Progreso", en: "Progress Engine", pt: "Motor de Progresso" }, principle: "Motivación" },
  { id: "edutechlife", name: { es: "Ruta Edutechlife", en: "Edutechlife Path", pt: "Rota Edutechlife" }, principle: "Progresión" },
];

export const OVA_REGISTRY = [
  // M1 — El Artesano Digital (Precisión)
  { code: "ILAB-M1-OVA1", module: 1, status: "planned", resourceId: null,
    name: { es: "Los Orígenes", en: "The Origins", pt: "As Origens" },
    descriptor: { es: "Historia de la IA, de Turing a ChatGPT", en: "AI history, from Turing to ChatGPT", pt: "História da IA, de Turing ao ChatGPT" },
    principle: "Contexto" },
  { code: "ILAB-M1-OVA2", module: 1, status: "active", resourceId: "prompt-ova-html-1", component: "OVAIntroPrompt",
    name: { es: "El Cincel", en: "The Chisel", pt: "O Cinzel" },
    descriptor: { es: "Fundamentos del prompt y su anatomía", en: "Prompt fundamentals and anatomy", pt: "Fundamentos e anatomia do prompt" },
    principle: "Claridad" },
  { code: "ILAB-M1-OVA3", module: 1, status: "active", resourceId: "prompt-lab-ova-1", component: "OVAPromptLab",
    name: { es: "El Banco de Forja", en: "The Forge Bench", pt: "A Bancada de Forja" },
    descriptor: { es: "Laboratorio de prompts en vivo", en: "Live prompt laboratory", pt: "Laboratório de prompts ao vivo" },
    principle: "Práctica deliberada" },

  // M2 — El Arquitecto de Automatización (Estructura)
  { code: "ILAB-M2-OVA1", module: 2, status: "active", resourceId: "chatgpt-ova-ecosystem", component: "OVAEcosystemGuide",
    name: { es: "El Plano Maestro", en: "The Master Blueprint", pt: "A Planta Mestra" },
    descriptor: { es: "Mapa del ecosistema ChatGPT", en: "Map of the ChatGPT ecosystem", pt: "Mapa do ecossistema ChatGPT" },
    principle: "Visión sistémica" },
  { code: "ILAB-M2-OVA2", module: 2, status: "active", resourceId: "workflow-ova-herramientas", component: "OVAChatGPTTools",
    name: { es: "La Caja de Herramientas", en: "The Toolbox", pt: "A Caixa de Ferramentas" },
    descriptor: { es: "Arsenal integrado de ChatGPT", en: "ChatGPT integrated toolkit", pt: "Arsenal integrado do ChatGPT" },
    principle: "Herramienta correcta" },
  { code: "ILAB-M2-OVA3", module: 2, status: "active", resourceId: "automation-flows-ova-1", component: "OVAAutomationFlows",
    name: { es: "La Línea de Montaje", en: "The Assembly Line", pt: "A Linha de Montagem" },
    descriptor: { es: "Flujos de automatización", en: "Automation flows", pt: "Fluxos de automação" },
    principle: "Eficiencia" },
  { code: "ILAB-M2-OVA4", module: 2, status: "active", resourceId: "gpts-ova-1", component: "OVABuildGPT",
    name: { es: "La Fábrica de Asistentes", en: "The Assistant Factory", pt: "A Fábrica de Assistentes" },
    descriptor: { es: "Construye tu GPT", en: "Build your GPT", pt: "Construa seu GPT" },
    principle: "Personalización" },

  // M3 — El Detective de Datos (Evidencia)
  { code: "ILAB-M3-OVA1", module: 3, status: "active", resourceId: "workspace-ova-1", component: "OvaEdutechlife",
    name: { es: "La Lupa Multimodal", en: "The Multimodal Lens", pt: "A Lupa Multimodal" },
    descriptor: { es: "Misión Gemini", en: "Gemini mission", pt: "Missão Gemini" },
    principle: "Observación" },
  { code: "ILAB-M3-OVA2", module: 3, status: "active", resourceId: "gemini-cases-ova-1", component: "OVAPracticalCases",
    name: { es: "El Caso Abierto", en: "The Open Case", pt: "O Caso Aberto" },
    descriptor: { es: "Casos prácticos con Gemini", en: "Practical cases with Gemini", pt: "Casos práticos com Gemini" },
    principle: "Aplicación" },
  { code: "ILAB-M3-OVA3", module: 3, status: "active", resourceId: "gemini-deep-research-ova-1", component: "OVAGeminiDeepResearch",
    name: { es: "El Archivo Forense", en: "The Forensic Archive", pt: "O Arquivo Forense" },
    descriptor: { es: "Investigación profunda y verificación", en: "Deep research and verification", pt: "Pesquisa profunda e verificação" },
    principle: "Verificación" },

  // M4 — El Alquimista del Conocimiento (Síntesis)
  { code: "ILAB-M4-OVA1", module: 4, status: "active", resourceId: "notebooklm-ova-1", component: "OVANotebookLab",
    name: { es: "El Grimorio", en: "The Grimoire", pt: "O Grimório" },
    descriptor: { es: "Construye tu notebook inteligente", en: "Build your smart notebook", pt: "Construa seu notebook inteligente" },
    principle: "Curaduría" },
  { code: "ILAB-M4-OVA2", module: 4, status: "active", resourceId: "notebook-summary-ova-1", component: "OVANotebookSimulator",
    name: { es: "El Crisol", en: "The Crucible", pt: "O Crisol" },
    descriptor: { es: "Simulador de análisis documental", en: "Document analysis simulator", pt: "Simulador de análise documental" },
    principle: "Síntesis" },
  { code: "ILAB-M4-OVA3", module: 4, status: "active", resourceId: "notebook-audio-guide-1", component: "OVANotebookPodcastGuide",
    name: { es: "La Fórmula Sonora", en: "The Sound Formula", pt: "A Fórmula Sonora" },
    descriptor: { es: "Guía de Audio Overviews", en: "Audio Overviews guide", pt: "Guia de Audio Overviews" },
    principle: "Divulgación" },
  { code: "ILAB-M4-OVA4", module: 4, status: "active", resourceId: "notebook-audio-ova-1", component: "OVAPodcastStudio",
    name: { es: "El Estudio Alquímico", en: "The Alchemical Studio", pt: "O Estúdio Alquímico" },
    descriptor: { es: "Crea tu podcast IA", en: "Create your AI podcast", pt: "Crie seu podcast de IA" },
    principle: "Creación" },
  { code: "ILAB-M4-OVA5", module: 4, status: "active", resourceId: "document-mastery-ova-1", component: "OVADocumentMastery",
    name: { es: "La Transmutación", en: "The Transmutation", pt: "A Transmutação" },
    descriptor: { es: "Del documento al podcast", en: "From document to podcast", pt: "Do documento ao podcast" },
    principle: "Transformación" },

  // M5 — El Guardián de la IA (Responsabilidad)
  { code: "ILAB-M5-OVA1", module: 5, status: "active", resourceId: "intro-ova-1", component: "OVAEtica",
    name: { es: "El Juramento", en: "The Oath", pt: "O Juramento" },
    descriptor: { es: "Los 4 principios éticos", en: "The 4 ethical principles", pt: "Os 4 princípios éticos" },
    principle: "Transparencia" },
  { code: "ILAB-M5-OVA2", module: 5, status: "active", resourceId: "bias-ova-1", component: "OVABiasLab",
    name: { es: "El Espejo de la Verdad", en: "The Mirror of Truth", pt: "O Espelho da Verdade" },
    descriptor: { es: "Detector de sesgos", en: "Bias detector", pt: "Detector de vieses" },
    principle: "Equidad" },
  { code: "ILAB-M5-OVA3", module: 5, status: "active", resourceId: "privacy-ova-1", component: "OVARiskSimulator",
    name: { es: "La Brújula de Riesgos", en: "The Risk Compass", pt: "A Bússola de Riscos" },
    descriptor: { es: "Privacidad y evaluación de riesgos", en: "Privacy and risk assessment", pt: "Privacidade e avaliação de riscos" },
    principle: "Prudencia" },
  { code: "ILAB-M5-OVA4", module: 5, status: "active", resourceId: "ethics-ova-1", component: "OVAEthicalDilemmas",
    name: { es: "El Tribunal Ético", en: "The Ethical Tribunal", pt: "O Tribunal Ético" },
    descriptor: { es: "Dilemas éticos", en: "Ethical dilemmas", pt: "Dilemas éticos" },
    principle: "Juicio" },
  { code: "ILAB-M5-OVA5", module: 5, status: "active", resourceId: "ethics-cases-ova-1", component: "OVAEthicsCases",
    name: { es: "Casos del Guardián", en: "The Guardian's Cases", pt: "Os Casos do Guardião" },
    descriptor: { es: "Ética aplicada al mundo real", en: "Applied ethics in the real world", pt: "Ética aplicada ao mundo real" },
    principle: "Consecuencia" },
];

export function getOvaByCode(code) {
  return OVA_REGISTRY.find((o) => o.code === code) || null;
}
export function getOvaByResourceId(resourceId) {
  return OVA_REGISTRY.find((o) => o.resourceId === resourceId) || null;
}
export function getActiveOvas() {
  return OVA_REGISTRY.filter((o) => o.status === "active");
}
```

- [ ] **Step 4: Ejecutar el test y verificar que pasa**

Run: `npx vitest run src/components/IALab/__tests__/ovaNaming.test.js`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit (opcional, solo con autorización)**

```bash
git add edutechlife-frontend/src/components/IALab/constants/ovaNaming.js edutechlife-frontend/src/components/IALab/__tests__/ovaNaming.test.js
git commit -m "feat(ialab): add canonical OVA naming registry"
```

---

### Task 2: Propagar nombres a los recursos (ES/EN/PT)

**Files:**
- Create: `edutechlife-frontend/scripts/apply-ova-names.mjs`
- Test: `edutechlife-frontend/src/components/IALab/__tests__/ovaTitles.test.js`
- Modify: `src/components/IALab/constants/moduleResources/resourcesEs.js`, `resourcesEn.js`, `resourcesPt.js`

- [ ] **Step 1: Escribir el test que falla**

```javascript
// src/components/IALab/__tests__/ovaTitles.test.js
import { describe, it, expect } from "vitest";
import { RESOURCES_ES } from "../constants/moduleResources/resourcesEs.js";
import { RESOURCES_EN } from "../constants/moduleResources/resourcesEn.js";
import { RESOURCES_PT } from "../constants/moduleResources/resourcesPt.js";
import { getActiveOvas } from "../constants/ovaNaming.js";

const FILES = { es: RESOURCES_ES, en: RESOURCES_EN, pt: RESOURCES_PT };

function ovaTitle(locale, resourceId) {
  const groups = FILES[locale];
  for (const group of Object.values(groups)) {
    const r = (group.resources || []).find((x) => x.id === resourceId);
    if (r) return r.title;
  }
  return null;
}

describe("Títulos de OVA alineados al registro canónico", () => {
  for (const locale of ["es", "en", "pt"]) {
    for (const ova of getActiveOvas()) {
      it(`${locale}: ${ova.code} usa "${ova.name[locale]}"`, () => {
        expect(ovaTitle(locale, ova.resourceId)).toBe(ova.name[locale]);
      });
    }
  }
});
```

- [ ] **Step 2: Ejecutar el test y verificar que falla**

Run: `npx vitest run src/components/IALab/__tests__/ovaTitles.test.js`
Expected: FAIL (títulos antiguos).

- [ ] **Step 3: Crear el script de propagación (idempotente, localiza por `id`)**

```javascript
// scripts/apply-ova-names.mjs
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { getActiveOvas } from "../src/components/IALab/constants/ovaNaming.js";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const FILES = {
  es: "src/components/IALab/constants/moduleResources/resourcesEs.js",
  en: "src/components/IALab/constants/moduleResources/resourcesEn.js",
  pt: "src/components/IALab/constants/moduleResources/resourcesPt.js",
};

let changed = 0;
for (const [locale, rel] of Object.entries(FILES)) {
  const path = resolve(ROOT, rel);
  let src = readFileSync(path, "utf8");
  for (const ova of getActiveOvas()) {
    const re = new RegExp(`(id:\\s*"${ova.resourceId}"[\\s\\S]*?title:\\s*")([^"]*)(")`, "m");
    if (!re.test(src)) {
      console.warn(`[skip] ${locale} ${ova.resourceId} no encontrado`);
      continue;
    }
    src = src.replace(re, `$1${ova.name[locale]}$3`);
    changed += 1;
  }
  writeFileSync(path, src);
}
console.log(`OK — ${changed} títulos actualizados`);
```

- [ ] **Step 4: Ejecutar el script**

Run: `node scripts/apply-ova-names.mjs`
Expected: `OK — 57 títulos actualizados` (19 OVA activos × 3 idiomas).

- [ ] **Step 5: Ejecutar el test y verificar que pasa**

Run: `npx vitest run src/components/IALab/__tests__/ovaTitles.test.js`
Expected: PASS.

- [ ] **Step 6: Verificación de integridad existente**

Run: `npx vitest run src/components/IALab/__tests__/contentIntegrity.test.js`
Expected: PASS (no se tocaron claves de tema ni conteos).

- [ ] **Step 7: Commit (opcional)**

```bash
git add edutechlife-frontend/scripts/apply-ova-names.mjs edutechlife-frontend/src/components/IALab/__tests__/ovaTitles.test.js edutechlife-frontend/src/components/IALab/constants/moduleResources/
git commit -m "feat(ialab): apply canonical OVA names to ES/EN/PT resources"
```

---

### Task 3: Alinear `ovaData.js` (catálogo + módulos)

**Files:**
- Modify: `src/components/IALab/ova/ovaData.js`
- Test: `src/components/IALab/__tests__/ovaCatalog.test.js` (crear)

- [ ] **Step 1: Escribir el test que falla**

```javascript
// src/components/IALab/__tests__/ovaCatalog.test.js
import { describe, it, expect } from "vitest";
import { OVA_CATALOG, MODULE_NAMES } from "../ova/ovaData.js";
import { getActiveOvas, MODULE_PRINCIPLES } from "../constants/ovaNaming.js";

describe("Catálogo de OVA y módulos", () => {
  it("todo OVA activo está en el catálogo con nombre y módulo correctos", () => {
    for (const ova of getActiveOvas()) {
      const entry = OVA_CATALOG.find((o) => o.id === ova.resourceId);
      expect(entry, `falta en catálogo: ${ova.resourceId}`).toBeTruthy();
      expect(entry.title).toBe(ova.name.es);
      expect(entry.module).toBe(ova.module);
      expect(entry.component).toBe(ova.component);
    }
  });

  it("M3 y M5 declaran su rol narrativo", () => {
    expect(MODULE_NAMES[3].es).toContain("Detective");
    expect(MODULE_NAMES[5].es).toContain("Guardián");
  });

  it("cada módulo del catálogo usa su nombre de rol", () => {
    for (const m of [1, 2, 3, 4, 5]) {
      expect(MODULE_NAMES[m].es).toContain(MODULE_PRINCIPLES[m].role.es);
    }
  });
});
```

- [ ] **Step 2: Ejecutar y verificar que falla**

Run: `npx vitest run src/components/IALab/__tests__/ovaCatalog.test.js`
Expected: FAIL (títulos/módulos desalineados y faltan entradas).

- [ ] **Step 3: Actualizar `OVA_CATALOG`**

Reemplaza el arreglo `OVA_CATALOG` por estas 19 entradas (mismos `id` existentes + `gemini-deep-research-ova-1`; `intro-ova-1` pasa a `module: 5`):

```javascript
export const OVA_CATALOG = [
  { id: "prompt-ova-html-1", title: "El Cincel", module: 1, icon: "fa-brain", duration: "15 min", description: "Fundamentos del prompt y su anatomía.", component: "OVAIntroPrompt" },
  { id: "prompt-lab-ova-1", title: "El Banco de Forja", module: 1, icon: "fa-hammer", duration: "15 min", description: "Laboratorio de prompts en vivo con retroalimentación.", component: "OVAPromptLab" },
  { id: "chatgpt-ova-ecosystem", title: "El Plano Maestro", module: 2, icon: "fa-sitemap", duration: "20 min", description: "Mapa del ecosistema ChatGPT.", component: "OVAEcosystemGuide" },
  { id: "workflow-ova-herramientas", title: "La Caja de Herramientas", module: 2, icon: "fa-wand-magic-sparkles", duration: "25 min", description: "Arsenal integrado de ChatGPT.", component: "OVAChatGPTTools" },
  { id: "automation-flows-ova-1", title: "La Línea de Montaje", module: 2, icon: "fa-diagram-project", duration: "22 min", description: "Flujos de automatización en el mundo real.", component: "OVAAutomationFlows" },
  { id: "gpts-ova-1", title: "La Fábrica de Asistentes", module: 2, icon: "fa-robot", duration: "25 min", description: "Construye tu GPT personalizado.", component: "OVABuildGPT" },
  { id: "workspace-ova-1", title: "La Lupa Multimodal", module: 3, icon: "fa-atom", duration: "25 min", description: "Misión Gemini: capacidades multimodales y Workspace.", component: "OvaEdutechlife" },
  { id: "gemini-cases-ova-1", title: "El Caso Abierto", module: 3, icon: "fa-briefcase", duration: "25 min", description: "Casos prácticos con Gemini.", component: "OVAPracticalCases" },
  { id: "gemini-deep-research-ova-1", title: "El Archivo Forense", module: 3, icon: "fa-magnifying-glass", duration: "25 min", description: "Investigación profunda y verificación de fuentes.", component: "OVAGeminiDeepResearch" },
  { id: "notebooklm-ova-1", title: "El Grimorio", module: 4, icon: "fa-flask-vial", duration: "15 min", description: "Construye tu notebook inteligente.", component: "OVANotebookLab" },
  { id: "notebook-summary-ova-1", title: "El Crisol", module: 4, icon: "fa-file-text", duration: "20 min", description: "Simulador de análisis documental.", component: "OVANotebookSimulator" },
  { id: "notebook-audio-guide-1", title: "La Fórmula Sonora", module: 4, icon: "fa-podcast", duration: "30 min", description: "Guía de Audio Overviews.", component: "OVANotebookPodcastGuide" },
  { id: "notebook-audio-ova-1", title: "El Estudio Alquímico", module: 4, icon: "fa-microphone", duration: "15 min", description: "Crea tu podcast IA.", component: "OVAPodcastStudio" },
  { id: "document-mastery-ova-1", title: "La Transmutación", module: 4, icon: "fa-arrows-spin", duration: "24 min", description: "Del documento al podcast sin perder profundidad.", component: "OVADocumentMastery" },
  { id: "intro-ova-1", title: "El Juramento", module: 5, icon: "fa-balance-scale", duration: "15 min", description: "Los 4 principios éticos de la IA.", component: "OVAEtica" },
  { id: "bias-ova-1", title: "El Espejo de la Verdad", module: 5, icon: "fa-exclamation-triangle", duration: "15 min", description: "Detector de sesgos algorítmicos.", component: "OVABiasLab" },
  { id: "privacy-ova-1", title: "La Brújula de Riesgos", module: 5, icon: "fa-shield-alt", duration: "20 min", description: "Privacidad y evaluación de riesgos.", component: "OVARiskSimulator" },
  { id: "ethics-ova-1", title: "El Tribunal Ético", module: 5, icon: "fa-scale-balanced", duration: "25 min", description: "Dilemas éticos con consecuencias reales.", component: "OVAEthicalDilemmas" },
  { id: "ethics-cases-ova-1", title: "Casos del Guardián", module: 5, icon: "fa-gavel", duration: "20 min", description: "Ética aplicada al mundo real.", component: "OVAEthicsCases" },
];
```

- [ ] **Step 4: Actualizar `MODULE_NAMES`**

Reemplaza M3 y M5 (y unifica M1/M2/M4 con el rol del registro):

```javascript
export const MODULE_NAMES = {
  1: { es: "El Artesano Digital — Ingeniería de Prompts", en: "The Digital Artisan — Prompt Engineering", pt: "O Artesão Digital — Engenharia de Prompts" },
  2: { es: "El Arquitecto de Automatización — ChatGPT", en: "The Automation Architect — ChatGPT", pt: "O Arquiteto de Automação — ChatGPT" },
  3: { es: "El Detective de Datos — Rastreo Profundo con Gemini", en: "The Data Detective — Deep Tracking with Gemini", pt: "O Detetive de Dados — Rastreamento com Gemini" },
  4: { es: "El Alquimista del Conocimiento — NotebookLM", en: "The Knowledge Alchemist — NotebookLM", pt: "O Alquimista do Conhecimento — NotebookLM" },
  5: { es: "El Guardián de la IA — Ética y Gobernanza", en: "The AI Guardian — Ethics and Governance", pt: "O Guardião da IA — Ética e Governança" },
};
```

- [ ] **Step 5: Ejecutar el test y verificar que pasa**

Run: `npx vitest run src/components/IALab/__tests__/ovaCatalog.test.js`
Expected: PASS.

- [ ] **Step 6: Commit (opcional)**

```bash
git add edutechlife-frontend/src/components/IALab/ova/ovaData.js edutechlife-frontend/src/components/IALab/__tests__/ovaCatalog.test.js
git commit -m "feat(ialab): align OVA catalog and module roles"
```

---

### Task 4: Registrar el OVA huérfano y limpiar mapeo muerto

**Files:**
- Modify: `src/components/IALab/ResourceViewerModal/ovaComponents.jsx`
- Test: `src/components/IALab/__tests__/ovaRegistry.test.js` (crear)

- [ ] **Step 1: Escribir el test que falla**

```javascript
// src/components/IALab/__tests__/ovaRegistry.test.js
import { describe, it, expect } from "vitest";
import { OVA_COMPONENTS } from "../ResourceViewerModal/ovaComponents.jsx";
import { getActiveOvas } from "../constants/ovaNaming.js";

describe("Registro de render de OVA", () => {
  it("todo OVA activo tiene componente registrado", () => {
    for (const ova of getActiveOvas()) {
      expect(OVA_COMPONENTS[ova.resourceId], `sin render: ${ova.resourceId}`).toBeTruthy();
    }
  });

  it("no hay mapeos muertos (ids sin OVA activo)", () => {
    const valid = new Set(getActiveOvas().map((o) => o.resourceId));
    const dead = Object.keys(OVA_COMPONENTS).filter((k) => !valid.has(k));
    expect(dead).toEqual([]);
  });
});
```

- [ ] **Step 2: Ejecutar y verificar que falla**

Run: `npx vitest run src/components/IALab/__tests__/ovaRegistry.test.js`
Expected: FAIL — falta `gemini-deep-research-ova-1` y sobra `gemini-ova-1`.

- [ ] **Step 3: Editar `ovaComponents.jsx`**

Añade el import perezoso junto a los demás y ajusta el mapa:

```javascript
const OVAGeminiDeepResearch = lazyWithRetry(() => import('../OVAGeminiDeepResearch.jsx'));
```

En `OVA_COMPONENTS`: **elimina** la línea `'gemini-ova-1': InteractiveViewer,` y **añade**:

```javascript
  'gemini-deep-research-ova-1': OVAGeminiDeepResearch,
```

- [ ] **Step 4: Ejecutar el test y verificar que pasa**

Run: `npx vitest run src/components/IALab/__tests__/ovaRegistry.test.js`
Expected: PASS.

- [ ] **Step 5: Commit (opcional)**

```bash
git add edutechlife-frontend/src/components/IALab/ResourceViewerModal/ovaComponents.jsx edutechlife-frontend/src/components/IALab/__tests__/ovaRegistry.test.js
git commit -m "feat(ialab): register deep-research OVA and drop dead mapping"
```

---

### Task 5: Claves i18n de nombre por OVA

**Files:**
- Modify: `src/i18n/es.json`, `src/i18n/en.json`, `src/i18n/pt.json`
- Test: `src/components/IALab/challenges/__tests__/i18nKeys.test.js` (existente, no romper) + `npm run i18n:validate`

- [ ] **Step 1: Añadir `display_name` a cada namespace de OVA (ES)**

Para cada OVA activo añade la clave `ova.<namespace>.display_name` con el nombre en español. Ejemplo (repetir para los 19, usando el namespace de cada OVA):

```json
"ova.introprompt.display_name": "El Cincel",
"ova.promptlab.display_name": "El Banco de Forja",
"ova.ecosystem.display_name": "El Plano Maestro",
"ova.chatgpttools.display_name": "La Caja de Herramientas",
"ova.automation.display_name": "La Línea de Montaje",
"ova.buildgpt.display_name": "La Fábrica de Asistentes",
"ova.tour.display_name": "La Lupa Multimodal",
"ova.practical.display_name": "El Caso Abierto",
"ova.geminideepresearch.display_name": "El Archivo Forense",
"ova.notebooklab.display_name": "El Grimorio",
"ova.notebooksim.display_name": "El Crisol",
"ova.podcastguide.display_name": "La Fórmula Sonora",
"ova.podcaststudio.display_name": "El Estudio Alquímico",
"ova.docmastery.display_name": "La Transmutación",
"ova.etica.display_name": "El Juramento",
"ova.biaslab.display_name": "El Espejo de la Verdad",
"ova.risksim.display_name": "La Brújula de Riesgos",
"ova.ethical_dilemmas.display_name": "El Tribunal Ético",
"ova.ethicscases.display_name": "Casos del Guardián"
```

Repite en `en.json` (nombres EN del registro) y `pt.json` (nombres PT del registro).

- [ ] **Step 2: Corregir claves divergentes**

```json
"ova.risksim.title": "La Brújula de Riesgos",
"ova.biaslab.welcome_title": "El Espejo de la Verdad",
"ova.podcastguide.welcome_title": "La Fórmula Sonora"
```

- [ ] **Step 3: Validar i18n**

Run: `npm run i18n:validate`
Expected: sin errores de claves faltantes.

- [ ] **Step 4: Test de la clave nueva**

Run: `npx vitest run src/components/IALab/challenges/__tests__/i18nKeys.test.js`
Expected: PASS.

- [ ] **Step 5: Commit (opcional)**

```bash
git add edutechlife-frontend/src/i18n/
git commit -m "feat(i18n): add canonical OVA display names (es/en/pt)"
```

---

### Task 6: Conciliar la base de conocimiento (`courseKnowledge.js`)

**Files:**
- Modify: `src/components/IALab/constants/courseKnowledge.js`, `courseKnowledgePt.js`

- [ ] **Step 1: Detectar referencias OVA desalineadas**

Run: `grep -nE "OVA:|Laboratorio:|Simulador:|Infografía" src/components/IALab/constants/courseKnowledge.js`
Expected: aparecen nombres antiguos ("Laboratorio: Ética en la IA", "Pon a Prueba tu Lupa Multimodal", "Infografía Interactiva: Prompt Engineering", etc.).

- [ ] **Step 2: Reemplazar por el nombre canónico**

Aplica este mapa (solo en los campos `type: "ova"`/`"ova_interactive"`):

| Antiguo (courseKnowledge) | Nuevo canónico |
|---|---|
| Laboratorio: Ética en la IA | El Juramento |
| Infografía Interactiva: Prompt Engineering | El Cincel |
| OVA: Cómo comunicarte con la IA (prompts) | El Cincel |
| Simulador: Crea tu Primer Flujo | La Línea de Montaje |
| Dominando el Ecosistema ChatGPT | El Plano Maestro |
| Laboratorio: Construye un GPT | La Fábrica de Asistentes |
| Pon a Prueba tu Lupa Multimodal | La Lupa Multimodal |
| Gemini: Misión Interactiva — Explora y Domina | La Lupa Multimodal |
| Laboratorio: Resuelve el Caso — 6 Desafíos Reales | El Caso Abierto |
| Laboratorio: Crea tu Notebook | El Grimorio |
| Simulador: Análisis de Documentos | El Crisol |
| Laboratorio: Crea tu Podcast IA | El Estudio Alquímico |
| Laboratorio: Detecta el Sesgo | El Espejo de la Verdad |
| Simulador: Evaluación de Riesgos | La Brújula de Riesgos |
| Laboratorio: Dilemas Éticos | El Tribunal Ético |

- [ ] **Step 3: Verificar consistencia**

Run: `npx vitest run src/components/IALab/__tests__/contentIntegrity.test.js`
Expected: PASS.

- [ ] **Step 4: Commit (opcional)**

```bash
git add edutechlife-frontend/src/components/IALab/constants/courseKnowledge.js edutechlife-frontend/src/components/IALab/constants/courseKnowledgePt.js
git commit -m "docs(ialab): align course knowledge base with canonical OVA names"
```

---

### Task 7: Verificación final

**Files:** ninguno (verificación).

- [ ] **Step 1: Suite IALab**

Run: `npx vitest run src/components/IALab/__tests__/ src/components/IALab/challenges/__tests__/ src/components/IALab/workspace/__tests__/`
Expected: PASS.

- [ ] **Step 2: Lint del módulo**

Run: `npm run lint`
Expected: sin errores nuevos (warnings por debajo del límite 1750).

- [ ] **Step 3: i18n y build**

Run: `npm run i18n:validate && npm run build:fast`
Expected: i18n OK y build sin errores.

- [ ] **Step 4: Reporte de trazabilidad**

Genera un resumen y verifica el checklist de aceptación del spec:
Run: `node -e "import('./src/components/IALab/constants/ovaNaming.js').then(m=>console.log('OVA:',m.OVA_REGISTRY.length,'activos:',m.getActiveOvas().length,'metodologías:',m.METHODOLOGY_PRINCIPLES.length))"`
Expected: `OVA: 20 activos: 19 metodologías: 7`

---

## Self-Review

**1. Cobertura del spec**
- Sistema de 4 capas (código/nombre/descriptor/principio) → Task 1.
- Nombres de 20 OVA + 5 módulos + 7 metodologías → Tasks 1, 3.
- Reubicación de ética a M5 → Task 2 y Task 3 (`intro-ova-1` module 5).
- Huérfano `OVAGeminiDeepResearch` integrado → Task 4.
- Mapeo muerto `gemini-ova-1` eliminado → Task 4.
- Catálogo al día → Task 3.
- i18n alineado → Task 5.
- Base de conocimiento conciliada → Task 6.
- Integridad y build → Task 7.
- Regla "IDs estables" → se respetan los `id` existentes; solo se añade `gemini-deep-research-ova-1`.
- Regla "no renombrar componentes" → ningún archivo de componente se renombra.

**2. Placeholder scan:** sin TBD/TODO; todas las tareas incluyen código o datos exactos.

**3. Type consistency:** `OVA_REGISTRY[].name` es `{es,en,pt}` y se usa igual en Task 2 (`ova.name[locale]`) y Task 3 (`ova.name.es`). `resourceId` y `component` coinciden entre registry (Task 1), catálogo (Task 3) y render (Task 4). `getActiveOvas()` definido en Task 1 y usado en Tasks 2–4.

**Estado final:** **19 OVA activos, 0 planificados.** Corrección posterior a la ejecución: `intro-ova-1` (`OVAEtica`) contiene orígenes de la IA + ingeniería de prompts, así que se **reubicó a M1** como "La Materia Prima" (antes "El Juramento" en M5, eliminado); "El Banco de Forja" pasó a llamarse **"El Martillo"**. El huérfano `ILAB-M3-OVA3` "El Archivo Forense" **se conectó** como recurso real del Módulo 3.

---

## Estado de ejecución (2026-09-15)

Todas las tareas ejecutadas con subagentes sobre el árbol de trabajo actual, **sin commits**.

| Task | Estado | Evidencia |
|---|---|---|
| 1 Registro canónico | ✅ | `ovaNaming.test.js` 6/6 |
| 2 Propagar títulos | ✅ | 57 títulos (19×3); `ovaTitles.test.js` 57/57 |
| 3 Catálogo + módulos | ✅ | `ovaCatalog.test.js` 3/3 |
| 4 Render + íconos | ✅ | `ovaRegistry.test.js` 2/2; 4 íconos mapeados |
| 5 i18n | ✅ | 9 valores; claves correctas |
| 6 Base de conocimiento | ✅ | 14 títulos ES + 14 PT |
| 7 Verificación | ✅ | tests 197/197 (`__tests__`), consistencia 0 desajustes, lint 0 errores, build OK |

**Desviaciones respecto al plan:**
- El huérfano `OVAGeminiDeepResearch` se **conectó** como recurso `gemini-deep-research-ova-1` del Módulo 3 ("El Archivo Forense"): recurso en `resourcesEs/En/Pt`, conteo del tema 3→4, catálogo, registro de render y soporte de `onComplete` en el componente.
- Se descartó añadir claves i18n `display_name` (YAGNI: los nombres canónicos ya viven en `ovaNaming.js` y en los recursos).
- Se añadió el mapeo de 4 íconos en `iconMapping.jsx` (hallazgo de la revisión de Task 3).

**Radar preexistente (no causado por este cambio):** `npm run i18n:validate` reporta claves faltantes en `parent_dashboard.*` e `ialab.*.exam`.
