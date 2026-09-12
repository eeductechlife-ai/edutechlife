import { renderHook, act, waitFor } from "@testing-library/react";
import { useSupabaseAuth } from "../useSupabaseAuth";

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

    await waitFor(() =>
      expect(result.current.user?.id).toBe("test-user-123"),
    );
    expect(result.current.isSignedIn).toBe(true);
  });

  test("auth:signout limpia user", async () => {
    sessionStorage.setItem("auth_token", makeToken());
    const { result } = renderHook(() => useSupabaseAuth());

    await waitFor(() =>
      expect(result.current.user?.id).toBe("test-user-123"),
    );

    await act(async () => {
      window.dispatchEvent(new CustomEvent("auth:signout"));
    });

    expect(result.current.user).toBeNull();
  });
});
