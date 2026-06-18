import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../i18n/I18nProvider';

export default function VAKQuestionCard({ question, questionNum, total, onAnswer, valeria, valeriaEnabled }) {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswering, setIsAnswering] = useState(false);

  useEffect(() => {
    if (valeriaEnabled && valeria?.readQuestionWithOptions && question) {
      const optionsText = question.options.map((o, i) => `${String.fromCharCode(65 + i)}. ${o.text}`).join('. ');
      valeria.readQuestionWithOptions(question.text, optionsText, questionNum, total);
    }
  }, [question?.id]);

  const handleSelect = (option) => {
    if (isAnswering) return;
    setSelectedOption(option);
    setIsAnswering(true);
    setTimeout(() => {
      onAnswer(option.type);
      setSelectedOption(null);
      setIsAnswering(false);
    }, 300);
  };

  if (!question) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="max-w-2xl mx-auto px-4 py-6"
    >
      <div className="mb-2 text-sm text-gray-500">
        {t('vak.ui.question')} {questionNum} {t('vak.ui.of')} {total}
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-gradient-to-r from-[#004B63] to-[#4DA8C4] h-2 rounded-full transition-all duration-500"
          style={{ width: `${(questionNum / total) * 100}%` }}
        />
      </div>

      <h2 className="text-xl font-semibold text-[#004B63] mb-6">{question.text}</h2>

      <div className="space-y-3">
        {question.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(option)}
            disabled={isAnswering}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
              selectedOption === option
                ? 'border-[#4DA8C4] bg-[#4DA8C4]/10 scale-[1.02]'
                : 'border-gray-100 bg-white hover:border-[#4DA8C4]/50 hover:shadow-md'
            } ${isAnswering ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span className="font-medium text-gray-800">{option.text}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
