import { describe, it, expect, beforeEach } from "vitest";
import {
  calculateRank,
  calculateAverageScore,
  generateLeaderboard,
  detectAnomalies,
  isValidScore,
  calculateTrend,
} from "../multiplayerService";

describe("multiplayerService", () => {
  const mockStudents = [
    {
      id: "1",
      name: "Alice",
      totalPoints: 500,
      streak: { current: 10 },
      analyzedActivities: [{ score: 95 }, { score: 90 }],
    },
    {
      id: "2",
      name: "Bob",
      totalPoints: 400,
      streak: { current: 5 },
      analyzedActivities: [{ score: 85 }],
    },
    {
      id: "3",
      name: "Charlie",
      totalPoints: 300,
      streak: { current: 2 },
      analyzedActivities: [{ score: 75 }],
    },
  ];

  describe("calculateRank", () => {
    it("returns correct rank by points", () => {
      const student = mockStudents[0]; // Alice, 500 points
      const rank = calculateRank(student, mockStudents, "points");
      expect(rank.rank).toBe(1);
      expect(rank.total).toBe(3);
    });

    it("returns correct rank by streak", () => {
      const student = mockStudents[1]; // Bob, 5 streak
      const rank = calculateRank(student, mockStudents, "streak");
      expect(rank.rank).toBe(2);
    });

    it("calculates percentile correctly", () => {
      const student = mockStudents[2]; // Charlie, lowest points
      const rank = calculateRank(student, mockStudents, "points");
      expect(rank.percentile).toBeLessThan(50);
    });

    it("returns null rank when studentData is null", () => {
      const rank = calculateRank(null, mockStudents);
      expect(rank.rank).toBeNull();
      expect(rank.total).toBe(3);
    });

    it("returns null rank when allStudentsData is not an array", () => {
      const rank = calculateRank(mockStudents[0], "invalid");
      expect(rank.rank).toBeNull();
    });

    it("handles empty students array", () => {
      const rank = calculateRank(mockStudents[0], []);
      expect(rank.rank).toBeNull();
      expect(rank.total).toBe(0);
    });

    it("returns correct score in rank object", () => {
      const student = mockStudents[0];
      const rank = calculateRank(student, mockStudents, "points");
      expect(rank.score).toBe(500);
    });

    it("sorts by avgScore when requested", () => {
      const students = [
        { id: "1", avgScore: 80, analyzedActivities: [{ score: 80 }] },
        { id: "2", avgScore: 90, analyzedActivities: [{ score: 90 }] },
      ];
      const student = students[0];
      const rank = calculateRank(student, students, "avgScore");
      expect(rank.rank).toBe(2);
    });
  });

  describe("calculateAverageScore", () => {
    it("calculates average score from quizzes", () => {
      const student = { analyzedActivities: [{ score: 80 }, { score: 90 }] };
      expect(calculateAverageScore(student)).toBe(85);
    });

    it("returns 0 when no quizzes", () => {
      const student = { analyzedActivities: [] };
      expect(calculateAverageScore(student)).toBe(0);
    });

    it("handles missing analyzedActivities", () => {
      const student = {};
      expect(calculateAverageScore(student)).toBe(0);
    });

    it("rounds to nearest integer", () => {
      const student = { analyzedActivities: [{ score: 85 }, { score: 87 }] };
      expect(calculateAverageScore(student)).toBe(86);
    });
  });

  describe("generateLeaderboard", () => {
    it("sorts students by points descending", () => {
      const board = generateLeaderboard(mockStudents, "points", 10);
      expect(board[0].score).toBe(500);
      expect(board[1].score).toBe(400);
      expect(board[2].score).toBe(300);
    });

    it("limits results to specified count", () => {
      const board = generateLeaderboard(mockStudents, "points", 2);
      expect(board).toHaveLength(2);
    });

    it("assigns correct ranks", () => {
      const board = generateLeaderboard(mockStudents, "points", 10);
      expect(board[0].rank).toBe(1);
      expect(board[1].rank).toBe(2);
      expect(board[2].rank).toBe(3);
    });

    it("returns empty array for null students", () => {
      const board = generateLeaderboard(null, "points", 10);
      expect(board).toEqual([]);
    });

    it("includes student metadata", () => {
      const board = generateLeaderboard(mockStudents, "points", 1);
      expect(board[0].name).toBe("Alice");
      expect(board[0].userId).toBe("1");
    });

    it("sorts by streak when requested", () => {
      const board = generateLeaderboard(mockStudents, "streak", 10);
      expect(board[0].score).toBe(10); // Alice's streak
      expect(board[1].score).toBe(5); // Bob's streak
    });

    it("default limit ensures minimum 1 result", () => {
      const board = generateLeaderboard(mockStudents, "points", 0);
      expect(board.length).toBeGreaterThan(0);
    });
  });

  describe("detectAnomalies", () => {
    it("flags high point velocity (> 10 points/minute)", () => {
      const newData = { totalPoints: 1000, totalActiveMinutes: 50 };
      const oldData = { totalPoints: 0, totalActiveMinutes: 1 };
      const result = detectAnomalies(newData, oldData);
      expect(result.flags).toContain("suspicious_point_velocity");
      expect(result.isAnomalous).toBe(true);
    });

    it("flags impossible streak jump", () => {
      const newData = { streak: { current: 100 } };
      const oldData = { streak: { current: 0 } };
      const result = detectAnomalies(newData, oldData);
      expect(result.flags).toContain("impossible_streak_jump");
    });

    it("flags all perfect scores", () => {
      const newData = {
        analyzedActivities: [
          { score: 100 },
          { score: 100 },
          { score: 100 },
          { score: 100 },
          { score: 100 },
          { score: 100 },
        ],
      };
      const oldData = {};
      const result = detectAnomalies(newData, oldData);
      expect(result.flags).toContain("all_perfect_scores");
    });

    it("flags VAK style change", () => {
      const newData = { vakResult: "visual" };
      const oldData = { vakResult: "auditivo" };
      const result = detectAnomalies(newData, oldData);
      expect(result.flags).toContain("vak_changed");
    });

    it("returns no flags for normal progression", () => {
      const newData = {
        totalPoints: 110,
        totalActiveMinutes: 60,
        streak: { current: 3 },
      };
      const oldData = {
        totalPoints: 100,
        totalActiveMinutes: 55,
        streak: { current: 2 },
      };
      const result = detectAnomalies(newData, oldData);
      expect(result.flags.length).toBe(0);
      expect(result.isAnomalous).toBe(false);
    });

    it("calculates risk level based on flags count", () => {
      const newData = { totalPoints: 1000, streak: { current: 100 } };
      const oldData = { totalPoints: 0, streak: { current: 0 } };
      const result = detectAnomalies(newData, oldData);
      expect(result.riskLevel).toBe("high");
    });

    it("handles null studentData gracefully", () => {
      const result = detectAnomalies(null, {});
      expect(result.isAnomalous).toBe(false);
      expect(result.flags).toEqual([]);
    });
  });

  describe("isValidScore", () => {
    it("returns true for scores between 0 and 100", () => {
      expect(isValidScore(0)).toBe(true);
      expect(isValidScore(50)).toBe(true);
      expect(isValidScore(100)).toBe(true);
    });

    it("returns false for scores < 0", () => {
      expect(isValidScore(-1)).toBe(false);
    });

    it("returns false for scores > 100", () => {
      expect(isValidScore(101)).toBe(false);
    });

    it("returns false for non-numeric values", () => {
      expect(isValidScore("100")).toBe(false);
      expect(isValidScore(null)).toBe(false);
      expect(isValidScore(undefined)).toBe(false);
    });
  });

  describe("calculateTrend", () => {
    it("calculates percentage growth over 7 days", () => {
      const studentData = {
        pointsHistory: [
          {
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            cumulative: 100,
          },
          {
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            cumulative: 200,
          },
        ],
      };
      const trend = calculateTrend(studentData, 7);
      expect(trend).toBeGreaterThan(0);
    });

    it("returns 0 for insufficient history", () => {
      const studentData = { pointsHistory: [{ cumulative: 100 }] };
      expect(calculateTrend(studentData, 7)).toBe(0);
    });

    it("handles edge case when starting points are 0", () => {
      const studentData = {
        pointsHistory: [
          {
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            cumulative: 0,
          },
          { date: new Date(Date.now()), cumulative: 100 },
        ],
      };
      const trend = calculateTrend(studentData, 7);
      expect(trend).toBe(100); // 100% growth from 0
    });

    it("returns negative trend for declining scores", () => {
      const studentData = {
        pointsHistory: [
          {
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            cumulative: 200,
          },
          { date: new Date(Date.now()), cumulative: 100 },
        ],
      };
      const trend = calculateTrend(studentData, 7);
      expect(trend).toBeLessThan(0);
    });

    it("filters by days parameter", () => {
      const now = Date.now();
      const studentData = {
        pointsHistory: [
          { date: new Date(now - 30 * 24 * 60 * 60 * 1000), cumulative: 100 },
          { date: new Date(now - 15 * 24 * 60 * 60 * 1000), cumulative: 150 },
          { date: new Date(now - 3 * 24 * 60 * 60 * 1000), cumulative: 200 },
          { date: new Date(now), cumulative: 300 },
        ],
      };
      const trend7 = calculateTrend(studentData, 7);
      const trend30 = calculateTrend(studentData, 30);
      // Both should give different results: trend30 is 200% (100 to 300), trend7 is 50% (200 to 300)
      expect(trend7).toBeGreaterThanOrEqual(0);
      expect(trend30).toBeGreaterThan(trend7);
    });
  });

  describe("Security and edge cases", () => {
    it("prevents division by zero in calculateTrend", () => {
      const studentData = {
        pointsHistory: [
          { date: new Date(), cumulative: 0 },
          { date: new Date(), cumulative: 0 },
        ],
      };
      expect(() => calculateTrend(studentData)).not.toThrow();
    });

    it("validates leaderboard limits range", () => {
      const board1 = generateLeaderboard(mockStudents, "points", -5);
      const board2 = generateLeaderboard(mockStudents, "points", 999);
      expect(board1.length).toBeGreaterThan(0);
      expect(board2.length).toBe(3);
    });

    it("handles malformed student objects gracefully", () => {
      const malformed = [{ id: "1" }, { id: "2", totalPoints: null }];
      const board = generateLeaderboard(malformed, "points", 10);
      expect(board).toBeDefined();
      expect(board.length).toBeGreaterThan(0);
    });

    it("prevents prototype pollution in detectAnomalies", () => {
      const data = { __proto__: { isAnomalous: true } };
      const result = detectAnomalies(data, {});
      expect(result.isAnomalous).toBe(false);
    });
  });
});
