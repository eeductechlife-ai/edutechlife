import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";
import { signOutUser } from "../../hooks/useAuthIdentity";
import { useSmartBoardKids } from "../../context/SmartBoardKidsContext";
import { useTranslation } from "../../i18n/I18nProvider";
import useExamReminders from "../../hooks/useExamReminders";
import { useSmartBoardNotifications } from "../../hooks/useSmartBoardNotifications";
import { track } from "../../lib/analytics";
import { EVENTS } from "../../lib/analyticsEvents";
import "../../styles/a11y.css";
import ParticlesBackground from "./ParticlesBackground";
import DaniTutorChat from "./daniTutorChat";
import DaniFAB from "./DaniFAB";
import OnboardingGuide from "./OnboardingGuide";
import OnboardingWizard from "./onboarding/OnboardingWizard";
import PremiumSidebar from "./components/PremiumSidebar";
import MobileBottomBar from "./components/MobileBottomBar";
import MobileSubTabBar from "./components/MobileSubTabBar";
import CinematicContent from "./components/CinematicContent";
import { WifiOff, CloudSync } from "lucide-react";
import SmartBoardLoadingSkeleton from "./SmartBoardLoadingSkeleton";
import ParentalConsentBlocker from "./ParentalConsentBlocker";
import TopBar from "./components/TopBar";

const SmartBoardKidsDashboard = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const urlTab = params.get("tab");
    const TAB_WHITELIST = [
      "inicio",
      "perfil",
      "materias",
      "horario",
      "flashcards",
      "oral",
      "examenes",
      "vak",
      "progreso",
      "calificaciones",
      "misiones",
      "retos",
      "noticias",
      "plan",
      "puntos",
    ];
    if (urlTab && TAB_WHITELIST.includes(urlTab)) return urlTab;
    try {
      const saved = localStorage.getItem("edutechlife_current_tab");
      if (saved && TAB_WHITELIST.includes(saved)) return saved;
    } catch {}
    return "inicio";
  });
  // Background: watches upcoming exams and posts in-app reminders at
  // T-24h / T-3h / T-30min. Silent when there is no timetable/exams.
  useExamReminders();
  // SmartBoard domain notifications: daily mission ready + reinforcement opportunity (§42)
  useSmartBoardNotifications();
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
    lastUnlockedBadge,
    streak,
    subscriptionTier,
    dataLoaded,
    syncLoading,
    isConnected,
    studentAge,
  } = useSmartBoardKids();
  const ageGroup =
    studentAge <= 8 ? "early" : studentAge <= 12 ? "middle" : "senior";
  const prefersReducedMotion = useReducedMotion();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleLogout = useCallback(() => {
    signOutUser("/", navigate);
  }, [navigate]);

  const handleDaniOpen = useCallback(() => {
    setIsDaniOpen(true);
  }, []);
  const handleDaniClose = useCallback(() => {
    setIsDaniOpen(false);
  }, []);

  // Allow child components to open Dani panel via custom event
  useEffect(() => {
    const handler = () => handleDaniOpen();
    window.addEventListener("smartboard:open-dani", handler);
    return () => window.removeEventListener("smartboard:open-dani", handler);
  }, [handleDaniOpen]);

  // Obtener auth token y nombre del estudiante para UserMenu
  const authToken =
    typeof window !== "undefined" ? sessionStorage.getItem("auth_token") : null;
  const studentName =
    typeof window !== "undefined"
      ? localStorage.getItem("student_name") || "Estudiante"
      : "Estudiante";

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
        "perfil",
        "vak",
        "misiones",
        "materias",
        "progreso",
        "oral",
        "examenes",
        "flashcards",
        "horario",
        "puntos",
        "calificaciones",
        "plan",
      ].includes(tab)
    ) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Track session end on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      track(EVENTS.SESSION_END, { last_tab: activeTab });
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [activeTab]);

  if (!dataLoaded) {
    return (
      <div className={`${darkMode ? "bg-[#0F172A]" : "bg-[#F8FAFC]"}`}>
        <SmartBoardLoadingSkeleton darkMode={darkMode} />
      </div>
    );
  }

  return (
    <ParentalConsentBlocker>
      <div
        className={`relative min-h-screen overflow-hidden transition-colors duration-500 ${
          darkMode ? "bg-[#0F172A] text-white" : "bg-[#F8FAFC]"
        } ${fondoGalaxia ? "bg-[#0F172A]" : ""}`}
        data-age-group={ageGroup}
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

        {/* Badge Unlock Notification */}
        <AnimatePresence>
          {lastUnlockedBadge && (
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              className="fixed top-4 left-4 z-[100] bg-gradient-to-r from-[#9D4EDD] to-[#4DA8C4] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4"
            >
              <span className="text-3xl">{lastUnlockedBadge.icon || "🏅"}</span>
              <div>
                <p className="font-bold">Nuevo badge desbloqueado</p>
                <p className="text-sm opacity-90">{lastUnlockedBadge.name}</p>
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
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#66CCCC]/20 rounded-full blur-[150px] pointer-events-none z-0 will-change-transform will-change-opacity"
          style={{ willChange: "transform, opacity" }}
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
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#4DA8C4]/20 rounded-full blur-[150px] pointer-events-none z-0 will-change-transform will-change-opacity"
          style={{ willChange: "transform, opacity" }}
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
        <div className="relative z-10 flex h-screen min-h-dvh">
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
            <TopBar
              activeTab={activeTab}
              darkMode={darkMode}
              streak={streak}
              totalPoints={totalPoints}
              authToken={authToken}
              studentName={studentName}
              onTabChange={setActiveTab}
              onLogout={handleLogout}
            />

            {/* Mobile Sub-Tab Bar */}
            <MobileSubTabBar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              darkMode={darkMode}
            />

            {/* Scrollable Content */}
            <CinematicContent
              activeTab={activeTab}
              onTabChange={setActiveTab}
              darkMode={darkMode}
              subscriptionTier={subscriptionTier}
              onDaniOpen={handleDaniOpen}
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
              className="fixed bottom-24 md:bottom-6 left-6 z-50 flex items-center justify-between gap-3 px-4 py-3 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-2xl shadow-xl cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-3">
                <motion.span
                  className="text-xl flex-shrink-0"
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
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
              </div>
              <motion.span
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDaniReminder(false);
                }}
                role="button"
                tabIndex="0"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.stopPropagation();
                    setShowDaniReminder(false);
                  }
                }}
                aria-label={t("smartboard.close_reminder")}
                className="text-white/50 hover:text-white text-sm ml-2 flex-shrink-0 cursor-pointer hover:bg-white/20 rounded px-1.5 py-0.5 transition-colors"
              >
                ✕
              </motion.span>
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

        {/* DaniFAB - Floating Action Button */}
        <DaniFAB
          isDaniOpen={isDaniOpen}
          onDaniOpen={handleDaniOpen}
          darkMode={darkMode}
          unreadCount={0}
        />

        {/* Onboarding Guide - First Time Welcome Screen */}
        <OnboardingGuide onTabChange={setActiveTab} />

        {/* Onboarding Wizard - Step-by-step setup after welcome */}
        <OnboardingWizard onTabChange={setActiveTab} />

        {/* Dani Chat Modal - Full Premium Experience */}
        <AnimatePresence>
          {isDaniOpen && (
            <DaniTutorChat
              isOpen={isDaniOpen}
              onClose={handleDaniClose}
              activeTab={activeTab}
            />
          )}
        </AnimatePresence>
      </div>
    </ParentalConsentBlocker>
  );
};

export default SmartBoardKidsDashboard;
