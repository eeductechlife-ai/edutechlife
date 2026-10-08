const TABLE_NAME = "smartboard_kids_data";

const SYNC_QUEUE_KEY = "ingenia_sync_queue";
// Nombre anterior de la cola (cuando el producto se llamaba SmartBoard). Puede
// haber operaciones sin sincronizar guardadas con él: se leen y se pasan a la
// clave nueva para no perder datos del estudiante.
const LEGACY_SYNC_QUEUE_KEY = "smartboard_sync_queue";

const readSyncQueue = () => {
  const queue = JSON.parse(localStorage.getItem(SYNC_QUEUE_KEY) || "[]");
  let legacy = [];
  try {
    legacy = JSON.parse(localStorage.getItem(LEGACY_SYNC_QUEUE_KEY) || "[]");
  } catch {
    legacy = [];
  }
  return Array.isArray(legacy) && legacy.length ? [...legacy, ...queue] : queue;
};

const writeSyncQueue = (queue) => {
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
  localStorage.removeItem(LEGACY_SYNC_QUEUE_KEY);
};

const clearSyncQueue = () => {
  localStorage.removeItem(SYNC_QUEUE_KEY);
  localStorage.removeItem(LEGACY_SYNC_QUEUE_KEY);
};

const getDefaultData = () => ({
  daniChatHistory: [],
  studentMoodHistory: [],
  academicTopics: [],
  conversationCount: 0,
  studentAge: null,
  vakResult: null,
  totalPoints: 0,
  pointsHistory: [],
  unlockedRewards: [],
  totalActiveMinutes: 0,
  sessions: [],
  streak: { current: 0, longest: 0, lastActive: null },
  streakLog: [],
  subjectTime: {},
  calendarEvents: [],
  newsItems: [],
  readNews: [],
  missions: [],
  subjects: [],
  uploadedActivities: [],
  analyzedActivities: [],
  darkMode: false,
  avatarAnimado: false,
  fondoGalaxia: false,
});

export const loadFromSupabase = async (supabase, userId) => {
  if (!supabase || !userId) {
    return {
      success: false,
      error: "Cliente Supabase o userId no disponible",
      data: null,
    };
  }

  if (!navigator.onLine) {
    return { success: false, error: "offline", offline: true, data: null };
  }

  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("data")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return { success: true, data: getDefaultData() };
    }

    return { success: true, data: { ...getDefaultData(), ...data.data } };
  } catch (error) {
    console.error("Error cargando datos IngenIA:", error.message);
    return { success: false, error: error.message, data: null };
  }
};

export const saveToSupabase = async (supabase, userId, kidsData) => {
  if (!supabase || !userId) {
    return { success: false, error: "Cliente Supabase o userId no disponible" };
  }

  if (!navigator.onLine) {
    queueSyncOperation({ type: "full_sync", data: kidsData });
    return { success: false, error: "offline", offline: true };
  }

  try {
    const payload = {
      user_id: userId,
      platform: "smartboard",
      data: kidsData,
    };

    // public.smartboard_kids_data es una vista sobre smartboard.smartboard_kids_data
    // (migración 095) — PostgREST no puede resolver el ON CONFLICT de un upsert
    // a través de una vista, porque la PK vive en la tabla base, no en la vista.
    // Por eso se hace explícito. Lo normal es que la fila YA exista, así que se
    // actualiza directamente y solo se inserta si no cambió ninguna fila. Antes
    // cada guardado hacía SELECT + UPDATE y además pedía de vuelta la fila entera
    // (todo el JSON otra vez): dos viajes al servidor y un cuerpo grande por
    // cada acción del estudiante.
    const updated = await supabase
      .from(TABLE_NAME)
      .update(payload)
      .eq("user_id", userId)
      .select("user_id");

    let data = null;
    let error = updated.error;
    if (!error) {
      if (Array.isArray(updated.data) && updated.data.length > 0) {
        data = updated.data[0];
      } else {
        const inserted = await supabase
          .from(TABLE_NAME)
          .insert(payload)
          .select("user_id")
          .maybeSingle();
        data = inserted.data;
        error = inserted.error;
      }
    }

    if (error) {
      if (
        error.status === 401 ||
        error.message.includes("JWT") ||
        error.message.includes("key")
      ) {
        queueSyncOperation({ type: "full_sync", data: kidsData });
        return { success: false, error: error.message, offline: true };
      }
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error guardando datos IngenIA:", error.message);
    queueSyncOperation({ type: "full_sync", data: kidsData });
    return { success: false, error: error.message };
  }
};

export const queueSyncOperation = (operation) => {
  try {
    const queue = readSyncQueue();
    queue.push({ ...operation, queuedAt: new Date().toISOString() });
    writeSyncQueue(queue);
  } catch (error) {
    console.error("Error encolando operación IngenIA:", error);
  }
};

export const processSyncQueue = async (supabase, userId, currentData) => {
  if (!navigator.onLine) {
    return { success: false, error: "Sin conexión" };
  }

  try {
    const queue = readSyncQueue();
    if (queue.length === 0) return { success: true, processed: 0 };

    const result = await saveToSupabase(supabase, userId, currentData);

    if (result.success) {
      clearSyncQueue();
    }

    return {
      success: result.success,
      processed: result.success ? queue.length : 0,
    };
  } catch (error) {
    console.error("Error procesando cola IngenIA:", error);
    return { success: false, error: error.message };
  }
};

export const mergeWithLocal = (localData, remoteData) => {
  if (!remoteData) return localData;
  if (!localData) return remoteData;

  const merged = { ...remoteData };

  Object.keys(localData).forEach((key) => {
    const localVal = localData[key];
    const remoteVal = remoteData[key];

    if (localVal === null || localVal === undefined) return;
    if (remoteVal === null || remoteVal === undefined) {
      merged[key] = localVal;
      return;
    }

    if (Array.isArray(localVal) && Array.isArray(remoteVal)) {
      // Deduplicate merge: remote (source of truth) primero; local solo aporta
      // ítems nuevos. Historial capado a 100 (FIFO) para no crecer sin límite.
      const mergedArr = [...remoteVal];
      for (const item of localVal) {
        const key_ =
          item?.id ?? item?.timestamp ?? item?.date ?? JSON.stringify(item);
        const exists = mergedArr.some((existing) => {
          const existingKey =
            existing?.id ??
            existing?.timestamp ??
            existing?.date ??
            JSON.stringify(existing);
          return existingKey === key_;
        });
        if (!exists) mergedArr.push(item);
      }
      merged[key] = mergedArr.slice(0, 100);
    } else if (typeof localVal === "object" && typeof remoteVal === "object") {
      merged[key] = { ...remoteVal, ...localVal };
    } else if (typeof localVal === "number" && typeof remoteVal === "number") {
      merged[key] = Math.max(localVal, remoteVal);
    }
  });

  return merged;
};

export const setupConnectionListener = (supabase, userId, getCurrentData) => {
  const handleOnline = async () => {
    const currentData =
      typeof getCurrentData === "function" ? getCurrentData() : null;
    if (currentData) {
      await processSyncQueue(supabase, userId, currentData);
    }
  };

  window.addEventListener("online", handleOnline);

  return () => {
    window.removeEventListener("online", handleOnline);
  };
};
