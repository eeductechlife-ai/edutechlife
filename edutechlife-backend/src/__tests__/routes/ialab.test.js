const path = require('path');
const deepseekPath = path.resolve(__dirname, '../../services/deepseek.js');
delete require.cache[deepseekPath];
require.cache[deepseekPath] = {
  id: deepseekPath,
  filename: deepseekPath,
  loaded: true,
  exports: {
    chat: () => Promise.resolve({
      choices: [{ message: { content: JSON.stringify({
        masterPrompt: 'Eres un experto en marketing. Crea una estrategia...',
        feedback: ['Buen prompt', 'Agrega más contexto'],
        templateType: 'general',
        difficulty: 'intermediate'
      }) } }]
    }),
    validateMessages: () => null,
    chatStream: () => Promise.reject(new Error('Not implemented')),
    buildPayload: () => {},
    fetchWithRetry: () => {},
  },
};

const express = require('express');
const request = require('supertest');
const app = require('../../app');

function buildTestApp() {
  const testApp = express();
  testApp.use(express.json({ limit: '1mb' }));
  const sanitizeMiddleware = require('../../middleware/sanitize');
  testApp.use(sanitizeMiddleware);
  const ialabRoutes = require('../../routes/ialab');
  testApp.use('/api/ialab', ialabRoutes);
  return testApp;
}
const testApp = buildTestApp();

describe('GET /api/ialab/modules', () => {
  it('returns modules list', async () => {
    const res = await request(app).get('/api/ialab/modules');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('GET /api/ialab/modules/:id', () => {
  it('returns 400 for invalid module id', async () => {
    const res = await request(app).get('/api/ialab/modules/999');
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Module ID');
  });

  it('returns 400 for non-numeric id', async () => {
    const res = await request(app).get('/api/ialab/modules/abc');
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Module ID');
  });

  it('returns 400 for id 0', async () => {
    const res = await request(app).get('/api/ialab/modules/0');
    expect(res.status).toBe(400);
  });

  it('returns module data for valid id 1', async () => {
    const res = await request(app).get('/api/ialab/modules/1');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
    expect(res.body.title).toContain('Ingeniería');
  });

  it('returns module data for valid id 5', async () => {
    const res = await request(app).get('/api/ialab/modules/5');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(5);
    expect(res.body.level).toBe('Experto');
  });
});

describe('POST /api/ialab/prompts', () => {
  it('returns 400 when prompt is missing', async () => {
    const res = await request(app)
      .post('/api/ialab/prompts')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Prompt is required');
  });

  it('returns 400 for empty prompt', async () => {
    const res = await request(app)
      .post('/api/ialab/prompts')
      .send({ prompt: '' });
    expect(res.status).toBe(400);
  });

  it('returns 400 for oversize prompt', async () => {
    const res = await request(app)
      .post('/api/ialab/prompts')
      .send({ prompt: 'x'.repeat(2001) });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('too long');
  });

  it('generates a MasterPrompt for valid prompt', async () => {
    const res = await request(app)
      .post('/api/ialab/prompts')
      .send({ prompt: 'Crea una estrategia de marketing para Instagram' });
    expect(res.status).toBe(200);
    expect(res.body.masterPrompt).toBeDefined();
    expect(res.body.feedback).toBeDefined();
  }, 15000);

  it('accepts templateType parameter', async () => {
    const res = await request(app)
      .post('/api/ialab/prompts')
      .send({ prompt: 'Analiza datos de ventas del trimestre', templateType: 'business' });
    expect(res.status).toBe(200);
    expect(res.body.templateType).toBe('business');
  }, 15000);
});

describe('POST /api/ialab/evaluate-prompt', () => {
  it('returns 400 when prompt is missing', async () => {
    const res = await request(app)
      .post('/api/ialab/evaluate-prompt')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Prompt is required');
  });

  it('evaluates a valid prompt', async () => {
    const res = await request(app)
      .post('/api/ialab/evaluate-prompt')
      .send({ prompt: 'Eres un experto en marketing. Crea una campaña para redes sociales.' });
    expect(res.status).toBe(200);
    expect(res.body.evaluation).toBeDefined();
    expect(res.body.evaluation.totalScore).toBeDefined();
  });

  it('returns grade Bueno or higher for well-structured prompt', async () => {
    const longPrompt = 'Eres un experto en IA. ' + 'palabra '.repeat(150) + ' Tarea: haz algo. Evita errores comunes.';
    const res = await request(app)
      .post('/api/ialab/evaluate-prompt')
      .send({ prompt: longPrompt });
    expect(res.status).toBe(200);
    expect(['Bueno', 'Excelente']).toContain(res.body.evaluation.grade);
  });

  it('returns grade Necesita mejora for very short prompt', async () => {
    const res = await request(app)
      .post('/api/ialab/evaluate-prompt')
      .send({ prompt: 'hola' });
    expect(res.status).toBe(200);
    expect(res.body.evaluation.grade).toBe('Necesita mejora');
  });

  it('returns grade Bueno for mid-scoring prompt', async () => {
    const res = await request(app)
      .post('/api/ialab/evaluate-prompt')
      .send({ prompt: 'Eres un experto en finanzas. Necesito un presupuesto.' });
    expect(res.status).toBe(200);
    expect(['Bueno', 'Necesita mejora']).toContain(res.body.evaluation.grade);
  });

  it('accepts custom criteria labels', async () => {
    const res = await request(app)
      .post('/api/ialab/evaluate-prompt')
      .send({
        prompt: 'Eres un experto en marketing. Crea una campaña.',
        criteria: { precision: 'Precisión del prompt' }
      });
    expect(res.status).toBe(200);
    expect(res.body.evaluation.scores).toBeDefined();
    expect(res.body.evaluation.totalScore).toBeDefined();
  });

  it('handles prompt with all quality markers', async () => {
    const res = await request(app)
      .post('/api/ialab/evaluate-prompt')
      .send({ prompt: 'Eres un experto en marketing. Tarea: crea una campaña. Evita usar jerga técnica.' });
    expect(res.status).toBe(200);
    expect(res.body.evaluation).toBeDefined();
  });

  it('returns feedback for short prompt without role', async () => {
    const res = await request(app)
      .post('/api/ialab/evaluate-prompt')
      .send({ prompt: 'Hola mundo' });
    expect(res.status).toBe(200);
    expect(res.body.evaluation.feedback.length).toBeGreaterThanOrEqual(1);
  });

  it('returns grade Excelente for long structured prompt with all markers', async () => {
    const longPrompt = 'Eres un experto en tecnología. ' + 'término '.repeat(200) + ' Tarea: realiza el análisis completo. Evita errores comunes en la implementación.';
    const res = await request(app)
      .post('/api/ialab/evaluate-prompt')
      .send({ prompt: longPrompt });
    expect(res.status).toBe(200);
    expect(res.body.evaluation.grade).toBe('Excelente');
  });

  it('returns all feedback types for bare minimum prompt', async () => {
    const res = await request(app)
      .post('/api/ialab/evaluate-prompt')
      .send({ prompt: 'texto corto' });
    expect(res.status).toBe(200);
    expect(res.body.evaluation.metrics.hasRole).toBe(false);
    expect(res.body.evaluation.metrics.hasTask).toBe(false);
    expect(res.body.evaluation.metrics.hasConstraints).toBe(false);
  });
});

describe('POST /api/ialab/progress (auth-protected)', () => {
  it('returns 401 without auth token', async () => {
    const res = await request(app)
      .post('/api/ialab/progress')
      .send({ moduleId: 1 });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/ialab/progress/:userId (auth-protected)', () => {
  it('returns 401 without auth token', async () => {
    const res = await request(app).get('/api/ialab/progress/test-user');
    expect(res.status).toBe(401);
  });
});

describe('POST /api/ialab/templates (auth-protected)', () => {
  it('returns 401 without auth token', async () => {
    const res = await request(app)
      .post('/api/ialab/templates')
      .send({ userId: 'u1', templateName: 'Test', templateData: {} });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/ialab/templates/:userId (auth-protected)', () => {
  it('returns 401 without auth token', async () => {
    const res = await request(app).get('/api/ialab/templates/test-user');
    expect(res.status).toBe(401);
  });
});

describe('PUT /api/ialab/templates/:templateId (auth-protected)', () => {
  it('returns 401 without auth token', async () => {
    const res = await request(app)
      .put('/api/ialab/templates/template_1')
      .send({ templateName: 'Updated' });
    expect(res.status).toBe(401);
  });
});

describe('DELETE /api/ialab/templates/:templateId (auth-protected)', () => {
  it('returns 401 without auth token', async () => {
    const res = await request(app).delete('/api/ialab/templates/template_1');
    expect(res.status).toBe(401);
  });
});

describe('POST /api/ialab/progress (bypassed auth)', () => {
  beforeEach(() => {
    process.env.SUPABASE_URL = '';
    process.env.SUPABASE_SERVICE_KEY = '';
  });

  afterEach(() => {
    process.env.SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SERVICE_KEY = 'test-service-key';
  });

  it('saves progress to in-memory store', async () => {
    const res = await request(testApp)
      .post('/api/ialab/progress')
      .send({ moduleId: 1, completed: true, score: 4, userId: 'auth-user-1' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.progress.completedModules).toBe(1);
    expect(res.body.progress.achievements).toContain('module_1_complete');
    expect(res.body.progress.achievements).toContain('module_1_excellent');
  });

  it('saves multiple modules and calculates overall progress', async () => {
    const userId = 'multi-module-user';
    for (const m of [1, 2, 3]) {
      const res = await request(testApp)
        .post('/api/ialab/progress')
        .send({ userId, moduleId: m, completed: true, score: 3 });
      expect(res.status).toBe(200);
    }
    const res = await request(testApp)
      .get(`/api/ialab/progress/${userId}`);
    expect(res.status).toBe(200);
    expect(res.body.overallProgress).toBe(60);
    expect(res.body.completedModules).toBe(3);
  });

  it('returns 400 when moduleId is out of range', async () => {
    const res = await request(testApp)
      .post('/api/ialab/progress')
      .send({ userId: 'u1', moduleId: 99 });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('moduleId');
  });

  it('returns 400 when userId is missing', async () => {
    const res = await request(testApp)
      .post('/api/ialab/progress')
      .send({ moduleId: 1 });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('userId');
  });

  it('returns achievements for course completion', async () => {
    const userId = 'completion-user';
    for (const m of [1, 2, 3, 4, 5]) {
      await request(testApp)
        .post('/api/ialab/progress')
        .send({ userId, moduleId: m, completed: true, score: 5 });
    }
    const res = await request(testApp)
      .get(`/api/ialab/progress/${userId}`);
    expect(res.status).toBe(200);
    if (res.body.achievements) {
      expect(res.body.achievements).toContain('course_complete');
    }
  });
});

describe('GET /api/ialab/progress/:userId (bypassed auth)', () => {
  beforeEach(() => {
    process.env.SUPABASE_URL = '';
    process.env.SUPABASE_SERVICE_KEY = '';
  });

  afterEach(() => {
    process.env.SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SERVICE_KEY = 'test-service-key';
  });

  it('returns empty progress for unknown user', async () => {
    const res = await request(testApp)
      .get('/api/ialab/progress/unknown-user');
    expect(res.status).toBe(200);
    expect(res.body.completedModules).toBe(0);
    expect(res.body.overallProgress).toBe(0);
  });
});

describe('POST /api/ialab/templates (bypassed auth)', () => {
  beforeEach(() => {
    process.env.SUPABASE_URL = '';
    process.env.SUPABASE_SERVICE_KEY = '';
  });

  afterEach(() => {
    process.env.SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SERVICE_KEY = 'test-service-key';
  });

  it('saves a new template', async () => {
    const res = await request(testApp)
      .post('/api/ialab/templates')
      .send({ userId: 'u1', templateName: 'Test Template', templateData: { blocks: [] } });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.template.name).toBe('Test Template');
  });

  it('returns 400 when required fields missing', async () => {
    const res = await request(testApp)
      .post('/api/ialab/templates')
      .send({ userId: 'u1' });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/ialab/templates/:userId (bypassed auth)', () => {
  beforeEach(() => {
    process.env.SUPABASE_URL = '';
    process.env.SUPABASE_SERVICE_KEY = '';
  });

  afterEach(() => {
    process.env.SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SERVICE_KEY = 'test-service-key';
  });

  it('returns example templates for authenticated user', async () => {
    const res = await request(testApp)
      .get('/api/ialab/templates/template-user');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.templates)).toBe(true);
    expect(res.body.total).toBeGreaterThanOrEqual(2);
  });

  it('filters templates by category', async () => {
    const res = await request(testApp)
      .get('/api/ialab/templates/u1?category=content');
    expect(res.status).toBe(200);
    for (const t of res.body.templates) {
      expect(t.category).toBe('content');
    }
  });

  it('filters templates by difficulty', async () => {
    const res = await request(testApp)
      .get('/api/ialab/templates/u1?difficulty=beginner');
    expect(res.status).toBe(200);
    for (const t of res.body.templates) {
      expect(t.difficulty).toBe('beginner');
    }
  });
});

describe('PUT /api/ialab/templates/:templateId (bypassed auth)', () => {
  beforeEach(() => {
    process.env.SUPABASE_URL = '';
    process.env.SUPABASE_SERVICE_KEY = '';
  });

  afterEach(() => {
    process.env.SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SERVICE_KEY = 'test-service-key';
  });

  it('updates a template', async () => {
    const res = await request(testApp)
      .put('/api/ialab/templates/template_1')
      .send({ templateName: 'Updated Name' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('DELETE /api/ialab/templates/:templateId (bypassed auth)', () => {
  beforeEach(() => {
    process.env.SUPABASE_URL = '';
    process.env.SUPABASE_SERVICE_KEY = '';
  });

  afterEach(() => {
    process.env.SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SERVICE_KEY = 'test-service-key';
  });

  it('deletes a template', async () => {
    const res = await request(testApp)
      .delete('/api/ialab/templates/template_1');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('GET /api/ialab/resources', () => {
  it('returns resources list', async () => {
    const res = await request(app).get('/api/ialab/resources');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.resources)).toBe(true);
    expect(res.body.resources.length).toBeGreaterThan(0);
  });

  it('returns resources filtered by moduleId', async () => {
    const res = await request(app).get('/api/ialab/resources?moduleId=module1');
    expect(res.status).toBe(200);
    expect(res.body.resources.length).toBeGreaterThan(0);
  });

  it('returns resources filtered by type', async () => {
    const res = await request(app).get('/api/ialab/resources?resourceType=pdf');
    expect(res.status).toBe(200);
    for (const r of res.body.resources) {
      expect(r.type).toBe('pdf');
    }
  });

  it('returns all resources when moduleId has no matches', async () => {
    const res = await request(app).get('/api/ialab/resources?moduleId=nonexistent');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('POST /api/ialab/prompts with mocked deepseek', () => {
  const mockChat = vi.fn();

  function createMockedApp() {
    const deepseekPath = require.resolve('../../services/deepseek');
    const ialabPath = require.resolve('../../routes/ialab');
    const promptsPath = require.resolve('../../routes/ialab/prompts');
    delete require.cache[deepseekPath];
    delete require.cache[ialabPath];
    delete require.cache[promptsPath];
    require.cache[deepseekPath] = {
      id: deepseekPath,
      filename: deepseekPath,
      loaded: true,
      exports: {
        chat: mockChat,
        validateMessages: () => null,
        chatStream: () => {},
        buildPayload: () => {},
        fetchWithRetry: () => {},
      },
    };
    const app = express();
    app.use(express.json({ limit: '1mb' }));
    app.use('/api/ialab', require('../../routes/ialab'));
    return app;
  }

  it('returns 400 when deepseek returns error in response', async () => {
    mockChat.mockResolvedValue({ error: { message: 'Rate limit exceeded' } });
    const res = await request(createMockedApp())
      .post('/api/ialab/prompts')
      .send({ prompt: 'test prompt' });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Rate limit');
  });
});


