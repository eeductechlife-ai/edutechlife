import { coreFactory } from "./core";
import { videoProgressFactory } from "./videoProgress";
import { activityProgressFactory } from "./activityProgress";
import { examProgressFactory } from "./examProgress";
import { scoringFactory } from "./scoring";
import { resourcesFactory } from "./resources";
import { challengeFactory } from "./challenge";

export function createProgressService(db) {
  if (!db) {
    console.error("[PROGRESS] No se proporcion\u00f3 cliente Supabase");
    throw new Error("Supabase client is required");
  }

  return {
    ...coreFactory(db),
    ...videoProgressFactory(db),
    ...activityProgressFactory(db),
    ...examProgressFactory(db),
    ...scoringFactory(db),
    ...resourcesFactory(db),
    ...challengeFactory(db),
  };
}

export {
  setSupabaseClient,
  getService,
  saveProgress,
  getFullUserProgress,
} from "./legacy";
export {
  PROGRESS_STATUS,
  MODULE_TYPES,
  countModuleResources,
  SCORING,
} from "./constants";
