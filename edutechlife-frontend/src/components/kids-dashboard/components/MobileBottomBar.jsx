import { motion } from "framer-motion";
import { useTranslation } from "../../../i18n/I18nProvider";
import { CATEGORY_MAP, CATEGORIES, PREMIUM_TABS } from "../kidsDashboardConfig";

const MobileBottomBar = ({
  activeTab,
  onTabChange,
  darkMode,
  subscriptionTier,
}) => {
  const { t } = useTranslation();
  const isPremium = subscriptionTier === "premium";
  const activeCategory = CATEGORY_MAP[activeTab] || "home";

  const getFirstTab = (catId) => {
    const cat = CATEGORIES.find((c) => c.id === catId);
    return cat ? cat.tabs[0] : "inicio";
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className={`md:hidden fixed bottom-0 left-0 right-0 backdrop-blur-xl border-t z-50 transition-colors duration-500 ${
        darkMode
          ? "bg-[#1E293B]/90 border-[#334155]/50"
          : "bg-white/90 border-[#E2E8F0]"
      }`}
    >
      <nav className="flex justify-around items-center py-1 px-2">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          const anyPremiumInCategory = cat.tabs.some((t) =>
            PREMIUM_TABS.includes(t),
          );
          const locked = anyPremiumInCategory && !isPremium;
          return (
            <motion.button
              key={cat.id}
              onClick={() =>
                onTabChange(
                  activeCategory === cat.id ? activeTab : getFirstTab(cat.id),
                )
              }
              whileTap={{ scale: 0.9 }}
              className={`relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all min-w-[56px] ${
                isActive
                  ? "text-white shadow-sm"
                  : darkMode
                    ? "text-[#64748B]"
                    : "text-[#94A3B8]"
              }`}
              style={
                isActive
                  ? {
                      background: `linear-gradient(135deg, ${cat.color}, ${cat.color}dd)`,
                    }
                  : {}
              }
            >
              <span className="text-xl">{cat.icon}</span>
              <span className="text-[9px] font-semibold whitespace-nowrap">
                {cat.label}
              </span>
              {locked && (
                <span className="text-[8px] absolute top-0 right-1">🔒</span>
              )}
            </motion.button>
          );
        })}
      </nav>
    </motion.div>
  );
};

export default MobileBottomBar;
