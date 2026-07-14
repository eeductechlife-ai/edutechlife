import { supabase as fallbackSupabase } from "../supabase";
import { coreFactory } from "./core";
import { videoProgressFactory } from "./videoProgress";
import { activityProgressFactory } from "./activityProgress";
import { examProgressFactory } from "./examProgress";
import { scoringFactory } from "./scoring";
import { resourcesFactory } from "./resources";
import { challengeFactory } from "./challenge";

const createFullService = (db) => ({
  ...coreFactory(db),
  ...videoProgressFactory(db),
  ...activityProgressFactory(db),
  ...examProgressFactory(db),
  ...scoringFactory(db),
  ...resourcesFactory(db),
  ...challengeFactory(db),
});

let _supabaseClient = null;

export const setSupabaseClient = (client) => {
  _supabaseClient = client;
};

export const getService = () => {
  const db = _supabaseClient || fallbackSupabase;
  return createFullService(db);
};

export const saveProgress = (...args) => getService().saveProgress(...args);
export const getFullUserProgress = (...args) =>
  getService().getFullUserProgress(...args);
