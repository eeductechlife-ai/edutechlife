const normalize = (text) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const getWords = (text) => {
  return normalize(text)
    .split(/\s+/)
    .filter((w) => w.length > 2);
};

const wordOverlapScore = (queryWords, patternWords) => {
  if (queryWords.length === 0 || patternWords.length === 0) return 0;
  const patternSet = new Set(patternWords);
  let matches = 0;
  for (const word of queryWords) {
    if (patternSet.has(word)) matches++;
  }
  return matches / Math.min(queryWords.length, patternWords.length + 1);
};

export function matchIntent(text, intents) {
  if (!text) return null;
  const normalized = normalize(text);
  const queryWords = getWords(text);

  let bestMatch = null;
  let bestScore = 0;

  for (const intent of intents) {
    for (const pattern of intent.patterns) {
      const normalizedPattern = normalize(pattern);

      if (normalized.includes(normalizedPattern)) {
        return {
          id: intent.id,
          response: intent.response,
          category: intent.category,
        };
      }

      const patternWords = getWords(pattern);
      const score = wordOverlapScore(queryWords, patternWords);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = intent;
      }
    }
  }

  if (bestMatch && bestScore >= 0.4) {
    return {
      id: bestMatch.id,
      response: bestMatch.response,
      category: bestMatch.category,
    };
  }

  return null;
}

export function getKnowledgeStats(knowledge) {
  return {
    totalIntents: knowledge.intents.length,
    categories: Object.keys(knowledge.categories).length,
  };
}
