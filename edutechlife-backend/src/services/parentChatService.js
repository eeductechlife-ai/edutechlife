const supabase = require('../db/supabase');
const { chat } = require('./deepseek');

/**
 * Parent-Dani Chat Service
 * Manages conversations between parents and the AI tutor Dani
 */

const DANI_PARENT_SYSTEM_PROMPT = `Eres Dani, el tutor virtual de EdutechLife, ahora hablando con los padres de familia.

Tu rol es ser un asesor empático que ayuda a los padres a:
- Comprender el progreso de sus hijos/as
- Identificar áreas de oportunidad
- Recibir recomendaciones pedagógicas basadas en datos
- Tomar decisiones informadas sobre el aprendizaje de sus hijos/as

Personalidad:
- Tono: profesional pero accesible y cálido
- Empatía: comprende las preocupaciones de los padres
- Datos: siempre fundamenta recomendaciones en métricas
- Acción: sugiere pasos concretos que los padres pueden tomar

Áreas en las que NO haces intervención:
- Diagnósticos médicos o psicológicos
- Medicamentos o tratamientos clínicos
- Sustitución de profesionales de la salud mental

Siempre ofreces recursos, información de contacto con especialistas si es necesario.`;

/**
 * Create or get a conversation with a student
 */
async function getOrCreateConversation(parentId, studentId, options = {}) {
  const { title = null, topic = 'progress' } = options;

  // Check existing conversation
  const { data: existing } = await supabase
    .from('parent_dani_conversations')
    .select('id, title, status')
    .eq('parent_user_id', parentId)
    .eq('student_user_id', studentId)
    .eq('status', 'active')
    .maybeSingle();

  if (existing) {
    return { id: existing.id, isNew: false };
  }

  // Create new conversation
  const { data: newConv, error } = await supabase
    .from('parent_dani_conversations')
    .insert([
      {
        parent_user_id: parentId,
        student_user_id: studentId,
        title: title || `Chat sobre ${studentId}`,
        topic,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return { id: newConv.id, isNew: true };
}

/**
 * Get all conversations for a parent
 */
async function getParentConversations(parentId, options = {}) {
  const { status = 'active', limit = 50 } = options;

  let query = supabase
    .from('parent_dani_conversations')
    .select(`
      id, title, topic, status, started_at, last_message_at, message_count,
      student:students!inner(name, avatar_url, age)
    `)
    .eq('parent_user_id', parentId);

  if (status) query = query.eq('status', status);

  query = query.order('last_message_at', { ascending: false }).limit(limit);

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).map(conv => ({
    id: conv.id,
    title: conv.title,
    topic: conv.topic,
    status: conv.status,
    startedAt: conv.started_at,
    lastMessageAt: conv.last_message_at,
    messageCount: conv.message_count,
    student: conv.student?.[0] || {},
  }));
}

/**
 * Get conversation history with messages
 */
async function getConversationHistory(conversationId, limit = 50) {
  const { data, error } = await supabase
    .from('conversation_messages')
    .select('id, sender, message, message_type, sentiment, created_at')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data || []).reverse().map(msg => ({
    id: msg.id,
    role: msg.sender === 'dani' ? 'assistant' : 'user',
    content: msg.message,
    type: msg.message_type,
    sentiment: msg.sentiment,
    timestamp: msg.created_at,
  }));
}

/**
 * Send message to Dani and get response
 */
async function sendMessageToDani(parentId, conversationId, parentMessage, contextData = {}) {
  // Verify conversation ownership
  const { data: conv, error: convError } = await supabase
    .from('parent_dani_conversations')
    .select('student_user_id')
    .eq('id', conversationId)
    .eq('parent_user_id', parentId)
    .single();

  if (convError || !conv) throw new Error('Conversación no encontrada o no tiene acceso');

  // Get student context for Dani
  const studentId = conv.student_user_id;
  const context = await buildParentChatContext(studentId, contextData);

  // Store parent message
  await addConversationMessage(conversationId, 'parent', parentMessage, { context });

  // Get conversation history for Dani
  const history = await getConversationHistory(conversationId, 10);

  // Prepare messages for Dani
  const messages = [
    ...history.map(h => ({
      role: h.role,
      content: h.content,
    })),
    {
      role: 'user',
      content: parentMessage,
    },
  ];

  // Get Dani response
  const systemPrompt = `${DANI_PARENT_SYSTEM_PROMPT}

Contexto del estudiante:
${JSON.stringify(context, null, 2)}`;

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error('API key no configurada');

  try {
    const response = await chat(apiKey, {
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({
          role: m.role === 'assistant' ? 'assistant' : m.role === 'user' ? 'user' : 'system',
          content: m.content,
        })),
      ],
    });

    const daniResponse = response.choices?.[0]?.message?.content || 'Disculpa, no pude generar una respuesta.';

    // Store Dani message
    await addConversationMessage(conversationId, 'dani', daniResponse, {
      type: 'response',
    });

    // Update conversation last_message_at
    await supabase
      .from('parent_dani_conversations')
      .update({
        last_message_at: new Date().toISOString(),
        message_count: (history.length / 2) + 1, // Approximate
      })
      .eq('id', conversationId);

    return {
      success: true,
      response: daniResponse,
      conversationId,
    };
  } catch (e) {
    console.error('Error calling Dani for parent:', e);
    throw new Error('Error generando respuesta del tutor');
  }
}

/**
 * Add a message to conversation
 */
async function addConversationMessage(conversationId, sender, message, metadata = {}) {
  const { data, error } = await supabase
    .from('conversation_messages')
    .insert([
      {
        conversation_id: conversationId,
        sender,
        message,
        message_type: metadata.type || 'text',
        context_data: metadata.context || {},
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Build context for Dani about a student (for parent chat)
 */
async function buildParentChatContext(studentId, additionalData = {}) {
  // Get student profile
  const { data: student } = await supabase
    .from('students')
    .select('name, age, vak_style, school, grade')
    .eq('auth_id', studentId)
    .maybeSingle();

  // Get recent points
  const { data: points } = await supabase
    .from('points_history')
    .select('points')
    .eq('user_id', studentId)
    .order('created_at', { ascending: false })
    .limit(100);

  const totalPoints = (points || []).reduce((sum, p) => sum + (p.points || 0), 0);

  // Get streak
  const { data: streak } = await supabase
    .from('learning_streaks')
    .select('current_streak, best_streak')
    .eq('student_id', studentId)
    .maybeSingle();

  // Get recent achievements
  const { data: achievements } = await supabase
    .from('student_achievements')
    .select('achievement:achievements(title, points_reward)')
    .eq('student_user_id', studentId)
    .order('unlocked_at', { ascending: false })
    .limit(5);

  // Get risk score
  const { data: risk } = await supabase
    .from('student_risk_scores')
    .select('engagement_score, performance_score, overall_risk_level')
    .eq('student_user_id', studentId)
    .maybeSingle();

  return {
    student: {
      name: student?.name || 'Estudiante',
      age: student?.age,
      vakStyle: student?.vak_style,
      school: student?.school,
      grade: student?.grade,
    },
    progress: {
      totalPoints,
      currentStreak: streak?.current_streak || 0,
      bestStreak: streak?.best_streak || 0,
    },
    recentAchievements: (achievements || [])
      .slice(0, 3)
      .map(a => a.achievement?.title || 'Logro'),
    wellbeing: {
      engagementScore: risk?.engagement_score || 50,
      performanceScore: risk?.performance_score || 50,
      riskLevel: risk?.overall_risk_level || 'low',
    },
    ...additionalData,
  };
}

/**
 * Generate summary of a conversation
 */
async function generateConversationSummary(conversationId) {
  // Get all messages
  const { data: messages } = await supabase
    .from('conversation_messages')
    .select('message, sender')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (!messages || messages.length === 0) {
    return null;
  }

  // Extract key topics (simple keyword extraction)
  const allText = messages.map(m => m.message).join(' ');
  const keywords = extractKeywords(allText);

  // Create summary
  const { data: summary, error } = await supabase
    .from('conversation_summaries')
    .upsert(
      {
        conversation_id: conversationId,
        summary_text: `Conversación con ${messages.length} mensajes sobre el progreso y bienestar del estudiante.`,
        key_topics: keywords,
        generated_at: new Date().toISOString(),
      },
      { onConflict: 'conversation_id' }
    )
    .select()
    .single();

  if (error) throw error;
  return summary;
}

/**
 * Simple keyword extraction
 */
function extractKeywords(text) {
  const stopWords = new Set([
    'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas',
    'de', 'a', 'ante', 'por', 'para', 'con', 'sin', 'en', 'sobre', 'entre',
    'es', 'está', 'está', 'son', 'están', 'era', 'eran', 'fue', 'fueron',
    'ser', 'estar', 'haber', 'tener',
    'y', 'o', 'u', 'pero', 'sino', 'porque', 'pues', 'luego', 'si', 'aunque',
    'que', 'cual', 'quien', 'donde', 'cuando', 'como', 'cuanto',
  ]);

  const words = text.toLowerCase()
    .split(/\W+/)
    .filter(w => w.length > 3 && !stopWords.has(w));

  const freq = {};
  words.forEach(word => {
    freq[word] = (freq[word] || 0) + 1;
  });

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
}

/**
 * Archive old conversations
 */
async function archiveOldConversations() {
  const { data, error } = await supabase.rpc('archive_old_conversations');
  if (error) throw error;
  return data;
}

module.exports = {
  getOrCreateConversation,
  getParentConversations,
  getConversationHistory,
  sendMessageToDani,
  addConversationMessage,
  buildParentChatContext,
  generateConversationSummary,
  archiveOldConversations,
};
