import { useState, useEffect, useCallback } from 'react';

const STORAGE_PREFIX = 'ialab_sm2_';

function loadPersistedState(moduleId) {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${moduleId}`);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function persistState(moduleId, state) {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${moduleId}`, JSON.stringify(state));
  } catch {
    /* storage full or unavailable — silently degrade */
  }
}

function computeQuality(rating) {
  switch (rating) {
    case 0: return 1;
    case 1: return 2;
    case 2: return 3;
    case 3: return 4;
    default: return 3;
  }
}

function sm2(quality, card) {
  const ef = Math.max(1.3, card.easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

  if (quality < 3) {
    return {
      easinessFactor: ef,
      interval: 1,
      repetitions: 0,
    };
  }

  const interval = card.repetitions === 0
    ? 1
    : card.repetitions === 1
      ? 6
      : Math.round(card.interval * ef);

  return {
    easinessFactor: ef,
    interval,
    repetitions: card.repetitions + 1,
  };
}

export function useSM2Flashcard(moduleId) {
  const [state, setState] = useState(() => loadPersistedState(moduleId));

  useEffect(() => {
    persistState(moduleId, state);
  }, [moduleId, state]);

  const rateCard = useCallback((cardId, rating) => {
    setState(prev => {
      const card = prev[cardId] || { easinessFactor: 2.5, interval: 0, repetitions: 0 };
      const quality = computeQuality(rating);
      const result = sm2(quality, card);
      const nextReview = new Date();
      nextReview.setDate(nextReview.getDate() + result.interval);

      return {
        ...prev,
        [cardId]: {
          ...card,
          ...result,
          lastRating: rating,
          lastReviewed: new Date().toISOString(),
          nextReviewDate: nextReview.toISOString(),
        },
      };
    });
  }, []);

  const getCardStats = useCallback((cardId) => {
    return state[cardId] || { easinessFactor: 2.5, interval: 0, repetitions: 0, nextReviewDate: null, lastRating: null, lastReviewed: null };
  }, [state]);

  const getDueCards = useCallback((cards) => {
    const now = new Date();
    return cards.filter(c => {
      const stats = state[c.id];
      if (!stats || !stats.nextReviewDate) return true;
      return new Date(stats.nextReviewDate) <= now;
    });
  }, [state]);

  const dueCount = Object.values(state).filter(s => {
    if (!s.nextReviewDate) return true;
    return new Date(s.nextReviewDate) <= new Date();
  }).length;

  const resetModule = useCallback(() => {
    setState({});
  }, []);

  const totalCards = Object.keys(state).length;

  return {
    rateCard,
    getCardStats,
    getDueCards,
    resetModule,
    dueCount,
    totalCards,
    state,
  };
}
