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

const getResourceIcon = (type) => {
  if (type === "video") return "fa-video";
  if (type === "pdf" || type === "document") return "fa-file-lines";
  if (type === "ova" || type === "ova_interactive") return "fa-brain";
  if (type === "image") return "fa-image";
  return "fa-file";
};

const getResourceMeta = (res, t) => {
  if (res.type === "video") return res.duration || "";
  if (res.pages) return t("ialab.resource_pages", { pages: res.pages });
  if (res.estimatedTime) return res.estimatedTime;
  if (res.format) return res.format;
  if (res.size) return res.size;
  return "";
};

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
        return (
          <Fragment key={index}>
            <motion.button
              data-testid={`topic-btn-${index}`}
              whileHover={prefersReducedMotion ? {} : { scale: 1.01 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.99 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              onClick={() => {
                setExpandedTopic((prev) => (prev === index ? null : index));
              }}
              aria-expanded={expandedTopic === index}
              aria-controls={`topic-content-${index}`}
              className={`group flex items-center gap-4 w-full px-5 py-4 bg-white border border-slate-200/60 rounded-xl shadow-sm hover:shadow hover:bg-slate-50 transition-all duration-300 cursor-pointer text-left dark:bg-slate-800 dark:border-slate-700/60 dark:hover:bg-slate-700/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40 ${
                isTopicCompleted
                  ? "border-l-4 border-l-emerald-500"
                  : "border-l-4 border-l-petroleum hover:border-l-corporate"
              }`}
              aria-label={t("ialab.topic.resources_aria", {
                title: tema.title,
              })}
            >
              <div className="flex flex-col items-center gap-0.5">
                <Icon
                  name={tema.icon}
                  className={`text-xl flex-shrink-0 ${isTopicCompleted ? "text-emerald-600" : "text-petroleum"}`}
                  aria-hidden="true"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4
                  className={`text-base font-semibold truncate transition-colors duration-300 flex items-center gap-2 font-montserrat ${
                    isTopicCompleted
                      ? "text-emerald-700"
                      : "text-slate-800 group-hover:text-petroleum dark:text-slate-100"
                  }`}
                >
                  {tema.title}
                  {isTopicCompleted && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-md flex-shrink-0">
                      {t("ialab.completed")}
                    </span>
                  )}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-petroleum dark:text-petroleum">
                    <Icon
                      name="fa-file"
                      className="w-3 h-3"
                      aria-hidden="true"
                    />
                    {tema.resources} {t("ialab.resources_label")}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-corporate bg-corporate/10">
                    <Icon
                      name="fa-clock"
                      className="w-3 h-3"
                      aria-hidden="true"
                    />
                    {topicDuration}
                  </span>
                </div>
              </div>

              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ml-2 ${
                  expandedTopic === index
                    ? "bg-petroleum/10 rotate-180"
                    : "bg-corporate/15 group-hover:scale-110"
                }`}
              >
                <Icon
                  name="fa-chevron-down"
                  className={`w-3.5 h-3.5 transition-colors ${
                    expandedTopic === index
                      ? "text-petroleum"
                      : "text-corporate"
                  }`}
                  aria-hidden="true"
                />
              </div>
            </motion.button>

            <AnimatePresence>
              {expandedTopic === index && topicResources?.resources && (
                <motion.div
                  id={`topic-content-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
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
                        className="flex gap-1.5 pl-14 pr-4 pb-2 flex-wrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => setFilterType("all")}
                          className={`text-xs font-medium px-3 py-2 min-h-[36px] rounded-full transition-all ${filterType === "all" ? "bg-petroleum dark:bg-petroleum text-white dark:text-white shadow-sm" : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300"}`}
                        >
                          {t("ialab.filter_all")}{" "}
                          {topicResources?.resources?.length || 0}
                        </button>
                        {types.map((type) => (
                          <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`text-xs font-medium px-3 py-2 min-h-[36px] rounded-full transition-all ${filterType === type ? "bg-petroleum dark:bg-petroleum text-white dark:text-white shadow-sm" : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300"}`}
                          >
                            {typeLabels[type] || type} {counts[type] || 0}
                          </button>
                        ))}
                      </div>
                    );
                  })()}
                  <div className="pl-14 pr-4 pb-2 space-y-1.5">
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
                        const isNextToView =
                          !resourceLocked && !isResourceCompleted;
                        return (
                          <motion.button
                            key={resource.id}
                            data-testid={`resource-btn-${resource.id}`}
                            whileHover={
                              prefersReducedMotion || resourceLocked
                                ? {}
                                : { x: 4 }
                            }
                            onClick={
                              resourceLocked
                                ? undefined
                                : (e) => {
                                    e.stopPropagation();
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
                                  }
                            }
                            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left group/res ${
                              isResourceCompleted
                                ? "bg-emerald-50/50 border-emerald-200/60 cursor-pointer"
                                : resourceLocked
                                  ? "bg-slate-50 border-slate-100 cursor-not-allowed opacity-60 dark:bg-slate-800/50 dark:border-slate-700/30"
                                  : "bg-white border-corporate/40 shadow-[0_0_12px_rgba(0,188,212,0.15)] hover:border-corporate hover:shadow-[0_0_20px_rgba(0,188,212,0.25)] cursor-pointer dark:bg-slate-800 dark:border-corporate/50 dark:hover:border-corporate"
                            } ${justCompletedId === resource.id ? "ialab-animate-shimmer-pulse" : ""}`}
                          >
                            <div className="flex items-center justify-center w-8 h-8 flex-shrink-0">
                              <Icon
                                name={
                                  resourceLocked
                                    ? "fa-lock"
                                    : getResourceIcon(resource.type)
                                }
                                className={`w-4 h-4 ${resourceLocked ? "text-slate-300" : ""}`}
                                aria-hidden="true"
                              />
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                              <p
                                className={`text-sm font-medium truncate transition-colors ${
                                  isResourceCompleted
                                    ? "text-emerald-700"
                                    : resourceLocked
                                      ? "text-slate-400"
                                      : "text-slate-700 group-hover/res:text-petroleum dark:text-slate-200 dark:group-hover/res:text-petroleum"
                                }`}
                              >
                                {resource.title}
                              </p>
                              {getResourceMeta(resource, t) && (
                                <p
                                  className={`text-xs mt-0.5 ${resourceLocked ? "text-slate-300" : "text-slate-600"}`}
                                >
                                  {getResourceMeta(resource, t)}
                                </p>
                              )}
                            </div>
                            <div
                              className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                                isResourceCompleted
                                  ? "bg-emerald-100 text-emerald-600"
                                  : resourceLocked
                                    ? "bg-slate-100 text-slate-400"
                                    : "bg-corporate/15 text-corporate font-bold animate-pulse"
                              }`}
                            >
                              {isResourceCompleted
                                ? t("ialab.status.viewed")
                                : resourceLocked
                                  ? t("ialab.status.locked")
                                  : t("ialab.status.start_here")}
                            </div>
                            <div
                              onClick={(e) => toggleBookmark(resource.id, e)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  toggleBookmark(resource.id, e);
                                }
                              }}
                              role="button"
                              tabIndex={0}
                              className="flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-md hover:bg-amber-100/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40 cursor-pointer"
                              aria-label={
                                bookmarkedIds.includes(resource.id)
                                  ? t("ialab.bookmark.remove")
                                  : t("ialab.bookmark.save")
                              }
                            >
                              <Icon
                                name="fa-bookmark"
                                className={`text-xs transition-all duration-200 ${bookmarkedIds.includes(resource.id) ? "text-amber-500 drop-shadow-sm" : "text-slate-200 group-hover/res:text-amber-400"}`}
                                aria-hidden="true"
                              />
                            </div>
                          </motion.button>
                        );
                      })}
                  </div>

                  {totalResources > 0 && (
                    <div className="pl-14 pr-4 pb-3 space-y-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden"
                          role="progressbar"
                          aria-valuenow={Math.round(
                            (topicCompletedCount / totalResources) * 100,
                          )}
                          aria-valuemin="0"
                          aria-valuemax="100"
                          aria-label={t("ialab.topic.progress_aria", {
                            completed: topicCompletedCount,
                            total: totalResources,
                          })}
                        >
                          <div
                            className="h-full bg-gradient-to-r from-petroleum to-corporate rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.round((topicCompletedCount / totalResources) * 100)}%`,
                            }}
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
                              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-petroleum to-corporate text-white text-sm font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-200"
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
                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-petroleum to-corporate text-white text-sm font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-200"
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
