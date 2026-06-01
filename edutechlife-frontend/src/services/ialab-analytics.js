const STORAGE_KEY = 'edutechlife_ialab_analytics';

const load = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      return {
        sessions: data.sessions || 0,
        firstVisit: data.firstVisit || null,
        lastVisit: data.lastVisit || null,
        moduleViews: data.moduleViews || {},
        examAttempts: data.examAttempts || 0,
        examPasses: data.examPasses || 0,
        challengeAttempts: data.challengeAttempts || 0,
        challengePasses: data.challengePasses || 0,
        resourceViews: data.resourceViews || 0,
        forumPosts: data.forumPosts || 0,
        forumComments: data.forumComments || 0,
        completions: data.completions || [],
        streakHistory: data.streakHistory || [],
        averageScore: data.averageScore || 0,
        scoreCount: data.scoreCount || 0,
        totalScore: data.totalScore || 0,
        lastUpdated: data.lastUpdated || null,
      };
    }
  } catch (e) {
  }
  return getDefaultMetrics();
};

const getDefaultMetrics = () => ({
  sessions: 0,
  firstVisit: null,
  lastVisit: null,
  moduleViews: {},
  examAttempts: 0,
  examPasses: 0,
  challengeAttempts: 0,
  challengePasses: 0,
  resourceViews: 0,
  forumPosts: 0,
  forumComments: 0,
  completions: [],
  streakHistory: [],
  averageScore: 0,
  scoreCount: 0,
  totalScore: 0,
  lastUpdated: null,
});

const save = (metrics) => {
  metrics.lastUpdated = new Date().toISOString();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(metrics));
  } catch (e) {
  }
};

let metrics = load();

export const ialabAnalytics = {
  recordSession() {
    metrics.sessions++;
    if (!metrics.firstVisit) metrics.firstVisit = new Date().toISOString();
    metrics.lastVisit = new Date().toISOString();
    save(metrics);
  },

  recordModuleView(moduleId) {
    if (!metrics.moduleViews[moduleId]) {
      metrics.moduleViews[moduleId] = { views: 0, lastView: null };
    }
    metrics.moduleViews[moduleId].views++;
    metrics.moduleViews[moduleId].lastView = new Date().toISOString();
    save(metrics);
  },

  recordExamAttempt(passed, score) {
    metrics.examAttempts++;
    if (passed) metrics.examPasses++;
    if (typeof score === 'number') {
      metrics.totalScore += score;
      metrics.scoreCount++;
      metrics.averageScore = metrics.totalScore / metrics.scoreCount;
    }
    save(metrics);
  },

  recordChallengeAttempt(passed) {
    metrics.challengeAttempts++;
    if (passed) metrics.challengePasses++;
    save(metrics);
  },

  recordResourceView() {
    metrics.resourceViews++;
    save(metrics);
  },

  recordForumPost() {
    metrics.forumPosts++;
    save(metrics);
  },

  recordForumComment() {
    metrics.forumComments++;
    save(metrics);
  },

  recordCompletion(moduleId, score) {
    metrics.completions.push({
      moduleId,
      score,
      date: new Date().toISOString(),
    });
    save(metrics);
  },

  recordStreakDay(date) {
    const dayStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
    if (!metrics.streakHistory.includes(dayStr)) {
      metrics.streakHistory.push(dayStr);
      save(metrics);
    }
  },

  getMetrics() {
    return { ...metrics };
  },

  getReport() {
    const m = metrics;
    const completionRate = m.examAttempts > 0
      ? Math.round((m.examPasses / m.examAttempts) * 100) : 0;
    const challengeRate = m.challengeAttempts > 0
      ? Math.round((m.challengePasses / m.challengeAttempts) * 100) : 0;
    const modulesCompleted = m.completions.length;

    return {
      sessions: m.sessions,
      modulesViewed: Object.keys(m.moduleViews).length,
      modulesCompleted,
      progress: modulesCompleted >= 5 ? 100 : Math.round((modulesCompleted / 5) * 100),
      examCompletionRate: completionRate,
      challengeCompletionRate: challengeRate,
      averageScore: Math.round(m.averageScore),
      resourcesViewed: m.resourceViews,
      forumActivity: m.forumPosts + m.forumComments,
      streakDays: m.streakHistory.length,
      firstVisit: m.firstVisit,
      lastVisit: m.lastVisit,
    };
  },

  reset() {
    metrics = getDefaultMetrics();
    save(metrics);
  },
};
