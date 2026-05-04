import { useState, useMemo, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { useSmartBoardKids } from '../../context/SmartBoardKidsContext';

// ==========================================
// News Card Component
// ==========================================
const NewsCard = memo(({ news, isRead, onRead }) => (
  <motion.div
    whileHover={{ y: -8, scale: 1.03, boxShadow: '0 20px 40px rgba(77, 168, 196, 0.15)' }}
    className={`relative bg-white/70 backdrop-blur-xl rounded-2xl p-5 border-2 transition-all cursor-pointer ${
      isRead ? 'border-[#E2E8F0]/50 opacity-75' : 'border-[#4DA8C4]/30 hover:border-[#4DA8C4] shadow-lg'
    }`}
    onClick={() => !isRead && onRead(news.id)}
  >
    {!isRead && (
      <div className="absolute top-3 right-3 w-3 h-3 bg-[#FF6B9D] rounded-full animate-pulse" />
    )}
    
    <div className="flex items-start gap-4">
      <div className="text-4xl">{news.icon}</div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
            news.category === 'IA' ? 'bg-[#4DA8C4]/10 text-[#4DA8C4]' :
            news.category === 'STEAM' ? 'bg-[#66CCCC]/10 text-[#004B63]' :
            'bg-[#FFD166]/10 text-[#FFD166]'
          }`}>
            {news.category}
          </span>
          <span className="text-xs text-[#64748B]">{news.readTime}</span>
        </div>
        
        <h3 className={`text-base font-bold mb-2 ${isRead ? 'text-[#64748B]' : 'text-[#004B63]'}`}>
          {news.title}
        </h3>
        
        <p className="text-sm text-[#64748B] leading-relaxed line-clamp-3">
          {news.summary}
        </p>
        
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-[#64748B]">
            {new Date(news.date).toLocaleDateString('es-ES', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}
          </span>
          {!isRead ? (
            <span className="text-xs font-semibold text-[#4DA8C4]">Marcar como leído →</span>
          ) : (
            <span className="text-xs text-[#66CCCC]">✓ Leído</span>
          )}
        </div>
      </div>
    </div>
  </motion.div>
));

NewsCard.displayName = 'NewsCard';

// ==========================================
// Featured News Banner
// ==========================================
const FeaturedNews = memo(({ news }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative bg-gradient-to-br from-[#004B63] via-[#4DA8C4] to-[#66CCCC] rounded-2xl p-8 text-white overflow-hidden shadow-xl backdrop-blur-xl"
  >
    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20" />
    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16" />
    
    <div className="relative z-10">
      <div className="flex items-center gap-2 mb-3">
        <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold backdrop-blur-sm">
          DESTACADO
        </span>
        <span className="text-xs text-white/80">{news.category}</span>
      </div>
      
      <h2 className="text-2xl font-black mb-3">{news.icon} {news.title}</h2>
      <p className="text-white/90 mb-4 max-w-2xl">{news.summary}</p>
      
      <button className="px-6 py-2 bg-white text-[#004B63] rounded-full font-semibold text-sm hover:bg-[#F8FAFC] transition-colors">
        Leer Más →
      </button>
    </div>
  </motion.div>
));

FeaturedNews.displayName = 'FeaturedNews';

// ==========================================
// News Filters
// ==========================================
const NewsFilters = memo(({ activeFilter, onFilterChange, newsItems }) => {
  const filters = [
    { key: 'todos', label: 'Todos', count: newsItems.length },
    { key: 'IA', label: '🤖 IA', count: newsItems.filter(n => n.category === 'IA').length },
    { key: 'STEAM', label: '🔬 STEAM', count: newsItems.filter(n => n.category === 'STEAM').length },
    { key: 'Tips', label: '⏰ Tips', count: newsItems.filter(n => n.category === 'Tips').length },
  ];
  
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <motion.button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            activeFilter === filter.key
              ? 'bg-[#4DA8C4] text-white shadow-md'
              : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC]'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {filter.label} ({filter.count})
        </motion.button>
      ))}
    </div>
  );
});

NewsFilters.displayName = 'NewsFilters';

// ==========================================
// Main News Tech Feed Component
// ==========================================
const NewsTechFeed = memo(() => {
  const { newsItems, readNews, markNewsAsRead } = useSmartBoardKids();
  const [activeFilter, setActiveFilter] = useState('todos');
  const [expandedNews, setExpandedNews] = useState(null);
  
  const filteredNews = useMemo(() => {
    if (activeFilter === 'todos') return newsItems;
    return newsItems.filter(news => news.category === activeFilter);
  }, [newsItems, activeFilter]);
  
  const featuredNews = newsItems[0]; // First news as featured
  
  const handleRead = useCallback((newsId) => {
    markNewsAsRead(newsId);
  }, [markNewsAsRead]);
  
  const unreadCount = useMemo(() => {
    return newsItems.filter(news => !readNews.includes(news.id)).length;
  }, [newsItems, readNews]);

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between bg-white rounded-2xl p-4 border border-[#E2E8F0]"
      >
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-2xl font-black text-[#4DA8C4]">{newsItems.length}</p>
            <p className="text-xs text-[#64748B]">Total</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-[#FFD166]">{unreadCount}</p>
            <p className="text-xs text-[#64748B]">Sin leer</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-[#66CCCC]">{readNews.length}</p>
            <p className="text-xs text-[#64748B]">Leídos</p>
          </div>
        </div>
        
        <button className="px-4 py-2 bg-[#4DA8C4]/10 text-[#4DA8C4] rounded-full text-sm font-semibold hover:bg-[#4DA8C4]/20 transition-colors">
          Ver Todo →
        </button>
      </motion.div>
      
      {/* Featured News */}
      {featuredNews && <FeaturedNews news={featuredNews} />}
      
      {/* Filters */}
      <NewsFilters 
        activeFilter={activeFilter} 
        onFilterChange={setActiveFilter} 
        newsItems={newsItems}
      />
      
      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNews.map((news, index) => (
          <motion.div
            key={news.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <NewsCard
              news={news}
              isRead={readNews.includes(news.id)}
              onRead={handleRead}
            />
          </motion.div>
        ))}
      </div>
      
      {filteredNews.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-4xl mb-3">📰</p>
          <p className="text-[#64748B]">No hay noticias en esta categoría</p>
        </motion.div>
      )}
    </div>
  );
});

NewsTechFeed.displayName = 'NewsTechFeed';

export default NewsTechFeed;
