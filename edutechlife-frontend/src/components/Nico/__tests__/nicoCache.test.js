import { describe, test, expect, beforeEach } from "vitest";
import {
  responseCache,
  CACHE_DURATION,
  CACHE_MAX_SIZE,
  setResponseCache,
} from "../nicoCache";

describe("nicoCache", () => {
  beforeEach(() => {
    responseCache.clear();
  });

  test("exposes sensible cache constants", () => {
    expect(CACHE_DURATION).toBe(5 * 60 * 1000);
    expect(CACHE_MAX_SIZE).toBe(100);
  });

  test("setResponseCache stores a value retrievable from the map", () => {
    setResponseCache("hola", "respuesta");
    expect(responseCache.get("hola")).toBe("respuesta");
  });

  test("evicts the oldest entry when at capacity", () => {
    for (let i = 0; i < CACHE_MAX_SIZE; i++) {
      setResponseCache(`key-${i}`, `val-${i}`);
    }
    expect(responseCache.size).toBe(CACHE_MAX_SIZE);
    expect(responseCache.has("key-0")).toBe(true);

    // One more insertion must evict the oldest (key-0), not grow past the cap.
    setResponseCache("key-new", "val-new");
    expect(responseCache.size).toBe(CACHE_MAX_SIZE);
    expect(responseCache.has("key-0")).toBe(false);
    expect(responseCache.has("key-new")).toBe(true);
  });
});
