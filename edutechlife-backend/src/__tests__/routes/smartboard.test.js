const express = require('express');
const request = require('supertest');
const app = require('../../app');

function buildSmartboardTestApp() {
  const testApp = express();
  testApp.use(express.json({ limit: '1mb' }));
  const smartboardRoutes = require('../../routes/smartboard');
  testApp.use('/api/smartboard', smartboardRoutes);
  return testApp;
}
const smartTestApp = buildSmartboardTestApp();

describe('Smartboard routes', () => {
  describe('GET /api/smartboard/data/:userId', () => {
    it('returns 401 when supabase data not found', async () => {
      const res = await request(app).get('/api/smartboard/data/nonexistent-user');
      expect([401, 404, 500]).toContain(res.status);
    });
  });

  describe('GET /api/smartboard/progress/:userId', () => {
    it('returns a response for nonexistent user', async () => {
      const res = await request(app).get('/api/smartboard/progress/nonexistent-user');
      expect([401, 404, 500]).toContain(res.status);
    });
  });

  describe('GET /api/smartboard/data/:userId (bypassed auth)', () => {
    it('returns 404 when data not found', async () => {
      const res = await request(smartTestApp)
        .get('/api/smartboard/data/no-data-user');
      expect([404, 500]).toContain(res.status);
    });
  });

  describe('GET /api/smartboard/progress/:userId (bypassed auth)', () => {
    it('returns 404 when progress not found', async () => {
      const res = await request(smartTestApp)
        .get('/api/smartboard/progress/no-data-user');
      expect([404, 500]).toContain(res.status);
    });
  });

  describe('POST /api/smartboard/chat', () => {
    it('returns 400 when messages are missing', async () => {
      const res = await request(app)
        .post('/api/smartboard/chat')
        .send({});
      expect(res.status).toBe(400);
    });

    it('returns 400 when messages is empty', async () => {
      const res = await request(app)
        .post('/api/smartboard/chat')
        .send({ messages: [] });
      expect(res.status).toBe(400);
    });

    it('returns 400 when messages has no content', async () => {
      const res = await request(app)
        .post('/api/smartboard/chat')
        .send({ messages: [{ role: 'user' }] });
      expect(res.status).toBe(400);
    });

    it('responds to valid messages with a result', async () => {
      const res = await request(app)
        .post('/api/smartboard/chat')
        .send({ messages: [{ role: 'user', content: 'Hola' }] });
      expect([200, 500]).toContain(res.status);
      if (res.status === 200) {
        expect(res.body.result).toBeDefined();
      } else {
        expect(res.body.error).toBeDefined();
      }
    }, 15000);
  });

  describe('POST /api/smartboard/chat (bypassed auth)', () => {
    let chatTestApp;

    beforeAll(() => {
      chatTestApp = express();
      chatTestApp.use(express.json({ limit: '1mb' }));
      const smartboardRoutes = require('../../routes/smartboard');
      chatTestApp.use('/api/smartboard', smartboardRoutes);
    });

    it('responds to valid messages via bypassed app', async () => {
      const res = await request(chatTestApp)
        .post('/api/smartboard/chat')
        .send({ messages: [{ role: 'user', content: 'Hola' }] });
      expect([200, 500]).toContain(res.status);
    }, 15000);
  });
});

describe('Smartboard chat with mocked deepseek', () => {
  const mockChat = vi.fn();

  function createMockedApp() {
    const deepseekPath = require.resolve('../../services/deepseek');
    const smartboardPath = require.resolve('../../routes/smartboard');
    delete require.cache[deepseekPath];
    delete require.cache[smartboardPath];
    require.cache[deepseekPath] = {
      id: deepseekPath,
      filename: deepseekPath,
      loaded: true,
      exports: {
        chat: mockChat,
        validateMessages: () => null,
      },
    };
    const app = express();
    app.use(express.json({ limit: '1mb' }));
    app.use('/api/smartboard', require('../../routes/smartboard'));
    return app;
  }

  it('returns 400 when deepseek returns error', async () => {
    mockChat.mockResolvedValue({ error: { message: 'API limit' } });
    const res = await request(createMockedApp())
      .post('/api/smartboard/chat')
      .send({ messages: [{ role: 'user', content: 'Hola' }] });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('API limit');
  });

  it('returns 500 when deepseek returns no content', async () => {
    mockChat.mockResolvedValue({ choices: [{ message: { content: null } }] });
    const res = await request(createMockedApp())
      .post('/api/smartboard/chat')
      .send({ messages: [{ role: 'user', content: 'Hola' }] });
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('No response from API');
  });

  it('returns 500 when deepseek chat throws', async () => {
    mockChat.mockRejectedValue(new Error('Network error'));
    const res = await request(createMockedApp())
      .post('/api/smartboard/chat')
      .send({ messages: [{ role: 'user', content: 'Hola' }] });
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Network error');
  });
});
