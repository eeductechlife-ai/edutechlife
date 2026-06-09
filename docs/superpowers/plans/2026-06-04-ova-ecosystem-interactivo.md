# OVA Ecosystem Guide — Mejora Interactiva

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform "Explora el Ecosistema ChatGPT" OVA de informativo a interactivo con timeline animada, juego de herramientas, quiz expandido, flip cards, Framer Motion, confetti y XP tracking.

**Architecture:** Extraer componentes interactivos a archivos separados en `OVAEcosystemGuide/`, mantener datos en `ecosystemGuide.*.js`, agregar Framer Motion para transiciones y micro-interacciones, y animaciones de celebración con confetti + XP.

**Tech Stack:** React, Framer Motion, canvas-confetti, Tailwind CSS, Lucide icons

---

## File Structure

### Modify:
- `src/components/IALab/OVAEcosystemGuide.jsx` — main component (refactor + Framer Motion + confetti + XP)
- `src/data/ova/ecosystemGuide.es.js` — add expanded quiz data (5 questions + feedback per option + timeline data)
- `src/data/ova/ecosystemGuide.en.js` — same additions in English

### Create:
- `src/components/IALab/OVAEcosystemGuide/EvolutionTimeline.jsx` — animated timeline for m1
- `src/components/IALab/OVAEcosystemGuide/ToolsMatchup.jsx` — matching game for m3
- `src/components/IALab/OVAEcosystemGuide/ExpandedQuiz.jsx` — 5-question quiz with feedback for m6
- `src/components/IALab/OVAEcosystemGuide/XPTracker.jsx` — XP progress bar (reusable within OVA)

### No changes needed:
- `src/data/ova/ecosystemGuide.js` — locale selector stays the same

---

### Task 1: Create XPTracker component

**Files:**
- Create: `src/components/IALab/OVAEcosystemGuide/XPTracker.jsx`

- [ ] **Step 1: Create file**

```jsx
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useTranslation } from '../../../i18n/I18nProvider';

export default function XPTracker({ xp, maxXp }) {
  const { t } = useTranslation();
  const pct = Math.min((xp / maxXp) * 100, 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-petroleum to-corporate rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        />
      </div>
      <div className="flex items-center gap-1 text-[10px] font-black text-petroleum uppercase tracking-wider shrink-0">
        <Sparkles className="w-3 h-3 text-corporate" />
        <span>{xp}/{maxXp} XP</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify file created**

Run: `ls -la src/components/IALab/OVAEcosystemGuide/XPTracker.jsx`
Expected: file exists

---

### Task 2: Create EvolutionTimeline component

**Files:**
- Create: `src/components/IALab/OVAEcosystemGuide/EvolutionTimeline.jsx`

- [ ] **Step 1: Create component**

```jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../../i18n/I18nProvider';
import { ChevronDown, Lightbulb } from 'lucide-react';

export default function EvolutionTimeline({ items }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = expanded === i;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12, type: 'spring', stiffness: 200, damping: 25 }}
            className="relative pl-8"
          >
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-petroleum to-corporate rounded-full" />
            <div className={`absolute left-[-5px] top-2 w-3 h-3 rounded-full border-2 border-white z-10 ${isOpen ? 'bg-corporate' : 'bg-petroleum'}`} />
            <button
              onClick={() => setExpanded(isOpen ? null : i)}
              className="w-full text-left"
            >
              <div className={`bg-white dark:bg-slate-800 rounded-xl border-2 transition-all p-4 ${isOpen ? 'border-corporate shadow-md' : 'border-slate-100 dark:border-slate-700 hover:border-slate-200'}`}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h5 className="font-[900] text-petroleum text-xs uppercase">{item.title}</h5>
                      {item.date && (
                        <span className="text-[10px] font-black text-corporate bg-corporate/10 px-2 py-0.5 rounded-md">{item.date}</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-300 mt-0.5 leading-relaxed">{item.text}</p>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-4 h-4 text-slate-300 dark:text-slate-500 shrink-0" />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-700">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic flex gap-2">
                          <Lightbulb size={16} className="text-amber-500 shrink-0 mt-0.5" />
                          <span>{item.extendedText}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Verify file created**

Run: `ls -la src/components/IALab/OVAEcosystemGuide/EvolutionTimeline.jsx`
Expected: file exists

---

### Task 3: Create ToolsMatchup component

**Files:**
- Create: `src/components/IALab/OVAEcosystemGuide/ToolsMatchup.jsx`

- [ ] **Step 1: Create component**

```jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../../i18n/I18nProvider';
import { Search, Layout, Database, CheckCircle2, ArrowRightCircle } from 'lucide-react';

const toolIconMap = { Search, Layout, Database };

export default function ToolsMatchup({ items }) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(null);
  const [matches, setMatches] = useState({});
  const [wrong, setWrong] = useState(null);

  const shuffledDescs = [...items].sort(() => Math.random() - 0.5).map((item, i) => ({ ...item, sortKey: i }));

  const handleToolClick = (idx) => {
    if (matches[items[idx].title]) return;
    setSelected(idx);
  };

  const handleDescClick = (descItem) => {
    if (!selected) return;
    if (matches[descItem.title]) return;

    const tool = items[selected];
    if (tool.title === descItem.title) {
      setMatches(prev => ({ ...prev, [tool.title]: true }));
      setWrong(null);
      setSelected(null);
    } else {
      setWrong(descItem.sortKey);
      setTimeout(() => setWrong(null), 600);
    }
  };

  const allMatched = Object.keys(matches).length === items.length;

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500 dark:text-slate-300 font-bold">{t('ova.ecosystem.matchup_hint')}</p>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <h6 className="text-[10px] font-black text-petroleum uppercase tracking-wider text-center">{t('ova.ecosystem.matchup_tools')}</h6>
          {items.map((item, i) => {
            const Icon = toolIconMap[item.icon] || null;
            const matched = matches[item.title];
            return (
              <motion.button
                key={i}
                onClick={() => handleToolClick(i)}
                whileHover={!matched ? { scale: 1.02 } : {}}
                whileTap={!matched ? { scale: 0.98 } : {}}
                className={`w-full p-3 rounded-xl border-2 text-left transition-all flex items-center gap-2 ${matched ? 'bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-700' : selected === i ? 'bg-blue-50 border-corporate' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-corporate/50'}`}
              >
                {matched ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                ) : Icon ? (
                  <Icon className="w-4 h-4 text-petroleum shrink-0" />
                ) : null}
                <span className="text-xs font-bold text-petroleum">{item.title}</span>
              </motion.button>
            );
          })}
        </div>

        <div className="space-y-2">
          <h6 className="text-[10px] font-black text-petroleum uppercase tracking-wider text-center">{t('ova.ecosystem.matchup_descs')}</h6>
          {shuffledDescs.map((item) => {
            const matched = matches[item.title];
            const isWrong = wrong === item.sortKey;
            return (
              <motion.button
                key={item.sortKey}
                onClick={() => handleDescClick(item)}
                disabled={matched}
                whileHover={!matched ? { scale: 1.02 } : {}}
                whileTap={!matched ? { scale: 0.98 } : {}}
                animate={isWrong ? { x: [0, -4, 4, -4, 4, 0] } : {}}
                transition={isWrong ? { duration: 0.4 } : {}}
                className={`w-full p-3 rounded-xl border-2 text-left transition-all ${matched ? 'bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-700 opacity-50' : isWrong ? 'bg-red-50 border-red-300' : selected !== null ? 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-corporate/50 cursor-pointer' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700'}`}
              >
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{item.text}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {allMatched && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700 text-center"
          >
            <h5 className="font-[900] text-green-700 text-sm uppercase tracking-wider">{t('ova.ecosystem.matchup_complete')}</h5>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: Verify file created**

Run: `ls -la src/components/IALab/OVAEcosystemGuide/ToolsMatchup.jsx`
Expected: file exists

---

### Task 4: Create ExpandedQuiz component

**Files:**
- Create: `src/components/IALab/OVAEcosystemGuide/ExpandedQuiz.jsx`

- [ ] **Step 1: Create component**

```jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../../i18n/I18nProvider';
import { HelpCircle, Users, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';

export default function ExpandedQuiz({ questions }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const getScore = () => {
    const r = answers.reduce((sum, a) => sum + a.score, 0);
    if (r <= 5) return 'beginner';
    if (r <= 8) return 'explorer';
    if (r <= 11) return 'creator';
    return 'pro';
  };

  const handleAnswer = (option) => {
    if (showFeedback) return;
    setSelectedAnswer(option);
    setShowFeedback(true);
  };

  const handleNext = () => {
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    setSelectedAnswer(null);
    setShowFeedback(false);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setResult(getScore());
    }
  };

  const restart = () => {
    setStep(0);
    setAnswers([]);
    setResult(null);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-16 h-16 bg-gradient-to-br from-corporate to-petroleum rounded-full flex items-center justify-center mx-auto shadow-lg"
        >
          <Users className="w-8 h-8 text-white" />
        </motion.div>
        <h4 className="font-[900] text-petroleum text-xl tracking-tighter lowercase">
          {t(`ova.ecosystem.quiz_result_${result}_title`)}
        </h4>
        <div className="p-4 bg-gradient-to-br from-corporate/5 to-white rounded-xl border border-corporate/20">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {t(`ova.ecosystem.quiz_result_${result}`)}
          </p>
        </div>
        <motion.button
          onClick={restart}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-700 text-petroleum font-black rounded-xl text-xs uppercase tracking-wider hover:bg-slate-200 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          {t('ova.ecosystem.quiz_restart')}
        </motion.button>
      </motion.div>
    );
  }

  const q = questions[step];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <HelpCircle className="w-4 h-4 text-corporate" />
        <span className="text-[10px] font-black text-petroleum uppercase tracking-wider">{t('ova.ecosystem.quiz_desc')}</span>
        <span className="ml-auto text-[10px] font-black text-slate-400">{step + 1}/{questions.length}</span>
      </div>

      <div className="flex gap-1.5">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === step ? 'w-8 bg-petroleum' : i < step ? 'w-2 bg-corporate' : 'w-2 bg-slate-200 dark:bg-slate-600'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <h4 className="font-[900] text-petroleum text-base leading-tight mb-3">{q.question}</h4>
          <div className="space-y-2">
            {q.options.map((opt, i) => {
              const isSelected = selectedAnswer === opt;
              const isCorrect = showFeedback && opt.score >= 2;
              const isWrong = showFeedback && isSelected && opt.score < 2;
              return (
                <motion.button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  whileHover={!showFeedback ? { scale: 1.01 } : {}}
                  whileTap={!showFeedback ? { scale: 0.99 } : {}}
                  disabled={showFeedback}
                  className={`w-full p-4 rounded-xl border-2 text-left text-xs font-medium transition-all flex items-start gap-3 ${
                    isWrong
                      ? 'bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-700'
                      : isCorrect
                        ? 'bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-700'
                        : isSelected
                          ? 'bg-blue-50 border-corporate'
                          : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-corporate'
                  }`}
                >
                  {showFeedback && (
                    <span className="mt-0.5">
                      {isCorrect ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : isWrong ? <XCircle className="w-4 h-4 text-red-500" /> : null}
                    </span>
                  )}
                  <div className="flex-1">
                    <span className="text-slate-600 dark:text-slate-300">{opt.text}</span>
                    {showFeedback && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className={`text-xs mt-2 leading-relaxed ${isCorrect ? 'text-green-700 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}
                      >
                        {opt.feedback}
                      </motion.p>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showFeedback && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={handleNext}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-gradient-to-r from-petroleum to-corporate text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-lg"
          >
            {step < questions.length - 1 ? t('ova.ecosystem.quiz_next') : t('ova.ecosystem.quiz_see_results')}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: Verify file created**

Run: `ls -la src/components/IALab/OVAEcosystemGuide/ExpandedQuiz.jsx`
Expected: file exists

---

### Task 5: Add quiz data to data files

**Files:**
- Modify: `src/data/ova/ecosystemGuide.es.js`
- Modify: `src/data/ova/ecosystemGuide.en.js`

- [ ] **Step 1: Add quiz section to spanish data file**

Add to `ecosystemGuide.es.js`, after the `sections` array:

```javascript
  quiz: {
    questions: [
      {
        question: "¿Cuál es la principal ventaja del Modo Thinking de ChatGPT?",
        options: [
          { text: "Respuestas más rápidas que el modo normal", score: 1, feedback: "El modo Thinking prioriza profundidad, no velocidad. Está diseñado para ser más lento pero más riguroso." },
          { text: "Análisis detallados y razonamiento paso a paso antes de responder", score: 3, feedback: "¡Correcto! Thinking invierte tiempo en razonar antes de responder, ideal para tareas complejas." },
          { text: "Consume menos recursos del servidor", score: 1, feedback: "En realidad consume más recursos porque realiza un procesamiento más profundo antes de responder." }
        ]
      },
      {
        question: "¿Qué función cumple Canvas en ChatGPT?",
        options: [
          { text: "Genera imágenes a partir de texto", score: 1, feedback: "Eso lo hace DALL-E, no Canvas. Canvas es un editor colaborativo de texto y código." },
          { text: "Permite editar documentos de forma colaborativa en una ventana lateral", score: 3, feedback: "¡Exacto! Canvas abre un documento lateral donde puedes editar y la IA revisa cambios en tiempo real." },
          { text: "Conecta ChatGPT con redes sociales", score: 1, feedback: "No, Canvas no tiene nada que ver con redes sociales. Es un espacio de trabajo colaborativo." }
        ]
      },
      {
        question: "¿Cómo se beneficiaría un docente al usar la función de Proyectos en ChatGPT?",
        options: [
          { text: "Puede subir el plan de estudios y guías del curso para que la IA recuerde el contexto", score: 3, feedback: "¡Correcto! Los Proyectos permiten cargar documentos de referencia que la IA usará en todos los chats." },
          { text: "Crea exámenes automáticamente sin revisión", score: 1, feedback: "La IA puede ayudar a crear exámenes, pero siempre requieren revisión humana para garantizar precisión." },
          { text: "Reemplaza al docente en sesiones en vivo", score: 1, feedback: "ChatGPT es una herramienta de apoyo, no un reemplazo. El criterio y experiencia del docente son irremplazables." }
        ]
      },
      {
        question: "¿Qué diferencia principal hay entre Zapier y Make (Integromat)?",
        options: [
          { text: "Make permite flujos más complejos con bifurcaciones lógicas avanzadas", score: 3, feedback: "¡Correcto! Make ofrece bifurcaciones lógicas (if/else) y transformaciones de datos más potentes que Zapier." },
          { text: "Zapier es más caro que Make", score: 1, feedback: "No necesariamente. Ambos tienen modelos de precios diferentes. Make ofrece 1,000 operaciones gratis al mes." },
          { text: "Make solo funciona con Google Workspace", score: 1, feedback: "Make se integra con cientos de aplicaciones, no solo Google Workspace." }
        ]
      },
      {
        question: "¿Cuál es la forma más eficiente de comenzar a usar IA generativa en el aula?",
        options: [
          { text: "Implementar la IA en todas las áreas de una vez", score: 1, feedback: "Implementar todo a la vez puede ser abrumador. Es mejor comenzar con un área específica." },
          { text: "Comenzar con una tarea específica (resumir, crear material) e ir expandiendo", score: 3, feedback: "¡Exacto! La mejor estrategia es comenzar con una tarea concreta, dominarla, y luego expandir gradualmente." },
          { text: "Esperar a que la tecnología madure antes de usarla", score: 1, feedback: "La IA ya está lo suficientemente madura para muchas tareas educativas. Comenzar ahora permite aprender progresivamente." }
        ]
      }
    ]
  }
```

- [ ] **Step 2: Add quiz section to english data file**

Same quiz structure but in English in `ecosystemGuide.en.js`:

```javascript
  quiz: {
    questions: [
      {
        question: "What is the main advantage of ChatGPT's Thinking Mode?",
        options: [
          { text: "Faster responses than normal mode", score: 1, feedback: "Thinking Mode prioritizes depth, not speed. It's designed to be slower but more rigorous." },
          { text: "Detailed analysis and step-by-step reasoning before responding", score: 3, feedback: "Correct! Thinking Mode invests time in reasoning before answering, ideal for complex tasks." },
          { text: "Consumes fewer server resources", score: 1, feedback: "It actually consumes more resources because it performs deeper processing before responding." }
        ]
      },
      {
        question: "What is the function of Canvas in ChatGPT?",
        options: [
          { text: "Generates images from text", score: 1, feedback: "That's DALL-E's job, not Canvas. Canvas is a collaborative text and code editor." },
          { text: "Allows collaborative document editing in a side panel", score: 3, feedback: "Exactly! Canvas opens a side document where you can edit and AI reviews changes in real time." },
          { text: "Connects ChatGPT to social networks", score: 1, feedback: "No, Canvas has nothing to do with social networks. It's a collaborative workspace." }
        ]
      },
      {
        question: "How would a teacher benefit from using ChatGPT's Projects feature?",
        options: [
          { text: "Upload the curriculum and course guides so the AI remembers the context", score: 3, feedback: "Correct! Projects let you upload reference documents that the AI will use across all chats." },
          { text: "Creates exams automatically without review", score: 1, feedback: "AI can help create exams, but they always require human review to ensure accuracy." },
          { text: "Replaces the teacher in live sessions", score: 1, feedback: "ChatGPT is a support tool, not a replacement. The teacher's expertise is irreplaceable." }
        ]
      },
      {
        question: "What is the main difference between Zapier and Make (Integromat)?",
        options: [
          { text: "Make allows more complex flows with advanced logical branching", score: 3, feedback: "Correct! Make offers logical branching (if/else) and more powerful data transformations than Zapier." },
          { text: "Zapier is more expensive than Make", score: 1, feedback: "Not necessarily. Both have different pricing models. Make offers 1,000 free operations per month." },
          { text: "Make only works with Google Workspace", score: 1, feedback: "Make integrates with hundreds of apps, not just Google Workspace." }
        ]
      },
      {
        question: "What is the most efficient way to start using generative AI in the classroom?",
        options: [
          { text: "Implement AI in all areas at once", score: 1, feedback: "Implementing everything at once can be overwhelming. Better to start with one specific area." },
          { text: "Start with one specific task (summarize, create material) and expand gradually", score: 3, feedback: "Exactly! The best strategy is to start with one concrete task, master it, then gradually expand." },
          { text: "Wait for the technology to mature before using it", score: 1, feedback: "AI is already mature enough for many educational tasks. Starting now allows progressive learning." }
        ]
      }
    ]
  }
```

- [ ] **Step 3: Verify exports**

Ensure both files export `{ infographicData }` (quiz is nested inside `infographicData`).

Run: `grep "export const infographicData" src/data/ova/ecosystemGuide.es.js src/data/ova/ecosystemGuide.en.js`
Expected: both files export it

---

### Task 6: Refactor main OVAEcosystemGuide component

**Files:**
- Modify: `src/components/IALab/OVAEcosystemGuide.jsx`

This task:
- Extracts SectionScreen-based screens (m1-m4) into new interactive components
- Adds Framer Motion `AnimatePresence` for screen transitions
- Adds glassmorphism polish to remaining DetailCards
- Integrates XPTracker
- Adds confetti on completion
- Adds XP earning logic

- [ ] **Step 1: Replace imports**

Replace current imports at top of file:

```jsx
import React, { useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../i18n/I18nProvider';
import {
  BrainCircuit, ChevronRight, ChevronLeft,
  ArrowRightCircle, Star, Sparkles, CheckCircle2, Menu, MousePointer2,
  Lightbulb, Target, Globe, Zap, Settings, MessageSquare,
  TrendingUp, Cpu, Wrench, Share2, Search, Layout, Database,
  Bot, Volume2, Image, FileText, Link, HelpCircle, Rocket,
  ChevronDown, Users, Play, Briefcase, Trophy
} from 'lucide-react';
import { stopSpeech } from '../../utils/speech';
import { OVAIntro } from './shared';
import VoiceReader from './VoiceReader';
import { infographicData } from '../../data/ova/ecosystemGuide';
import EvolutionTimeline from './OVAEcosystemGuide/EvolutionTimeline';
import ToolsMatchup from './OVAEcosystemGuide/ToolsMatchup';
import ExpandedQuiz from './OVAEcosystemGuide/ExpandedQuiz';
import XPTracker from './OVAEcosystemGuide/XPTracker';
```

- [ ] **Step 2: Add screen transition variants + confetti import**

Add before `Logo` definition:

```jsx
const screenVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 25 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.15 } },
};

const XP_PER_SCREEN = 15;
const QUIZ_XP_BONUS = 25;
const MAX_XP = 145;

function getXpForCompleted(completed) {
  return completed.length * XP_PER_SCREEN;
}
```

- [ ] **Step 3: Add confetti + XP state to main component**

Replace the state initialization section:

```jsx
export default function OVAEcosystemGuide({ onComplete }) {
  const { t, locale } = useTranslation();
  const [screen, setScreen] = useState('welcome');
  const [completed, setCompleted] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [xp, setXp] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const certCompletedRef = useRef(false);
  const nav = ['welcome', 'm1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8'];
  const curIdx = nav.indexOf(screen);
```

- [ ] **Step 4: Wrap renderContent with AnimatePresence + motion.div**

Replace the renderContent() call inside the main JSX.

Replace:

```jsx
<div className="relative z-10 min-h-[180px] flex flex-col justify-center">{renderContent()}</div>
```

With:

```jsx
<div className="relative z-10 min-h-[180px] flex flex-col justify-center">
  <AnimatePresence mode="wait">
    <motion.div
      key={screen}
      variants={screenVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {renderContent()}
    </motion.div>
  </AnimatePresence>
</div>
```

- [ ] **Step 5: Replace m1-m4 render cases with new components**

Replace the `case 'm1'` through `case 'm4'` blocks:

```jsx
case 'm1': return (
  <>
    <EvolutionTimeline items={sections[0].details} />
    <div className="flex justify-center mt-6">
      <VoiceReader text={sections[0].content} />
    </div>
  </>
);
case 'm2': return (
  <>
    <SectionScreen section={sections[1]} />
    <div className="flex justify-center mt-6">
      <VoiceReader text={sections[1].content} />
    </div>
  </>
);
case 'm3': return (
  <>
    <ToolsMatchup items={sections[2].details} />
    <div className="flex justify-center mt-6">
      <VoiceReader text={sections[2].content} />
    </div>
  </>
);
case 'm4': return (
  <>
    <SectionScreen section={sections[3]} />
    <div className="flex justify-center mt-6">
      <VoiceReader text={sections[3].content} />
    </div>
  </>
);
```

- [ ] **Step 6: Replace m6 quiz case with ExpandedQuiz**

Replace `case 'm6'`:

```jsx
case 'm6': return (
  <>
    <ExpandedQuiz questions={infographicData.quiz?.questions || []} />
    <div className="flex justify-center mt-6">
      <VoiceReader text={t('ova.ecosystem.quiz_voice')} />
    </div>
  </>
);
```

- [ ] **Step 7: Make nextScreen earn XP when screen completed**

Update the `nextScreen` function:

```jsx
const nextScreen = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (screen === 'welcome') { setScreen('m1'); return; }
  if (!completed.includes(screen)) {
    const newCompleted = [...completed, screen];
    setCompleted(newCompleted);
    if (screen !== 'm6') {
      setXp(prev => prev + XP_PER_SCREEN);
    }
  }
  const next = nav.indexOf(screen) + 1;
  if (next < nav.length) setScreen(nav[next]);
};
```

- [ ] **Step 8: Add XP bonus for quiz completion in handleMarkComplete**

Update `handleMarkComplete`:

```jsx
const handleMarkComplete = async () => {
  if (!certCompletedRef.current) {
    certCompletedRef.current = true;
    if (!completed.includes('m6')) {
      setXp(prev => prev + XP_PER_SCREEN + QUIZ_XP_BONUS);
    } else {
      setXp(prev => prev + QUIZ_XP_BONUS);
    }
    setShowConfetti(true);
    onComplete?.();
  }
};
```

- [ ] **Step 9: Add confetti useEffect**

Add after the state definitions:

```jsx
useEffect(() => {
  if (showConfetti) {
    import('canvas-confetti').then(({ default: confetti }) => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#004B63', '#00BCD4', '#10B981', '#F59E0B'],
      });
    });
  }
}, [showConfetti]);
```

- [ ] **Step 10: Add XPTracker to the header**

Replace the header progress badge:

```jsx
{screen !== 'welcome' && (
  <div className="w-32">
    <XPTracker xp={xp} maxXp={MAX_XP} />
  </div>
)}
```

- [ ] **Step 11: Add glassmorphism to DetailCard**

Update the `DetailCard` component's container div styling. Replace the current card's container class with a more polished glassmorphism look:

Find the DetailCard's main div:

```jsx
<div className={`bg-white dark:bg-slate-800 rounded-xl border-2 transition-all ${isExpanded ? 'border-corporate' : 'border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600'}`}>
```

Replace with glassmorphism version + rounded corners:

```jsx
<div className={`bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl border transition-all shadow-sm ${isExpanded ? 'border-corporate/40 shadow-md' : 'border-slate-100 dark:border-slate-700 hover:border-corporate/30 hover:shadow-md'}`}>
```

- [ ] **Step 12: Verify the file is under 500 lines**

Run: `wc -l src/components/IALab/OVAEcosystemGuide.jsx`
Expected: under 500 lines

---

### Task 7: i18n keys for new quiz + matchup UI

**Files:**
- Modify: `src/i18n/es.json` (add new keys)
- Modify: `src/i18n/en.json` (add new keys)

- [ ] **Step 1: Add to es.json**

Find the `ova.ecosystem` section and add after existing keys:

```json
    "ova.ecosystem.matchup_hint": "Haz clic en un herramienta de la izquierda, luego en su descripción a la derecha",
    "ova.ecosystem.matchup_tools": "Herramientas",
    "ova.ecosystem.matchup_descs": "Descripciones",
    "ova.ecosystem.matchup_complete": "¡Has emparejado todas las herramientas!",
    "ova.ecosystem.quiz_next": "Siguiente Pregunta",
    "ova.ecosystem.quiz_see_results": "Ver Resultados",
    "ova.ecosystem.quiz_result_explorer_title": "Explorador Curioso",
    "ova.ecosystem.quiz_result_explorer": "Tienes conocimientos básicos del ecosistema. Sigue explorando los módulos para profundizar tu comprensión.",
```

- [ ] **Step 2: Add to en.json**

Same keys in English:

```json
    "ova.ecosystem.matchup_hint": "Click a tool on the left, then match it to its description on the right",
    "ova.ecosystem.matchup_tools": "Tools",
    "ova.ecosystem.matchup_descs": "Descriptions",
    "ova.ecosystem.matchup_complete": "You matched all the tools!",
    "ova.ecosystem.quiz_next": "Next Question",
    "ova.ecosystem.quiz_see_results": "See Results",
    "ova.ecosystem.quiz_result_explorer_title": "Curious Explorer",
    "ova.ecosystem.quiz_result_explorer": "You have basic knowledge of the ecosystem. Keep exploring the modules to deepen your understanding.",
```

---

### Task 8: Build and verify

- [ ] **Step 1: Run build**

```bash
npx vite build 2>&1 | tail -20
```

Expected: no errors, build completes successfully

- [ ] **Step 2: Check file sizes**

```bash
wc -l src/components/IALab/OVAEcosystemGuide.jsx src/components/IALab/OVAEcosystemGuide/*.jsx
```

Expected: each file under 500 lines
