import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import SectionErrorBoundary from "./SectionErrorBoundary";
import { Icon } from "../../utils/iconMapping.jsx";
import { useTranslation } from "../../i18n/I18nProvider";
import { cn } from "../forum/forumDesignSystem";
import { OVALayout, OVAIntro } from "./shared";
import OvaGeminiSlides from "./ova/OvaGeminiSlides";
import OvaGeminiQuiz from "./ova/OvaGeminiQuiz";
import {
  GEMINI_SLIDE_TABS,
  SLIDE_ICONS,
  SLIDE_TITLES_ES,
  SLIDE_TITLES_EN,
  SLIDE_DESCRIPTIONS_ES,
  SLIDE_DESCRIPTIONS_EN,
  SLIDE_CONTENT_ES,
  SLIDE_CONTENT_EN,
  QUIZ_DATA,
} from "./ova/ovaData";

const OvaEdutechlife = ({ onComplete }) => {
  const { t, locale } = useTranslation();
  const [screen, setScreen] = useState("intro");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [completed, setCompleted] = useState(false);

  const slideTitles = locale === "es" ? SLIDE_TITLES_ES : SLIDE_TITLES_EN;
  const slideDescs =
    locale === "es" ? SLIDE_DESCRIPTIONS_ES : SLIDE_DESCRIPTIONS_EN;
  const slideContent = locale === "es" ? SLIDE_CONTENT_ES : SLIDE_CONTENT_EN;
  const quiz = QUIZ_DATA[locale] || QUIZ_DATA.es;

  const goToSlide = (index) => {
    setCurrentSlide(index);
    if (index < 4) setShowResults(false);
  };

  const handleAnswerSelect = (questionIndex, optionId) => {
    if (showResults) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: optionId }));
  };

  const handleCheckAnswers = () => setShowResults(true);

  const totalQuestions = quiz.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = showResults
    ? quiz.filter((q, idx) => selectedAnswers[idx] === q.correct).length
    : 0;

  const isPassed = showResults && correctCount >= 3;

  const handleComplete = () => {
    if (completed) return;
    setCompleted(true);
    if (onComplete) onComplete();
  };

  const isQuizComplete = isPassed;

  useEffect(() => {
    if (isPassed && !completed) {
      handleComplete();
    }
  }, [isPassed, completed]);

  if (screen === "intro") {
    return (
      <SectionErrorBoundary name="OvaEdutechlife/Intro">
        <div className="w-full h-full bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl">
          <OVAIntro
            icon="fa-brain"
            badge={t("ova.tour.interactive_badge")}
            title={t("ova.tour.title")}
            description={t("ova.tour.description")}
            audioText={t("ova.tour.welcome_audio")}
            onStart={() => setScreen("slides")}
            startLabel={t("ova.tour.start_btn")}
          />
        </div>
      </SectionErrorBoundary>
    );
  }

  const currentTabId = GEMINI_SLIDE_TABS[currentSlide]?.id || "arquitectura";

  const getValerioText = () => {
    if (currentSlide < 4) {
      const content = slideContent[currentSlide];
      return `${slideTitles[currentSlide]}. ${content.paragraphs.join(" ")}`;
    }
    return t("ova.tour.valerio_quiz_text");
  };

  const handlePrev = () => {
    if (currentSlide > 0) goToSlide(currentSlide - 1);
  };
  const handleNext = () => {
    if (currentSlide < 4) goToSlide(currentSlide + 1);
  };

  return (
    <SectionErrorBoundary name="OvaEdutechlife/Main">
      <OVALayout
        icon="fa-brain"
        title={t("ova.tour.title")}
        tabs={GEMINI_SLIDE_TABS}
        currentTab={currentTabId}
        onTabChange={(idx) => goToSlide(idx)}
        valerioText={getValerioText()}
        valerioAutoPlay={false}
        showNav={!isQuizComplete}
        nextLabel={t("ova.nav.next")}
        prevLabel={t("ova.nav.prev")}
      >
        <div className="max-w-3xl mx-auto">
          {currentSlide < 4 ? (
            <OvaGeminiSlides
              currentSlide={currentSlide}
              slideContent={slideContent}
              slideDescs={slideDescs}
              slideTitles={slideTitles}
            />
          ) : (
            <OvaGeminiQuiz
              quiz={quiz}
              selectedAnswers={selectedAnswers}
              showResults={showResults}
              isAllCorrect={isPassed}
              answeredCount={answeredCount}
              totalQuestions={totalQuestions}
              correctCount={correctCount}
              handleAnswerSelect={handleAnswerSelect}
              handleCheckAnswers={handleCheckAnswers}
              handleComplete={handleComplete}
            />
          )}
        </div>
      </OVALayout>
    </SectionErrorBoundary>
  );
};

OvaEdutechlife.propTypes = {
  onComplete: PropTypes.func,
};

export default OvaEdutechlife;
