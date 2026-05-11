import React from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import { useIALabStore } from '../../store/ialabStore';

const PASSING_SCORE = 80;
const TOTAL_QUESTIONS = 8;
const DAILY_ATTEMPTS_LIMIT = 3;

const ExamResultViewer = ({ moduleId, score, onClose }) => {
  const passed = score >= PASSING_SCORE;

  let storedAttempt = null;
  try {
    const attempts = useIALabStore.getState().storageGet(`quizAttempts_${moduleId}`, []);
    storedAttempt = attempts.length > 0 ? attempts[attempts.length - 1] : null;
  } catch {}

  const correctCount = storedAttempt?.correctCount ?? Math.round((score / 100) * TOTAL_QUESTIONS);
  const incorrectCount = TOTAL_QUESTIONS - correctCount;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <div className="flex-1 p-8">
          <div className="text-center mb-8">
            <div className={`w-28 h-28 mx-auto rounded-full flex items-center justify-center mb-6 ${passed ? 'bg-emerald-50' : 'bg-red-50'}`}>
              <div className="relative">
                <Icon name={passed ? 'fa-trophy' : 'fa-exclamation-circle'} className={`text-5xl ${passed ? 'text-emerald-500' : 'text-red-500'}`} />
                <div className={`absolute -top-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${passed ? 'bg-emerald-500' : 'bg-red-500'}`}>
                  {score}%
                </div>
              </div>
            </div>
            <h2 className={`text-2xl font-bold mb-2 font-montserrat ${passed ? 'text-emerald-600' : 'text-red-600'}`}>
              {passed ? '¡Examen Aprobado!' : 'Examen No Aprobado'}
            </h2>
            <p className="text-slate-600">
              {passed
                ? 'Has demostrado comprensión de los temas del módulo.'
                : `No alcanzaste el mínimo de ${PASSING_SCORE}%. Revisa los temas y vuelve a intentarlo.`}
            </p>
          </div>

          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-800 mb-1 font-montserrat">{correctCount}</div>
                <div className="text-xs text-slate-500">Correctas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-800 mb-1 font-montserrat">{incorrectCount}</div>
                <div className="text-xs text-slate-500">Incorrectas</div>
              </div>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-1000 ${passed ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-gradient-to-r from-red-500 to-red-400'}`}
                style={{ width: `${score}%` }} />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-slate-400">0%</span>
              <span className="text-xs text-slate-400">{PASSING_SCORE}% mínimo</span>
              <span className="text-xs text-slate-400">100%</span>
            </div>
          </div>

          {!passed && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="fa-clock" className="text-amber-600 text-sm" />
                <p className="text-sm font-semibold text-amber-800">Puedes volver a intentarlo</p>
              </div>
              <p className="text-xs text-amber-700">Tienes hasta {DAILY_ATTEMPTS_LIMIT} intentos por día. Repasa los temas y vuelve a tomar el examen.</p>
            </div>
          )}

          <button onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-petroleum to-corporate text-white rounded-xl hover:shadow-lg transition-all duration-200 font-bold text-sm active:scale-95">
            Volver al módulo
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamResultViewer;
