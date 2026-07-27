import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "../../i18n/I18nProvider";
import SectionErrorBoundary from "./SectionErrorBoundary";
import {
  Brain,
  Network,
  Lightbulb,
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Award,
  Play,
} from "lucide-react";
import { OVAIntro, OVAValerioBar } from "./shared";

const EdutechLogo = ({ size = "large" }) => {
  const isLarge = size === "large";
  return (
    <div className="flex items-center justify-center gap-3 select-none">
      <div
        className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-corporate to-petroleum shadow-lg shadow-corporate/20 ${isLarge ? "w-12 h-12 md:w-14 md:h-14" : "w-10 h-10"}`}
      >
        <Brain className={`text-white ${isLarge ? "w-7 h-7" : "w-5 h-5"}`} />
        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-petroleum rounded-full border-2 border-white shadow-[0_0_8px_rgba(0,75,99,0.5)] animate-pulse" />
      </div>
      <h1
        className={`font-bold tracking-tight ${isLarge ? "text-4xl md:text-5xl" : "text-2xl md:text-3xl"}`}
      >
        <span className="text-corporate">Edu</span>
        <span className="text-petroleum dark:text-slate-100">techlife</span>
      </h1>
    </div>
  );
};

EdutechLogo.propTypes = {
  size: PropTypes.string,
};

export default function OVANotebookBase({
  data,
  translationPrefix,
  imageLayoutClass = "lg:h-auto lg:flex-grow",
  contentPanelMaxHeight = "max-h-[600px]",
  onComplete,
}) {
  const { contentScreens, questionsData } = data;
  const { t } = useTranslation();
  const tk = (key) => t(`${translationPrefix}.${key}`);

  const totalSteps = 1 + contentScreens.length + questionsData.length + 1;

  const [screen, setScreen] = useState("intro");
  const [gameState, setGameState] = useState("content");
  const [contentIdx, setContentIdx] = useState(0);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const autoCompletedRef = useRef(false);

  useEffect(() => {
    if (gameState === "results" && score >= 5 && !autoCompletedRef.current) {
      autoCompletedRef.current = true;
      onComplete?.();
    }
  }, [gameState, score, onComplete]);

  useEffect(() => {
    if (gameState === "results" && score > 4) {
      import("canvas-confetti").then(({ default: confetti }) => {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#00BCD4", "#004B63", "#EAEAEA"],
        });
      });
    }
  }, [gameState, score]);

  const startGame = () => {
    setScreen("slides");
    setGameState("content");
    setContentIdx(0);
    setCurrentQIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowHint(false);
  };

  const nextContent = () => {
    if (contentIdx < contentScreens.length - 1) {
      setContentIdx((prev) => prev + 1);
    } else {
      setGameState("quiz");
      setCurrentQIndex(0);
    }
  };

  const prevContent = () => {
    if (contentIdx > 0) setContentIdx((prev) => prev - 1);
  };

  const handleOptionClick = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === questionsData[currentQIndex].correct) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < questionsData.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowHint(false);
    } else {
      setGameState("results");
    }
  };

  const currentStep =
    screen === "intro"
      ? 0
      : gameState === "content"
        ? 1 + contentIdx
        : gameState === "quiz"
          ? 1 + contentScreens.length + currentQIndex
          : totalSteps - 1;

  const getValerioText = () => {
    if (screen === "intro") return tk("welcome_audio");
    if (gameState === "content")
      return contentScreens[contentIdx]?.valerioText || "";
    if (gameState === "quiz")
      return questionsData[currentQIndex]?.question || "";
    return tk("completed_text");
  };

  if (screen === "intro") {
    return (
      <SectionErrorBoundary name="OVANotebookBase/Intro">
        <div className="w-full h-full bg-gradient-to-br from-cyan-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center rounded-2xl min-h-[400px]">
          <OVAIntro
            icon="fa-brain"
            badge={tk("learning_badge")}
            title={tk("lab_title")}
            description={tk("welcome_desc_p1")}
            audioText={tk("welcome_audio")}
            onStart={startGame}
            startLabel={tk("start_cta")}
          />
        </div>
      </SectionErrorBoundary>
    );
  }

  if (gameState === "results") {
    const percentage = Math.round((score / questionsData.length) * 100);
    let message = "",
      submessage = "";
    if (percentage === 100) {
      message = tk("result_perfect_title");
      submessage = tk("result_perfect_desc");
    } else if (percentage >= 70) {
      message = tk("result_good_title");
      submessage = tk("result_good_desc");
    } else {
      message = tk("result_bad_title");
      submessage = tk("result_bad_desc");
    }
    return (
      <SectionErrorBoundary name="OVANotebookBase/Results">
        <div className="w-full relative min-h-[400px]">
          <div className="fixed inset-0 -z-10 opacity-60 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[length:50px_50px]" />
          <div className="fixed -top-[15%] -left-[10%] w-[50vw] h-[50vw] -z-10 bg-[radial-gradient(circle,rgba(0,188,212,0.15)_0%,rgba(255,255,255,0)_70%)]" />
          <div className="fixed -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] -z-10 bg-[radial-gradient(circle,rgba(0,75,99,0.08)_0%,rgba(255,255,255,0)_70%)]" />
          <div className="w-full flex items-center justify-center py-12 px-4 relative z-10">
            <div className="w-full max-w-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-corporate/15 shadow-[0_8px_32px_rgba(31,38,135,0.1)] p-8 md:p-16 rounded-3xl animate-[fadeIn_0.6s_ease-out_forwards] text-center border-t-4 border-t-petroleum">
              <div className="mb-6 flex justify-center">
                <EdutechLogo size="small" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-semibold text-[10px] uppercase tracking-[0.15em] border border-emerald-200 dark:border-emerald-700 mb-4">
                <Award size={14} />
                <span>{tk("completed_label")}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-petroleum dark:text-slate-100 font-montserrat">
                {tk("results_title")}
              </h2>
              <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-corporate to-petroleum my-8 drop-shadow-sm">
                {score}
                <span className="text-4xl text-gray-400 dark:text-slate-400">
                  /7
                </span>
              </div>
              <h3 className="text-2xl font-semibold text-corporate mb-4">
                {message}
              </h3>
              <p className="text-petroleum/80 dark:text-slate-100/80 mb-6 text-lg">
                {submessage}
              </p>
              <button
                onClick={startGame}
                className="px-8 py-3 rounded-xl bg-white dark:bg-slate-800 text-petroleum dark:text-slate-100 border-2 border-gray-200 dark:border-slate-600 hover:border-corporate hover:text-corporate dark:hover:text-corporate transition-all font-semibold flex items-center justify-center gap-2 mx-auto shadow-sm"
              >
                <Play size={18} />
                {tk("restart")}
              </button>
            </div>
          </div>
          <OVAValerioBar text={getValerioText()} />
        </div>
      </SectionErrorBoundary>
    );
  }

  if (gameState === "content") {
    const screen_data = contentScreens[contentIdx];
    const isFirst = contentIdx === 0;
    const isLast = contentIdx === contentScreens.length - 1;
    return (
      <SectionErrorBoundary name="OVANotebookBase/Content">
        <div className="w-full relative min-h-[400px]">
          <div className="fixed inset-0 -z-10 opacity-60 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[length:50px_50px]" />
          <div className="fixed -top-[15%] -left-[10%] w-[50vw] h-[50vw] -z-10 bg-[radial-gradient(circle,rgba(0,188,212,0.15)_0%,rgba(255,255,255,0)_70%)]" />
          <div className="fixed -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] -z-10 bg-[radial-gradient(circle,rgba(0,75,99,0.08)_0%,rgba(255,255,255,0)_70%)]" />
          <div className="w-full py-6 px-4 relative z-10">
            <div
              className="w-full max-w-5xl mx-auto animate-[fadeIn_0.6s_ease-out_forwards]"
              key={screen_data.id}
            >
              <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <EdutechLogo size="small" />
                <div className="flex items-center gap-3">
                  <span className="text-petroleum dark:text-slate-100 font-semibold bg-white dark:bg-slate-800 px-4 py-1.5 rounded-full border border-gray-200 dark:border-slate-600 shadow-sm text-sm">
                    {contentIdx + 1} / {contentScreens.length}
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5 mb-8 overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-corporate to-petroleum h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-2/5 flex flex-col gap-6">
                  <div
                    className={`relative rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-slate-600 h-64 ${imageLayoutClass} bg-white dark:bg-slate-800`}
                  >
                    <img
                      src={screen_data.image}
                      alt={screen_data.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-petroleum via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2 text-white text-sm font-semibold bg-corporate/90 w-fit px-4 py-1.5 rounded-lg backdrop-blur-md shadow-lg border border-white/20">
                        <Network size={16} /> {tk("learning_badge")}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`w-full lg:w-3/5 ${contentPanelMaxHeight} overflow-y-auto`}
                >
                  <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-corporate/15 shadow-[0_8px_32px_rgba(31,38,135,0.1)] p-6 md:p-10 rounded-3xl flex flex-col border-t-4 border-t-corporate">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-900/30 text-corporate dark:text-teal-200 font-semibold text-[9px] uppercase tracking-[0.15em] border border-corporate/20 w-fit mb-4">
                      <Brain size={12} />
                      <span>{screen_data.subtitle}</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-petroleum dark:text-slate-100 mb-4 font-montserrat">
                      {screen_data.title}
                    </h2>
                    <p className="text-petroleum/80 dark:text-slate-100/80 text-sm leading-relaxed mb-6">
                      {screen_data.valerioText}
                    </p>

                    <div className="mb-5">
                      <h3 className="text-xs font-bold text-petroleum dark:text-slate-100 uppercase tracking-wider mb-3">
                        {tk("objectives_title")}
                      </h3>
                      <div className="space-y-2">
                        {screen_data.achievements.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2.5 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-500/20"
                          >
                            <CheckCircle
                              size={16}
                              className="text-emerald-500 flex-shrink-0 mt-0.5"
                            />
                            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300 leading-relaxed">
                              {item.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-5">
                      <h3 className="text-xs font-bold text-petroleum dark:text-slate-100 uppercase tracking-wider mb-3">
                        {tk("warnings_title")}
                      </h3>
                      <div className="space-y-2">
                        {screen_data.warnings.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2.5 p-2.5 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-400/20"
                          >
                            <XCircle
                              size={16}
                              className="text-red-500 flex-shrink-0 mt-0.5"
                            />
                            <span className="text-xs font-medium text-red-700 dark:text-red-300 leading-relaxed">
                              {item.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-petroleum dark:text-slate-100 uppercase tracking-wider mb-3">
                        {tk("example_title")}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700">
                          <XCircle
                            size={16}
                            className="text-red-500 flex-shrink-0 mt-0.5"
                          />
                          <span className="text-xs font-medium text-red-700 dark:text-red-300 leading-relaxed">
                            {screen_data.example.weak}
                          </span>
                        </div>
                        <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700">
                          <CheckCircle
                            size={16}
                            className="text-emerald-500 flex-shrink-0 mt-0.5"
                          />
                          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300 leading-relaxed">
                            {screen_data.example.strong}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-8 px-2">
                <button
                  onClick={prevContent}
                  disabled={isFirst}
                  aria-label={t("ova.nav.prev_aria")}
                  className="p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 text-petroleum dark:text-slate-100 rounded-xl disabled:opacity-30 hover:border-corporate transition-all disabled:cursor-not-allowed"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="flex gap-2">
                  {contentScreens.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-700 ${i === contentIdx ? "w-8 bg-petroleum dark:bg-slate-100" : "w-2 bg-slate-200 dark:bg-slate-600"}`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextContent}
                  className="px-6 py-3 bg-gradient-to-r from-corporate to-petroleum text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center gap-2"
                >
                  {isLast ? tk("start_quiz") : tk("next")}{" "}
                  <ArrowRight size={18} />
                </button>
              </div>
              <footer className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-600 text-center">
                <p className="text-slate-600 dark:text-slate-300 text-xs">
                  {tk("footer")}
                </p>
              </footer>
            </div>
          </div>
          <OVAValerioBar text={getValerioText()} />
        </div>
      </SectionErrorBoundary>
    );
  }

  const currentQ = questionsData[currentQIndex];
  return (
    <SectionErrorBoundary name="OVANotebookBase/Quiz">
      <div className="w-full relative min-h-[400px]">
        <div className="fixed inset-0 -z-10 opacity-60 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[length:50px_50px]" />
        <div className="fixed -top-[15%] -left-[10%] w-[50vw] h-[50vw] -z-10 bg-[radial-gradient(circle,rgba(0,188,212,0.15)_0%,rgba(255,255,255,0)_70%)]" />
        <div className="fixed -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] -z-10 bg-[radial-gradient(circle,rgba(0,75,99,0.08)_0%,rgba(255,255,255,0)_70%)]" />
        <div className="w-full py-6 px-4 relative z-10" key={currentQ.id}>
          <div className="w-full max-w-6xl mx-auto animate-[fadeIn_0.6s_ease-out_forwards]">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <EdutechLogo size="small" />
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-900/30 text-corporate dark:text-teal-200 font-semibold text-[10px] uppercase tracking-[0.15em] border border-corporate/20">
                  <Brain size={14} />
                  <span>{tk("lab_title")}</span>
                </div>
                <span className="text-petroleum dark:text-slate-100 font-semibold bg-white dark:bg-slate-800 px-4 py-1.5 rounded-full border border-gray-200 dark:border-slate-600 shadow-sm text-sm">
                  {tk("node_label", {
                    current: currentQIndex + 1,
                    total: questionsData.length,
                  })}
                </span>
                <span className="text-white font-semibold bg-corporate px-4 py-1.5 rounded-full shadow-[0_0_10px_rgba(0,188,212,0.4)] text-sm">
                  {tk("score_label")} {score}
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5 mb-8 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-corporate to-petroleum h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${((1 + contentScreens.length + currentQIndex) / totalSteps) * 100}%`,
                }}
              />
            </div>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-2/5 flex flex-col gap-6">
                <div
                  className={`relative rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-slate-600 group h-64 ${imageLayoutClass} bg-white dark:bg-slate-800`}
                >
                  <img
                    src={currentQ.image}
                    alt={tk("image_alt")}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-petroleum via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 text-white text-sm font-semibold bg-corporate/90 w-fit px-4 py-1.5 rounded-lg backdrop-blur-md shadow-lg border border-white/20">
                      <Network size={16} /> {tk("scenario_badge")}
                    </div>
                  </div>
                </div>
                {isAnswered && (
                  <div
                    className={`p-6 rounded-2xl border animate-[fadeIn_0.6s_ease-out_forwards] shadow-sm ${selectedOption === currentQ.correct ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500/40" : "bg-red-50 dark:bg-red-900/30 border-red-400/40"}`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      {selectedOption === currentQ.correct ? (
                        <span className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-lg">
                          <CheckCircle size={24} /> {tk("correct_label")}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-red-700 dark:text-red-300 font-bold text-lg">
                          <XCircle size={24} /> {tk("incorrect_label")}
                        </span>
                      )}
                    </div>
                    <p className="text-petroleum dark:text-slate-100 text-sm leading-relaxed font-medium opacity-90">
                      {currentQ.explanation}
                    </p>
                  </div>
                )}
              </div>
              <div className="w-full lg:w-3/5">
                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-corporate/15 shadow-[0_8px_32px_rgba(31,38,135,0.1)] p-6 md:p-10 rounded-3xl h-full flex flex-col border-t-4 border-t-corporate">
                  <h2 className="text-xl md:text-2xl font-semibold text-petroleum dark:text-slate-100 mb-8 leading-relaxed font-montserrat">
                    {currentQ.question}
                  </h2>
                  <div className="space-y-4 flex-grow">
                    {currentQ.options.map((option, index) => {
                      let btnClass =
                        "bg-white/95 dark:bg-slate-800/95 border border-gray-200 dark:border-slate-600 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 enabled:hover:border-corporate enabled:hover:shadow-[0_8px_25px_rgba(0,188,212,0.15)] enabled:hover:-translate-y-0.5 w-full text-left p-4 md:p-5 rounded-2xl flex items-start gap-4 ";
                      let iconClass =
                        "flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base transition-colors ";
                      let textClass =
                        "text-base md:text-lg font-medium transition-colors ";
                      if (!isAnswered) {
                        btnClass += "cursor-pointer";
                        iconClass +=
                          "bg-gray-200 dark:bg-slate-600 text-petroleum dark:text-slate-100";
                        textClass += "text-petroleum/80 dark:text-slate-100/80";
                      } else if (index === currentQ.correct) {
                        btnClass +=
                          "bg-emerald-50 dark:bg-emerald-900/30 !border-emerald-500 shadow-[0_0_20px_rgba(34,197,94,0.15)]";
                        iconClass += "bg-emerald-500 text-white";
                        textClass += "text-emerald-700 dark:text-emerald-300";
                      } else if (index === selectedOption) {
                        btnClass +=
                          "bg-red-50 dark:bg-red-900/30 !border-red-400";
                        iconClass += "bg-red-500 text-white";
                        textClass += "text-red-700 dark:text-red-300";
                      } else {
                        btnClass +=
                          "opacity-50 cursor-not-allowed bg-white dark:bg-slate-800";
                        iconClass +=
                          "bg-gray-200 dark:bg-slate-600 text-petroleum/50 dark:text-slate-100/50";
                        textClass += "text-petroleum/50 dark:text-slate-100/50";
                      }
                      return (
                        <button
                          key={index}
                          onClick={() => handleOptionClick(index)}
                          disabled={isAnswered}
                          className={btnClass}
                        >
                          <div className={iconClass}>
                            {["A", "B", "C", "D"][index]}
                          </div>
                          <span className={textClass}>{option}</span>
                        </button>
                      );
                    })}
                  </div>
                  {!isAnswered && (
                    <div className="mt-6 flex flex-col items-start gap-3 animate-[fadeIn_0.6s_ease-out_forwards]">
                      <button
                        onClick={() => setShowHint(!showHint)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-200/40 dark:bg-slate-700/40 hover:bg-gray-200 dark:hover:bg-slate-700 border border-corporate/30 rounded-xl text-petroleum dark:text-slate-100 font-semibold text-sm transition-all duration-300"
                      >
                        <Lightbulb size={16} />
                        {showHint ? tk("hide_hint") : tk("show_hint")}
                      </button>
                      {showHint && (
                        <div className="w-full p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-corporate/50 rounded-xl text-petroleum dark:text-slate-100 text-sm md:text-base font-medium animate-[fadeIn_0.6s_ease-out_forwards] shadow-inner">
                          <span className="text-corporate font-bold mr-2">
                            {tk("hint_prefix")}
                          </span>{" "}
                          {currentQ.hint}
                        </div>
                      )}
                    </div>
                  )}
                  {isAnswered && (
                    <div className="mt-8 flex justify-end animate-[fadeIn_0.6s_ease-out_forwards]">
                      <button
                        onClick={nextQuestion}
                        className="px-8 py-3.5 bg-petroleum hover:bg-corporate text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-[0_8px_20px_rgba(0,188,212,0.4)] hover:-translate-y-1"
                      >
                        {currentQIndex === questionsData.length - 1
                          ? tk("process_results")
                          : tk("next_node")}{" "}
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <footer className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-600 text-center">
              <p className="text-slate-600 dark:text-slate-300 text-xs">
                {tk("footer")}
              </p>
            </footer>
          </div>
        </div>
        <OVAValerioBar text={getValerioText()} />
      </div>
    </SectionErrorBoundary>
  );
}

OVANotebookBase.propTypes = {
  data: PropTypes.shape({
    contentScreens: PropTypes.array.isRequired,
    questionsData: PropTypes.array.isRequired,
  }).isRequired,
  translationPrefix: PropTypes.string.isRequired,
  imageLayoutClass: PropTypes.string,
  contentPanelMaxHeight: PropTypes.string,
  onComplete: PropTypes.func,
};
