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
            <div className="relative p-[1.5px] rounded-2xl bg-gradient-to-b from-slate-100/80 to-transparent dark:from-slate-700/40">
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-petroleum/[0.04] to-corporate/[0.02] rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-tr from-petroleum/[0.03] to-corporate/[0.02] rounded-full blur-2xl pointer-events-none" />
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl transition-all duration-300 z-10 ${
                  isTopicCompleted
                    ? "bg-emerald-400"
                    : "bg-gradient-to-r from-petroleum via-petroleum-dark to-corporate"
                }`}
              />
              <motion.button
                data-testid={`topic-btn-${index}`}
                whileHover={prefersReducedMotion ? {} : { scale: 1.005 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.99 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                onClick={() => {
                  setExpandedTopic((prev) => (prev === index ? null : index));
                }}
                aria-expanded={expandedTopic === index}
                aria-controls={`topic-content-${index}`}
                className={`group flex items-center gap-4 w-full px-5 py-4 bg-white dark:bg-slate-800 rounded-[calc(2rem-1.5px)] shadow-sm hover:shadow-lg hover:shadow-petroleum/5 transition-all duration-300 cursor-pointer text-left border border-transparent hover:border-petroleum/20 dark:hover:border-petroleum/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40 ${
                  isTopicCompleted
                    ? "bg-gradient-to-r from-emerald-50/30 to-transparent dark:from-emerald-900/10"
                    : ""
                }`}
                aria-label={t("ialab.topic.resources_aria", {
                  title: tema.title,
                })}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm transition-all duration-300 ${
                    isTopicCompleted
                      ? "bg-emerald-100 dark:bg-emerald-900/30"
                      : "bg-gradient-to-br from-petroleum/15 to-corporate/15 group-hover:from-petroleum/20 group-hover:to-corporate/20 dark:from-petroleum/20 dark:to-corporate/20"
                  }`}
                >
                  <Icon
                    name={tema.icon}
                    className={`text-xl ${
                      isTopicCompleted
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-petroleum dark:text-corporate"
                    }`}
                    aria-hidden="true"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4
                    className={`text-base font-semibold truncate transition-colors duration-300 flex items-center gap-2 font-montserrat ${
                      isTopicCompleted
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-slate-800 group-hover:text-petroleum dark:text-slate-100"
                    }`}
                  >
                    {tema.title}
                    {isTopicCompleted && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-400 px-1.5 py-0.5 rounded-md flex-shrink-0">
                        {t("ialab.completed")}
                      </span>
                    )}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-petroleum dark:text-petroleum bg-gradient-to-r from-petroleum/[0.06] to-transparent">
                      <Icon
                        name="fa-file"
                        className="w-3 h-3"
                        aria-hidden="true"
                      />
                      {tema.resources} {t("ialab.resources_label")}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-corporate bg-corporate/10 dark:bg-corporate/20">
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
                      ? "bg-petroleum/10 rotate-180 dark:bg-petroleum/20"
                      : "bg-corporate/15 group-hover:scale-110 group-hover:bg-petroleum/15 dark:bg-corporate/20"
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
            </div>

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
                          className={`text-xs font-semibold px-4 py-2 min-h-[36px] rounded-full transition-all duration-200 ${filterType === "all" ? "bg-gradient-to-r from-petroleum to-corporate text-white shadow-sm hover:shadow-md" : "bg-slate-100/80 text-slate-500 hover:bg-slate-200/80 hover:text-slate-700 dark:bg-slate-700/80 dark:text-slate-300 dark:hover:bg-slate-600/80"}`}
                        >
                          {t("ialab.filter_all")}{" "}
                          {topicResources?.resources?.length || 0}
                        </button>
                        {types.map((type) => (
                          <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`text-xs font-semibold px-4 py-2 min-h-[36px] rounded-full transition-all duration-200 ${filterType === type ? "bg-gradient-to-r from-petroleum to-corporate text-white shadow-sm hover:shadow-md" : "bg-slate-100/80 text-slate-500 hover:bg-slate-200/80 hover:text-slate-700 dark:bg-slate-700/80 dark:text-slate-300 dark:hover:bg-slate-600/80"}`}
                          >
                            {typeLabels[type] || type} {counts[type] || 0}
                          </button>
                        ))}
                      </div>
                    );
                  })()}
                  <motion.div
                    className="pl-14 pr-4 pb-2 space-y-1.5"
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
                        const isNextToView =
                          !resourceLocked && !isResourceCompleted;
                        return (
                          <motion.div
                            key={resource.id}
                            variants={{
                              hidden: { opacity: 0, x: -8 },
                              visible: {
                                opacity: 1,
                                x: 0,
                                transition: {
                                  type: "spring",
                                  stiffness: 300,
                                  damping: 24,
                                },
                              },
                            }}
                          >
                            <motion.button
                              data-testid={`resource-btn-${resource.id}`}
                              whileHover={
                                prefersReducedMotion || resourceLocked
                                  ? {}
                                  : { x: 3 }
                              }
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 24,
                              }}
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
                                      setActiveResourceIndex(
                                        idx >= 0 ? idx : 0,
                                      );
                                      setViewerModalOpen(true);
                                    }
                              }
                              className={`group/res relative overflow-hidden rounded-xl border transition-all duration-300 text-left ${
                                isResourceCompleted
                                  ? "bg-emerald-50/40 border-emerald-200/40 cursor-pointer"
                                  : resourceLocked
                                    ? "bg-slate-50/50 border-slate-200/40 cursor-not-allowed opacity-60 dark:bg-slate-800/40 dark:border-slate-700/30"
                                    : "bg-white dark:bg-slate-800 border-slate-200/60 dark:border-slate-700/50 hover:border-corporate/40 hover:shadow-lg hover:shadow-corporate/5 cursor-pointer"
                              } ${justCompletedId === resource.id ? "ialab-animate-shimmer-pulse" : ""}`}
                            >
                              {!isResourceCompleted && !resourceLocked && (
                                <div className="absolute inset-0 bg-gradient-to-r from-corporate/[0.03] to-transparent opacity-0 group-hover/res:opacity-100 transition-opacity duration-500 pointer-events-none" />
                              )}
                              <div className="relative flex items-center gap-3 p-3">
                                <div
                                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                                    resourceLocked
                                      ? "bg-slate-100 dark:bg-slate-700"
                                      : isResourceCompleted
                                        ? "bg-emerald-100 dark:bg-emerald-900/30"
                                        : "bg-gradient-to-br from-petroleum/10 to-corporate/10 group-hover/res:from-petroleum/15 group-hover/res:to-corporate/15 dark:from-petroleum/20 dark:to-corporate/20"
                                  }`}
                                >
                                  <Icon
                                    name={
                                      resourceLocked
                                        ? "fa-lock"
                                        : getResourceIcon(resource.type)
                                    }
                                    className={`w-4 h-4 ${
                                      resourceLocked
                                        ? "text-slate-300 dark:text-slate-500"
                                        : isResourceCompleted
                                          ? "text-emerald-600 dark:text-emerald-400"
                                          : "text-petroleum"
                                    }`}
                                    aria-hidden="true"
                                  />
                                </div>
                                <div className="flex-1 min-w-0 text-left">
                                  <p
                                    className={`text-sm font-medium truncate transition-colors ${
                                      isResourceCompleted
                                        ? "text-emerald-700 dark:text-emerald-400"
                                        : resourceLocked
                                          ? "text-slate-400"
                                          : "text-slate-700 group-hover/res:text-petroleum dark:text-slate-200 dark:group-hover/res:text-petroleum"
                                    }`}
                                  >
                                    {resource.title}
                                  </p>
                                  {getResourceMeta(resource, t) && (
                                    <p
                                      className={`text-xs mt-0.5 ${resourceLocked ? "text-slate-300" : "text-slate-600 dark:text-slate-400"}`}
                                    >
                                      {getResourceMeta(resource, t)}
                                    </p>
                                  )}
                                </div>
                                <span
                                  className={`text-[10px] font-semibold px-3 py-1 rounded-full transition-all flex-shrink-0 ${
                                    isResourceCompleted
                                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                                      : resourceLocked
                                        ? "bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500"
                                        : "bg-gradient-to-r from-petroleum to-corporate text-white shadow-sm"
                                  }`}
                                >
                                  {isResourceCompleted
                                    ? t("ialab.status.viewed")
                                    : resourceLocked
                                      ? t("ialab.status.locked")
                                      : t("ialab.status.start_here")}
                                </span>
                                <div
                                  onClick={(e) =>
                                    toggleBookmark(resource.id, e)
                                  }
                                  onKeyDown={(e) => {
                                    if (
                                      e.key === "Enter" ||
                                      e.key === " "
                                    ) {
                                      e.preventDefault();
                                      toggleBookmark(resource.id, e);
                                    }
                                  }}
                                  role="button"
                                  tabIndex={0}
                                  className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40 cursor-pointer"
                                  aria-label={
                                    bookmarkedIds.includes(resource.id)
                                      ? t("ialab.bookmark.remove")
                                      : t("ialab.bookmark.save")
                                  }
                                >
                                  <Icon
                                    name="fa-bookmark"
                                    className={`text-sm transition-all duration-300 ${
                                      bookmarkedIds.includes(resource.id)
                                        ? "text-amber-500 drop-shadow-sm"
                                        : "text-slate-300 group-hover/res:text-amber-400 dark:text-slate-600"
                                    }`}
                                    aria-hidden="true"
                                  />
                                </div>
                              </div>
                            </motion.button>
                          </motion.div>
                        );
                      })}
                  </motion.div>

                  {totalResources > 0 && (
                    <div className="pl-14 pr-4 pb-3 space-y-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner"
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
                          <motion.div
                            className="h-full bg-gradient-to-r from-petroleum to-corporate rounded-full relative overflow-hidden"
                            initial={{ width: 0 }}
                            animate={{
                              width: `${Math.round((topicCompletedCount / totalResources) * 100)}%`,
                            }}
                            transition={{
                              duration: 0.6,
                              ease: [0.32, 0.72, 0, 1],
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                          </motion.div>
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
