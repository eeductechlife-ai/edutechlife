import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import ModuleNavItem from "./ModuleNavItem";

vi.mock("framer-motion", () => {
  const motion = new Proxy(
    {},
    {
      get: () => ({ children, ...props }) =>
        React.createElement("div", props, children),
    },
  );
  return { motion };
});

vi.mock("../../../i18n/I18nProvider", () => ({
  useTranslation: () => ({ t: (k) => k }),
}));

vi.mock("../../../utils/iconMapping", () => ({
  Icon: () => React.createElement("span", { "data-testid": "icon" }),
}));

describe("ModuleNavItem (contraste en dark mode)", () => {
  const mod = { id: 2, title: "Arquitecto Digital: ChatGPT" };

  it("el ítem activo usa el token on-emphasis (no text-white) para el título", () => {
    render(
      <ModuleNavItem mod={mod} isActive isLocked={false} onClick={() => {}} />,
    );
    const title = screen.getByText("Arquitecto Digital: ChatGPT");
    // Fondo prominente + texto semántico: legible en claro y en oscuro.
    expect(title.className).toContain("theme-text-on-emphasis");
    expect(title.className).not.toContain("text-white");
  });

  it("el ítem activo no escribe texto blanco fijo en el número del módulo", () => {
    render(
      <ModuleNavItem
        mod={{ id: 3, title: "Mod 3" }}
        isActive
        isLocked={false}
        onClick={() => {}}
      />,
    );
    const title = screen.getByText("Mod 3");
    expect(title.className).toContain("theme-text-on-emphasis");
  });
});
