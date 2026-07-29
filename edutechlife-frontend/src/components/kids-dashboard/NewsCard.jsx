import { useState, memo } from "react";
import { motion } from "framer-motion";
import { Icon } from "../../utils/iconMapping";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "../../data/newsData";

const getCategoryIcon = (category) => {
  const map = {
    "did-you-know": "fa-lightbulb",
    "new-tools": "fa-rocket",
    "dani-tips": "fa-star",
  };
  return map[category] || "fa-newspaper";
};

const NewsCard = memo(function NewsCard({ article, isRead, onRead, onOpen }) {
  const [imgError, setImgError] = useState(false);

  const handleOpen = () => {
    if (!isRead) onRead(article.id);
    onOpen(article);
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg border border-[#E2E8F0]/50 group cursor-pointer"
      onClick={handleOpen}
    >
      {/* Hero Image */}
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-[#004B63]/10 to-[#4DA8C4]/10">
        {!imgError ? (
          <img
            src={article.imageUrl}
            alt={article.imageAlt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#004B63]/5 to-[#4DA8C4]/5">
            <Icon
              name={getCategoryIcon(article.category)}
              className="w-16 h-16 text-[#4DA8C4]/30"
            />
          </div>
        )}

        {/* Category Badge */}
        <span
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-md"
          style={{ backgroundColor: CATEGORY_COLORS[article.category] }}
        >
          {CATEGORY_LABELS[article.category]}
        </span>

        {!isRead && (
          <span className="absolute top-3 right-3 w-3 h-3 bg-[#FF6B9D] rounded-full animate-pulse shadow-lg shadow-[#FF6B9D]/50" />
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Data points */}
        {article.dataPoints && article.dataPoints.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {article.dataPoints.slice(0, 3).map((dp, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2 py-1 bg-[#F1F5F9] rounded-lg text-xs font-semibold text-[#004B63]"
              >
                <Icon name={`fa-${dp.icon}`} className="w-3.5 h-3.5" />
                {dp.value}
              </span>
            ))}
          </div>
        )}

        <h3
          className={`text-sm font-bold mb-2 line-clamp-2 leading-snug ${
            isRead ? "text-[#64748B]" : "text-[#004B63]"
          }`}
        >
          {article.title}
        </h3>

        <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2 mb-3">
          {article.summary}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-[#94A3B8]">{article.readTime}</span>
          <span className="text-xs font-semibold text-[#4DA8C4] opacity-0 group-hover:opacity-100 transition-opacity">
            Leer más →
          </span>
        </div>
      </div>
    </motion.div>
  );
});

export default NewsCard;
