import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSmartBoardActions } from "../useSmartBoardActions";

vi.mock("../../lib/analytics", () => ({ track: vi.fn() }));
vi.mock("../../lib/analyticsEvents", () => ({
  EVENTS: {
    MISSION_COMPLETED: "mission_completed",
    BADGE_UNLOCKED: "badge_unlocked",
  },
}));

describe("useSmartBoardActions.addPoints", () => {
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
    const { result } = renderHook(() => useSmartBoardActions(setters));

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
    const { result } = renderHook(() => useSmartBoardActions(setters));

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
    const { result } = renderHook(() => useSmartBoardActions(setters));

    act(() => {
      result.current.addPoints("abc", "invalido");
    });
    expect(total).toBe(5);
  });
});

describe("useSmartBoardActions.completeMission", () => {
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
    const { result } = renderHook(() => useSmartBoardActions(setters));

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
    const { result } = renderHook(() => useSmartBoardActions(setters));

    act(() => result.current.completeMission("m1"));
    expect(total).toBe(0);
  });
});

describe("useSmartBoardActions.unlockReward", () => {
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
    const { result } = renderHook(() => useSmartBoardActions(setters));

    act(() => result.current.unlockReward(reward));

    expect(total).toBe(150);
    expect(unlocked).toContain(99);
    expect(lastReward).toEqual(reward);
  });
});

describe("useSmartBoardActions.toggleDarkMode", () => {
  it("toggles dark mode state", () => {
    let dark = false;
    const setters = {
      setDarkMode: (fn) => {
        dark = fn(dark);
      },
    };
    const { result } = renderHook(() => useSmartBoardActions(setters));

    act(() => result.current.toggleDarkMode());
    expect(dark).toBe(true);

    act(() => result.current.toggleDarkMode());
    expect(dark).toBe(false);
  });
});
