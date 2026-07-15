import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useClerk } from "@clerk/react";
import { useSmartBoardKids } from "../../context/SmartBoardKidsContext";
import { useTranslation } from "../../i18n/I18nProvider";
import ParticlesBackground from "./ParticlesBackground";
import DaniTutorChat from "./DaniTutorChat";
import PremiumSidebar from "./components/PremiumSidebar";
import MobileBottomBar from "./components/MobileBottomBar";
import CinematicContent from "./components/CinematicContent";
import { CATEGORIES, TOP_BAR_LABELS } from "./kidsDashboardConfig";

const SmartBoardKidsDashboard = () => {
  const { t } = useTranslation();
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
    const lastDani = parseInt(
      localStorage.getItem("edutechlife_last_dani_close") || "0",
      10,
    );
    const elapsed = Date.now() - lastDani;
    if (lastDani > 0 && elapsed > 300000 && elapsed < 3600000) {
      const timer = setTimeout(() => setShowDaniReminder(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [isDaniOpen]);

  useEffect(() => {
    if (isDaniOpen) {
      setShowDaniReminder(false);
      localStorage.removeItem("edutechlife_last_dani_close");
    } else {
      if (!localStorage.getItem("edutechlife_last_dani_close")) {
        localStorage.setItem(
          "edutechlife_last_dani_close",
          Date.now().toString(),
        );
      }
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
            <h1
              className={`text-xl font-bold transition-colors duration-500 ${darkMode ? "text-white" : "text-[#004B63]"}`}
            >
              <span className="flex items-center gap-2">
                <span className="text-base">
                  {CATEGORIES.find((c) => c.tabs.includes(activeTab))?.icon}
                </span>
                <span>{TOP_BAR_LABELS[activeTab] || activeTab}</span>
              </span>
            </h1>

            <div className="flex items-center gap-3">
              {/* Dani Quick Access */}
              <motion.button
                id="openDaniChat"
                type="button"
                onClick={() => setIsDaniOpen(true)}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 8px 25px rgba(77,168,196,0.4)",
                }}
                whileTap={{ scale: 0.92 }}
                aria-label={t("smartboard.talk_dani")}
                className="relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer select-none"
              >
                <motion.span
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                >
                  🤖
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
                className={`px-3 py-2 rounded-full flex items-center gap-1.5 shadow-sm transition-colors duration-500 ${
                  darkMode ? "bg-[#334155]" : "bg-[#F8FAFC]"
                }`}
                whileHover={{ scale: 1.02 }}
                title={t("smartboard.streak_title")}
              >
                <span className="text-sm">🔥</span>
                <span
                  className={`text-xs font-bold ${darkMode ? "text-[#FFD166]" : "text-[#FF8E53]"}`}
                >
                  {streak.current}
                </span>
                <span
                  className={`text-[10px] ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}
                >
                  {t("smartboard.days")}
                </span>
              </motion.div>

              {/* Points Display */}
              <motion.div
                className={`px-4 py-2 rounded-full flex items-center gap-2 shadow-sm transition-colors duration-500 ${
                  darkMode ? "bg-[#334155]" : "bg-[#F8FAFC]"
                }`}
                whileHover={{ scale: 1.02 }}
                aria-live="polite"
                aria-atomic="true"
              >
                <span className="text-[#FFD166] font-bold text-lg">💎</span>
                <span
                  className={`text-sm font-bold transition-colors duration-500 ${darkMode ? "text-white" : "text-[#004B63]"}`}
                >
                  {totalPoints.toLocaleString()}
                </span>
                <span
                  className={`text-[10px] ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}
                >
                  {t("smartboard.points_display")}
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
            className="fixed bottom-24 md:bottom-6 left-6 z-50 flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-2xl shadow-xl cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              className="text-xl"
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
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
