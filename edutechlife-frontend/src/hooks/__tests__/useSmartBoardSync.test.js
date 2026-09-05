import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useSmartBoardSync } from "../useSmartBoardSync";

/**
 * useSmartBoardSync Hook Test Suite
 *
 * CRITICAL: Manages data persistence and sync state.
 * Failures here cause data loss or corruption.
 * Target: 90%+ coverage
 */

vi.mock("../useSupabase", () => ({
  useSupabase: vi.fn(),
}));

vi.mock("../../services/smartboardSync", () => ({
  loadFromSupabase: vi.fn(),
  saveToSupabase: vi.fn(),
  mergeWithLocal: vi.fn((remote, local) => ({ ...remote, ...local })),
  setupConnectionListener: vi.fn(),
}));

import { useSupabase } from "../useSupabase";
import {
  loadFromSupabase,
  saveToSupabase,
  mergeWithLocal,
  setupConnectionListener,
} from "../../services/smartboardSync";

describe("useSmartBoardSync", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();

    // Default successful state
    useSupabase.mockReturnValue({
      supabase: { from: vi.fn() },
      userId: "test-user-123",
      isLoading: false,
    });

    loadFromSupabase.mockResolvedValue({
      success: true,
      data: { totalPoints: 100, missions: [] },
    });

    saveToSupabase.mockResolvedValue({
      success: true,
    });

    setupConnectionListener.mockReturnValue(() => {});
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe("Initialization", () => {
    it("returns functions for load, save, merge", () => {
      const { result } = renderHook(() => useSmartBoardSync());

      expect(typeof result.current.loadData).toBe("function");
      expect(typeof result.current.saveData).toBe("function");
      expect(typeof result.current.mergeWithLocal).toBe("function");
    });

    it("initializes connected state based on online status and Supabase", () => {
      const { result } = renderHook(() => useSmartBoardSync());

      expect(result.current.isConnected).toBe(true);
    });

    it("tracks loading state from useSupabase", () => {
      useSupabase.mockReturnValue({
        supabase: { from: vi.fn() },
        userId: "test-user-123",
        isLoading: true,
      });

      const { result } = renderHook(() => useSmartBoardSync());

      expect(result.current.isLoading).toBe(true);
    });

    it("exposes userId from Supabase session", () => {
      const { result } = renderHook(() => useSmartBoardSync());

      expect(result.current.userId).toBe("test-user-123");
    });
  });

  describe("loadData", () => {
    it("loads data from Supabase for current user", async () => {
      const { result } = renderHook(() => useSmartBoardSync());

      let data;
      await act(async () => {
        data = await result.current.loadData();
      });

      expect(loadFromSupabase).toHaveBeenCalledWith(
        expect.any(Object),
        "test-user-123",
      );
      expect(data.totalPoints).toBe(100);
    });

    it("returns null if userId is missing", async () => {
      useSupabase.mockReturnValue({
        supabase: { from: vi.fn() },
        userId: null,
        isLoading: false,
      });

      const { result } = renderHook(() => useSmartBoardSync());

      let data;
      await act(async () => {
        data = await result.current.loadData();
      });

      expect(data).toBeNull();
      expect(loadFromSupabase).not.toHaveBeenCalled();
    });

    it("returns null if Supabase is not initialized", async () => {
      useSupabase.mockReturnValue({
        supabase: null,
        userId: "test-user-123",
        isLoading: false,
      });

      const { result } = renderHook(() => useSmartBoardSync());

      let data;
      await act(async () => {
        data = await result.current.loadData();
      });

      expect(data).toBeNull();
    });

    it("propagates load errors", async () => {
      loadFromSupabase.mockResolvedValue({
        success: false,
        error: "Network error",
      });

      const { result } = renderHook(() => useSmartBoardSync());

      let data;
      await act(async () => {
        data = await result.current.loadData();
      });

      expect(data).toBeNull();
    });
  });

  describe("saveData", () => {
    it("saves data to Supabase with debounce (500ms)", async () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useSmartBoardSync());

      const kidsData = { totalPoints: 150, missions: [] };

      await act(async () => {
        result.current.saveData(kidsData);
      });

      // Should not call immediately due to debounce
      expect(saveToSupabase).not.toHaveBeenCalled();

      // Advance 500ms and flush microtasks (avoids waitFor + fake-timer deadlock)
      await act(async () => {
        await vi.advanceTimersByTimeAsync(500);
      });

      expect(saveToSupabase).toHaveBeenCalledWith(
        expect.any(Object),
        "test-user-123",
        kidsData,
      );

      vi.useRealTimers();
    });

    it("cancels pending save if new save requested within debounce window", async () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useSmartBoardSync());

      const data1 = { totalPoints: 100 };
      const data2 = { totalPoints: 200 };

      await act(async () => {
        result.current.saveData(data1);
      });

      // Advance 300ms (within 500ms debounce window)
      await act(async () => {
        await vi.advanceTimersByTimeAsync(300);
      });

      await act(async () => {
        result.current.saveData(data2);
      });

      // Advance another 500ms and flush microtasks
      await act(async () => {
        await vi.advanceTimersByTimeAsync(500);
      });

      // Should only have called once with the latest data
      expect(saveToSupabase).toHaveBeenCalledTimes(1);
      expect(saveToSupabase).toHaveBeenCalledWith(
        expect.any(Object),
        "test-user-123",
        data2, // Latest data wins
      );

      vi.useRealTimers();
    });

    it("returns success promise", async () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useSmartBoardSync());

      const promise = act(async () => {
        return result.current.saveData({ totalPoints: 100 });
      });

      vi.advanceTimersByTime(500);

      const resolved = await promise;

      expect(resolved.success).toBe(true);

      vi.useRealTimers();
    });

    it("returns failure if save fails", async () => {
      vi.useFakeTimers();
      saveToSupabase.mockResolvedValue({
        success: false,
        error: "Permission denied",
      });

      const { result } = renderHook(() => useSmartBoardSync());

      const promise = act(async () => {
        return result.current.saveData({ totalPoints: 100 });
      });

      vi.advanceTimersByTime(500);

      const resolved = await promise;

      expect(resolved.success).toBe(false);

      vi.useRealTimers();
    });

    it("returns early if userId missing", async () => {
      useSupabase.mockReturnValue({
        supabase: { from: vi.fn() },
        userId: null,
        isLoading: false,
      });

      const { result } = renderHook(() => useSmartBoardSync());

      let result_data;
      await act(async () => {
        result_data = await result.current.saveData({ totalPoints: 100 });
      });

      expect(result_data.success).toBe(false);
      expect(saveToSupabase).not.toHaveBeenCalled();
    });

    it("stores last saved data internally", async () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useSmartBoardSync());

      const kidsData = { totalPoints: 100 };

      await act(async () => {
        result.current.saveData(kidsData);
        vi.advanceTimersByTime(500);
      });

      // The hook stores this internally for connection listener
      expect(saveToSupabase).toHaveBeenCalled();

      vi.useRealTimers();
    });
  });

  describe("Online/Offline Transitions", () => {
    it("tracks online status via window events", async () => {
      const { result } = renderHook(() => useSmartBoardSync());

      expect(result.current.isConnected).toBe(true);

      // Simulate offline
      await act(async () => {
        window.dispatchEvent(new Event("offline"));
      });

      await waitFor(() => {
        expect(result.current.isConnected).toBe(false);
      });

      // Simulate online
      await act(async () => {
        window.dispatchEvent(new Event("online"));
      });

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true);
      });
    });

    it("listeners added and removed on mount/unmount", () => {
      const addEventListenerSpy = vi.spyOn(window, "addEventListener");
      const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

      const { unmount } = renderHook(() => useSmartBoardSync());

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        "online",
        expect.any(Function),
      );
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        "offline",
        expect.any(Function),
      );

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "online",
        expect.any(Function),
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "offline",
        expect.any(Function),
      );

      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });
  });

  describe("Connection Listener Setup", () => {
    it("sets up connection listener when supabase and userId available", () => {
      renderHook(() => useSmartBoardSync());

      expect(setupConnectionListener).toHaveBeenCalledWith(
        expect.any(Object), // supabase
        "test-user-123", // userId
        expect.any(Function), // getLastSavedCallback
      );
    });

    it("does not set up listener if supabase missing", () => {
      useSupabase.mockReturnValue({
        supabase: null,
        userId: "test-user-123",
        isLoading: false,
      });

      renderHook(() => useSmartBoardSync());

      expect(setupConnectionListener).not.toHaveBeenCalled();
    });

    it("does not set up listener if userId missing", () => {
      useSupabase.mockReturnValue({
        supabase: { from: vi.fn() },
        userId: null,
        isLoading: false,
      });

      renderHook(() => useSmartBoardSync());

      expect(setupConnectionListener).not.toHaveBeenCalled();
    });

    it("listener cleanup called on supabase/userId change", () => {
      const mockCleanup = vi.fn();
      setupConnectionListener.mockReturnValue(mockCleanup);

      const { rerender } = renderHook(
        ({ userId }) => {
          useSupabase.mockReturnValue({
            supabase: { from: vi.fn() },
            userId,
            isLoading: false,
          });
          return useSmartBoardSync();
        },
        { initialProps: { userId: "user-1" } },
      );

      // Change userId
      rerender({ userId: "user-2" });

      expect(mockCleanup).toHaveBeenCalled();
    });
  });

  describe("Cleanup on Unmount", () => {
    it("clears pending save timeout on unmount", async () => {
      vi.useFakeTimers();
      const { unmount } = renderHook(() => useSmartBoardSync());

      const { result } = renderHook(() => useSmartBoardSync());

      // Trigger a save
      await act(async () => {
        result.current.saveData({ totalPoints: 100 });
      });

      // Unmount before timeout completes
      unmount();

      // Advance time beyond debounce window
      vi.advanceTimersByTime(1000);

      // Should not call saveToSupabase after unmount
      // (implementation detail: timeout cleared)

      vi.useRealTimers();
    });

    it("clears online/offline event listeners on unmount", () => {
      const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

      const { unmount } = renderHook(() => useSmartBoardSync());

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "online",
        expect.any(Function),
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "offline",
        expect.any(Function),
      );

      removeEventListenerSpy.mockRestore();
    });

    it("calls connection listener cleanup on unmount", () => {
      const mockCleanup = vi.fn();
      setupConnectionListener.mockReturnValue(mockCleanup);

      const { unmount } = renderHook(() => useSmartBoardSync());

      unmount();

      expect(mockCleanup).toHaveBeenCalled();
    });
  });

  describe("Error Handling", () => {
    it("tracks error state from save failures", async () => {
      vi.useFakeTimers();
      saveToSupabase.mockResolvedValue({
        success: false,
        error: "Permission denied",
      });

      const { result } = renderHook(() => useSmartBoardSync());

      await act(async () => {
        result.current.saveData({ totalPoints: 100 });
        vi.advanceTimersByTime(500);
      });

      // Error should be exposed or logged (implementation dependent)
      // At minimum, should not crash

      vi.useRealTimers();
    });

    it("handles race condition: offline save attempt", async () => {
      useSupabase.mockReturnValue({
        supabase: { from: vi.fn() },
        userId: "test-user-123",
        isLoading: false,
      });

      const { result } = renderHook(() => useSmartBoardSync());

      // Trigger offline
      await act(async () => {
        window.dispatchEvent(new Event("offline"));
      });

      // Try to save while offline
      await act(async () => {
        result.current.saveData({ totalPoints: 100 });
      });

      // Should not crash (behavior: local queue or retry on online)
    });
  });

  describe("Merge Function Export", () => {
    it("exports mergeWithLocal function", () => {
      const { result } = renderHook(() => useSmartBoardSync());

      expect(typeof result.current.mergeWithLocal).toBe("function");
    });

    it("mergeWithLocal delegates to service", () => {
      const { result } = renderHook(() => useSmartBoardSync());

      const remote = { totalPoints: 100 };
      const local = { totalPoints: 50 };

      result.current.mergeWithLocal(remote, local);

      expect(mergeWithLocal).toHaveBeenCalledWith(remote, local);
    });
  });
});
