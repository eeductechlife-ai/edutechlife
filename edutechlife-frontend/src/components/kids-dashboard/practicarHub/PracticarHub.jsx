import { memo, useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown } from "lucide-react";
import { useIngenIAKids } from "../../../context/IngenIAKidsContext";
import { buildSubjectList } from "./practicarConfig";
import {
  setHandoff,
  HANDOFF_CHALLENGE_SUBJECT,
  HANDOFF_FLASHCARDS_TOPIC,
  HANDOFF_PRACTICAR_SUBJECT,
  peekHandoff,
  clearHandoff,
} from "./practicarHandoff";
import SubjectPicker from "./SubjectPicker";
import ContentGenerator from "./ContentGenerator";
import DocumentScanner from "./DocumentScanner";
import WeekProgress from "./WeekProgress";
import { usePracticeLog } from "./practicarProgress";
import { isChallengeSubjectAvailable } from "../challengeEngine/useChallengeEngine";

function pickRecommendation(subjects) {
  const retoable = subjects.filter((s) => s.retoAvailable);
  if (!retoable.length) return null;
  const weak = retoable.find((s) => s.weak);
  if (weak) return { subject: weak, why: `${weak.label} necesita refuerzo` };
  const tried = retoable
    .filter((s) => s.lastReto)
    .sort((a, b) => a.lastReto.score - b.lastReto.score);
  if (tried[0]?.lastReto.score < 70) {
    return {
      subject: tried[0],
      why: `En tu último reto sacaste ${tried[0].lastReto.score}%`,
    };
  }
  const untried = retoable.find((s) => !s.lastReto);
  if (untried)
    return {
      subject: untried,
      why: "Aún no has hecho un reto de esta materia",
    };
  const oldest = [...tried].sort((a, b) =>
    a.lastReto.at.localeCompare(b.lastReto.at),
  )[0];
  return { subject: oldest, why: "Hace rato no la practicas" };
}

// Vertical-only scroll inside the dashboard's content pane; scrollIntoView would
// also shift the overflow-hidden root sideways on phones.
function scrollToTop(el) {
  if (!el) return;
  let parent = el.parentElement;
  while (parent && !/(auto|scroll)/.test(getComputedStyle(parent).overflowY)) {
    parent = parent.parentElement;
  }
  if (!parent) return;
  const top =
    parent.scrollTop +
    el.getBoundingClientRect().top -
    parent.getBoundingClientRect().top -
    12;
  parent.scrollTo({ top, behavior: "smooth" });
}

function StepTitle({ n, children, darkMode }) {
  return (
    <h2
      className={`flex items-center gap-2.5 text-sm sm:text-base font-black ${darkMode ? "text-white" : "text-[#1E293B]"}`}
    >
      <span
        className="w-6 h-6 rounded-full bg-[#EF476F] text-white text-xs flex items-center justify-center shrink-0"
        aria-hidden="true"
      >
        {n}
      </span>
      <span className="min-w-0">{children}</span>
    </h2>
  );
}

function ToolButton({
  emoji,
  title,
  desc,
  gradient,
  onClick,
  open,
  expandable,
  darkMode,
}) {
  const surface = darkMode
    ? "bg-[#1E293B] border-[#334155] text-white"
    : "bg-white border-[#E2E8F0] text-[#1E293B]";
  const Arrow = expandable ? ChevronDown : ChevronRight;
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      aria-expanded={expandable ? open : undefined}
      className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 text-left min-h-[72px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9D4EDD] ${surface} ${open ? "border-[#9D4EDD]" : ""}`}
    >
      <span
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-sm"
        style={{ background: gradient }}
        aria-hidden="true"
      >
        {emoji}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold leading-tight">{title}</span>
        <span
          className={`block text-xs mt-0.5 leading-snug ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}
        >
          {desc}
        </span>
      </span>
      <Arrow
        className={`w-5 h-5 shrink-0 opacity-50 transition-transform ${open ? "rotate-180" : ""}`}
        aria-hidden="true"
      />
    </motion.button>
  );
}

const PracticarHub = memo(({ onTabChange, darkMode }) => {
  const { supabaseQueries, subjectsWithGrades, gradeLevel, studentAge } =
    useIngenIAKids();
  const studentData = supabaseQueries?.studentData?.data;
  const studentName = studentData?.name?.split(" ")[0] || "";
  const grade = gradeLevel ?? studentData?.grade_level ?? null;

  const progress = usePracticeLog();
  const subjects = useMemo(
    () =>
      buildSubjectList(subjectsWithGrades).map((s) => ({
        ...s,
        lastReto: s.challengeId
          ? progress.lastRetoByChallenge[s.challengeId]
          : null,
        retoAvailable:
          !!s.challengeId && isChallengeSubjectAvailable(s.challengeId, grade),
      })),
    [subjectsWithGrades, progress.lastRetoByChallenge, grade],
  );
  const recommendation = useMemo(
    () => pickRecommendation(subjects),
    [subjects],
  );
  const weakCount = subjects.filter((s) => s.weak).length;

  const [selectedId, setSelectedId] = useState(() =>
    peekHandoff(HANDOFF_PRACTICAR_SUBJECT),
  );
  useEffect(() => clearHandoff(HANDOFF_PRACTICAR_SUBJECT), []);
  const [activePanel, setActivePanel] = useState(null);
  const stepTwoRef = useRef(null);
  const panelRef = useRef(null);

  const subject =
    subjects.find((s) => s.id === selectedId) || subjects[0] || null;

  useEffect(() => {
    if (activePanel) scrollToTop(panelRef.current);
  }, [activePanel]);

  const selectSubject = useCallback((id) => {
    setSelectedId(id);
    if (window.matchMedia?.("(max-width: 767px)").matches) {
      setTimeout(() => scrollToTop(stepTwoRef.current), 120);
    }
  }, []);

  const togglePanel = (name) =>
    setActivePanel((p) => (p === name ? null : name));

  const openRetos = (target = subject) => {
    if (target?.retoAvailable)
      setHandoff(HANDOFF_CHALLENGE_SUBJECT, target.challengeId);
    onTabChange("retos");
  };
  const openEduCards = () => {
    if (subject) setHandoff(HANDOFF_FLASHCARDS_TOPIC, subject.label);
    onTabChange("flashcards");
  };

  const surface = darkMode
    ? "bg-[#1E293B]/80 border-[#334155]/50"
    : "bg-white/80 border-[#E2E8F0]/60";
  const textPrimary = darkMode ? "text-white" : "text-[#1E293B]";
  const textSub = darkMode ? "text-[#94A3B8]" : "text-[#64748B]";
  const label = subject ? subject.label : "tu materia";

  return (
    <div
      data-typo="intended"
      className="space-y-6 pb-28 md:pb-6 max-w-3xl mx-auto"
    >
      <div
        className={`rounded-2xl border p-4 sm:p-5 backdrop-blur-xl space-y-4 ${surface}`}
      >
        <div>
          <p className={`font-black text-lg sm:text-xl ${textPrimary}`}>
            {studentName
              ? `¡Hola, ${studentName}! 👋`
              : "¡Hora de practicar! 👋"}
          </p>
          <p className={`text-sm mt-0.5 leading-snug ${textSub}`}>
            {weakCount > 0
              ? `Tienes ${weakCount} ${weakCount === 1 ? "materia" : "materias"} por reforzar.`
              : "Practica un poquito cada día y verás cómo mejoras."}
          </p>
        </div>
        <WeekProgress progress={progress} darkMode={darkMode} />
      </div>

      {recommendation && (
        <motion.button
          type="button"
          onClick={() => openRetos(recommendation.subject)}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 p-4 rounded-2xl text-left text-white shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-[#9D4EDD]/40"
          style={{
            background: `linear-gradient(135deg, ${recommendation.subject.color} 0%, #9D4EDD 100%)`,
          }}
        >
          <span
            className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl shrink-0"
            aria-hidden="true"
          >
            {recommendation.subject.emoji}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-black uppercase tracking-wider text-white/80">
              Recomendado para ti
            </span>
            <span className="block text-lg font-black leading-tight">
              Reto de {recommendation.subject.label}
            </span>
            <span className="block text-xs text-white/85 mt-0.5">
              {recommendation.why}
            </span>
          </span>
          <span
            className="w-11 h-11 rounded-full bg-white text-[#1E293B] flex items-center justify-center text-lg font-black shrink-0"
            aria-hidden="true"
          >
            ▶
          </span>
        </motion.button>
      )}

      <section className="space-y-3" aria-labelledby="practicar-step-1">
        <div id="practicar-step-1">
          <StepTitle n={1} darkMode={darkMode}>
            {recommendation
              ? "O elige tú la materia"
              : "¿Qué materia quieres practicar?"}
          </StepTitle>
        </div>
        {subjects.length ? (
          <SubjectPicker
            subjects={subjects}
            selectedId={subject?.id}
            onSelect={selectSubject}
            darkMode={darkMode}
          />
        ) : (
          <p className={`text-sm ${textSub}`}>
            Aún no tienes materias. Escanea tu boletín en Aprender para verlas
            aquí.
          </p>
        )}
      </section>

      <section
        ref={stepTwoRef}
        className="space-y-3"
        aria-labelledby="practicar-step-2"
      >
        <div id="practicar-step-2">
          <StepTitle n={2} darkMode={darkMode}>
            ¿Cómo quieres practicar{" "}
            <span style={{ color: subject?.color }}>
              {subject ? `${subject.emoji} ${label}` : label}
            </span>
            ?
          </StepTitle>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <ToolButton
            emoji="🎮"
            title="Retos Inteligentes"
            desc={
              subject?.retoAvailable
                ? `Responde preguntas de ${label} y gana puntos.`
                : "Responde preguntas de tu grado y gana puntos."
            }
            gradient="linear-gradient(135deg, #EF476F 0%, #FF8FA3 100%)"
            onClick={() => openRetos()}
            darkMode={darkMode}
          />
          <ToolButton
            emoji="🃏"
            title="EduCards"
            desc={`Tarjetas para aprender ${label} jugando.`}
            gradient="linear-gradient(135deg, #06D6A0 0%, #118AB2 100%)"
            onClick={openEduCards}
            darkMode={darkMode}
          />
          <ToolButton
            emoji="✨"
            title="Crear material"
            desc="La IA te explica el tema, con ejercicios y videos."
            gradient="linear-gradient(135deg, #7B2FF7 0%, #C77DFF 100%)"
            onClick={() => togglePanel("generator")}
            open={activePanel === "generator"}
            expandable
            darkMode={darkMode}
          />
          <ToolButton
            emoji="📷"
            title="Escanear mi apunte"
            desc="Toma una foto de tu cuaderno y te lo explico."
            gradient="linear-gradient(135deg, #FB8500 0%, #FFD166 100%)"
            onClick={() => togglePanel("scanner")}
            open={activePanel === "scanner"}
            expandable
            darkMode={darkMode}
          />
        </div>
      </section>

      <div ref={panelRef} className="scroll-mt-4">
        <AnimatePresence mode="wait" initial={false}>
          {activePanel === "generator" && subject && (
            <motion.div
              key="generator"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <ContentGenerator
                key={subject.id}
                subject={subject}
                grade={grade}
                age={studentAge}
                onTabChange={onTabChange}
                onClose={() => setActivePanel(null)}
                darkMode={darkMode}
              />
            </motion.div>
          )}
          {activePanel === "scanner" && (
            <motion.div
              key="scanner"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <DocumentScanner
                grade={grade}
                subjectLabel={subject?.label}
                onClose={() => setActivePanel(null)}
                darkMode={darkMode}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className={`text-xs text-center leading-relaxed px-2 ${textSub}`}>
        💡 Practicar 15 minutos al día rinde más que estudiar 2 horas antes del
        examen.
      </p>
    </div>
  );
});

PracticarHub.displayName = "PracticarHub";
export default PracticarHub;
