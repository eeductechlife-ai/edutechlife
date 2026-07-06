import { Sparkles } from 'lucide-react';

export const Confetti = ({ active }) => {
  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2">
        <Sparkles size={64} strokeWidth={1} className="text-[#4DA8C4] opacity-50 animate-pulse" />
      </div>
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 rounded-full opacity-60"
          style={{
            left: `${i * 8.3}%`,
            top: `${(i * 7 + 10) % 90}%`,
            background: ['#4DA8C4', '#66CCCC', '#B2D8E5'][i % 3],
            animation: `confetti-fall ${1 + (i % 3) * 0.5}s ease-in ${(i % 5) * 0.1}s infinite`
          }}
        />
      ))}
    </div>
  );
};

export const Celebration = ({ active, styleName }) => {
  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl p-6 flex items-center gap-4 animate-pulse">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] flex items-center justify-center">
          <Sparkles size={32} strokeWidth={1.5} className="text-white" />
        </div>
        <div>
          <p className="text-lg font-bold text-[#004B63]">¡Diagnóstico Completo!</p>
          <p className="text-sm text-slate-500">{styleName}</p>
        </div>
      </div>
    </div>
  );
};
