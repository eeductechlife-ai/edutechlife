/** LocalStorage key constants */
export const LS_KEYS = {
  VIEWED_RESOURCES: 'ialab_viewed_resources',
  COMPLETED_VIDEOS: 'ialab_completed_videos',
  COMPLETED_MODULES: 'ialab_completed_modules',
  COMPLETED_EXAMS: 'ialab_completed_exams',
  COMPLETED_INFOGRAPHICS: 'ialab_completed_infographics',
  COMPLETED_ACTIVITIES: 'ialab_completed_activities',
  OVERALL_PROGRESS: 'ialab_overall_progress',
  SYNC_QUEUE: 'ialab_sync_queue',
  ACTIVITY_LOG: 'ialab_activity_log',
  RESOURCE_STATUS: 'ialab_resource_status',
  NOTIFICATIONS: 'ialab_notifications',
  NOTIFIED_CERTIFICATION: 'ialab_notified_certification',
  VALERIO_WELCOMED: 'ialab_valerio_welcomed',
  SIDEBAR_STATE: 'ialab-sidebar-state',
  PROGRESS_CACHE: 'ialab_progress_cache',
  SECURITY_WARNINGS_RESET: 'securityWarningsResetDate',
  SETTINGS: 'edutechlife_settings',
  LESSON_PROGRESS: 'ialab_lesson_progress',
  XP: 'ialab_xp',
  STREAK: 'ialab_streak',
  LAST_ACTIVITY_DATE: 'ialab_last_activity_date',
  BADGES: 'ialab_badges',
  BADGES_DATES: 'ialab_badges_dates',
  CHECKPOINT_ANSWERS: 'ialab_checkpoint_answers',
  FORUM_POST_COUNT: 'ialab_forum_post_count',
  FORUM_COMMENT_COUNT: 'ialab_forum_comment_count',
  BOOKMARKED_RESOURCES: 'ialab_bookmarked_resources',
  START_DATE: 'ialab_start_date',
};

/** Scoring weights: exam 35% + challenge 30% + resources 30% + community 5% */
export const WEIGHTS = { exam: 35, challenge: 30, resources: 30, community: 5 };

/** @type {Record<number, { exam: boolean, challenge: boolean, resourcesCompleted: boolean, resourcesPct: number, viewedResources: string[], community: boolean, currentScore: number, isUnlocked: boolean }>} */
export const INITIAL_MODULE_PROGRESS = {
  1: { exam: false, challenge: false, resourcesCompleted: false, resourcesPct: 0, viewedResources: [], community: false, currentScore: 0, isUnlocked: true },
  2: { exam: false, challenge: false, resourcesCompleted: false, resourcesPct: 0, viewedResources: [], community: false, currentScore: 0, isUnlocked: false },
  3: { exam: false, challenge: false, resourcesCompleted: false, resourcesPct: 0, viewedResources: [], community: false, currentScore: 0, isUnlocked: false },
  4: { exam: false, challenge: false, resourcesCompleted: false, resourcesPct: 0, viewedResources: [], community: false, currentScore: 0, isUnlocked: false },
  5: { exam: false, challenge: false, resourcesCompleted: false, resourcesPct: 0, viewedResources: [], community: false, currentScore: 0, isUnlocked: false },
};

export const LAST_MODULE_ID = 5;

/** @type {Record<number, number>} */
export const MODULE_RESOURCE_COUNTS = { 1: 8, 2: 8, 3: 8, 4: 8, 5: 8 };

/** @type {Record<string, number>} */
export const RESOURCE_MODULE_MAP = {
  'intro-video-1': 1, 'intro-ova-1': 1,
  'prompt-video-1': 1, 'prompt-guide-1': 1, 'prompt-ova-html-1': 1,
  'chatgpt-video-1': 1, 'chatgpt-guide-modulo2': 1, 'chatgpt-ova-ecosystem': 1,
  'workflow-pdf-modulo2': 1, 'workflow-ova-herramientas': 1,
  'gpts-guide-1': 1, 'gpts-ova-1': 1,
  'gemini-video-1': 2, 'gemini-guide-1': 2, 'gemini-ova-1': 2,
  'workspace-video-1': 2, 'workspace-template-1': 2, 'workspace-ova-1': 2,
  'gemini-cases-video-1': 2, 'gemini-cases-guide-1': 2, 'gemini-cases-ova-1': 2,
  'notebooklm-video-1': 3, 'notebooklm-guide-1': 3, 'notebooklm-ova-1': 3,
  'notebook-summary-video-1': 3, 'notebook-summary-template-1': 3, 'notebook-summary-ova-1': 3,
  'notebook-audio-video-1': 3, 'notebook-audio-guide-1': 3, 'notebook-audio-ova-1': 3,
  'bias-video-1': 4, 'bias-guide-1': 4, 'bias-ova-1': 4,
  'privacy-video-1': 4, 'privacy-guide-1': 4, 'privacy-ova-1': 4,
  'ethics-video-1': 4, 'ethics-ova-1': 4,
};

/** @type {Record<string, number>} */
export const XP_MAP = { exam: 100, challenge: 200, resourcesCompleted: 30, community: 15, lesson: 25 };
