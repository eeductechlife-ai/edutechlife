import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import { ChevronRight, CheckCircle2, XCircle, Trophy } from 'lucide-react'

const Button = ({ children, onClick, className = '', disabled = false }) => (
  <button onClick={onClick} disabled={disabled} className={`flex items-center justify-center gap-2 px-8 py-4 rounded-[2rem] font-black text-sm shadow-xl active:scale-95 transition-all disabled:opacity-30 ${className}`}>{children}</button>
)

const QuizScreen = ({ texts, onNext, addXp, onScore }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const questions = [
    { q: texts.quiz_1_q, o: [texts.quiz_1_o1, texts.quiz_1_o2, texts.quiz_1_o3, texts.quiz_1_o4], c: 1, f: texts.quiz_1_f },
    { q: texts.quiz_2_q, o: [texts.quiz_2_o1, texts.quiz_2_o2, texts.quiz_2_o3, texts.quiz_2_o4], c: 2, f: texts.quiz_2_f },
    { q: texts.quiz_3_q, o: [texts.quiz_3_o1, texts.quiz_3_o2, texts.quiz_3_o3, texts.quiz_3_o4], c: 1, f: texts.quiz_3_f },
    { q: texts.quiz_4_q, o: [texts.quiz_4_o1, texts.quiz_4_o2, texts.quiz_4_o3, texts.quiz_4_o4], c: 2, f: texts.quiz_4_f },
    { q: texts.quiz_5_q, o: [texts.quiz_5_o1, texts.quiz_5_o2, texts.quiz_5_o3, texts.quiz_5_o4], c: 2, f: texts.quiz_5_f }
  ];
  const handleSelect = (idx) => {
    if (showFeedback) return;
    setSelected(idx);
    setShowFeedback(true);
    if (idx === questions[currentQ].c) { setScore(s => s + 1); addXp(100); }
  };
  const handleNext = () => {
    if (currentQ < questions.length - 1) { setCurrentQ(currentQ + 1); setSelected(null); setShowFeedback(false); }
    else { setShowResult(true); onScore?.(score); }
  };
  if (showResult) {
    return (
      <div className="text-center py-4 animate-[zoomIn_0.6s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]">
        <div className="w-20 h-20 bg-[var(--theme-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border-4 border-white dark:border-slate-700"><Trophy className="w-10 h-10 text-[var(--theme-primary)]" /></div>
        <h2 className="text-3xl font-black text-[var(--theme-emphasis)] tracking-tighter leading-none mb-2 uppercase">{texts.quiz_result_title}</h2>
        <div className="bg-[var(--theme-emphasis)] text-white inline-block px-8 py-4 rounded-[2rem] mt-4 text-4xl font-black shadow-lg border-b-4 border-[var(--theme-primary)]">{score} / 5</div>
        <p className="text-slate-500 dark:text-slate-300 mt-4 font-bold text-sm">{score === 5 ? texts.quiz_result_perfect : score >= 3 ? texts.quiz_result_good : texts.quiz_result_keep_trying}</p>
        <Button onClick={onNext} className="mt-6 bg-[var(--theme-emphasis)] text-white mx-auto">{texts.quiz_result_cta}</Button>
      </div>
    );
  }
  return (
    <div className="space-y-6 animate-[fadeIn_1.1s_cubic-bezier(0.16,1,0.3,1)_forwards]">
      <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">
        <span>{texts.quiz_label_question} {currentQ + 1} {texts.quiz_label_of} 5</span>
        <span className="text-[var(--theme-primary)]">{texts.quiz_label_score} {score}</span>
      </div>
      <h3 className="text-xl font-[900] text-[var(--theme-emphasis)] leading-tight">{questions[currentQ].q}</h3>
      <div className="grid gap-2">
        {questions[currentQ].o.map((opt, i) => {
          const isCorrect = showFeedback && i === questions[currentQ].c;
          const isWrong = showFeedback && selected === i && i !== questions[currentQ].c;
          return (
            <motion.button
              key={i}
              onClick={() => handleSelect(i)}
              whileTap={{ scale: 0.97 }}
              aria-pressed={selected === i}
              animate={isCorrect ? { scale: [1, 1.02, 1], transition: { duration: 0.4 } } : isWrong ? { x: [0, -4, 4, -2, 2, 0], transition: { duration: 0.4 } } : {}}
              className={`p-4 rounded-2xl text-left text-sm font-bold border-2 transition-all flex items-center justify-between gap-3 ${isCorrect ? 'bg-green-50 border-green-500 text-green-700 shadow-md' : isWrong ? 'bg-red-50 border-red-500 text-red-700 shadow-md' : showFeedback ? 'bg-slate-50 border-transparent opacity-50' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-[var(--theme-primary)]'}`}
            >
              <span className="flex-1">{opt}</span>
              {isCorrect && <CheckCircle2 className="w-5 h-5 shrink-0 text-green-500" />}
              {isWrong && <XCircle className="w-5 h-5 shrink-0 text-red-500" />}
            </motion.button>
          );
        })}
      </div>
      {showFeedback && (
        <motion.div
          role="alert"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="p-5 bg-slate-100 dark:bg-slate-700 rounded-[2rem]"
        >
          <p className="text-xs font-bold leading-relaxed">{questions[currentQ].f}</p>
          <button onClick={handleNext} aria-label={currentQ === 4 ? texts.quiz_label_see_results : texts.quiz_label_continue} className="mt-4 w-full py-3 bg-[var(--theme-emphasis)] text-white font-black rounded-xl flex items-center justify-center gap-2 text-xs">{currentQ === 4 ? texts.quiz_label_see_results : texts.quiz_label_continue} <ChevronRight size={14} /></button>
        </motion.div>
      )}
    </div>
  );
};

QuizScreen.propTypes = {
  texts: PropTypes.object.isRequired,
  onNext: PropTypes.func.isRequired,
  addXp: PropTypes.func.isRequired,
  onScore: PropTypes.func.isRequired,
}

Button.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

export default QuizScreen
