const TABLE_NAME = 'smartboard_kids_data';

const SYNC_QUEUE_KEY = 'smartboard_sync_queue';

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
    return { success: false, error: 'Cliente Supabase o userId no disponible', data: null };
  }

  if (!navigator.onLine) {
    return { success: false, error: 'offline', offline: true, data: null };
  }

  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('data')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return { success: true, data: getDefaultData() };
    }

    return { success: true, data: { ...getDefaultData(), ...data.data } };
  } catch (error) {
    console.error('Error cargando datos SmartBoard:', error.message);
    return { success: false, error: error.message, data: null };
  }
};

export const saveToSupabase = async (supabase, userId, kidsData) => {
  if (!supabase || !userId) {
    return { success: false, error: 'Cliente Supabase o userId no disponible' };
  }

  if (!navigator.onLine) {
    queueSyncOperation({ type: 'full_sync', data: kidsData });
    return { success: false, error: 'offline', offline: true };
  }

  try {
    const payload = {
      user_id: userId,
      platform: 'smartboard',
      data: kidsData,
    };

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .upsert(payload, { onConflict: 'user_id' })
      .select()
      .maybeSingle();

    if (error) {
      if (error.status === 401 || error.message.includes('JWT') || error.message.includes('key')) {
        queueSyncOperation({ type: 'full_sync', data: kidsData });
        return { success: false, error: error.message, offline: true };
      }
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error guardando datos SmartBoard:', error.message);
    queueSyncOperation({ type: 'full_sync', data: kidsData });
    return { success: false, error: error.message };
  }
};

export const queueSyncOperation = (operation) => {
  try {
    const queue = JSON.parse(localStorage.getItem(SYNC_QUEUE_KEY) || '[]');
    queue.push({ ...operation, queuedAt: new Date().toISOString() });
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error('Error encolando operación SmartBoard:', error);
  }
};

export const processSyncQueue = async (supabase, userId, currentData) => {
  if (!navigator.onLine) {
    return { success: false, error: 'Sin conexión' };
  }

  try {
    const queue = JSON.parse(localStorage.getItem(SYNC_QUEUE_KEY) || '[]');
    if (queue.length === 0) return { success: true, processed: 0 };

    const result = await saveToSupabase(supabase, userId, currentData);

    if (result.success) {
      localStorage.removeItem(SYNC_QUEUE_KEY);
    }

    return { success: result.success, processed: result.success ? queue.length : 0 };
  } catch (error) {
    console.error('Error procesando cola SmartBoard:', error);
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
      merged[key] = localVal.length > remoteVal.length ? localVal : remoteVal;
    } else if (typeof localVal === 'object' && typeof remoteVal === 'object') {
      merged[key] = { ...remoteVal, ...localVal };
    } else if (typeof localVal === 'number' && typeof remoteVal === 'number') {
      merged[key] = Math.max(localVal, remoteVal);
    }
  });

  return merged;
};

export const setupConnectionListener = (supabase, userId, getCurrentData) => {
  const handleOnline = async () => {
    const currentData = typeof getCurrentData === 'function' ? getCurrentData() : null;
    if (currentData) {
      await processSyncQueue(supabase, userId, currentData);
    }
  };

  window.addEventListener('online', handleOnline);

  return () => {
    window.removeEventListener('online', handleOnline);
  };
};
