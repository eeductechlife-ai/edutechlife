import { iconMap } from "./iconMap";
import { detectThemeFromTopic } from "./themeDetection";

export function detectCardIcon(keyword) {
  if (!keyword) return "📚";
  const keywordLower = keyword.toLowerCase();

  if (iconMap[keywordLower]) {
    return iconMap[keywordLower];
  }

  const words = keywordLower
    .split(/[\s,;:.()-]+/)
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);
  for (const word of words) {
    if (iconMap[word]) {
      return iconMap[word];
    }
  }

  for (const [key, icon] of Object.entries(iconMap)) {
    if (key.length < 5) continue;
    if (keywordLower.includes(key)) {
      return icon;
    }
  }

  const theme = detectThemeFromTopic(keyword);
  return theme.icon;
}
