import { renderHook, act, waitFor } from "@testing-library/react";
import { useSupabaseAuth } from "../useSupabaseAuth";
import { supabase } from "../../lib/supabase";

vi.mock("../../lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
      setSession: vi.fn(() =>
        Promise.resolve({ data: { session: null }, error: null }),
      ),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
      signOut: vi.fn(() => Promise.resolve({ error: null })),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
    })),
  },
}));

const b64url = (obj) =>
  btoa(JSON.stringify(obj))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

const makeToken = () =>
  `${b64url({ alg: "HS256", typ: "JWT" })}.${b64url({
    sub: "test-user-123",
    email: "tester@example.com",
    exp: Math.floor(Date.now() / 1000) + 3600,
  })}.sig`;

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

describe("useSupabaseAuth — puente con la identidad de sessionStorage", () => {
  test("auth:signed-in puebla user aunque el SDK no tenga sesión", async () => {
    const { result } = renderHook(() => useSupabaseAuth());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toBeNull();

    await act(async () => {
      sessionStorage.setItem("auth_token", makeToken());
      window.dispatchEvent(new CustomEvent("auth:signed-in"));
    });

    await waitFor(() => expect(result.current.user?.id).toBe("test-user-123"));
    expect(result.current.isSignedIn).toBe(true);
  });

  test("emite 'supabase.auth.token-refreshed' cuando el SDK renueva el token", async () => {
    renderHook(() => useSupabaseAuth());
    await waitFor(() =>
      expect(supabase.auth.onAuthStateChange).toHaveBeenCalled(),
    );

    const authCallback = supabase.auth.onAuthStateChange.mock.calls.at(-1)[0];
    sessionStorage.setItem("auth_token", "token-viejo");

    const onRefreshed = vi.fn();
    window.addEventListener("supabase.auth.token-refreshed", onRefreshed);

    await act(async () => {
      await authCallback("TOKEN_REFRESHED", {
        user: { id: "test-user-123", email: "tester@example.com" },
        access_token: "token-nuevo",
        refresh_token: "refresh-nuevo",
      });
    });

    expect(onRefreshed).toHaveBeenCalledTimes(1);
    expect(sessionStorage.getItem("auth_token")).toBe("token-nuevo");
    window.removeEventListener("supabase.auth.token-refreshed", onRefreshed);
  });

  test("no emite el evento si el token no cambió", async () => {
    renderHook(() => useSupabaseAuth());
    await waitFor(() =>
      expect(supabase.auth.onAuthStateChange).toHaveBeenCalled(),
    );

    const authCallback = supabase.auth.onAuthStateChange.mock.calls.at(-1)[0];
    sessionStorage.setItem("auth_token", "token-igual");

    const onRefreshed = vi.fn();
    window.addEventListener("supabase.auth.token-refreshed", onRefreshed);

    await act(async () => {
      await authCallback("SIGNED_IN", {
        user: { id: "test-user-123", email: "tester@example.com" },
        access_token: "token-igual",
        refresh_token: "refresh-igual",
      });
    });

    expect(onRefreshed).not.toHaveBeenCalled();
    window.removeEventListener("supabase.auth.token-refreshed", onRefreshed);
  });

  test("auth:signout limpia user", async () => {
    sessionStorage.setItem("auth_token", makeToken());
    const { result } = renderHook(() => useSupabaseAuth());

    await waitFor(() => expect(result.current.user?.id).toBe("test-user-123"));

    await act(async () => {
      window.dispatchEvent(new CustomEvent("auth:signout"));
    });

    expect(result.current.user).toBeNull();
  });
});
