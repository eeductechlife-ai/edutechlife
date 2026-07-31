import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "../../utils/iconMapping.jsx";
import { useTranslation } from "../../i18n/I18nProvider";

const XPToast = () => {
  const { t } = useTranslation();
  const [toast, setToast] = useState(null);

  const handleXpEarned = useCallback((e) => {
    const amount = e.detail?.amount;
    if (!amount || amount <= 0) return;
    setToast({ amount, key: Date.now() });
  }, []);

  useEffect(() => {
    window.addEventListener("ialab:xpEarned", handleXpEarned);
    return () => window.removeEventListener("ialab:xpEarned", handleXpEarned);
  }, [handleXpEarned]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.key}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 border-l-4 border-l-amber-500 rounded-lg shadow-lg">
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 0.5, repeat: 1 }}
            >
              <Icon name="fa-bolt" className="text-lg text-amber-500" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                {t("ialab.xp_earned", { amount: toast.amount })}
              </span>
              <span className="text-[11px] text-amber-700 dark:text-amber-300">
                {t("ialab.xp_excellent_work")}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default XPToast;
