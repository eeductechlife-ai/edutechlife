import React, { lazy, Suspense, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { useIALabProgressContext } from "../../context/IALabContext";
import { useTranslation } from "../../i18n/I18nProvider";
import { Icon } from "../../utils/iconMapping.jsx";
import SectionErrorBoundary from "./SectionErrorBoundary";
import { LoadingFallback } from "./shared/LoadingSpinner";

const ReactivePromptStation = lazy(() => import("./ReactivePromptStation"));
const IALabInteractionAdvisor = lazy(() => import("./IALabInteractionAdvisor"));
const OVAPodcastStudio = lazy(() => import("./OVAPodcastStudio"));
const EthicsExplorer = lazy(() => import("./EthicsExplorer"));
const OVAGeminiDeepResearch = lazy(() => import("./OVAGeminiDeepResearch"));
const CapsulasConocimiento = lazy(() => import("./CapsulasConocimiento"));
const IALabTutoriasVirtuales = lazy(() => import("./IALabTutoriasVirtuales"));

const MODULE_TOOL_CONFIG = {
  1: { titleKey: "ialab.tool_tutor.tool_title", icon: "fa-wand-sparkles" },
  2: {
    titleKey: "ialab.tool_tutor.interaction_title",
    icon: "fa-wand-magic-sparkles",
  },
  3: { titleKey: "ialab.practice.tool_gemini_research", icon: "fa-search" },
  4: { titleKey: "ialab.tool_tutor.podcast_title", icon: "fa-microphone" },
  5: { titleKey: "ialab.tool_tutor.ethics_title", icon: "fa-balance-scale" },
};

const PracticeToolModal = ({ isOpen, toolType, onClose }) => {
  const { t } = useTranslation();
  const { activeMod } = useIALabProgressContext();

  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const renderTool = () => {
    if (toolType === "flashcards") {
      return <CapsulasConocimiento />;
    }
    if (toolType === "tutoring") {
      return <IALabTutoriasVirtuales />;
    }
    if (toolType === "prompts") {
      if (activeMod === 2) return <IALabInteractionAdvisor />;
      if (activeMod === 4) return <OVAPodcastStudio />;
      if (activeMod === 5) return <EthicsExplorer />;
      if (activeMod === 3) return <OVAGeminiDeepResearch />;
      return <ReactivePromptStation />;
    }
    return null;
  };

  const config = MODULE_TOOL_CONFIG[activeMod] || MODULE_TOOL_CONFIG[1];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={handleOverlayClick}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        role="dialog"
        aria-modal="true"
        aria-label={
          toolType === "flashcards"
            ? t("ialab.practice.tool_flashcards")
            : toolType === "tutoring"
              ? t("ialab.practice.tool_tutoring")
              : t(config?.titleKey || "ialab.tool_tutor.tool_title")
        }
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-700/60"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between p-4 md:p-6 border-b border-slate-100 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-corporate to-petroleum flex items-center justify-center shadow-sm flex-shrink-0">
                <Icon
                  name={config?.icon || "fa-wand-sparkles"}
                  className="text-white text-base"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-lg font-bold text-petroleum dark:text-slate-100">
                {toolType === "flashcards"
                  ? t("ialab.practice.tool_flashcards")
                  : toolType === "tutoring"
                    ? t("ialab.practice.tool_tutoring")
                    : t(config?.titleKey || "ialab.tool_tutor.tool_title")}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-400 hover:text-petroleum hover:border-petroleum/30 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40"
              aria-label="Cerrar"
            >
              <Icon name="fa-xmark" className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 md:p-6">
            <Suspense fallback={<LoadingFallback />}>
              <SectionErrorBoundary
                name="PracticeTool"
                title={t("ialab.practice.title")}
              >
                <div key={`${toolType}-${activeMod}`}>{renderTool()}</div>
              </SectionErrorBoundary>
            </Suspense>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

PracticeToolModal.propTypes = {
  isOpen: PropTypes.bool,
  toolType: PropTypes.oneOf(["prompts", "flashcards", "tutoring"]),
  onClose: PropTypes.func,
};

export default React.memo(PracticeToolModal);
