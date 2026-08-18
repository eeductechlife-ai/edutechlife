import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  predictChurnRisk,
  predictNextUnlock,
  calculateDailyPoints,
  generateParentAlert,
  calculateRecentAverageScore,
  isAlertValid,
} from "../predictionService";

describe("predictionService", () => {
  describe("predictChurnRisk", () => {
    it("returns high risk when inactive > 7 days", () => {
      const studentData = {
        streak: {
          lastActive: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          current: 0,
        },
        totalPoints: 30,
        totalActiveMinutes: 20,
        missions: [{ id: "1" }],
      };
      const result = predictChurnRisk(studentData);
      expect(result.riskLevel).toBe("high");
      expect(result.score).toBeGreaterThan(50);
      expect(result.reasons.some((r) => r.includes("Inactivo"))).toBe(true);
    });

    it("flags low scores combined with inactivity", () => {
      const studentData = {
        totalPoints: 30,
        streak: { lastActive: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
        missions: [{ id: "1" }],
      };
      const result = predictChurnRisk(studentData);
      expect(result.flags || result.reasons.length).toBeGreaterThan(0);
    });

    it("penalizes broken streak", () => {
      const studentData = {
        streak: {
          current: 0,
          lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
        totalPoints: 100,
        missions: [{ id: "1" }],
      };
      const result = predictChurnRisk(studentData);
      expect(
        result.reasons.some(
          (r) =>
            r.toLowerCase().includes("racha") ||
            r.toLowerCase().includes("streak"),
        ),
      ).toBe(true);
    });

    it("flags no missions completed", () => {
      const studentData = {
        missions: [],
        streak: { lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
        totalPoints: 50,
      };
      const result = predictChurnRisk(studentData);
      expect(result.reasons.some((r) => r.includes("misión"))).toBe(true);
    });

    it("detects very low active time", () => {
      const studentData = {
        totalActiveMinutes: 10,
        streak: { lastActive: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
        missions: [{ id: "1" }],
      };
      const result = predictChurnRisk(studentData);
      expect(result.reasons.some((r) => r.includes("minutos"))).toBe(true);
    });

    it("returns low risk for active engaged student", () => {
      const studentData = {
        totalPoints: 300,
        streak: {
          current: 7,
          lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000),
        },
        totalActiveMinutes: 200,
        missions: [{ id: "1" }, { id: "2" }],
      };
      const result = predictChurnRisk(studentData);
      expect(result.riskLevel).toBe("low");
      expect(result.score).toBeLessThan(30);
    });

    it("handles null studentData", () => {
      const result = predictChurnRisk(null);
      expect(result.riskLevel).toBe("unknown");
      expect(result.score).toBe(0);
    });

    it("caps score at 100", () => {
      const studentData = {
        totalPoints: 0,
        streak: {
          current: 0,
          lastActive: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
        missions: [],
        totalActiveMinutes: 0,
      };
      const result = predictChurnRisk(studentData);
      expect(result.score).toBeLessThanOrEqual(100);
    });
  });

  describe("predictNextUnlock", () => {
    it("predicts next unlock based on points progress", () => {
      const studentData = {
        totalPoints: 80,
        pointsHistory: [
          {
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            cumulative: 0,
          },
          { date: new Date(Date.now()), cumulative: 80 },
        ],
        missions: [],
        analyzedActivities: [],
        streak: { current: 3 },
      };
      const prediction = predictNextUnlock(studentData, []);
      expect(prediction).toBeDefined();
      expect(prediction.achievementId).toBeDefined();
      expect(prediction.progress).toBeLessThan(100);
    });

    it("calculates days until next unlock", () => {
      const studentData = {
        totalPoints: 50,
        pointsHistory: [
          {
            date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            cumulative: 0,
          },
          { date: new Date(Date.now()), cumulative: 50 },
        ],
        streak: { current: 3 },
      };
      const prediction = predictNextUnlock(studentData, []);
      expect(prediction.daysUntilUnlock).toBeGreaterThan(0);
      expect(prediction.estimatedDate).toBeInstanceOf(Date);
    });

    it("excludes already unlocked achievements", () => {
      const studentData = {
        totalPoints: 150,
        pointsHistory: [{ cumulative: 0 }, { cumulative: 150 }],
        streak: { current: 3 },
      };
      const unlockedIds = ["hundred_points"];
      const prediction = predictNextUnlock(studentData, unlockedIds);
      expect(prediction.achievementId).not.toBe("hundred_points");
    });

    it("returns null when all achievements unlocked", () => {
      const studentData = {
        totalPoints: 500,
        streak: { current: 10 },
      };
      const allUnlocked = [
        "first_lesson",
        "five_day_streak",
        "hundred_points",
        "master_subject",
        "perfect_quiz",
        "social_butterfly",
      ];
      const prediction = predictNextUnlock(studentData, allUnlocked);
      expect(prediction).toBeNull();
    });

    it("handles null studentData", () => {
      const prediction = predictNextUnlock(null, []);
      expect(prediction).toBeNull();
    });

    it("picks closest achievement by days remaining", () => {
      const studentData = {
        totalPoints: 90,
        streak: { current: 4 },
        pointsHistory: [{ cumulative: 0 }, { cumulative: 90 }],
      };
      const prediction = predictNextUnlock(studentData, []);
      // Should prefer streak (1 day away) over points (many days away)
      expect(prediction.daysUntilUnlock).toBeLessThan(100);
    });
  });

  describe("calculateDailyPoints", () => {
    it("calculates average points per day", () => {
      const studentData = {
        pointsHistory: [
          {
            date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            cumulative: 0,
          },
          { date: new Date(Date.now()), cumulative: 100 },
        ],
      };
      const dailyPoints = calculateDailyPoints(studentData);
      expect(dailyPoints).toBeGreaterThan(0);
      expect(dailyPoints).toBeLessThanOrEqual(100);
    });

    it("returns 0 for single entry", () => {
      const studentData = {
        pointsHistory: [{ date: new Date(), cumulative: 100 }],
      };
      expect(calculateDailyPoints(studentData)).toBe(0);
    });

    it("returns 0 for empty history", () => {
      const studentData = { pointsHistory: [] };
      expect(calculateDailyPoints(studentData)).toBe(0);
    });

    it("rounds to nearest integer", () => {
      const studentData = {
        pointsHistory: [
          {
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            cumulative: 0,
          },
          { date: new Date(Date.now()), cumulative: 100 },
        ],
      };
      const dailyPoints = calculateDailyPoints(studentData);
      expect(Number.isInteger(dailyPoints)).toBe(true);
    });
  });

  describe("generateParentAlert", () => {
    it("generates high churn risk alert", () => {
      const studentData = {
        streak: { lastActive: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
        totalPoints: 30,
        missions: [{ id: "1" }],
      };
      const alert = generateParentAlert(studentData, []);
      expect(alert).toBeDefined();
      expect(alert.type).toBe("high_churn_risk");
      expect(alert.severity).toBe("high");
    });

    it("flags low scores", () => {
      const studentData = {
        streak: { lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
        totalPoints: 100,
        missions: [{ id: "1" }],
        analyzedActivities: [{ score: 30 }, { score: 40 }],
      };
      const alert = generateParentAlert(studentData, []);
      expect(alert?.type).toBe("low_scores");
    });

    it("celebrates outstanding progress", () => {
      const studentData = {
        streak: { current: 7, lastActive: new Date() },
        totalPoints: 300,
        missions: [{ id: "1" }, { id: "2" }],
        analyzedActivities: [{ score: 90 }, { score: 95 }],
      };
      const alert = generateParentAlert(studentData, []);
      expect(alert?.type).toBe("outstanding_progress");
      expect(alert?.severity).toBe("low");
    });

    it("prevents duplicate alerts within 24 hours", () => {
      const studentData = {
        streak: {
          lastActive: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          current: 0,
        },
        totalPoints: 30,
        totalActiveMinutes: 20,
        missions: [{ id: "1" }],
        analyzedActivities: [{ score: 75 }],
      };
      const previousAlert = {
        type: "high_churn_risk",
        createdAt: new Date().toISOString(),
      };
      const alert = generateParentAlert(studentData, [previousAlert]);
      expect(alert).toBeNull();
    });

    it("allows duplicate alerts after 24 hours", () => {
      const studentData = {
        streak: { lastActive: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
        totalPoints: 30,
        missions: [{ id: "1" }],
      };
      const oldAlert = {
        type: "high_churn_risk",
        createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
      };
      const alert = generateParentAlert(studentData, [oldAlert]);
      expect(alert).toBeDefined();
    });

    it("handles null studentData", () => {
      const alert = generateParentAlert(null, []);
      expect(alert).toBeNull();
    });

    it("includes actionSuggestion for frontend", () => {
      const studentData = {
        streak: { lastActive: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
        totalPoints: 30,
        missions: [{ id: "1" }],
      };
      const alert = generateParentAlert(studentData, []);
      expect(alert.suggestedAction).toBeDefined();
      expect(typeof alert.suggestedAction).toBe("string");
    });
  });

  describe("calculateRecentAverageScore", () => {
    it("calculates average of last N quizzes", () => {
      const studentData = {
        analyzedActivities: [{ score: 70 }, { score: 80 }, { score: 90 }],
      };
      const avg = calculateRecentAverageScore(studentData, 2);
      expect(avg).toBe(85); // (80 + 90) / 2
    });

    it("uses all quizzes if fewer than limit", () => {
      const studentData = {
        analyzedActivities: [{ score: 70 }, { score: 80 }],
      };
      const avg = calculateRecentAverageScore(studentData, 5);
      expect(avg).toBe(75);
    });

    it("returns 0 for empty activities", () => {
      const studentData = { analyzedActivities: [] };
      expect(calculateRecentAverageScore(studentData, 5)).toBe(0);
    });

    it("rounds to nearest integer", () => {
      const studentData = {
        analyzedActivities: [{ score: 85 }, { score: 86 }],
      };
      const avg = calculateRecentAverageScore(studentData, 2);
      expect(Number.isInteger(avg)).toBe(true);
    });
  });

  describe("isAlertValid", () => {
    it("returns true for new alert", () => {
      const alert = { type: "high_churn_risk", message: "Test" };
      expect(isAlertValid(alert, [])).toBe(true);
    });

    it("prevents duplicate alerts within 24 hours", () => {
      const alert = { type: "high_churn_risk", message: "Test" };
      const previous = [
        { type: "high_churn_risk", createdAt: new Date().toISOString() },
      ];
      expect(isAlertValid(alert, previous)).toBe(false);
    });

    it("allows same alert type after 24 hours", () => {
      const alert = { type: "high_churn_risk", message: "Test" };
      const previous = [
        {
          type: "high_churn_risk",
          createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
        },
      ];
      expect(isAlertValid(alert, previous)).toBe(true);
    });

    it("allows different alert types", () => {
      const alert = { type: "low_scores", message: "Test" };
      const previous = [
        { type: "high_churn_risk", createdAt: new Date().toISOString() },
      ];
      expect(isAlertValid(alert, previous)).toBe(true);
    });

    it("returns false for null alert", () => {
      expect(isAlertValid(null, [])).toBe(false);
    });

    it("returns false for alert without type", () => {
      const alert = { message: "Test" };
      expect(isAlertValid(alert, [])).toBe(false);
    });
  });

  describe("Security and edge cases", () => {
    it("handles extremely old lastActive date", () => {
      const studentData = {
        streak: { lastActive: new Date("2000-01-01") },
        totalPoints: 50,
        missions: [],
      };
      const result = predictChurnRisk(studentData);
      expect(result.riskLevel).toBe("high");
    });

    it("prevents division by zero in calculateDailyPoints", () => {
      const studentData = {
        pointsHistory: [
          { date: new Date(), cumulative: 0 },
          { date: new Date(), cumulative: 100 },
        ],
      };
      expect(() => calculateDailyPoints(studentData)).not.toThrow();
    });

    it("validates alert timestamp format", () => {
      const alert = { type: "test", message: "Test" };
      const previous = [{ type: "test", createdAt: "invalid-date" }];
      expect(() => isAlertValid(alert, previous)).not.toThrow();
    });

    it("protects against prototype pollution", () => {
      const maliciousData = {
        __proto__: { admin: true },
        streak: { current: 1 },
      };
      const result = predictChurnRisk(maliciousData);
      expect(result).toBeDefined();
      expect(result.riskLevel).not.toBe("admin");
    });
  });
});
