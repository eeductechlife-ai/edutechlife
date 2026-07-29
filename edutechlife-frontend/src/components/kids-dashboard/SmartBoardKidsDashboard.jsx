import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useClerk } from "@clerk/react";
import { useSmartBoardKids } from "../../context/SmartBoardKidsContext";
import { useTranslation } from "../../i18n/I18nProvider";
import { useA11y } from "../../hooks/useA11y";
import "../../styles/a11y.css";
import ParticlesBackground from "./ParticlesBackground";
import DaniTutorChat from "./daniTutorChat";
import PremiumSidebar from "./components/PremiumSidebar";
import MobileBottomBar from "./components/MobileBottomBar";
import CinematicContent from "./components/CinematicContent";
import { Bot, Flame, Gem, Wifi, WifiOff, CloudSync } from "lucide-react";
import { CATEGORIES, TOP_BAR_LABELS } from "./kidsDashboardConfig";
import { SB_GRADIENTS, glow } from "./smartboardTheme";
import SmartBoardLoadingSkeleton from "./SmartBoardLoadingSkeleton";

const SmartBoardKidsDashboard = () => {
  const { t } = useTranslation();
  const { reducedMotion, highContrast, getAnimationDuration } = useA11y();
  const [activeTab, setActiveTab] = useState("inicio");
  useEffect(() => {
    try {
      localStorage.setItem("edutechlife_current_tab", activeTab);
      localStorage.setItem(
        "edutechlife_last_activity",
        new Date().toISOString(),
      );
    } catch {}
  }, [activeTab]);
  const [isDaniOpen, setIsDaniOpen] = useState(false);
  const [showDaniReminder, setShowDaniReminder] = useState(false);
  const {
    totalPoints,
    vakResult,
    darkMode,
    fondoGalaxia,
    lastUnlockedReward,
    streak,
    subscriptionTier,
    dataLoaded,
    syncLoading,
    isConnected,
  } = useSmartBoardKids();
  const prefersReducedMotion = useReducedMotion();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signOut } = useClerk();

  const handleLogout = useCallback(() => {
    signOut();
    navigate("/");
  }, [signOut, navigate]);

  // Proactive Dani reminder after inactivity
  useEffect(() => {
    if (isDaniOpen) {
      setShowDaniReminder(false);
      localStorage.removeItem("edutechlife_last_dani_close");
      return;
    }

    const closeTime = localStorage.getItem("edutechlife_last_dani_close");
    if (!closeTime) {
      localStorage.setItem(
        "edutechlife_last_dani_close",
        Date.now().toString(),
      );
      return;
    }

    const lastDani = parseInt(closeTime, 10);
    const elapsed = Date.now() - lastDani;
    if (lastDani > 0 && elapsed > 300000 && elapsed < 3600000) {
      const timer = setTimeout(() => setShowDaniReminder(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [isDaniOpen]);

  // Handle URL tab parameter
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (
      tab &&
      [
        "inicio",
        "vak",
        "misiones",
        "materias",
        "actividades",
        "calendario",
        "noticias",
        "progreso",
        "curriculo",
        "oral",
        "examenes",
        "flashcards",
        "libros",
        "escaner",
        "analitica",
        "padres",
        "podcast",
      ].includes(tab)
    ) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  if (!dataLoaded) {
    return (
      <div className={`${darkMode ? "bg-[#0F172A]" : "bg-[#F8FAFC]"}`}>
        <SmartBoardLoadingSkeleton darkMode={darkMode} />
      </div>
    );
  }

  return (
    <div
      className={`relative min-h-screen overflow-hidden transition-colors duration-500 ${
        darkMode ? "bg-[#0F172A] text-white" : "bg-[#F8FAFC]"
      } ${fondoGalaxia ? "bg-[#0F172A]" : ""}`}
      style={
        fondoGalaxia
          ? {
              backgroundImage:
                "radial-gradient(circle at 25px 25px, rgba(77,168,196,0.15) 1px, transparent 0px), radial-gradient(circle at 75px 75px, rgba(77,168,196,0.1) 1px, transparent 0px)",
              backgroundSize: "100px 100px",
            }
          : {}
      }
    >
      {/* Connectivity Indicator */}
      {!isConnected && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-[#FB8500] to-[#F3722C] text-white px-4 py-1.5 flex items-center justify-center gap-2 text-xs font-semibold"
        >
          <WifiOff className="w-3.5 h-3.5" />
          Modo offline — los cambios se sincronizarán cuando tengas conexión
        </motion.div>
      )}

      {/* Sync indicator */}
      {syncLoading && dataLoaded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed top-2 right-2 z-[60] flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#4DA8C4]/20 text-[#4DA8C4] text-[10px] font-semibold backdrop-blur-sm"
        >
          <CloudSync className="w-3 h-3 animate-spin" />
          Sincronizando...
        </motion.div>
      )}

      {/* Unlock Notification */}
      <AnimatePresence>
        {lastUnlockedReward && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-4 right-4 z-[100] bg-gradient-to-r from-[#FFD166] to-[#FF8E53] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4"
          >
            <span className="text-3xl">🎉</span>
            <div>
              <p className="font-bold">{t("smartboard.unlock_reward")}</p>
              <p className="text-sm opacity-90">
                {lastUnlockedReward.icon} {lastUnlockedReward.name}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Background Particles */}
      <ParticlesBackground
        count={30}
        colors={["#4DA8C4", "#66CCCC", "#FFD166", "#FF6B9D"]}
      />

      {/* Gradient Orbs */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#66CCCC]/20 rounded-full blur-[150px] pointer-events-none z-0"
        animate={
          prefersReducedMotion
            ? {}
            : {
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }
        }
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#4DA8C4]/20 rounded-full blur-[150px] pointer-events-none z-0"
        animate={
          prefersReducedMotion
            ? {}
            : {
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3],
              }
        }
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main Layout */}
      <div className="relative z-10 flex h-screen">
        {/* Desktop Sidebar */}
        <PremiumSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          totalPoints={totalPoints}
          vakCompleted={!!vakResult}
          darkMode={darkMode}
          streak={streak}
          onNavigate={navigate}
          onLogout={handleLogout}
          subscriptionTier={subscriptionTier}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar - Glassmorphism */}
          <motion.header
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`backdrop-blur-xl border-b p-4 flex items-center justify-between z-20 transition-colors duration-500 ${
              darkMode
                ? "bg-[#1E293B]/80 border-[#334155]/50"
                : "bg-white/80 border-[#E2E8F0]/50"
            }`}
          >
            {(() => {
              const activeCat = CATEGORIES.find((c) =>
                c.tabs.includes(activeTab),
              );
              const ActiveIcon = activeCat?.Icon || Bot;
              return (
                <div className="flex items-center gap-3">
                  <motion.span
                    key={activeCat?.id}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 14 }}
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white flex-shrink-0"
                    style={{
                      background: activeCat?.gradient || SB_GRADIENTS.brand,
                      boxShadow: `${glow(activeCat?.glowColor || "#00B4D8", 0.4)}, inset 0 1px 0 rgba(255,255,255,0.35)`,
                    }}
                  >
                    <ActiveIcon
                      className="w-[21px] h-[21px]"
                      strokeWidth={2.3}
                    />
                  </motion.span>
                  <div className="leading-none">
                    <span
                      className={`block text-[10px] font-black uppercase tracking-[0.14em] mb-0.5 ${darkMode ? "text-[#5C7386]" : "text-[#93A6B2]"}`}
                    >
                      {activeCat?.label}
                    </span>
                    <h1
                      className={`text-xl font-black tracking-tight transition-colors duration-500 ${darkMode ? "text-white" : "text-[#00303F]"}`}
                    >
                      {TOP_BAR_LABELS[activeTab] || activeTab}
                    </h1>
                  </div>
                </div>
              );
            })()}

            <div className="flex items-center gap-3">
              {/* Dani Quick Access */}
              <motion.button
                id="openDaniChat"
                type="button"
                onClick={() => setIsDaniOpen(true)}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.92 }}
                aria-label={t("smartboard.talk_dani")}
                className="relative flex items-center gap-2 px-5 py-2.5 text-white rounded-full text-sm font-bold transition-all cursor-pointer select-none"
                style={{
                  background: SB_GRADIENTS.brand,
                  boxShadow: glow("#0096C7", 0.45),
                }}
              >
                <motion.span
                  className="flex items-center justify-center"
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                >
                  <Bot className="w-[18px] h-[18px]" strokeWidth={2.4} />
                </motion.span>
                <span className="hidden md:block">
                  {t("smartboard.talk_dani")}
                </span>
                <motion.span
                  className="absolute inset-0 rounded-full border-2 border-white/40"
                  initial={{ opacity: 0, scale: 1 }}
                  whileTap={{ opacity: 1, scale: 1.15 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>

              {/* Streak Display */}
              <motion.div
                className="hidden sm:flex px-2.5 py-1.5 rounded-2xl items-center gap-2 transition-colors duration-500"
                style={{
                  background: darkMode
                    ? "linear-gradient(135deg, rgba(251,133,0,0.18), rgba(255,209,102,0.12))"
                    : "linear-gradient(135deg, rgba(251,133,0,0.12), rgba(255,209,102,0.10))",
                }}
                whileHover={{ scale: 1.03, y: -1 }}
                title={t("smartboard.streak_title")}
              >
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                  style={{
                    background: "linear-gradient(135deg, #FB8500, #F3722C)",
                  }}
                >
                  <Flame className="w-4 h-4" strokeWidth={2.4} />
                </span>
                <span className="leading-none">
                  <span className="block text-sm font-black text-[#FB8500] tabular-nums">
                    {streak.current}
                  </span>
                  <span
                    className={`block text-[9px] font-semibold ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}
                  >
                    {t("smartboard.days")}
                  </span>
                </span>
              </motion.div>

              {/* Points Display */}
              <motion.div
                className="flex px-2.5 py-1.5 rounded-2xl items-center gap-2 transition-colors duration-500"
                style={{
                  background: darkMode
                    ? "linear-gradient(135deg, rgba(0,150,199,0.20), rgba(72,202,228,0.12))"
                    : "linear-gradient(135deg, rgba(0,150,199,0.12), rgba(72,202,228,0.10))",
                }}
                whileHover={{ scale: 1.03, y: -1 }}
                aria-live="polite"
                aria-atomic="true"
              >
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                  style={{ background: SB_GRADIENTS.brand }}
                >
                  <Gem className="w-4 h-4" strokeWidth={2.4} />
                </span>
                <span className="leading-none">
                  <span
                    className={`block text-sm font-black tabular-nums ${darkMode ? "text-white" : "text-[#00303F]"}`}
                  >
                    {totalPoints.toLocaleString()}
                  </span>
                  <span
                    className={`block text-[9px] font-semibold ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}
                  >
                    {t("smartboard.points_display")}
                  </span>
                </span>
              </motion.div>
            </div>
          </motion.header>

          {/* Scrollable Content */}
          <CinematicContent
            activeTab={activeTab}
            onTabChange={setActiveTab}
            darkMode={darkMode}
            subscriptionTier={subscriptionTier}
          />
        </div>
      </div>

      {/* Proactive Dani Reminder */}
      <AnimatePresence>
        {showDaniReminder && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            onClick={() => {
              setShowDaniReminder(false);
              setIsDaniOpen(true);
            }}
            aria-label={t("smartboard.dani_reminder_open")}
            className="fixed bottom-24 md:bottom-6 left-6 z-50 flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-2xl shadow-xl cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              className="text-xl"
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
              aria-hidden="true"
            >
              🤖
            </motion.span>
            <div className="text-left">
              <p className="text-xs font-bold">¿Necesitas ayuda?</p>
              <p className="text-[10px] text-white/80">
                Dani está aquí para ti
              </p>
            </div>
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                setShowDaniReminder(false);
              }}
              aria-label={t("smartboard.close_reminder")}
              className="text-white/50 hover:text-white text-sm ml-2"
            >
              ✕
            </motion.button>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Bar */}
      <MobileBottomBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        darkMode={darkMode}
        subscriptionTier={subscriptionTier}
      />

      {/* Dani Chat Modal - Full Premium Experience */}
      <AnimatePresence>
        {isDaniOpen && (
          <DaniTutorChat
            isOpen={isDaniOpen}
            onClose={() => setIsDaniOpen(false)}
            activeTab={activeTab}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartBoardKidsDashboard;
