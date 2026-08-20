import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  Suspense,
} from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Icon } from "../../../utils/iconMapping.jsx";
import { cn } from "../../forum/forumDesignSystem";
import SectionErrorBoundary from "../SectionErrorBoundary";
import { useIALabProgressContext } from "../../../context/IALabContext";
import { useIALabStore } from "../../../store/ialabStore";
import { useTranslation } from "../../../i18n/I18nProvider";
import Breadcrumbs from "../Breadcrumbs";
import { useIALabProgress } from "../../../hooks/IALab/useIALabProgress";

import useFocusTrap from "../../../hooks/useFocusTrap";
import { stopSpeech } from "../../../utils/speech";
import VideoViewer from "./VideoViewer";
import DocumentViewer from "./DocumentViewer";
import ImageViewer from "./ImageViewer";
import InteractiveViewer from "./InteractiveViewer";
import PDFThumbnailViewer from "./PDFThumbnailViewer";
import OVAViewer from "./OVAViewer";
import { OVA_COMPONENTS, renderOVAById } from "./ovaComponents";
import useResourceNotes from "./useResourceNotes";

const ResourceViewerModal = ({
  isOpen = false,
  onClose,
  resource = null,
  resourceType = null,
  onMarkAsViewed,
  onPreviousResource,
  onNextResource,
  currentIndex = 0,
  totalResources = 0,
  youtubeDuration = null,
  durationLoading = false,
}) => {
  const { t } = useTranslation();
  const {
    activeMod,
    modules,
    markResourceAsViewed: markResourceInContext,
    recordLastTopic,
  } = useIALabProgressContext();
  const { trackResourceViewed } = useIALabProgress();

  const [isMarkedAsViewed, setIsMarkedAsViewed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const modalRef = useRef(null);
  const focusTrapRef = useFocusTrap(isOpen);
  const prefersReducedMotion = useReducedMotion();
  const { noteText, showNotes, setShowNotes, noteSaved, handleNoteChange } =
    useResourceNotes(resource);

  const setShowValerioDrawer = useIALabStore((s) => s.setShowValerioDrawer);
  const setValerioInitialMessage = useIALabStore((s) => s.setValerioInitialMessage);

  const RESOURCE_ICONS = {
    video: "fa-video",
    document: "fa-file-lines",
    documento: "fa-file-lines",
    image: "fa-image",
    imagen: "fa-image",
    interactive: "fa-puzzle-piece",
    interactivo: "fa-puzzle-piece",
    pdf: "fa-file-pdf",
    "pdf-thumbnail": "fa-file-pdf",
    ova: "fa-brain",
    "ova-thumbnail": "fa-brain",
    ova_interactive: "fa-brain",
  };

  const handleClose = useCallback(() => {
    stopSpeech();
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          handleClose();
        }
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, isFullscreen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      stopSpeech();
    }
    return () => {
      document.body.style.overflow = "unset";
      stopSpeech();
    };
  }, [isOpen]);

  useEffect(() => {
    setIsMarkedAsViewed(false);
  }, [resource?.id]);

  // Auto-tracking silencioso para el sistema adaptativo (aditivo, no altera UX)
  const recordAdaptiveView = useIALabStore((s) => s.recordView);
  const scheduleAdaptiveReview = useIALabStore((s) => s.scheduleReview);
  useEffect(() => {
    if (!isOpen || !resource?.id || !recordAdaptiveView) return;
    const openedAt = Date.now();
    recordAdaptiveView(resource.id, {
      type: resourceType || resource.type || 'resource',
    });
    return () => {
      // Al cerrar, si estuvo >30s, programa un repaso en Box 1
      const timeSpent = Date.now() - openedAt;
      if (timeSpent > 30000 && scheduleAdaptiveReview) {
        scheduleAdaptiveReview(resource.id, 1);
      }
    };
  }, [isOpen, resource?.id, resourceType, recordAdaptiveView, scheduleAdaptiveReview]);

  const handleMarkAsViewed = useCallback(async () => {
    setIsMarkedAsViewed(true);
    const currentMod = useIALabStore.getState().activeMod || activeMod;
    if (onMarkAsViewed) {
      onMarkAsViewed(resource.id);
    }
    if (resource?.id && currentMod) {
      markResourceInContext(currentMod, resource.id);
      const rt = resource.type || "document";
      // Recompensa XP silenciosa la primera vez que se marca como visto (aditivo, idempotente)
      try {
        const XP_KEY = 'ialab_resource_xp_awarded';
        const awarded = JSON.parse(localStorage.getItem(XP_KEY) || '{}');
        if (!awarded[resource.id]) {
          const XP_BY_TYPE = {
            ova_interactive: 15,
            lab: 15,
            video: 5,
            document: 8,
            documento: 8,
            pdf: 8,
            'pdf-thumbnail': 8,
            infographic: 6,
            reading: 6,
            interactive: 10,
            interactivo: 10,
          };
          const xp = XP_BY_TYPE[rt] || 5;
          const st = useIALabStore.getState();
          if (typeof st.addXp === 'function') st.addXp(xp);
          awarded[resource.id] = { xp, ts: Date.now() };
          localStorage.setItem(XP_KEY, JSON.stringify(awarded));
        }
      } catch (e) { /* silent — no romper flujo si storage falla */ }
      await trackResourceViewed(currentMod, resource.id, rt);
      if (recordLastTopic) {
        const typeLabels = {
          video: t("ialab.viewer_modal.type_video"),
          infographic: t("ialab.viewer_modal.type_infographic"),
          document: t("ialab.viewer_modal.type_document"),
          ova_interactive: t("ialab.viewer_modal.type_ova_interactive"),
          lab: t("ialab.viewer_modal.type_lab"),
          reading: t("ialab.viewer_modal.type_reading"),
        };
        recordLastTopic(
          currentMod,
          "",
          resourceType,
          resource.title ||
            `${typeLabels[rt] || t("ialab.viewer_modal.type_resource")}`,
          resource.id,
        );
      }
    }
  }, [
    activeMod,
    onMarkAsViewed,
    resource,
    markResourceInContext,
    trackResourceViewed,
    recordLastTopic,
    resourceType,
    t,
  ]);

  const handleAutoComplete = useCallback(() => {
    if (!isMarkedAsViewed) {
      handleMarkAsViewed();
    }
  }, [isMarkedAsViewed, handleMarkAsViewed]);

  if (!isOpen || !resource) {
    return null;
  }

  const renderViewer = () => {
    if (!resource) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-[var(--theme-emphasis)]/5 rounded-2xl">
          <div className="text-center">
            <Icon
              name="fa-file-circle-question"
              className="text-[var(--theme-emphasis)]/50 text-4xl mb-4"
            />
            <p className="text-[var(--theme-emphasis)]/80 font-medium">
              {t("ialab.resource_viewer.no_resource")}
            </p>
          </div>
        </div>
      );
    }

    try {
      switch (resourceType || resource.type) {
        case "video":
          return (
            <VideoViewer
              resource={resource}
              youtubeDuration={youtubeDuration}
              durationLoading={durationLoading}
              onVideoEnded={handleAutoComplete}
            />
          );

        case "documento":
        case "document":
          return (
            <DocumentViewer
              resource={resource}
              onAutoComplete={handleAutoComplete}
            />
          );

        case "imagen":
        case "image":
          return (
            <ImageViewer
              resource={resource}
              onAutoComplete={handleAutoComplete}
            />
          );

        case "interactivo":
        case "interactive":
          return <InteractiveViewer resource={resource} />;

        case "pdf":
        case "pdf-thumbnail":
          return (
            <PDFThumbnailViewer
              resource={resource}
              onAutoComplete={handleAutoComplete}
            />
          );

        case "ova":
        case "ova-thumbnail":
          return (
            <OVAViewer
              resource={resource}
              onClose={onClose}
              onComplete={handleAutoComplete}
            />
          );

        case "ova_interactive":
          return (
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center bg-[var(--theme-emphasis)]/5">
                  <div className="text-center">
                    <div className="animate-spin w-10 h-10 border-4 border-[var(--theme-emphasis)] border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-[var(--theme-emphasis)]/80 font-bold">
                      {t("ialab.resource_viewer.loading_interactive")}
                    </p>
                  </div>
                </div>
              }
            >
              <SectionErrorBoundary
                showDetails
                onRetry={() => window.location.reload()}
              >
                {renderOVAById(
                  resource.id,
                  resource,
                  handleAutoComplete,
                  handleClose,
                )}
              </SectionErrorBoundary>
            </Suspense>
          );

        default:
          return (
            <div className="w-full h-full flex items-center justify-center bg-[var(--theme-primary)]/5 rounded-2xl">
              <div className="text-center">
                <Icon
                  name="fa-triangle-exclamation"
                  className="text-[var(--theme-primary)] text-4xl mb-4"
                />
                <p className="text-[var(--theme-primary)]/80 font-medium">
                  {t("ialab.resource_viewer.type_unsupported", {
                    type: resource.type,
                  })}
                </p>
              </div>
            </div>
          );
      }
    } catch (error) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-red-50 rounded-2xl">
          <div className="text-center">
            <Icon
              name="fa-circle-xmark"
              className="text-red-500 text-4xl mb-4"
            />
            <p className="text-red-700 font-medium">
              {t("ialab.resource_viewer.load_error")}
            </p>
            <p className="text-red-600 text-sm mt-2">{error.message}</p>
          </div>
        </div>
      );
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = prefersReducedMotion
    ? {
        hidden: { opacity: 1 },
        visible: { opacity: 1 },
        exit: { opacity: 1 },
      }
    : {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: {
          opacity: 1,
          scale: 1,
          y: 0,
          transition: { type: "spring", damping: 25, stiffness: 300 },
        },
        exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
      };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            aria-hidden="true"
            className="fixed inset-0 z-[200] backdrop-blur-md bg-black/40"
            onClick={handleClose}
          />
          <div
            className={cn(
              "fixed inset-0 z-[201] pointer-events-none",
              isFullscreen
                ? "p-0"
                : "flex items-center justify-center p-0 sm:p-2",
            )}
          >
            <div
              className={cn(
                "h-full relative overflow-hidden",
                isFullscreen
                  ? "w-full"
                  : "w-full max-w-6xl max-sm:max-w-full mx-0 sm:mx-2 p-0 sm:p-[1.5px] sm:rounded-[2rem] sm:bg-gradient-to-b from-[var(--theme-emphasis)]/20 via-[var(--theme-emphasis)]/10 to-[var(--theme-primary)]/5 shadow-[0_20px_25px_-5px_rgba(0,75,99,0.18),0_8px_10px_-6px_rgba(0,75,99,0.12)]",
              )}
              style={{
                height: isFullscreen ? "100dvh" : "calc(100dvh - 2rem)",
                maxHeight: isFullscreen ? "100dvh" : "calc(100dvh - 2rem)",
              }}
            >
              {!isFullscreen && (
                <>
                  <div className="absolute -top-10 -right-10 w-48 h-48 bg-gradient-to-br from-[var(--theme-emphasis)]/8 to-[var(--theme-primary)]/5 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-gradient-to-tr from-[var(--theme-emphasis)]/6 to-[var(--theme-primary)]/5 rounded-full blur-3xl pointer-events-none" />
                </>
              )}
              <motion.div
                ref={(node) => {
                  modalRef.current = node;
                  focusTrapRef.current = node;
                }}
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                role="dialog"
                aria-modal="true"
                aria-label={resource.title}
                className={cn(
                  "relative z-10 bg-white dark:bg-slate-800 flex flex-col h-full overflow-hidden pointer-events-auto",
                  isFullscreen ? "" : "sm:rounded-[calc(2rem-1.5px)]",
                )}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className={cn(
                    "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--theme-emphasis)] to-[var(--theme-primary)] z-10",
                    isFullscreen ? "" : "sm:rounded-t-[calc(2rem-1.5px)]",
                  )}
                />
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-800">
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 w-full sm:w-auto">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--theme-emphasis)] to-[var(--theme-primary)] shadow-sm flex items-center justify-center flex-shrink-0">
                      <Icon
                        name={RESOURCE_ICONS[resource.type] || "fa-file"}
                        className="text-white w-5 h-5 sm:w-6 sm:h-6"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Breadcrumbs
                        segments={[
                          { label: t("ialab.breadcrumb_home") },
                          {
                            label:
                              modules?.find((m) => m.id === activeMod)?.title ||
                              `Módulo ${activeMod}`,
                          },
                          {
                            label: resource.type
                              ?.replace(/_/g, " ")
                              ?.toUpperCase(),
                          },
                        ]}
                        size="text-xs"
                        className="mb-1 text-slate-400 dark:text-slate-500"
                      />
                      <h2 className="text-lg sm:text-xl font-bold text-[var(--theme-emphasis)] dark:text-white tracking-tight truncate">
                        {resource.title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-1 sm:gap-3 text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
                        {resource.type === "video" && (
                          <>
                            <span>
                              {durationLoading
                                ? "..."
                                : youtubeDuration || resource.duration}
                            </span>
                            <span>•</span>
                          </>
                        )}
                        {resource.format && (
                          <>
                            <span>{resource.format}</span>
                            <span>•</span>
                          </>
                        )}
                        {resource.size && (
                          <>
                            <span>{resource.size}</span>
                            <span>•</span>
                          </>
                        )}
                        <span>{t("ialab.viewer_modal.preview")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 mt-3 sm:mt-0 ml-0 sm:ml-2 flex items-center gap-2">
                    <button
                      onClick={() => setIsFullscreen((prev) => !prev)}
                      className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-400 hover:text-[var(--theme-emphasis)] hover:border-[var(--theme-emphasis)]/30 hover:bg-[var(--theme-emphasis)]/5 transition-all duration-200 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-emphasis)]/40"
                      aria-label={
                        isFullscreen
                          ? t("ialab.viewer_modal.fullscreen_exit")
                          : t("ialab.viewer_modal.fullscreen_enter")
                      }
                    >
                      <Icon
                        name={isFullscreen ? "fa-compress" : "fa-expand"}
                        className="w-4 h-4"
                      />
                    </button>
                    <button
                      onClick={handleClose}
                      className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-400 hover:text-[var(--theme-emphasis)] hover:border-[var(--theme-emphasis)]/30 hover:bg-[var(--theme-emphasis)]/5 transition-all duration-200 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-emphasis)]/40"
                      aria-label={t("ialab.viewer_modal.close_aria")}
                    >
                      <Icon name="fa-times" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-auto min-h-0 bg-white dark:bg-slate-800">
                  {renderViewer()}
                  {showNotes && (
                    <div className="border-t border-slate-200/60 dark:border-slate-700/60 px-4 sm:px-6 py-4 bg-white dark:bg-slate-800">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-[var(--theme-emphasis)] dark:text-[var(--theme-emphasis)]-light flex items-center gap-2">
                          <Icon name="fa-note-sticky" className="w-4 h-4" />
                          {t("ialab.viewer_modal.notes_title")}
                        </h4>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${noteSaved ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"}`}
                        >
                          {noteSaved
                            ? t("ialab.viewer_modal.notes_saved")
                            : t("ialab.viewer_modal.notes_saving")}
                        </span>
                      </div>
                      <textarea
                        value={noteText}
                        onChange={handleNoteChange}
                        placeholder={t("ialab.viewer_modal.notes_placeholder")}
                        className="w-full min-h-[100px] p-3 border border-slate-200 dark:border-slate-600 rounded-xl resize-y text-sm bg-white dark:bg-slate-900 text-[var(--theme-emphasis)] dark:text-slate-200 focus:outline-none focus:border-[var(--theme-primary)] focus:ring-2 focus:ring-[var(--theme-emphasis)]/20 focus:ring-offset-1 transition-all duration-200"
                        aria-label={t("ialab.viewer_modal.notes_aria")}
                      />
                    </div>
                  )}
                </div>
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-800 relative z-[60]">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowNotes((s) => !s)}
                        className={`px-3 py-2.5 sm:px-4 sm:py-2.5 rounded-lg flex items-center gap-1 sm:gap-2 transition-all duration-200 text-sm sm:text-base font-medium min-h-[44px] border ${
                          showNotes
                            ? "bg-gradient-to-r from-[var(--theme-emphasis)] to-[var(--theme-primary)] text-white shadow-sm border-transparent"
                            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-[var(--theme-emphasis)]/70 hover:bg-[var(--theme-emphasis)]/5 hover:text-[var(--theme-emphasis)] transition-all duration-200"
                        }`}
                        aria-label={t("ialab.viewer_modal.notes_toggle_aria")}
                      >
                        <Icon
                          name="fa-note-sticky"
                          className="w-3 h-3 sm:w-4 sm:h-4"
                        />
                        <span className="inline">
                          {t("ialab.viewer_modal.notes")}
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          setValerioInitialMessage(t("ialab.ask_max_context") + (resource?.title || ''));
                          setShowValerioDrawer(true);
                          handleClose();
                        }}
                        className="px-3 py-2.5 sm:px-4 sm:py-2.5 rounded-lg flex items-center gap-1 sm:gap-2 transition-all duration-200 text-sm sm:text-base font-medium min-h-[44px] border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-[var(--theme-emphasis)]/70 hover:bg-[var(--theme-emphasis)]/5 hover:text-[var(--theme-emphasis)]"
                        aria-label={t("ialab.ask_max_btn")}
                        title={t("ialab.ask_max_btn")}
                      >
                        <Icon name="fa-robot" className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">{t("ialab.ask_max_btn")}</span>
                      </button>
                    </div>
                    {totalResources > 1 && (
                      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-start">
                        <button
                          onClick={onPreviousResource}
                          disabled={currentIndex <= 0}
                          className={cn(
                            "px-4 py-2.5 sm:px-4 sm:py-2.5 rounded-lg flex items-center gap-1 sm:gap-2 transition-all duration-200 text-sm sm:text-base font-medium min-h-[44px]",
                            currentIndex <= 0
                              ? "text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-40"
                              : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-[var(--theme-emphasis)]/70 hover:bg-[var(--theme-emphasis)]/5 hover:border-[var(--theme-primary)]/30 hover:shadow-sm transition-all duration-200",
                          )}
                          aria-label={t("ialab.viewer_modal.previous_aria")}
                        >
                          <Icon
                            name="fa-chevron-left"
                            className="w-3 h-3 sm:w-4 sm:h-4"
                          />
                          <span className="inline">
                            {t("ialab.viewer_modal.previous")}
                          </span>
                        </button>
                        <div className="px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-br from-[var(--theme-emphasis)]/10 to-[var(--theme-primary)]/10 rounded-full text-[var(--theme-emphasis)] font-bold text-sm sm:text-base shadow-sm">
                          {currentIndex + 1} / {totalResources}
                        </div>
                        <button
                          onClick={onNextResource}
                          disabled={currentIndex >= totalResources - 1}
                          className={cn(
                            "px-4 py-2.5 sm:px-4 sm:py-2.5 rounded-lg flex items-center gap-1 sm:gap-2 transition-all duration-200 text-sm sm:text-base font-medium min-h-[44px]",
                            currentIndex >= totalResources - 1
                              ? "text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-40"
                              : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-[var(--theme-emphasis)]/70 hover:bg-[var(--theme-emphasis)]/5 hover:border-[var(--theme-primary)]/30 hover:shadow-sm transition-all duration-200",
                          )}
                          aria-label={t("ialab.viewer_modal.next_aria")}
                        >
                          <span className="inline">
                            {t("ialab.viewer_modal.next")}
                          </span>
                          <Icon
                            name="fa-chevron-right"
                            className="w-3 h-3 sm:w-4 sm:h-4"
                          />
                        </button>
                      </div>
                    )}
                    {isMarkedAsViewed ? (
                      <div className="px-4 py-2 sm:px-6 sm:py-3 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100/80 dark:from-emerald-900/20 dark:to-emerald-800/10 border border-emerald-200/50 dark:border-emerald-700/30 text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-2 sm:gap-3 text-sm sm:text-base shadow-sm">
                        <Icon
                          name="fa-check-circle"
                          className="w-4 h-4 sm:w-5 sm:h-5"
                        />
                        <span>{t("ialab.viewer_modal.completed_auto")}</span>
                      </div>
                    ) : resource.type === "video" ||
                      resource.type === "pdf" ||
                      resource.type === "pdf-thumbnail" ? (
                      <div className="px-4 py-2 sm:px-6 sm:py-3 rounded-xl bg-gradient-to-r from-[var(--theme-primary)]/5 to-[var(--theme-primary)]/10 border border-[var(--theme-primary)]/20 dark:border-[var(--theme-primary)]/30 text-[var(--theme-primary)] font-medium flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-center backdrop-blur-sm shadow-sm">
                        <Icon
                          name="fa-hourglass-half"
                          className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                        />
                        <span>
                          {resource.type === "video"
                            ? t("ialab.viewer_modal.complete_resource_hint")
                            : t("ialab.viewer_modal.scroll_to_end_hint")}
                        </span>
                      </div>
                    ) : resource.type === "ova" ||
                      resource.type === "ova_interactive" ||
                      resource.type === "ova-thumbnail" ? (
                      <div className="px-4 py-2 sm:px-6 sm:py-3 rounded-xl bg-gradient-to-r from-[var(--theme-primary)]/5 to-[var(--theme-primary)]/10 border border-[var(--theme-primary)]/20 dark:border-[var(--theme-primary)]/30 text-[var(--theme-primary)] font-medium flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-center backdrop-blur-sm shadow-sm">
                        <Icon
                          name="fa-hourglass-half"
                          className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                        />
                        <span>
                          {t("ialab.viewer_modal.complete_resource_hint")}
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={handleMarkAsViewed}
                        aria-label={t("ialab.viewer_modal.mark_viewed")}
                        className="px-4 py-3 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-200 flex items-center gap-2 sm:gap-3 text-sm sm:text-base min-h-[44px] w-full sm:w-auto justify-center border-none bg-gradient-to-r from-[var(--theme-emphasis)] to-[var(--theme-primary)] hover:from-[var(--theme-primary)]-deep hover:to-[var(--theme-primary)]-darker text-white shadow-md hover:shadow-lg"
                      >
                        <Icon
                          name="fa-check"
                          className="w-4 h-4 sm:w-5 sm:h-5"
                        />
                        <span>{t("ialab.viewer_modal.mark_viewed")}</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

ResourceViewerModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  resource: PropTypes.object,
  resourceType: PropTypes.string,
  onMarkAsViewed: PropTypes.func,
  onPreviousResource: PropTypes.func,
  onNextResource: PropTypes.func,
  currentIndex: PropTypes.number,
  totalResources: PropTypes.number,
  youtubeDuration: PropTypes.string,
  durationLoading: PropTypes.bool,
};

export default React.memo(ResourceViewerModal);
