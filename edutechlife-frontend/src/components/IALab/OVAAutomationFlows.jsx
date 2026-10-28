import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "../../i18n/I18nProvider";
import { OVAIntro } from "./shared";
import VoiceReader from "./VoiceReader";
import { useIALabStore } from "../../store/ialabStore";
import {
  ChevronLeft,
  ArrowRightCircle,
  Star,
  CheckCircle2,
  Menu,
  Sparkles,
  Zap,
  TrendingUp,
  BookOpen,
  Briefcase,
  Grid3x3,
} from "lucide-react";
import { stopSpeech } from "../../utils/speech";
import {
  Logo,
  AutomationFramework,
  CaseView,
  DesignYourFlow,
  Conclusion,
} from "./OVAAutomationFlowsParts";

const SCREEN_ICONS = {
  m1: <Grid3x3 className="w-4 h-4" />,
  m2: <TrendingUp className="w-4 h-4" />,
  m3: <BookOpen className="w-4 h-4" />,
  m4: <Briefcase className="w-4 h-4" />,
  m5: <Zap className="w-4 h-4" />,
  m6: <CheckCircle2 className="w-4 h-4" />,
};

function OVAAutomationFlows({ onComplete, onClose }) {
  const { t } = useTranslation();
  const [screen, setScreen] = useState("welcome");
  const [completed, setCompleted] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const autoCompletedRef = useRef(false);
  const nav = ["welcome", "m1", "m2", "m3", "m4", "m5", "m6"];
  const curIdx = nav.indexOf(screen);
  const addXp = useIALabStore((s) => s.addXp);

  // El recurso solo se marca como visto (y da XP) cuando se hicieron las
  // actividades evaluables m2–m5; antes bastaba con pulsar "Siguiente".
  useEffect(() => {
    const exercisesDone =
      completed.includes("m2") &&
      completed.includes("m3") &&
      completed.includes("m4") &&
      completed.includes("m5");
    if (screen === "m6" && exercisesDone && !autoCompletedRef.current) {
      autoCompletedRef.current = true;
      if (addXp) addXp(25);
      onComplete?.();
    }
  }, [screen, completed, onComplete, addXp]);

  const stepRequiresWork =
    (screen === "m2" && !completed.includes("m2")) ||
    (screen === "m3" && !completed.includes("m3")) ||
    (screen === "m4" && !completed.includes("m4")) ||
    (screen === "m5" && !completed.includes("m5"));

  const markCompleted = (id) => {
    setCompleted((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const nextScreen = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (screen === "welcome") {
      setScreen("m1");
      return;
    }
    // m2–m5 se marcan desde su propia actividad (CaseView / DesignYourFlow).
    if (screen === "m1") markCompleted(screen);
    const next = curIdx + 1;
    if (next < nav.length) setScreen(nav[next]);
  };

  const goToScreen = (id) => {
    setScreen(id);
    setIsMenuOpen(false);
  };

  const isLastScreen = screen === "m6";

  const renderContent = () => {
    switch (screen) {
      case "welcome":
        return (
          <OVAIntro
            icon="fa-bolt"
            badge={t("ova.automation.badge")}
            title={t("ova.automation.welcome_title")}
            description={t("ova.automation.welcome_desc")}
            audioText={t("ova.automation.welcome_audio")}
            onStart={nextScreen}
            startLabel={t("ova.automation.start")}
            objectives={[
              t("ova.automation.learning_obj_1"),
              t("ova.automation.learning_obj_2"),
              t("ova.automation.learning_obj_3"),
              t("ova.automation.learning_obj_4"),
            ]}
          />
        );
      case "m1":
        return (
          <>
            <AutomationFramework />
            <div className="flex justify-center mt-6">
              <VoiceReader text={t("ova.automation.voice_m1")} />
            </div>
          </>
        );
      case "m2":
        return (
          <>
            <CaseView
              caseKey="case_marketing"
              icon={<TrendingUp className="w-5 h-5" />}
              gradient="from-rose-500 to-pink-600"
              onComplete={() => markCompleted("m2")}
            />
            <div className="flex justify-center mt-6">
              <VoiceReader text={t("ova.automation.voice_m2")} />
            </div>
          </>
        );
      case "m3":
        return (
          <>
            <CaseView
              caseKey="case_education"
              icon={<BookOpen className="w-5 h-5" />}
              gradient="from-[var(--theme-primary)] to-[var(--theme-emphasis)]"
              onComplete={() => markCompleted("m3")}
            />
            <div className="flex justify-center mt-6">
              <VoiceReader text={t("ova.automation.voice_m3")} />
            </div>
          </>
        );
      case "m4":
        return (
          <>
            <CaseView
              caseKey="case_business"
              icon={<Briefcase className="w-5 h-5" />}
              gradient="from-amber-500 to-orange-600"
              onComplete={() => markCompleted("m4")}
            />
            <div className="flex justify-center mt-6">
              <VoiceReader text={t("ova.automation.voice_m4")} />
            </div>
          </>
        );
      case "m5":
        return (
          <>
            <DesignYourFlow onCompleted={() => markCompleted("m5")} />
            <div className="flex justify-center mt-6">
              <VoiceReader text={t("ova.automation.voice_m5")} />
            </div>
          </>
        );
      case "m6":
        return (
          <>
            <Conclusion />
            <div className="flex justify-center mt-6">
              <VoiceReader text={t("ova.automation.voice_m6")} />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans flex flex-col selection:bg-blue-100 dark:selection:bg-blue-900">
      <header className="sticky top-0 w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl border-b z-50 px-4 py-3 flex justify-between items-center shadow-sm">
        <Logo />
        <div className="flex items-center gap-4">
          {screen !== "welcome" && (
            <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full border border-[var(--theme-primary)]/20">
              <Star className="theme-text-primary fill-current" size={14} />
              <span className="font-bold theme-text text-xs">
                {nav.filter((id) => completed.includes(id)).length}/
                {nav.length - 1}
              </span>
            </div>
          )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={t("ova.automation.menu_title")}
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
                <Sparkles className="w-3 h-3" />{" "}
                {t("ova.automation.section_label")}
              </div>
              <h1 className="text-lg md:text-xl font-[900] theme-text dark:text-white tracking-tighter leading-tight">
                {t(`ova.automation.screen_${screen}`)}
              </h1>
            </div>
          )}
          <div className="relative z-10 min-h-[180px] flex flex-col justify-center">
            {renderContent()}
          </div>
        </div>
      </main>

      {screen !== "welcome" && stepRequiresWork && (
        <p
          role="status"
          className="text-center text-xs font-medium theme-text-muted px-4 pb-2"
        >
          {t("ova.common.step_requires_activity")}
        </p>
      )}

      {screen !== "welcome" && (
        <div className="flex justify-center border-t border-slate-100 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90">
          <div className="w-full max-w-4xl flex justify-between items-center gap-3 px-4 py-3">
            <button
              onClick={() => {
                if (curIdx > 1) setScreen(nav[curIdx - 1]);
                stopSpeech();
              }}
              aria-label={t("ova.automation.nav_prev")}
              className="p-3 min-w-[44px] min-h-[44px] bg-[#F1F5F9] dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:theme-text dark:hover:theme-text-primary rounded-xl disabled:opacity-10 transition-all border border-slate-50 dark:border-slate-700"
              disabled={curIdx <= 1}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div
              className="flex gap-1.5"
              role="group"
              aria-label={t("ova.automation.menu_title")}
            >
              {nav.slice(1).map((_, i) => (
                <div
                  key={i}
                  aria-hidden="true"
                  className={`h-1.5 rounded-full transition-all duration-700 ${
                    i + 1 === curIdx
                      ? "w-8 bg-[var(--theme-emphasis)]"
                      : completed.includes(nav[i + 1])
                        ? "w-2 bg-[var(--theme-primary)]"
                        : "w-2 bg-slate-200 dark:bg-slate-600"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={
                isLastScreen
                  ? () => {
                      onClose?.();
                    }
                  : nextScreen
              }
              disabled={stepRequiresWork}
              className={`px-6 min-h-[44px] rounded-xl font-[900] text-xs shadow-md active:scale-95 transition-all flex items-center gap-2 uppercase tracking-[0.15em] disabled:opacity-40 disabled:cursor-not-allowed ${
                isLastScreen
                  ? "bg-emerald-500 text-white hover:bg-emerald-600"
                  : "bg-gradient-to-r from-[var(--theme-text)] to-[var(--theme-primary)] text-white"
              }`}
            >
              {isLastScreen
                ? t("ova.automation.nav_finish")
                : t("ova.automation.nav_next")}{" "}
              <ArrowRightCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {screen !== "welcome" && (
        <div className="border-t border-slate-100 dark:border-slate-700 py-3 text-center text-slate-500 dark:text-slate-300 text-xs">
          <p>{t("ova.automation.footer")}</p>
        </div>
      )}

      {isMenuOpen && (
        <div
          className="fixed inset-0 z-[100] bg-slate-900/60 dark:bg-slate-950/60 backdrop-blur-md"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t("ova.automation.menu_title")}
            className="absolute right-0 h-full w-[300px] bg-white dark:bg-slate-800 shadow-2xl p-6 flex flex-col gap-4 animate-[slideInRight_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b-2 border-slate-50 dark:border-slate-700 pb-4">
              <h3 className="font-[900] text-slate-300 dark:text-slate-500 text-xs tracking-[0.3em] uppercase">
                {t("ova.automation.menu_title")}
              </h3>
              <div className="flex items-center gap-1.5 text-[10px] font-black theme-text">
                <Star className="w-3 h-3 theme-text-primary fill-current" />
                {completed.filter((id) => id.startsWith("m")).length}/
                {nav.filter((id) => id.startsWith("m")).length}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1.5">
              {nav.map((id, idx) => {
                const isCompleted = completed.includes(id);
                const isCurrent = screen === id;
                return (
                  <button
                    key={id}
                    onClick={() => goToScreen(id)}
                    className={`p-3 rounded-xl text-left text-xs font-[900] transition-all group w-full ${
                      isCurrent
                        ? "bg-[var(--theme-emphasis)] text-[var(--theme-on-emphasis)] shadow-lg"
                        : "hover:bg-slate-50 dark:hover:bg-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 transition-all ${
                          isCompleted
                            ? "bg-[var(--theme-primary)] text-white"
                            : isCurrent
                              ? "bg-white/20 text-white"
                              : "bg-slate-100 dark:bg-slate-700 text-slate-400"
                        }`}
                      >
                        {idx}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`uppercase tracking-wider ${isCurrent ? "text-white" : isCompleted ? "theme-text dark:theme-text-primary" : "text-slate-500 dark:text-slate-400"}`}
                        >
                          {id === "welcome"
                            ? t("ova.automation.menu_welcome")
                            : t(`ova.automation.screen_${id}`)}
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
  );
}

OVAAutomationFlows.propTypes = {
  onComplete: PropTypes.func,
  onClose: PropTypes.func,
};

export default OVAAutomationFlows;
