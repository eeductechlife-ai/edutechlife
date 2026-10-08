import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";

vi.mock("../../../../i18n/I18nProvider", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));
vi.mock("framer-motion", async () => {
  const React = await import("react");
  const cache = {};
  return {
    motion: new Proxy(
      {},
      {
        get: (_, tag) =>
          (cache[tag] ||= React.forwardRef(
            (
              {
                children,
                initial,
                animate,
                exit,
                transition,
                whileHover,
                whileTap,
                layout,
                layoutId,
                ...rest
              },
              ref,
            ) => React.createElement(tag, { ...rest, ref }, children),
          )),
      },
    ),
    AnimatePresence: ({ children }) => children,
  };
});
vi.mock("../../../brand/IngenIALogo", () => ({
  default: ({ title }) => <span data-testid="logo">{title}</span>,
}));
vi.mock("../IngenIANotificationPanel", () => ({ default: () => null }));
vi.mock("../../../../context/NotificationContext", () => ({
  useNotification: () => ({ unreadCount: 0 }),
}));

import PremiumSidebar from "../PremiumSidebar";
import TopBar from "../TopBar";

const sidebarProps = {
  activeTab: "practicar",
  onTabChange: vi.fn(),
  totalPoints: 0,
  vakCompleted: true,
  darkMode: false,
  streak: { current: 0 },
  onNavigate: vi.fn(),
  onLogout: vi.fn(),
  subscriptionTier: "basic",
  ageGroup: "middle",
};

const menu = () => screen.getByRole("navigation", { name: "Menú principal" });

describe("PremiumSidebar: sin opciones repetidas", () => {
  it("«Practicar» aparece una sola vez (antes: grupo y subpágina)", () => {
    render(<PremiumSidebar {...sidebarProps} />);
    expect(within(menu()).getAllByText("Practicar")).toHaveLength(1);
  });

  it("cada categoría con una sola pantalla se muestra una vez", () => {
    render(<PremiumSidebar {...sidebarProps} />);
    for (const label of ["Inicio", "Aprender", "Practicar", "Explorar", "Yo"]) {
      expect(within(menu()).getAllByText(label)).toHaveLength(1);
    }
    expect(within(menu()).queryByText("Misiones")).toBeNull();
    expect(within(menu()).queryByText("Materias")).toBeNull();
  });

  it("la categoría activa se marca con aria-current y al tocarla navega", () => {
    render(<PremiumSidebar {...sidebarProps} />);
    const active = within(menu()).getByRole("button", { name: /Practicar/ });
    expect(active.getAttribute("aria-current")).toBe("page");
    fireEvent.click(active);
    expect(sidebarProps.onTabChange).toHaveBeenCalledWith("practicar");
  });

  it("el nombre de la categoría activa es blanco sobre su degradado", () => {
    render(<PremiumSidebar {...sidebarProps} />);
    const label = within(menu()).getByText("Practicar");
    expect(label.style.color).toBe("white");
  });

  it("en tema oscuro las etiquetas inactivas y «Cerrar sesión» se leen sobre el fondo oscuro", () => {
    render(<PremiumSidebar {...sidebarProps} darkMode />);
    expect(within(menu()).getByText("Aprender").style.color).toBe(
      "rgb(226, 232, 240)",
    );
    expect(screen.getByText("smartboard.logout").style.color).toBe(
      "rgb(253, 164, 175)",
    );
  });

  it("sin sublistas no hay botones que prometan desplegar", () => {
    render(<PremiumSidebar {...sidebarProps} />);
    expect(menu().querySelector("[aria-expanded]")).toBeNull();
  });
});

describe("TopBar: un h1 por pantalla", () => {
  const props = {
    darkMode: false,
    streak: { current: 0 },
    totalPoints: 0,
    onTabChange: vi.fn(),
    onLogout: vi.fn(),
  };

  it("en Inicio hay un h1 (antes solo había un h3)", () => {
    render(<TopBar {...props} activeTab="inicio" />);
    const h1 = screen.getAllByRole("heading", { level: 1 });
    expect(h1).toHaveLength(1);
    expect(h1[0].textContent).toBe("Inicio");
  });

  it("en las demás pantallas sigue habiendo uno solo", () => {
    render(<TopBar {...props} activeTab="horario" />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });
});
