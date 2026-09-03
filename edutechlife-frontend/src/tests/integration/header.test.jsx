import { useRef, useEffect } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import { I18nProvider } from "../../i18n/I18nProvider";
import HeaderFluidIsland from "../../components/layout/HeaderFluidIsland";

const navHolder = { fn: null };
function NavigateCapture({ children }) {
  const nav = useNavigate();
  const ref = useRef(nav);
  ref.current = nav;
  useEffect(() => {
    navHolder.fn = ref.current;
  }, [nav]);
  return children;
}

vi.mock("../../i18n/I18nProvider", () => ({
  I18nProvider: ({ children }) => <>{children}</>,
  useTranslation: () => ({ t: (key) => key }),
}));

vi.mock("@clerk/react", () => ({
  useAuth: () => ({ isSignedIn: false }),
  useUser: () => ({ user: null }),
}));

describe("HeaderFluidIsland — login dropdown", () => {
  it("renders login button with 2 options", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <I18nProvider>
          <HeaderFluidIsland />
        </I18nProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText("nav.login")).toBeTruthy();

    fireEvent.click(screen.getByText("nav.login"));

    expect(screen.getByText("iLab Academic")).toBeTruthy();
    expect(screen.getByText("SmartBoard")).toBeTruthy();
  });

  it("hides dropdown on route pathname change", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <NavigateCapture>
          <I18nProvider>
            <HeaderFluidIsland />
          </I18nProvider>
        </NavigateCapture>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText("nav.login"));
    expect(screen.getByText("iLab Academic")).toBeTruthy();

    navHolder.fn("/some-other-route");

    await waitFor(() => {
      expect(screen.queryByText("iLab Academic")).toBeNull();
    });
  });

  it("returns null on ialab route", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/ialab"]}>
        <I18nProvider>
          <HeaderFluidIsland />
        </I18nProvider>
      </MemoryRouter>,
    );

    expect(container.innerHTML).toBe("");
  });

  it("returns null on smartboard route", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/smartboard"]}>
        <I18nProvider>
          <HeaderFluidIsland />
        </I18nProvider>
      </MemoryRouter>,
    );

    expect(container.innerHTML).toBe("");
  });
});
