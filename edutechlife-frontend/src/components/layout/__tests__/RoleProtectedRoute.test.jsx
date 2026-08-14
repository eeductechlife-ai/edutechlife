import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../../i18n/I18nProvider", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

vi.mock("../../LoadingScreen", () => ({
  PageLoader: () => <div>loading</div>,
}));

vi.mock("../../../hooks/useStudentProfile", () => ({
  useStudentProfile: vi.fn(),
}));

// getSession devuelve sesión solo si el token de localStorage es "vigente".
// setSession falla cuando el token es inválido ("expired-token").
vi.mock("../../../lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: vi.fn(async () => {
        const token = sessionStorage.getItem("auth_token");
        return {
          data: {
            session:
              token && token !== "expired-token"
                ? { user: { id: "u1" }, access_token: token }
                : null,
          },
        };
      }),
      setSession: vi.fn(async ({ access_token }) => {
        if (access_token === "expired-token") {
          return { data: { user: null, session: null }, error: { message: "expired" } };
        }
        return {
          data: {
            user: { id: "u1" },
            session: { access_token, refresh_token: "rt" },
          },
          error: null,
        };
      }),
    },
  },
}));

const { useStudentProfile } = await import("../../../hooks/useStudentProfile");
const RoleProtectedRoute = (await import("../RoleProtectedRoute")).default;

const renderAt = (requiredRole, path = "/target") =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/target"
          element={
            <RoleProtectedRoute requiredRole={requiredRole}>
              <div>protected-content</div>
            </RoleProtectedRoute>
          }
        />
        <Route path="/ialab" element={<div>ialab-home</div>} />
        <Route path="/smartboard" element={<div>smartboard-home</div>} />
        <Route path="/login" element={<div>login-page</div>} />
      </Routes>
    </MemoryRouter>,
  );

const profile = (overrides = {}) => ({
  profile: null,
  isAdmin: false,
  isLoading: false,
  ...overrides,
});

describe("RoleProtectedRoute product gate", () => {
  beforeEach(() => {
    sessionStorage.clear(); localStorage.clear();
    useStudentProfile.mockReturnValue(profile());
  });

  it("redirects to login when no auth token", async () => {
    useStudentProfile.mockReturnValue(profile());
    renderAt("ialab");
    expect(await screen.findByText("login-page")).toBeInTheDocument();
  });

  it("allows access when account_type matches the route", async () => {
    sessionStorage.setItem("auth_token", "t");
    useStudentProfile.mockReturnValue(
      profile({ profile: { account_type: "ialab" } }),
    );
    renderAt("ialab");
    expect(await screen.findByText("protected-content")).toBeInTheDocument();
  });

  it("redirects a smartboard account away from an ialab route", async () => {
    sessionStorage.setItem("auth_token", "t");
    useStudentProfile.mockReturnValue(
      profile({ profile: { account_type: "smartboard" } }),
    );
    renderAt("ialab");
    expect(await screen.findByText("smartboard-home")).toBeInTheDocument();
  });

  it("redirects an ialab account away from a smartboard route", async () => {
    sessionStorage.setItem("auth_token", "t");
    useStudentProfile.mockReturnValue(
      profile({ profile: { account_type: "ialab" } }),
    );
    renderAt("smartboard");
    expect(await screen.findByText("ialab-home")).toBeInTheDocument();
  });

  it("FAIL-OPEN: allows when account_type is missing (unmigrated user)", async () => {
    sessionStorage.setItem("auth_token", "t");
    useStudentProfile.mockReturnValue(profile({ profile: {} }));
    renderAt("ialab");
    expect(await screen.findByText("protected-content")).toBeInTheDocument();
  });

  it("FAIL-OPEN: allows while the profile is still loading", async () => {
    sessionStorage.setItem("auth_token", "t");
    useStudentProfile.mockReturnValue(
      profile({ profile: { account_type: "smartboard" }, isLoading: true }),
    );
    renderAt("ialab");
    expect(await screen.findByText("protected-content")).toBeInTheDocument();
  });

  it("FAIL-OPEN: allows parents regardless of account_type", async () => {
    sessionStorage.setItem("auth_token", "t");
    localStorage.setItem("user_role", "parent");
    useStudentProfile.mockReturnValue(
      profile({ profile: { account_type: "ialab" } }),
    );
    renderAt("smartboard");
    expect(await screen.findByText("protected-content")).toBeInTheDocument();
  });

  it("FAIL-OPEN: allows admins regardless of account_type", async () => {
    sessionStorage.setItem("auth_token", "t");
    useStudentProfile.mockReturnValue(
      profile({ profile: { account_type: "smartboard" }, isAdmin: true }),
    );
    renderAt("ialab");
    expect(await screen.findByText("protected-content")).toBeInTheDocument();
  });

  it("FAIL-CLOSED: redirects to login when the token is invalid/expired", async () => {
    sessionStorage.setItem("auth_token", "expired-token");
    useStudentProfile.mockReturnValue(
      profile({ profile: { account_type: "ialab" } }),
    );
    renderAt("ialab");
    expect(await screen.findByText("login-page")).toBeInTheDocument();
  });
});
