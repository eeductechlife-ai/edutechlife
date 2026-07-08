import { fallbackNews } from '../data/newsData';

const API_URL = import.meta.env.VITE_NEWS_API_URL || null;

const FETCH_TIMEOUT = 5000;

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchNews() {
  if (!API_URL) {
    console.log('[NewsFeed] No API URL configured, using fallback data');
    return { articles: fallbackNews, source: 'fallback' };
  }

  try {
    const data = await fetchWithTimeout(API_URL, FETCH_TIMEOUT);
    if (!data || !Array.isArray(data.articles)) {
      throw new Error('Invalid API response format');
    }
    return { articles: data.articles, source: 'api' };
  } catch (err) {
    console.warn('[NewsFeed] API fetch failed, using fallback:', err.message);
    return { articles: fallbackNews, source: 'fallback' };
  }
}
