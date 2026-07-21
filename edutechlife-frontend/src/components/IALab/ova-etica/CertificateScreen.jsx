import { motion } from 'framer-motion'
import { Trophy, CheckCircle2, Star } from 'lucide-react'

const CertificateScreen = ({ texts, quizScore }) => {
  const getMessage = () => {
    if (quizScore === null) return texts.certificate_desc;
    if (quizScore === 5) return texts.quiz_result_perfect;
    if (quizScore >= 3) return texts.quiz_result_good;
    return texts.quiz_result_keep_trying;
  };
  return (
    <div className="mx-auto text-center animate-[fadeIn_1.1s_cubic-bezier(0.16,1,0.3,1)_forwards] max-w-md">
      <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
        <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl border-4 border-white dark:border-slate-700">
          <Trophy className="w-12 h-12 text-white" />
        </div>
      </motion.div>
      <h2 className="text-3xl font-black text-petroleum mb-2 uppercase tracking-tighter">{texts.quiz_result_title}</h2>
      {quizScore !== null ? (
        <>
          <div className="bg-petroleum text-white inline-block px-10 py-5 rounded-[2rem] text-5xl font-black shadow-lg border-b-4 border-corporate mb-5">
            {quizScore} / 5
          </div>
          <div className="flex justify-center gap-1.5 mb-5">
            {[1,2,3,4,5].map(i => (
              <motion.div key={i} initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: i * 0.12, type: 'spring', stiffness: 300 }}>
                <Star className={`w-7 h-7 ${i <= quizScore ? 'text-amber-400 fill-amber-400 drop-shadow-sm' : 'text-slate-200 dark:text-slate-600'}`} />
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <div className="w-16 h-16 bg-corporate/10 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-8 h-8 text-corporate" />
        </div>
      )}
      <p className="text-base text-slate-600 dark:text-slate-300 font-bold mb-6 leading-relaxed">{getMessage()}</p>
    </div>
  );
};

export default CertificateScreen
