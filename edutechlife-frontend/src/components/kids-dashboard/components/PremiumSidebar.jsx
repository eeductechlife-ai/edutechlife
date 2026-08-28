import { memo, useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Flame,
  Gem,
  LogOut,
  Lock,
  Star,
  ChevronDown,
} from "lucide-react";
import { useTranslation } from "../../../i18n/I18nProvider";
import {
  CATEGORY_MAP,
  CATEGORIES,
  CATEGORY_TAB_LABELS,
  PREMIUM_TABS,
} from "../kidsDashboardConfig";
import { SB_GRADIENTS, glow } from "../smartboardTheme";

const categoryStyles = CATEGORIES.map((c) => ({
  id: c.id,
  color: c.color,
  glowColor: c.glowColor,
  gradient: c.gradient,
}));

const PremiumSidebar = memo(
  ({
    activeTab,
    onTabChange,
    totalPoints,
    vakCompleted,
    darkMode,
    streak,
    onNavigate,
    onLogout,
    subscriptionTier,
    isFeatureEnabled = () => true,
  }) => {
    const { t } = useTranslation();
    const isPremium = subscriptionTier === "premium";

    const [expandedCat, setExpandedCat] = useState(() => {
      return localStorage.getItem("edutechlife_sidebar_cat") || "home";
    });

    const [collapsed, setCollapsed] = useState(() => {
      return localStorage.getItem("edutechlife_sidebar_collapsed") === "true";
    });

    const activeCategory = CATEGORY_MAP[activeTab] || "home";

    useEffect(() => {
      localStorage.setItem("edutechlife_sidebar_cat", activeCategory);
      setExpandedCat(activeCategory);
    }, [activeCategory]);

    const toggleCategory = useCallback((catId) => {
      setExpandedCat((prev) => (prev === catId ? null : catId));
    }, []);

    const toggleCollapse = useCallback(() => {
      setCollapsed((prev) => {
        const next = !prev;
        localStorage.setItem("edutechlife_sidebar_collapsed", String(next));
        return next;
      });
    }, []);

    const handleCollapsedCatClick = useCallback(
      (cat) => {
        setCollapsed(false);
        localStorage.setItem("edutechlife_sidebar_collapsed", "false");
        onTabChange(cat.tabs[0]);
      },
      [onTabChange],
    );

    const categoryGradient = useMemo(() => {
      const found = categoryStyles.find((c) => c.id === activeCategory);
      return found || categoryStyles[0];
    }, [activeCategory]);

    return (
      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        style={{ minWidth: collapsed ? 64 : 240 }}
        className={`hidden md:flex flex-col h-full border-r relative z-20 transition-colors duration-500 overflow-hidden ${
          darkMode
            ? "bg-[#151F32] border-[#2A3A54]/60"
            : "bg-white border-[#E2E8F0]"
        }`}
      >
        {/* Logo lockup — click para colapsar/expandir el sidebar */}
        <div
          className={`border-b flex-shrink-0 ${darkMode ? "border-[#2A3A54]/60" : "border-[#E2E8F0]/70"}`}
        >
          <button
            type="button"
            onClick={toggleCollapse}
            title={collapsed ? "Expandir menú" : "Colapsar menú"}
            aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
            aria-expanded={!collapsed}
            className="w-full text-left"
          >
            {collapsed ? (
              <div className="flex items-center justify-center p-4">
                <motion.div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-white flex-shrink-0"
                  style={{
                    background: SB_GRADIENTS.brand,
                    boxShadow: glow("#00B4D8", 0.5),
                  }}
                >
                  <GraduationCap className="w-5 h-5" strokeWidth={2.2} />
                </motion.div>
              </div>
            ) : (
              <div className="p-4">
                <div className="flex items-center gap-2.5">
                  <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 12 }}
                    className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 text-white"
                    style={{
                      background: SB_GRADIENTS.brand,
                      boxShadow: `${glow("#00B4D8", 0.5)}, inset 0 1px 0 rgba(255,255,255,0.4)`,
                    }}
                  >
                    <GraduationCap className="w-6 h-6" strokeWidth={2.2} />
                  </motion.div>
                  <div className="leading-none">
                    <h2
                      className="text-lg font-black tracking-tight bg-clip-text text-transparent"
                      style={{ backgroundImage: SB_GRADIENTS.brand }}
                    >
                      SmartBoard
                    </h2>
                    <p
                      className={`text-[9px] font-black uppercase tracking-[0.2em] mt-1 ${darkMode ? "text-[#48CAE4]" : "text-[#0096C7]"}`}
                    >
                      Versión 2.0
                    </p>
                  </div>
                </div>
                {/* Stat chips */}
                <div className="flex items-center gap-2 mt-3">
                  <div
                    className="flex-1 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#FB8500]/15"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(251,133,0,0.14), rgba(255,209,102,0.12))",
                    }}
                  >
                    <Flame
                      className="w-4 h-4 text-[#FB8500]"
                      strokeWidth={2.4}
                    />
                    <span className="font-black text-sm text-[#FB8500] tabular-nums">
                      {streak?.current ?? 0}
                    </span>
                  </div>
                  <div
                    className="flex-1 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#0096C7]/15"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(0,150,199,0.14), rgba(72,202,228,0.12))",
                    }}
                  >
                    <Gem
                      className={`w-4 h-4 ${darkMode ? "text-[#48CAE4]" : "text-[#0096C7]"}`}
                      strokeWidth={2.4}
                    />
                    <span
                      className={`font-black text-sm tabular-nums ${darkMode ? "text-[#48CAE4]" : "text-[#0096C7]"}`}
                    >
                      {totalPoints?.toLocaleString() || 0}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </button>
        </div>

        {/* Categories */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden">
          {collapsed ? (
            /* Collapsed: icon-only per category */
            <div className="p-2 space-y-1">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <motion.button
                    key={cat.id}
                    onClick={() => handleCollapsedCatClick(cat)}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    title={cat.label}
                    className="w-full flex items-center justify-center p-2.5 rounded-2xl transition-all"
                    style={
                      isActive
                        ? {
                            background: cat.gradient,
                            boxShadow: glow(cat.glowColor, 0.45),
                          }
                        : {}
                    }
                  >
                    <span
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        isActive
                          ? "bg-white/20 text-white"
                          : darkMode
                            ? "bg-[#1E293B] text-[#94A3B8]"
                            : "bg-[#F1F5F9] text-[#475569]"
                      }`}
                    >
                      <cat.Icon
                        className="w-[18px] h-[18px]"
                        strokeWidth={2.3}
                      />
                    </span>
                  </motion.button>
                );
              })}
            </div>
          ) : (
            /* Expanded: accordion */
            <div className="p-3 space-y-1.5">
              {CATEGORIES.map((cat) => {
                const isActiveCategory = expandedCat === cat.id;
                const hasActiveTab = activeCategory === cat.id;
                const anyPremiumInCategory = cat.tabs.some((tb) =>
                  PREMIUM_TABS.includes(tb),
                );
                const showChildren = isActiveCategory;

                return (
                  <div key={cat.id}>
                    <motion.button
                      onClick={() => {
                        toggleCategory(cat.id);
                        if (cat.tabs.length === 1) onTabChange(cat.tabs[0]);
                      }}
                      whileHover={{ x: hasActiveTab ? 0 : 3 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-2xl transition-all text-sm font-bold ${
                        hasActiveTab
                          ? "text-white"
                          : darkMode
                            ? "text-[#94A3B8] hover:bg-[#1E293B]/70"
                            : "text-[#475569] hover:bg-[#F1F5F9]"
                      }`}
                      style={
                        hasActiveTab
                          ? {
                              background: cat.gradient,
                              boxShadow: glow(cat.glowColor, 0.45),
                            }
                          : {}
                      }
                    >
                      <span
                        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          hasActiveTab
                            ? "bg-white/20 text-white"
                            : darkMode
                              ? "bg-[#1E293B] text-[#94A3B8]"
                              : "bg-[#F1F5F9] text-[#475569]"
                        }`}
                      >
                        <cat.Icon
                          className="w-[18px] h-[18px]"
                          strokeWidth={2.3}
                        />
                      </span>
                      <span className="flex-1 text-left">{cat.label}</span>
                      {anyPremiumInCategory && !isPremium && (
                        <Lock
                          className={`w-3.5 h-3.5 ${hasActiveTab ? "text-white/80" : "text-[#94A3B8]"}`}
                        />
                      )}
                      <motion.span
                        animate={{ rotate: showChildren ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="opacity-60 flex items-center"
                      >
                        <ChevronDown className="w-4 h-4" />
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
                            className="ml-3 mt-1 space-y-0.5 border-l-2 pl-2.5"
                            style={{ borderColor: `${cat.color}55` }}
                          >
                            {cat.tabs
                              .filter(
                                (tabId) =>
                                  cat.id !== "home" && isFeatureEnabled(tabId),
                              )
                              .map((tabId) => {
                                const isActive = activeTab === tabId;
                                const isPremiumTab =
                                  PREMIUM_TABS.includes(tabId);
                                return (
                                  <motion.button
                                    key={tabId}
                                    onClick={() => onTabChange(tabId)}
                                    whileHover={{ x: 2 }}
                                    whileTap={{ scale: 0.97 }}
                                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                                      isActive
                                        ? darkMode
                                          ? "text-white"
                                          : "text-[#00303F]"
                                        : darkMode
                                          ? "text-[#94A3B8] hover:bg-[#1E293B]/50"
                                          : "text-[#64748B] hover:bg-[#F8FAFC]"
                                    }`}
                                    style={
                                      isActive
                                        ? {
                                            background: `${cat.color}1f`,
                                            boxShadow: `inset 3px 0 0 0 ${cat.color}`,
                                          }
                                        : {}
                                    }
                                  >
                                    <span
                                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                      style={{
                                        background: isActive
                                          ? cat.color
                                          : "transparent",
                                        border: isActive
                                          ? "none"
                                          : `1.5px solid ${cat.color}66`,
                                      }}
                                    />
                                    <span className="flex-1 text-left">
                                      {CATEGORY_TAB_LABELS[tabId] || tabId}
                                    </span>
                                    {isPremiumTab && !isPremium && (
                                      <Lock className="w-3 h-3 text-[#94A3B8]" />
                                    )}
                                    {isPremiumTab && isPremium && (
                                      <Star
                                        className="w-3 h-3 text-[#FFB703]"
                                        fill="#FFB703"
                                      />
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
            </div>
          )}
        </nav>

        {/* Logout */}
        <div
          className={`p-3 border-t flex-shrink-0 space-y-1 ${darkMode ? "border-[#2A3A54]/60" : "border-[#E2E8F0]/70"}`}
        >
          {/* Logout */}
          <motion.button
            onClick={onLogout}
            whileTap={{ scale: 0.98 }}
            title={collapsed ? t("smartboard.logout") : undefined}
            className={`w-full flex items-center ${collapsed ? "justify-center" : "gap-2.5 px-2.5"} py-2 rounded-xl text-xs font-medium transition-all ${
              darkMode
                ? "text-[#64748B] hover:bg-[#1E293B]/50"
                : "text-[#94A3B8] hover:bg-[#F1F5F9]"
            }`}
          >
            <span className="w-8 h-8 rounded-xl flex items-center justify-center">
              <LogOut className="w-[18px] h-[18px]" strokeWidth={2.3} />
            </span>
            {!collapsed && <span>{t("smartboard.logout")}</span>}
          </motion.button>
        </div>
      </motion.aside>
    );
  },
);

PremiumSidebar.displayName = "PremiumSidebar";

export default PremiumSidebar;
