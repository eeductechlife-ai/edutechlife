import { useMemo } from 'react';

function normalCDF(x, mean = 50, sd = 10) {
  const z = (x - mean) / sd;
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const sign = z < 0 ? -1 : 1;
  const absZ = Math.abs(z);
  const t = 1 / (1 + p * absZ);
  const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absZ * absZ);
  return 0.5 * (1 + sign * y);
}

export function calculateCronbachAlpha(responsesByItem) {
  const k = responsesByItem.length;
  if (k < 3) return null;

  const styles = ['visual', 'auditivo', 'kinestesico'];
  const itemVariances = [];

  for (let i = 0; i < k; i++) {
    const scores = styles.map(s => responsesByItem[i][s] || 0);
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((sum, s) => sum + (s - mean) ** 2, 0) / scores.length;
    itemVariances.push(variance || 0.001);
  }

  const totalScores = { visual: [], auditivo: [], kinestesico: [] };
  for (const item of responsesByItem) {
    for (const s of styles) {
      totalScores[s].push(item[s] || 0);
    }
  }

  const totalVariance = {};
  for (const s of styles) {
    const scores = totalScores[s];
    if (scores.length < 2) { totalVariance[s] = 1; continue; }
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    totalVariance[s] = scores.reduce((sum, v) => sum + (v - mean) ** 2, 0) / scores.length || 1;
  }

  const sumItemVar = itemVariances.reduce((a, b) => a + b, 0);
  const alpha = {};
  for (const s of styles) {
    const kk = responsesByItem.length;
    alpha[s] = (kk / (kk - 1)) * (1 - sumItemVar / totalVariance[s]);
    alpha[s] = Math.min(1, Math.max(-1, alpha[s]));
  }

  return alpha;
}

export function calculateVAKScore(answers) {
  const counts = { visual: 0, auditivo: 0, kinestesico: 0 };
  const responsesByItem = [];

  for (const answer of answers) {
    counts[answer.type] = (counts[answer.type] || 0) + 1;
    responsesByItem.push({
      visual: answer.type === 'visual' ? 1 : 0,
      auditivo: answer.type === 'auditivo' ? 1 : 0,
      kinestesico: answer.type === 'kinestesico' ? 1 : 0,
    });
  }

  const totalPerStyle = Math.max(1, Math.floor(answers.length / 3));
  const rawPercentages = {
    visual: (counts.visual / totalPerStyle) * 100,
    auditivo: (counts.auditivo / totalPerStyle) * 100,
    kinestesico: (counts.kinestesico / totalPerStyle) * 100,
  };

  const T = {};
  for (const [style, pct] of Object.entries(rawPercentages)) {
    const proportion = Math.max(0.01, Math.min(0.99, pct / 100));
    const logit = Math.log(proportion / (1 - proportion));
    T[style] = 50 + 10 * logit;
  }

  const SE = 10 * Math.sqrt(1 - 0.80);
  const CI = 1.96 * SE;

  const intervals = {};
  for (const s of ['visual', 'auditivo', 'kinestesico']) {
    intervals[s] = {
      score: Math.round(T[s]),
      ci95: {
        lower: Math.max(0, Math.round(T[s] - CI)),
        upper: Math.min(100, Math.round(T[s] + CI)),
      },
      percentile: Math.round(normalCDF(T[s]) * 100),
      rawCount: counts[s],
    };
  }

  const cronbachAlpha = calculateCronbachAlpha(responsesByItem);
  const meanAlpha = cronbachAlpha
    ? Object.values(cronbachAlpha).reduce((a, b) => a + b, 0) / 3
    : null;

  return { counts, rawPercentages, T, intervals, cronbachAlpha, meanAlpha, totalQuestions: answers.length };
}

export default function useVAKScoring(answers) {
  return useMemo(() => {
    if (!answers || answers.length === 0) return null;
    return calculateVAKScore(answers);
  }, [answers]);
}
