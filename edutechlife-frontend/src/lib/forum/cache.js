import { supabase } from "../supabase";
import { TABLES, CACHE_TTL } from "./config";

const isDevelopment = process.env.NODE_ENV === "development";

const logger = {
  error: (message, error) => {
    if (isDevelopment) console.error(`[ForumService] ${message}:`, error);
  },
  warn: (message, data) => {
    if (isDevelopment) console.warn(`[ForumService] ${message}:`, data);
  },
  info: (message, data) => {
    if (isDevelopment) console.info(`[ForumService] ${message}:`, data);
  },
};

const userProfileCache = new Map();

const getCachedUserProfiles = async (userIds) => {
  if (!userIds || userIds.length === 0) return [];

  const now = Date.now();
  const uncachedIds = [];
  const cachedProfiles = [];

  userIds.forEach((id) => {
    const cached = userProfileCache.get(id);
    if (cached && now - cached.timestamp <= CACHE_TTL) {
      cachedProfiles.push(cached.profile);
    } else {
      uncachedIds.push(id);
    }
  });

  if (uncachedIds.length === 0) {
    return cachedProfiles;
  }

  try {
    const { data: profiles, error } = await supabase
      .from(TABLES.PROFILES)
      .select("id, display_name, avatar_url, role")
      .in("id", uncachedIds);

    if (error) {
      logger.error("Error obteniendo perfiles para caché", error);
      return userIds.map((id) => {
        const cached = userProfileCache.get(id);
        return cached ? cached.profile : null;
      });
    }

    profiles?.forEach((profile) => {
      userProfileCache.set(profile.id, {
        profile,
        timestamp: now,
      });
    });

    const profileMap = new Map();
    profiles?.forEach((profile) => {
      profileMap.set(profile.id, profile);
    });

    return userIds.map((id) => {
      const cached = userProfileCache.get(id);
      return cached ? cached.profile : profileMap.get(id) || null;
    });
  } catch (error) {
    logger.error("Error en getCachedUserProfiles", error);
    return userIds.map((id) => {
      const cached = userProfileCache.get(id);
      return cached ? cached.profile : null;
    });
  }
};

const clearProfileCache = () => {
  userProfileCache.clear();
  logger.info("Caché de perfiles limpiado");
};

export { userProfileCache, getCachedUserProfiles, clearProfileCache };
