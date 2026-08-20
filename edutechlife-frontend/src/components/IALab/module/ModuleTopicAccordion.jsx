import { Fragment } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "../../../utils/iconMapping.jsx";
import { useIALabStore } from "../../../store/ialabStore";
import { useTranslation } from "../../../i18n/I18nProvider";
import {
  getResourcesForTopic,
  getResourceTypesForTopic,
  countResourcesByType,
} from "../constants/moduleResources";
import { getModuleAccordionContent } from "../constants/moduleContent";
import TopicHeader from "./TopicHeader";
import ResourceItem from "./ResourceItem";
import ModuleProgressBar from "./ModuleProgressBar";

const ModuleTopicAccordion = ({
  moduleData,
  expandedTopic,
  setExpandedTopic,
  filterType,
  setFilterType,
  resourcesByTopic,
  viewedIds,
  isAdmin,
  isResourceLocked,
  calculateTopicDuration,
  toggleBookmark,
  prefersReducedMotion,
  activeMod,
  setSelectedResource,
  setSelectedResourceType,
  setCurrentTopicResources,
  setActiveResourceIndex,
  setViewerModalOpen,
  justCompletedId,
  bookmarkedIds,
  t,
}) => {
  const { locale } = useTranslation();
  return (
    <>
      {moduleData.topics.map((tema, index) => {
        const topicResources = resourcesByTopic[tema.title];
        const topicResourceIds =
          topicResources?.resources?.map((r) => r.id) || [];
        const isTopicCompleted =
          topicResourceIds.length > 0 &&
          topicResourceIds.every((id) => viewedIds.includes(id));
        const totalResources = topicResources?.resources?.length || 0;
        const topicCompletedCount = topicResourceIds.filter((id) =>
          viewedIds.includes(id),
        ).length;

        const topicDuration = calculateTopicDuration(tema.title);
        const accordionContent = getModuleAccordionContent(activeMod, locale);
        const topicAccordion = accordionContent[index + 1];
        return (
          <Fragment key={index}>
            <TopicHeader
              tema={tema}
              index={index}
              expandedTopic={expandedTopic}
              setExpandedTopic={setExpandedTopic}
              isTopicCompleted={isTopicCompleted}
              topicDuration={topicDuration}
              prefersReducedMotion={prefersReducedMotion}
              t={t}
            />

            <AnimatePresence>
              {expandedTopic === index && topicResources?.resources && (
                <motion.div
                  id={`topic-content-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {topicAccordion && (
                    <div className="pl-4 md:pl-8 lg:pl-14 pr-4 pb-3">
                      <div className="rounded-2xl border border-[var(--theme-emphasis)]/10 bg-[var(--theme-emphasis)]/[0.03] dark:bg-slate-800/60 p-4 space-y-3">
                        <div>
                          <h4 className="text-sm font-bold text-[var(--theme-emphasis)] dark:text-[#4DA8C4]">
                            {topicAccordion.objective}
                          </h4>
                          {topicAccordion.objectiveDesc && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                              {topicAccordion.objectiveDesc}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {(() => {
                    const types = getResourceTypesForTopic(tema.title, locale);
                    const counts = countResourcesByType(tema.title, locale);
                    if (!types || types.length <= 1) return null;
                    const typeLabels = {
                      video: t("ialab.resource_type.video"),
                      pdf: t("ialab.resource_type.pdf"),
                      document: t("ialab.resource_type.document"),
                      ova: t("ialab.resource_type.ova"),
                      ova_interactive: t("ialab.resource_type.ova"),
                      image: t("ialab.resource_type.image"),
                    };
                    return (
                      <div
                        className="flex gap-1.5 pl-4 md:pl-8 lg:pl-14 pr-4 pb-2 flex-wrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => setFilterType("all")}
                          className={`text-xs font-semibold px-4 py-2 min-h-[36px] rounded-full transition-all duration-200 ${filterType === "all" ? "bg-gradient-to-r from-[var(--theme-emphasis)] to-[var(--theme-primary)] text-white shadow-sm hover:shadow-md" : "bg-slate-100/80 text-slate-500 hover:bg-slate-200/80 hover:text-slate-700 dark:bg-slate-700/80 dark:text-slate-300 dark:hover:bg-slate-600/80"}`}
                        >
                          {t("ialab.filter_all")}{" "}
                          {topicResources?.resources?.length || 0}
                        </button>
                        {types.map((type) => (
                          <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`text-xs font-semibold px-4 py-2 min-h-[36px] rounded-full transition-all duration-200 ${filterType === type ? "bg-gradient-to-r from-[var(--theme-emphasis)] to-[var(--theme-primary)] text-white shadow-sm hover:shadow-md" : "bg-slate-100/80 text-slate-500 hover:bg-slate-200/80 hover:text-slate-700 dark:bg-slate-700/80 dark:text-slate-300 dark:hover:bg-slate-600/80"}`}
                          >
                            {typeLabels[type] || type} {counts[type] || 0}
                          </button>
                        ))}
                      </div>
                    );
                  })()}
                  <motion.div
                    className="pl-4 md:pl-8 lg:pl-14 pr-4 pb-2 space-y-1.5"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.03 },
                      },
                    }}
                    initial="hidden"
                    animate="visible"
                  >
                    {topicResources.resources
                      .filter(
                        (res) =>
                          filterType === "all" || res.type === filterType,
                      )
                      .map((resource, resIndex) => {
                        const isResourceCompleted = viewedIds.includes(
                          resource.id,
                        );
                        const resourceLocked = isAdmin
                          ? false
                          : isResourceLocked(index, resIndex, resource.id);
                        return (
                          <ResourceItem
                            key={resource.id}
                            resource={resource}
                            isResourceCompleted={isResourceCompleted}
                            resourceLocked={resourceLocked}
                            justCompletedId={justCompletedId}
                            bookmarkedIds={bookmarkedIds}
                            toggleBookmark={toggleBookmark}
                            prefersReducedMotion={prefersReducedMotion}
                            t={t}
                            onClick={(e) => {
                              e.stopPropagation();
                              useIALabStore
                                .getState()
                                .setLastVisitedLesson(activeMod, index + 1);
                              useIALabStore
                                .getState()
                                .markLessonInProgress(activeMod, index + 1);
                              const allResources =
                                topicResources?.resources || [];
                              const idx = allResources.findIndex(
                                (r) => r.id === resource.id,
                              );
                              setSelectedResource(resource);
                              setSelectedResourceType(resource.type);
                              setCurrentTopicResources(allResources);
                              setActiveResourceIndex(idx >= 0 ? idx : 0);
                              setViewerModalOpen(true);
                            }}
                          />
                        );
                      })}
                  </motion.div>

                  {totalResources > 0 && (
                    <div className="pl-4 md:pl-8 lg:pl-14 pr-4 pb-3 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-1" role="none">
                          <ModuleProgressBar
                            viewedCount={topicCompletedCount}
                            totalCount={totalResources}
                            t={t}
                          />
                        </div>
                        <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                          {t("ialab.topic.completed", {
                            completed: topicCompletedCount,
                            total: totalResources,
                          })}
                        </span>
                      </div>

                      {(() => {
                        const isLastTopic =
                          index === moduleData.topics.length - 1;
                        const allDone = moduleData.topics.every((t) => {
                          const tr = getResourcesForTopic(t.title, locale);
                          const ids = tr?.resources?.map((r) => r.id) || [];
                          return (
                            ids.length > 0 &&
                            ids.every((id) => viewedIds.includes(id))
                          );
                        });

                        if (allDone && isLastTopic) {
                          return (
                            <button
                              disabled
                              className="w-full py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-bold flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
                            >
                              <Icon
                                name="fa-check"
                                className="w-4 h-4"
                                aria-hidden="true"
                              />
                              {t("ialab.completed")}
                            </button>
                          );
                        }

                        if (isLastTopic && activeMod < 5) {
                          return (
                            <motion.button
                              whileHover={
                                prefersReducedMotion ? {} : { scale: 1.01 }
                              }
                              whileTap={
                                prefersReducedMotion ? {} : { scale: 0.97 }
                              }
                              onClick={() => {
                                useIALabStore
                                  .getState()
                                  .setActiveMod(activeMod + 1);
                                setExpandedTopic(0);
                              }}
                              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[var(--theme-emphasis)] to-[var(--theme-primary)] text-white text-sm font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-200"
                            >
                              {t("ialab.continue_lesson")}
                              <Icon
                                name="fa-arrow-right"
                                className="w-4 h-4"
                                aria-hidden="true"
                              />
                            </motion.button>
                          );
                        }
                        if (isLastTopic) return null;
                        return (
                          <motion.button
                            whileHover={
                              prefersReducedMotion ? {} : { scale: 1.01 }
                            }
                            whileTap={
                              prefersReducedMotion ? {} : { scale: 0.97 }
                            }
                            onClick={() => setExpandedTopic(index + 1)}
                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[var(--theme-emphasis)] to-[var(--theme-primary)] text-white text-sm font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-200"
                          >
                            {t("ialab.continue_lesson")}
                            <Icon
                              name="fa-arrow-right"
                              className="w-4 h-4"
                              aria-hidden="true"
                            />
                          </motion.button>
                        );
                      })()}

                      {index === moduleData.topics.length - 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            useIALabStore
                              .getState()
                              .setPracticeTool("flashcards");
                          }}
                          className="w-full py-2.5 rounded-xl border border-[var(--theme-emphasis)]/25 dark:border-[var(--theme-emphasis)]/40 bg-[var(--theme-emphasis)]/5 dark:bg-[var(--theme-emphasis)]/10 text-[var(--theme-emphasis)] dark:text-[#4DA8C4] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[var(--theme-emphasis)]/10 dark:hover:bg-[var(--theme-emphasis)]/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--theme-emphasis)]/30"
                        >
                          <Icon
                            name="fa-cards-blank"
                            className="w-3.5 h-3.5"
                            aria-hidden="true"
                          />
                          {t("ialab.flashcard_review_btn")}
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-[var(--theme-primary)]/15 dark:bg-[var(--theme-primary)]/25 text-[var(--theme-primary)]-dark dark:text-[var(--theme-primary)]">
                            <Icon
                              name="fa-star"
                              className="w-2.5 h-2.5"
                              aria-hidden="true"
                            />
                            {t("ialab.flashcard_review_xp")}
                          </span>
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </Fragment>
        );
      })}
    </>
  );
};

ModuleTopicAccordion.propTypes = {
  moduleData: PropTypes.object,
  expandedTopic: PropTypes.number,
  setExpandedTopic: PropTypes.func,
  filterType: PropTypes.string,
  setFilterType: PropTypes.func,
  resourcesByTopic: PropTypes.object,
  viewedIds: PropTypes.array,
  isAdmin: PropTypes.bool,
  isResourceLocked: PropTypes.func,
  calculateTopicDuration: PropTypes.func,
  toggleBookmark: PropTypes.func,
  prefersReducedMotion: PropTypes.bool,
  activeMod: PropTypes.number,
  setSelectedResource: PropTypes.func,
  setSelectedResourceType: PropTypes.func,
  setCurrentTopicResources: PropTypes.func,
  setActiveResourceIndex: PropTypes.func,
  setViewerModalOpen: PropTypes.func,
  justCompletedId: PropTypes.string,
  bookmarkedIds: PropTypes.array,
  t: PropTypes.func,
};

export default ModuleTopicAccordion;
