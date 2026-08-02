import { CONTENT_ES } from "../components/IALab/constants/moduleContent/contentEs.js";
import { CONTENT_EN } from "../components/IALab/constants/moduleContent/contentEn.js";
import { RESOURCES_ES } from "../components/IALab/constants/moduleResources/resourcesEs.js";
import { RESOURCES_EN } from "../components/IALab/constants/moduleResources/resourcesEn.js";

/** LocalStorage key constants */
export const LS_KEYS = {
  VIEWED_RESOURCES: "ialab_viewed_resources",
  COMPLETED_VIDEOS: "ialab_completed_videos",
  COMPLETED_MODULES: "ialab_completed_modules",
  COMPLETED_EXAMS: "ialab_completed_exams",
  COMPLETED_INFOGRAPHICS: "ialab_completed_infographics",
  COMPLETED_ACTIVITIES: "ialab_completed_activities",
  OVERALL_PROGRESS: "ialab_overall_progress",
  SYNC_QUEUE: "ialab_sync_queue",
  ACTIVITY_LOG: "ialab_activity_log",
  RESOURCE_STATUS: "ialab_resource_status",
  NOTIFICATIONS: "ialab_notifications",
  NOTIFIED_CERTIFICATION: "ialab_notified_certification",
  VALERIO_WELCOMED: "ialab_valerio_welcomed",
  SIDEBAR_STATE: "ialab-sidebar-state",
  PROGRESS_CACHE: "ialab_progress_cache",
  SECURITY_WARNINGS_RESET: "securityWarningsResetDate",
  SETTINGS: "edutechlife_settings",
  LESSON_PROGRESS: "ialab_lesson_progress",
  XP: "ialab_xp",
  STREAK: "ialab_streak",
  LAST_ACTIVITY_DATE: "ialab_last_activity_date",
  BADGES: "ialab_badges",
  BADGES_DATES: "ialab_badges_dates",
  CHECKPOINT_ANSWERS: "ialab_checkpoint_answers",
  FORUM_POST_COUNT: "ialab_forum_post_count",
  FORUM_COMMENT_COUNT: "ialab_forum_comment_count",
  BOOKMARKED_RESOURCES: "ialab_bookmarked_resources",
  START_DATE: "ialab_start_date",
  AVATAR: "ialab_avatar",
};

/** Scoring weights: exam 35% + challenge 30% + resources 30% + community 5% */
export const WEIGHTS = { exam: 35, challenge: 30, resources: 30, community: 5 };

/** @type {Record<number, { exam: boolean, challenge: boolean, resourcesCompleted: boolean, resourcesPct: number, viewedResources: string[], community: boolean, currentScore: number, isUnlocked: boolean }>} */
export const INITIAL_MODULE_PROGRESS = {
  1: {
    exam: false,
    challenge: false,
    resourcesCompleted: false,
    resourcesPct: 0,
    viewedResources: [],
    community: false,
    currentScore: 0,
    isUnlocked: true,
  },
  2: {
    exam: false,
    challenge: false,
    resourcesCompleted: false,
    resourcesPct: 0,
    viewedResources: [],
    community: false,
    currentScore: 0,
    isUnlocked: false,
  },
  3: {
    exam: false,
    challenge: false,
    resourcesCompleted: false,
    resourcesPct: 0,
    viewedResources: [],
    community: false,
    currentScore: 0,
    isUnlocked: false,
  },
  4: {
    exam: false,
    challenge: false,
    resourcesCompleted: false,
    resourcesPct: 0,
    viewedResources: [],
    community: false,
    currentScore: 0,
    isUnlocked: false,
  },
  5: {
    exam: false,
    challenge: false,
    resourcesCompleted: false,
    resourcesPct: 0,
    viewedResources: [],
    community: false,
    currentScore: 0,
    isUnlocked: false,
  },
};

export const LAST_MODULE_ID = 5;

/**
 * Recorre el catálogo de un idioma y devuelve, por módulo, los ids de sus
 * recursos. El catálogo está indexado por título de tema, así que la relación
 * tema → módulo se toma de `overviewData.topics`.
 *
 * @param {Record<number, any>} content
 * @param {Record<string, any>} resources
 * @returns {Record<number, string[]>}
 */
const collectResourceIdsByModule = (content, resources) => {
  /** @type {Record<number, string[]>} */
  const byModule = {};
  for (let moduleId = 1; moduleId <= LAST_MODULE_ID; moduleId++) {
    const topics = content?.[moduleId]?.overviewData?.topics || [];
    byModule[moduleId] = topics.flatMap((topic) =>
      (resources?.[topic.title]?.resources || []).map(
        (resource) => resource.id,
      ),
    );
  }
  return byModule;
};

const RESOURCE_IDS_ES = collectResourceIdsByModule(CONTENT_ES, RESOURCES_ES);
const RESOURCE_IDS_EN = collectResourceIdsByModule(CONTENT_EN, RESOURCES_EN);

/**
 * Cuántos recursos tiene realmente cada módulo. Se deriva del catálogo en vez
 * de fijarse a mano: estaba puesto en 8 para los cinco módulos cuando los
 * reales son 6/7/7/9/9, así que los módulos 1-3 nunca alcanzaban
 * `resourcesCompleted` y el curso quedaba imposible de completar.
 *
 * Se toma el español como inventario canónico. Un módulo con más recursos en
 * inglés simplemente se completa antes para ese idioma; nunca bloquea.
 *
 * @type {Record<number, number>}
 */
export const MODULE_RESOURCE_COUNTS = Object.fromEntries(
  Object.entries(RESOURCE_IDS_ES).map(([moduleId, ids]) => [
    Number(moduleId),
    ids.length,
  ]),
);

/**
 * A qué módulo pertenece cada recurso. Se deriva de ambos idiomas para que
 * ningún recurso quede sin mapear; la tabla escrita a mano tenía 31 de 38
 * entradas corridas un módulo (los recursos de ChatGPT apuntaban al módulo 1,
 * los de Gemini al 2...) y el módulo 5 no aparecía.
 *
 * @type {Record<string, number>}
 */
export const RESOURCE_MODULE_MAP = (() => {
  /** @type {Record<string, number>} */
  const map = {};
  for (const idsByModule of [RESOURCE_IDS_EN, RESOURCE_IDS_ES]) {
    for (const [moduleId, ids] of Object.entries(idsByModule)) {
      ids.forEach((id) => {
        map[id] = Number(moduleId);
      });
    }
  }
  return map;
})();

/** @type {Record<string, number>} */
export const XP_MAP = {
  exam: 100,
  challenge: 200,
  resourcesCompleted: 30,
  community: 15,
  lesson: 25,
};
