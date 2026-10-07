import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useIngenIAActions } from "../useIngenIAActions";
import {
  ADN_COMPLETION_XP,
  ADN_REWARD_REASON,
  DEFAULT_MISSIONS,
} from "../ingenIAData";

vi.mock("../../lib/analytics", () => ({ track: vi.fn() }));
vi.mock("../../lib/analyticsEvents", () => ({
  EVENTS: {
    MISSION_COMPLETED: "mission_completed",
    BADGE_UNLOCKED: "badge_unlocked",
  },
}));

describe("useIngenIAActions.addPoints", () => {
  it("allows negative points (reward redemption deducts)", () => {
    let total = 100;
    let history = [];
    const setters = {
      setTotalPoints: (fn) => {
        total = fn(total);
      },
      setPointsHistory: (fn) => {
        history = fn(history);
      },
    };
    const { result } = renderHook(() => useIngenIAActions(setters));

    act(() => {
      result.current.addPoints(-30, "Canjeó recompensa");
    });
    expect(total).toBe(70);
    expect(history[0].points).toBe(-30);
  });

  it("records positive points normally", () => {
    let total = 0;
    let history = [];
    const setters = {
      setTotalPoints: (fn) => {
        total = fn(total);
      },
      setPointsHistory: (fn) => {
        history = fn(history);
      },
    };
    const { result } = renderHook(() => useIngenIAActions(setters));

    act(() => {
      result.current.addPoints(10, "Misón completada");
    });
    expect(total).toBe(10);
    expect(history[0].points).toBe(10);
  });

  it("ignores NaN input", () => {
    let total = 5;
    const setters = {
      setTotalPoints: (fn) => {
        total = fn(total);
      },
      setPointsHistory: () => {},
    };
    const { result } = renderHook(() => useIngenIAActions(setters));

    act(() => {
      result.current.addPoints("abc", "invalido");
    });
    expect(total).toBe(5);
  });
});

describe("useIngenIAActions.completeMission", () => {
  it("marks mission completed and adds XP", () => {
    let total = 0;
    let history = [];
    const missions = [
      { id: "m1", title: "Read a book", xp: 50, completed: false },
      { id: "m2", title: "Do math", xp: 30, completed: false },
    ];
    let updatedMissions = missions;
    const setters = {
      setTotalPoints: (fn) => {
        total = fn(total);
      },
      setPointsHistory: (fn) => {
        history = fn(history);
      },
      missions,
      setMissions: (fn) => {
        updatedMissions = fn(updatedMissions);
      },
    };
    const { result } = renderHook(() => useIngenIAActions(setters));

    act(() => result.current.completeMission("m1"));

    expect(updatedMissions.find((m) => m.id === "m1").completed).toBe(true);
    expect(total).toBe(50);
    expect(history).toHaveLength(1);
  });

  it("does not double-complete an already completed mission", () => {
    let total = 0;
    const missions = [{ id: "m1", title: "Done", xp: 50, completed: true }];
    let updatedMissions = missions;
    const setters = {
      setTotalPoints: (fn) => {
        total = fn(total);
      },
      setPointsHistory: (fn) => fn([]),
      missions,
      setMissions: (fn) => {
        updatedMissions = fn(updatedMissions);
      },
    };
    const { result } = renderHook(() => useIngenIAActions(setters));

    act(() => result.current.completeMission("m1"));
    expect(total).toBe(0);
  });
});

describe("useIngenIAActions.unlockReward", () => {
  it("deducts cost and sets lastUnlockedReward", () => {
    let total = 200;
    let history = [];
    let unlocked = [];
    let lastReward = null;
    const setters = {
      setTotalPoints: (fn) => {
        total = fn(total);
      },
      setPointsHistory: (fn) => {
        history = fn(history);
      },
      setUnlockedRewards: (fn) => {
        unlocked = fn(unlocked);
      },
      setLastUnlockedReward: (v) => {
        lastReward = v;
      },
      setDarkMode: vi.fn(),
      setAvatarAnimado: vi.fn(),
      setFondoGalaxia: vi.fn(),
    };
    const reward = { id: 99, name: "Sticker", cost: 50 };
    const { result } = renderHook(() => useIngenIAActions(setters));

    act(() => result.current.unlockReward(reward));

    expect(total).toBe(150);
    expect(unlocked).toContain(99);
    expect(lastReward).toEqual(reward);
  });
});

describe("useIngenIAActions.toggleDarkMode", () => {
  it("toggles dark mode state", () => {
    let dark = false;
    const setters = {
      setDarkMode: (fn) => {
        dark = fn(dark);
      },
    };
    const { result } = renderHook(() => useIngenIAActions(setters));

    act(() => result.current.toggleDarkMode());
    expect(dark).toBe(true);

    act(() => result.current.toggleDarkMode());
    expect(dark).toBe(false);
  });
});

describe("useIngenIAActions.setVakResultAndRecommendations (premio del ADN)", () => {
  const build = (extra = {}) => {
    let total = 0;
    let history = [];
    const synced = [];
    const setters = {
      setTotalPoints: (fn) => {
        total = fn(total);
      },
      setPointsHistory: (fn) => {
        history = fn(history);
      },
      setVakResult: () => {},
      setVakRecommendations: () => {},
      syncPoints: (points, reason) => synced.push({ points, reason }),
      ...extra,
    };
    const { result } = renderHook(() => useIngenIAActions(setters));
    return { result, get: () => ({ total, history, synced }) };
  };

  const adn = { predominantStyle: "visual", scores: { visual: 60 } };

  it("pays the same amount the mission announces, and saves it to the server", () => {
    const { result, get } = build();
    act(() => result.current.setVakResultAndRecommendations(adn));

    expect(get().total).toBe(ADN_COMPLETION_XP);
    expect(DEFAULT_MISSIONS[0].xp).toBe(ADN_COMPLETION_XP);
    expect(get().synced).toEqual([
      { points: ADN_COMPLETION_XP, reason: ADN_REWARD_REASON },
    ]);
  });

  it("does not pay again when the student repeats the ADN", () => {
    const { result, get } = build({
      vakResult: { predominantStyle: "auditivo" },
    });
    act(() => result.current.setVakResultAndRecommendations(adn));

    expect(get().total).toBe(0);
    expect(get().synced).toEqual([]);
  });

  it("does not pay again when the server history already has the reward", () => {
    const { result, get } = build({
      pointsHistory: [{ points: 100, reason: "Completó ADN de Aprendizaje" }],
    });
    act(() => result.current.setVakResultAndRecommendations(adn));

    expect(get().total).toBe(0);
    expect(get().synced).toEqual([]);
  });
});

describe("useIngenIAActions: los premios se guardan en el servidor", () => {
  it("syncs mission rewards instead of leaving them only in memory", () => {
    const synced = [];
    const setters = {
      setTotalPoints: () => {},
      setPointsHistory: () => {},
      setMissions: () => {},
      missions: [{ id: "m1", title: "Leer", xp: 50, completed: false }],
      syncPoints: (points, reason) => synced.push({ points, reason }),
    };
    const { result } = renderHook(() => useIngenIAActions(setters));
    act(() => result.current.completeMission("m1"));

    expect(synced).toEqual([{ points: 50, reason: "Misión completada: Leer" }]);
  });

  it("keeps working when no sync function is provided", () => {
    let total = 0;
    const setters = {
      setTotalPoints: (fn) => {
        total = fn(total);
      },
      setPointsHistory: () => {},
      setMissions: () => {},
      missions: [{ id: "m1", title: "Leer", xp: 50, completed: false }],
    };
    const { result } = renderHook(() => useIngenIAActions(setters));
    act(() => result.current.completeMission("m1"));
    expect(total).toBe(50);
  });
});
