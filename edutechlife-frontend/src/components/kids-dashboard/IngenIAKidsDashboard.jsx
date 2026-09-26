import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";
import { signOutUser } from "../../hooks/useAuthIdentity";
import { useIngenIAKids } from "../../context/IngenIAKidsContext";
import { useTranslation } from "../../i18n/I18nProvider";
import useExamReminders from "../../hooks/useExamReminders";
import { useIngenIANotifications } from "../../hooks/useIngenIANotifications";
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
import IngenIALoadingSkeleton from "./IngenIALoadingSkeleton";
import ParentalNoticeBar from "./ParentalNoticeBar";
import TopBar from "./components/TopBar";
import { useParentalControls } from "../../hooks/useParentalControls";
import useFunnelTracking from "../../hooks/useFunnelTracking";

const REMINDER_DISMISSED_KEY = "edutechlife_dani_reminder_dismissed";

const IngenIAKidsDashboard = () => {
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
      "practicar",
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
  // IngenIA domain notifications: daily mission ready + reinforcement opportunity (§42)
  useIngenIANotifications();
  // Activation/retention funnel tracking
  useFunnelTracking();
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
    avatarAnimado,
    lastUnlockedReward,
    lastUnlockedBadge,
    streak,
    subscriptionTier,
    dataLoaded,
    syncLoading,
    isConnected,
    studentAge,
  } = useIngenIAKids();
  const ageGroup =
    studentAge <= 9 ? "early" : studentAge <= 12 ? "middle" : "senior";
  const prefersReducedMotion = useReducedMotion();
  const { isFeatureEnabled, controls: parentalControls } =
    useParentalControls();
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
    const dismissedToday =
      localStorage.getItem(REMINDER_DISMISSED_KEY) ===
      new Date().toDateString();
    if (
      !dismissedToday &&
      lastDani > 0 &&
      elapsed > 300000 &&
      elapsed < 3600000
    ) {
      const timer = setTimeout(() => setShowDaniReminder(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [isDaniOpen]);

  // The bubble sits over content on phones: it leaves on its own after 10 s.
  useEffect(() => {
    if (!showDaniReminder) return undefined;
    const t = setTimeout(() => setShowDaniReminder(false), 10000);
    return () => clearTimeout(t);
  }, [showDaniReminder]);

  const dismissReminder = () => {
    setShowDaniReminder(false);
    try {
      localStorage.setItem(REMINDER_DISMISSED_KEY, new Date().toDateString());
    } catch {
      // storage blocked: it just may show again
    }
  };

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
        "practicar",
        "retos",
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
        <IngenIALoadingSkeleton darkMode={darkMode} />
      </div>
    );
  }

  return (
    <>
      <ParentalNoticeBar />
      <div
        className={`relative min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip transition-colors duration-500 ${
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
            isFeatureEnabled={isFeatureEnabled}
            ageGroup={ageGroup}
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
              isFeatureEnabled={isFeatureEnabled}
            />

            {/* Scrollable Content */}
            <CinematicContent
              activeTab={activeTab}
              onTabChange={setActiveTab}
              darkMode={darkMode}
              subscriptionTier={subscriptionTier}
              onDaniOpen={handleDaniOpen}
              onLogout={handleLogout}
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
              className="fixed right-4 z-[55] flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-full shadow-xl cursor-pointer max-w-[13rem]"
              style={{
                bottom: "calc(env(safe-area-inset-bottom, 0px) + 9.5rem)",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                className="text-lg flex-shrink-0"
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                aria-hidden="true"
              >
                🤖
              </motion.span>
              <div className="text-left leading-tight min-w-0">
                <p className="text-[11px] font-bold truncate">
                  ¿Necesitas ayuda?
                </p>
                <p className="text-[9px] text-white/75 truncate">
                  Dani está aquí
                </p>
              </div>
              <motion.span
                onClick={(e) => {
                  e.stopPropagation();
                  dismissReminder();
                }}
                role="button"
                tabIndex="0"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.stopPropagation();
                    dismissReminder();
                  }
                }}
                aria-label={t("smartboard.close_reminder")}
                className="text-white/60 hover:text-white text-xs flex-shrink-0 cursor-pointer hover:bg-white/20 rounded-full w-5 h-5 flex items-center justify-center transition-colors"
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
          isFeatureEnabled={isFeatureEnabled}
          ageGroup={ageGroup}
        />

        {/* DaniFAB — hidden when playing retos to avoid covering action buttons */}
        {parentalControls.chatEnabled && activeTab !== "retos" && (
          <DaniFAB
            isDaniOpen={isDaniOpen}
            onDaniOpen={handleDaniOpen}
            darkMode={darkMode}
            unreadCount={0}
            avatarAnimado={avatarAnimado}
          />
        )}

        {/* Onboarding Guide - First Time Welcome Screen */}
        <OnboardingGuide onTabChange={setActiveTab} />

        {/* Onboarding Wizard - Step-by-step setup after welcome */}
        <OnboardingWizard onTabChange={setActiveTab} />

        {/* Dani Chat Modal - Full Premium Experience */}
        <AnimatePresence>
          {isDaniOpen && parentalControls.chatEnabled && (
            <DaniTutorChat
              isOpen={isDaniOpen}
              onClose={handleDaniClose}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default IngenIAKidsDashboard;
