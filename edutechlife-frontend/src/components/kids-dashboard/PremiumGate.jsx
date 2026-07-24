import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const PremiumGate = ({
  children,
  icon = "⭐",
  title,
  description,
  isPremium = false,
}) => {
  const navigate = useNavigate();

  // If user is premium, show full content
  if (isPremium) {
    return <div>{children}</div>;
  }

  // Default: show locked state
  return (
    <div className="relative min-h-[400px]">
      <div className="absolute inset-0 blur-sm opacity-30 pointer-events-none scale-[0.98]">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-2xl z-20 p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="text-center max-w-sm"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4A017] to-[#FFD166] flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl">{icon}</span>
          </div>
          <h3 className="text-lg font-black text-[#004B63] mb-2">{title}</h3>
          <p className="text-sm text-[#64748B] leading-relaxed mb-6">
            {description}
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/conoce-smartboard")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#D4A017] to-[#FFD166] text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all"
          >
            <span>⭐</span>
            <span>Actualizar a Premium — $50.000/mes</span>
          </motion.button>
          <button
            onClick={() => setShowPaywall(false)}
            className="block mx-auto mt-4 text-xs text-[#94A3B8] hover:text-[#64748B] transition-colors cursor-pointer"
          >
            Seguir explorando
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default PremiumGate;
