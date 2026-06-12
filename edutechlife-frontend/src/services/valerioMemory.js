const MEMORY_KEY = 'ialab_valerio_session'
const SESSION_KEY = 'ialab_valerio_active_session'

export const startSession = (moduleId) => {
  const session = {
    id: `session_${Date.now()}`,
    moduleId,
    startedAt: new Date().toISOString(),
    messageCount: 0,
    topics: [],
    keyQuestions: []
  }
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(session)) } catch {}
  return session
}

export const updateSession = (updates) => {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return
    const session = JSON.parse(raw)
    Object.assign(session, updates)
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } catch {}
}

export const endSession = (conversation) => {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw || !conversation || conversation.length === 0) return null

    const session = JSON.parse(raw)
    const topics = extractTopics(conversation)

    const summary = buildSessionSummary(session, conversation, topics)
    saveMemory(summary)
    sessionStorage.removeItem(SESSION_KEY)
    return summary
  } catch { return null }
}

const extractTopics = (conversation) => {
  const keywordTriggers = [
    { topic: 'prompt engineering', keywords: ['prompt', 'ingeniería', 'instrucción', 'role'] },
    { topic: 'chatgpt', keywords: ['chatgpt', 'gpt', 'openai'] },
    { topic: 'gemini', keywords: ['gemini', 'google', 'multimodal'] },
    { topic: 'notebooklm', keywords: ['notebooklm', 'notebook', 'podcast', 'audio overview'] },
    { topic: 'ética ia', keywords: ['ética', 'sesgo', 'bias', 'privacidad', 'responsable'] },
    { topic: 'vak', keywords: ['vak', 'aprendizaje', 'visual', 'auditivo', 'kinestésico'] },
    { topic: 'general ai', keywords: ['ia', 'ai', 'inteligencia artificial', 'modelo', 'alucinación'] }
  ]

  const found = new Set()
  const allText = conversation
    .filter(c => c.type === 'user')
    .map(c => c.content.toLowerCase())
    .join(' ')

  for (const trigger of keywordTriggers) {
    if (trigger.keywords.some(kw => allText.includes(kw))) {
      found.add(trigger.topic)
    }
  }

  return Array.from(found)
}

const buildSessionSummary = (session, conversation, topics) => {
  const userMessages = conversation.filter(c => c.type === 'user')
  const assistantMessages = conversation.filter(c => c.type === 'valerio')

  return {
    id: session.id,
    moduleId: session.moduleId,
    date: new Date().toISOString(),
    duration: session.startedAt
      ? Math.round((Date.now() - new Date(session.startedAt).getTime()) / 60000)
      : 0,
    messageCount: userMessages.length + assistantMessages.length,
    userMessageCount: userMessages.length,
    topics,
    lastQuestion: userMessages.length > 0
      ? userMessages[userMessages.length - 1].content.slice(0, 120)
      : null,
    lastAnswer: assistantMessages.length > 0
      ? assistantMessages[assistantMessages.length - 1].content.slice(0, 150)
      : null
  }
}

const saveMemory = (summary) => {
  try {
    const raw = localStorage.getItem(MEMORY_KEY)
    const history = raw ? JSON.parse(raw) : []
    history.push(summary)
    if (history.length > 20) history.shift()
    localStorage.setItem(MEMORY_KEY, JSON.stringify(history))
  } catch {}
}

export const injectSessionContext = () => {
  try {
    const raw = localStorage.getItem(MEMORY_KEY)
    if (!raw) return null
    const history = JSON.parse(raw)
    if (history.length === 0) return null

    const recent = history.slice(-3).reverse()
    return recent.map((s, i) => {
      const topicsStr = s.topics.length > 0 ? s.topics.join(', ') : 'general'
      return `[Session ${i + 1}] ${s.date.slice(0, 10)} - ${s.messageCount} messages about ${topicsStr}. Last question: "${s.lastQuestion || 'N/A'}"`
    }).join('\n')
  } catch { return null }
}
