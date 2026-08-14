import { describe, it, expect, vi, beforeEach } from "vitest";

const filters: string[] = [];

const mockClient = {
  channel: vi.fn(() => ({
    on: vi.fn(function (this: any, _event: string, config?: any) {
      if (config && typeof config === "object" && config.filter) {
        filters.push(config.filter);
      }
      return this;
    }),
    subscribe: vi.fn((cb?: (status: string) => void) => {
      if (cb) cb("SUBSCRIBED");
      return "SUBSCRIBED";
    }),
  })),
  removeChannel: vi.fn(),
  from: vi.fn().mockReturnValue({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi
      .fn()
      .mockResolvedValue({ data: { id: "db-123" }, error: null }),
  }),
};

vi.mock("../../lib/supabase", () => ({
  createSupabaseClient: () => mockClient,
}));

import { useParentDashboardRealtime } from "../useParentDashboardRealtime";
import { act, renderHook } from "@testing-library/react";

describe("useParentDashboardRealtime", () => {
  beforeEach(() => {
    filters.length = 0;
    vi.clearAllMocks();
  });

  it("filters sessions/points by the linked student's DB id and students by auth id", async () => {
    const { result } = renderHook(() =>
      useParentDashboardRealtime("parent-1", "auth-456", "token-abc"),
    );

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(filters.some((f) => f === "student_id=eq.db-123")).toBe(true);
    expect(filters.some((f) => f === "auth_id=eq.auth-456")).toBe(true);
    expect(filters.some((f) => f.includes("last_activity=gt."))).toBe(false);
    expect(result.current.isConnected).toBe(true);
  });

  it("does not subscribe when auth is missing", async () => {
    const { result } = renderHook(() =>
      useParentDashboardRealtime("parent-1", "auth-456", null),
    );

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.isConnected).toBe(false);
    expect(mockClient.channel).not.toHaveBeenCalled();
  });
});
