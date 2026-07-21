import {
  analyzePromptQuality,
  getQualityLevel,
  identifyPromptType,
} from "../../../utils/promptAnalyzer";
import { getAvailableTechniques } from "../../../utils/promptOptimizer";
import { MIN_INPUT_LENGTH, MAX_INPUT_LENGTH, EMPTY_USAGE_STATS } from "./synthesizerConfig";

export function getUsageStats(history) {
  if (history.length === 0) {
    return EMPTY_USAGE_STATS;
  }

  const techniqueCount = {};
  history.forEach((item) => {
    if (item && item.techniqueApplied && item.techniqueApplied.name) {
      const tech = item.techniqueApplied.name;
      techniqueCount[tech] = (techniqueCount[tech] || 0) + 1;
    }
  });

  const favoriteTechnique =
    Object.entries(techniqueCount).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "Ninguna";

  const averageScore = Math.round(
    history.reduce((sum, item) => {
      if (item && item.analysis && item.analysis.score) {
        return sum + item.analysis.score;
      }
      return sum;
    }, 0) / (history.length || 1),
  );

  let improvementTrend = 0;
  if (history.length >= 3) {
    const firstScores = history
      .slice(-3)
      .map((item) => (item && item.analysis ? item.analysis.score : 0));
    const lastScores = history
      .slice(0, 3)
      .map((item) => (item && item.analysis ? item.analysis.score : 0));
    const firstAvg =
      firstScores.reduce((a, b) => a + b, 0) / firstScores.length;
    const lastAvg = lastScores.reduce((a, b) => a + b, 0) / lastScores.length;
    improvementTrend = Math.round(lastAvg - firstAvg);
  }

  return {
    totalOptimizations: history.length,
    lastOptimization: history[0]?.timestamp || null,
    favoriteTechnique,
    averageScore,
    improvementTrend,
    averageLength: Math.round(
      history.reduce((sum, item) => {
        if (item && item.originalPrompt) {
          return sum + item.originalPrompt.length;
        }
        return sum;
      }, 0) / (history.length || 1),
    ),
  };
}

export function getTechniquesForDisplay() {
  return getAvailableTechniques();
}

export function getQuickAnalysis(text) {
  if (!text || text.trim().length < 3) return null;

  try {
    const analysis = analyzePromptQuality(text);
    const promptType = identifyPromptType(text);
    const qualityLevel = getQualityLevel(analysis.score);

    return {
      score: analysis.score,
      level: qualityLevel.level,
      color: qualityLevel.color,
      emoji: qualityLevel.emoji,
      type: promptType.type,
      technique: promptType.technique,
      icon: promptType.icon,
      wordCount: text.split(/\s+/).length,
      suggestions: analysis.suggestions.slice(0, 2),
      analysis: analysis.analysis,
    };
  } catch (err) {
    console.error("Error in quick analysis:", err);
    return null;
  }
}

export function isValidInput(text) {
  return (
    text.trim().length >= MIN_INPUT_LENGTH &&
    text.trim().length <= MAX_INPUT_LENGTH
  );
}

export function copyToClipboard(text) {
  if (!text) return false;

  try {
    navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Error copying to clipboard:", err);
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      return true;
    } catch (fallbackErr) {
      console.error("Fallback copy failed:", fallbackErr);
      return false;
    } finally {
      document.body.removeChild(textArea);
    }
  }
}
