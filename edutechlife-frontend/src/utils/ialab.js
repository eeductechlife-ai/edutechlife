import { MODULE_QUESTIONS, modules } from '@/data/ialab';
import { WEIGHTS, MODULE_RESOURCE_COUNTS } from '@/constants/ialab';

/**
 * @typedef {{ exam: boolean, challenge: boolean, resourcesCompleted: boolean, community: boolean, currentScore: number, isUnlocked: boolean, examScore?: number, examEarned?: number, challengeScore?: number, challengeEarned?: number, viewedResources?: string[], resourcesPct?: number }} ModuleProgress
 */

/** Batched localStorage wrapper */
export const ls = {
  _pending: null,
  _flush: () => {
    if (!ls._pending) return;
    const batch = ls._pending;
    ls._pending = null;
    try {
      for (const [key, value] of batch) {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch {}
  },
  /** @param {string} key @param {*} [fallback] */
  get: (key, fallback = null) => {
    if (ls._pending?.has(key)) return ls._pending.get(key);
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : fallback;
    } catch { return fallback; }
  },
  /** @param {string} key @param {*} value */
  set: (key, value) => {
    if (!ls._pending) {
      ls._pending = new Map();
      queueMicrotask(ls._flush);
    }
    ls._pending.set(key, value);
  },
  /** @param {string} key */
  remove: (key) => {
    if (ls._pending?.has(key)) ls._pending.delete(key);
    try { localStorage.removeItem(key); } catch {}
  },
};

const memoCache = new Map();

/**
 * Simple memoization cache for expensive calculations
 * @template T
 * @param {string} key
 * @param {() => T} fn
 * @param {number} [ttl=500]
 * @returns {T}
 */
export const memoize = (key, fn, ttl = 2000) => {
  const cached = memoCache.get(key);
  if (cached && Date.now() - cached.timestamp < ttl) return cached.value;
  const value = fn();
  memoCache.set(key, { value, timestamp: Date.now() });
  return value;
};

export const clearMemoCache = () => memoCache.clear();

/**
 * Calculate module score from its progress
 * @param {ModuleProgress | undefined | null} mod
 * @returns {number}
 */
export const calcModuleScore = (mod) => {
  if (!mod) return 0;
  let score = 0;
  score += mod.examEarned || (mod.exam ? WEIGHTS.exam : 0);
  score += mod.challengeEarned || (mod.challenge ? WEIGHTS.challenge : 0);
  if (mod.resourcesCompleted) score += WEIGHTS.resources;
  if (mod.community) score += WEIGHTS.community;
  return Math.min(100, Math.round(score * 10) / 10);
};

/**
 * Calculate global progress across all modules
 * @param {Record<number, ModuleProgress | undefined>} moduleProgress
 * @returns {number}
 */
export const calcGlobalProgress = (moduleProgress) => {
  let total = 0;
  for (let i = 1; i <= 5; i++) {
    const mp = moduleProgress[i];
    if (mp) total += (calcModuleScore(mp) / 100) * 20;
  }
  return Math.min(100, Math.round(total));
};

/**
 * Analyze quiz failures per module and return weak topics
 * @param {(key: string, fallback?: any) => any} storageGetFn
 * @returns {Record<number, Record<string, number>>}
 */
export const analyzeQuizFailures = (storageGetFn) => {
  const weakTopicsByModule = {};
  for (let id = 1; id <= 5; id++) {
    const attempts = storageGetFn(`quizAttempts_${id}`, []);
    const latestFailures = [];
    if (Array.isArray(attempts)) {
      attempts.forEach(a => {
        if (Array.isArray(a.failedQuestions)) latestFailures.push(...a.failedQuestions);
      });
    }
    const modQuestions = MODULE_QUESTIONS[id] || [];
    const weakTopics = {};
    latestFailures.forEach(qId => {
      const q = modQuestions.find(mq => mq.id === qId);
      if (q) weakTopics[q.topic] = (weakTopics[q.topic] || 0) + 1;
    });
    if (Object.keys(weakTopics).length > 0) {
      weakTopicsByModule[id] = weakTopics;
    }
  }
  return weakTopicsByModule;
};

/**
 * Generate recommendation objects from module progress and weak topics
 * @param {Record<number, any>} moduleProgress
 * @param {(id: number) => number} calculateModuleScoreFn
 * @param {Record<number, number>} completedExams
 * @param {Record<number, number>} challengeScores
 * @param {Record<number, Record<string, number>>} weakTopicsByModule
 * @returns {Array<{moduleId: number, moduleName: string, type: string, text: string, urgency: string}>}
 */
export const generateRecommendations = (moduleProgress, calculateModuleScoreFn, completedExams, challengeScores, weakTopicsByModule) => {
  const recs = [];
  for (let id = 1; id <= 5; id++) {
    const score = calculateModuleScoreFn(id);
    const mod = moduleProgress[id];
    if (!mod) continue;
    if (score >= 80) continue;
    const modName = modules.find(m => m.id === id)?.title || `Módulo ${id}`;
    const totalResources = MODULE_RESOURCE_COUNTS[id] || 8;
    const resourcesLeft = mod.viewedResources ? (totalResources - mod.viewedResources.length) : totalResources;
    const examScore = mod.examScore || completedExams[id] || 0;
    const challengeScoreVal = mod.challengeScore || challengeScores[id] || 0;

    const weakTopics = weakTopicsByModule[id];
    if (weakTopics) {
      Object.entries(weakTopics).forEach(([topic, count]) => {
        recs.push({
          moduleId: id, moduleName: modName, type: 'weak_topic',
          topic, failedCount: count,
          text: `Refuerza "${topic}" en ${modName} (${count} pregunta${count > 1 ? 's' : ''} fallada${count > 1 ? 's' : ''})`,
          urgency: count >= 2 ? 'high' : 'medium',
        });
      });
    }

    if (resourcesLeft > 0) {
      recs.push({ moduleId: id, moduleName: modName, type: 'resources', text: `Te faltan ${resourcesLeft} recursos por ver en ${modName}`, urgency: resourcesLeft > 4 ? 'high' : 'medium' });
    }
    if (examScore > 0 && examScore < 80) {
      recs.push({ moduleId: id, moduleName: modName, type: 'exam', text: `Puedes mejorar tu examen de ${modName} (${examScore}%)`, urgency: 'high' });
    } else if (examScore === 0 && resourcesLeft <= 2) {
      recs.push({ moduleId: id, moduleName: modName, type: 'exam', text: `Rinde el examen de ${modName}`, urgency: 'high' });
    }
    if (challengeScoreVal > 0 && challengeScoreVal < 80) {
      recs.push({ moduleId: id, moduleName: modName, type: 'challenge', text: `Mejora tu desafío de ${modName} (${challengeScoreVal}%)`, urgency: 'medium' });
    } else if (challengeScoreVal === 0 && score >= 60) {
      recs.push({ moduleId: id, moduleName: modName, type: 'challenge', text: `Completa el desafío de ${modName}`, urgency: 'medium' });
    }
  }

  recs.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.urgency] - order[b.urgency];
  });
  return recs;
};
