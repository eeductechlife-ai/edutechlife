export const ACTIVITY_CONFIG = {
  video: {
    icon: "fa-play-circle",
    labelKey: "activity.config.video",
    color: "var(--color-petroleum)",
  },
  infographic: {
    icon: "fa-file-image",
    labelKey: "activity.config.infographic",
    color: "var(--color-petroleum)",
  },
  exam: {
    icon: "fa-file-alt",
    labelKey: "activity.config.exam",
    color: "var(--color-corporate)",
  },
  challenge: {
    icon: "fa-trophy",
    labelKey: "activity.config.challenge",
    color: "#10B981",
  },
  resource: {
    icon: "fa-book",
    labelKey: "activity.config.resource",
    color: "#F59E0B",
  },
  community: {
    icon: "fa-comments",
    labelKey: "activity.config.community",
    color: "var(--color-petroleum)",
  },
  lesson: {
    icon: "fa-check-circle",
    labelKey: "activity.config.lesson",
    color: "#10B981",
  },
};

export const MODULE_NAMES = {
  1: "Ingeniería de Prompts",
  2: "Potencia ChatGPT",
  3: "Rastreo Profundo",
  4: "Inmersión NotebookLM",
  5: "Proyecto Disruptivo",
};

export const MODULE_ICONS = {
  1: "fa-terminal",
  2: "fa-robot",
  3: "fa-search",
  4: "fa-microphone",
  5: "fa-trophy",
};

export const MODULE_RESOURCES = [
  {
    id: 1,
    title: MODULE_NAMES[1],
    icon: MODULE_ICONS[1],
    videos: 2,
    infographics: 3,
    hasExam: true,
    hasChallenge: true,
    hasCommunity: true,
  },
  {
    id: 2,
    title: MODULE_NAMES[2],
    icon: MODULE_ICONS[2],
    videos: 2,
    infographics: 3,
    hasExam: true,
    hasChallenge: true,
    hasCommunity: true,
  },
  {
    id: 3,
    title: MODULE_NAMES[3],
    icon: MODULE_ICONS[3],
    videos: 2,
    infographics: 3,
    hasExam: true,
    hasChallenge: true,
    hasCommunity: true,
  },
  {
    id: 4,
    title: MODULE_NAMES[4],
    icon: MODULE_ICONS[4],
    videos: 2,
    infographics: 3,
    hasExam: true,
    hasChallenge: true,
    hasCommunity: true,
  },
  {
    id: 5,
    title: MODULE_NAMES[5],
    icon: MODULE_ICONS[5],
    videos: 1,
    infographics: 2,
    hasExam: true,
    hasChallenge: true,
    hasCommunity: true,
  },
];

export const TABS = [
  { key: "modules", icon: "fa-cubes", labelKey: "activity.tab.modules" },
  { key: "activities", icon: "fa-list", labelKey: "activity.tab.activities" },
  { key: "stats", icon: "fa-chart-bar", labelKey: "activity.tab.stats" },
  {
    key: "recommendations",
    icon: "fa-lightbulb",
    labelKey: "activity.tab.recommendations",
  },
];

export const FILTER_OPTIONS = [
  { key: "all", labelKey: "activity.filter.all", icon: "fa-list" },
  { key: "exam", labelKey: "activity.filter.exam", icon: "fa-file-alt" },
  {
    key: "challenge",
    labelKey: "activity.filter.challenge",
    icon: "fa-trophy",
  },
  { key: "video", labelKey: "activity.filter.video", icon: "fa-play-circle" },
  {
    key: "lesson",
    labelKey: "activity.filter.lesson",
    icon: "fa-check-circle",
  },
  {
    key: "community",
    labelKey: "activity.filter.community",
    icon: "fa-comments",
  },
];
