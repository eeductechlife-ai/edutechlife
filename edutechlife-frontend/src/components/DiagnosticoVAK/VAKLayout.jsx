import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from '../../i18n/I18nProvider';
import useValentinaAgent from '../../hooks/useValentinaAgent';
import useVAKScoring from '../../hooks/useVAKScoring';
import { getQuestionsByAge } from '../../data/vakQuestions';
import VAKWelcome from './VAKWelcome';
import VAKCalibration from './VAKCalibration';
import VAKTest from './VAKTest';
import VAKResultReport from './VAKResultReport';
import VAKPDFPreview from './VAKPDFPreview';
import { safeStorage } from '../../utils/storage';

export default function VAKLayout({ onNavigate }) {
  const { t } = useTranslation();
  const [phase, setPhase] = useState('intro');
  const [studentData, setStudentData] = useState({ name: '', age: 12, email: '', phone: '', mood: 'neutral' });
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [valeriaEnabled, setValeriaEnabled] = useState(() => {
    const pref = safeStorage.getItem('edutechlife_valeria_enabled');
    return pref === null ? true : pref === 'true';
  });

  const valeria = useValentinaAgent({
    studentName: studentData.name,
    studentAge: studentData.age,
    phase,
    currentQuestion,
    totalQuestions: questions.length,
    enabled: valeriaEnabled,
  });

  const score = useVAKScoring(answers);

  useEffect(() => {
    safeStorage.setItem('edutechlife_valeria_enabled', valeriaEnabled);
  }, [valeriaEnabled]);

  const handleStart = useCallback(() => {
    setPhase('calibration');
  }, []);

  const handleCalibrationComplete = useCallback((data) => {
    setStudentData(prev => ({ ...prev, ...data }));
    const qs = getQuestionsByAge(data.age);
    setQuestions(qs);
    setCurrentQuestion(0);
    setAnswers([]);
    setPhase('test');
  }, []);

  const handleAnswer = useCallback((answerType) => {
    setAnswers(prev => [...prev, { type: answerType }]);
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setTimeout(() => setPhase('result'), 500);
    }
  }, [currentQuestion, questions.length]);

  const handleViewPDF = useCallback(() => setPhase('preview'), []);
  const handleBackToResults = useCallback(() => setPhase('result'), []);
  const handleRestart = useCallback(() => {
    setPhase('intro');
    setCurrentQuestion(0);
    setAnswers([]);
    setQuestions([]);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <VAKWelcome
              key="intro"
              onStart={handleStart}
              valeriaEnabled={valeriaEnabled}
              onToggleValeria={setValeriaEnabled}
              valeria={valeria}
            />
          )}
          {phase === 'calibration' && (
            <VAKCalibration
              key="calibration"
              initialData={studentData}
              onComplete={handleCalibrationComplete}
              valeria={valeria}
            />
          )}
          {phase === 'test' && (
            <VAKTest
              key="test"
              questions={questions}
              currentQuestion={currentQuestion}
              onAnswer={handleAnswer}
              valeria={valeria}
              valeriaEnabled={valeriaEnabled}
            />
          )}
          {phase === 'result' && (
            <VAKResultReport
              key="result"
              studentData={studentData}
              score={score}
              onViewPDF={handleViewPDF}
              onRestart={handleRestart}
              valeria={valeria}
            />
          )}
          {phase === 'preview' && (
            <VAKPDFPreview
              key="preview"
              studentData={studentData}
              score={score}
              onBack={handleBackToResults}
              onRestart={handleRestart}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
