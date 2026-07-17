const path = require('path');
const deepseekPath = path.resolve(__dirname, '../../services/deepseek.js');
delete require.cache[deepseekPath];
require.cache[deepseekPath] = {
  id: deepseekPath,
  filename: deepseekPath,
  loaded: true,
  exports: {
    chat: () => Promise.resolve({
      choices: [{ message: { content: 'Hola, ¿cómo estás?' } }]
    }),
    validateMessages: (msgs) => {
      if (!msgs || !Array.isArray(msgs) || msgs.length === 0) return 'Messages array is required and must be non-empty';
      for (const msg of msgs) {
        if (!msg.role || typeof msg.content !== 'string') return 'Each message must have role and content (string)';
        if (msg.content.trim() === '') return 'Messages should not be empty';
      }
      return null;
    },
    chatStream: () => Promise.resolve({
      body: {
        [Symbol.asyncIterator]() {
          const chunks = [
            new TextEncoder().encode('data: {"choices":[{"delta":{"content":"Hello"}}]}\n\n'),
            new TextEncoder().encode('data: [DONE]\n\n'),
          ];
          let i = 0;
          return {
            next: () => {
              if (i < chunks.length) {
                return Promise.resolve({ value: chunks[i++], done: false });
              }
              return Promise.resolve({ value: undefined, done: true });
            },
          };
        },
      },
    }),
    buildPayload: () => {},
    fetchWithRetry: () => {},
  },
};

const request = require('supertest');
const app = require('../../app');

describe('POST /api/chat', () => {
  it('returns 400 when messages are missing', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('returns 400 when messages is empty', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ messages: [] });
    expect(res.status).toBe(400);
  });

  it('returns 400 when messages has no content', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ messages: [{ role: 'user' }] });
    expect(res.status).toBe(400);
  });

  it('validates empty content passes validation but returns 500 from API', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ messages: [{ role: 'user', content: '' }] });
    expect([400, 500]).toContain(res.status);
  });

  it('uses prompt shorthand and gets response', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ prompt: 'Hello', systemPrompt: 'You are a helpful assistant.' });
    expect(res.status).toBe(200);
    expect(res.body.result).toBeDefined();
  }, 15000);

  it('returns response for valid messages', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ messages: [{ role: 'user', content: 'Say hello in Spanish' }] });
    expect(res.status).toBe(200);
    expect(res.body.result).toBeDefined();
  }, 15000);
});

describe('POST /api/chat/stream', () => {
  it('returns 400 when messages are missing', async () => {
    const res = await request(app)
      .post('/api/chat/stream')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('returns 400 when messages is empty', async () => {
    const res = await request(app)
      .post('/api/chat/stream')
      .send({ messages: [] });
    expect(res.status).toBe(400);
  });

  it('returns 400 when messages has no content', async () => {
    const res = await request(app)
      .post('/api/chat/stream')
      .send({ messages: [{ role: 'user' }] });
    expect(res.status).toBe(400);
  });

  it('accepts prompt without messages and streams response', async () => {
    const res = await request(app)
      .post('/api/chat/stream')
      .send({ prompt: 'Hello', systemPrompt: 'You are a helpful assistant.' });
    expect(res.status).toBe(200);
  }, 15000);
});
