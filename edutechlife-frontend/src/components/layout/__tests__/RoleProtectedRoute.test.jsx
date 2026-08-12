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
    localStorage.clear();
    useStudentProfile.mockReturnValue(profile());
  });

  it("redirects to login when no auth token", () => {
    useStudentProfile.mockReturnValue(profile());
    renderAt("ialab");
    expect(screen.getByText("login-page")).toBeInTheDocument();
  });

  it("allows access when account_type matches the route", () => {
    localStorage.setItem("auth_token", "t");
    useStudentProfile.mockReturnValue(
      profile({ profile: { account_type: "ialab" } }),
    );
    renderAt("ialab");
    expect(screen.getByText("protected-content")).toBeInTheDocument();
  });

  it("redirects a smartboard account away from an ialab route", () => {
    localStorage.setItem("auth_token", "t");
    useStudentProfile.mockReturnValue(
      profile({ profile: { account_type: "smartboard" } }),
    );
    renderAt("ialab");
    expect(screen.getByText("smartboard-home")).toBeInTheDocument();
  });

  it("redirects an ialab account away from a smartboard route", () => {
    localStorage.setItem("auth_token", "t");
    useStudentProfile.mockReturnValue(
      profile({ profile: { account_type: "ialab" } }),
    );
    renderAt("smartboard");
    expect(screen.getByText("ialab-home")).toBeInTheDocument();
  });

  it("FAIL-OPEN: allows when account_type is missing (unmigrated user)", () => {
    localStorage.setItem("auth_token", "t");
    useStudentProfile.mockReturnValue(profile({ profile: {} }));
    renderAt("ialab");
    expect(screen.getByText("protected-content")).toBeInTheDocument();
  });

  it("FAIL-OPEN: allows while the profile is still loading", () => {
    localStorage.setItem("auth_token", "t");
    useStudentProfile.mockReturnValue(
      profile({ profile: { account_type: "smartboard" }, isLoading: true }),
    );
    renderAt("ialab");
    expect(screen.getByText("protected-content")).toBeInTheDocument();
  });

  it("FAIL-OPEN: allows parents regardless of account_type", () => {
    localStorage.setItem("auth_token", "t");
    localStorage.setItem("user_role", "parent");
    useStudentProfile.mockReturnValue(
      profile({ profile: { account_type: "ialab" } }),
    );
    renderAt("smartboard");
    expect(screen.getByText("protected-content")).toBeInTheDocument();
  });

  it("FAIL-OPEN: allows admins regardless of account_type", () => {
    localStorage.setItem("auth_token", "t");
    useStudentProfile.mockReturnValue(
      profile({ profile: { account_type: "smartboard" }, isAdmin: true }),
    );
    renderAt("ialab");
    expect(screen.getByText("protected-content")).toBeInTheDocument();
  });
});
