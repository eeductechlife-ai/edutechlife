export const cleanTextForTTS = (text) => {
  if (!text) return ''

  let clean = text

  clean = clean.replace(/\*\*([^*]+)\*\*/g, '$1')
  clean = clean.replace(/__([^_]+)__/g, '$1')

  clean = clean.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '$1')
  clean = clean.replace(/(?<!_)_([^_]+)_(?!_)/g, '$1')

  clean = clean.replace(/^#{1,6}\s+/gm, '')

  clean = clean.replace(/^[\s]*[-*+]\s+/gm, '')
  clean = clean.replace(/^[\s]*\d+\.\s+/gm, '')

  clean = clean.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')

  clean = clean.replace(/`([^`]+)`/g, '$1')
  clean = clean.replace(/```[\s\S]*?```/g, '')

  clean = clean.replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
  clean = clean.replace(/[\u{1F600}-\u{1F64F}]/gu, '')
  clean = clean.replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
  clean = clean.replace(/[\u{2600}-\u{26FF}]/gu, '')
  clean = clean.replace(/[\u{2700}-\u{27BF}]/gu, '')
  clean = clean.replace(/[\u{1F018}-\u{1F270}]/gu, '')
  clean = clean.replace(/[\uFE0F\uFE0E]/g, '')
  clean = clean.replace(/[\u{1F3FB}-\u{1F3FF}]/gu, '')

  clean = clean.replace(/["""'']/g, ' ')
  clean = clean.replace(/[()\[\]{}]/g, ' ')
  clean = clean.replace(/[;:]+/g, '.')
  clean = clean.replace(/#{2,}/g, ' ')
  clean = clean.replace(/(?<!\w)\/(?!\w)/g, ' ')
  clean = clean.replace(/[*_~]{2,}/g, '')
  clean = clean.replace(/[▓░▒█▲▼◆■●○]{2,}/g, '')
  clean = clean.replace(/\|{2,}/g, '')
  clean = clean.replace(/[–—]\s*/g, '')

  clean = clean.replace(/\s+/g, ' ').trim()

  return clean
}
