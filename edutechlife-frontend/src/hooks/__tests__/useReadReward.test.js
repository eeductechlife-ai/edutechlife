import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useReadReward, MIN_READ_MS } from "../useReadReward";

const article = { id: "a1", title: "Mito" };

describe("useReadReward", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("does not reward the moment an article is opened", () => {
    const onEarn = vi.fn();
    renderHook(() => useReadReward(article, [], onEarn));
    vi.advanceTimersByTime(MIN_READ_MS - 1);
    expect(onEarn).not.toHaveBeenCalled();
  });

  it("rewards once the article has stayed open long enough", () => {
    const onEarn = vi.fn();
    renderHook(() => useReadReward(article, [], onEarn));
    vi.advanceTimersByTime(MIN_READ_MS);
    expect(onEarn).toHaveBeenCalledTimes(1);
    expect(onEarn).toHaveBeenCalledWith(article);
  });

  it("gives nothing when the article is closed early", () => {
    const onEarn = vi.fn();
    const { rerender } = renderHook(
      ({ open }) => useReadReward(open, [], onEarn),
      { initialProps: { open: article } },
    );
    vi.advanceTimersByTime(5000);
    rerender({ open: null });
    vi.advanceTimersByTime(MIN_READ_MS * 2);
    expect(onEarn).not.toHaveBeenCalled();
  });

  it("opening 15 articles in a row earns nothing", () => {
    const onEarn = vi.fn();
    const { rerender } = renderHook(
      ({ open }) => useReadReward(open, [], onEarn),
      { initialProps: { open: null } },
    );
    for (let i = 0; i < 15; i++) {
      rerender({ open: { id: `n${i}` } });
      vi.advanceTimersByTime(300);
      rerender({ open: null });
    }
    vi.advanceTimersByTime(MIN_READ_MS * 2);
    expect(onEarn).not.toHaveBeenCalled();
  });

  it("does not pay twice for an article that was already read", () => {
    const onEarn = vi.fn();
    renderHook(() => useReadReward(article, ["a1"], onEarn));
    vi.advanceTimersByTime(MIN_READ_MS * 2);
    expect(onEarn).not.toHaveBeenCalled();
  });
});
