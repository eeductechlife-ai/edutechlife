const { Router } = require('express');
const supabase = require('../../db/supabase');
const { chat, chatStream, validateMessages } = require('../../services/deepseek');
const { requireAuth } = require('../../middleware/auth');
const { requireVerifiedParentalConsent } = require('../../middleware/parentalConsent');
const { detectCrisis } = require('../../services/crisisDetection');
const { sendCrisisAlert, logCrisisIncident } = require('../../services/emailService');
const { loadStudentContext, buildSystemPrompt: buildOrchestratorPrompt } = require('../../services/daniOrchestrator');
const { validateInput, detectEmotionalState, sanitizeOutput } = require('../../services/aiSafetyGateway');

const router = Router();
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

const DANI_SYSTEM_PROMPT = `Eres Dani, un tutor virtual amigable para estudiantes de 8 a 16 años.

Personalidad:
- Nombre: Dani
- Tono: cálido, motivador y paciente
- Usa emojis ocasionalmente para hacer la experiencia más divertida 🎉
- Habla siempre en español

Reglas importantes:
- Guía a los estudiantes con preguntas en lugar de dar respuestas directas
- Ayuda a desarrollar pensamiento crítico y habilidades de resolución de problemas
- Mantén un lenguaje apropiado para la edad del estudiante
- Sé paciente y alentador, celebra los pequeños logros
- Si el estudiante se frustra, ofrece pistas en lugar de soluciones
- Promueve un ambiente de aprendizaje positivo y sin juzgamiento`;

/**
 * El system prompt de Dani lo fija exclusivamente el servidor. Los mensajes
 * del cliente que intenten enviar role:'system' se reescriben a 'user' para
 * que no puedan pisar ni eliminar la personalidad del tutor.
 */
function sanitizeClientMessages(messages) {
  return (messages || []).map((m) =>
    m.role === 'system' ? { role: 'user', content: m.content } : m,
  );
}

router.post('/chat', requireAuth, requireVerifiedParentalConsent, async (req, res) => {
  const { messages, context } = req.body;

  const validationError = validateMessages(messages);
  if (validationError) return res.status(400).json({ error: validationError });

  if (!DEEPSEEK_API_KEY) {
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  const systemPrompt = context
    ? `${DANI_SYSTEM_PROMPT}\n\nContexto actual:\n${context}`
    : DANI_SYSTEM_PROMPT;

  const msgs = [
    { role: 'system', content: systemPrompt },
    ...sanitizeClientMessages(messages),
  ];

  try {
    const data = await chat(DEEPSEEK_API_KEY, { messages: msgs });
    if (data.error) return res.status(400).json({ error: data.error.message });

    const text = data.choices?.[0]?.message?.content;
    if (!text) return res.status(500).json({ error: 'No response from API' });

    res.json({ result: text });
  } catch (e) {
    console.error('Error calling Dani AI:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/chat/stream', requireAuth, requireVerifiedParentalConsent, async (req, res) => {
  const { messages, context, language = 'es' } = req.body;
  const userId = req.userId;

  const validationError = validateMessages(messages);
  if (validationError) return res.status(400).json({ error: validationError });

  if (!DEEPSEEK_API_KEY) {
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  // Extract latest user message for crisis detection
  const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';

  // Detect crisis indicators
  const crisisDetection = detectCrisis(lastUserMessage, language);

  let streamClosed = false;
  req.on('close', () => {
    streamClosed = true;
    res.end();
  });

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // If high-risk crisis detected, handle escalation
  if (crisisDetection.level === 'high') {
    try {
      // Get parent email from parent_consents table
      const { data: consentData, error: consentError } = await supabase
        .from('parent_consents')
        .select('parent_email, student_age')
        .eq('student_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (consentData && consentData.parent_email) {
        // Send crisis alert to parent
        const emailResult = await sendCrisisAlert(
          consentData.parent_email,
          'Estudiante', // Would come from user metadata
          consentData.student_age,
          lastUserMessage,
          'high'
        );

        // Log incident to database
        await logCrisisIncident(
          supabase,
          userId,
          consentData.student_age,
          lastUserMessage,
          'high',
          consentData.parent_email
        );

        console.log('[Crisis Escalation] Email sent:', emailResult);
      }
    } catch (e) {
      console.error('[Crisis Escalation Error]', e);
      // Don't fail the chat request if escalation fails
    }
  }

  const systemPrompt = context
    ? `${DANI_SYSTEM_PROMPT}\n\nContexto actual:\n${context}`
    : DANI_SYSTEM_PROMPT;

  const msgs = [
    { role: 'system', content: systemPrompt },
    ...sanitizeClientMessages(messages),
  ];

  try {
    await chatStream(DEEPSEEK_API_KEY, { messages: msgs }, (chunk) => {
      if (streamClosed) return;
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    });

    if (streamClosed) return;
    if (crisisDetection.level !== 'none') {
      res.write(`data: ${JSON.stringify({ crisisAlert: crisisDetection.level })}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (e) {
    if (streamClosed) return;
    console.error('Error calling Dani AI (stream):', e);
    res.write(`data: ${JSON.stringify({ error: 'Error generando respuesta' })}\n\n`);
    res.end();
  }
});

/**
 * POST /api/smartboard/ai
 * General AI endpoint for SmartBoard components (OralExam, Podcast, ImprovementPlan, etc.)
 * Requires auth + verified parental consent. Accepts full messages array like /api/chat.
 */
router.post('/ai', requireAuth, requireVerifiedParentalConsent, async (req, res) => {
  const { messages, isJson, temperature, maxTokens } = req.body;

  const validationError = validateMessages(messages);
  if (validationError) return res.status(400).json({ error: validationError });

  if (!DEEPSEEK_API_KEY) {
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  try {
    const data = await chat(DEEPSEEK_API_KEY, {
      messages,
      isJson: isJson ?? false,
      temperature: temperature ?? 0.7,
      maxTokens: maxTokens ?? 2000,
    });

    if (data.error) return res.status(400).json({ error: data.error.message });

    const text = data.choices?.[0]?.message?.content;
    if (!text) return res.status(500).json({ error: 'No response from API' });

    res.json({ result: text });
  } catch (e) {
    console.error('[SmartBoard AI] Error:', e.message);
    const status = e.status;
    if (status === 402) return res.status(402).json({ error: 'API sin saldo disponible.' });
    if (status === 401) return res.status(401).json({ error: 'API key inválida o expirada.' });
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * GET /api/smartboard/dani/history
 * Load recent Dani chat history for the authenticated student.
 */
router.get('/dani/history', requireAuth, async (req, res) => {
  try {
    const { data: student } = await supabase
      .from('students')
      .select('id')
      .eq('auth_id', req.userId)
      .maybeSingle();

    if (!student) return res.json({ messages: [] });

    const { data, error } = await supabase
      .from('conversations')
      .select('user_message, ai_response, timestamp')
      .eq('student_id', student.id)
      .order('timestamp', { ascending: true })
      .limit(50);

    if (error) {
      if (error.code === '42P01' || error.code === 'PGRST205') {
        return res.json({ messages: [] });
      }
      throw error;
    }

    const messages = [];
    for (const conv of (data || [])) {
      messages.push({ role: 'user', text: conv.user_message, timestamp: conv.timestamp });
      messages.push({ role: 'assistant', text: conv.ai_response, timestamp: conv.timestamp });
    }

    res.json({ messages });
  } catch (e) {
    console.error('[Dani History]', e.message);
    res.status(500).json({ error: 'Error loading history' });
  }
});

/**
 * POST /api/smartboard/dani/chat
 * Orchestrated Dani endpoint. Frontend sends minimal payload; backend builds full context.
 * Body: { message, studentId, socraticMode?, documentContext?, history? }
 */
router.post('/dani/chat', requireAuth, requireVerifiedParentalConsent, async (req, res) => {
  const { message, studentId: bodyStudentId, socraticMode = false, documentContext = null, history = [] } = req.body;

  // 1. Safety gateway — input validation
  const { ok, reason, sanitized } = validateInput(message);
  if (!ok) {
    return res.status(400).json({ error: reason === 'empty_input' ? 'Mensaje vacío' : 'Contenido no permitido' });
  }

  // Resolve student: use body studentId if provided, otherwise look up by auth_id.
  // This handles the case where the frontend hasn't loaded studentDbId yet.
  let studentId = bodyStudentId || null;
  if (!studentId) {
    const { data: selfStudent } = await supabase
      .from('students')
      .select('id')
      .eq('auth_id', req.userId)
      .maybeSingle();
    studentId = selfStudent?.id || null;
  }
  if (!studentId) return res.status(404).json({ error: 'Perfil de estudiante no encontrado' });

  // Authorization: if studentId came from the body, verify ownership.
  // Either the student's auth_id matches the authenticated user, or the user
  // is a linked parent of that student.
  if (bodyStudentId) {
    const { data: studentRow } = await supabase
      .from('students')
      .select('auth_id')
      .eq('id', bodyStudentId)
      .maybeSingle();
    const isOwner = studentRow?.auth_id === req.userId;
    if (!isOwner) {
      const { data: parentLink } = await supabase
        .from('parent_student_links')
        .select('id')
        .eq('student_id', bodyStudentId)
        .eq('parent_user_id', req.userId)
        .maybeSingle();
      if (!parentLink) return res.status(403).json({ error: 'Acceso no autorizado' });
    }
  }

  req.studentId = studentId;

  if (!DEEPSEEK_API_KEY) return res.status(500).json({ error: 'API key no configurada' });

  // 2. Detect emotional state from user message (non-blocking metadata)
  const emotional = detectEmotionalState(sanitized);

  // 3. Load student context from DB (orchestrator)
  let ctx;
  try {
    ctx = await loadStudentContext(studentId);
  } catch (e) {
    console.error('[DaniOrchestrator] Context load failed:', e.message);
    ctx = { profile: null, mastery: [], memory: null, activePlan: null, todaySchedule: [] };
  }

  // 4. Build system prompt (observable: no fallos silenciosos)
  let systemPrompt;
  try {
    systemPrompt = buildOrchestratorPrompt(ctx, { socraticMode, documentContext });
  } catch (e) {
    console.error('[Dani2 Prompt build failed]', e.stack || e.message);
    console.error('[Dani2 ctx sample]', JSON.stringify(ctx).slice(0, 600));
    return res.status(500).json({ error: 'Error generando contexto' });
  }

  // 5. Assemble messages array
  // Drop leading assistant turns (welcome/frontend-generated) so the LLM always
  // sees a valid user→assistant alternation. Without this DeepSeek can interpret
  // the orphaned assistant message as a fresh-start greeting and ignore context.
  // Only keep last 6 turns, strip label patterns that poison the style
  const LABEL_RE = /\*?\*?(PREGUNTA|PISTA|EXPLICACI[ÓO]N|EJEMPLO|VERIFICACI[ÓO]N)\*?\*?:/i;
  const rawHistory = Array.isArray(history)
    ? history.slice(-6).filter((m) => m.role && typeof m.content === 'string')
    : [];
  const firstUserIdx = rawHistory.findIndex((m) => m.role === 'user');
  const cleanHistory = firstUserIdx >= 0 ? rawHistory.slice(firstUserIdx) : [];
  // Strip label markers from assistant messages so the model doesn't copy the pattern
  const safeHistory = cleanHistory.map((m) =>
    m.role === 'assistant'
      ? { ...m, content: m.content.replace(LABEL_RE, '').trim() }
      : m
  );

  const msgs = [
    { role: 'system', content: systemPrompt },
    ...safeHistory,
    { role: 'user', content: sanitized },
  ];

  // 6. Crisis detection (existing service)
  const crisisDetection = detectCrisis(sanitized, 'es');

  let streamClosed = false;
  // Detectar cliente desconectado con res.on('close'): req.on('close') se
  // dispara al terminar el body de la request (POST) y cortaría el SSE antes
  // de tiempo. res.on('close') solo ocurre cuando la respuesta se cierra.
  res.on('close', () => { streamClosed = true; });

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // 7. Stream emotional state metadata first
  if (emotional.state !== 'neutral' || emotional.dependencyRisk) {
    res.write(`data: ${JSON.stringify({ emotionalState: emotional.state, dependencyRisk: emotional.dependencyRisk })}\n\n`);
  }

  // 8. Crisis escalation (same as existing /chat/stream)
  if (crisisDetection.level === 'high') {
    try {
      const { data: consentData } = await supabase
        .from('parent_consents')
        .select('parent_email, student_age')
        .eq('student_id', req.userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (consentData?.parent_email) {
        await sendCrisisAlert(consentData.parent_email, 'Estudiante', consentData.student_age, sanitized, 'high');
        await logCrisisIncident(supabase, req.userId, consentData.student_age, sanitized, 'high', consentData.parent_email);
      }
    } catch (e) {
      console.error('[Dani2 Crisis]', e.message);
    }
  }

  try {
    let fullResponse = '';
    await chatStream(DEEPSEEK_API_KEY, { messages: msgs, temperature: 0.65, maxTokens: 200 }, (chunk) => {
      if (streamClosed) return;
      const safe = sanitizeOutput(chunk);
      fullResponse += safe;
      res.write(`data: ${JSON.stringify({ chunk: safe })}\n\n`);
    });

    if (streamClosed) return;
    if (crisisDetection.level !== 'none') {
      res.write(`data: ${JSON.stringify({ crisisAlert: crisisDetection.level })}\n\n`);
    }
    res.write('data: [DONE]\n\n');
    res.end();

    // Persist exchange to conversations table (fire-and-forget)
    if (fullResponse && req.studentId) {
      supabase.from('conversations').insert({
        student_id: req.studentId,
        user_message: sanitized,
        ai_response: fullResponse.replace(/<memoria>[\s\S]*?<\/memoria>/, '').trim(),
        emotional_context: { sentiment: emotional.state, dependencyRisk: emotional.dependencyRisk },
        subject: ctx.profile?.currentSubject || null,
        learning_style_applied: ctx.profile?.learningStyle || null,
        messages_in_context: safeHistory.length + 1,
        model_used: 'deepseek-chat',
      }).then(({ error: insertErr }) => {
        if (insertErr && insertErr.code !== '42P01') {
          console.error('[Dani2] Conversation save failed:', insertErr.message);
        }
      });
    }
  } catch (e) {
    if (streamClosed) return;
    console.error('[Dani2 Stream Error]', e.message);
    if (res.headersSent) {
      // El stream SSE ya empezó: no se pueden cambiar headers; terminar el
      // stream con una señal de error en lugar de res.status().json().
      try { res.write('data: {"error":"stream_failed"}\n\n'); res.end(); } catch (_) {}
      return;
    }
    const status = e.status;
    if (status === 402) return res.status(402).json({ error: 'API sin saldo.' });
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
