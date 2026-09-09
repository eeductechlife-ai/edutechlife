import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Icon } from "../../utils/iconMapping.jsx";
import { useIALabStore } from "../../store/ialabStore";
import { useTranslation } from "../../i18n/I18nProvider";
import { useIALabProgressContext } from "../../context/IALabContext";
import {
  RESOURCES_ES,
  RESOURCES_EN,
  RESOURCES_PT,
} from "./constants/moduleResources";
import ResourceViewerModal from "./ResourceViewerModal";

const TYPE_ICONS = {
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

function buildFlatResourceMap(locale) {
  const source =
    { en: RESOURCES_EN, pt: RESOURCES_PT, es: RESOURCES_ES }[locale] ||
    RESOURCES_ES;
  const result = [];
  for (const [topicTitle, topicData] of Object.entries(source)) {
    const resources = topicData?.resources || [];
    for (const r of resources) {
      result.push({ ...r, topicTitle });
    }
  }
  return result;
}

const BookmarksTab = () => {
  const { t, locale } = useTranslation();
  const { activeMod = 1 } = useIALabProgressContext() ?? {};
  const nlmFont = { fontFamily: "'Google Sans Text','Roboto','Inter',sans-serif" };
  const isNLM = activeMod === 4;
  const storeToggle = useIALabStore((s) => s.toggleBookmark);
  const getFromStore = useIALabStore((s) => s.getBookmarkedResources);

  const [bookmarkedIds, setBookmarkedIds] = useState(() => getFromStore());

  const toggleBookmark = useCallback(
    (id) => {
      storeToggle(id);
      setBookmarkedIds(getFromStore());
    },
    [storeToggle, getFromStore],
  );

  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [topicResources, setTopicResources] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);

  const bookmarkedResources = useMemo(() => {
    if (!bookmarkedIds.length) return [];
    const allResources = buildFlatResourceMap(locale);
    return allResources.filter((r) => bookmarkedIds.includes(r.id));
  }, [bookmarkedIds, locale]);

  const openResource = (resource, allInTopic) => {
    const idx = allInTopic.findIndex((r) => r.id === resource.id);
    setSelectedResource(resource);
    setSelectedType(resource.type);
    setTopicResources(allInTopic.map(({ topicTitle: _t, ...r }) => r));
    setActiveIdx(idx >= 0 ? idx : 0);
    setViewerOpen(true);
  };

  if (!bookmarkedIds.length) {
    const emptyContent = (
      <div className="p-10 flex flex-col items-center justify-center text-center gap-3">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={isNLM ? { background: "#e6f4ea" } : { background: "color-mix(in srgb, var(--theme-emphasis) 8%, transparent)" }}>
          <Icon name="fa-bookmark" className="text-2xl" style={isNLM ? { color: "#188038" } : {}} />
        </div>
        {isNLM ? (
          <>
            <p style={{ ...nlmFont, fontSize: 14, fontWeight: 600, color: "#202124" }}>{t("ialab.bookmarks_empty_title")}</p>
            <p style={{ ...nlmFont, fontSize: 13, color: "#5f6368", maxWidth: 280 }}>{t("ialab.bookmarks_empty_desc")}</p>
          </>
        ) : (
          <>
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">{t("ialab.bookmarks_empty_title")}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">{t("ialab.bookmarks_empty_desc")}</p>
          </>
        )}
      </div>
    );
    if (isNLM) {
      return (
        <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: "#e0e0e6" }}>
          <div className="flex items-center gap-2.5 px-6 py-4 border-b" style={{ background: "#f8f9ff", borderColor: "#e0e0e6" }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#e6f4ea" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#188038" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            </div>
            <span style={{ ...nlmFont, fontSize: 15, fontWeight: 600, color: "#202124" }}>{t("ialab.bookmarks_tab_label") || "Guardados"}</span>
          </div>
          {emptyContent}
        </div>
      );
    }
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
        {emptyContent}
      </div>
    );
  }

  const byTopic = bookmarkedResources.reduce((acc, r) => {
    (acc[r.topicTitle] = acc[r.topicTitle] || []).push(r);
    return acc;
  }, {});

  const list = (
    <div className="space-y-4">
      {Object.entries(byTopic).map(([topicTitle, resources]) => (
          <div
            key={topicTitle}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden"
          >
            <div className="px-5 py-3 bg-[var(--theme-emphasis)]/4 dark:bg-[var(--theme-emphasis)]/10 border-b border-slate-200/60 dark:border-slate-700/40">
              <p className="text-xs font-bold text-[var(--theme-emphasis)] dark:text-[#4DA8C4] uppercase tracking-wide truncate">
                {topicTitle}
              </p>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700/40">
              {resources.map((resource, i) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[var(--theme-emphasis)]/8 dark:bg-[var(--theme-emphasis)]/20 flex items-center justify-center flex-shrink-0">
                    <Icon
                      name={TYPE_ICONS[resource.type] || "fa-file"}
                      className="text-sm text-[var(--theme-emphasis)] dark:text-[#4DA8C4]"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate group-hover:text-[var(--theme-emphasis)] dark:group-hover:text-[#4DA8C4] transition-colors">
                      {resource.title}
                    </p>
                    {resource.duration && (
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {resource.duration}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => toggleBookmark(resource.id)}
                      className="p-1.5 text-amber-400 hover:text-slate-300 dark:hover:text-slate-600 transition-colors"
                      title="Quitar guardado"
                      aria-label="Quitar guardado"
                    >
                      <Icon name="fa-bookmark" className="text-sm" />
                    </button>
                    <button
                      onClick={() => openResource(resource, resources)}
                      className="px-3 py-1.5 bg-[var(--theme-emphasis)] text-[var(--theme-on-emphasis)] text-xs font-bold rounded-lg hover:bg-[var(--theme-emphasis)]-dark transition-colors shadow-sm"
                    >
                      {t("ialab.bookmarks_open")}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );

  return (
    <>
      {isNLM ? (
        <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: "#e0e0e6" }}>
          <div className="flex items-center gap-2.5 px-6 py-4 border-b" style={{ background: "#f8f9ff", borderColor: "#e0e0e6" }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#e6f4ea" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#188038" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            </div>
            <span style={{ ...nlmFont, fontSize: 15, fontWeight: 600, color: "#202124" }}>{t("ialab.bookmarks_tab_label") || "Guardados"}</span>
          </div>
          <div className="px-6 py-5">{list}</div>
        </div>
      ) : list}

      <ResourceViewerModal
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        resource={selectedResource}
        resourceType={selectedType}
        currentIndex={activeIdx}
        totalResources={topicResources.length}
        onPreviousResource={() => {
          const newIdx = Math.max(0, activeIdx - 1);
          setActiveIdx(newIdx);
          setSelectedResource(topicResources[newIdx]);
          setSelectedType(topicResources[newIdx]?.type);
        }}
        onNextResource={() => {
          const newIdx = Math.min(topicResources.length - 1, activeIdx + 1);
          setActiveIdx(newIdx);
          setSelectedResource(topicResources[newIdx]);
          setSelectedType(topicResources[newIdx]?.type);
        }}
      />
    </>
  );
};

export default BookmarksTab;
