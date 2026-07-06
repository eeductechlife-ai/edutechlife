export const PHASE_REACTIVE = 'reactive'
export const PHASE_PROACTIVE = 'proactive'
export const PROACTIVE_THRESHOLD = 5
export const PROACTIVE_INTERVAL = 3

export function getConversationPhase(messageCount) {
  return messageCount < PROACTIVE_THRESHOLD ? PHASE_REACTIVE : PHASE_PROACTIVE
}

export function shouldInsertProactiveMessage(phase, messageCount, lastProactiveIndex) {
  if (phase !== PHASE_PROACTIVE) return false
  if (lastProactiveIndex === null || lastProactiveIndex === undefined) return false
  return (messageCount - lastProactiveIndex) >= PROACTIVE_INTERVAL
}

export function getProactiveMessageByContext(phase, detectedTopics, userName) {
  if (phase !== PHASE_PROACTIVE) return null

  const name = userName && userName !== 'amigo' ? userName : null
  const topics = detectedTopics || []

  if (topics.length === 0) {
    return name
      ? `${name}, ¿te gustaría conocer los servicios educativos que ofrecemos? Tenemos opciones para todas las edades y la primera clase es gratuita.`
      : '¿Te gustaría conocer los servicios educativos que ofrecemos? Tenemos opciones para todas las edades y la primera clase es gratuita.'
  }

  const hasDiscussedPricing = topics.some(t =>
    typeof t === 'string' && (t.includes('precio') || t.includes('plan') || t.includes('costo') || t.includes('pago'))
  )

  if (!hasDiscussedPricing && topics.length > 0) {
    const interest = topics[topics.length - 1]
    const label = typeof interest === 'string' ? interest : 'este programa'
    return name
      ? `${name}, ¿sabías que tenemos planes desde $99.000 mensuales y primera clase gratuita en ${label}?`
      : `¿Sabías que tenemos planes desde $99.000 mensuales y primera clase gratuita en ${label}?`
  }

  return name
    ? `${name}, ¿qué te parece si agendamos una llamada gratuita con un especialista? Te ayudará a elegir el mejor plan según tus necesidades.`
    : '¿Qué te parece si agendamos una llamada gratuita con un especialista? Te ayudará a elegir el mejor plan según tus necesidades.'
}
