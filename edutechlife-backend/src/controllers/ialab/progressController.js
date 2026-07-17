const supabase = require('../../db/supabase');

const progressStore = new Map();

function isSupabaseReady() {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY);
}

async function saveProgress(req, res) {
  const { userId, moduleId, completed, score, timestamp } = req.body;

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'userId is required and must be a string' });
  }
  if (!moduleId || typeof moduleId !== 'number' || moduleId < 1 || moduleId > 5) {
    return res.status(400).json({ error: 'moduleId must be a number between 1 and 5' });
  }

  try {
    if (isSupabaseReady()) {
      const upsertData = {
        user_id: userId,
        module_id: moduleId,
        is_completed: completed || false,
        score: score || 0,
        updated_at: new Date().toISOString()
      };

      const { data: existing, error: findError } = await supabase
        .from('user_progress')
        .select('id')
        .eq('user_id', userId)
        .eq('module_id', moduleId)
        .maybeSingle();

      let dbError;
      if (existing) {
        const { error } = await supabase.from('user_progress').update(upsertData).eq('id', existing.id);
        dbError = error;
      } else {
        upsertData.created_at = new Date().toISOString();
        const { error } = await supabase.from('user_progress').insert(upsertData);
        dbError = error;
      }

      if (findError || dbError) {
        console.error('[IALab Progress] Supabase error:', findError || dbError);
        throw findError || dbError;
      }

      const { data: allProgress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId);

      const moduleEntries = allProgress || [];
      const completedModules = moduleEntries.filter(m => m.is_completed).length;
      const overallProgress = Math.round((completedModules / 5) * 100);
      const totalScore = moduleEntries.reduce((sum, m) => sum + (m.score || 0), 0);

      const achievements = [];
      if (completed) achievements.push('module_' + moduleId + '_complete');
      if (score >= 4) achievements.push('module_' + moduleId + '_excellent');
      if (completedModules === 5) achievements.push('course_complete');

      console.log('[IALab Progress] Saved to Supabase for user: ' + userId + ', module: ' + moduleId);
      return res.json({
        success: true,
        progress: {
          userId, modules: moduleEntries,
          overallProgress, totalScore,
          completedModules, achievements,
          lastUpdated: new Date().toISOString()
        },
        message: 'Progress saved successfully'
      });
    }

    let userProgress = progressStore.get(userId) || {
      userId,
      modules: {},
      overallProgress: 0,
      totalScore: 0,
      completedModules: 0,
      lastUpdated: new Date().toISOString(),
      achievements: []
    };

    userProgress.modules[moduleId] = {
      moduleId,
      completed: completed || false,
      score: score || 0,
      timestamp: timestamp || new Date().toISOString()
    };

    const moduleEntries = Object.values(userProgress.modules);
    userProgress.completedModules = moduleEntries.filter(m => m.completed).length;
    userProgress.overallProgress = Math.round((userProgress.completedModules / 5) * 100);
    userProgress.totalScore = moduleEntries.reduce((sum, m) => sum + (m.score || 0), 0);
    userProgress.lastUpdated = new Date().toISOString();

    if (completed && !userProgress.achievements.includes('module_' + moduleId + '_complete')) {
      userProgress.achievements.push('module_' + moduleId + '_complete');
    }
    if (score >= 4 && !userProgress.achievements.includes('module_' + moduleId + '_excellent')) {
      userProgress.achievements.push('module_' + moduleId + '_excellent');
    }
    if (userProgress.completedModules === 5 && !userProgress.achievements.includes('course_complete')) {
      userProgress.achievements.push('course_complete');
    }

    progressStore.set(userId, userProgress);
    console.log('[IALab Progress] Saved in-memory for user: ' + userId + ', module: ' + moduleId);

    res.json({ success: true, progress: userProgress, message: 'Progress saved successfully' });
  } catch (e) {
    console.error('Error saving IALab progress:', e);
    res.status(500).json({ error: e.message });
  }
}

async function getProgress(req, res) {
  const { userId } = req.params;
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  try {
    if (isSupabaseReady()) {
      const { data: allProgress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId);

      if (!allProgress || allProgress.length === 0) {
        return res.json({
          userId, modules: {}, overallProgress: 0, totalScore: 0,
          completedModules: 0, lastUpdated: null, achievements: [],
          message: 'No progress found for this user'
        });
      }

      const moduleEntries = allProgress.map(m => ({
        moduleId: m.module_id,
        completed: m.is_completed,
        score: m.score,
        timestamp: m.created_at
      }));
      const completedCount = allProgress.filter(m => m.is_completed).length;

      return res.json({
        userId,
        modules: moduleEntries,
        overallProgress: Math.round((completedCount / 5) * 100),
        totalScore: allProgress.reduce((sum, m) => sum + (m.score || 0), 0),
        completedModules: completedCount,
        lastUpdated: new Date().toISOString(),
        achievements: []
      });
    }

    const userProgress = progressStore.get(userId);
    if (!userProgress) {
      return res.json({
        userId, modules: {}, overallProgress: 0, totalScore: 0,
        completedModules: 0, lastUpdated: null, achievements: [],
        message: 'No progress found for this user'
      });
    }
    res.json(userProgress);
  } catch (e) {
    console.error('Error retrieving IALab progress:', e);
    res.status(500).json({ error: e.message });
  }
}

module.exports = { saveProgress, getProgress };
