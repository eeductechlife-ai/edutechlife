/**
 * useAdminAuth Hook Tests
 */

import { renderHook, waitFor } from "@testing-library/react";
import { useAdminAuth } from "../useAdminAuth";

// Mock fetch
global.fetch = jest.fn();

// Mock sessionStorage
const sessionStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "sessionStorage", {
  value: sessionStorageMock,
});

describe("useAdminAuth", () => {
  beforeEach(() => {
    fetch.mockClear();
    sessionStorage.clear();
  });

  test("should return isLoading=true initially", () => {
    const { result } = renderHook(() => useAdminAuth());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.user).toBeNull();
  });

  test("should return null user when no token in sessionStorage", async () => {
    const { result } = renderHook(() => useAdminAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAdmin).toBe(false);
  });

  test("should fetch admin user data when token exists", async () => {
    const mockUser = {
      id: "user-123",
      email: "admin@example.com",
      role: "admin",
      isAdmin: true,
      isContentCreator: false,
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });

    sessionStorage.setItem("auth_token", "valid-token");

    const { result } = renderHook(() => useAdminAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAdmin).toBe(true);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/admin/auth/me"),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer valid-token",
        }),
      }),
    );
  });

  test("should clear token on 401 response", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
    });

    sessionStorage.setItem("auth_token", "expired-token");

    const { result } = renderHook(() => useAdminAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(sessionStorage.getItem("auth_token")).toBeNull();
  });

  test("logout should clear token and user", async () => {
    const mockUser = {
      id: "user-123",
      email: "admin@example.com",
      isAdmin: true,
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });

    sessionStorage.setItem("auth_token", "valid-token");

    const { result } = renderHook(() => useAdminAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).not.toBeNull();

    // Logout
    await result.current.logout();

    expect(result.current.user).toBeNull();
    expect(sessionStorage.getItem("auth_token")).toBeNull();
  });
});
