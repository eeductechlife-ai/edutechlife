import { describe, it, expect, beforeEach } from "vitest";
import {
  shouldUnlock,
  calculateNewUnlocks,
  buildUnlockPayload,
  isValidAchievementId,
  getAvailableAchievements,
  calculateAchievementPoints,
  ACHIEVEMENTS,
} from "../achievementService";

describe("achievementService", () => {
  describe("shouldUnlock", () => {
    it("unlocks first_lesson when student has completed a mission", () => {
      const userData = { missions: [{ id: "mission_1", name: "Tarea 1" }] };
      expect(shouldUnlock("first_lesson", userData)).toBe(true);
    });

    it("does not unlock first_lesson when no missions completed", () => {
      const userData = { missions: [] };
      expect(shouldUnlock("first_lesson", userData)).toBe(false);
    });

    it("unlocks five_day_streak when streak >= 5", () => {
      const userData = { streak: { current: 5, longest: 10 } };
      expect(shouldUnlock("five_day_streak", userData)).toBe(true);
    });

    it("does not unlock five_day_streak when streak < 5", () => {
      const userData = { streak: { current: 3 } };
      expect(shouldUnlock("five_day_streak", userData)).toBe(false);
    });

    it("unlocks hundred_points when totalPoints >= 100", () => {
      const userData = { totalPoints: 150 };
      expect(shouldUnlock("hundred_points", userData)).toBe(true);
    });

    it("does not unlock hundred_points when totalPoints < 100", () => {
      const userData = { totalPoints: 50 };
      expect(shouldUnlock("hundred_points", userData)).toBe(false);
    });

    it("unlocks master_subject when one subject has 60+ minutes", () => {
      const userData = { subjectTime: { math: 120, spanish: 30 } };
      expect(shouldUnlock("master_subject", userData)).toBe(true);
    });

    it("does not unlock master_subject when all subjects < 60 minutes", () => {
      const userData = { subjectTime: { math: 30, spanish: 20 } };
      expect(shouldUnlock("master_subject", userData)).toBe(false);
    });

    it("unlocks perfect_quiz when quiz score = 100", () => {
      const userData = { analyzedActivities: [{ score: 100 }] };
      expect(shouldUnlock("perfect_quiz", userData)).toBe(true);
    });

    it("does not unlock perfect_quiz when all scores < 100", () => {
      const userData = { analyzedActivities: [{ score: 95 }, { score: 98 }] };
      expect(shouldUnlock("perfect_quiz", userData)).toBe(false);
    });

    it("unlocks social_butterfly when 3+ friends added", () => {
      const userData = {
        friendsList: [
          { id: "friend_1" },
          { id: "friend_2" },
          { id: "friend_3" },
        ],
      };
      expect(shouldUnlock("social_butterfly", userData)).toBe(true);
    });

    it("returns false for invalid achievementId", () => {
      const userData = { missions: [{ id: "a" }] };
      expect(shouldUnlock("invalid_achievement", userData)).toBe(false);
    });

    it("returns false when userData is null", () => {
      expect(shouldUnlock("first_lesson", null)).toBe(false);
    });

    it("handles missing properties gracefully", () => {
      const userData = {};
      expect(shouldUnlock("first_lesson", userData)).toBe(false);
      expect(shouldUnlock("hundred_points", userData)).toBe(false);
    });

    it("catches errors during condition evaluation", () => {
      // Simular un error en la evaluación
      const userData = null;
      expect(() => shouldUnlock("first_lesson", userData)).not.toThrow();
    });
  });

  describe("calculateNewUnlocks", () => {
    it("returns empty array when userData is null", () => {
      expect(calculateNewUnlocks(null, [])).toEqual([]);
    });

    it("returns new achievements that meet unlock conditions", () => {
      const userData = {
        missions: [{ id: "1" }],
        totalPoints: 150,
        streak: { current: 5 },
      };
      const result = calculateNewUnlocks(userData, []);
      expect(result.length).toBeGreaterThan(0);
      expect(result.some((a) => a.id === "first_lesson")).toBe(true);
      expect(result.some((a) => a.id === "hundred_points")).toBe(true);
    });

    it("excludes already unlocked achievements", () => {
      const userData = { missions: [{ id: "1" }], totalPoints: 150 };
      const unlockedIds = ["first_lesson"];
      const result = calculateNewUnlocks(userData, unlockedIds);
      expect(result.some((a) => a.id === "first_lesson")).toBe(false);
    });

    it("returns correct achievement details", () => {
      const userData = { missions: [{ id: "1" }] };
      const result = calculateNewUnlocks(userData, []);
      const firstLesson = result.find((a) => a.id === "first_lesson");
      expect(firstLesson).toBeDefined();
      expect(firstLesson.icon).toBe("🎓");
      expect(firstLesson.points).toBe(10);
    });
  });

  describe("buildUnlockPayload", () => {
    it("builds payload with new achievements", () => {
      const newUnlocks = [
        { id: "first_lesson", name: "Primer Paso", points: 10 },
      ];
      const payload = buildUnlockPayload(newUnlocks, []);
      expect(payload.unlockedRewards).toHaveLength(1);
      expect(payload.unlockedRewards[0].unlockedAt).toBeDefined();
    });

    it("preserves existing unlocked achievements", () => {
      const existing = [
        { id: "first_lesson", unlockedAt: "2024-01-01T00:00:00Z" },
      ];
      const newUnlocks = [{ id: "hundred_points", points: 25 }];
      const payload = buildUnlockPayload(newUnlocks, existing);
      expect(payload.unlockedRewards).toHaveLength(2);
    });

    it("deduplicates achievements", () => {
      const existing = [
        { id: "first_lesson", unlockedAt: "2024-01-01T00:00:00Z" },
      ];
      const newUnlocks = [{ id: "first_lesson", points: 10 }];
      const payload = buildUnlockPayload(newUnlocks, existing);
      expect(payload.unlockedRewards).toHaveLength(1);
    });

    it("handles null newUnlocks gracefully", () => {
      const existing = [{ id: "first_lesson" }];
      const payload = buildUnlockPayload(null, existing);
      expect(payload.unlockedRewards).toEqual(existing);
    });

    it("sets unlockedAt timestamp", () => {
      const newUnlocks = [{ id: "first_lesson", points: 10 }];
      const payload = buildUnlockPayload(newUnlocks, []);
      const now = Date.now();
      const unlockedTime = new Date(
        payload.unlockedRewards[0].unlockedAt,
      ).getTime();
      expect(Math.abs(now - unlockedTime)).toBeLessThan(1000); // Within 1 second
    });
  });

  describe("isValidAchievementId", () => {
    it("returns true for valid achievement IDs", () => {
      expect(isValidAchievementId("first_lesson")).toBe(true);
      expect(isValidAchievementId("hundred_points")).toBe(true);
    });

    it("returns false for invalid achievement IDs", () => {
      expect(isValidAchievementId("invalid_id")).toBe(false);
      expect(isValidAchievementId("")).toBe(false);
      expect(isValidAchievementId(null)).toBe(false);
    });
  });

  describe("getAvailableAchievements", () => {
    it("returns array of all available achievements", () => {
      const achievements = getAvailableAchievements();
      expect(Array.isArray(achievements)).toBe(true);
      expect(achievements.length).toBeGreaterThan(0);
    });

    it("includes all expected achievements", () => {
      const achievements = getAvailableAchievements();
      const ids = achievements.map((a) => a.id);
      expect(ids).toContain("first_lesson");
      expect(ids).toContain("five_day_streak");
      expect(ids).toContain("hundred_points");
    });

    it("each achievement has required fields", () => {
      const achievements = getAvailableAchievements();
      achievements.forEach((a) => {
        expect(a.id).toBeDefined();
        expect(a.name).toBeDefined();
        expect(a.icon).toBeDefined();
        expect(typeof a.points).toBe("number");
      });
    });
  });

  describe("calculateAchievementPoints", () => {
    it("sums points from unlocked achievements", () => {
      const unlocked = [
        { id: "first_lesson", points: 10 },
        { id: "hundred_points", points: 25 },
      ];
      expect(calculateAchievementPoints(unlocked)).toBe(35);
    });

    it("returns 0 for empty array", () => {
      expect(calculateAchievementPoints([])).toBe(0);
    });

    it("returns 0 for null input", () => {
      expect(calculateAchievementPoints(null)).toBe(0);
    });

    it("handles achievements with missing points", () => {
      const unlocked = [
        { id: "first_lesson" },
        { id: "hundred_points", points: 25 },
      ];
      expect(calculateAchievementPoints(unlocked)).toBe(25);
    });
  });

  describe("Edge cases and security", () => {
    it("prevents prototype pollution", () => {
      const userData = { __proto__: { malicious: true } };
      expect(() => shouldUnlock("first_lesson", userData)).not.toThrow();
    });

    it("handles deeply nested objects safely", () => {
      const userData = {
        missions: [{ id: "1", nested: { deep: { value: 100 } } }],
      };
      expect(shouldUnlock("first_lesson", userData)).toBe(true);
    });

    it("normalizes missing streak values", () => {
      const userData = { streak: null };
      expect(() => shouldUnlock("five_day_streak", userData)).not.toThrow();
    });

    it("validates array properties", () => {
      const userData = { missions: "not_an_array" };
      expect(() => shouldUnlock("first_lesson", userData)).not.toThrow();
    });
  });
});
