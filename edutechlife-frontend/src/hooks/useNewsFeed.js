import { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchNews } from '../services/newsApi';
import { useSmartBoardKids } from '../context/SmartBoardKidsContext';

export function useNewsFeed() {
  const { readNews, markNewsAsRead } = useSmartBoardKids();
  const [allArticles, setAllArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFallback, setIsFallback] = useState(false);
  const [activeCategory, setActiveCategory] = useState('did-you-know');
  const [openArticle, setOpenArticle] = useState(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { articles, source } = await fetchNews();
        if (mounted) {
          setAllArticles(articles);
          setIsFallback(source === 'fallback' && !!import.meta.env.VITE_NEWS_API_URL);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
          setAllArticles([]);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  const filteredArticles = useMemo(() => {
    return allArticles.filter(a => a.category === activeCategory);
  }, [allArticles, activeCategory]);

  const handleMarkAsRead = useCallback((id) => {
    if (!readNews.includes(id)) {
      markNewsAsRead(id);
    }
  }, [readNews, markNewsAsRead]);

  const unreadCount = useMemo(() => {
    return allArticles.filter(a => !readNews.includes(a.id)).length;
  }, [allArticles, readNews]);

  return {
    allArticles,
    articles: filteredArticles,
    activeCategory,
    setCategory: setActiveCategory,
    isLoading,
    error,
    isFallback,
    readNews,
    unreadCount,
    markAsRead: handleMarkAsRead,
    openArticle,
    setOpenArticle,
  };
}
