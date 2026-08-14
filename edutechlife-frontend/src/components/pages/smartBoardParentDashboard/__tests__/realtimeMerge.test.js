import { describe, it, expect, beforeEach } from "vitest";
import { mergeRealtimePoints, resetSeenIds } from "../mergeRealtime";

describe("mergeRealtimePoints", () => {
  beforeEach(() => resetSeenIds());

  it("adds each live point once even across multiple events", () => {
    const first = mergeRealtimePoints(
      { points: 100, history: [{ id: "a", points: 10 }] },
      [
        {
          id: "p1",
          student_id: "x",
          points: 5,
          reason: "",
          category: "",
          timestamp: "",
        },
        {
          id: "p2",
          student_id: "x",
          points: 7,
          reason: "",
          category: "",
          timestamp: "",
        },
      ],
    );
    expect(first.points).toBe(112);

    const second = mergeRealtimePoints(first, [
      {
        id: "p2",
        student_id: "x",
        points: 7,
        reason: "",
        category: "",
        timestamp: "",
      },
      {
        id: "p3",
        student_id: "x",
        points: 3,
        reason: "",
        category: "",
        timestamp: "",
      },
    ]);
    expect(second.points).toBe(115); // p2 not double counted
    expect(second.history).toHaveLength(4); // a, p1, p2, p3
    expect(new Set(second.history.map((h) => h.id)).size).toBe(4); // no dupes
  });

  it("keeps history capped at 100 entries", () => {
    const history = Array.from({ length: 95 }, (_, i) => ({
      id: `h${i}`,
      points: 1,
    }));
    const livePoints = Array.from({ length: 10 }, (_, i) => ({
      id: `l${i}`,
      points: 1,
    }));
    const result = mergeRealtimePoints({ points: 0, history }, livePoints);
    expect(result.history.length).toBeLessThanOrEqual(100);
  });
});
