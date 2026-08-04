import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { signOutUser } from "../../hooks/useAuthIdentity";
import { useSmartBoardKids } from "../../context/SmartBoardKidsContext";
import { useTranslation } from "../../i18n/I18nProvider";
import "../../styles/a11y.css";
import ParticlesBackground from "./ParticlesBackground";
import DaniTutorChat from "./daniTutorChat";
import PremiumSidebar from "./components/PremiumSidebar";
import MobileBottomBar from "./components/MobileBottomBar";
import CinematicContent from "./components/CinematicContent";
import { WifiOff, CloudSync } from "lucide-react";
import SmartBoardLoadingSkeleton from "./SmartBoardLoadingSkeleton";
import TopBar from "./components/TopBar";

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
    dataLoaded,
    syncLoading,
    isConnected,
    studentAge,
  } = useSmartBoardKids();
  const isKid = studentAge && studentAge <= 11;
  const prefersReducedMotion = useReducedMotion();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleLogout = useCallback(() => {
    signOutUser("/");
    navigate("/");
  }, [navigate]);

  const handleDaniOpen = useCallback(() => setIsDaniOpen(true), []);
  const handleDaniClose = useCallback(() => setIsDaniOpen(false), []);

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
      data-age-mode={isKid ? "kid" : "teen"}
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
          <TopBar
            activeTab={activeTab}
            darkMode={darkMode}
            streak={streak}
            totalPoints={totalPoints}
            onDaniOpen={handleDaniOpen}
          />

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

      {/* Data Rights - Floating Action (GDPR-K / COPPA) */}
      <div className="fixed bottom-20 md:bottom-6 right-6 z-40 flex flex-col gap-2">
        <motion.button
          onClick={async () => {
            if (
              !window.confirm(
                "¿Estás seguro de que quieres eliminar todos tus datos? Esta acción no se puede deshacer.",
              )
            ) {
              return;
            }

            // La identidad la determina el servidor a partir del token, no el body.
            const token = localStorage.getItem("auth_token");
            if (!token) {
              alert(
                "Debes iniciar sesión para eliminar tus datos. Vuelve a entrar e inténtalo de nuevo.",
              );
              return;
            }

            try {
              const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL || "https://edutechlife-backend.onrender.com"}/api/smartboard/delete-user-data`,
                {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                },
              );

              // Solo limpiamos el dispositivo si el servidor confirmó el borrado.
              if (res.ok) {
                localStorage.clear();
                window.location.href = "/";
              } else {
                alert(
                  "No pudimos eliminar tus datos en el servidor. Intenta de nuevo o contacta soporte.",
                );
              }
            } catch {
              alert(
                "No pudimos conectar con el servidor. Revisa tu conexión e intenta de nuevo.",
              );
            }
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Eliminar mis datos personales"
          className="min-w-[44px] min-h-[44px] px-3 py-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/40 hover:text-red-200 text-[10px] font-semibold backdrop-blur-sm border border-red-500/30 transition-all flex items-center gap-1.5"
          title="Eliminar mis datos (GDPR / COPPA)"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
            <path d="M10 3h4a1 1 0 011 1v2H9V4a1 1 0 011-1z" />
          </svg>
          Eliminar mis datos
        </motion.button>
      </div>

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
  );
};

export default SmartBoardKidsDashboard;
