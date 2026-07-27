import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Crown, Lock } from "lucide-react";
import { SB_GRADIENTS, glow } from "./smartboardTheme";

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
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
              style={{
                background: SB_GRADIENTS.gold,
                boxShadow: `${glow("#FB8500", 0.45)}, inset 0 1px 0 rgba(255,255,255,0.5)`,
              }}
            >
              {icon}
            </div>
            <span
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-white border-2 border-white"
              style={{ background: "#00303F" }}
            >
              <Lock className="w-3.5 h-3.5" strokeWidth={2.6} />
            </span>
          </div>
          <h3 className="text-lg font-black tracking-tight text-[#00303F] mb-2">
            {title}
          </h3>
          <p className="text-sm text-[#64748B] leading-relaxed mb-6">
            {description}
          </p>
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/conoce-smartboard")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[#00303F] font-black text-sm transition-all"
            style={{
              background: SB_GRADIENTS.gold,
              boxShadow: `${glow("#FB8500", 0.5)}, inset 0 1px 0 rgba(255,255,255,0.5)`,
            }}
          >
            <Crown className="w-[18px] h-[18px]" strokeWidth={2.4} />
            <span>Actualizar a Premium — $50.000/mes</span>
          </motion.button>
          <button
            onClick={() => navigate("/smartboard")}
            className="block mx-auto mt-4 text-xs font-semibold text-[#94A3B8] hover:text-[#64748B] transition-colors cursor-pointer"
          >
            Seguir explorando
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default PremiumGate;
