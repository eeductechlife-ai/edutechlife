import { describe, it, expect, beforeEach, vi } from 'vitest';
import { calculateNewUnlocks, buildUnlockPayload } from '../../achievementService';
import { loadFromSupabase } from '../../smartboardSync';

/**
 * Integration Test: Achievement Unlock Flow
 * Scenario: Student completes missions → Achievements unlock → Payload saved to DB
 */
describe('Achievement unlock flow (Integration)', () => {
  describe('End-to-end unlock and sync', () => {
    it('calculates and persists new achievement unlocks', () => {
      // Setup: Initial state
      const previousUnlocked = [];
      const userData = {
        missions: [{ id: 'mission_1', name: 'Primer Paso' }],
        totalPoints: 150,
        streak: { current: 6, longest: 10 },
        subjectTime: { math: 120 },
        analyzedActivities: [{ score: 100 }],
        friendsList: [{ id: 'f1' }, { id: 'f2' }, { id: 'f3' }],
      };

      // Act: Calculate new unlocks
      const newUnlocks = calculateNewUnlocks(userData, previousUnlocked);

      // Assert: Multiple achievements unlock
      expect(newUnlocks.length).toBeGreaterThanOrEqual(3);
      expect(newUnlocks.map((a) => a.id)).toContain('first_lesson');
      expect(newUnlocks.map((a) => a.id)).toContain('hundred_points');
      expect(newUnlocks.map((a) => a.id)).toContain('five_day_streak');
    });

    it('builds sync payload with timestamps', () => {
      const newUnlocks = [
        { id: 'first_lesson', name: 'Primer Paso', icon: '🎓', points: 10 },
        { id: 'hundred_points', name: 'Centenario', icon: '💯', points: 25 },
      ];
      const existingUnlocked = [];

      const payload = buildUnlockPayload(newUnlocks, existingUnlocked);

      expect(payload.unlockedRewards).toHaveLength(2);
      expect(payload.unlockedRewards[0].unlockedAt).toBeDefined();
      expect(new Date(payload.unlockedRewards[0].unlockedAt).getTime()).toBeLessThanOrEqual(Date.now());
    });

    it('prevents duplicate achievements in payload', () => {
      const existingUnlocked = [
        { id: 'first_lesson', unlockedAt: '2024-01-01T00:00:00Z' },
      ];
      const newUnlocks = [
        { id: 'first_lesson', name: 'Primer Paso', points: 10 },
        { id: 'hundred_points', name: 'Centenario', points: 25 },
      ];

      const payload = buildUnlockPayload(newUnlocks, existingUnlocked);

      const firstLessonCount = payload.unlockedRewards.filter((a) => a.id === 'first_lesson').length;
      expect(firstLessonCount).toBe(1);
      expect(payload.unlockedRewards).toHaveLength(2);
    });

    it('merges with existing unlocks without losing data', () => {
      const existing = [
        { id: 'first_lesson', points: 10, unlockedAt: '2024-01-01T00:00:00Z' },
        { id: 'five_day_streak', points: 50, unlockedAt: '2024-01-05T00:00:00Z' },
      ];
      const newUnlocks = [
        { id: 'hundred_points', points: 25 },
        { id: 'perfect_quiz', points: 30 },
      ];

      const payload = buildUnlockPayload(newUnlocks, existing);

      expect(payload.unlockedRewards).toHaveLength(4);
      const ids = payload.unlockedRewards.map((a) => a.id);
      expect(ids).toEqual(
        expect.arrayContaining(['first_lesson', 'five_day_streak', 'hundred_points', 'perfect_quiz'])
      );
    });

    it('handles cascading unlocks (one achievement triggers conditions for another)', () => {
      // Scenario: 100 points → master subject (due to 120+ min math)
      // Both unlock together
      const userData = {
        totalPoints: 100,
        missions: [{ id: '1' }],
        subjectTime: { math: 120 },
        streak: { current: 0 },
        analyzedActivities: [],
        friendsList: [],
      };

      const newUnlocks = calculateNewUnlocks(userData, []);

      expect(newUnlocks.map((a) => a.id)).toContain('hundred_points');
      expect(newUnlocks.map((a) => a.id)).toContain('master_subject');
    });

    it('respects achievement unlock sequence (does not unlock future achievements)', () => {
      // Scenario: 50 points, no missions → should NOT unlock hundred_points
      const userData = {
        totalPoints: 50,
        missions: [],
        streak: { current: 0 },
        subjectTime: {},
        analyzedActivities: [],
        friendsList: [],
      };

      const newUnlocks = calculateNewUnlocks(userData, []);

      expect(newUnlocks.map((a) => a.id)).not.toContain('hundred_points');
      expect(newUnlocks.map((a) => a.id)).not.toContain('five_day_streak');
    });
  });

  describe('Achievement unlock edge cases', () => {
    it('handles boundary condition: exactly 100 points', () => {
      const userData = {
        totalPoints: 100,
        missions: [],
        streak: { current: 0 },
        subjectTime: {},
        analyzedActivities: [],
        friendsList: [],
      };

      const newUnlocks = calculateNewUnlocks(userData, []);

      expect(newUnlocks.map((a) => a.id)).toContain('hundred_points');
    });

    it('handles boundary condition: exactly 5 day streak', () => {
      const userData = {
        totalPoints: 0,
        missions: [],
        streak: { current: 5 },
        subjectTime: {},
        analyzedActivities: [],
        friendsList: [],
      };

      const newUnlocks = calculateNewUnlocks(userData, []);

      expect(newUnlocks.map((a) => a.id)).toContain('five_day_streak');
    });

    it('handles boundary condition: exactly 60 minutes in one subject', () => {
      const userData = {
        totalPoints: 0,
        missions: [],
        streak: { current: 0 },
        subjectTime: { math: 60 },
        analyzedActivities: [],
        friendsList: [],
      };

      const newUnlocks = calculateNewUnlocks(userData, []);

      expect(newUnlocks.map((a) => a.id)).toContain('master_subject');
    });

    it('handles concurrent rapid updates (multiple unlock cycles)', () => {
      // Simulate user getting multiple achievements in quick succession
      let unlockedIds = [];

      // Round 1: Unlock first_lesson
      let userData = { missions: [{ id: '1' }], totalPoints: 50 };
      let newUnlocks = calculateNewUnlocks(userData, unlockedIds);
      unlockedIds = unlockedIds.concat(newUnlocks.map((a) => a.id));

      // Round 2: Unlock hundred_points
      userData = { ...userData, totalPoints: 100 };
      newUnlocks = calculateNewUnlocks(userData, unlockedIds);

      expect(newUnlocks.map((a) => a.id)).toContain('hundred_points');
      expect(newUnlocks.map((a) => a.id)).not.toContain('first_lesson');
    });

    it('handles missing userData properties gracefully', () => {
      const incompleteUserData = {
        totalPoints: 200,
        // Missing: missions, streak, subjectTime, etc.
      };

      expect(() => calculateNewUnlocks(incompleteUserData, [])).not.toThrow();
      // Should not crash, just evaluate available conditions
    });
  });

  describe('Payload integrity and validation', () => {
    it('each unlocked achievement has required fields for storage', () => {
      const newUnlocks = [
        { id: 'first_lesson', name: 'Primer Paso', icon: '🎓', points: 10 },
      ];
      const payload = buildUnlockPayload(newUnlocks, []);

      payload.unlockedRewards.forEach((achievement) => {
        expect(achievement.id).toBeDefined();
        expect(achievement.name).toBeDefined();
        expect(achievement.icon).toBeDefined();
        expect(achievement.points).toBeDefined();
        expect(achievement.unlockedAt).toBeDefined();
      });
    });

    it('payload is JSON serializable (no circular refs)', () => {
      const newUnlocks = [
        { id: 'first_lesson', name: 'Primer Paso', icon: '🎓', points: 10 },
      ];
      const payload = buildUnlockPayload(newUnlocks, []);

      expect(() => JSON.stringify(payload)).not.toThrow();
    });

    it('unlockedAt timestamp is valid ISO 8601', () => {
      const newUnlocks = [
        { id: 'first_lesson', name: 'Primer Paso', icon: '🎓', points: 10 },
      ];
      const payload = buildUnlockPayload(newUnlocks, []);

      const timestamp = payload.unlockedRewards[0].unlockedAt;
      const date = new Date(timestamp);
      expect(date.toISOString()).toBe(timestamp);
    });
  });

  describe('Performance', () => {
    it('processes unlock calculation in < 50ms for typical data', () => {
      const userData = {
        totalPoints: 250,
        missions: Array(100).fill({ id: 'mission' }),
        streak: { current: 10 },
        subjectTime: { math: 180, spanish: 120 },
        analyzedActivities: Array(50).fill({ score: 85 }),
        friendsList: Array(20).fill({ id: 'friend' }),
      };

      const start = performance.now();
      calculateNewUnlocks(userData, []);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(50);
    });

    it('builds payload with 50 achievements in < 20ms', () => {
      const newUnlocks = Array(50)
        .fill(null)
        .map((_, i) => ({
          id: `achievement_${i}`,
          name: `Achievement ${i}`,
          icon: '🎯',
          points: 10,
        }));

      const start = performance.now();
      buildUnlockPayload(newUnlocks, []);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(20);
    });
  });
});
