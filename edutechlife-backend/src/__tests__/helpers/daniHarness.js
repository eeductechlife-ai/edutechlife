/**
 * Arnés de los tests de Dani (rutas /api/ingenia/dani/chat y /chat/stream).
 *
 * Sustituye por dobles controlados la autenticación, el consentimiento, Supabase,
 * el orquestador (contexto del estudiante) y DeepSeek, para observar exactamente
 * qué texto saldría hacia el modelo y qué recibe el niño.
 *
 * Debe requerirse ANTES de cualquier require de rutas: registra los dobles en
 * require.cache y luego monta el router de IngenIA.
 */
const express = require('express');

const AUTH = require.resolve('../../middleware/auth');
const CONSENT = require.resolve('../../middleware/parentalConsent');
const SUPA = require.resolve('../../db/supabase');
const DEEPSEEK = require.resolve('../../services/deepseek');
const ORCH = require.resolve('../../services/daniOrchestrator');

const CTX_BASE = {
  profile: {
    grade_level: '6-7',
    age: 11,
    name: 'Sol',
    school: 'Colegio San José',
    vak_style: 'visual',
    country_code: 'CO',
  },
  mastery: [{ competency_id: 'co_matematicas_6-7_0', mastery_level: 0.3, updated_at: '2026-08-20T10:00:00Z' }],
  memory: {
    communicationStyle: 'playful',
    interests: ['astronomía'],
    strengths: [],
    weaknesses: ['fracciones'],
    frequentErrors: [],
    pendingTopics: ['fracciones'],
    lastMood: 'neutral',
  },
  activePlan: {
    type: 'daily',
    plan_json: { activities: [{ subject: 'matematicas', label: 'Ejercicios de fracciones' }] },
    generated_at: '2026-08-28T00:00:00Z',
  },
  todaySchedule: [
    { subject: 'matematicas', subject_label: 'Matemáticas', start_time: '07:00:00', end_time: '08:00:00', teacher: 'Sra. López' },
  ],
};

const h = {
  /** Llamadas recibidas por DeepSeek: { fn, messages, temperature, maxTokens }. */
  llamadas: [],
  /** Filas insertadas en conversations / upsertadas en dani_memory. */
  inserts: [],
  upserts: [],
  /** Fila que devuelven maybeSingle()/single() por tabla (sin envolver). */
  tablas: {},
  /** Contexto que devuelve loadStudentContext. */
  ctx: JSON.parse(JSON.stringify(CTX_BASE)),
  /** Fragmentos que responde DeepSeek; recibe los mensajes enviados. */
  respuesta: () => ['¡Hola, Sol! ', '¿Listo para las fracciones?'],
  reset() {
    h.llamadas.length = 0;
    h.inserts.length = 0;
    h.upserts.length = 0;
    h.tablas = {
      students: { id: 'student-1', auth_id: 'test-user-id', name: 'Sol' },
    };
    h.ctx = JSON.parse(JSON.stringify(CTX_BASE));
    h.respuesta = () => ['¡Hola, Sol! ', '¿Listo para las fracciones?'];
  },
};

function builder(tabla) {
  const resultado = { data: h.tablas[tabla] ?? null, error: null };
  const b = {
    select: () => b,
    eq: () => b,
    order: () => b,
    limit: () => b,
    maybeSingle: async () => resultado,
    single: async () => resultado,
    insert(row) {
      h.inserts.push({ tabla, row });
      return Promise.resolve({ error: null });
    },
    upsert(row) {
      h.upserts.push({ tabla, row });
      return Promise.resolve({ error: null });
    },
    then: (ok, ko) => Promise.resolve(resultado).then(ok, ko),
  };
  return b;
}

require.cache[AUTH] = {
  id: AUTH, filename: AUTH, loaded: true,
  exports: {
    requireAuth: (req, _res, next) => {
      req.userId = req.headers['x-test-user-id'] || 'test-user-id';
      next();
    },
  },
};

require.cache[CONSENT] = {
  id: CONSENT, filename: CONSENT, loaded: true,
  exports: { requireVerifiedParentalConsent: (_req, _res, next) => next() },
};

require.cache[SUPA] = {
  id: SUPA, filename: SUPA, loaded: true,
  exports: { from: (tabla) => builder(tabla) },
};

require.cache[DEEPSEEK] = {
  id: DEEPSEEK, filename: DEEPSEEK, loaded: true,
  exports: {
    chat: async (_key, body) => {
      h.llamadas.push({ fn: 'chat', messages: body.messages, temperature: body.temperature, maxTokens: body.maxTokens });
      return { choices: [{ message: { content: h.respuesta(body.messages).join('') } }] };
    },
    chatStream: async (_key, body, onChunk) => {
      h.llamadas.push({ fn: 'chatStream', messages: body.messages, temperature: body.temperature, maxTokens: body.maxTokens });
      for (const trozo of h.respuesta(body.messages)) onChunk(trozo);
    },
    validateMessages: (m) =>
      Array.isArray(m) && m.length > 0 ? null : 'Messages array is required and must be non-empty',
    DEFAULT_MODEL: () => 'deepseek-flash',
  },
};

// El orquestador real arma el prompt; solo se sustituye la lectura de la base.
const orquestadorReal = require(ORCH);
require.cache[ORCH] = {
  id: ORCH, filename: ORCH, loaded: true,
  exports: {
    ...orquestadorReal,
    loadStudentContext: async () => JSON.parse(JSON.stringify(h.ctx)),
  },
};

function crearApp() {
  const app = express();
  app.use(express.json({ limit: '8mb' }));
  app.use('/api/ingenia', require('../../routes/ingenia'));
  return app;
}

/** Extrae los eventos SSE de una respuesta de texto. */
function eventosSSE(texto) {
  return texto
    .split('\n')
    .filter((l) => l.startsWith('data: '))
    .map((l) => l.slice(6))
    .filter((d) => d !== '[DONE]')
    .map((d) => JSON.parse(d));
}

module.exports = { h, crearApp, eventosSSE, CTX_BASE };
