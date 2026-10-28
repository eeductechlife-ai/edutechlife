import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { motion, useReducedMotion } from "framer-motion";
import {
  getModuleLessons,
  getModuleAccordionContent,
  getModuleOverviewData,
} from "../constants/moduleContent/selectors";
import { getResourcesForTopic } from "../constants/moduleResources";
import { useIALabStore } from "../../../store/ialabStore";
import { useContentSequence } from "../../../hooks/IALab/useContentSequence";
import { useTranslation } from "../../../i18n/I18nProvider";
import { Icon } from "../../../utils/iconMapping.jsx";
import { ResourceViewerModal } from "./TopicChatThreadParts";
import { RESOURCE_ICON, RESOURCE_COLOR } from "./TopicChatThreadExtras";
import TopicNotebookLayout from "./TopicNotebookLayout";

export default function TopicChatThread({
  topicIndex,
  activeMod,
  onAdvanceTopic,
  onGoToActivities,
}) {
  const { t, locale } = useTranslation();
  const prefersReducedMotion = useReducedMotion();

  const {
    viewedIds,
    isResourceLocked,
    topics: sequenceTopics,
  } = useContentSequence(activeMod, locale);

  const lessons = getModuleLessons(activeMod, locale);
  const overview = getModuleOverviewData(activeMod, locale);
  const topics = overview?.topics || [];
  const topicMeta = topics[topicIndex] || null;
  const lessonData = lessons[topicIndex] || null;
  // El título canónico del tema es el de `overviewData.topics`: es la clave con
  // la que el catálogo de recursos resuelve sus contenidos (igual que el rail y
  // ModuleOverviewCard). El título de `lessons` puede divergir (p. ej. módulo 3,
  // tema 2: "…IA Toca el Mundo Real" vs "…Evidencia Toca Tierra") y dejaría el
  // tema sin recursos. `lessons` solo aporta la descripción larga.
  const lesson = topicMeta
    ? {
        ...lessonData,
        title: topicMeta.title,
        detailedDescription: lessonData?.detailedDescription || "",
      }
    : lessonData;
  const topicData = lesson ? getResourcesForTopic(lesson.title, locale) : null;
  const content = getModuleAccordionContent(activeMod, locale)?.[
    topicIndex + 1
  ];

  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeResourceIndex, setActiveResourceIndex] = useState(0);
  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedResourceType, setSelectedResourceType] = useState(null);
  const [advancing, setAdvancing] = useState(false);

  const isLastTopic = topicIndex >= topics.length - 1;
  const topicIndexRef = useRef(topicIndex);
  const advancedRef = useRef(null);
  useEffect(() => {
    topicIndexRef.current = topicIndex;
    advancedRef.current = null;
  }, [topicIndex]);

  const resources = topicData?.resources || [];
  const resourcesKey = resources.map((r) => r.id).join("|");

  // Al completar el último recurso de un tema: marca el tema como completo y,
  // si no es el último, auto-avanza al siguiente tema (secuencia pedida).
  const handleMarkAsViewed = useCallback(
    (resourceId) => {
      const viewed = new Set(useIALabStore.getState().getViewedResources());
      if (resourceId) viewed.add(resourceId);
      const ids = resourcesKey ? resourcesKey.split("|") : [];
      const allDone = ids.length > 0 && ids.every((id) => viewed.has(id));
      if (!allDone) return;
      useIALabStore.getState().markLessonComplete(activeMod, topicIndex + 1);
      if (isLastTopic) return;
      const next = topicIndex + 1;
      if (advancedRef.current === next) return;
      advancedRef.current = next;
      setAdvancing(true);
      setTimeout(() => {
        setAdvancing(false);
        if (topicIndexRef.current === topicIndex) onAdvanceTopic?.(next);
      }, 1300);
    },
    [resourcesKey, activeMod, topicIndex, isLastTopic, onAdvanceTopic],
  );

  if (!lesson || !topicData) return null;

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

  // El visor respeta el mismo orden que la lista: el siguiente recurso sigue
  // bloqueado hasta completar el actual.
  const nextResource = resources[activeResourceIndex + 1];
  const isNextLocked =
    !!nextResource &&
    !viewedIds.includes(nextResource.id) &&
    isResourceLocked(nextResource.id);

  const handleNext = () => {
    const next = resources[activeResourceIndex + 1];
    if (next && !isNextLocked) {
      setSelectedResource(next);
      setSelectedResourceType(next.type);
      setActiveResourceIndex(activeResourceIndex + 1);
    }
  };

  const ease = [0.22, 0.61, 0.36, 1];
  const isNLM = activeMod === 4;

  const getResourceState = (resource) => {
    const isCompleted = viewedIds.includes(resource.id);
    const locked = !isCompleted && isResourceLocked(resource.id);
    return { isCompleted, locked };
  };

  const isCurrentTopicCompleted =
    resources.length > 0 && resources.every((r) => viewedIds.includes(r.id));

  const modal = viewerOpen && selectedResource && (
    <Suspense fallback={null}>
      <ResourceViewerModal
        isOpen={viewerOpen}
        onClose={() => {
          setViewerOpen(false);
          setSelectedResource(null);
          setSelectedResourceType(null);
        }}
        resource={selectedResource}
        resourceType={selectedResourceType}
        currentIndex={activeResourceIndex}
        totalResources={resources.length}
        onPreviousResource={handlePrev}
        onNextResource={handleNext}
        nextDisabled={isNextLocked}
        onMarkAsViewed={handleMarkAsViewed}
        activeMod={activeMod}
      />
    </Suspense>
  );

  /* ── NotebookLM layout ─────────────────────────────────── */
  if (isNLM) {
    return (
      <TopicNotebookLayout
        lesson={lesson}
        topicData={topicData}
        topicMeta={topicMeta}
        content={content}
        resources={resources}
        getResourceState={getResourceState}
        onOpenResource={handleOpenResource}
        prefersReducedMotion={prefersReducedMotion}
      >
        {modal}
      </TopicNotebookLayout>
    );
  }

  /* ── Chat layout (otros módulos) ───────────────────────── */
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 pb-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          prefersReducedMotion ? { duration: 0 } : { duration: 0.3, ease }
        }
        className="flex justify-end"
      >
        <div className="bg-[#f4f4f4] dark:bg-slate-700 rounded-3xl rounded-tr-md px-4 py-2.5 max-w-[80%]">
          <p className="text-[15px] theme-text font-medium">{lesson.title}</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { duration: 0.38, delay: 0.2, ease }
        }
        className="flex items-start gap-3"
      >
        <div className="flex-shrink-0 mt-0.5 w-8 h-8 rounded-full bg-[#10a37f] flex items-center justify-center">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </div>
        <div className="flex-1 min-w-0 space-y-4 pt-0.5">
          {content?.objectiveDesc && (
            <p className="text-[15px] theme-text-muted leading-[1.65]">
              {content.objectiveDesc}
            </p>
          )}
          <p className="text-[15px] theme-text leading-[1.65]">
            {lesson.detailedDescription}
          </p>
          {topicMeta?.outcome && (
            <p className="text-[15px] theme-text leading-[1.65]">
              <span className="font-bold">
                {t("ialab.topic.outcome_label")}{" "}
              </span>
              {topicMeta.outcome}
            </p>
          )}
          <p className="text-[15px] font-bold theme-text leading-snug">
            Recursos de este tema:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {resources.map((resource) => {
              const icon = RESOURCE_ICON[resource.type] || "fa-file";
              const colorCls =
                RESOURCE_COLOR[resource.type] ||
                "bg-slate-100 dark:bg-slate-700 text-slate-500";
              const meta =
                resource.duration ||
                resource.estimatedTime ||
                (resource.pages ? `${resource.pages} págs.` : "") ||
                resource.format ||
                "";
              const { isCompleted, locked } = getResourceState(resource);
              const statusLabel = isCompleted
                ? t("ialab.status.viewed")
                : locked
                  ? t("ialab.status.locked")
                  : t("ialab.status.start_here");
              return (
                <motion.button
                  key={resource.id}
                  data-testid={`resource-btn-${resource.id}`}
                  disabled={locked}
                  aria-disabled={locked}
                  onClick={
                    locked ? undefined : () => handleOpenResource(resource)
                  }
                  whileHover={prefersReducedMotion || locked ? {} : { y: -1 }}
                  whileTap={
                    prefersReducedMotion || locked ? {} : { scale: 0.99 }
                  }
                  className={`theme-prompt-card group w-full flex items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-150 shadow-sm focus:outline-none ${
                    isCompleted
                      ? "bg-emerald-50/60 dark:bg-emerald-900/15 border-emerald-200/60 dark:border-emerald-800/40 cursor-pointer hover:shadow-md"
                      : locked
                        ? "border-slate-200/50 dark:border-slate-700/40 bg-slate-50/50 dark:bg-slate-800/40 opacity-60 cursor-not-allowed"
                        : "cursor-pointer hover:shadow-md focus-visible:ring-2 focus-visible:ring-[#10a37f]/40"
                  }`}
                >
                  <span
                    className={`relative mt-1 flex-shrink-0 h-8 w-8 rounded-xl flex items-center justify-center ${locked ? "bg-slate-100 dark:bg-slate-700 text-slate-400" : isCompleted ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400" : colorCls}`}
                  >
                    <Icon
                      name={
                        locked ? "fa-lock" : isCompleted ? "fa-check" : icon
                      }
                      className="text-sm"
                      aria-hidden="true"
                    />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-semibold text-[15px] leading-snug ${locked ? "text-slate-400" : isCompleted ? "text-emerald-700 dark:text-emerald-400" : "theme-text"}`}
                    >
                      {resource.title}
                    </p>
                    {meta && (
                      <p className="text-[13px] theme-text-muted leading-snug mt-0.5">
                        {meta}
                      </p>
                    )}
                    {locked && (
                      <p className="text-[11px] text-slate-400 leading-snug mt-1">
                        {t("ialab.status.locked_hint")}
                      </p>
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0 self-start ${
                      isCompleted
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                        : locked
                          ? "bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500"
                          : "theme-chip"
                    }`}
                  >
                    {statusLabel}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {isCurrentTopicCompleted &&
            (isLastTopic ? (
              <button
                type="button"
                onClick={() => onGoToActivities?.()}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--theme-emphasis)] to-[var(--theme-primary)] px-4 py-3 text-sm font-bold text-white shadow-md hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-emphasis)]/40"
              >
                <Icon
                  name="fa-circle-check"
                  className="text-sm"
                  aria-hidden="true"
                />
                {t("ialab.continue_to_activities")}
              </button>
            ) : advancing ? (
              <p
                className="flex items-center gap-2 text-[13px] font-semibold text-emerald-600 dark:text-emerald-400"
                role="status"
              >
                <Icon
                  name="fa-circle-check"
                  className="text-sm"
                  aria-hidden="true"
                />
                {t("ialab.topic_completed_advancing")}
              </p>
            ) : null)}
        </div>
      </motion.div>
      {modal}
    </div>
  );
}

TopicChatThread.propTypes = {
  topicIndex: PropTypes.number.isRequired,
  activeMod: PropTypes.number.isRequired,
  onAdvanceTopic: PropTypes.func,
  onGoToActivities: PropTypes.func,
};
