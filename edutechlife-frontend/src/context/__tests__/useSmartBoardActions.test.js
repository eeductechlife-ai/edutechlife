import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSmartBoardActions } from "../useSmartBoardActions";

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
