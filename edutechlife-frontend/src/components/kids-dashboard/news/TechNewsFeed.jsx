import { memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNewsFeed } from "../../../hooks/useNewsFeed";
import { CATEGORIES, CATEGORY_COLORS } from "../../../data/newsData";
import { useIngenIAKids } from "../../../context/IngenIAKidsContext";

const CategoryTab = memo(({ cat, active, unread, onClick }) => {
  const color = CATEGORY_COLORS[cat.id] || "#4DA8C4";
  return (
    <button
      type="button"
      onClick={() => onClick(cat.id)}
      aria-pressed={active}
      className={`relative w-full min-h-[48px] px-2 py-2 rounded-2xl text-xs font-bold leading-tight text-center transition-all border-2 ${
        active
          ? "text-white border-transparent shadow-md"
          : "bg-white border-[#E2E8F0] text-[#475569]"
      }`}
      style={active ? { backgroundColor: color, borderColor: color } : {}}
    >
      {cat.label}
      {unread > 0 && (
        <span
          className="absolute -top-1.5 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-[#EF476F] text-white text-[10px] font-black leading-none border-2 border-white"
          aria-label={`${unread} sin leer`}
        >
          {unread}
        </span>
      )}
    </button>
  );
});
CategoryTab.displayName = "CategoryTab";

const ArticleCard = memo(({ article, isRead, onRead, darkMode }) => {
  const color = CATEGORY_COLORS[article.category] || "#4DA8C4";

  const handleClick = useCallback(() => {
    onRead(article.id);
  }, [article.id, onRead]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Leer: ${article.title}`}
      className={`rounded-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-[#9D4EDD]/30 overflow-hidden border cursor-pointer transition-all shadow-sm hover:shadow-md hover:border-[#9D4EDD]/30 ${
        darkMode
          ? "bg-[#1E293B]/80 border-[#334155]/50"
          : "bg-white/90 border-[#E2E8F0]"
      } ${isRead ? "opacity-60" : ""}`}
    >
      {/* Color strip */}
      <div className="h-1.5" style={{ backgroundColor: color }} />

      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3
            className={`text-sm font-bold leading-snug flex-1 ${
              darkMode ? "text-white" : "text-[#1E293B]"
            }`}
          >
            {article.title}
          </h3>
          {isRead && (
            <span className="text-green-500 text-xs shrink-0 mt-0.5">✓</span>
          )}
        </div>

        <p
          className={`text-xs leading-relaxed line-clamp-3 mb-3 ${
            darkMode ? "text-[#94A3B8]" : "text-[#64748B]"
          }`}
        >
          {article.summary}
        </p>

        {article.dataPoints?.length > 0 && (
          <div className="flex gap-3 flex-wrap mb-3">
            {article.dataPoints.slice(0, 3).map((dp, i) => (
              <div
                key={i}
                className={`flex flex-col items-center text-center px-2.5 py-1.5 rounded-xl ${
                  darkMode ? "bg-[#0F172A]/60" : "bg-[#F8FAFC]"
                }`}
              >
                <span
                  className="text-sm font-black leading-none"
                  style={{ color }}
                >
                  {dp.value}
                </span>
                <span
                  className={`text-[10px] mt-0.5 ${
                    darkMode ? "text-[#64748B]" : "text-[#94A3B8]"
                  }`}
                >
                  {dp.label}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span
            className={`text-[10px] ${
              darkMode ? "text-[#475569]" : "text-[#CBD5E1]"
            }`}
          >
            ⏱ {article.readTime}
            {article.source ? " · Con fuente ✓" : ""}
          </span>
          <span className="text-[11px] font-semibold" style={{ color }}>
            {isRead ? "Leer de nuevo →" : "Leer más →"}
          </span>
        </div>
      </div>
    </motion.div>
  );
});
ArticleCard.displayName = "ArticleCard";

const ArticleModal = memo(({ article, onClose, darkMode, onChallenge }) => {
  if (!article) return null;
  const color = CATEGORY_COLORS[article.category] || "#4DA8C4";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-lg rounded-3xl overflow-hidden max-h-[85dvh] flex flex-col ${
          darkMode ? "bg-[#0F172A]" : "bg-white"
        }`}
      >
        <div className="h-1.5 shrink-0" style={{ backgroundColor: color }} />
        <div className="overflow-y-auto flex-1 p-5">
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar artículo"
            className={`float-right ml-3 mb-2 w-11 h-11 flex items-center justify-center rounded-full text-lg font-bold ${
              darkMode
                ? "bg-[#1E293B] text-[#94A3B8]"
                : "bg-[#F1F5F9] text-[#64748B]"
            }`}
          >
            ×
          </button>
          <h2
            className={`text-base font-black leading-snug mb-3 ${
              darkMode ? "text-white" : "text-[#1E293B]"
            }`}
          >
            {article.title}
          </h2>
          <p
            className={`text-[11px] mb-4 ${
              darkMode ? "text-[#475569]" : "text-[#CBD5E1]"
            }`}
          >
            ⏱ {article.readTime} de lectura
          </p>
          {article.dataPoints?.length > 0 && (
            <div className="flex gap-3 flex-wrap mb-4">
              {article.dataPoints.map((dp, i) => (
                <div
                  key={i}
                  className={`flex flex-col items-center text-center px-3 py-2 rounded-xl ${
                    darkMode ? "bg-[#1E293B]" : "bg-[#F8FAFC]"
                  }`}
                >
                  <span className="text-base font-black" style={{ color }}>
                    {dp.value}
                  </span>
                  <span
                    className={`text-[10px] mt-0.5 ${
                      darkMode ? "text-[#64748B]" : "text-[#94A3B8]"
                    }`}
                  >
                    {dp.label}
                  </span>
                </div>
              ))}
            </div>
          )}
          <div
            className={`text-sm leading-relaxed whitespace-pre-line ${
              darkMode ? "text-[#CBD5E1]" : "text-[#334155]"
            }`}
          >
            {article.content}
          </div>

          {article.source && (
            <p
              className={`mt-4 pt-3 border-t text-[11px] leading-snug ${
                darkMode
                  ? "border-[#1E293B] text-[#64748B]"
                  : "border-[#F1F5F9] text-[#94A3B8]"
              }`}
            >
              <span className="font-bold">📚 Fuente:</span> {article.source}
            </p>
          )}

          {/* Explora 2.0 (§35): content → challenge with Dani */}
          {onChallenge && (
            <button
              onClick={() => {
                onChallenge(article);
                onClose();
              }}
              className="w-full mt-5 py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${color} 0%, #9D4EDD 100%)`,
              }}
            >
              🤖 Rétame con Dani sobre esto →
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
});
ArticleModal.displayName = "ArticleModal";

const TechNewsFeed = () => {
  const { darkMode, setDocumentForDani } = useIngenIAKids();

  // Explora 2.0 (§35): turn a passive article into an active challenge with Dani.
  const handleChallenge = useCallback(
    (article) => {
      if (!article) return;
      setDocumentForDani?.({
        title: article.title,
        subject: article.category || "Tech & IA",
        summary: article.summary || (article.content || "").slice(0, 320),
        difficulty: "exploración",
        tutoringQuestions: [
          `Acabo de leer "${article.title}". ¿Me lo explicas con un ejemplo sencillo?`,
          "¿Cómo podría esto cambiar mi vida diaria o mi futuro?",
          "Si yo quisiera crear algo con esta idea, ¿por dónde empiezo?",
        ],
      });
      window.dispatchEvent(new CustomEvent("smartboard:open-dani"));
    },
    [setDocumentForDani],
  );
  const {
    articles,
    allArticles,
    activeCategory,
    setCategory,
    isLoading,
    error,
    readNews,
    unreadCount,
    markAsRead,
    openArticle,
    setOpenArticle,
  } = useNewsFeed();

  const unreadByCategory = (catId) =>
    allArticles.filter((a) => a.category === catId && !readNews.includes(a.id))
      .length;

  return (
    <div className="space-y-5">
      <p className="px-1 text-sm font-semibold text-[#64748B]">
        {unreadCount > 0
          ? `📬 ${unreadCount} ${unreadCount === 1 ? "artículo" : "artículos"} por leer`
          : "¡Estás al día con el mundo tech! 🎉"}
      </p>

      {/* Category tabs */}
      <div
        className="grid gap-2 pt-1.5"
        style={{
          gridTemplateColumns: `repeat(${CATEGORIES.length}, minmax(0, 1fr))`,
        }}
      >
        {CATEGORIES.map((cat) => (
          <CategoryTab
            key={cat.id}
            cat={cat}
            active={activeCategory === cat.id}
            unread={unreadByCategory(cat.id)}
            onClick={setCategory}
          />
        ))}
      </div>

      {/* Articles */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-36 rounded-2xl animate-pulse ${
                darkMode ? "bg-[#1E293B]" : "bg-[#F1F5F9]"
              }`}
            />
          ))}
        </div>
      ) : error ? (
        <div
          className={`rounded-2xl p-6 text-center ${
            darkMode ? "bg-[#1E293B]" : "bg-[#FFF7ED]"
          }`}
        >
          <p className="text-2xl mb-2">📡</p>
          <p
            className={`text-sm ${
              darkMode ? "text-[#94A3B8]" : "text-[#92400E]"
            }`}
          >
            No se pudo cargar el feed. Revisa tu conexión.
          </p>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-3xl mb-2">📭</p>
          <p
            className={`text-sm ${
              darkMode ? "text-[#64748B]" : "text-[#94A3B8]"
            }`}
          >
            No hay artículos en esta categoría aún.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="sync">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                isRead={readNews.includes(article.id)}
                darkMode={darkMode}
                onRead={(id) => {
                  markAsRead(id);
                  setOpenArticle(article);
                }}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Article modal */}
      <AnimatePresence>
        {openArticle && (
          <ArticleModal
            article={openArticle}
            darkMode={darkMode}
            onClose={() => setOpenArticle(null)}
            onChallenge={handleChallenge}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TechNewsFeed;
