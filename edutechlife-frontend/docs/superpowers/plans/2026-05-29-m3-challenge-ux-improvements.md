# M3 Gemini Challenge — UX Improvement Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade Module 3 challenge UX from 3.8 → 7.5+ by adding thematic continuity, formative feedback, proper shared components, verdict visualization, and instructional guidance across all 4 steps.

**Architecture:** Parse `topic` and `mainQuestion` from Step 1 response JSON and pass to Steps 2-4 via a new `ResearchContextBanner`. Create `VerdictSummaryBar` for Step 3 live stats. Use existing shared components (AutoGrowTextarea, StepFeedback, ExampleToggle) in all steps.

**Tech Stack:** React, Tailwind CSS, Framer Motion, i18n (ES/EN)

---

### Task 1: ResearchContextBanner Component

**Files:**
- Create: `src/components/IALab/challenges/shared/ResearchContextBanner.jsx`

- [ ] **Create ResearchContextBanner component**

```jsx
import React from 'react';
import { Icon } from '../../../../utils/iconMapping.jsx';

const ResearchContextBanner = ({ topic, stepNumber, locale = 'es' }) => {
  if (!topic) return null;
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-petroleum/5 to-corporate/5 rounded-xl border border-corporate/20 mb-6">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0">
        <Icon name="fa-flask" className="text-white text-sm" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-corporate uppercase tracking-wider">
          {locale === 'en' ? 'Researching' : 'Investigando'}
        </p>
        <p className="text-sm font-bold text-slate-800 truncate">{topic}</p>
      </div>
      <div className="text-xs text-slate-400 flex-shrink-0">
        {locale === 'en' ? `Step ${stepNumber}` : `Paso ${stepNumber}`}
      </div>
    </div>
  );
};

export default ResearchContextBanner;
```

---

### Task 2: VerdictSummaryBar Component

**Files:**
- Create: `src/components/IALab/challenges/shared/VerdictSummaryBar.jsx`

- [ ] **Create VerdictSummaryBar component**

```jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../../../../utils/iconMapping.jsx';

const VerdictSummaryBar = ({ claims, t }) => {
  const total = claims.length;
  if (!total) return null;
  const verified = claims.filter(c => c.verdict === 'verified').length;
  const questionable = claims.filter(c => c.verdict === 'questionable').length;
  const unverifiable = claims.filter(c => c.verdict === 'unverifiable').length;
  const unclassified = total - verified - questionable - unverifiable;
  const classified = total - unclassified;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-slate-700">
          {t('ialab.challenge.m3.verdict_summary_title')}
        </h4>
        <span className="text-xs text-slate-400 font-medium">
          {classified}/{total} {t('ialab.challenge.m3.verdict_progress_label')}
        </span>
      </div>

      <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex">
        {verified > 0 && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(verified / total) * 100}%` }}
            className="h-full bg-emerald-500 transition-all"
            title={`Verified: ${verified}`}
          />
        )}
        {questionable > 0 && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(questionable / total) * 100}%` }}
            className="h-full bg-amber-500 transition-all"
            title={`Questionable: ${questionable}`}
          />
        )}
        {unverifiable > 0 && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(unverifiable / total) * 100}%` }}
            className="h-full bg-slate-400 transition-all"
            title={`Unverifiable: ${unverifiable}`}
          />
        )}
      </div>

      <div className="flex flex-wrap gap-3 mt-3">
        <div className="flex items-center gap-1.5 text-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-slate-600">
            {t('ialab.challenge.m3.step3_verified')} ({verified})
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-slate-600">
            {t('ialab.challenge.m3.step3_questionable')} ({questionable})
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
          <span className="text-slate-600">
            {t('ialab.challenge.m3.step3_unverifiable')} ({unverifiable})
          </span>
        </div>
      </div>

      {classified === total && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-emerald-600"
        >
          <Icon name="fa-check-circle" />
          <span className="font-medium">{t('ialab.challenge.m3.verdict_all_classified')}</span>
        </motion.div>
      )}
    </div>
  );
};

export default VerdictSummaryBar;
```

---

### Task 3: Add i18n keys

**Files:**
- Modify: `src/i18n/es.json`
- Modify: `src/i18n/en.json`

- [ ] **Add i18n keys**

Add to `en.json`:
```json
"ialab.challenge.m3.topic_context_label": "Researching",
"ialab.challenge.m3.verdict_summary_title": "Verdict Overview",
"ialab.challenge.m3.verdict_progress_label": "classified",
"ialab.challenge.m3.verdict_all_classified": "All claims classified!",
"ialab.challenge.m3.step1_howto_title": "How to formulate a research question",
"ialab.challenge.m3.step1_howto_desc": "A good research question is specific, debatable, and researchable. It should guide your investigation and help you find relevant sources. Avoid yes/no questions — use open-ended prompts starting with 'How', 'Why', 'What', or 'To what extent'.",
"ialab.challenge.m3.step1_example_q": "Example: 'How has the adoption of AI in healthcare impacted diagnostic accuracy in rural areas over the past 5 years?' is strong because it's specific (AI in healthcare), debatable (impact on diagnostic accuracy), and researchable (rural areas, 5-year timeframe).",
"ialab.challenge.m3.step1_example_sub": "Example sub-questions: 'What AI diagnostic tools are most commonly used in rural healthcare?', 'What measurable improvements in accuracy have been reported?', 'What barriers limit AI adoption in rural settings?'",
"ialab.challenge.m3.step2_howto_title": "How to analyze sources",
"ialab.challenge.m3.step2_howto_desc": "For each source, determine if it's relevant to your research question. If relevant, extract one key data point — a fact, statistic, or quote that directly supports or challenges your investigation. Mark sources as 'Irrelevant' if they don't contribute to your research.",
"ialab.challenge.m3.step2_example_data": "Example key data: 'According to the study, AI-assisted diagnostics reduced misdiagnosis rates by 37% in rural clinics (Smith et al., 2025).' — specific, sourced, and directly relevant.",
"ialab.challenge.m3.step2_progress_label": "sources evaluated",
"ialab.challenge.m3.step3_howto_title": "How to fact-check claims",
"ialab.challenge.m3.step3_howto_desc": "Read each claim carefully. Use your sources and knowledge to decide: Is this claim supported by evidence? Classify it as 'Verified' (supported), 'Questionable' (some evidence but conflicting), or 'Unverifiable' (cannot be confirmed with available information). Always explain your reasoning.",
"ialab.challenge.m3.step3_example_reasoning": "Example reasoning: 'This claim is Questionable — while the WHO report mentions potential benefits, it also notes that long-term studies are still ongoing. The evidence is preliminary.'",
"ialab.challenge.m3.step3_progress_label": "claims classified",
"ialab.challenge.m3.step4_howto_title": "How to write a professional report",
"ialab.challenge.m3.step4_howto_desc": "Write each section clearly and concisely. Start with an introduction that states your research question, describe your methodology, present your findings with source citations, verify key claims, and end with evidence-based conclusions.",
"ialab.challenge.m3.step4_example_intro": "Example Introduction: 'This report investigates the impact of AI on diagnostic accuracy in rural healthcare. Through analysis of peer-reviewed studies and field reports, we examine measurable outcomes, implementation barriers, and future potential.'",
"ialab.challenge.m3.step4_example_methodology": "Example Methodology: 'We analyzed 12 sources including medical journals, WHO reports, and case studies from rural clinics in 3 countries. Sources were selected based on relevance, recency (2020-2025), and credibility of the publishing institution.'",
"ialab.challenge.m3.step4_example_findings": "Example Findings: 'AI-assisted diagnostics showed a 37% improvement in early detection rates (Source A). However, implementation costs remain a barrier for 68% of rural clinics surveyed (Source B).'",
"ialab.challenge.m3.step4_example_verification": "Example Source Verification: 'Claim 1 (37% improvement) was cross-referenced with Source A and Source C — both confirmed, classification: Verified. Claim 2 (68% cost barrier) only appeared in one survey — classification: Questionable.'",
"ialab.challenge.m3.step4_example_conclusions": "Example Conclusions: 'AI shows significant promise for rural diagnostic accuracy, but adoption requires addressing cost barriers and infrastructure gaps. Further research is needed on long-term outcomes.'",
"ialab.challenge.m3.step4_char_label": "characters"
```

Add to `es.json`:
```json
"ialab.challenge.m3.topic_context_label": "Investigando",
"ialab.challenge.m3.verdict_summary_title": "Resumen de Verdictos",
"ialab.challenge.m3.verdict_progress_label": "clasificados",
"ialab.challenge.m3.verdict_all_classified": "¡Todas las afirmaciones clasificadas!",
"ialab.challenge.m3.step1_howto_title": "Cómo formular una pregunta de investigación",
"ialab.challenge.m3.step1_howto_desc": "Una buena pregunta de investigación es específica, debatible e investigable. Debe guiar tu investigación y ayudarte a encontrar fuentes relevantes. Evita preguntas de sí/no — usa preguntas abiertas que comiencen con 'Cómo', 'Por qué', 'Qué' o 'En qué medida'.",
"ialab.challenge.m3.step1_example_q": "Ejemplo: '¿Cómo ha impactado la adopción de IA en la salud en la precisión diagnóstica en áreas rurales durante los últimos 5 años?' es sólida porque es específica (IA en salud), debatible (impacto en precisión diagnóstica) e investigable (áreas rurales, 5 años).",
"ialab.challenge.m3.step1_example_sub": "Ejemplo de sub-preguntas: '¿Qué herramientas de diagnóstico por IA se usan más en salud rural?', '¿Qué mejoras medibles en precisión se han reportado?', '¿Qué barreras limitan la adopción de IA en entornos rurales?'",
"ialab.challenge.m3.step2_howto_title": "Cómo analizar fuentes",
"ialab.challenge.m3.step2_howto_desc": "Para cada fuente, determina si es relevante para tu pregunta de investigación. Si es relevante, extrae un dato clave — un hecho, estadística o cita que apoye o desafíe tu investigación. Marca como 'Irrelevante' si no contribuye.",
"ialab.challenge.m3.step2_example_data": "Ejemplo de dato clave: 'Según el estudio, los diagnósticos asistidos por IA redujeron las tasas de diagnóstico erróneo en un 37% en clínicas rurales (Smith et al., 2025).' — específico, con fuente y directamente relevante.",
"ialab.challenge.m3.step2_progress_label": "fuentes evaluadas",
"ialab.challenge.m3.step3_howto_title": "Cómo verificar afirmaciones",
"ialab.challenge.m3.step3_howto_desc": "Lee cada afirmación cuidadosamente. Usa tus fuentes y conocimiento para decidir: ¿Esta afirmación está respaldada por evidencia? Clasifícala como 'Verificada' (respaldada), 'Cuestionable' (evidencia parcial) o 'No verificable' (no se puede confirmar). Siempre explica tu razonamiento.",
"ialab.challenge.m3.step3_example_reasoning": "Ejemplo de razonamiento: 'Esta afirmación es Cuestionable — aunque el informe de la OMS menciona beneficios potenciales, también señala que los estudios a largo plazo aún están en curso. La evidencia es preliminar.'",
"ialab.challenge.m3.step3_progress_label": "afirmaciones clasificadas",
"ialab.challenge.m3.step4_howto_title": "Cómo escribir un informe profesional",
"ialab.challenge.m3.step4_howto_desc": "Escribe cada sección clara y concisamente. Comienza con una introducción que exponga tu pregunta, describe tu metodología, presenta hallazgos con citas, verifica afirmaciones clave y termina con conclusiones basadas en evidencia.",
"ialab.challenge.m3.step4_example_intro": "Ejemplo de Introducción: 'Este informe investiga el impacto de la IA en la precisión diagnóstica en salud rural. Mediante el análisis de estudios revisados por pares e informes de campo, examinamos resultados medibles, barreras y potencial futuro.'",
"ialab.challenge.m3.step4_example_methodology": "Ejemplo de Metodología: 'Analizamos 12 fuentes incluyendo revistas médicas, informes de la OMS y casos de estudio de clínicas rurales en 3 países. Las fuentes se seleccionaron por relevancia, actualidad (2020-2025) y credibilidad.'",
"ialab.challenge.m3.step4_example_findings": "Ejemplo de Hallazgos: 'Los diagnósticos asistidos por IA mostraron una mejora del 37% en detección temprana (Fuente A). Sin embargo, los costos de implementación siguen siendo una barrera para el 68% de las clínicas encuestadas (Fuente B).'",
"ialab.challenge.m3.step4_example_verification": "Ejemplo de Verificación: 'Afirmación 1 (mejora del 37%) fue cotejada con Fuente A y Fuente C — ambas confirman, clasificación: Verificada. Afirmación 2 (barrera del 68%) solo apareció en una encuesta — clasificación: Cuestionable.'",
"ialab.challenge.m3.step4_example_conclusions": "Ejemplo de Conclusiones: 'La IA muestra un potencial significativo para la precisión diagnóstica rural, pero la adopción requiere abordar barreras de costo y brechas de infraestructura. Se necesita más investigación sobre resultados a largo plazo.'",
"ialab.challenge.m3.step4_char_label": "caracteres"
```

---

### Task 4: Refactor GeminiStep1

**Files:**
- Modify: `src/components/IALab/challenges/module3/GeminiStep1.jsx`

- [ ] **Add imports and new local state**

Replace imports and add state for validation/character count:

```jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../../../i18n/I18nProvider';
import { Icon } from '../../../../utils/iconMapping.jsx';
import AutoGrowTextarea from '../../challenges/shared/AutoGrowTextarea';
import StepFeedback from '../../challenges/shared/StepFeedback';
import ExampleToggle from '../../challenges/shared/ExampleToggle';
```

- [ ] **Replace main question textarea with AutoGrowTextarea + character counter**

Replace lines 103-112:
```jsx
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-slate-700">
            {translate('ialab.challenge.m3.step1_main_question')}
          </label>
          <span className={`text-xs font-medium ${
            form.mainQuestion.length > 0 ? 'text-corporate' : 'text-slate-400'
          }`}>
            {form.mainQuestion.length}/500
          </span>
        </div>
        <AutoGrowTextarea
          value={form.mainQuestion}
          onChange={(v) => update({ mainQuestion: v })}
          placeholder={translate('ialab.challenge.m3.step1_main_placeholder')}
          maxLength={500}
        />
        {form.mainQuestion.length > 0 && form.mainQuestion.length < 20 && (
          <p className="flex items-center gap-1.5 mt-2 text-xs text-amber-600">
            <Icon name="fa-info-circle" className="text-xs" />
            {translate('ialab.challenge.m3.step1_min_hint') || 'Escribe al menos 20 caracteres'}
          </p>
        )}
      </div>
```

- [ ] **Add instructional callout after topic section**

After the topic selection grid (after line 101):
```jsx
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
        <div className="flex items-center gap-2 mb-1.5">
          <Icon name="fa-lightbulb" className="text-amber-500 text-sm" />
          <h4 className="text-sm font-bold text-amber-800">
            {translate('ialab.challenge.m3.step1_howto_title')}
          </h4>
        </div>
        <p className="text-xs text-amber-700 leading-relaxed mb-2">
          {translate('ialab.challenge.m3.step1_howto_desc')}
        </p>
        <ExampleToggle example={translate('ialab.challenge.m3.step1_example_q')} />
        <div className="mt-1">
          <ExampleToggle example={translate('ialab.challenge.m3.step1_example_sub')} />
        </div>
      </div>
```

- [ ] **Add StepFeedback at bottom**

Before closing `</div>` of the return:
```jsx
      <StepFeedback
        completed={form.topic && form.mainQuestion.length >= 20 ? 1 : 0}
        total={1}
        hints={[translate('ialab.challenge.m3.step1_min_hint') || 'Escribe al menos 20 caracteres para tu pregunta principal']}
        t={translate}
      />
```

---

### Task 5: Refactor GeminiStep2

**Files:**
- Modify: `src/components/IALab/challenges/module3/GeminiStep2.jsx`

- [ ] **Update imports**

```jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '../../../../i18n/I18nProvider';
import { Icon } from '../../../../utils/iconMapping.jsx';
import AutoGrowTextarea from '../../challenges/shared/AutoGrowTextarea';
import StepFeedback from '../../challenges/shared/StepFeedback';
import ExampleToggle from '../../challenges/shared/ExampleToggle';
import ResearchContextBanner from '../../challenges/shared/ResearchContextBanner';
```

- [ ] **Add ResearchContextBanner after header section (before the grid)**

After the header div (line 65), add:
```jsx
      <ResearchContextBanner
        topic={/* Will be parsed from Step 1 response — see Task 8 */}
        stepNumber={2}
        locale={/* Will be obtained from useTranslation */}
      />
```

- [ ] **Replace key data textarea with AutoGrowTextarea**

Replace lines 129-135 with:
```jsx
                        <AutoGrowTextarea
                          value={source.keyData}
                          onChange={(v) => updateSource(i, { keyData: v })}
                          placeholder={translate('ialab.challenge.m3.step2_keydata_placeholder')}
                          maxLength={500}
                        />
```

- [ ] **Add instructional callout + ExampleToggle**

After the header but before the grid (after the ResearchContextBanner), add:
```jsx
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
        <div className="flex items-center gap-2 mb-1.5">
          <Icon name="fa-lightbulb" className="text-amber-500 text-sm" />
          <h4 className="text-sm font-bold text-amber-800">
            {translate('ialab.challenge.m3.step2_howto_title')}
          </h4>
        </div>
        <p className="text-xs text-amber-700 leading-relaxed mb-2">
          {translate('ialab.challenge.m3.step2_howto_desc')}
        </p>
        <ExampleToggle example={translate('ialab.challenge.m3.step2_example_data')} />
      </div>
```

- [ ] **Add StepFeedback at bottom**

Before closing `</div>`:
```jsx
      <StepFeedback
        completed={sources.filter(s => s.isRelevant && s.keyData.trim().length > 0).length + sources.filter(s => !s.isRelevant).length}
        total={sources.length}
        hints={[translate('ialab.challenge.m3.step2_howto_desc')]}
        t={translate}
      />
```

---

### Task 6: Refactor GeminiStep3

**Files:**
- Modify: `src/components/IALab/challenges/module3/GeminiStep3.jsx`

- [ ] **Update imports**

```jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '../../../../i18n/I18nProvider';
import { Icon } from '../../../../utils/iconMapping.jsx';
import AutoGrowTextarea from '../../challenges/shared/AutoGrowTextarea';
import StepFeedback from '../../challenges/shared/StepFeedback';
import ExampleToggle from '../../challenges/shared/ExampleToggle';
import ResearchContextBanner from '../../challenges/shared/ResearchContextBanner';
import VerdictSummaryBar from '../../challenges/shared/VerdictSummaryBar';
```

- [ ] **Add ResearchContextBanner + VerdictSummaryBar + instructional callout**

After the header div (line 57) and before the grid:
```jsx
      <ResearchContextBanner topic={/* See Task 8 */} stepNumber={3} locale={/* See Task 8 */} />

      <VerdictSummaryBar claims={claims} t={translate} />

      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
        <div className="flex items-center gap-2 mb-1.5">
          <Icon name="fa-lightbulb" className="text-amber-500 text-sm" />
          <h4 className="text-sm font-bold text-amber-800">
            {translate('ialab.challenge.m3.step3_howto_title')}
          </h4>
        </div>
        <p className="text-xs text-amber-700 leading-relaxed mb-2">
          {translate('ialab.challenge.m3.step3_howto_desc')}
        </p>
        <ExampleToggle example={translate('ialab.challenge.m3.step3_example_reasoning')} />
      </div>
```

- [ ] **Replace reasoning textarea with AutoGrowTextarea**

Replace lines 100-106 with:
```jsx
                    <AutoGrowTextarea
                      value={claim.reasoning}
                      onChange={(v) => updateClaim(i, { reasoning: v })}
                      placeholder={translate('ialab.challenge.m3.step3_reason_placeholder')}
                      maxLength={500}
                    />
```

- [ ] **Add StepFeedback at bottom**

Before closing `</div>`:
```jsx
      <StepFeedback
        completed={claims.filter(c => c.verdict !== null).length}
        total={claims.length}
        hints={[translate('ialab.challenge.m3.step3_howto_desc')]}
        t={translate}
      />
```

---

### Task 7: Refactor GeminiStep4

**Files:**
- Modify: `src/components/IALab/challenges/module3/GeminiStep4.jsx`

- [ ] **Update imports**

```jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '../../../../i18n/I18nProvider';
import { Icon } from '../../../../utils/iconMapping.jsx';
import AutoGrowTextarea from '../../challenges/shared/AutoGrowTextarea';
import StepFeedback from '../../challenges/shared/StepFeedback';
import ExampleToggle from '../../challenges/shared/ExampleToggle';
import ResearchContextBanner from '../../challenges/shared/ResearchContextBanner';
```

- [ ] **Add ResearchContextBanner after header**

After line 90:
```jsx
      <ResearchContextBanner topic={/* See Task 8 */} stepNumber={4} locale={/* See Task 8 */} />
```

- [ ] **Replace section textarea with AutoGrowTextarea + character counter + ExampleToggle**

Replace lines 125-133 with:
```jsx
                  <div className="px-4 pb-4 border-t border-slate-100">
                    <div className="flex items-center justify-between mt-3 mb-1.5">
                      <label className="text-xs font-medium text-slate-500">
                        {translate('ialab.challenge.m3.step4_placeholder', { section: key })}
                      </label>
                      <span className={`text-xs font-medium ${
                        content.length > 0 ? 'text-corporate' : 'text-slate-400'
                      }`}>
                        {content.length} {translate('ialab.challenge.m3.step4_char_label')}
                      </span>
                    </div>
                    <AutoGrowTextarea
                      value={content}
                      onChange={(v) => updateSection(key, v)}
                      placeholder={translate('ialab.challenge.m3.step4_placeholder', { section: key })}
                      maxLength={2000}
                    />
                    <ExampleToggle example={
                      key === 'Introducción' ? translate('ialab.challenge.m3.step4_example_intro') :
                      key === 'Metodología' ? translate('ialab.challenge.m3.step4_example_methodology') :
                      key === 'Hallazgos' ? translate('ialab.challenge.m3.step4_example_findings') :
                      key === 'Verificación de fuentes' ? translate('ialab.challenge.m3.step4_example_verification') :
                      key === 'Conclusiones' ? translate('ialab.challenge.m3.step4_example_conclusions') :
                      ''
                    } />
                  </div>
```

- [ ] **Add collapsible preview when collapsed**

Replace the status indicator in lines 114-116 with:
```jsx
                    <div>
                      <h4 className="font-semibold text-slate-800 text-left">{key}</h4>
                      {!isExpanded && content ? (
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{content}</p>
                      ) : (
                        <p className="text-xs text-slate-400 mt-0.5">
                          {content
                            ? translate('ialab.challenge.m3.step4_filled')
                            : translate('ialab.challenge.m3.step4_empty')}
                        </p>
                      )}
                    </div>
```

- [ ] **Add StepFeedback at bottom**

Before closing `</div>`:
```jsx
      <StepFeedback
        completed={defaultSections.filter(s => {
          const key = typeof s === 'string' ? s : (s.titulo || s);
          return sections[key] && sections[key].trim().length > 0;
        }).length}
        total={defaultSections.length}
        hints={[translate('ialab.challenge.m3.step4_howto_desc')]}
        t={translate}
      />
```

---

### Task 8: Wire ResearchContextBanner with topic from Step 1

**Files:**
- Modify: `src/components/IALab/challenges/module3/GeminiStep2.jsx`
- Modify: `src/components/IALab/challenges/module3/GeminiStep3.jsx`
- Modify: `src/components/IALab/challenges/module3/GeminiStep4.jsx`

- [ ] **Add `topic` prop to each step component**

GeminiStep2.jsx — add to destructuring:
```jsx
const GeminiStep2 = ({ exercise, response, onResponseChange, t: tProp, topic = '' }) => {
```

GeminiStep3.jsx — same:
```jsx
const GeminiStep3 = ({ exercise, response, onResponseChange, t: tProp, topic = '' }) => {
```

GeminiStep4.jsx — same:
```jsx
const GeminiStep4 = ({ exercise, response, onResponseChange, t: tProp, topic = '' }) => {
```

- [ ] **Replace the placeholder ResearchContextBanner topic prop**

In each step, replace:
```jsx
topic={/* See Task 8 */}
```
with:
```jsx
topic={topic}
```

- [ ] **Add locale from useTranslation**

In each step, replace:
```jsx
locale={/* See Task 8 */}
```
with:
```jsx
locale={locale}
```

Add `locale` to useTranslation destructuring:
```jsx
const { t, locale } = useTranslation();
```

---

### Task 9: Wire topic through IALabEvaluationModal

**Files:**
- Modify: `src/components/IALab/IALabEvaluationModal.jsx`

- [ ] **Parse topic from Step 1 response in renderContent**

Find where StepComponent is rendered with module3 steps, and pass topic:
```jsx
// Parse topic from ej1 for context continuity
const ej1Parsed = (() => {
  try { return JSON.parse(state.responses.ej1 || '{}'); }
  catch { return {}; }
})();
const researchTopic = ej1Parsed.topic || '';

// Then pass to StepComponent:
<StepComponent
  exercise={currentExercise}
  response={state.responses[responseKey] || ''}
  onResponseChange={(response) => setResponse(responseKey, response)}
  t={t}
  topic={researchTopic}
/>
```

---

## Verification

```bash
npm run build
```

Check for:
- No compilation errors
- All i18n keys resolved
- ResearchContextBanner shows topic across steps
- VerdictSummaryBar updates in real-time
- AutoGrowTextarea auto-expands
- StepFeedback shows progress
- ExampleToggle shows/hides examples
- Character counters update on input
