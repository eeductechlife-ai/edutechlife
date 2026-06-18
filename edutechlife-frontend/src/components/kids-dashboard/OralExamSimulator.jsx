import { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { callDeepseek } from '../../utils/api';
import { useSmartBoardKids } from '../../context/SmartBoardKidsContext';

const SUBJECTS = [
  { id: 'matematicas', label: 'Matemáticas', icon: '🔢', color: '#4DA8C4' },
  { id: 'lenguaje', label: 'Lenguaje', icon: '📖', color: '#FF6B9D' },
  { id: 'ciencias', label: 'Ciencias Naturales', icon: '🔬', color: '#66CCCC' },
  { id: 'sociales', label: 'Ciencias Sociales', icon: '🌍', color: '#FFD166' },
  { id: 'ingles', label: 'Inglés', icon: '🇬🇧', color: '#A855F7' },
];

const DIFFICULTIES = [
  { id: 'facil', label: 'Fácil', color: '#22C55E', icon: '🌱' },
  { id: 'medio', label: 'Medio', color: '#EAB308', icon: '🔥' },
  { id: 'dificil', label: 'Difícil', color: '#EF4444', icon: '💀' },
];

const dc = (dm, l, d) => dm ? d : l;

const OralExamSimulator = memo(() => {
  const { darkMode: dm, addPoints } = useSmartBoardKids();
  const [phase, setPhase] = useState('setup');
  const [subject, setSubject] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [openAnswer, setOpenAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [results, setResults] = useState(null);
  const [animateScore, setAnimateScore] = useState(false);

  const generateExam = useCallback(async () => {
    setLoading(true);
    try {
      const prompt = `Genera un examen oral de ${subject.label} nivel ${difficulty.label} para un estudiante colombiano de grado 6-7. Debe tener 4 preguntas. Las primeras 3 son opción múltiple con 4 opciones (A, B, C, D) y solo 1 correcta. La última es una pregunta abierta. Responde SOLO con JSON:
{
  "questions": [
    { "type": "multiple", "question": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": "A", "explanation": "..." },
    { "type": "multiple", "question": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": "C", "explanation": "..." },
    { "type": "multiple", "question": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": "B", "explanation": "..." },
    { "type": "open", "question": "...", "modelAnswer": "puntos clave que debe incluir la respuesta", "explanation": "..." }
  ]
}`;
      const res = await callDeepseek(prompt, { temperature: 0.7, maxTokens: 1500, isJson: true });
      const parsed = typeof res === 'string' ? JSON.parse(res) : res;
      setQuestions(parsed.questions || []);
      setPhase('exam');
      setCurrentQ(0);
      setAnswers([]);
      setFeedback(null);
    } catch (e) {
      console.warn('Error generating exam:', e);
    }
    setLoading(false);
  }, [subject, difficulty]);

  const handleAnswer = useCallback(() => {
    const q = questions[currentQ];
    let isCorrect = false;
    let answerText = '';

    if (q.type === 'multiple') {
      isCorrect = selectedOption === q.correct;
      answerText = selectedOption;
    } else {
      answerText = openAnswer;
      isCorrect = openAnswer.trim().length > 10;
    }

    if (isCorrect && q.type === 'multiple') {
      addPoints(10, `Acertó pregunta oral de ${subject.label}`);
    }

    const newAnswers = [...answers, { questionIdx: currentQ, answer: answerText, correct: isCorrect }];
    setAnswers(newAnswers);

    setFeedback({ correct: isCorrect, explanation: q.explanation });

    if (currentQ < questions.length - 1) {
      setTimeout(() => {
        setCurrentQ(prev => prev + 1);
        setFeedback(null);
        setSelectedOption(null);
        setOpenAnswer('');
      }, 2000);
    } else {
      setTimeout(() => {
        const correctCount = newAnswers.filter(a => a.correct).length;
        const grade = Math.round((correctCount / questions.length) * 100);
        const earnedPoints = correctCount * 10;
        addPoints(earnedPoints, `Completó examen oral de ${subject.label}`);
        setResults({ correctCount, total: questions.length, grade, earnedPoints });
        setAnimateScore(true);
        setPhase('results');
      }, 2000);
    }
  }, [currentQ, questions, selectedOption, openAnswer, answers, addPoints, subject]);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B9D] to-[#A855F7] flex items-center justify-center text-lg shadow-md">🧪</div>
        <div>
          <h3 className={`text-lg font-bold ${dc(dm, 'text-[#004B63]', 'text-[#E2F0FF]')}`}>Examen Oral</h3>
          <p className={`text-xs ${dc(dm, 'text-[#64748B]', 'text-[#94A3B8]')}`}>Pon a prueba tus conocimientos con Dani</p>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {phase === 'setup' && (
          <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div>
              <p className={`text-sm font-semibold mb-3 ${dc(dm, 'text-[#004B63]', 'text-white')}`}>Selecciona la materia</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {SUBJECTS.map((s) => (
                  <motion.button
                    key={s.id}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setSubject(s)}
                    className={`p-4 rounded-2xl border-2 text-center transition-all ${
                      subject?.id === s.id
                        ? 'border-[#4DA8C4] bg-[#4DA8C4]/5'
                        : dc(dm, 'border-[#334155] bg-[#1E293B]', 'border-[#E2E8F0] bg-white')
                    }`}
                  >
                    <span className="text-3xl block mb-1">{s.icon}</span>
                    <p className={`text-xs font-bold ${dc(dm, 'text-white', 'text-[#004B63]')}`}>{s.label}</p>
                  </motion.button>
                ))}
              </div>
            </div>

            {subject && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <p className={`text-sm font-semibold mb-3 ${dc(dm, 'text-[#004B63]', 'text-white')}`}>Selecciona la dificultad</p>
                <div className="flex gap-3">
                  {DIFFICULTIES.map((d) => (
                    <motion.button
                      key={d.id}
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => setDifficulty(d)}
                      className={`flex-1 p-4 rounded-2xl border-2 text-center transition-all ${
                        difficulty?.id === d.id
                          ? 'border-[#4DA8C4] bg-[#4DA8C4]/5'
                          : dc(dm, 'border-[#334155] bg-[#1E293B]', 'border-[#E2E8F0] bg-white')
                      }`}
                    >
                      <span className="text-2xl block mb-1">{d.icon}</span>
                      <p className={`text-xs font-bold ${dc(dm, 'text-white', 'text-[#004B63]')}`}>{d.label}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {subject && difficulty && (
              <motion.button
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={generateExam}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-[#FF6B9D] to-[#A855F7] text-white rounded-2xl font-bold text-base shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <><motion.div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} /> Generando examen...</>
                ) : (
                  <><span className="text-xl">🎯</span> Iniciar Examen Oral</>
                )}
              </motion.button>
            )}
          </motion.div>
        )}

        {phase === 'exam' && questions[currentQ] && (
          <motion.div key="exam" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-[#E2E8F0] overflow-hidden">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]"
                  initial={{ width: 0 }} animate={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                />
              </div>
              <span className={`text-xs font-bold ${dc(dm, 'text-white', 'text-[#004B63]')}`}>{currentQ + 1}/{questions.length}</span>
            </div>

            <motion.div key={currentQ} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
              className={`p-6 rounded-2xl border ${dc(dm, 'bg-[#1E293B] border-[#334155]', 'bg-white border-[#E2E8F0] shadow-sm')}`}
            >
              <div className="flex items-start gap-3 mb-4">
                <span className="text-2xl">{questions[currentQ].type === 'multiple' ? '❓' : '✍️'}</span>
                <div>
                  <p className={`text-xs font-semibold mb-1 ${dc(dm, 'text-[#4DA8C4]', 'text-[#004B63]')}`}>
                    {questions[currentQ].type === 'multiple' ? 'Selección múltiple' : 'Pregunta abierta'}
                  </p>
                  <p className={`text-base font-semibold ${dc(dm, 'text-white', 'text-[#1E293B]')}`}>{questions[currentQ].question}</p>
                </div>
              </div>

              {questions[currentQ].type === 'multiple' ? (
                <div className="space-y-2">
                  {questions[currentQ].options.map((opt, i) => {
                    const letter = String.fromCharCode(65 + i);
                    return (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                        onClick={() => !feedback && setSelectedOption(opt.charAt(0))}
                        className={`w-full p-3 rounded-xl border-2 text-left text-sm transition-all flex items-center gap-3 ${
                          feedback
                            ? opt.charAt(0) === questions[currentQ].correct
                              ? 'border-green-400 bg-green-50 text-green-700'
                              : selectedOption === opt.charAt(0)
                                ? 'border-red-400 bg-red-50 text-red-700'
                                : dc(dm, 'border-[#334155] opacity-50', 'border-[#E2E8F0] opacity-50')
                            : selectedOption === opt.charAt(0)
                              ? 'border-[#4DA8C4] bg-[#4DA8C4]/5'
                              : dc(dm, 'border-[#334155] hover:border-[#4DA8C4]/50', 'border-[#E2E8F0] hover:border-[#4DA8C4]/50')
                        } ${dc(dm, 'text-[#CBD5E1]', 'text-[#475569]')}`}
                        disabled={!!feedback}
                      >
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          feedback && opt.charAt(0) === questions[currentQ].correct
                            ? 'bg-green-400 text-white'
                            : feedback && selectedOption === opt.charAt(0)
                              ? 'bg-red-400 text-white'
                              : dc(dm, 'bg-[#334155] text-[#94A3B8]', 'bg-[#F1F5F9] text-[#64748B]')
                        }`}>
                          {letter}
                        </span>
                        {opt.substring(3)}
                      </motion.button>
                    );
                  })}
                </div>
              ) : (
                <textarea
                  value={openAnswer}
                  onChange={(e) => setOpenAnswer(e.target.value)}
                  disabled={!!feedback}
                  placeholder="Escribe tu respuesta aquí..."
                  rows={4}
                  className={`w-full p-3 rounded-xl border text-sm resize-none ${
                    feedback
                      ? 'border-green-400 bg-green-50'
                      : dc(dm, 'bg-[#0F172A] border-[#334155] text-white', 'bg-[#F8FAFC] border-[#E2E8F0] text-[#334155]')
                  } focus:outline-none focus:ring-2 focus:ring-[#4DA8C4]`}
                />
              )}

              <AnimatePresence>
                {feedback && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 p-4 rounded-xl ${feedback.correct ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}
                  >
                    <p className="text-sm font-bold mb-1">{feedback.correct ? '✅ ¡Correcto!' : '❌ Incorrecto'}</p>
                    <p className="text-xs text-[#64748B]">{feedback.explanation}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {!feedback && (
                <motion.button
                  onClick={handleAnswer}
                  disabled={questions[currentQ].type === 'multiple' ? !selectedOption : openAnswer.trim().length < 3}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="mt-4 w-full py-3 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-xl font-bold text-sm disabled:opacity-50"
                >
                  {currentQ < questions.length - 1 ? 'Responder y continuar →' : 'Finalizar examen'}
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        )}

        {phase === 'results' && results && (
          <motion.div key="results" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12, stiffness: 200 }}
              className={`p-8 rounded-2xl border text-center ${dc(dm, 'bg-[#1E293B] border-[#334155]', 'bg-white border-[#E2E8F0] shadow-sm')}`}
            >
              <motion.span className="text-6xl block mb-4"
                animate={animateScore ? { scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] } : {}}
                transition={{ duration: 0.6 }}
              >
                {results.grade >= 80 ? '🏆' : results.grade >= 50 ? '👍' : '💪'}
              </motion.span>
              <motion.p
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="text-5xl font-black mb-2 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] bg-clip-text text-transparent"
              >
                {results.grade}%
              </motion.p>
              <p className={`text-sm ${dc(dm, 'text-[#94A3B8]', 'text-[#64748B]')}`}>{results.correctCount} de {results.total} correctas</p>
              <motion.div
                initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: 0.5, duration: 0.8 }}
                className="mt-4 h-3 rounded-full bg-[#E2E8F0] overflow-hidden"
              >
                <motion.div className="h-full rounded-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]"
                  initial={{ width: 0 }} animate={{ width: `${results.grade}%` }} transition={{ delay: 0.5, duration: 1 }}
                />
              </motion.div>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                className={`mt-4 text-sm font-bold ${dc(dm, 'text-[#4DA8C4]', 'text-[#004B63]')}`}
              >
                +{results.earnedPoints} XP ganados
              </motion.p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => { setPhase('setup'); setResults(null); setAnswers([]); setSubject(null); setDifficulty(null); }}
              className="w-full py-3 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-xl font-bold text-sm"
            >
              🔄 Nuevo Examen
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

OralExamSimulator.displayName = 'OralExamSimulator';
export { OralExamSimulator };
export default OralExamSimulator;
