import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import {
  useSidebarAutoCollapse,
  SIDEBAR_AUTO_COLLAPSE_MS,
} from "../useSidebarAutoCollapse";

const Harness = ({ isCollapsed = false, onCollapse, delayMs = 1000 }) => {
  useSidebarAutoCollapse({ isCollapsed, onCollapse, delayMs });
  return null;
};

const setWidth = (w) =>
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    writable: true,
    value: w,
  });

describe("useSidebarAutoCollapse", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setWidth(1280);
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("el auto-colapso por defecto es a los 60 segundos", () => {
    expect(SIDEBAR_AUTO_COLLAPSE_MS).toBe(60 * 1000);
  });

  it("colapsa tras el tiempo de inactividad", () => {
    const onCollapse = vi.fn();
    render(<Harness onCollapse={onCollapse} delayMs={1000} />);
    act(() => {
      vi.advanceTimersByTime(999);
    });
    expect(onCollapse).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onCollapse).toHaveBeenCalledTimes(1);
  });

  it("reinicia el contador con cualquier interacción", () => {
    const onCollapse = vi.fn();
    render(<Harness onCollapse={onCollapse} delayMs={1000} />);
    act(() => {
      vi.advanceTimersByTime(800);
    });
    act(() => {
      window.dispatchEvent(new Event("pointerdown"));
    });
    act(() => {
      vi.advanceTimersByTime(800);
    });
    expect(onCollapse).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(onCollapse).toHaveBeenCalledTimes(1);
  });

  it("no agenda si el sidebar ya está colapsado", () => {
    const onCollapse = vi.fn();
    render(<Harness isCollapsed onCollapse={onCollapse} delayMs={1000} />);
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(onCollapse).not.toHaveBeenCalled();
  });

  it("no agenda en pantallas < 1024 (móvil/tablet)", () => {
    setWidth(800);
    const onCollapse = vi.fn();
    render(<Harness onCollapse={onCollapse} delayMs={1000} />);
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(onCollapse).not.toHaveBeenCalled();
  });
});
