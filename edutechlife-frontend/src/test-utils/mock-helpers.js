/**
 * Test Utilities and Mock Helpers
 *
 * Provides common mocking patterns for SmartBoard tests:
 * - Auth mocks
 * - Supabase mocks
 * - API call mocks
 * - Fixture data
 */

import { vi } from "vitest";

/**
 * Mock Clerk/Auth Identity
 */
export const mockAuthIdentity = (overrides = {}) => ({
  token: "test-jwt-token",
  isLoaded: true,
  isSignedIn: true,
  userId: "test-user-123",
  ...overrides,
});

/**
 * Mock Supabase Client
 */
export const createMockSupabase = () => ({
  auth: {
    getUser: vi.fn().mockResolvedValue({
      data: {
        user: {
          id: "test-user-123",
          email: "test@example.com",
        },
      },
      error: null,
    }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
  },
  from: vi.fn().mockReturnValue({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({
      data: { id: "1", user_id: "test-user-123" },
      error: null,
    }),
    insert: vi.fn().mockResolvedValue({
      data: { id: "1" },
      error: null,
    }),
    update: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockResolvedValue({
      data: { id: "1" },
      error: null,
    }),
  }),
  channel: vi.fn().mockReturnValue({
    on: vi.fn().mockReturnThis(),
    subscribe: vi.fn(),
  }),
});

/**
 * Mock Fetch Responses
 */
export const mockFetchResponse = (data, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => data,
  text: async () => JSON.stringify(data),
  clone: () => mockFetchResponse(data, status),
});

/**
 * Mock Consent Status Responses
 */
export const mockConsentStatus = (overrides = {}) => ({
  verification_status: "verified",
  student_age: 14,
  pending_email: null,
  verified_at: "2024-08-10T10:00:00Z",
  ...overrides,
});

export const mockConsentPending = (overrides = {}) => ({
  verification_status: "pending",
  student_age: 14,
  pending_email: "parent@example.com",
  pending_at: "2024-08-14T10:00:00Z",
  ...overrides,
});

export const mockConsentRequired = (overrides = {}) => ({
  verification_status: "required",
  student_age: 14,
  pending_email: null,
  ...overrides,
});

/**
 * Fixture: Student Profile
 */
export const studentProfileFixture = (overrides = {}) => ({
  id: "student-123",
  user_id: "test-user-123",
  age: 14,
  grade: 8,
  totalPoints: 450,
  totalActiveMinutes: 180,
  missions: [
    {
      id: "m1",
      name: "Complete Math Quiz",
      subject: "matematicas",
      completed: true,
      reward: 50,
      completedAt: "2024-08-10T10:00:00Z",
    },
  ],
  pointsHistory: [
    {
      id: "p1",
      points: 50,
      reason: "Quiz completed",
      category: "quiz",
      timestamp: "2024-08-14T10:00:00Z",
    },
  ],
  ...overrides,
});

/**
 * Fixture: Parental Consent Record
 */
export const consentRecordFixture = (overrides = {}) => ({
  id: "consent-456",
  student_id: "student-123",
  user_id: "test-user-123",
  parent_email: "parent@example.com",
  verification_status: "verified",
  verification_token: "token-abc123",
  verified_at: "2024-08-10T14:30:00Z",
  token_expiry: "2024-08-17T14:30:00Z",
  created_at: "2024-08-10T10:00:00Z",
  updated_at: "2024-08-10T14:30:00Z",
  ...overrides,
});

/**
 * Fixture: OralExam Question
 */
export const questionFixture = (overrides = {}) => ({
  id: "q1",
  subject: "matematicas",
  difficulty: "facil",
  text: "What is 2+2?",
  type: "multiple",
  options: ["3", "4", "5", "6"],
  correctAnswer: 1,
  explanation: "The sum of 2 and 2 is 4",
  category: "arithmetic",
  ...overrides,
});

export const openEndedQuestionFixture = (overrides = {}) => ({
  id: "q2",
  subject: "lenguaje",
  difficulty: "medio",
  text: 'Name a synonym for "happy"',
  type: "open",
  correctAnswer: "joyful",
  explanation: "Joyful is a synonym for happy",
  category: "vocabulary",
  ...overrides,
});

/**
 * Fixture: Quiz Session Results
 */
export const quizResultsFixture = (overrides = {}) => ({
  sessionId: "session-123",
  userId: "test-user-123",
  subject: "matematicas",
  difficulty: "facil",
  totalQuestions: 5,
  correct: 4,
  incorrect: 1,
  accuracy: 0.8,
  points: 80,
  duration: 300, // seconds
  completedAt: "2024-08-14T10:00:00Z",
  answers: [
    { questionId: "q1", userAnswer: 1, correct: true },
    { questionId: "q2", userAnswer: 2, correct: false },
  ],
  ...overrides,
});

/**
 * Fixture: Parent Dashboard Stats
 */
export const parentDashboardFixture = (overrides = {}) => ({
  parentId: "parent-123",
  parentEmail: "parent@example.com",
  children: [
    {
      childId: "student-123",
      childName: "Alice",
      age: 14,
      totalPoints: 450,
      recentActivity: "Quiz completed",
      lastActive: "2024-08-14T15:30:00Z",
    },
  ],
  stats: {
    totalChildrenPoints: 450,
    averageAccuracy: 0.85,
    totalSessionsCompleted: 12,
    avgSessionDuration: 600,
  },
  ...overrides,
});

/**
 * Setup helper: Configure all mocks for a SmartBoard test
 */
export const setupSmartBoardMocks = () => {
  const mockSupabase = createMockSupabase();
  const mockAuth = mockAuthIdentity();
  const mockFetch = vi.fn();

  global.fetch = mockFetch;

  return {
    mockSupabase,
    mockAuth,
    mockFetch,
    // Convenience method to setup common fetch responses
    mockFetchSuccess: (data) => {
      mockFetch.mockResolvedValue(mockFetchResponse(data));
    },
    mockFetchError: (error, status = 500) => {
      mockFetch.mockResolvedValue(mockFetchResponse(error, status));
    },
    mockFetchNetworkError: () => {
      mockFetch.mockRejectedValue(new Error("Network error"));
    },
  };
};

/**
 * Wait for async operations in tests
 */
export const waitForAsync = (ms = 0) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock timer helpers for countdown tests
 */
export const setupFakeTimers = () => {
  const timers = vi.useFakeTimers();
  return {
    advance: (ms) => timers.advanceTimersByTime(ms),
    runAll: () => timers.runAllTimers(),
    restore: () => vi.useRealTimers(),
  };
};

/**
 * Create render wrapper with necessary providers
 */
export const createTestWrapper = (mocks = {}) => {
  const defaultMocks = setupSmartBoardMocks();

  return {
    ...defaultMocks,
    ...mocks,
  };
};
