import { memo, useState, useMemo, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown } from "lucide-react";
import { useIngenIAKids } from "../../../context/IngenIAKidsContext";
import { buildSubjectList } from "./practicarConfig";
import {
  setHandoff,
  HANDOFF_CHALLENGE_SUBJECT,
  HANDOFF_CHALLENGE_DIFFICULTY,
  HANDOFF_CHALLENGE_AUTOSTART,
  HANDOFF_FLASHCARDS_TOPIC,
  HANDOFF_PRACTICAR_SUBJECT,
  HANDOFF_PLAN_ACTIVITY,
  HANDOFF_PLAN_PENDING,
  peekHandoff,
  clearHandoff,
} from "./practicarHandoff";
import { subjectIdFor } from "../improvementPlan/planActivity";
import { markStoredActivityDone } from "../improvementPlan/useImprovementPlan";
import SubjectPicker from "./SubjectPicker";
import ContentGenerator from "./ContentGenerator";
import DocumentScanner from "./DocumentScanner";
import WeekProgress from "./WeekProgress";
import { usePracticeLog } from "./practicarProgress";
import { useMediaQuery, PHONE_QUERY } from "./useMediaQuery";
import { isChallengeSubjectAvailable } from "../challengeEngine/useChallengeEngine";

function pickRecommendation(subjects) {
  const retoable = subjects.filter((s) => s.retoAvailable);
  if (!retoable.length) return null;

  // Highest priority: declining + low grade
  const declining = retoable.find(
    (s) => s.trend?.dir === "down" && s.score != null && s.score < 3.5,
  );
  if (declining)
    return {
      subject: declining,
      why: `Nota bajando (${declining.score.toFixed(1)}) — ¡practiquemos hoy!`,
      urgent: true,
    };

  const weak = retoable.find((s) => s.weak);
  if (weak)
    return {
      subject: weak,
      why: `${weak.label} necesita refuerzo`,
      urgent: false,
    };
  const tried = retoable
    .filter((s) => s.lastReto)
    .sort((a, b) => a.lastReto.score - b.lastReto.score);
  if (tried[0]?.lastReto.score < 70) {
    return {
      subject: tried[0],
      why: `En tu último reto sacaste ${tried[0].lastReto.score}%`,
      urgent: false,
    };
  }
  const untried = retoable.find((s) => !s.lastReto);
  if (untried)
    return {
      subject: untried,
      why: "Aún no has hecho un reto de esta materia",
      urgent: false,
    };
  const oldest = [...tried].sort((a, b) =>
    a.lastReto.at.localeCompare(b.lastReto.at),
  )[0];
  return { subject: oldest, why: "Hace rato no la practicas", urgent: false };
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
  // Phones: a square tile (2×2 grid, no scrolling past four long rows).
  // Wider screens: the icon-left row with its arrow.
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      aria-expanded={expandable ? open : undefined}
      className={`w-full !flex flex-col sm:flex-row !items-start sm:!items-center !justify-start gap-2 sm:gap-3 p-3 rounded-2xl border-2 text-left min-h-[112px] sm:min-h-[72px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9D4EDD] ${surface} ${open ? "border-[#9D4EDD]" : ""}`}
    >
      <span
        className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-sm"
        style={{ background: gradient }}
        aria-hidden="true"
      >
        {emoji}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold leading-tight">{title}</span>
        <span
          className={`block text-[11px] sm:text-xs mt-0.5 leading-snug ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}
        >
          {desc}
        </span>
      </span>
      <Arrow
        className={`hidden sm:block w-5 h-5 shrink-0 opacity-50 transition-transform ${open ? "rotate-180" : ""}`}
        aria-hidden="true"
      />
    </motion.button>
  );
}

// A tool opens on top of Practicar (full screen on phones, a window on wider
// screens) with its own scroll and a fixed "Volver", so the Practicar page
// never grows under it.
function PanelHost({ phone, darkMode, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const bg = darkMode ? "bg-[#1E293B]" : "bg-white";
  if (!phone)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        data-typo="intended"
        className="fixed inset-0 z-[52] bg-[#0F172A]/50 backdrop-blur-sm flex items-center justify-center p-6"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8 }}
          className={`w-full max-w-2xl max-h-[88dvh] overflow-y-auto overscroll-contain rounded-3xl shadow-2xl ${bg}`}
        >
          {children}
        </motion.div>
      </motion.div>
    );
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      data-typo="intended"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "tween", ease: "easeOut", duration: 0.25 }}
      // `!`: a11y.css gives every [role="dialog"] position:relative + z-index:1000,
      // which would hide Dani (z 55) when a kid asks her from here.
      className={`!fixed inset-0 !z-[52] overflow-y-auto overscroll-contain ${bg}`}
      style={{
        paddingTop: "env(safe-area-inset-top, 0px)",
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 24px)",
      }}
    >
      {children}
    </motion.div>
  );
}

const PracticarHub = memo(({ onTabChange, darkMode }) => {
  const {
    supabaseQueries,
    subjectsWithGrades,
    gradeLevel,
    studentAge,
    userId,
  } = useIngenIAKids();
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

  // A task from "Mi Plan" (▶ Hazla ahora): {tool, type, topic, subjectId, planRef}.
  const [planTask, setPlanTask] = useState(() => {
    try {
      return JSON.parse(peekHandoff(HANDOFF_PLAN_ACTIVITY) || "null");
    } catch {
      return null;
    }
  });
  const [selectedId, setSelectedId] = useState(() =>
    peekHandoff(HANDOFF_PRACTICAR_SUBJECT),
  );
  useEffect(() => {
    clearHandoff(HANDOFF_PRACTICAR_SUBJECT);
    clearHandoff(HANDOFF_PLAN_ACTIVITY);
  }, []);
  const [activePanel, setActivePanel] = useState(null);
  const stepTwoRef = useRef(null);

  // Plan subjects come as ids from AI prose; match ids or labels.
  const planSubject = planTask?.subjectId
    ? subjects.find(
        (s) =>
          s.id === planTask.subjectId ||
          subjectIdFor(s.id, s.label) === planTask.subjectId,
      )
    : null;
  const subject =
    subjects.find((s) => s.id === selectedId) ||
    planSubject ||
    subjects[0] ||
    null;

  const selectSubject = useCallback((id) => {
    setSelectedId(id);
    if (window.matchMedia?.(PHONE_QUERY).matches) {
      setTimeout(() => scrollToTop(stepTwoRef.current), 120);
    }
  }, []);

  const phone = useMediaQuery(PHONE_QUERY);
  // Closing also drops a plan task, so reopening doesn't regenerate it.
  const closePanel = useCallback(() => {
    setActivePanel(null);
    setPlanTask(null);
  }, []);
  const togglePanel = (name) =>
    setActivePanel((p) => (p === name ? null : name));

  const openRetos = (target = subject, autoStart = false) => {
    if (target?.retoAvailable)
      setHandoff(HANDOFF_CHALLENGE_SUBJECT, target.challengeId);
    if (autoStart) {
      setHandoff(HANDOFF_CHALLENGE_DIFFICULTY, "medium");
      setHandoff(HANDOFF_CHALLENGE_AUTOSTART, "1");
    }
    onTabChange("retos");
  };
  const openEduCards = () => {
    if (subject) setHandoff(HANDOFF_FLASHCARDS_TOPIC, subject.label);
    onTabChange("flashcards");
  };

  // Route a plan task as soon as the subject list is known: material opens
  // Crear material pre-filled (and generating); retos / EduCards jump there.
  const routedRef = useRef(false);
  useEffect(() => {
    if (!planTask || routedRef.current || !subjects.length) return;
    routedRef.current = true;
    if (planSubject) setSelectedId(planSubject.id);
    if (planTask.tool !== "material" && planTask.planRef) {
      // Retos / EduCards tick the task themselves when the session ends.
      setHandoff(
        HANDOFF_PLAN_PENDING,
        JSON.stringify({ tool: planTask.tool, planRef: planTask.planRef }),
      );
    }
    if (planTask.tool === "retos") {
      openRetos(planSubject || subject);
    } else if (planTask.tool === "educards") {
      setHandoff(
        HANDOFF_FLASHCARDS_TOPIC,
        planTask.topic || subject?.label || "",
      );
      onTabChange("flashcards");
    } else {
      setActivePanel("generator");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planTask, subjects.length]);

  const finishPlanTask = useCallback(
    (ref) => {
      markStoredActivityDone(userId, ref.week, ref.act);
      setPlanTask(null);
      setActivePanel(null);
      onTabChange("plan");
    },
    [userId, onTabChange],
  );

  const surface = darkMode
    ? "bg-[#1E293B]/80 border-[#334155]/50"
    : "bg-white/80 border-[#E2E8F0]/60";
  const textPrimary = darkMode ? "text-white" : "text-[#1E293B]";
  const textSub = darkMode ? "text-[#94A3B8]" : "text-[#64748B]";
  const label = subject ? subject.label : "tu materia";

  return (
    <div
      data-typo="intended"
      className="space-y-5 sm:space-y-6 pb-28 md:pb-6 max-w-3xl mx-auto"
    >
      <div
        className={`rounded-2xl border p-3.5 sm:p-5 backdrop-blur-xl space-y-3 sm:space-y-4 ${surface}`}
      >
        <div>
          <p className={`font-black text-base sm:text-xl ${textPrimary}`}>
            {studentName
              ? `¡Hola, ${studentName}! 👋`
              : "¡Hora de practicar! 👋"}
          </p>
          <p className={`text-xs sm:text-sm mt-0.5 leading-snug ${textSub}`}>
            {weakCount > 0
              ? `Tienes ${weakCount} ${weakCount === 1 ? "materia" : "materias"} por reforzar 💪`
              : "Practica un poquito cada día y verás cómo mejoras."}
          </p>
        </div>
        <WeekProgress progress={progress} darkMode={darkMode} />
      </div>

      {recommendation && (
        <motion.button
          type="button"
          onClick={() => openRetos(recommendation.subject, true)}
          whileTap={{ scale: 0.98 }}
          className="w-full !flex items-center !justify-start gap-3 p-3 sm:p-4 rounded-2xl text-left text-white shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-[#EF4444]/40"
          style={{
            background: recommendation.urgent
              ? "linear-gradient(135deg, #EF4444 0%, #FB8500 100%)"
              : `linear-gradient(135deg, ${recommendation.subject.color} 0%, #9D4EDD 100%)`,
          }}
        >
          <span
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl sm:text-3xl shrink-0"
            aria-hidden="true"
          >
            {recommendation.urgent ? "🚨" : recommendation.subject.emoji}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-black uppercase tracking-wider text-white/80">
              {recommendation.urgent
                ? "🚨 URGENTE — ¡Reforzar ya!"
                : "Recomendado para ti"}
            </span>
            <span className="block text-lg font-black leading-tight">
              {recommendation.urgent
                ? `¡Salvar ${recommendation.subject.label}!`
                : `Reto de ${recommendation.subject.label}`}
            </span>
            <span className="block text-xs text-white/85 mt-0.5">
              {recommendation.why}
            </span>
          </span>
          <span
            className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-black shrink-0"
            style={
              recommendation.urgent
                ? { background: "rgba(255,255,255,0.25)", color: "#fff" }
                : { background: "#fff", color: "#1E293B" }
            }
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

        <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
          <ToolButton
            emoji="🎮"
            title={phone ? "Retos" : "Retos Inteligentes"}
            desc={
              phone
                ? "Preguntas y puntos"
                : `Responde preguntas de ${label} y gana puntos.`
            }
            gradient="linear-gradient(135deg, #EF476F 0%, #FF8FA3 100%)"
            onClick={() => openRetos()}
            darkMode={darkMode}
          />
          <ToolButton
            emoji="🃏"
            title="EduCards"
            desc={
              phone
                ? "Tarjetas para repasar"
                : `Tarjetas para aprender ${label} jugando.`
            }
            gradient="linear-gradient(135deg, #06D6A0 0%, #118AB2 100%)"
            onClick={openEduCards}
            darkMode={darkMode}
          />
          <ToolButton
            emoji="✨"
            title="Crear material"
            desc={
              phone
                ? "Resumen, mapa, videos…"
                : "La IA te explica el tema, con ejercicios y videos."
            }
            gradient="linear-gradient(135deg, #7B2FF7 0%, #C77DFF 100%)"
            onClick={() => togglePanel("generator")}
            open={activePanel === "generator"}
            expandable
            darkMode={darkMode}
          />
          <ToolButton
            emoji="📷"
            title="Escanear apunte"
            desc={
              phone
                ? "Foto de tu cuaderno"
                : "Toma una foto de tu cuaderno y te lo explico."
            }
            gradient="linear-gradient(135deg, #FB8500 0%, #FFD166 100%)"
            onClick={() => togglePanel("scanner")}
            open={activePanel === "scanner"}
            expandable
            darkMode={darkMode}
          />
        </div>
      </section>

      {/* Portal: an animated (transformed) ancestor would otherwise turn
          `fixed` into "fixed to that box" and the overlay would scroll away. */}
      {createPortal(
        <AnimatePresence initial={false}>
          {activePanel === "generator" && subject && (
            <PanelHost
              key="generator"
              phone={phone}
              darkMode={darkMode}
              onClose={closePanel}
            >
              <ContentGenerator
                key={subject.id}
                subject={subject}
                grade={grade}
                age={studentAge}
                onTabChange={onTabChange}
                onClose={closePanel}
                darkMode={darkMode}
                fullScreen
                planTask={planTask?.tool === "material" ? planTask : null}
                onFinishPlanTask={finishPlanTask}
              />
            </PanelHost>
          )}
          {activePanel === "scanner" && (
            <PanelHost
              key="scanner"
              phone={phone}
              darkMode={darkMode}
              onClose={closePanel}
            >
              <DocumentScanner
                grade={grade}
                subjectLabel={subject?.label}
                onClose={closePanel}
                darkMode={darkMode}
                fullScreen
              />
            </PanelHost>
          )}
        </AnimatePresence>,
        document.body,
      )}

      <p
        className={`hidden sm:block text-xs text-center leading-relaxed px-2 ${textSub}`}
      >
        💡 Practicar 15 minutos al día rinde más que estudiar 2 horas antes del
        examen.
      </p>
    </div>
  );
});

PracticarHub.displayName = "PracticarHub";
export default PracticarHub;
