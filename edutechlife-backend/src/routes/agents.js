const { Router } = require('express');
const { nicoStreamLimiter, automationPlanLimiter } = require('../middleware/rateLimiter');
const { chat, chatStream } = require('../services/deepseek');
const { buildAutomationMessages, ensurePlanAviso } = require('../agents/automation');
const { buildNicoMessages, sanitizeNicoHistory } = require('../agents/nico');
const { isValidSubjectKey, loadMemory, saveMemory, deleteMemory, formatMemoryBlock } = require('../agents/memory');
const { requireAuth } = require('../middleware/auth');
const { chatMessageLimiter } = require('../middleware/rateLimiter');
const { refreshSummary } = require('../agents/summarize');

const router = Router();
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
// Cada cuántos turnos del visitante se regenera el resumen (una llamada extra al modelo).
const SUMMARY_EVERY_TURNS = 6;
const NICO_MEMORY_ON = process.env.NICO_MEMORY !== 'off';

/**
 * Guarda el turno y, cada SUMMARY_EVERY_TURNS, regenera el resumen. Corre después
 * de responder al visitante; si falla, solo queda sin actualizar.
 */
async function persistNicoTurn({ visitorId, previous, history }) {
  const turns = previous.turns + 1;
  let summary = previous.summary;
  if (turns % SUMMARY_EVERY_TURNS === 0) {
    summary = await refreshSummary({
      apiKey: DEEPSEEK_API_KEY,
      previous: previous.summary,
      turns: history.slice(-SUMMARY_EVERY_TURNS),
    });
  }
  await saveMemory('nico', visitorId, { summary, turns });
}

/**
 * POST /api/agents/nico/stream
 * Body: { messages: [{ role: 'user'|'assistant', content }], visitorId? }
 * Público (visitantes sin cuenta), con límite por IP. Responde en SSE igual que /api/chat/stream.
 * visitorId es un identificador aleatorio del navegador; sin él no hay memoria.
 */
router.post('/nico/stream', nicoStreamLimiter, async (req, res) => {
  const visitorId = req.body?.visitorId;
  const memoryOn = NICO_MEMORY_ON && isValidSubjectKey(visitorId);
  const previous = memoryOn ? await loadMemory('nico', visitorId) : { summary: '', turns: 0 };

  const msgs = buildNicoMessages(req.body?.messages, { memoryBlock: formatMemoryBlock(previous.summary) });
  if (!msgs) return res.status(400).json({ error: 'Escribe un mensaje para empezar.' });
  if (!DEEPSEEK_API_KEY) return res.status(500).json({ error: 'API key not configured on server' });

  let streamClosed = false;
  req.on('close', () => {
    streamClosed = true;
    res.end();
  });

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    await chatStream(DEEPSEEK_API_KEY, { messages: msgs, temperature: 0.65, maxTokens: 500 }, (chunk) => {
      if (streamClosed) return;
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    });
    if (streamClosed) return;
    res.write('data: [DONE]\n\n');
    res.end();
    if (memoryOn) {
      const history = msgs.filter((m) => m.role !== 'system');
      persistNicoTurn({ visitorId, previous, history }).catch((e) =>
        console.warn('[agentMemory] no se pudo actualizar la memoria de Nico:', e.message),
      );
    }
  } catch (e) {
    if (streamClosed) return;
    console.error('Error in Nico stream:', e);
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: 'Error generando respuesta' })}\n\n`);
      res.end();
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
});

/**
 * POST /api/agents/automation/plan
 * Body: { formData: {empresa, industria, empleados, procesos, objetivos, presupuesto, tiempo}, selectedArchitecture?: {nombre} }
 * Público, con límite por IP. Responde { plan } ya con el aviso de borrador.
 */
router.post('/automation/plan', automationPlanLimiter, async (req, res) => {
  const { formData, selectedArchitecture } = req.body || {};
  if (!formData || typeof formData !== 'object' || !String(formData.empresa || '').trim()) {
    return res.status(400).json({ error: 'Falta el nombre de la empresa.' });
  }
  if (!DEEPSEEK_API_KEY) return res.status(500).json({ error: 'API key not configured on server' });
  try {
    const { messages, options } = buildAutomationMessages(formData, selectedArchitecture);
    const result = await chat(DEEPSEEK_API_KEY, { messages, ...options });
    const text = result?.choices?.[0]?.message?.content || '';
    return res.json({ plan: ensurePlanAviso(text) });
  } catch (e) {
    console.error('Error generando plan de automatización:', e);
    return res.status(500).json({ error: 'No pudimos generar el plan. Intenta de nuevo.' });
  }
});

/**
 * Memoria de Max: por usuario autenticado. El resumen se regenera cada 6 turnos.
 */
router.get('/max/memory', requireAuth, async (req, res) => {
  const { summary } = await loadMemory('max', req.userId);
  res.json({ summary });
});

router.post('/max/memory/turns', requireAuth, chatMessageLimiter, async (req, res) => {
  const history = sanitizeNicoHistory(req.body?.messages).slice(-SUMMARY_EVERY_TURNS);
  if (!history.length || history[history.length - 1].role !== 'user') {
    return res.status(400).json({ error: 'Falta el último mensaje del usuario.' });
  }
  const previous = await loadMemory('max', req.userId);
  const turns = previous.turns + 1;
  let summary = previous.summary;
  try {
    if (turns % SUMMARY_EVERY_TURNS === 0) {
      summary = await refreshSummary({ apiKey: DEEPSEEK_API_KEY, previous: previous.summary, turns: history });
    }
    await saveMemory('max', req.userId, { summary, turns });
    return res.json({ ok: true });
  } catch (e) {
    console.warn('[agentMemory] no se pudo actualizar la memoria de Max:', e.message);
    return res.status(500).json({ error: 'No pudimos guardar la memoria.' });
  }
});

/** Derecho de supresión: borra el resumen de Max del usuario. */
router.delete('/max/memory', requireAuth, async (req, res) => {
  try {
    await deleteMemory('max', req.userId);
    return res.json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: 'No pudimos borrar la memoria.' });
  }
});

module.exports = router;
