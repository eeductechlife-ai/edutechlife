import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSidebarState } from "../useSidebarState";
import { useIALabStore } from "../../../store/ialabStore";

const setWindowWidth = (width) => {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  });
  window.dispatchEvent(new Event("resize"));
};

beforeEach(() => {
  useIALabStore.getState().setSidebarCollapsed(false);
});

describe("useSidebarState", () => {
  test("expone isCollapsed, toggleSidebar e isMobile", () => {
    const { result } = renderHook(() => useSidebarState());
    expect(typeof result.current.isCollapsed).toBe("boolean");
    expect(typeof result.current.toggleSidebar).toBe("function");
    expect(typeof result.current.isMobile).toBe("boolean");
  });

  test("no expone la API legacy de secciones colapsables", () => {
    const { result } = renderHook(() => useSidebarState());
    expect(result.current.collapsedSections).toBeUndefined();
    expect(result.current.getSectionData).toBeUndefined();
    expect(result.current.isModuleLocked).toBeUndefined();
    expect(result.current.getProgress).toBeUndefined();
  });

  describe("responsive behavior", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    test("detecta móvil en pantallas pequeñas", () => {
      setWindowWidth(375);
      const { result } = renderHook(() => useSidebarState());
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(result.current.isMobile).toBe(true);
    });

    test("no es móvil en pantallas grandes", () => {
      setWindowWidth(1024);
      const { result } = renderHook(() => useSidebarState());
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(result.current.isMobile).toBe(false);
    });

    test("auto-colapsa por debajo de 1024", () => {
      setWindowWidth(375);
      const { result } = renderHook(() => useSidebarState());
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(result.current.isCollapsed).toBe(true);
    });

    test("toggleSidebar alterna el estado", () => {
      setWindowWidth(1440);
      const { result } = renderHook(() => useSidebarState());
      act(() => {
        result.current.toggleSidebar();
      });
      expect(result.current.isCollapsed).toBe(true);
      act(() => {
        result.current.toggleSidebar();
      });
      expect(result.current.isCollapsed).toBe(false);
    });
  });
});
