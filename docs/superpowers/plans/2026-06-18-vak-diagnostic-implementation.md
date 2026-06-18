# VAK Diagnostic Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the VAK Diagnostic with standards-compliant scoring, split the 2686-line monolith into focused components, eliminate TTS delays, and replace html2pdf.js with direct jsPDF generation.

**Architecture:** Phase-based migration. Phase 1 builds the scoring engine and question bank. Phase 2 splits the monolith into VAKLayout + sub-components. Phase 3 optimizes voice, animations, and PDF. Phase 4 QA.

**Tech Stack:** React 18, jsPDF (replace html2pdf.js), Framer Motion, Recharts, Tailwind CSS

**Spec:** `docs/superpowers/specs/2026-06-18-vak-diagnostic-redesign.md`

---

### Phase 1: Scoring Engine & Question Bank

### Task 1.1: Create unified 48-question bank

**Files:**
- Modify: `src/data/vakQuestions.js`

- [ ] **Step 1: Read current file**

Run: `wc -l src/data/vakQuestions.js`

- [ ] **Step 2: Replace content with 48-question bank**

The file must export `getQuestionsByAge(age)` returning 24 random questions (8 per style) from a pool of 16 per age group. Each question has metadata:

```javascript
/**
 * Banco unificado VAK — 48 preguntas con metadatos psicométricos
 * 16 por grupo etario (6-9, 10-13, 14-17)
 * Cada grupo: 5-6 visuales, 5-6 auditivas, 5-6 kinestésicas
 */

const QUESTIONS_BY_AGE = {
  "6-9": [
    {
      id: "vak_6_001",
      text: "¿Cómo te gusta más aprender algo nuevo?",
      style: "visual",
      difficulty: 0.65,
      discrimination: 0.48,
      options: [
        { text: "Viendo videos o dibujos animados", type: "visual", icon: "Eye" },
        { text: "Escuchando a mi profesor o a mis papás", type: "auditivo", icon: "Headphones" },
        { text: "Haciéndolo yo mismo con mis manos", type: "kinestesico", icon: "Activity" }
      ]
    },
    {
      id: "vak_6_002",
      text: "Cuando te cuentan un cuento, ¿qué prefieres?",
      style: "kinestesico",
      difficulty: 0.58,
      discrimination: 0.42,
      options: [
        { text: "Ver las imágenes del libro", type: "visual", icon: "BookOpen" },
        { text: "Escuchar la historia con atención", type: "auditivo", icon: "Volume" },
        { text: "Actuar el cuento con mis amigos", type: "kinestesico", icon: "Users" }
      ]
    },
    // ... 14 more questions for 6-9
  ],
  "10-13": [ /* 16 questions */ ],
  "14-17": [ /* 16 questions */ ]
};

const AGE_GROUPS = [
  { min: 6, max: 9, key: "6-9" },
  { min: 10, max: 13, key: "10-13" },
  { min: 14, max: 17, key: "14-17" }
];

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getQuestionsByAge(age) {
  const group = AGE_GROUPS.find(g => age >= g.min && age <= g.max) || AGE_GROUPS[AGE_GROUPS.length - 1];
  const pool = QUESTIONS_BY_AGE[group.key];

  // Select 8 per style (or all available if less)
  const byStyle = { visual: [], auditivo: [], kinestesico: [] };
  for (const q of pool) {
    byStyle[q.style]?.push(q);
  }

  const selected = [];
  for (const style of ['visual', 'auditivo', 'kinestesico']) {
    const shuffled = shuffleArray(byStyle[style]);
    selected.push(...shuffled.slice(0, 8));
  }

  return shuffleArray(selected); // Final order randomized
}

export function getAgeGroupKey(age) {
  const group = AGE_GROUPS.find(g => age >= g.min && age <= g.max);
  return group ? group.key : "14-17";
}
```

Include ALL 48 questions (16 per age group × 3 groups). Use the existing questions from `vakQuestions.js` as base, add translations from `vakData.es.js`/`vakData.en.js`, then create new ones to reach 16 per group.

- [ ] **Step 3: Verify the file loads**

Run: `node -e "const m = require('./src/data/vakQuestions'); console.log('OK', m.getQuestionsByAge(10).length)"`

Expected: `OK 24`

---

### Task 1.2: Create useVAKScoring hook

**Files:**
- Create: `src/hooks/useVAKScoring.js`

- [ ] **Step 1: Write the hook**

```javascript
import { useMemo } from 'react';

function normalCDF(x, mean = 50, sd = 10) {
  const z = (x - mean) / sd;
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const sign = z < 0 ? -1 : 1;
  const absZ = Math.abs(z);
  const t = 1 / (1 + p * absZ);
  const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absZ * absZ);
  return 0.5 * (1 + sign * y);
}

function calculateCronbachAlpha(responsesByItem) {
  const k = responsesByItem.length;
  if (k < 3) return null;

  const styles = ['visual', 'auditivo', 'kinestesico'];
  const itemVariances = [];

  for (let i = 0; i < k; i++) {
    const scores = styles.map(s => responsesByItem[i][s] || 0);
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((sum, s) => sum + (s - mean) ** 2, 0) / scores.length;
    itemVariances.push(variance || 0.001);
  }

  const totalScores = { visual: [], auditivo: [], kinestesico: [] };
  for (const item of responsesByItem) {
    for (const s of styles) {
      totalScores[s].push(item[s] || 0);
    }
  }

  const totalVariance = {};
  for (const s of styles) {
    const scores = totalScores[s];
    if (scores.length < 2) { totalVariance[s] = 1; continue; }
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    totalVariance[s] = scores.reduce((sum, v) => sum + (v - mean) ** 2, 0) / scores.length || 1;
  }

  const sumItemVar = itemVariances.reduce((a, b) => a + b, 0);
  const alpha = {};
  for (const s of styles) {
    const kk = responsesByItem.length;
    alpha[s] = (kk / (kk - 1)) * (1 - sumItemVar / totalVariance[s]);
    alpha[s] = Math.min(1, Math.max(-1, alpha[s]));
  }

  return alpha;
}

export function calculateVAKScore(answers) {
  // answers: array of { type: 'visual'|'auditivo'|'kinestesico' }
  const counts = { visual: 0, auditivo: 0, kinestesico: 0 };
  const responsesByItem = [];

  for (const answer of answers) {
    counts[answer.type] = (counts[answer.type] || 0) + 1;
    responsesByItem.push({
      visual: answer.type === 'visual' ? 1 : 0,
      auditivo: answer.type === 'auditivo' ? 1 : 0,
      kinestesico: answer.type === 'kinestesico' ? 1 : 0
    });
  }

  const totalPerStyle = Math.max(1, Math.floor(answers.length / 3));
  const totalQuestions = answers.length;

  const rawPercentages = {
    visual: (counts.visual / totalPerStyle) * 100,
    auditivo: (counts.auditivo / totalPerStyle) * 100,
    kinestesico: (counts.kinestesico / totalPerStyle) * 100,
  };

  const T = {};
  for (const [style, pct] of Object.entries(rawPercentages)) {
    const proportion = Math.max(0.01, Math.min(0.99, pct / 100));
    const logit = Math.log(proportion / (1 - proportion));
    T[style] = 50 + 10 * logit;
  }

  const SE = 10 * Math.sqrt(1 - 0.80);
  const CI = 1.96 * SE;

  const intervals = {};
  for (const s of ['visual', 'auditivo', 'kinestesico']) {
    intervals[s] = {
      score: Math.round(T[s]),
      ci95: {
        lower: Math.max(0, Math.round(T[s] - CI)),
        upper: Math.min(100, Math.round(T[s] + CI)),
      },
      percentile: Math.round(normalCDF(T[s]) * 100),
      rawCount: counts[s],
    };
  }

  const cronbachAlpha = calculateCronbachAlpha(responsesByItem);
  const meanAlpha = cronbachAlpha
    ? Object.values(cronbachAlpha).reduce((a, b) => a + b, 0) / 3
    : null;

  return { counts, rawPercentages, T, intervals, cronbachAlpha, meanAlpha, totalQuestions };
}

export default function useVAKScoring(answers) {
  return useMemo(() => {
    if (!answers || answers.length === 0) return null;
    return calculateVAKScore(answers);
  }, [answers]);
}
```

- [ ] **Step 2: Quick verification**

Run: `node -e "const { calculateVAKScore } = require('./src/hooks/useVAKScoring'); console.log(JSON.stringify(calculateVAKScore([{type:'visual'},{type:'visual'},{type:'kinestesico'},{type:'auditivo'},{type:'visual'},{type:'kinestesico'}])))"`

Expected: Valid JSON with counts, T scores, intervals, cronbachAlpha

---

### Task 1.3: Deprecate duplicate vakData files

**Files:**
- Read: `src/constants/vakData.js`
- Read: `src/constants/vakData.es.js` (first 20 lines to confirm they're unused by main component)
- Read: `src/constants/vakData.en.js` (first 20 lines)

- [ ] **Step 1: Verify nothing imports these files except the deprecated path**

Run: `rg "vakData" src/ --include '*.js' --include '*.jsx'`

If only `DiagnosticoVAK.jsx` and `NeuroEntorno.jsx` reference `calculateVAKResult`/`getVAKChartData` from these files, proceed.

- [ ] **Step 2: Add deprecation notice to each file**

Prepend to `src/constants/vakData.js`:
```javascript
// DEPRECATED: Use src/data/vakQuestions.js + src/hooks/useVAKScoring.js instead
// Will be removed after VAK redesign migration
```

Same for `.es.js` and `.en.js`.

- [ ] **Step 3: Do NOT delete files yet** (main component still references them until Phase 2)

---

### Phase 2: Component Splitting

### Task 2.1: Create VAKLayout orquestador

**Files:**
- Create: `src/components/DiagnosticoVAK/VAKLayout.jsx`
- Create: `src/components/DiagnosticoVAK/VAKLayout.css`

- [ ] **Step 1: Create VAKLayout.jsx**

```javascript
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from '../../i18n/I18nProvider';
import useValentinaAgent from '../../hooks/useValentinaAgent';
import useVAKScoring from '../../hooks/useVAKScoring';
import { getQuestionsByAge, getAgeGroupKey } from '../../data/vakQuestions';
import VAKWelcome from './VAKWelcome';
import VAKCalibration from './VAKCalibration';
import VAKTest from './VAKTest';
import VAKResultReport from './VAKResultReport';
import VAKPDFPreview from './VAKPDFPreview';
import { safeStorage } from '../../utils/storage';
import './VAKLayout.css';

const PHASES = ['intro', 'calibration', 'test', 'result', 'preview'];

export default function VAKLayout({ onNavigate }) {
  const { t } = useTranslation();
  const [phase, setPhase] = useState('intro');
  const [studentData, setStudentData] = useState({ name: '', age: 12, email: '', phone: '', mood: 'neutral' });
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [valeriaEnabled, setValeriaEnabled] = useState(() => {
    const pref = safeStorage.getItem('edutechlife_valeria_enabled');
    return pref === null ? false : pref === 'true'; // OFF by default
  });

  const valeria = useValentinaAgent({
    studentName: studentData.name,
    studentAge: studentData.age,
    phase,
    currentQuestion,
    totalQuestions: questions.length,
    enabled: valeriaEnabled,
  });

  const score = useVAKScoring(answers);

  useEffect(() => {
    safeStorage.setItem('edutechlife_valeria_enabled', valeriaEnabled);
  }, [valeriaEnabled]);

  const handleStart = useCallback(() => {
    setPhase('calibration');
  }, []);

  const handleCalibrationComplete = useCallback((data) => {
    setStudentData(prev => ({ ...prev, ...data }));
    const qs = getQuestionsByAge(data.age);
    setQuestions(qs);
    setCurrentQuestion(0);
    setAnswers([]);
    setPhase('test');
  }, []);

  const handleAnswer = useCallback((answerType) => {
    setAnswers(prev => [...prev, { type: answerType }]);
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setTimeout(() => setPhase('result'), 500);
    }
  }, [currentQuestion, questions.length]);

  const handleViewPDF = useCallback(() => setPhase('preview'), []);
  const handleBackToResults = useCallback(() => setPhase('result'), []);
  const handleRestart = useCallback(() => {
    setPhase('intro');
    setCurrentQuestion(0);
    setAnswers([]);
    setQuestions([]);
  }, []);

  return (
    <div className="vak-layout">
      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <VAKWelcome
            key="intro"
            onStart={handleStart}
            valeriaEnabled={valeriaEnabled}
            onToggleValeria={setValeriaEnabled}
            valeria={valeria}
          />
        )}
        {phase === 'calibration' && (
          <VAKCalibration
            key="calibration"
            initialData={studentData}
            onComplete={handleCalibrationComplete}
            valeria={valeria}
          />
        )}
        {phase === 'test' && (
          <VAKTest
            key="test"
            questions={questions}
            currentQuestion={currentQuestion}
            onAnswer={handleAnswer}
            valeria={valeria}
            valeriaEnabled={valeriaEnabled}
          />
        )}
        {phase === 'result' && (
          <VAKResultReport
            key="result"
            studentData={studentData}
            score={score}
            onViewPDF={handleViewPDF}
            onRestart={handleRestart}
            valeria={valeria}
          />
        )}
        {phase === 'preview' && (
          <VAKPDFPreview
            key="preview"
            studentData={studentData}
            score={score}
            onBack={handleBackToResults}
            onRestart={handleRestart}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: Create VAKLayout.css**

```css
.vak-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
}

.vak-layout.dark {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

/* Phase transitions */
.vak-layout .phase-enter {
  opacity: 0;
  transform: translateY(20px);
}
.vak-layout .phase-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

/* Rest of styles moved from DiagnosticoVAK.css */
```

---

### Task 2.2: Create VAKWelcome component

**Files:**
- Create: `src/components/DiagnosticoVAK/VAKWelcome.jsx`

- [ ] **Step 1: Create VAKWelcome.jsx**

```javascript
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Volume2, VolumeX } from 'lucide-react';
import { useTranslation } from '../../i18n/I18nProvider';
import { tutorAvatars, DEFAULT_AVATAR } from '../../data/tutorAvatars';

export default function VAKWelcome({ onStart, valeriaEnabled, onToggleValeria, valeria }) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto px-4 py-12"
    >
      {/* Valeria avatar */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <img
            src={tutorAvatars.Valeria || DEFAULT_AVATAR}
            alt="Valeria"
            className="w-24 h-24 rounded-full object-cover ring-4 ring-[#4DA8C4]/30"
          />
          {valeria.isValentinaSpeaking && (
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full animate-pulse" />
          )}
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-center text-[#004B63] mb-4">
        {t('vak.ui.welcome_title')}
      </h1>

      <p className="text-gray-600 text-center mb-8 leading-relaxed">
        {t('vak.ui.welcome_description')}
      </p>

      {/* Voice toggle */}
      <div className="flex justify-center mb-8">
        <button
          onClick={() => onToggleValeria(!valeriaEnabled)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
            valeriaEnabled
              ? 'bg-[#4DA8C4] text-white'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          {valeriaEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          {valeriaEnabled ? t('vak.ui.valeria_on') : t('vak.ui.valeria_off')}
        </button>
      </div>

      {/* Start button */}
      <div className="flex justify-center">
        <button
          onClick={onStart}
          className="group relative px-8 py-4 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
        >
          <span className="flex items-center gap-2">
            <Sparkles size={20} />
            {t('vak.ui.start_diagnosis')}
          </span>
        </button>
      </div>
    </motion.div>
  );
}
```

---

### Task 2.3: Create VAKCalibration component

**Files:**
- Create: `src/components/DiagnosticoVAK/VAKCalibration.jsx`

- [ ] **Step 1: Create VAKCalibration.jsx**

```javascript
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, Mail, Phone, Smile, ArrowRight } from 'lucide-react';
import { useTranslation } from '../../i18n/I18nProvider';

const MOOD_OPTIONS = [
  { value: 'excited', icon: '😄', labelKey: 'vak.ui.mood_excited' },
  { value: 'happy', icon: '🙂', labelKey: 'vak.ui.mood_happy' },
  { value: 'neutral', icon: '😐', labelKey: 'vak.ui.mood_neutral' },
  { value: 'nervous', icon: '😰', labelKey: 'vak.ui.mood_nervous' },
  { value: 'tired', icon: '😴', labelKey: 'vak.ui.mood_tired' },
];

export default function VAKCalibration({ initialData, onComplete, valeria }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: initialData.name || '',
    age: initialData.age || 12,
    email: initialData.email || '',
    phone: initialData.phone || '',
    mood: initialData.mood || 'neutral',
  });
  const [errors, setErrors] = useState({});

  // Valeria welcomes and form appears — voice is parallel, not sequential
  useEffect(() => {
    if (valeria.valentinaMode && valeria.speakAsValentina) {
      const welcomeMsg = t('vak.ui.valeria_calibration_welcome', { name: form.name || '' });
      valeria.speakAsValentina(welcomeMsg);
    }
  }, []); // Only on mount

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = t('vak.ui.error_name');
    if (!form.age || form.age < 4 || form.age > 18) e.age = t('vak.ui.error_age');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    // Valeria confirms briefly (1 segment, not sequential field-by-field)
    if (valeria.valentinaMode && valeria.speakAsValentina) {
      valeria.speakAsValentina(t('vak.ui.valeria_calibration_done', { name: form.name }));
    }
    onComplete(form);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-lg mx-auto px-4 py-8"
    >
      <h2 className="text-2xl font-bold text-[#004B63] mb-6">{t('vak.ui.calibration_title')}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <User size={16} /> {t('vak.ui.name')}
          </label>
          <input
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#4DA8C4] focus:ring-2 focus:ring-[#4DA8C4]/20 outline-none transition-all"
            placeholder={t('vak.ui.name_placeholder')}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <Calendar size={16} /> {t('vak.ui.age')}
          </label>
          <input
            type="number"
            min={4}
            max={18}
            value={form.age}
            onChange={e => setForm(f => ({ ...f, age: parseInt(e.target.value) || 12 }))}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#4DA8C4] focus:ring-2 focus:ring-[#4DA8C4]/20 outline-none transition-all"
          />
          {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <Mail size={16} /> {t('vak.ui.email')}
          </label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#4DA8C4] focus:ring-2 focus:ring-[#4DA8C4]/20 outline-none transition-all"
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <Phone size={16} /> {t('vak.ui.phone')}
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#4DA8C4] focus:ring-2 focus:ring-[#4DA8C4]/20 outline-none transition-all"
            placeholder="+57 300 123 4567"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Smile size={16} /> {t('vak.ui.how_do_you_feel')}
          </label>
          <div className="flex gap-3 justify-center">
            {MOOD_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm(f => ({ ...f, mood: opt.value }))}
                className={`p-3 rounded-xl text-2xl transition-all ${
                  form.mood === opt.value
                    ? 'bg-[#4DA8C4]/20 ring-2 ring-[#4DA8C4] scale-110'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                title={t(opt.labelKey)}
              >
                {opt.icon}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          {t('vak.ui.start_test')} <ArrowRight size={18} />
        </button>
      </form>
    </motion.div>
  );
}
```

---

### Task 2.4: Create VAKTest + VAKQuestionCard components

**Files:**
- Create: `src/components/DiagnosticoVAK/VAKTest.jsx`
- Create: `src/components/DiagnosticoVAK/VAKQuestionCard.jsx`

- [ ] **Step 1: Create VAKQuestionCard.jsx**

```javascript
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../i18n/I18nProvider';

const STYLE_COLORS = {
  visual: { bg: 'bg-blue-50 border-blue-200', accent: 'text-blue-600', dot: 'bg-blue-500' },
  auditivo: { bg: 'bg-purple-50 border-purple-200', accent: 'text-purple-600', dot: 'bg-purple-500' },
  kinestesico: { bg: 'bg-green-50 border-green-200', accent: 'text-green-600', dot: 'bg-green-500' },
};

export default function VAKQuestionCard({ question, questionNum, total, onAnswer, valeria, valeriaEnabled, isAnswering }) {
  const [selectedOption, setSelectedOption] = useState(null);

  // Valeria reads the question when card appears
  useEffect(() => {
    if (valeriaEnabled && valeria?.readQuestionWithOptions) {
      const optionsText = question.options.map((o, i) => `${String.fromCharCode(65 + i)}. ${o.text}`).join('. ');
      valeria.readQuestionWithOptions(question.text, optionsText, questionNum, total);
    }
  }, [question.id]);

  const handleSelect = (option) => {
    if (isAnswering) return;
    setSelectedOption(option);
    setTimeout(() => {
      onAnswer(option.type);
      setSelectedOption(null);
    }, 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="max-w-2xl mx-auto px-4 py-6"
    >
      <div className="mb-2 text-sm text-gray-500">
        {t('vak.ui.question')} {questionNum} {t('vak.ui.of')} {total}
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-gradient-to-r from-[#004B63] to-[#4DA8C4] h-2 rounded-full transition-all duration-500"
          style={{ width: `${(questionNum / total) * 100}%` }}
        />
      </div>

      <h2 className="text-xl font-semibold text-[#004B63] mb-6">{question.text}</h2>

      <div className="space-y-3">
        {question.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(option)}
            disabled={isAnswering}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
              selectedOption === option
                ? 'border-[#4DA8C4] bg-[#4DA8C4]/10 scale-[1.02]'
                : 'border-gray-100 bg-white hover:border-[#4DA8C4]/50 hover:shadow-md'
            } ${isAnswering ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span className="font-medium text-gray-800">{option.text}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Create VAKTest.jsx**

```javascript
import React, { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { StopCircle } from 'lucide-react';
import { useTranslation } from '../../i18n/I18nProvider';
import VAKQuestionCard from './VAKQuestionCard';

export default function VAKTest({ questions, currentQuestion, onAnswer, valeria, valeriaEnabled }) {
  const { t } = useTranslation();
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const handleAnswer = useCallback((type) => {
    setAnsweredQuestions(prev => new Set([...prev, currentQuestion]));
    // Encouragement only at Q3, Q6, Q9
    if ((currentQuestion + 1) % 3 === 0 && currentQuestion > 0 && valeriaEnabled && valeria?.giveEncouragementNoName) {
      setTimeout(() => valeria.giveEncouragementNoName(), 500);
    }
    onAnswer(type);
  }, [currentQuestion, onAnswer, valeria, valeriaEnabled]);

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  return (
    <div>
      {/* Timer bar */}
      <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-100 z-10 px-4 py-2 flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {t('vak.ui.question')} {currentQuestion + 1} {t('vak.ui.of')} {questions.length}
        </span>
        <span className="text-sm text-gray-400 font-mono">
          {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </span>
      </div>

      <div className="pt-16">
        <AnimatePresence mode="wait">
          {questions[currentQuestion] && (
            <VAKQuestionCard
              key={currentQuestion}
              question={questions[currentQuestion]}
              questionNum={currentQuestion + 1}
              total={questions.length}
              onAnswer={handleAnswer}
              valeria={valeria}
              valeriaEnabled={valeriaEnabled}
              isAnswering={answeredQuestions.has(currentQuestion)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
```

---

### Task 2.5: Create VAKResultReport component

**Files:**
- Create: `src/components/DiagnosticoVAK/VAKResultReport.jsx`

- [ ] **Step 1: Create VAKResultReport.jsx**

```javascript
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Download, RotateCcw, FileText } from 'lucide-react';
import { useTranslation } from '../../i18n/I18nProvider';

const STYLE_META = {
  visual: { label: 'Visual', color: '#4DA8C4', bg: 'bg-[#4DA8C4]/10', icon: '👁️' },
  auditivo: { label: 'Auditivo', color: '#004B63', bg: 'bg-[#004B63]/10', icon: '👂' },
  kinestesico: { label: 'Kinestésico', color: '#66CCCC', bg: 'bg-[#66CCCC]/10', icon: '🖐️' },
};

export default function VAKResultReport({ studentData, score, onViewPDF, onRestart, valeria }) {
  const { t } = useTranslation();

  useEffect(() => {
    if (valeria?.valentinaMode && valeria?.announceResults && score) {
      setTimeout(() => valeria.announceResults(), 500); // 500ms visual transition instead of 1500ms
    }
  }, []);

  if (!score) {
    return <div className="text-center py-12 text-gray-500">{t('vak.ui.no_results')}</div>;
  }

  const radarData = Object.entries(STYLE_META).map(([key, meta]) => ({
    subject: meta.label,
    A: score.intervals[key]?.score || 0,
    fullMark: 100,
  }));

  const sortedStyles = Object.entries(score.intervals)
    .sort(([, a], [, b]) => b.score - a.score);

  const meanAlpha = score.meanAlpha;
  const alphaLabel = meanAlpha >= 0.9 ? t('vak.ui.alpha_excellent')
    : meanAlpha >= 0.8 ? t('vak.ui.alpha_good')
    : meanAlpha >= 0.7 ? t('vak.ui.alpha_acceptable')
    : t('vak.ui.alpha_poor');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#004B63] mb-2">{t('vak.ui.your_results')}</h1>
        <p className="text-gray-500">{studentData.name}, {studentData.age} {t('vak.ui.years')}</p>
      </div>

      {/* Score cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {sortedStyles.map(([style, data]) => {
          const meta = STYLE_META[style];
          return (
            <div key={style} className={`${meta.bg} rounded-2xl p-6 border-t-4 border-[#004B63]`}>
              <div className="text-3xl mb-2">{meta.icon}</div>
              <h3 className="font-bold text-gray-800">{meta.label}</h3>
              <div className="text-3xl font-bold text-[#004B63] mt-2">{data.score}</div>
              <div className="text-sm text-gray-500">
                {t('vak.ui.ic_95')}: {data.ci95.lower}–{data.ci95.upper}
              </div>
              <div className="text-sm text-gray-500">
                {t('vak.ui.percentile')}: {data.percentile}
              </div>
            </div>
          );
        })}
      </div>

      {/* Radar chart */}
      <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100 shadow-sm">
        <div className="w-full max-w-[300px] mx-auto aspect-square">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#E2E8F0" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94A3B8', fontSize: 10 }} />
              <Radar name={t('vak.ui.score')} dataKey="A" stroke="#4DA8C4" fill="#4DA8C4" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Reliability */}
      {meanAlpha !== null && (
        <div className="bg-white rounded-2xl p-4 mb-8 border border-gray-100 shadow-sm text-center">
          <span className="text-sm text-gray-500">{t('vak.ui.reliability')}: </span>
          <span className="font-semibold text-[#004B63]">α = {meanAlpha.toFixed(2)}</span>
          <span className="text-sm text-gray-500 ml-2">({alphaLabel})</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <button
          onClick={onViewPDF}
          className="flex items-center gap-2 px-6 py-3 bg-[#004B63] text-white rounded-xl hover:bg-[#003d52] transition-all"
        >
          <FileText size={18} /> {t('vak.ui.view_pdf')}
        </button>
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all"
        >
          <RotateCcw size={18} /> {t('vak.ui.retake')}
        </button>
      </div>
    </motion.div>
  );
}
```

---

### Task 2.6: Create VAKPDFPreview + VAKPDFGenerator

**Files:**
- Create: `src/components/DiagnosticoVAK/VAKPDFPreview.jsx`
- Create: `src/components/DiagnosticoVAK/VAKPDFGenerator.js`

- [ ] **Step 1: Create VAKPDFGenerator.js**

```javascript
import { jsPDF } from 'jspdf';

export function generateVAKPDF(studentData, score) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pw = 210;
  const m = 20;
  let y = m;

  // Header
  doc.setFillColor(0, 75, 99);
  doc.rect(0, 0, pw, 45, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text('Diagnóstico VAK', pw / 2, 28, { align: 'center' });

  // Student info
  y = 55;
  doc.setTextColor(0, 75, 99);
  doc.setFontSize(13);
  doc.text(`Estudiante: ${studentData.name}`, m, y);
  y += 8;
  doc.text(`Edad: ${studentData.age} anos`, m, y);
  y += 8;
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-CO')}`, m, y);

  // Scores
  y += 15;
  doc.setDrawColor(77, 168, 196);
  doc.setLineWidth(0.5);

  for (const [style, meta] of Object.entries({
    visual: { label: 'Visual', color: [77, 168, 196] },
    auditivo: { label: 'Auditivo', color: [0, 75, 99] },
    kinestesico: { label: 'Kinesico', color: [102, 204, 204] },
  })) {
    const data = score.intervals[style];
    if (!data) continue;

    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    doc.text(meta.label, m, y + 4);

    const barMax = pw - 2 * m - 80;
    const barW = Math.max(2, (data.score / 100) * barMax);

    doc.setFillColor(...meta.color);
    doc.roundedRect(m + 55, y, barW, 7, 2, 2, 'F');

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`${data.score} (IC: ${data.ci95.lower}-${data.ci95.upper})`, m + 60 + barW, y + 5);

    y += 12;
  }

  // Reliability
  if (score.meanAlpha !== null) {
    y += 8;
    doc.setFontSize(11);
    doc.setTextColor(0, 75, 99);
    doc.text(`Confiabilidad: alpha = ${score.meanAlpha.toFixed(2)}`, m, y);
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Generado por Edutechlife VAK Diagnostic', pw / 2, 290, { align: 'center' });

  doc.save('diagnostico-vak.pdf');
  return doc;
}
```

- [ ] **Step 2: Create VAKPDFPreview.jsx**

```javascript
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, RotateCcw } from 'lucide-react';
import { useTranslation } from '../../i18n/I18nProvider';
import { generateVAKPDF } from './VAKPDFGenerator';

export default function VAKPDFPreview({ studentData, score, onBack, onRestart }) {
  const { t } = useTranslation();

  const handleDownload = () => {
    console.time('pdf-generation');
    generateVAKPDF(studentData, score);
    console.timeEnd('pdf-generation');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto px-4 py-8"
    >
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-[#004B63] mb-6">{t('vak.ui.pdf_preview')}</h2>

        <div className="space-y-4 mb-8">
          <p className="text-gray-600">{t('vak.ui.pdf_description')}</p>
          <ul className="text-sm text-gray-500 space-y-2">
            <li>• {t('vak.ui.student')}: {studentData.name}</li>
            <li>• {t('vak.ui.age')}: {studentData.age} {t('vak.ui.years')}</li>
            <li>• {t('vak.ui.date')}: {new Date().toLocaleDateString('es-CO')}</li>
          </ul>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-3 bg-[#4DA8C4] text-white rounded-xl hover:bg-[#3d96b0] transition-all"
          >
            <Download size={18} /> {t('vak.ui.download_pdf')}
          </button>
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all"
          >
            <ArrowLeft size={18} /> {t('vak.ui.back_results')}
          </button>
          <button
            onClick={onRestart}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all"
          >
            <RotateCcw size={18} /> {t('vak.ui.retake')}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
```

---

### Task 2.7: Update barrel export and page entry

**Files:**
- Modify: `src/components/DiagnosticoVAK/index.js`
- Verify: `src/components/pages/VAKDiagnosisPage.jsx`
- Verify: `src/routes/index.jsx`

- [ ] **Step 1: Update index.js**

```javascript
export { default } from './VAKLayout';
```

- [ ] **Step 2: Verify VAKDiagnosisPage.jsx still works**

Read the file to confirm it lazy-imports from `../DiagnosticoVAK` — if it does, the barrel export change is sufficient.

- [ ] **Step 3: Build check**

Run: `npx vite build 2>&1 | grep -E "error|ERROR"` — expect 0 errors

---

### Phase 3: Optimization

### Task 3.1: Remove artificial delays from useValentinaAgent

**Files:**
- Modify: `src/hooks/useValentinaAgent.js`

- [ ] **Step 1: Remove 600ms delays from calibration methods**

Delete all `await delay(600)` calls:
- `confirmNameAndAskAge` (line ~168)
- `confirmAgeAndAskEmail` (line ~187)
- `confirmEmailAndAskPhone` (line ~203)
- `confirmPhoneAndAskMood` (line ~218)

Replace with direct sequential `speakAsValentina` calls (no await delay between them).

- [ ] **Step 2: Remove 1500ms delay from announceResults**

Change from `await delay(1500); await speakAsValentina(...)` to just `await speakAsValentina(...)`.

- [ ] **Step 3: Remove unused calibration methods**

If `confirmNameAndAskAge`, `confirmAgeAndAskEmail`, `confirmEmailAndAskPhone`, `confirmPhoneAndAskMood` are no longer called from any component, delete them from the hook.

- [ ] **Step 4: Build check**

Run: `npx vite build 2>&1 | grep -E "error|ERROR"` — expect 0 errors

---

### Task 3.2: Replace html2pdf.js with jsPDF in package.json

**Files:**
- Modify: `package.json`
- Run: `npm install`

- [ ] **Step 1: Install jsPDF**

Run: `npm install jspdf`

- [ ] **Step 2: Verify package.json**

Run: `grep "jspdf" package.json` — should find it in dependencies

---

### Task 3.3: Reduce animations (CSS)

**Files:**
- Modify: `src/components/DiagnosticoVAK/VAKLayout.css`

- [ ] **Step 1: Remove heavy animations**

Delete or comment out:
- Particle/confetti animations that render 20 floating elements
- SVG animated lines (8 SVG lines)
- Shimmer animations that run continuously

Keep only:
- Phase transition animations (fade + translate, 300ms)
- Button hover effects (scale 1.02, 200ms)
- Progress bar transition (width, 500ms)

- [ ] **Step 2: Add `prefers-reduced-motion` support**

```css
@media (prefers-reduced-motion: reduce) {
  .vak-layout *,
  .vak-layout *::before,
  .vak-layout *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

### Phase 4: QA

### Task 4.1: Full flow verification

- [ ] **Step 1: Start dev server**

Run: `npm run dev`

- [ ] **Step 2: Navigate to /vak**

Flow test:
1. [ ] Welcome screen renders with Valeria avatar
2. [ ] Voice toggle works (off by default)
3. [ ] Click "Comenzar" → calibration form appears
4. [ ] Fill form → click "Iniciar Test" → test starts
5. [ ] Questions appear one by one with progress bar
6. [ ] After answer, next question loads (Valeria finishes reading first)
7. [ ] After 3, 6, 9 → encouragement plays (if voice ON)
8. [ ] After last question → results screen with scores
9. [ ] Scores show IC 95%, percentiles, α Cronbach
10. [ ] Click "Ver PDF" → preview screen loads
11. [ ] Click "Descargar PDF" → PDF downloads (< 500ms)
12. [ ] Click "Reintentar" → returns to welcome

- [ ] **Step 3: Verify no console errors**

Open browser console — expect 0 errors

- [ ] **Step 4: Build check**

Run: `npx vite build 2>&1 | tail -5` — expect "built in Xs" with exit 0

---

### Task 4.2: i18n keys verification

- [ ] **Step 1: Verify all UI keys exist in es.json and en.json**

New keys needed (add to both files):
```
vak.ui.valeria_on
vak.ui.valeria_off
vak.ui.valeria_calibration_welcome
vak.ui.valeria_calibration_done
vak.ui.ic_95
vak.ui.percentile
vak.ui.reliability
vak.ui.alpha_excellent
vak.ui.alpha_good
vak.ui.alpha_acceptable
vak.ui.alpha_poor
vak.ui.no_results
vak.ui.your_results
vak.ui.back_results
vak.ui.download_pdf
vak.ui.pdf_preview
vak.ui.pdf_description
```

- [ ] **Step 2: Update i18n files**

Add all keys to `src/i18n/es.json` and `src/i18n/en.json` with proper translations.

---

### Task 4.3: Cleanup old files

- [ ] **Step 1: After verifying new components work, remove old files**

Delete:
```
src/components/DiagnosticoVAK/DiagnosticoVAK.jsx
src/components/DiagnosticoVAK/DiagnosticoVAK.css
src/constants/vakData.js
src/constants/vakData.es.js
src/constants/vakData.en.js
```

- [ ] **Step 2: Final build**

Run: `npx vite build` — expect 0 errors

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: complete VAK diagnostic redesign

- 48-question bank with psychometric metadata
- T-score scoring with 95% confidence intervals
- Cronbach alpha reliability calculation
- Split 2686-line monolith into focused components
- Removed artificial TTS delays (save ~65s)
- Voice off by default with toggle
- Replaced html2pdf.js with direct jsPDF (~450ms)
- Reduced animations, prefers-reduced-motion support
- AERA/APA/NCME standards alignment"
```
