import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSmartBoardKids } from "../../../context/SmartBoardKidsContext";
import { VAKDiagnosticEnhanced } from "../VAKDiagnosticEnhanced";
import SmartProfile from "../profile/SmartProfile";

const PerfilTab = memo(function PerfilTab({ onTabChange, handleVakComplete }) {
  const { vakResult } = useSmartBoardKids();
  const [showVakPanel, setShowVakPanel] = useState(false);

  const handleExpandVak = () => setShowVakPanel(true);
  const handleVakDone = (result) => {
    handleVakComplete(result);
    setShowVakPanel(true);
  };

  return (
    <>
      <SmartProfile onTabChange={onTabChange} onExpandVak={handleExpandVak} />

      <AnimatePresence>
        {showVakPanel && (
          <motion.div
            key="vak-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-[#004B63] uppercase tracking-wide">
                🧠 Mi estilo de aprendizaje
              </h3>
              <button
                type="button"
                onClick={() => setShowVakPanel(false)}
                className="text-xs text-[#94A3B8] hover:text-[#64748B] transition-colors px-2 py-1 rounded-lg hover:bg-[#F1F5F9]"
              >
                ✕ Cerrar
              </button>
            </div>

            <VAKDiagnosticEnhanced onComplete={handleVakDone} />

            {vakResult && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl bg-gradient-to-r from-[#06D6A0]/10 to-[#118AB2]/10 border border-[#06D6A0]/20 px-4 py-3 flex items-center gap-3"
              >
                <span className="text-lg">🎯</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#118AB2]">
                    ¡Diagnóstico completado!
                  </p>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Tu plan de mejora ya está personalizado a tu estilo.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowVakPanel(false);
                    onTabChange?.("plan");
                  }}
                  className="text-xs font-bold text-white bg-[#118AB2] px-3 py-1.5 rounded-xl hover:bg-[#0077B6] transition-colors whitespace-nowrap"
                >
                  Ver Plan →
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

export default PerfilTab;
