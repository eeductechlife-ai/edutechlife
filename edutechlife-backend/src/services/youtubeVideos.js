/**
 * Recommends educational YouTube videos for students (8–16): strict safe
 * search, Spanish, Colombia region, ranked by views and viewer approval.
 * Results are cached 24 h — each search costs 100 units of a 10k/day quota.
 */
const API = 'https://www.googleapis.com/youtube/v3';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const MAX_CACHE = 500;
const MIN_SECONDS = 60;
const MAX_SECONDS = 25 * 60;

const cache = new Map();

function isoDurationToSeconds(iso) {
  const m = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso || '');
  if (!m) return 0;
  return (Number(m[1]) || 0) * 3600 + (Number(m[2]) || 0) * 60 + (Number(m[3]) || 0);
}

// Popularity (log views) weighted by approval (likes per view). A video with
// many views but few likes ranks below a well-liked one with fewer views.
function score(views, likes) {
  if (!views) return 0;
  const likeRate = Math.min(likes / views, 0.1);
  return Math.log10(views + 1) * (1 + likeRate * 20);
}

function rankVideos(items, limit = 3) {
  return items
    .map((v) => {
      const views = Number(v.statistics?.viewCount) || 0;
      const likes = Number(v.statistics?.likeCount) || 0;
      const seconds = isoDurationToSeconds(v.contentDetails?.duration);
      return {
        id: v.id,
        title: v.snippet?.title || '',
        channel: v.snippet?.channelTitle || '',
        thumbnail:
          v.snippet?.thumbnails?.medium?.url || v.snippet?.thumbnails?.default?.url || '',
        views,
        likes,
        seconds,
        score: score(views, likes),
      };
    })
    .filter((v) => v.seconds >= MIN_SECONDS && v.seconds <= MAX_SECONDS && v.views > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const err = new Error(`YouTube API ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

async function recommendVideos(query, apiKey, { limit = 3 } = {}) {
  const key = query.trim().toLowerCase();
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.videos;

  const search = new URLSearchParams({
    part: 'snippet',
    q: query,
    type: 'video',
    maxResults: '15',
    order: 'viewCount',
    safeSearch: 'strict',
    relevanceLanguage: 'es',
    regionCode: 'CO',
    videoEmbeddable: 'true',
    key: apiKey,
  });
  const found = await getJson(`${API}/search?${search}`);
  const ids = (found.items || []).map((i) => i.id?.videoId).filter(Boolean);
  if (!ids.length) return [];

  const details = new URLSearchParams({
    part: 'snippet,statistics,contentDetails',
    id: ids.join(','),
    key: apiKey,
  });
  const info = await getJson(`${API}/videos?${details}`);
  const videos = rankVideos(info.items || [], limit);

  if (cache.size >= MAX_CACHE) cache.delete(cache.keys().next().value);
  cache.set(key, { at: Date.now(), videos });
  return videos;
}

module.exports = { recommendVideos, rankVideos, isoDurationToSeconds, score, _cache: cache };
