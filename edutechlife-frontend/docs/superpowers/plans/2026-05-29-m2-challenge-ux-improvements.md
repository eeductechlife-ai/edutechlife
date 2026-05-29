# M2 ChatGPT Challenge — UX Improvement Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade Module 2 challenge UX from 6.1 → 8.5+ by connecting Step 1 choice to Steps 2-3, adding formative feedback, making Step 3 concrete, and fixing accessibility gaps.

**Architecture:** Pass `selectedCase` through step data so Steps 2-3 adapt dynamically. Add 4 new components (CaseContextBanner, JsonPreviewPanel, StepFeedback, ExampleToggle) and modify 3 existing step components. No hook changes needed — `selectedCase` is already embedded in `ej1` response JSON.

**Tech Stack:** React, Tailwind CSS, Framer Motion, i18n (ES/EN)

---

### Task 1: CaseContextBanner Component

**Files:**
- Create: `src/components/IALab/challenges/module2/CaseContextBanner.jsx`

- [ ] **Create CaseContextBanner component**

```jsx
import React from 'react';
import { Icon } from '../../../../utils/iconMapping.jsx';

const CASE_META = {
  marketing: { icon: 'fa-chart-line', label: { es: 'Agencia de Marketing', en: 'Marketing Agency' }, color: 'from-violet-500 to-purple-600' },
  support: { icon: 'fa-headset', label: { es: 'Soporte al Cliente', en: 'Customer Support' }, color: 'from-emerald-500 to-teal-600' },
  dev: { icon: 'fa-code', label: { es: 'Desarrollo de Software', en: 'Software Development' }, color: 'from-sky-500 to-cyan-600' },
};

const CaseContextBanner = ({ selectedCase, stepNumber, locale = 'es' }) => {
  if (!selectedCase) return null;
  const meta = CASE_META[selectedCase];
  if (!meta) return null;
  const label = meta.label[locale] || meta.label.es;
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-petroleum/5 to-corporate/5 rounded-xl border border-corporate/20 mb-6">
      <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${meta.color} flex items-center justify-center flex-shrink-0`}>
        <Icon name={meta.icon} className="text-white text-sm" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-medium text-corporate uppercase tracking-wider">
          {locale === 'en' ? 'Building for' : 'Construyendo para'}
        </p>
        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{label}</p>
      </div>
      <div className="text-xs text-slate-400">
        {locale === 'en' ? `Step ${stepNumber}` : `Paso ${stepNumber}`}
      </div>
    </div>
  );
};

export default CaseContextBanner;
```

- [ ] **Create i18n keys for banner**

Add to `en.json`:
```json
"ialab.challenge.m2.banner_building_for": "Building for"
```

Add to `es.json`:
```json
"ialab.challenge.m2.banner_building_for": "Construyendo para"
```

---

### Task 2: StepFeedback Component

**Files:**
- Create: `src/components/IALab/challenges/shared/StepFeedback.jsx`

- [ ] **Create StepFeedback component**

```jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../../../utils/iconMapping.jsx';

const StepFeedback = ({ completed, total, hints = [] }) => {
  if (completed === undefined) return null;
  const allDone = completed >= total;
  const progress = total > 0 ? (completed / total) * 100 : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 p-4 rounded-xl border"
      >
        {allDone ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <Icon name="fa-check-circle" className="text-emerald-500 text-xl" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-700">¡Completado!</p>
              <p className="text-xs text-emerald-600">Puedes continuar al siguiente paso</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-corporate rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-slate-500 font-medium">{completed}/{total}</span>
            </div>
            {hints.length > 0 && completed < total && (
              <div className="text-xs text-slate-500">
                <p className="font-medium text-slate-600 mb-1">Tips:</p>
                <ul className="space-y-1">
                  {hints.slice(0, 3).map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Icon name="fa-lightbulb" className="text-amber-400 text-xs mt-0.5 flex-shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default StepFeedback;
```

---

### Task 3: JsonPreviewPanel Component

**Files:**
- Create: `src/components/IALab/challenges/shared/JsonPreviewPanel.jsx`

- [ ] **Create JsonPreviewPanel component**

```jsx
import React, { useState } from 'react';
import { Icon } from '../../../../utils/iconMapping.jsx';

const JsonPreviewPanel = ({ functionName, description, parameters }) => {
  const [isOpen, setIsOpen] = useState(false);

  const schema = {
    name: functionName || 'yourFunction',
    description: description || 'Describe what this function does',
    parameters: {
      type: 'object',
      properties: Object.fromEntries(
        parameters.map(p => [
          p.name || `param${parameters.indexOf(p) + 1}`,
          {
            type: p.type || 'string',
            description: `The ${p.name || 'parameter'} value`,
          }
        ])
      ),
      required: parameters.filter(p => p.required).map(p => p.name || ''),
    },
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
        aria-expanded={isOpen}
        aria-controls="json-preview-content"
      >
        <div className="flex items-center gap-2">
          <Icon name="fa-code" className="text-corporate" />
          <span className="text-sm font-medium text-slate-700">JSON Preview</span>
        </div>
        <Icon name={isOpen ? 'fa-chevron-up' : 'fa-chevron-down'} className="text-slate-400" />
      </button>
      {isOpen && (
        <div className="p-4 bg-navy-900 overflow-x-auto" id="json-preview-content">
          <pre className="text-xs text-green-400 font-mono leading-relaxed whitespace-pre-wrap">
            {JSON.stringify(schema, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default JsonPreviewPanel;
```

---

### Task 4: ExampleToggle Component

**Files:**
- Create: `src/components/IALab/challenges/shared/ExampleToggle.jsx`

- [ ] **Create ExampleToggle component**

```jsx
import React, { useState } from 'react';
import { Icon } from '../../../../utils/iconMapping.jsx';

const ExampleToggle = ({ example }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="mt-2">
      <button
        onClick={() => setShow(!show)}
        className="flex items-center gap-2 text-xs text-corporate hover:text-petroleum transition-colors"
        aria-expanded={show}
      >
        <Icon name={show ? 'fa-eye-slash' : 'fa-eye'} className="text-xs" />
        {show ? 'Ocultar ejemplo' : 'Ver ejemplo'}
      </button>
      {show && (
        <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 leading-relaxed">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="fa-lightbulb" className="text-amber-500" />
            <span className="font-semibold">Ejemplo:</span>
          </div>
          <p>{example}</p>
        </div>
      )}
    </div>
  );
};

export default ExampleToggle;
```

---

### Task 5: Modify ChatGPTStep1 — Add validation indicators and pass selectedCase

**Files:**
- Modify: `src/components/IALab/challenges/module2/ChatGPTStep1.jsx:50-53`

- [ ] **Add selectedCase validation feedback in Step 1**

Replace the `useState` section with enhanced state + validation:

```jsx
const [selectedCase, setSelectedCase] = useState('');
const [bestCandidate, setBestCandidate] = useState('');
const [justification, setJustification] = useState('');
const [validationErrors, setValidationErrors] = useState({});
```

- [ ] **Add validation on blur for justification**

```jsx
const validateJustification = (value) => {
  const errors = {};
  if (!value || value.length < 20) {
    errors.justification = 'Escribe al menos 20 caracteres para una justificación sólida';
  }
  setValidationErrors(errors);
  return Object.keys(errors).length === 0;
};
```

- [ ] **Add validation indicator below textarea**

Add after the character count line (line 202):
```jsx
{validationErrors.justification && (
  <div className="flex items-center gap-2 mt-2 text-xs text-amber-600">
    <Icon name="fa-exclamation-triangle" className="text-xs" />
    <span>{validationErrors.justification}</span>
  </div>
)}
```

---

### Task 6: Modify ChatGPTStep2 — Dynamic content based on selectedCase

**Files:**
- Modify: `src/components/IALab/challenges/module2/ChatGPTStep2.jsx:5-16`

- [ ] **Make KNOWLEDGE_FILES and CAPABILITIES dynamic by selectedCase**

Replace static arrays with a function that accepts `selectedCase`:

```jsx
const getKnowledgeByCase = (selectedCase) => {
  const base = [
    { id: 'manual', icon: 'fa-file-pdf', labelKey: 'ialab.challenge.m2.step2_knowledge_manual', descKey: 'ialab.challenge.m2.step2_knowledge_manual_desc' },
    { id: 'faq', icon: 'fa-file-alt', labelKey: 'ialab.challenge.m2.step2_knowledge_faq', descKey: 'ialab.challenge.m2.step2_knowledge_faq_desc' },
  ];
  if (selectedCase === 'dev') {
    return [...base, { id: 'schema', icon: 'fa-layer-group', labelKey: 'ialab.challenge.m2.step2_knowledge_schema', descKey: 'ialab.challenge.m2.step2_knowledge_schema_desc' }];
  }
  if (selectedCase === 'marketing') {
    return [...base, { id: 'brand', icon: 'fa-palette', labelKey: 'ialab.challenge.m2.step2_knowledge_brand', descKey: 'ialab.challenge.m2.step2_knowledge_brand_desc' }];
  }
  if (selectedCase === 'support') {
    return [...base, { id: 'crm', icon: 'fa-address-book', labelKey: 'ialab.challenge.m2.step2_knowledge_crm', descKey: 'ialab.challenge.m2.step2_knowledge_crm_desc' }];
  }
  return base;
};

const getCapabilitiesByCase = (selectedCase) => {
  const base = [
    { id: 'web', icon: 'fa-globe', labelKey: 'ialab.challenge.m2.step2_cap_web' },
    { id: 'dalle', icon: 'fa-image', labelKey: 'ialab.challenge.m2.step2_cap_dalle' },
    { id: 'code', icon: 'fa-code', labelKey: 'ialab.challenge.m2.step2_cap_code' },
    { id: 'data', icon: 'fa-calculator', labelKey: 'ialab.challenge.m2.step2_cap_data' },
  ];
  if (selectedCase === 'marketing') return base.filter(c => c.id !== 'code');
  if (selectedCase === 'dev') return base.filter(c => c.id !== 'dalle');
  return base;
};
```

- [ ] **Get selectedCase from response parsing**

```jsx
useEffect(() => {
  if (response) {
    try {
      const parsed = JSON.parse(response);
      if (parsed.instructions !== undefined) setInstructions(parsed.instructions);
      if (Array.isArray(parsed.knowledge)) setKnowledge(parsed.knowledge);
      if (Array.isArray(parsed.capabilities)) setCapabilities(parsed.capabilities);
    } catch { /* ignore */ }
  }
}, [response]);
```

Also need to receive selectedCase as prop — add `selectedCase` to destructuring:
```jsx
const ChatGPTStep2 = ({ exercise, response, onResponseChange, selectedCase }) => {
```

- [ ] **Add CaseContextBanner to Step 2 render**

After the scenario section (line 91):
```jsx
<CaseContextBanner selectedCase={selectedCase} stepNumber={2} locale={locale} />
```

- [ ] **Add dynamic tips based on case**

Replace static tips with:
```jsx
const getTipsByCase = (selectedCase) => {
  const marketingTips = [
    'Enfócate en métricas de engagement, alcance y conversiones',
    'Incluye formato de reporte semanal con comparativas',
    'Define tono profesional pero accesible para stakeholders',
  ];
  const supportTips = [
    'Prioriza la empatía y claridad en las respuestas',
    'Incluye reglas de escalamiento a supervisores',
    'Define formatos de ticket y campos obligatorios',
  ];
  const devTips = [
    'Especifica el lenguaje y framework del proyecto',
    'Incluye reglas de estilo de código y convenciones',
    'Define el formato de salida para PRs y changelogs',
  ];
  if (selectedCase === 'marketing') return marketingTips;
  if (selectedCase === 'support') return supportTips;
  if (selectedCase === 'dev') return devTips;
  return [
    'Sé específico: un rol bien definido produce mejores resultados',
    'Incluye reglas de formato de salida para consistencia',
    'Activa solo las capacidades que la tarea realmente necesita',
  ];
};
```

Then use:
```jsx
<ul className="space-y-2 text-sm text-slate-600">
  {getTipsByCase(selectedCase).map((tip, i) => (
    <li key={i} className="flex items-start gap-2">
      <Icon name="fa-check-circle" className="text-emerald-500 mt-0.5 flex-shrink-0" />
      <span>{tip}</span>
    </li>
  ))}
</ul>
```

- [ ] **Add new i18n keys**

Add to `en.json`:
```json
"ialab.challenge.m2.step2_knowledge_brand": "Brand Guidelines",
"ialab.challenge.m2.step2_knowledge_brand_desc": "Brand voice, tone and visual identity",
"ialab.challenge.m2.step2_knowledge_crm": "CRM Schema",
"ialab.challenge.m2.step2_knowledge_crm_desc": "Customer fields, ticket structure and statuses"
```

Add to `es.json`:
```json
"ialab.challenge.m2.step2_knowledge_brand": "Guía de Marca",
"ialab.challenge.m2.step2_knowledge_brand_desc": "Voz, tono e identidad visual de la marca",
"ialab.challenge.m2.step2_knowledge_crm": "Esquema CRM",
"ialab.challenge.m2.step2_knowledge_crm_desc": "Campos de cliente, estructura de tickets y estados"
```

---

### Task 7: Modify ChatGPTStep3 — Live JSON preview + validation + examples

**Files:**
- Modify: `src/components/IALab/challenges/module2/ChatGPTStep3.jsx:20-24`

- [ ] **Add selectedCase prop and locale**

```jsx
const ChatGPTStep3 = ({ exercise, response, onResponseChange, selectedCase }) => {
```

Get locale from useTranslation:
```jsx
const { t, locale } = useTranslation();
```

- [ ] **Add CaseContextBanner**

After the spec context section (line 108):
```jsx
<CaseContextBanner selectedCase={selectedCase} stepNumber={3} locale={locale} />
```

- [ ] **Add JSON preview panel after parameters section**

After the parameter editor (line 222):
```jsx
<JsonPreviewPanel
  functionName={functionName}
  description={description}
  parameters={parameters}
/>
```

- [ ] **Add ExampleToggle for function name, description, and parameters**

After the function name input (line 123):
```jsx
<ExampleToggle example={
  selectedCase === 'marketing'
    ? 'getSocialMediaReport(clientId, startDate, endDate)'
    : selectedCase === 'support'
    ? 'createSupportTicket(customerId, priority, description)'
    : 'generateChangelog(repoName, fromTag, toTag)'
} />
```

After the description textarea (line 138):
```jsx
<ExampleToggle example={
  selectedCase === 'marketing'
    ? 'Obtiene métricas de redes sociales para un cliente en un rango de fechas y genera un PDF con recomendaciones.'
    : selectedCase === 'support'
    ? 'Crea un ticket de soporte en el CRM con los datos del cliente, prioridad y descripción del problema.'
    : 'Genera un changelog automatizado a partir de los commits entre dos tags de Git.'
} />
```

- [ ] **Add validation feedback**

Add state:
```jsx
const [validationErrors, setValidationErrors] = useState({});
```

Show validation if function name is empty and user tries to interact:
```jsx
{validationErrors.name && (
  <div className="flex items-center gap-2 mt-2 text-xs text-amber-600">
    <Icon name="fa-exclamation-triangle" className="text-xs" />
    <span>{validationErrors.name}</span>
  </div>
)}
```

---

### Task 8: Wire selectedCase through the modal

**Files:**
- Modify: `src/components/IALab/IALabEvaluationModal.jsx:476-491`

- [ ] **Parse selectedCase from ej1 response and pass to steps 2-3**

In `renderContent()`, before rendering StepComponent:
```jsx
// Parse selectedCase from ej1 for context continuity
const ej1Parsed = (() => {
  try { return JSON.parse(state.responses.ej1 || '{}'); }
  catch { return {}; }
})();
const selectedCase = ej1Parsed.selectedCase || '';
```

Then pass it to StepComponent:
```jsx
<StepComponent
  exercise={currentExercise}
  response={state.responses[responseKey] || ''}
  onResponseChange={(response) => setResponse(responseKey, response)}
  t={t}
  selectedCase={selectedCase}
/>
```

- [ ] **Import new components**

Add to imports:
```jsx
import CaseContextBanner from './challenges/module2/CaseContextBanner';
```

---

### Task 9: Accessibility fixes

**Files:**
- Modify: `src/components/IALab/IALabEvaluationModal.jsx:564-580`

- [ ] **Add reduced-motion support**

```jsx
import { motion, AnimatePresence } from 'framer-motion';

// Replace motion.div with conditional reduced-motion
const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return prefersReducedMotion;
};
```

In the component:
```jsx
const prefersReducedMotion = usePrefersReducedMotion();
```

Replace:
```jsx
initial={{ opacity: 0, x: state.step > prevStepRef.current ? 50 : -50 }}
animate={{ opacity: 1, x: 0 }}
exit={{ opacity: 0, x: state.step > prevStepRef.current ? -50 : 50 }}
transition={{ duration: 0.3 }}
```

With:
```jsx
initial={prefersReducedMotion ? false : { opacity: 0, x: state.step > prevStepRef.current ? 50 : -50 }}
animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
exit={prefersReducedMotion ? false : { opacity: 0, x: state.step > prevStepRef.current ? -50 : 50 }}
transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
```

- [ ] **Add aria-labels to toggle switches in Step 2**

In CAPABILITIES toggle button:
```jsx
aria-label={`${isEnabled ? 'Disable' : 'Enable'} ${t(cap.labelKey)}`}
```

- [ ] **Add aria-live region for feedback messages**

```jsx
<div aria-live="polite" className="sr-only">
  {state.step === totalSteps ? 'Último paso' : `Paso ${state.step} de ${totalSteps}`}
</div>
```

---

### Task 10: Mobile improvements

**Files:**
- Modify: `src/components/IALab/challenges/module2/ChatGPTStep2.jsx:105`
- Modify: `src/components/IALab/challenges/module2/ChatGPTStep3.jsx:137`
- Modify: `src/components/IALab/challenges/module2/ChatGPTStep1.jsx:199`

- [ ] **Add auto-grow to textareas**

Replace all `h-48`, `h-32`, `h-28` with auto-grow behavior via a shared approach:

```jsx
const AutoGrowTextarea = ({ value, onChange, placeholder, className = '', ...props }) => {
  const textareaRef = useRef(null);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 320)}px`;
    }
  }, [value]);
  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => {
        if (e.target.value.length <= 2000) onChange(e.target.value);
      }}
      placeholder={placeholder}
      className={`w-full bg-white border-2 border-slate-200 rounded-xl p-5 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-corporate focus:ring-2 focus:ring-corporate/20 resize-none text-sm leading-relaxed min-h-[120px] max-h-[320px] ${className}`}
      {...props}
    />
  );
};
```

Replace all `<textarea>` with `<AutoGrowTextarea>` in all 3 steps.

---

## Verification

After all tasks:

```bash
npm run build
```

Check for:
- No compilation errors
- All i18n keys resolved
- `selectedCase` flows from Step 1 → Step 2 → Step 3
- CaseContextBanner shows correct case
- JSON preview renders valid JSON
- Accessible toggle switches
- Textareas auto-grow on mobile
