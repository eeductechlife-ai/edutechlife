import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/vitest";

vi.mock("../../i18n/I18nProvider", () => ({
  useTranslation: () => ({ t: (key) => key, locale: "es" }),
}));
vi.mock("../../components/SEO", () => ({ default: () => null }));
vi.mock("../../lib/analytics", () => ({ track: vi.fn() }));
vi.mock("../../utils/appManifest", () => ({ applyManifestForPath: vi.fn() }));
vi.mock("../../components/layout/AppLayout", async () => {
  const { Outlet } = await import("react-router-dom");
  return { default: () => <Outlet /> };
});
vi.mock("../../routes/auth-router", () => ({ default: () => null }));
vi.mock("../../components/layout/ProtectedRoute", () => ({
  default: ({ children }) => children,
}));
vi.mock("../../components/layout/RoleProtectedRoute", () => ({
  default: ({ children }) => children,
}));
vi.mock("../../components/AdminRoute", () => ({
  AdminRoute: ({ children }) => children,
}));
vi.mock("../../components/IngenIALoginRedirect", () => ({
  default: () => null,
}));
vi.mock("../../context/IALabContext", () => ({
  IALabProvider: ({ children }) => children,
}));

import AppRoutes from "../../routes/index.jsx";

describe("ruta /terms", () => {
  it("renderiza los términos y condiciones completos", async () => {
    render(
      <MemoryRouter initialEntries={["/terms"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: /TÉRMINOS Y CONDICIONES/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "7. Derecho de retracto" }),
    ).toBeInTheDocument();
  });
});
