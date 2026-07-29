import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "../../i18n/I18nProvider";
import {
  Briefcase,
  CheckCircle,
  XCircle,
  Award,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  Target,
  Brain,
  ChevronRight,
  Star,
  Building2,
} from "lucide-react";
import { challenges, learningObjectives } from "../../data/ova/practicalCases";
import { OVAIntro, OVAValerioBar } from "./shared";

const OVAPracticalCases = ({ onComplete }) => {
  const { t } = useTranslation();
  const certCompletedRef = useRef(false);
  const [screen, setScreen] = useState("intro");
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState({});

  const totalChallenges = challenges.length;
  const correctCount = Object.values(answers).filter((a) => a.correct).length;
  const allAnswered = Object.keys(answers).length === totalChallenges;

  useEffect(() => {
    if (allAnswered && !certCompletedRef.current) {
      certCompletedRef.current = true;
      onComplete?.();
    }
  }, [allAnswered, onComplete]);

  const handleAnswer = (idx) => {
    if (showFeedback) return;
    setSelectedAnswer(idx);
    setShowFeedback(true);
    setAnswers((prev) => ({
      ...prev,
      [currentChallenge]: {
        correct: idx === challenges[currentChallenge].correct,
      },
    }));
  };

  const nextChallenge = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    if (currentChallenge < totalChallenges - 1) {
      setCurrentChallenge(currentChallenge + 1);
    }
  };

  const prevChallenge = () => {
    if (currentChallenge > 0) {
      setSelectedAnswer(null);
      setShowFeedback(false);
      setCurrentChallenge(currentChallenge - 1);
    }
  };

  const getValerioText = () => {
    if (screen === "intro") {
      return t("ova.practical.welcome_text");
    }
    const c = challenges[currentChallenge];
    return `${c.title}. ${c.scenario} ${c.options.join(". ")}`;
  };

  if (screen === "intro") {
    return (
      <div className="w-full h-full bg-gradient-to-br from-cyan-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center rounded-2xl">
        <OVAIntro
          icon="fa-briefcase"
          badge={t("ova.practical.badge")}
          title={t("ova.practical.title")}
          description={t("ova.practical.description")}
          audioText={t("ova.practical.audio_text")}
          onStart={() => setScreen("slides")}
          startLabel={t("ova.practical.start_btn")}
          objectives={learningObjectives}
        />
      </div>
    );
  }

  const c = challenges[currentChallenge];
  const isCorrect = selectedAnswer === challenges[currentChallenge].correct;

  return (
    <div className="w-full bg-gradient-to-br from-cyan-50 to-white dark:from-gray-900 dark:to-gray-800 text-slate-800 font-sans flex flex-col md:flex-row overflow-hidden relative min-h-[500px] rounded-2xl">
      <aside className="w-full md:w-64 bg-white/90 dark:bg-slate-800/90 flex flex-col shadow-xl z-10 md:min-h-full border-r border-cyan-100 dark:border-gray-700" aria-label={t("ova.practical.sidebar_badge")}>
        <div className="p-6 text-center border-b border-cyan-50 dark:border-gray-700">
          <div className="flex items-center gap-2 justify-center select-none">
            <div className="relative w-9 h-9 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-corporate to-petroleum rounded-xl rotate-3 shadow-md"></div>
              <Brain className="w-5 h-5 text-white relative z-10" />
            </div>
            <div className="text-xl tracking-tighter flex items-center lowercase font-bold">
              <span className="text-corporate">edu</span>
              <span className="text-petroleum">techlife</span>
            </div>
          </div>
          <p className="text-[10px] uppercase mt-2 text-slate-600 dark:text-slate-300 font-bold tracking-[0.2em]">
            {t("ova.practical.sidebar_badge")}
          </p>
        </div>

        <div className="p-4 space-y-2">
          <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-petroleum uppercase tracking-wider">
            <Target size={14} />
            <span>{t("ova.practical.progress")}</span>
            <span className="ml-auto text-corporate">
              {correctCount}/{totalChallenges}
            </span>
          </div>
          {challenges.map((ch, i) => (
            <button
              key={ch.id}
              onClick={() => {
                if (!showFeedback && currentChallenge !== i) {
                  setCurrentChallenge(i);
                  setSelectedAnswer(null);
                  setShowFeedback(false);
                }
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm ${
                i === currentChallenge
                  ? "bg-gradient-to-r from-corporate to-petroleum text-white font-semibold shadow-lg"
                  : answers[i]
                    ? answers[i].correct
                      ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
                      : "bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300"
                    : "text-slate-500 dark:text-slate-400 hover:bg-cyan-50 hover:text-petroleum"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  i === currentChallenge
                    ? "bg-white/20 text-white"
                    : answers[i]
                      ? answers[i].correct
                        ? "bg-emerald-400 text-white"
                        : "bg-rose-400 text-white"
                      : "bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-300"
                }`}
              >
                {answers[i] ? (
                  answers[i].correct ? (
                    <CheckCircle size={12} />
                  ) : (
                    <XCircle size={12} />
                  )
                ) : (
                  i + 1
                )}
              </span>
              <span className="truncate">{ch.title}</span>
              {i === currentChallenge && (
                <ChevronRight size={14} className="ml-auto" />
              )}
            </button>
          ))}
        </div>

        {allAnswered && (
          <div className="p-4 mt-auto border-t border-cyan-50 dark:border-gray-700">
            <div className="p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10 rounded-xl border border-emerald-200 dark:border-emerald-800 text-center">
              <Award className="w-8 h-8 text-emerald-500 mx-auto mb-1" />
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                {correctCount === totalChallenges
                  ? t("ova.practical.perfect_score")
                  : `${correctCount}/${totalChallenges} ${t("ova.practical.correct")}`}
              </p>
            </div>
          </div>
        )}
      </aside>

      <main
        className="flex-1 p-4 md:p-10 overflow-y-auto relative"
        style={{ maxHeight: "100vh" }}
      >
        <div className="max-w-5xl mx-auto bg-white/85 dark:bg-slate-800/85 backdrop-blur-[20px] border border-corporate/15 shadow-xl rounded-3xl p-6 md:p-10 min-h-[80vh] flex flex-col relative z-10 border-t-4 border-t-corporate">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-corporate to-petroleum flex items-center justify-center shadow-md">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-petroleum dark:text-slate-100 font-montserrat">
                  {c.title}
                </h2>
                <span className="text-xs text-corporate font-semibold">
                  {t("ova.practical.challenge")} {currentChallenge + 1} /{" "}
                  {totalChallenges}
                </span>
              </div>
            </div>
            <div className="flex gap-1" role="group" aria-label={t("ova.practical.progress")}>
              {challenges.map((_, i) => (
                <div
                  key={i}
                  aria-hidden="true"
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    answers[i]?.correct
                      ? "bg-emerald-400"
                      : answers[i]
                        ? "bg-rose-400"
                        : i === currentChallenge
                          ? "bg-corporate scale-125"
                          : "bg-slate-200 dark:bg-slate-600"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex-1 bg-slate-50 dark:bg-slate-700/30 rounded-2xl p-6 md:p-8 border border-slate-100 dark:border-slate-700">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="text-corporate" size={18} />
                <span className="text-xs uppercase tracking-widest text-corporate font-bold">
                  {t("ova.practical.context_label")}
                </span>
              </div>
              <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-cyan-100 dark:border-slate-600 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-2">
                  <Lightbulb
                    size={16}
                    className="text-amber-500 flex-shrink-0 mt-0.5"
                  />
                  <span>{c.context}</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="text-corporate" size={18} />
                <span className="text-xs uppercase tracking-widest text-corporate font-bold">
                  {t("ova.practical.scenario_label")}
                </span>
              </div>
              <p className="text-lg text-slate-800 dark:text-slate-100 font-medium leading-relaxed">
                {c.scenario}
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-3">
                {t("ova.practical.best_option")}
              </p>
              {c.options.map((opt, idx) => {
                const isSelected = selectedAnswer === idx;
                const isOptCorrect =
                  idx === challenges[currentChallenge].correct;
                const showResult = showFeedback && isSelected;
                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={showFeedback}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all text-sm md:text-base
                      ${
                        showResult && isOptCorrect
                          ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-400 text-emerald-900 dark:text-emerald-100"
                          : showResult && !isOptCorrect
                            ? "bg-rose-50 dark:bg-rose-900/20 border-rose-300 text-rose-900 dark:text-rose-100"
                            : isSelected
                              ? "border-corporate bg-cyan-50 dark:bg-slate-700 shadow-md"
                              : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-corporate hover:bg-cyan-50/50"
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5
                        ${
                          showResult && isOptCorrect
                            ? "bg-emerald-500 text-white"
                            : showResult && !isSelected
                              ? "bg-slate-200 dark:bg-slate-600 text-slate-500"
                              : showResult && isSelected
                                ? "bg-rose-500 text-white"
                                : "bg-corporate/20 text-petroleum dark:text-slate-300"
                        }`}
                      >
                        {showResult && isOptCorrect ? (
                          <CheckCircle size={14} />
                        ) : showResult && isSelected ? (
                          <XCircle size={14} />
                        ) : (
                          String.fromCharCode(65 + idx)
                        )}
                      </span>
                      <span>{opt}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {showFeedback && (
              <div
                className={`mt-6 p-5 rounded-2xl border-l-8 ${
                  isCorrect
                    ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-400"
                    : "bg-rose-50 dark:bg-rose-900/20 border-rose-400"
                }`}
              >
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle
                      className="text-emerald-500 flex-shrink-0 mt-0.5"
                      size={20}
                    />
                  ) : (
                    <XCircle
                      className="text-rose-500 flex-shrink-0 mt-0.5"
                      size={20}
                    />
                  )}
                  <div>
                    <p
                      className={`font-bold mb-1 ${
                        isCorrect
                          ? "text-emerald-800 dark:text-emerald-200"
                          : "text-rose-800 dark:text-rose-200"
                      }`}
                    >
                      {isCorrect
                        ? t("ova.practical.correct_feedback")
                        : t("ova.practical.incorrect_feedback")}
                    </p>
                    <p
                      className={`text-sm ${
                        isCorrect
                          ? "text-emerald-700 dark:text-emerald-300"
                          : "text-rose-700 dark:text-rose-300"
                      }`}
                    >
                      {c.feedback}
                    </p>
                    <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl">
                      <div className="flex items-start gap-2">
                        <Star
                          size={14}
                          className="text-amber-500 flex-shrink-0 mt-0.5"
                        />
                        <p className="text-xs text-amber-800 dark:text-amber-200 font-medium">
                          <span className="font-bold">
                            {t("ova.practical.pro_tip")}
                          </span>{" "}
                          {c.tip}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-6">
              {currentChallenge > 0 && !showFeedback && (
                <button
                  onClick={prevChallenge}
                  className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-petroleum transition-colors"
                >
                  <ArrowLeft size={14} />
                  {t("ova.practical.previous")}
                </button>
              )}
              <div className="ml-auto flex gap-3">
                {showFeedback && currentChallenge < totalChallenges - 1 && (
                  <button
                    onClick={nextChallenge}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-corporate to-petroleum text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm"
                  >
                    {t("ova.practical.next_challenge")}
                    <ArrowRight size={16} />
                  </button>
                )}
                {showFeedback && currentChallenge === totalChallenges - 1 && (
                  <button
                    onClick={() => {}}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm cursor-default opacity-80"
                  >
                    <Award size={16} />
                    {t("ova.practical.completed_prefix")} ({correctCount}/
                    {totalChallenges})
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <footer className="mt-4 text-center text-slate-600 dark:text-slate-300 text-xs py-4" aria-label={t("ova.practical.footer")}>
          {t("ova.practical.footer")}
        </footer>
      </main>

      <OVAValerioBar text={getValerioText()} />
    </div>
  );
};

OVAPracticalCases.propTypes = {
  onComplete: PropTypes.func,
};

export default OVAPracticalCases;
