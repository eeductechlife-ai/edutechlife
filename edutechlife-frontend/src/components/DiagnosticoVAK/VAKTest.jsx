import React, { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../i18n/I18nProvider';
import VAKQuestionCard from './VAKQuestionCard';

export default function VAKTest({ questions, currentQuestion, onAnswer, valeria, valeriaEnabled }) {
  const { t } = useTranslation();
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const handleAnswer = useCallback((type) => {
    if ((currentQuestion + 1) % 3 === 0 && currentQuestion > 0 && valeriaEnabled && valeria?.giveEncouragementNoName) {
      setTimeout(() => valeria.giveEncouragementNoName(), 500);
    }
    onAnswer(type);
  }, [currentQuestion, onAnswer, valeria, valeriaEnabled]);

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  return (
    <div>
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
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
