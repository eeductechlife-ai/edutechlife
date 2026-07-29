import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FloatingParticles from "./FloatingParticles";
import { useTranslation } from "../i18n/I18nProvider";
import { Icon } from "../utils/iconMapping.jsx";

const LoadingScreen = ({ onComplete, minDuration = 2500 }) => {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(30);
  const [statusText, setStatusText] = useState(t("loading.status_start"));
  const [isExiting, setIsExiting] = useState(false);

  const getLoadingSteps = () => [
    { progress: 30, text: t("loading.status_start") },
    { progress: 60, text: t("loading.status_vak") },
    { progress: 85, text: t("loading.status_ai") },
    { progress: 100, text: t("loading.status_done") },
  ];
  const loadingSteps = getLoadingSteps();

  useEffect(() => {
    // Arranca en el primer paso de inmediato: evita el frío "0%"
    let currentStep = 1;
    const interval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        setProgress(loadingSteps[currentStep].progress);
        setStatusText(loadingSteps[currentStep].text);
        currentStep++;
      } else {
        clearInterval(interval);
      }
    }, minDuration / loadingSteps.length);

    return () => clearInterval(interval);
  }, [minDuration]);

  useEffect(() => {
    if (progress >= 100) {
      const exitTimer = setTimeout(() => {
        setIsExiting(true);
        const completeTimer = setTimeout(() => {
          if (onComplete) onComplete();
        }, 400);
        return () => clearTimeout(completeTimer);
      }, 200);
      return () => clearTimeout(exitTimer);
    }
  }, [progress, onComplete]);

  return (
    <div className={`loading-screen ${isExiting ? "exiting" : ""}`}>
      {/* Floating Particles - Enhanced 3D */}
      <FloatingParticles count={24} className="z-1" />

      {/* Additional 3D Floating Elements - Corporate colors only */}
      <div
        className="absolute top-[20%] left-[10%] w-4 h-4 bg-[#4DA8C4]/20 rounded-full animate-[float-3d_22s_ease-in-out_infinite]"
        style={{ animationDelay: "-2s" }}
      />
      <div
        className="absolute top-[60%] right-[15%] w-3 h-3 bg-[#66CCCC]/25 rounded-full animate-[float-3d_28s_ease-in-out_infinite]"
        style={{ animationDelay: "-4s" }}
      />
      <div
        className="absolute bottom-[30%] left-[20%] w-2 h-2 bg-[#B2D8E5]/20 rounded-full animate-[float-3d_25s_ease-in-out_infinite]"
        style={{ animationDelay: "-1s" }}
      />
      <div
        className="absolute top-[40%] left-[25%] w-3 h-3 bg-[#4DA8C4]/15 rounded-full animate-[float-3d_30s_ease-in-out_infinite]"
        style={{ animationDelay: "-3s" }}
      />
      <div
        className="absolute top-[25%] right-[30%] w-2 h-2 bg-[#66CCCC]/20 rounded-full animate-[float-3d_20s_ease-in-out_infinite]"
        style={{ animationDelay: "-5s" }}
      />

      <div className="loading-content">
        <div className="loading-brand">
          <div className="brand-logo">
            <img
              src="/images/logo-edutechlife.webp"
              alt="Edutechlife"
              className="logo-img"
            />
          </div>
        </div>

        <div className="loading-progress">
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            />
            <div
              className="progress-bar-glow"
              style={{ left: `${progress}%` }}
            />
          </div>
          <div className="progress-percentage">{progress}%</div>
        </div>

        <div className="loading-status">
          <div className="status-icon">
            {progress < 100 ? (
              <div className="status-dots">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
            ) : (
              <Icon name="fa-check" className="w-5 h-5 text-[#4DA8C4]" />
            )}
          </div>
          <span className="status-text">{statusText}</span>
        </div>

        <div className="loading-features">
          <div className="feature-item premium">
            <div
              className="feature-icon"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0, 75, 99, 0.1) 0%, rgba(77, 168, 196, 0.15) 100%)",
                border: "1px solid rgba(0, 75, 99, 0.2)",
              }}
            >
              <Icon name="fa-robot" className="w-6 h-6" style={{ color: "#004B63" }} />
            </div>
            <span>{t("loading.feature_ai")}</span>
          </div>
          <div className="feature-item premium">
            <div
              className="feature-icon"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0, 75, 99, 0.1) 0%, rgba(77, 168, 196, 0.15) 100%)",
                border: "1px solid rgba(0, 75, 99, 0.2)",
              }}
            >
              <Icon name="fa-brain" className="w-6 h-6" style={{ color: "#004B63" }} />
            </div>
            <span>{t("loading.feature_vak")}</span>
          </div>
          <div className="feature-item premium">
            <div
              className="feature-icon"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0, 75, 99, 0.1) 0%, rgba(77, 168, 196, 0.15) 100%)",
                border: "1px solid rgba(0, 75, 99, 0.2)",
              }}
            >
              <Icon name="fa-award" className="w-6 h-6" style={{ color: "#004B63" }} />
            </div>
            <span>{t("loading.feature_cert")}</span>
          </div>
        </div>
      </div>

      <div className="loading-bg">
        <div className="bg-orb orb-1" />
        <div className="bg-orb orb-2" />
        <div className="bg-orb orb-3" />
      </div>
    </div>
  );
};

const MiniLoader = ({ size = "md", color = "primary" }) => {
  const sizeClass = `loader-${size}`;
  const colorClass = `loader-${color}`;

  return (
    <div className={`mini-loader ${sizeClass} ${colorClass}`}>
      <div className="loader-bars">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
};

const PageLoader = ({ message }) => {
  if (!message) message = "Cargando...";
  return (
    <div className="page-loader">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="page-loader-content"
      >
        <div className="loader-spinner">
          <motion.div
            className="spinner-ring"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="spinner-ring ring-2"
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="spinner-core"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Icon name="fa-graduation-cap" className="w-5 h-5 text-petroleum" />
          </motion.div>
        </div>
        <AnimatePresence mode="wait">
          <motion.span
            key={message}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="loader-message"
          >
            {message}
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const SkeletonLoader = ({ type = "text", lines = 3 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case "card":
        return (
          <div className="skeleton-card">
            <div className="skeleton-image" />
            <div className="skeleton-content">
              <div className="skeleton-line title" />
              <div className="skeleton-line" />
              <div className="skeleton-line short" />
            </div>
          </div>
        );
      case "profile":
        return (
          <div className="skeleton-profile">
            <div className="skeleton-avatar" />
            <div className="skeleton-info">
              <div className="skeleton-line title" />
              <div className="skeleton-line short" />
            </div>
          </div>
        );
      case "hero":
        return (
          <div className="skeleton-hero">
            <div className="skeleton-badge" />
            <div className="skeleton-line title-lg" />
            <div className="skeleton-line title-lg short" />
            <div className="skeleton-line" />
            <div className="skeleton-line" />
            <div className="skeleton-buttons">
              <div className="skeleton-btn" />
              <div className="skeleton-btn secondary" />
            </div>
          </div>
        );
      default:
        return (
          <div className="skeleton-text">
            {Array.from({ length: lines }).map((_, i) => (
              <div
                key={i}
                className={`skeleton-line ${i === lines - 1 ? "short" : ""}`}
              />
            ))}
          </div>
        );
    }
  };

  return renderSkeleton();
};

export { LoadingScreen, MiniLoader, PageLoader, SkeletonLoader };
export default LoadingScreen;
