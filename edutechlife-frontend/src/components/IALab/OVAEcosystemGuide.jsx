import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "../../i18n/I18nProvider";
import SectionErrorBoundary from "./SectionErrorBoundary";
import {
  BrainCircuit,
  ChevronRight,
  ChevronLeft,
  ArrowRightCircle,
  Star,
  Sparkles,
  CheckCircle2,
  Menu,
  MousePointer2,
  Lightbulb,
  Target,
  Globe,
  Zap,
  Settings,
  MessageSquare,
  TrendingUp,
  Cpu,
  Wrench,
  Share2,
  Search,
  Layout,
  Database,
  Bot,
  Volume2,
  Image,
  FileText,
  Link,
  HelpCircle,
  Rocket,
  ChevronDown,
  Users,
  Play,
  Briefcase,
  Trophy,
} from "lucide-react";
import { stopSpeech } from "../../utils/speech";
import { OVAIntro } from "./shared";
import VoiceReader from "./VoiceReader";
import {
  infographicData,
  learningObjectives,
} from "../../data/ova/ecosystemGuide";
import EvolutionTimeline from "./OVAEcosystemGuide/EvolutionTimeline";
import ToolsMatchup from "./OVAEcosystemGuide/ToolsMatchup";
import ExpandedQuiz from "./OVAEcosystemGuide/ExpandedQuiz";
import XPTracker from "./OVAEcosystemGuide/XPTracker";

const screenVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 25 },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.15 } },
};

const XP_PER_SCREEN = 15;
const QUIZ_XP_BONUS = 25;
const MAX_XP = 145;

const Logo = () => (
  <div className="flex items-center gap-2 select-none group cursor-pointer">
    <div className="relative w-9 h-9 flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-tr from-[var(--theme-text)] to-[var(--theme-primary)] rounded-xl rotate-3 shadow-md group-hover:rotate-0 transition-transform"></div>
      <BrainCircuit className="w-5 h-5 text-white relative z-10" />
    </div>
    <div className="text-xl tracking-tighter flex items-center lowercase">
      <span className="font-[900] theme-text">edutech</span>
      <span className="font-[400] theme-text-primary">life</span>
    </div>
  </div>
);

const detailIconMap = {
  Search,
  Layout,
  Database,
  Zap,
  Settings,
  MessageSquare,
};

const DetailCard = ({ detail }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const DetailIcon = detailIconMap[detail.icon] || null;
  return (
    <div
      className={`bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl border transition-all shadow-sm ${isExpanded ? "border-[var(--theme-primary)]/40 shadow-md" : "border-slate-100 dark:border-slate-700 hover:border-[var(--theme-primary)]/30 hover:shadow-md"}`}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-4 p-4 text-left"
      >
        <div
          className={`shrink-0 transition-colors ${isExpanded ? "theme-text-primary" : "text-slate-400"}`}
        >
          {DetailIcon ? <DetailIcon size={20} /> : <ChevronDown size={20} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h5 className="font-[900] theme-text text-xs uppercase">
              {detail.title}
            </h5>
            {detail.date && (
              <span className="text-[10px] font-black theme-text-primary theme-bg-primary-10 px-2 py-0.5 rounded-md">
                {detail.date}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-300 mt-0.5 leading-relaxed">
            {detail.text}
          </p>
        </div>
        <ChevronDown
          size={18}
          className={`text-slate-300 dark:text-slate-500 shrink-0 transition-transform duration-300 ${isExpanded ? "rotate-180 theme-text-primary" : ""}`}
        />
      </button>
      {detail.extendedText && (
        <div
          className={`grid transition-all duration-500 ease-in-out ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
        >
          <div className="overflow-hidden">
            <div className="px-4 pb-4 pt-0">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic flex gap-2">
                <Lightbulb
                  size={16}
                  className="text-amber-500 shrink-0 mt-0.5"
                />
                <span>{detail.extendedText}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const sectionIcons = { TrendingUp, Cpu, Wrench, Share2 };

const SectionScreen = ({ section }) => {
  const { t } = useTranslation();
  const SectionIcon = sectionIcons[section.icon] || null;
  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-[var(--theme-text)] to-[var(--theme-primary)] text-white rounded-xl flex items-center justify-center shadow-md">
          {SectionIcon && <SectionIcon size={22} />}
        </div>
        <div>
          <h4 className="font-[900] theme-text text-lg tracking-tighter lowercase">
            {section.title}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            {section.content}
          </p>
        </div>
      </div>
      <div className="space-y-2">
        {section.details.map((detail, idx) => (
          <DetailCard key={idx} detail={detail} />
        ))}
      </div>
    </div>
  );
};

const StrategiesScreen = () => {
  const { t } = useTranslation();
  const [active, setActive] = useState(null);
  const strategies = [
    { k: "gpts", icon: <Bot className="w-5 h-5" />, color: "bg-[var(--theme-emphasis)]" },
    {
      k: "voice",
      icon: <Volume2 className="w-5 h-5" />,
      color: "bg-[var(--theme-primary)]",
    },
    { k: "dalle", icon: <Image className="w-5 h-5" />, color: "bg-[#4361EE]" },
    {
      k: "files",
      icon: <FileText className="w-5 h-5" />,
      color: "bg-[#4CC9F0]",
    },
    { k: "sharing", icon: <Link className="w-5 h-5" />, color: "bg-[#F72585]" },
  ];
  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-3">
      <p className="text-sm text-slate-500 dark:text-slate-300 font-bold">
        {t("ova.ecosystem.strategies_desc")}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {strategies.map((s) => (
          <button
            key={s.k}
            onClick={() => setActive(active === s.k ? null : s.k)}
            className={`p-4 rounded-xl border-2 transition-all text-left ${active === s.k ? "border-[var(--theme-primary)] bg-blue-50 shadow-md" : "bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600"}`}
          >
            <div
              className={`w-10 h-10 ${s.color} text-white rounded-lg flex items-center justify-center mb-2 shadow-sm`}
            >
              {s.icon}
            </div>
            <h5 className="font-[900] theme-text text-xs uppercase tracking-wider">
              {t(`ova.ecosystem.strategies_${s.k}_title`)}
            </h5>
          </button>
        ))}
      </div>
      {active ? (
        <div className="p-4 bg-[var(--theme-emphasis)] text-white rounded-xl">
          <h5 className="theme-text-primary font-[900] text-xs uppercase tracking-[0.2em] mb-2">
            {t(`ova.ecosystem.strategies_${active}_title`)}
          </h5>
          <p className="text-sm text-white leading-relaxed font-medium">
            {t(`ova.ecosystem.strategies_${active}_desc`)}
          </p>
        </div>
      ) : (
        <div className="text-center py-6 opacity-30 space-y-2">
          <MousePointer2 className="w-6 h-6 mx-auto animate-bounce" />
          <p className="text-[10px] font-black uppercase tracking-widest">
            {t("ova.ecosystem.strategies_select")}
          </p>
        </div>
      )}
    </div>
  );
};

const ChallengeScreen = () => {
  const { t } = useTranslation();
  const [scenario, setScenario] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const scenarios = [
    { k: "student", icon: <Star className="w-5 h-5" />, color: "bg-[var(--theme-emphasis)]" },
    { k: "teacher", icon: <Zap className="w-5 h-5" />, color: "bg-[var(--theme-primary)]" },
    {
      k: "pro",
      icon: <Briefcase className="w-5 h-5" />,
      color: "bg-[#4361EE]",
    },
  ];

  if (!scenario) {
    return (
      <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-3">
        <p className="text-sm text-slate-500 dark:text-slate-300 font-bold">
          {t("ova.ecosystem.challenge_desc")}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {scenarios.map((s) => (
            <button
              key={s.k}
              onClick={() => {
                setScenario(s.k);
                setRevealed(false);
              }}
              className="p-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 hover:border-[var(--theme-primary)] rounded-xl text-center transition-all"
            >
              <div
                className={`w-10 h-10 ${s.color} text-white rounded-lg flex items-center justify-center mx-auto mb-2`}
              >
                {s.icon}
              </div>
              <h5 className="font-[900] theme-text text-xs uppercase">
                {t(`ova.ecosystem.challenge_option_${s.k}`)}
              </h5>
            </button>
          ))}
        </div>
    </div>
  );
}

  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-4">
      <button
        onClick={() => {
          setScenario(null);
          setRevealed(false);
        }}
        className="text-[10px] font-black theme-text-primary uppercase tracking-wider hover:underline"
      >
        &larr; {t("ova.ecosystem.challenge_desc")}
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-700 rounded-xl">
          <span className="text-[10px] font-black text-red-600 uppercase tracking-wider">
            {t("ova.ecosystem.challenge_before_label")}
          </span>
          <p className="text-sm text-slate-600 dark:text-slate-300 font-mono italic mt-2">
            {t(`ova.ecosystem.challenge_${scenario}_before`)}
          </p>
        </div>
        {revealed && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700 rounded-xl animate-[fadeIn_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards]">
            <span className="text-[10px] font-black text-green-700 uppercase tracking-wider">
              {t("ova.ecosystem.challenge_after_label")}
            </span>
            <p className="text-xs text-slate-700 dark:text-slate-200 font-medium leading-relaxed mt-2">
              {t(`ova.ecosystem.challenge_${scenario}_after`)}
            </p>
          </div>
        )}
      </div>
      {!revealed && (
        <button
          onClick={() => setRevealed(true)}
          className="w-full py-3 bg-gradient-to-r from-[var(--theme-text)] to-[var(--theme-primary)] text-white font-black rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-lg"
        >
          {t("ova.ecosystem.challenge_reveal")}{" "}
          <ArrowRightCircle className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

const ConclusionScreen = () => {
  const { t } = useTranslation();
  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-4 text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-[var(--theme-text)] to-[var(--theme-primary)] rounded-[2rem] flex items-center justify-center mx-auto shadow-lg">
        <Rocket className="w-8 h-8 text-white" />
      </div>
      <h4 className="font-[900] theme-text text-2xl tracking-tighter lowercase">
        {t("ova.ecosystem.conclusion_title")}
      </h4>
      <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-bold text-sm max-w-lg mx-auto">
        {t("ova.ecosystem.conclusion_desc")}
      </p>
    </div>
  );
};

const screensData = (t) => ({
  m1: { title: t("ova.ecosystem.menu_title_m1") },
  m2: { title: t("ova.ecosystem.menu_title_m2") },
  m3: { title: t("ova.ecosystem.menu_title_m3") },
  m4: { title: t("ova.ecosystem.menu_title_m4") },
  m5: { title: t("ova.ecosystem.menu_title_m5") },
  m6: { title: t("ova.ecosystem.menu_title_m6") },
  m7: { title: t("ova.ecosystem.menu_title_m7") },
  m8: { title: t("ova.ecosystem.menu_title_m8") },
});

OVAEcosystemGuide.propTypes = {
  onComplete: PropTypes.func,
};

export default function OVAEcosystemGuide({ onComplete, onClose }) {
  const { t, locale } = useTranslation();
  const [screen, setScreen] = useState("welcome");
  const [completed, setCompleted] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [xp, setXp] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const certCompletedRef = useRef(false);
  const m8AutoCompletedRef = useRef(false);
  const nav = ["welcome", "m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8"];
  const curIdx = nav.indexOf(screen);

  const sections = infographicData.sections;
  const resolvedScreensData = screensData(t);

  useEffect(() => {
    if (screen === "m8" && !m8AutoCompletedRef.current) {
      m8AutoCompletedRef.current = true;
      handleMarkComplete();
    }
  }, [screen]);

  useEffect(() => {
    if (showConfetti) {
      import("canvas-confetti").then(({ default: confetti }) => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#004B63", "#00BCD4", "#10B981", "#F59E0B"],
        });
      });
    }
  }, [showConfetti]);

  const nextScreen = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (screen === "welcome") {
      setScreen("m1");
      return;
    }
    if (!completed.includes(screen)) {
      setCompleted((prev) => [...prev, screen]);
      if (screen !== "m6") {
        setXp((prev) => prev + XP_PER_SCREEN);
      }
    }
    const next = nav.indexOf(screen) + 1;
    if (next < nav.length) setScreen(nav[next]);
  };

  const goToScreen = (id) => {
    setScreen(id);
    setIsMenuOpen(false);
  };

  const isLastScreen = screen === "m8";

  const handleMarkComplete = () => {
    if (!certCompletedRef.current) {
      certCompletedRef.current = true;
      if (!completed.includes("m6")) {
        setXp((prev) => prev + XP_PER_SCREEN + QUIZ_XP_BONUS);
      } else {
        setXp((prev) => prev + QUIZ_XP_BONUS);
      }
      setShowConfetti(true);
      onComplete?.();
    }
  };

  const renderContent = () => {
    switch (screen) {
      case "welcome":
        return (
          <>
            <OVAIntro
              icon="fa-brain"
              badge={t("ova.ecosystem.lab_badge")}
              title={t("ova.ecosystem.guide_title")}
              description={t("ova.ecosystem.welcome_desc")}
              audioText={t("ova.ecosystem.welcome_voice")}
              onStart={nextScreen}
              startLabel={t("ova.ecosystem.start_btn")}
              objectives={learningObjectives}
            />
          </>
        );
      case "m1":
        return (
          <>
            <EvolutionTimeline items={sections[0].details} />
            <div className="flex justify-center mt-6">
              <VoiceReader text={sections[0].content} />
            </div>
          </>
        );
      case "m2":
        return (
          <>
            <SectionScreen section={sections[1]} />
            <div className="flex justify-center mt-6">
              <VoiceReader text={sections[1].content} />
            </div>
          </>
        );
      case "m3":
        return (
          <>
            <ToolsMatchup items={sections[2].details} />
            <div className="flex justify-center mt-6">
              <VoiceReader text={sections[2].content} />
            </div>
          </>
        );
      case "m4":
        return (
          <>
            <SectionScreen section={sections[3]} />
            <div className="flex justify-center mt-6">
              <VoiceReader text={sections[3].content} />
            </div>
          </>
        );
      case "m5":
        return (
          <>
            <StrategiesScreen />
            <div className="flex justify-center mt-6">
              <VoiceReader text={t("ova.ecosystem.strategies_voice")} />
            </div>
          </>
        );
      case "m6":
        return (
          <>
            <ExpandedQuiz questions={infographicData.quiz?.questions || []} />
            <div className="flex justify-center mt-6">
              <VoiceReader text={t("ova.ecosystem.quiz_voice")} />
            </div>
          </>
        );
      case "m7":
        return (
          <>
            <ChallengeScreen />
            <div className="flex justify-center mt-6">
              <VoiceReader text={t("ova.ecosystem.challenge_voice")} />
            </div>
          </>
        );
      case "m8":
        return (
          <>
            <ConclusionScreen />
            <div className="flex justify-center mt-6">
              <VoiceReader text={t("ova.ecosystem.conclusion_voice")} />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <SectionErrorBoundary name="OVAEcosystemGuide">
    <div className="w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans flex flex-col selection:bg-blue-100 dark:selection:bg-blue-900">
      <header className="sticky top-0 w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl border-b z-50 px-4 py-3 flex justify-between items-center shadow-sm">
        <Logo />
        <div className="flex items-center gap-4">
          {screen !== "welcome" && (
            <div className="w-32">
              <XPTracker xp={xp} maxXp={MAX_XP} />
            </div>
          )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={t("ova.ecosystem.menu_aria")}
            className="min-w-[44px] min-h-[44px] p-2.5 bg-[#F1F5F9] dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-all border border-slate-100 dark:border-slate-700"
          >
            <Menu className="w-5 h-5 theme-text" />
          </button>
        </div>
      </header>

      <main className="flex-1 px-3 py-4">
        <div className="w-full bg-white dark:bg-slate-800 rounded-2xl shadow-md p-4 md:p-6 relative overflow-hidden border border-slate-50 dark:border-slate-700">
          {screen.startsWith("m") && (
            <div className="mb-4 border-b border-slate-50 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-1.5 theme-text-primary font-[900] text-[10px] tracking-[0.3em] uppercase">
                <Sparkles className="w-3 h-3" /> {t("ova.introprompt.master")}
              </div>
              <h1 className="text-lg md:text-xl font-[900] theme-text tracking-tighter leading-tight">
                {resolvedScreensData[screen]?.title}
              </h1>
            </div>
          )}
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
        </div>
      </main>

      {screen !== "welcome" && (
        <>
          <div className="flex justify-center border-t border-slate-100 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90">
            <div className="w-full max-w-4xl flex justify-between items-center gap-3 px-4 py-3">
              <button
                onClick={() => {
                  if (curIdx > 1) setScreen(nav[curIdx - 1]);
                  stopSpeech();
                }}
                aria-label={t("ova.nav.prev_aria")}
                className="p-3 min-w-[44px] min-h-[44px] bg-[#F1F5F9] dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:theme-text dark:hover:theme-text-primary rounded-xl disabled:opacity-10 transition-all border border-slate-50 dark:border-slate-700"
                disabled={curIdx <= 1}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-1.5">
                {nav.slice(1).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-700 ${i + 1 === curIdx ? "w-8 bg-[var(--theme-emphasis)]" : completed.includes(nav[i + 1]) ? "w-2 bg-[var(--theme-primary)]" : "w-2 bg-slate-200 dark:bg-slate-600"}`}
                  />
                ))}
              </div>
              <button
                onClick={isLastScreen ? () => onClose?.() : nextScreen}
                className={`px-6 min-h-[44px] rounded-xl font-[900] text-xs shadow-md active:scale-95 transition-all flex items-center gap-2 uppercase tracking-[0.15em] ${isLastScreen ? "bg-emerald-500 text-white hover:bg-emerald-600" : "bg-gradient-to-r from-[var(--theme-text)] to-[var(--theme-primary)] text-white"}`}
              >
                {isLastScreen
                  ? t("ova.introprompt.finish_btn")
                  : t("ova.introprompt.next")}{" "}
                <ArrowRightCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="border-t border-slate-100 dark:border-slate-700 py-3 text-center text-slate-500 dark:text-slate-300 text-xs">
            <p>{t("ova.ecosystem.footer")}</p>
          </div>
        </>
      )}

      {isMenuOpen && (
        <div
          className="fixed inset-0 z-[100] bg-slate-900/60 dark:bg-slate-950/60 backdrop-blur-md"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="absolute right-0 h-full w-[300px] bg-white dark:bg-slate-800 shadow-2xl p-6 flex flex-col gap-4 animate-[slideInRight_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b-2 border-slate-50 dark:border-slate-700 pb-4">
              <h3 className="font-[900] text-slate-300 dark:text-slate-500 text-xs tracking-[0.3em] uppercase">
                {t("ova.introprompt.map")}
              </h3>
              <div className="flex items-center gap-1.5 text-[10px] font-black theme-text">
                <Star className="w-3 h-3 theme-text-primary fill-current" />
                {completed.filter((id) => id.startsWith("m")).length}/
                {nav.filter((id) => id.startsWith("m")).length}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1.5">
              {nav.map((id, idx) => {
                const stepNum = idx;
                const isCompleted = completed.includes(id);
                const isCurrent = screen === id;
                return (
                  <button
                    key={id}
                    onClick={() => goToScreen(id)}
                    className={`p-3 rounded-xl text-left text-xs font-[900] transition-all group w-full ${isCurrent ? "bg-[var(--theme-emphasis)] text-white shadow-lg" : "hover:bg-slate-50 dark:hover:bg-slate-700"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 transition-all ${isCompleted ? "bg-[var(--theme-primary)] text-white" : isCurrent ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-400"}`}
                      >
                        {stepNum}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`uppercase tracking-wider ${isCurrent ? "text-white" : isCompleted ? "theme-text dark:theme-text-primary" : "text-slate-500 dark:text-slate-400"}`}
                        >
                          {id === "welcome"
                            ? t("ova.introprompt.menu_welcome")
                            : resolvedScreensData[id]?.title}
                        </div>
                        <div className="mt-1.5 w-full h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${isCompleted ? "w-full bg-[var(--theme-primary)]" : isCurrent ? "w-1/3 bg-[var(--theme-emphasis)]" : "w-0"}`}
                          />
                        </div>
                      </div>
                      {isCompleted && (
                        <CheckCircle2 className="w-4 h-4 theme-text-primary shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
    </SectionErrorBoundary>
  );
}
