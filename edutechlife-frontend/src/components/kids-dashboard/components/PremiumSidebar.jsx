import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "../../../i18n/I18nProvider";
import {
  CATEGORY_MAP,
  CATEGORIES,
  CATEGORY_TAB_LABELS,
  PREMIUM_TABS,
} from "../kidsDashboardConfig";

const PremiumSidebar = ({
  activeTab,
  onTabChange,
  totalPoints,
  vakCompleted,
  darkMode,
  streak,
  onNavigate,
  onLogout,
  subscriptionTier,
}) => {
  const { t } = useTranslation();
  const isPremium = subscriptionTier === "premium";
  const [expandedCat, setExpandedCat] = useState(() => {
    return localStorage.getItem("edutechlife_sidebar_cat") || "home";
  });

  const activeCategory = CATEGORY_MAP[activeTab] || "home";

  useEffect(() => {
    localStorage.setItem("edutechlife_sidebar_cat", activeCategory);
    setExpandedCat(activeCategory);
  }, [activeCategory]);

  const toggleCategory = (catId) => {
    setExpandedCat((prev) => (prev === catId ? null : catId));
  };

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className={`hidden md:flex w-56 flex-col h-full backdrop-blur-xl border-r relative z-20 transition-colors duration-500 ${
        darkMode
          ? "bg-[#1E293B]/80 border-[#334155]/50"
          : "bg-white/80 border-[#E2E8F0]"
      }`}
    >
      {/* Logo + Stats */}
      <div className="p-4 border-b border-[#E2E8F0]/50">
        <motion.h2
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-lg font-black bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] bg-clip-text text-transparent"
        >
          SmartBoard
        </motion.h2>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center gap-1 text-xs">
            <span>🔥</span>
            <span
              className={`font-bold ${darkMode ? "text-[#FFD166]" : "text-[#FF8E53]"}`}
            >
              {streak?.current ?? 0}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span>💎</span>
            <span
              className={`font-bold ${darkMode ? "text-white" : "text-[#004B63]"}`}
            >
              {totalPoints?.toLocaleString() || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {CATEGORIES.map((cat) => {
          const isActiveCategory = expandedCat === cat.id;
          const hasActiveTab = activeCategory === cat.id;
          const anyPremiumInCategory = cat.tabs.some((t) =>
            PREMIUM_TABS.includes(t),
          );
          const showChildren = isActiveCategory;

          return (
            <div key={cat.id}>
              <motion.button
                onClick={() => {
                  toggleCategory(cat.id);
                  if (cat.tabs.length === 1) onTabChange(cat.tabs[0]);
                }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold ${
                  hasActiveTab
                    ? "text-white shadow-sm"
                    : darkMode
                      ? "text-[#94A3B8] hover:bg-[#334155]/50"
                      : "text-[#64748B] hover:bg-[#F1F5F9]"
                }`}
                style={
                  hasActiveTab
                    ? {
                        background: `linear-gradient(135deg, ${cat.color}, ${cat.color}dd)`,
                      }
                    : {}
                }
              >
                <span className="text-lg">{cat.icon}</span>
                <span className="flex-1 text-left">{cat.label}</span>
                {anyPremiumInCategory && !isPremium && (
                  <span className="text-[9px]">🔒</span>
                )}
                <motion.span
                  animate={{ rotate: showChildren ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-[10px] opacity-50"
                >
                  ▾
                </motion.span>
              </motion.button>

              <AnimatePresence initial={false}>
                {showChildren && (
                  <motion.div
                    key="sub"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div
                      className="ml-2 mt-0.5 space-y-0.5 border-l-2 pl-2"
                      style={{ borderColor: `${cat.color}40` }}
                    >
                      {cat.tabs.map((tabId) => {
                        if (cat.id === "home") return null;
                        const isActive = activeTab === tabId;
                        const isPremiumTab = PREMIUM_TABS.includes(tabId);
                        return (
                          <motion.button
                            key={tabId}
                            onClick={() => onTabChange(tabId)}
                            whileTap={{ scale: 0.97 }}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                              isActive
                                ? darkMode
                                  ? "bg-[#334155] text-white"
                                  : "bg-[#F1F5F9] text-[#004B63]"
                                : darkMode
                                  ? "text-[#94A3B8] hover:bg-[#334155]/30"
                                  : "text-[#64748B] hover:bg-[#F8FAFC]"
                            }`}
                            style={
                              isActive
                                ? { borderLeft: `3px solid ${cat.color}` }
                                : {}
                            }
                          >
                            <span className="flex-1 text-left">
                              {CATEGORY_TAB_LABELS[tabId] || tabId}
                            </span>
                            {isPremiumTab && !isPremium && (
                              <span className="text-[9px]">🔒</span>
                            )}
                            {isPremiumTab && isPremium && (
                              <span className="text-[9px]">⭐</span>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* Parents + Logout */}
      <div className="p-3 border-t border-[#E2E8F0]/50 space-y-1">
        <motion.button
          onClick={() => onNavigate?.("/smartboard/padres")}
          whileTap={{ scale: 0.98 }}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            darkMode
              ? "text-[#94A3B8] hover:bg-[#334155]/50"
              : "text-[#64748B] hover:bg-[#F1F5F9]"
          }`}
        >
          <span className="text-lg">👨‍👩‍👧</span>
          <span>{t("smartboard.tab_parents")}</span>
        </motion.button>
        <motion.button
          onClick={onLogout}
          whileTap={{ scale: 0.98 }}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all ${
            darkMode
              ? "text-[#64748B] hover:bg-[#334155]/30"
              : "text-[#94A3B8] hover:bg-[#F1F5F9]"
          }`}
        >
          <span>🚪</span>
          <span>{t("smartboard.logout")}</span>
        </motion.button>
      </div>
    </motion.aside>
  );
};

export default PremiumSidebar;
