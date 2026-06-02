import { useState, useMemo } from 'react';

export function useForumFilters(posts) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeTag, setActiveTag] = useState(null);

  const filteredPosts = useMemo(() => {
    let result = [...posts];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.title?.toLowerCase().includes(q) ||
        p.content?.toLowerCase().includes(q)
      );
    }
    if (activeFilter === 'popular') {
      result.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    }
    if (activeTag) {
      result = result.filter(p => p.tags?.includes(activeTag));
    }
    return result;
  }, [posts, searchQuery, activeFilter, activeTag]);

  return { filteredPosts, searchQuery, setSearchQuery, activeFilter, setActiveFilter, activeTag, setActiveTag };
}
