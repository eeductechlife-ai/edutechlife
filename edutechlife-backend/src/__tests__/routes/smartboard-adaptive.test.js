const express = require('express');
const request = require('supertest');

const authPath = require.resolve('../../middleware/auth');
const supabasePath = require.resolve('../../db/supabase');
const consentPath = require.resolve('../../middleware/parentalConsent');
const adaptivePath = require.resolve('../../services/adaptiveLearning');
const masteryPath = require.resolve('../../services/competencyMastery');
const parentInsightsPath = require.resolve('../../services/parentInsights');
const earlyWarningPath = require.resolve('../../services/earlyWarning');
const missionPath = require.resolve('../../services/missionEngine');
const badgePath = require.resolve('../../services/badgeEngine');

delete require.cache[authPath];
require.cache[authPath] = {
  id: authPath, filename: authPath, loaded: true,
  exports: {
    requireAuth: (req, _res, next) => {
      req.userId = req.headers['x-test-user-id'] || 'test-user-id';
      next();
    },
  },
};

delete require.cache[consentPath];
require.cache[consentPath] = {
  id: consentPath, filename: consentPath, loaded: true,
  exports: { requireVerifiedParentalConsent: (_req, _res, next) => next() },
};

const mockSupabase = { from: vi.fn() };
delete require.cache[supabasePath];
require.cache[supabasePath] = {
  id: supabasePath, filename: supabasePath, loaded: true,
  exports: mockSupabase,
};

const mockGetStudentState = vi.fn();
const mockGenerateRecs = vi.fn();
const mockRecommendContent = vi.fn();
const mockGetNextAction = vi.fn();
const mockDailyPlan = vi.fn();
const mockWeeklyPlan = vi.fn();
const mockSavePlan = vi.fn();

delete require.cache[adaptivePath];
require.cache[adaptivePath] = {
  id: adaptivePath, filename: adaptivePath, loaded: true,
  exports: {
    getStudentState: mockGetStudentState,
    generateRecommendations: mockGenerateRecs,
    recommendContent: mockRecommendContent,
    getNextBestAction: mockGetNextAction,
    generateDailyPlan: mockDailyPlan,
    generateWeeklyPlan: mockWeeklyPlan,
    saveLearningPlan: mockSavePlan,
  },
};

const mockGetMastery = vi.fn();
const mockUpdateMastery = vi.fn();
const mockBatchUpdate = vi.fn();
const mockGetCompetencyIds = vi.fn();

delete require.cache[masteryPath];
require.cache[masteryPath] = {
  id: masteryPath, filename: masteryPath, loaded: true,
  exports: {
    getStudentMastery: mockGetMastery,
    updateCompetencyMastery: mockUpdateMastery,
    batchUpdateMastery: mockBatchUpdate,
    getCompetencyIdsForSubject: mockGetCompetencyIds,
  },
};

const mockGenerateInsights = vi.fn();
const mockBuildGraph = vi.fn();

delete require.cache[parentInsightsPath];
require.cache[parentInsightsPath] = {
  id: parentInsightsPath, filename: parentInsightsPath, loaded: true,
  exports: {
    generateParentInsights: mockGenerateInsights,
    buildLearningGraphSummary: mockBuildGraph,
  },
};

const mockRunDetectors = vi.fn();
const mockResolveWarning = vi.fn();

delete require.cache[earlyWarningPath];
require.cache[earlyWarningPath] = {
  id: earlyWarningPath, filename: earlyWarningPath, loaded: true,
  exports: {
    runAllDetectors: mockRunDetectors,
    resolveWarning: mockResolveWarning,
  },
};

const mockGetMissions = vi.fn();
const mockRecordActivity = vi.fn();

delete require.cache[missionPath];
require.cache[missionPath] = {
  id: missionPath, filename: missionPath, loaded: true,
  exports: {
    getStudentMissions: mockGetMissions,
    recordActivity: mockRecordActivity,
  },
};

const mockCheckBadges = vi.fn();
const mockGetBadges = vi.fn();

delete require.cache[badgePath];
require.cache[badgePath] = {
  id: badgePath, filename: badgePath, loaded: true,
  exports: {
    checkAndUnlockBadges: mockCheckBadges,
    getStudentBadges: mockGetBadges,
  },
};

function studentMock() {
  return {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({
      data: { id: 'student-1', auth_id: 'test-user-id' },
      error: null,
    }),
  };
}

function createApp() {
  const app = express();
  app.use(express.json({ limit: '8mb' }));
  const routes = require('../../routes/smartboard');
  app.use('/api/smartboard', routes);
  return app;
}

let app;
beforeAll(() => { app = createApp(); });
beforeEach(() => {
  vi.clearAllMocks();
  mockSupabase.from.mockImplementation((table) => {
    if (table === 'students') return studentMock();
    return {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    };
  });
});

// ── Adaptive State ──────────────────────────────────────────────────────────

describe('GET /adaptive/state', () => {
  it('returns 400 when studentId missing', async () => {
    const res = await request(app)
      .get('/api/smartboard/adaptive/state')
      .set('Authorization', 'Bearer t')
      .set('x-test-user-id', 'test-user-id');
    expect(res.status).toBe(400);
  });

  it('returns state for valid student', async () => {
    mockGetStudentState.mockResolvedValue({ mastery: [], streaks: { current: 3 } });
    const res = await request(app)
      .get('/api/smartboard/adaptive/state?studentId=student-1')
      .set('Authorization', 'Bearer t')
      .set('x-test-user-id', 'test-user-id');
    expect(res.status).toBe(200);
    expect(res.body.state).toHaveProperty('mastery');
  });
});

// ── Adaptive Next Action ────────────────────────────────────────────────────

describe('GET /adaptive/next-action', () => {
  it('returns action and recommendations', async () => {
    mockGetStudentState.mockResolvedValue({ mastery: [] });
    mockGetNextAction.mockReturnValue({ type: 'review', subject: 'math' });
    mockGenerateRecs.mockReturnValue([{ id: 'r1', reason: 'low mastery' }]);

    const res = await request(app)
      .get('/api/smartboard/adaptive/next-action?studentId=student-1')
      .set('Authorization', 'Bearer t')
      .set('x-test-user-id', 'test-user-id');

    expect(res.status).toBe(200);
    expect(res.body.action.type).toBe('review');
    expect(res.body.recommendations).toHaveLength(1);
  });
});

// ── Daily Plan ──────────────────────────────────────────────────────────────

describe('POST /adaptive/daily-plan', () => {
  it('generates plan with default minutes', async () => {
    mockGetStudentState.mockResolvedValue({ mastery: [] });
    mockDailyPlan.mockReturnValue({ activities: [{ subject: 'math', minutes: 20 }] });
    mockSavePlan.mockResolvedValue();

    const res = await request(app)
      .post('/api/smartboard/adaptive/daily-plan')
      .set('Authorization', 'Bearer t')
      .set('x-test-user-id', 'test-user-id')
      .send({ studentId: 'student-1' });

    expect(res.status).toBe(200);
    expect(res.body.plan.activities).toHaveLength(1);
  });

  it('clamps minutes to 5-60 range', async () => {
    mockGetStudentState.mockResolvedValue({ mastery: [] });
    mockDailyPlan.mockReturnValue({ activities: [] });
    mockSavePlan.mockResolvedValue();

    await request(app)
      .post('/api/smartboard/adaptive/daily-plan')
      .set('Authorization', 'Bearer t')
      .set('x-test-user-id', 'test-user-id')
      .send({ studentId: 'student-1', availableMinutes: 999 });

    expect(mockDailyPlan).toHaveBeenCalledWith(expect.anything(), 60);
  });
});

// ── Weekly Plan ─────────────────────────────────────────────────────────────

describe('POST /adaptive/weekly-plan', () => {
  it('generates weekly plan', async () => {
    mockGetStudentState.mockResolvedValue({ mastery: [] });
    mockWeeklyPlan.mockReturnValue({ days: ['Mon', 'Tue'] });
    mockSavePlan.mockResolvedValue();

    const res = await request(app)
      .post('/api/smartboard/adaptive/weekly-plan')
      .set('Authorization', 'Bearer t')
      .set('x-test-user-id', 'test-user-id')
      .send({ studentId: 'student-1' });

    expect(res.status).toBe(200);
    expect(res.body.plan).toHaveProperty('days');
  });
});

// ── Recommendations ─────────────────────────────────────────────────────────

describe('POST /adaptive/recommendations', () => {
  it('generates and returns recommendations', async () => {
    mockGetStudentState.mockResolvedValue({ mastery: [] });
    mockRecommendContent.mockResolvedValue({
      recommendations: [{ contentId: 'c1', reason: 'gap' }],
      persisted: 1,
    });

    const res = await request(app)
      .post('/api/smartboard/adaptive/recommendations')
      .set('Authorization', 'Bearer t')
      .set('x-test-user-id', 'test-user-id')
      .send({ studentId: 'student-1' });

    expect(res.status).toBe(200);
    expect(res.body.recommendations).toHaveLength(1);
    expect(res.body.persisted).toBe(1);
  });
});

// ── Mastery ─────────────────────────────────────────────────────────────────

describe('GET /adaptive/mastery', () => {
  it('returns mastery records', async () => {
    mockGetMastery.mockResolvedValue([
      { competency_id: 'c1', mastery_level: 0.8 },
    ]);

    const res = await request(app)
      .get('/api/smartboard/adaptive/mastery?studentId=student-1')
      .set('Authorization', 'Bearer t')
      .set('x-test-user-id', 'test-user-id');

    expect(res.status).toBe(200);
    expect(res.body.mastery).toHaveLength(1);
  });
});

// ── Parent Insights ─────────────────────────────────────────────────────────

describe('GET /parent/insights', () => {
  it('returns 400 without studentId', async () => {
    const res = await request(app)
      .get('/api/smartboard/parent/insights')
      .set('Authorization', 'Bearer t')
      .set('x-test-user-id', 'test-user-id');
    expect(res.status).toBe(400);
  });

  it('returns insights for student', async () => {
    mockGenerateInsights.mockResolvedValue([
      { type: 'progress', message: 'Great week!' },
    ]);

    const res = await request(app)
      .get('/api/smartboard/parent/insights?studentId=student-1')
      .set('Authorization', 'Bearer t')
      .set('x-test-user-id', 'test-user-id');

    expect(res.status).toBe(200);
    expect(res.body.insights).toHaveLength(1);
  });
});

describe('GET /parent/learning-graph', () => {
  it('returns learning graph summary', async () => {
    mockBuildGraph.mockResolvedValue({
      subjects: [{ name: 'math', mastery: 0.7 }],
    });

    const res = await request(app)
      .get('/api/smartboard/parent/learning-graph?studentId=student-1')
      .set('Authorization', 'Bearer t')
      .set('x-test-user-id', 'test-user-id');

    expect(res.status).toBe(200);
    expect(res.body.summary.subjects).toHaveLength(1);
  });
});

// ── Early Warning ───────────────────────────────────────────────────────────

describe('GET /adaptive/warnings', () => {
  it('runs detectors and returns warnings', async () => {
    mockRunDetectors.mockResolvedValue([
      { type: 'inactivity', severity: 'medium' },
    ]);

    const res = await request(app)
      .get('/api/smartboard/adaptive/warnings?studentId=student-1')
      .set('Authorization', 'Bearer t')
      .set('x-test-user-id', 'test-user-id');

    expect(res.status).toBe(200);
    expect(res.body.warnings).toHaveLength(1);
  });
});

describe('POST /adaptive/warnings/:id/resolve', () => {
  it('resolves a warning owned by the user', async () => {
    mockSupabase.from.mockImplementation((table) => {
      if (table === 'early_warnings') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({
            data: { student_id: 'student-1' },
            error: null,
          }),
        };
      }
      if (table === 'students') return studentMock();
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      };
    });
    mockResolveWarning.mockResolvedValue();

    const res = await request(app)
      .post('/api/smartboard/adaptive/warnings/w1/resolve')
      .set('Authorization', 'Bearer t')
      .set('x-test-user-id', 'test-user-id');

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('returns 404 when warning not found', async () => {
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    });

    const res = await request(app)
      .post('/api/smartboard/adaptive/warnings/bad/resolve')
      .set('Authorization', 'Bearer t')
      .set('x-test-user-id', 'test-user-id');

    expect(res.status).toBe(404);
  });
});

// ── Gamification ────────────────────────────────────────────────────────────

describe('GET /gamification/missions', () => {
  it('returns missions for student', async () => {
    mockGetMissions.mockResolvedValue([
      { id: 'm1', title: 'First Steps', completed: false },
    ]);

    const res = await request(app)
      .get('/api/smartboard/gamification/missions?studentId=student-1')
      .set('Authorization', 'Bearer t')
      .set('x-test-user-id', 'test-user-id');

    expect(res.status).toBe(200);
    expect(res.body.missions).toHaveLength(1);
  });
});

describe('GET /gamification/badges', () => {
  it('returns badges for student', async () => {
    mockGetBadges.mockResolvedValue([
      { id: 'b1', name: 'Explorer', unlocked: true },
    ]);

    const res = await request(app)
      .get('/api/smartboard/gamification/badges?studentId=student-1')
      .set('Authorization', 'Bearer t')
      .set('x-test-user-id', 'test-user-id');

    expect(res.status).toBe(200);
    expect(res.body.badges).toHaveLength(1);
  });
});
