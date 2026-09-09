/**
 * TopicChatThread — Renderiza un tema del módulo como un hilo de ChatGPT.
 * Burbuja del usuario (derecha) + respuesta del asistente (izquierda)
 * con recursos clicables que abren ResourceViewerModal.
 */
import { lazy, Suspense, useState } from "react";
import PropTypes from "prop-types";
import { motion, useReducedMotion } from "framer-motion";
import {
  getModuleLessons,
  getModuleAccordionContent,
} from "../constants/moduleContent/selectors";
import { getResourcesForTopic } from "../constants/moduleResources";
import { useIALabStore } from "../../../store/ialabStore";
import { useTranslation } from "../../../i18n/I18nProvider";
import { Icon } from "../../../utils/iconMapping.jsx";

const ResourceViewerModal = lazy(() => import("../ResourceViewerModal"));

const RESOURCE_ICON = {
  video: "fa-play",
  pdf: "fa-file-lines",
  ova_interactive: "fa-brain",
  ova: "fa-brain",
  document: "fa-file-lines",
};

const RESOURCE_COLOR = {
  video: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  pdf: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
  ova_interactive:
    "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400",
  ova: "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400",
};

export default function TopicChatThread({ topicIndex, activeMod }) {
  const { locale } = useTranslation();
  const prefersReducedMotion = useReducedMotion();

  const lessons = getModuleLessons(activeMod, locale);
  const lesson = lessons[topicIndex];
  const topicData = lesson ? getResourcesForTopic(lesson.title, locale) : null;
  const content = getModuleAccordionContent(activeMod, locale)?.[
    topicIndex + 1
  ];

  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeResourceIndex, setActiveResourceIndex] = useState(0);
  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedResourceType, setSelectedResourceType] = useState(null);

  if (!lesson || !topicData) return null;

  const resources = topicData.resources || [];

  const handleOpenResource = (resource) => {
    const idx = resources.findIndex((r) => r.id === resource.id);
    const store = useIALabStore.getState();
    store.setLastVisitedLesson(activeMod, topicIndex + 1);
    store.markLessonInProgress?.(activeMod, topicIndex + 1);
    setSelectedResource(resource);
    setSelectedResourceType(resource.type);
    setActiveResourceIndex(idx >= 0 ? idx : 0);
    setViewerOpen(true);
  };

  const handlePrev = () => {
    const prev = resources[activeResourceIndex - 1];
    if (prev) {
      setSelectedResource(prev);
      setSelectedResourceType(prev.type);
      setActiveResourceIndex(activeResourceIndex - 1);
    }
  };

  const handleNext = () => {
    const next = resources[activeResourceIndex + 1];
    if (next) {
      setSelectedResource(next);
      setSelectedResourceType(next.type);
      setActiveResourceIndex(activeResourceIndex + 1);
    }
  };

  const ease = [0.22, 0.61, 0.36, 1];
  const isNLM = activeMod === 4;
  const nlmFont = { fontFamily: "'Google Sans Text','Roboto','Inter',sans-serif" };

  const NLM_RESOURCE_COLOR = {
    video:          { bg: "#e8f0fe", color: "#1a73e8" },
    pdf:            { bg: "#fff8e1", color: "#f9ab00" },
    ova_interactive:{ bg: "#e6f4ea", color: "#188038" },
    ova:            { bg: "#e6f4ea", color: "#188038" },
    document:       { bg: "#f3e8fd", color: "#9334e9" },
  };

  const modal = viewerOpen && selectedResource && (
    <Suspense fallback={null}>
      <ResourceViewerModal
        isOpen={viewerOpen}
        onClose={() => { setViewerOpen(false); setSelectedResource(null); setSelectedResourceType(null); }}
        resource={selectedResource}
        resourceType={selectedResourceType}
        currentIndex={activeResourceIndex}
        totalResources={resources.length}
        onPreviousResource={handlePrev}
        onNextResource={handleNext}
        activeMod={activeMod}
      />
    </Suspense>
  );

  /* ── NotebookLM layout ─────────────────────────────────── */
  if (isNLM) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3, ease }}
        className="w-full max-w-3xl mx-auto pb-6"
      >
        <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: "#e0e0e6" }}>

          {/* Header */}
          <div className="flex items-center gap-3 px-6 py-4 border-b" style={{ background: "#f8f9ff", borderColor: "#e0e0e6" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#e8f0fe" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ ...nlmFont, fontSize: 15, fontWeight: 600, color: "#202124" }} className="truncate">{lesson.title}</p>
              <p style={{ ...nlmFont, fontSize: 12, color: "#5f6368" }}>{resources.length} fuentes · {topicData.duration || ""}</p>
            </div>
          </div>

          {/* Descripción */}
          {(content?.objectiveDesc || lesson.detailedDescription) && (
            <div className="px-6 py-5 border-b" style={{ borderColor: "#f1f3f4" }}>
              {content?.objectiveDesc && (
                <p style={{ ...nlmFont, fontSize: 14, color: "#5f6368", lineHeight: 1.65, marginBottom: 10 }}>{content.objectiveDesc}</p>
              )}
              <p style={{ ...nlmFont, fontSize: 15, color: "#3c4043", lineHeight: 1.7 }}>{lesson.detailedDescription}</p>
            </div>
          )}

          {/* Fuentes del tema */}
          <div className="px-6 py-5">
            <p style={{ ...nlmFont, fontSize: 12, fontWeight: 600, color: "#5f6368", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>
              Fuentes de este tema
            </p>
            <div className="space-y-2">
              {resources.map((resource) => {
                const icon = RESOURCE_ICON[resource.type] || "fa-file";
                const nlmColor = NLM_RESOURCE_COLOR[resource.type] || { bg: "#f1f3f4", color: "#5f6368" };
                const meta = resource.duration || resource.estimatedTime || (resource.pages ? `${resource.pages} págs.` : "") || resource.format || "";
                return (
                  <motion.button
                    key={resource.id}
                    onClick={() => handleOpenResource(resource)}
                    whileHover={prefersReducedMotion ? {} : { backgroundColor: "#f8f9ff" }}
                    whileTap={prefersReducedMotion ? {} : { scale: 0.99 }}
                    className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-150 bg-white focus:outline-none"
                    style={{ borderColor: "#e0e0e6" }}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: nlmColor.bg }}>
                      <Icon name={icon} className="text-sm" style={{ color: nlmColor.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ ...nlmFont, fontSize: 14, fontWeight: 600, color: "#202124" }} className="truncate group-hover:text-[#1a73e8] transition-colors">
                        {resource.title}
                      </p>
                      {meta && <p style={{ ...nlmFont, fontSize: 12, color: "#5f6368" }}>{meta}</p>}
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9aa0a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-shrink-0">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
        {modal}
      </motion.div>
    );
  }

  /* ── Chat layout (otros módulos) ───────────────────────── */
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 pb-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3, ease }} className="flex justify-end">
        <div className="bg-[#f4f4f4] dark:bg-slate-700 rounded-3xl rounded-tr-md px-4 py-2.5 max-w-[80%]">
          <p className="text-[15px] theme-text font-medium">{lesson.title}</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.38, delay: 0.2, ease }} className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5 w-8 h-8 rounded-full bg-[#10a37f] flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
        </div>
        <div className="flex-1 min-w-0 space-y-4 pt-0.5">
          {content?.objectiveDesc && <p className="text-[15px] theme-text-muted leading-[1.65]">{content.objectiveDesc}</p>}
          <p className="text-[15px] theme-text leading-[1.65]">{lesson.detailedDescription}</p>
          <p className="text-[15px] font-bold theme-text leading-snug">Recursos de este tema:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {resources.map((resource) => {
              const icon = RESOURCE_ICON[resource.type] || "fa-file";
              const colorCls = RESOURCE_COLOR[resource.type] || "bg-slate-100 dark:bg-slate-700 text-slate-500";
              const meta = resource.duration || resource.estimatedTime || (resource.pages ? `${resource.pages} págs.` : "") || resource.format || "";
              return (
                <motion.button key={resource.id} onClick={() => handleOpenResource(resource)} whileHover={prefersReducedMotion ? {} : { y: -1 }} whileTap={prefersReducedMotion ? {} : { scale: 0.99 }} className="theme-prompt-card group w-full flex items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-150 shadow-sm cursor-pointer hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f]/40">
                  <span className={`mt-1 flex-shrink-0 h-8 w-8 rounded-xl flex items-center justify-center ${colorCls}`}><Icon name={icon} className="text-sm" /></span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[15px] theme-text leading-snug">{resource.title}</p>
                    {meta && <p className="text-[13px] theme-text-muted leading-snug mt-0.5">{meta}</p>}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>
      {modal}
    </div>
  );
}

TopicChatThread.propTypes = {
  topicIndex: PropTypes.number.isRequired,
  activeMod: PropTypes.number.isRequired,
};
