import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VAKDiagnosticEnhanced } from "../VAKDiagnosticEnhanced";
import SmartProfile from "../profile/SmartProfile";

const PerfilTab = memo(function PerfilTab({
  onTabChange,
  handleVakComplete,
  onLogout,
  initialTab,
}) {
  const [showVakPanel, setShowVakPanel] = useState(false);

  const handleExpandVak = () => setShowVakPanel(true);
  const handleVakDone = (result) => {
    handleVakComplete(result);
    setShowVakPanel(true);
  };

  return (
    <>
      <SmartProfile
        onTabChange={onTabChange}
        onExpandVak={handleExpandVak}
        onLogout={onLogout}
        initialTab={initialTab}
        onSectionChange={(id) => {
          if (id !== "estilo") setShowVakPanel(false);
        }}
      />

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

            {/* The result card carries its own "Crear mi plan" / "Practicar"
                buttons, so no extra banner here. */}
            <VAKDiagnosticEnhanced
              onComplete={handleVakDone}
              onTabChange={(tab) => {
                setShowVakPanel(false);
                onTabChange?.(tab);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

export default PerfilTab;
