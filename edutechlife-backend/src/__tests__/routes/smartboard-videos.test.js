const express = require('express');
const request = require('supertest');

const authPath = require.resolve('../../middleware/auth');
delete require.cache[authPath];
require.cache[authPath] = {
  id: authPath,
  filename: authPath,
  loaded: true,
  exports: {
    requireAuth: (req, _res, next) => {
      req.userId = 'test-user-id';
      next();
    },
  },
};

const { rankVideos, isoDurationToSeconds, _cache } = require('../../services/youtubeVideos');

function buildApp() {
  const routePath = require.resolve('../../routes/smartboard/videos');
  delete require.cache[routePath];
  const app = express();
  app.use('/api/ingenia', require('../../routes/smartboard/videos'));
  return app;
}

const video = (id, views, likes, duration = 'PT5M') => ({
  id,
  snippet: { title: `Video ${id}`, channelTitle: 'Canal', thumbnails: { medium: { url: `https://i.ytimg.com/${id}.jpg` } } },
  statistics: { viewCount: String(views), likeCount: String(likes) },
  contentDetails: { duration },
});

describe('youtubeVideos.rankVideos', () => {
  it('prefers well-liked videos over merely popular ones', () => {
    const ranked = rankVideos([
      video('popular-sin-likes', 2_000_000, 1_000),
      video('querido', 800_000, 60_000),
    ]);
    expect(ranked[0].id).toBe('querido');
  });

  it('drops shorts and very long videos', () => {
    const ranked = rankVideos([
      video('short', 5_000_000, 200_000, 'PT40S'),
      video('clase-larga', 5_000_000, 200_000, 'PT1H10M'),
      video('ok', 10_000, 500, 'PT8M30S'),
    ]);
    expect(ranked.map((v) => v.id)).toEqual(['ok']);
  });

  it('parses ISO-8601 durations', () => {
    expect(isoDurationToSeconds('PT1H2M3S')).toBe(3723);
    expect(isoDurationToSeconds('PT7M')).toBe(420);
    expect(isoDurationToSeconds('bad')).toBe(0);
  });
});

describe('GET /api/ingenia/videos', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    delete process.env.YOUTUBE_API_KEY;
    global.fetch = originalFetch;
    _cache.clear();
  });

  it('returns 501 when the YouTube key is not configured', async () => {
    const res = await request(buildApp()).get('/api/ingenia/videos?q=fracciones');
    expect(res.status).toBe(501);
  });

  it('rejects empty queries', async () => {
    process.env.YOUTUBE_API_KEY = 'k';
    const res = await request(buildApp()).get('/api/ingenia/videos?q=a');
    expect(res.status).toBe(400);
  });

  it('searches with safe search and returns ranked videos, cached per query', async () => {
    process.env.YOUTUBE_API_KEY = 'k';
    global.fetch = vi.fn(async (url) => {
      const u = String(url);
      if (u.includes('/search?')) {
        expect(u).toContain('safeSearch=strict');
        expect(u).toContain('order=viewCount');
        return { ok: true, json: async () => ({ items: [{ id: { videoId: 'a' } }, { id: { videoId: 'b' } }] }) };
      }
      return { ok: true, json: async () => ({ items: [video('a', 1000, 10), video('b', 90_000, 4_000)] }) };
    });

    const app = buildApp();
    const res = await request(app).get('/api/ingenia/videos?q=fracciones para niños');
    expect(res.status).toBe(200);
    expect(res.body.videos.map((v) => v.id)).toEqual(['b', 'a']);

    await request(app).get('/api/ingenia/videos?q=Fracciones para niños');
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
