import { useState } from 'react'
import PropTypes from 'prop-types';;
import { motion } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import { useTranslation } from '../../i18n/I18nProvider';
import { cn } from '../forum/forumDesignSystem';
import { OVALayout, OVAIntro } from './shared';
import OvaGeminiSlides from './ova/OvaGeminiSlides';
import OvaGeminiQuiz from './ova/OvaGeminiQuiz';
import { GEMINI_SLIDE_TABS, SLIDE_ICONS, SLIDE_TITLES_ES, SLIDE_TITLES_EN, SLIDE_DESCRIPTIONS_ES, SLIDE_DESCRIPTIONS_EN, SLIDE_CONTENT_ES, SLIDE_CONTENT_EN, QUIZ_DATA } from './ova/ovaData';

const OvaEdutechlife = ({ onComplete }) => {
  const { t, locale } = useTranslation();
  const [screen, setScreen] = useState('intro');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [completed, setCompleted] = useState(false);

  const isES = locale === 'es';
  const slideTitles = isES ? SLIDE_TITLES_ES : SLIDE_TITLES_EN;
  const slideDescs = isES ? SLIDE_DESCRIPTIONS_ES : SLIDE_DESCRIPTIONS_EN;
  const slideContent = isES ? SLIDE_CONTENT_ES : SLIDE_CONTENT_EN;
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

  const isAllCorrect = showResults && quiz.every((q, idx) => selectedAnswers[idx] === q.correct);

  const handleComplete = () => {
    if (completed) return;
    setCompleted(true);
    if (onComplete) onComplete();
  };

  const totalQuestions = quiz.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = showResults
    ? quiz.filter((q, idx) => selectedAnswers[idx] === q.correct).length
    : 0;

  if (screen === 'intro') {
    const introText = isES
      ? 'Bienvenido al Recorrido Interactivo de Gemini. Vamos a explorar la arquitectura, la multimodalidad, el deep research y la integración con Google Workspace. ¡Comencemos!'
      : 'Welcome to the Interactive Gemini Tour. Let\'s explore the architecture, multimodality, deep research and Google Workspace integration. Let\'s begin!';

    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl">
        <OVAIntro
          icon="fa-brain"
          badge={isES ? 'OVA Interactivo' : 'Interactive OVA'}
          title={isES ? 'Recorrido Interactivo: Gemini' : 'Interactive Tour: Gemini'}
          description={isES
            ? 'Explora la arquitectura, la multimodalidad, el deep research y la integración con Google Workspace de Gemini en 5 paradas interactivas.'
            : 'Explore Gemini\'s architecture, multimodality, deep research and Google Workspace integration in 5 interactive stops.'}
          audioText={introText}
          onStart={() => setScreen('slides')}
          startLabel={isES ? 'Comenzar Recorrido' : 'Start Tour'}
        />
      </div>
    );
  }

  const currentTabId = GEMINI_SLIDE_TABS[currentSlide]?.id || 'arquitectura';

  const getValerioText = () => {
    if (currentSlide < 4) {
      const content = slideContent[currentSlide];
      return `${slideTitles[currentSlide]}. ${content.paragraphs.join(' ')}`;
    }
    return isES
      ? 'Pon a prueba lo aprendido responde las preguntas del quiz final.'
      : 'Test what you have learned by answering the final quiz questions.';
  };

  const handlePrev = () => { if (currentSlide > 0) goToSlide(currentSlide - 1); };
  const handleNext = () => { if (currentSlide < 4) goToSlide(currentSlide + 1); };

  const isQuizComplete = showResults && isAllCorrect;

  return (
    <OVALayout
      icon="fa-brain"
      title={isES ? 'Recorrido Interactivo: Gemini' : 'Interactive Tour: Gemini'}
      tabs={GEMINI_SLIDE_TABS}
      currentTab={currentTabId}
      onTabChange={(idx) => goToSlide(idx)}
      valerioText={getValerioText()}
      valerioAutoPlay={false}
      showNav={!isQuizComplete}
      nextLabel={isES ? 'Siguiente' : 'Next'}
      prevLabel={isES ? 'Anterior' : 'Previous'}
    >
      <div className="max-w-3xl mx-auto">
        {currentSlide < 4
          ? <OvaGeminiSlides currentSlide={currentSlide} slideContent={slideContent} slideDescs={slideDescs} slideTitles={slideTitles} />
          : <OvaGeminiQuiz
              quiz={quiz}
              selectedAnswers={selectedAnswers}
              showResults={showResults}
              isAllCorrect={isAllCorrect}
              answeredCount={answeredCount}
              totalQuestions={totalQuestions}
              correctCount={correctCount}
              handleAnswerSelect={handleAnswerSelect}
              handleCheckAnswers={handleCheckAnswers}
              handleComplete={handleComplete}
              isES={isES}
            />
        }
      </div>
    </OVALayout>
  );
};


OvaEdutechlife.propTypes = {
  onComplete: PropTypes.any,
};

export default OvaEdutechlife;
