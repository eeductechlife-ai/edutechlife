import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import es from "../../../i18n/es.json";

const interpolate = (str, params = {}) =>
  str.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? `{${k}}`);
const t = (key, params) =>
  es[key] === undefined ? key : interpolate(es[key], params);

vi.mock("framer-motion", () => {
  const passthrough = ({ children, ...props }) =>
    React.createElement("div", { className: props.className }, children);
  return {
    motion: new Proxy(
      {},
      { get: (_, tag) => (tag === "button" ? "button" : passthrough) },
    ),
  };
});

vi.mock("../../../utils/iconMapping.jsx", () => ({
  Icon: () => React.createElement("span", { "data-testid": "icon" }),
}));

vi.mock("./SidebarTooltipIcon", () => ({
  default: ({ children }) =>
    React.createElement(React.Fragment, null, children),
}));

vi.mock("./ModuleNavItem", () => ({ default: () => null }));

vi.mock("../../UserDropdownMenuSimplified", () => ({
  default: ({ variant, triggerVariant }) => (
    <div
      data-testid="user-menu"
      data-variant={variant}
      data-trigger={triggerVariant}
    />
  ),
}));

import SidebarCollapsed from "./SidebarCollapsed";

const baseProps = {
  courseProgress: 50,
  modules: [{ id: 1, title: "Módulo 1" }],
  activeMod: 1,
  isModuleLocked: () => false,
  calculateModuleScore: () => 0,
  completedModules: [],
  moduleProgress: {},
  streak: 0,
  isStreakAtRisk: () => false,
  getLevel: () => 0,
  getTotalPoints: () => 0,
  storedCertificate: null,
  setShowCertificateModal: () => {},
  goToModule: () => {},
  goToProgress: () => {},
  setShowLeaderboard: () => {},
  setShowStudyPlannerModal: () => {},
  onToggleSidebar: () => {},
  fadeTransition: {},
  t,
};

describe("SidebarCollapsed — aviso de toggle", () => {
  it("muestra el cue sobre el anillo", () => {
    render(<SidebarCollapsed {...baseProps} />);
    expect(screen.getByTestId("sidebar-toggle-cue")).toBeInTheDocument();
  });

  it("el clic en el anillo sigue llamando a onToggleSidebar", () => {
    const onToggle = vi.fn();
    render(<SidebarCollapsed {...baseProps} onToggleSidebar={onToggle} />);
    fireEvent.click(screen.getByRole("progressbar"));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("muestra el menú de usuario compacto al fondo (variante sidebar)", () => {
    render(<SidebarCollapsed {...baseProps} />);
    const menu = screen.getByTestId("user-menu");
    expect(menu).toHaveAttribute("data-variant", "sidebar");
    expect(menu).toHaveAttribute("data-trigger", "compact");
  });
});
