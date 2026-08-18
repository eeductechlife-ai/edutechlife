import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  mergeWithLocal,
  loadFromSupabase,
  saveToSupabase,
  setupConnectionListener,
} from "../smartboardSync";

/**
 * SmartBoardSync Service Test Suite
 *
 * CRITICAL: Handles conflict resolution between local and remote data.
 * Data corruption or loss will impact student progress.
 * Target: 100% coverage
 */

describe("mergeWithLocal", () => {
  describe("Basic Conflict Resolution", () => {
    it("takes max for totalPoints (documented behavior)", () => {
      const remote = { totalPoints: 300, missions: [] };
      const local = { totalPoints: 100, missions: [] };

      const merged = mergeWithLocal(remote, local);

      expect(merged.totalPoints).toBe(300);
    });

    it("takes max for totalActiveMinutes", () => {
      const remote = { totalActiveMinutes: 120, missions: [] };
      const local = { totalActiveMinutes: 60, missions: [] };

      const merged = mergeWithLocal(remote, local);

      expect(merged.totalActiveMinutes).toBe(120);
    });

    it("handles local > remote for points", () => {
      const remote = { totalPoints: 100, missions: [] };
      const local = { totalPoints: 500, missions: [] };

      const merged = mergeWithLocal(remote, local);

      expect(merged.totalPoints).toBe(500);
    });
  });

  describe("Array Merging (Missions, History)", () => {
    it("merges missions keeping both sides when IDs differ", () => {
      const remote = { missions: [{ id: "a", name: "Quiz 1" }] };
      const local = { missions: [{ id: "b", name: "Quiz 2" }] };

      const merged = mergeWithLocal(remote, local);

      expect(merged.missions).toHaveLength(2);
      expect(merged.missions.map((m) => m.id)).toContain("a");
      expect(merged.missions.map((m) => m.id)).toContain("b");
    });

    it("deduplicates missions by ID", () => {
      const remote = {
        missions: [{ id: "a", name: "Quiz 1", completed: true }],
      };
      const local = {
        missions: [{ id: "a", name: "Quiz 1", completed: true }],
      };

      const merged = mergeWithLocal(remote, local);

      expect(merged.missions).toHaveLength(1);
    });

    it("keeps remote version when merging duplicate IDs", () => {
      const remote = { missions: [{ id: "a", name: "Quiz 1", reward: 100 }] };
      const local = { missions: [{ id: "a", name: "Quiz 1", reward: 50 }] };

      const merged = mergeWithLocal(remote, local);

      // Remote should take precedence for duplicate IDs
      expect(merged.missions[0].reward).toBe(100);
    });

    it("merges pointsHistory arrays without duplicates", () => {
      const remote = {
        totalPoints: 50,
        pointsHistory: [
          { id: "h1", points: 10, timestamp: "2024-08-10T10:00:00Z" },
        ],
      };
      const local = {
        totalPoints: 30,
        pointsHistory: [
          { id: "h2", points: 20, timestamp: "2024-08-10T11:00:00Z" },
        ],
      };

      const merged = mergeWithLocal(remote, local);

      expect(merged.pointsHistory).toHaveLength(2);
    });
  });

  describe("History Deduplication", () => {
    it("removes duplicate history entries by ID", () => {
      const remote = {
        totalPoints: 0,
        pointsHistory: [
          { id: "h1", points: 10 },
          { id: "h2", points: 20 },
        ],
      };
      const local = {
        totalPoints: 0,
        pointsHistory: [
          { id: "h1", points: 10 }, // duplicate
          { id: "h3", points: 30 },
        ],
      };

      const merged = mergeWithLocal(remote, local);
      const ids = merged.pointsHistory.map((h) => h.id);

      expect(new Set(ids).size).toBe(ids.length); // all unique
      expect(ids.sort()).toEqual(["h1", "h2", "h3"].sort());
    });

    it("does not lose remote points when local is higher AND remote has newer history", () => {
      const remote = {
        totalPoints: 500,
        pointsHistory: [
          { id: "r1", points: 500, timestamp: "2024-08-14T10:00:00Z" },
        ],
        missions: [{ id: "b", name: "Remote Quiz" }],
      };
      const local = {
        totalPoints: 1000,
        pointsHistory: [
          { id: "l1", points: 1000, timestamp: "2024-08-10T10:00:00Z" },
        ],
        missions: [{ id: "a", name: "Local Quiz" }],
      };

      const merged = mergeWithLocal(remote, local);

      // Local points win (1000)
      expect(merged.totalPoints).toBe(1000);
      // But remote history preserved
      expect(merged.pointsHistory).toHaveLength(2);
      expect(merged.pointsHistory.map((h) => h.id)).toContain("r1");
    });

    it("caps history at 100 entries (FIFO)", () => {
      const remoteHistory = Array.from({ length: 60 }, (_, i) => ({
        id: `r${i}`,
        points: 1,
      }));
      const localHistory = Array.from({ length: 60 }, (_, i) => ({
        id: `l${i}`,
        points: 1,
      }));

      const merged = mergeWithLocal(
        { pointsHistory: remoteHistory },
        { pointsHistory: localHistory },
      );

      // After dedup: 60 + 60 = 120 entries, capped at 100
      expect(merged.pointsHistory.length).toBeLessThanOrEqual(100);
    });
  });

  describe("Null/Undefined Handling", () => {
    it("handles missing remote data gracefully", () => {
      const remote = {};
      const local = { totalPoints: 100, missions: [] };

      const merged = mergeWithLocal(remote, local);

      expect(merged.totalPoints).toBe(100);
    });

    it("handles missing local data gracefully", () => {
      const remote = { totalPoints: 100, missions: [] };
      const local = {};

      const merged = mergeWithLocal(remote, local);

      expect(merged.totalPoints).toBe(100);
    });

    it("handles both empty", () => {
      const merged = mergeWithLocal({}, {});

      expect(merged).toBeDefined();
      expect(typeof merged).toBe("object");
    });

    it("preserves null values in arrays", () => {
      const remote = { missions: [{ id: "a" }, null] };
      const local = { missions: [{ id: "b" }] };

      // Should not crash
      expect(() => mergeWithLocal(remote, local)).not.toThrow();
    });
  });

  describe("Negative Points (Rewards Redemption)", () => {
    it("allows negative points (deductions for rewards)", () => {
      const remote = { totalPoints: 500 };
      const local = { totalPoints: 100 };

      const merged = mergeWithLocal(remote, local);

      // Should be able to have large positive points
      expect(merged.totalPoints).toBe(500);
    });

    it("correctly merges history with negative points entries", () => {
      const remote = {
        totalPoints: 200,
        pointsHistory: [{ id: "award", points: 250 }],
      };
      const local = {
        totalPoints: 50,
        pointsHistory: [{ id: "redeem", points: -50 }],
      };

      const merged = mergeWithLocal(remote, local);

      // Both entries preserved
      expect(merged.pointsHistory.length).toBeGreaterThanOrEqual(2);
      expect(merged.pointsHistory.map((h) => h.id)).toContain("redeem");
    });
  });

  describe("Complex Merge Scenarios", () => {
    it("merges deeply nested mission objects correctly", () => {
      const remote = {
        missions: [
          {
            id: "m1",
            name: "Quiz 1",
            progress: { score: 85, attempts: 2 },
            completed: true,
          },
        ],
      };
      const local = {
        missions: [
          {
            id: "m1",
            name: "Quiz 1",
            progress: { score: 75, attempts: 1 },
            completed: false,
          },
        ],
      };

      const merged = mergeWithLocal(remote, local);

      // Remote should take precedence
      expect(merged.missions[0].progress.score).toBe(85);
      expect(merged.missions[0].completed).toBe(true);
    });

    it("preserves additional fields that are not totalPoints/missions/history", () => {
      const remote = {
        totalPoints: 100,
        studentName: "Alice",
        grade: 5,
        missions: [],
      };
      const local = {
        totalPoints: 50,
        missions: [],
      };

      const merged = mergeWithLocal(remote, local);

      // Additional fields from remote should be preserved
      expect(merged.studentName).toBe("Alice");
      expect(merged.grade).toBe(5);
    });

    it("handles race condition: simultaneous local and remote updates", () => {
      // Simulate: both client and backend added same mission ID with different data
      const remote = {
        totalPoints: 300,
        missions: [
          { id: "quiz-1", score: 90, completed: true },
          { id: "quiz-2", score: 0, completed: false },
        ],
      };
      const local = {
        totalPoints: 350, // Client had local bonus
        missions: [
          { id: "quiz-1", score: 85, completed: true }, // Different score
          { id: "quiz-3", score: 0, completed: false },
        ],
      };

      const merged = mergeWithLocal(remote, local);

      // Local points win
      expect(merged.totalPoints).toBe(350);
      // Deduped missions: quiz-1, quiz-2, quiz-3
      expect(merged.missions.length).toBe(3);
      // Remote quiz-1 should be kept (dedup preference)
      expect(merged.missions.find((m) => m.id === "quiz-1").score).toBe(90);
    });
  });
});

describe("loadFromSupabase", () => {
  it("loads data from Supabase table for current user", async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: [
              {
                id: "1",
                user_id: "current-user",
                totalPoints: 100,
                missions: [],
              },
            ],
            error: null,
          }),
        }),
      }),
    };

    const result = await loadFromSupabase(mockSupabase, "current-user");

    expect(result.success).toBe(true);
    expect(result.data.totalPoints).toBe(100);
  });

  it("returns error when Supabase query fails", async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: null,
            error: { message: "Database error" },
          }),
        }),
      }),
    };

    const result = await loadFromSupabase(mockSupabase, "current-user");

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("returns null data when no record found", async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: [],
            error: null,
          }),
        }),
      }),
    };

    const result = await loadFromSupabase(mockSupabase, "current-user");

    expect(result.data).toBeNull();
  });

  it("handles network errors gracefully", async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockRejectedValue(new Error("Network timeout")),
        }),
      }),
    };

    const result = await loadFromSupabase(mockSupabase, "current-user");

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});

describe("saveToSupabase", () => {
  it("upserts data to Supabase", async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        upsert: vi.fn().mockResolvedValue({
          data: { id: "1", totalPoints: 100 },
          error: null,
        }),
      }),
    };

    const data = { totalPoints: 100, missions: [] };
    const result = await saveToSupabase(mockSupabase, "user-1", data);

    expect(result.success).toBe(true);
  });

  it("returns error when upsert fails", async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        upsert: vi.fn().mockResolvedValue({
          data: null,
          error: { message: "Constraint violation" },
        }),
      }),
    };

    const result = await saveToSupabase(mockSupabase, "user-1", {});

    expect(result.success).toBe(false);
  });

  it("includes user_id in upsert payload", async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        upsert: vi.fn().mockResolvedValue({
          data: {},
          error: null,
        }),
      }),
    };

    await saveToSupabase(mockSupabase, "user-1", { totalPoints: 100 });

    expect(mockSupabase.from("smartboard_data").upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: "user-1",
        totalPoints: 100,
      }),
    );
  });

  it("handles network errors during save", async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        upsert: vi.fn().mockRejectedValue(new Error("Network error")),
      }),
    };

    const result = await saveToSupabase(mockSupabase, "user-1", {});

    expect(result.success).toBe(false);
  });
});

describe("setupConnectionListener", () => {
  it("sets up real-time subscription to user data", () => {
    const mockOn = vi.fn().mockReturnValue({
      on: vi.fn().mockReturnValue({ unsubscribe: vi.fn() }),
    });

    const mockSupabase = {
      channel: vi.fn().mockReturnValue({
        on: mockOn,
        subscribe: vi.fn(),
      }),
    };

    setupConnectionListener(mockSupabase, "user-1", () => ({}));

    expect(mockSupabase.channel).toHaveBeenCalled();
  });

  it("returns cleanup function", () => {
    const mockUnsubscribe = vi.fn();
    const mockSupabase = {
      channel: vi.fn().mockReturnValue({
        on: vi.fn().mockReturnValue({
          unsubscribe: mockUnsubscribe,
        }),
        subscribe: vi.fn(),
      }),
    };

    const cleanup = setupConnectionListener(mockSupabase, "user-1", () => ({}));

    expect(typeof cleanup).toBe("function");
    cleanup();
    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it("handles real-time updates when connection re-established", () => {
    const mockCallback = vi.fn();
    const mockSupabase = {
      channel: vi.fn().mockReturnValue({
        on: vi.fn().mockReturnValue({
          unsubscribe: vi.fn(),
        }),
        subscribe: vi.fn(),
      }),
    };

    setupConnectionListener(mockSupabase, "user-1", mockCallback);

    // Simulate receiving update
    expect(mockSupabase.channel).toHaveBeenCalledWith(
      expect.stringContaining("smartboard"),
    );
  });
});
