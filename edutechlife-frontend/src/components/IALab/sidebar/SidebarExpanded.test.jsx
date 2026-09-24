import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import SidebarExpanded from "./SidebarExpanded";
import es from "../../../i18n/es.json";

const interpolate = (str, params = {}) =>
  str.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? `{${k}}`);

const t = (key, params) => {
  const value = es[key];
  if (value === undefined) return key;
  return interpolate(value, params);
};

const { mockShowHistory, mockToggleSidebar } = vi.hoisted(() => ({
  mockShowHistory: vi.fn(),
  mockToggleSidebar: vi.fn(),
}));

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("framer-motion", () => {
  const passthrough = ({ children, ...props }) => {
    const {
      initial,
      animate,
      exit,
      transition,
      variants,
      whileHover,
      whileTap,
    } = props;
    return React.createElement(
      "div",
      { className: props.className, onClick: props.onClick },
      children,
    );
  };
  return {
    AnimatePresence: ({ children }) => children,
    motion: new Proxy(
      {},
      { get: (_, tag) => (tag === "button" ? "button" : passthrough) },
    ),
    useReducedMotion: () => false,
  };
});

vi.mock("../../../context/IALabContext", () => ({
  useIALabProgressContext: () => ({
    courseProgress: 50,
    modules: [
      { id: 1, title: "Ingeniería de Prompts" },
      { id: 2, title: "Potencia ChatGPT" },
    ],
    activeMod: 1,
    isModuleLocked: () => false,
    calculateModuleScore: () => 0,
    completedModules: [],
  }),
  useIALabUIContext: () => ({
    courseCompleted: false,
    setShowCertificateModal: vi.fn(),
    storedCertificate: null,
    certificateGenerating: false,
    setShowStreakModal: vi.fn(),
  }),
}));

vi.mock("../../../store/ialabStore", () => ({
  useIALabStore: (selector) =>
    selector({
      streak: 0,
      getLevel: () => ({ name: "Nivel 1" }),
      getTotalPoints: () => 0,
      isStreakAtRisk: () => false,
      setShowLeaderboard: vi.fn(),
      setShowStudyPlannerModal: vi.fn(),
      setShowHistoryModal: mockShowHistory,
      toggleSidebarCollapsed: mockToggleSidebar,
    }),
}));

vi.mock("../../../i18n/I18nProvider", () => ({
  useTranslation: () => ({ t, locale: "es", setLocale: vi.fn() }),
}));

vi.mock("../../../utils/iconMapping", () => ({
  Icon: ({ name }) => <span data-testid="icon" data-icon={name} />,
}));

vi.mock("../CourseCompletionSection", () => ({
  default: () => null,
}));

vi.mock("../../UserDropdownMenuSimplified", () => ({
  default: ({ variant, triggerVariant }) => (
    <div
      data-testid="user-menu"
      data-variant={variant}
      data-trigger={triggerVariant}
    />
  ),
}));

describe("SidebarExpanded titles", () => {
  it("renderiza los títulos de las zonas con texto traducido (no claves crudas)", () => {
    render(<SidebarExpanded />);
    expect(screen.getByText("Tu avance")).toBeInTheDocument();
    expect(screen.getByText("MÓDULOS DEL CURSO")).toBeInTheDocument();
    expect(screen.getByText("Ranking")).toBeInTheDocument();
  });

  it("renderiza el acceso a Ranking y no duplica las entradas del menú de usuario", () => {
    render(<SidebarExpanded />);
    expect(screen.getByText("Ranking")).toBeInTheDocument();
    expect(screen.queryByText("Mi Progreso")).not.toBeInTheDocument();
    expect(screen.queryByText("Plan")).not.toBeInTheDocument();
  });

  it("no renderiza ninguna clave de traducción cruda (patrón 'sidebar.*')", () => {
    render(<SidebarExpanded />);
    const bodyText = document.body.textContent;
    expect(bodyText).not.toMatch(/sidebar\./);
    expect(bodyText).not.toMatch(/ialab\./);
  });

  it("colapsa el sidebar al hacer clic en el círculo de progreso", () => {
    mockToggleSidebar.mockClear();
    render(<SidebarExpanded />);
    fireEvent.click(screen.getByRole("button", { name: /completado/i }));
    expect(mockToggleSidebar).toHaveBeenCalledTimes(1);
  });

  it("muestra el aviso de toggle (cue) sobre el anillo", () => {
    render(<SidebarExpanded />);
    expect(screen.getByTestId("sidebar-toggle-cue")).toBeInTheDocument();
  });

  it("la zona de progreso no se encoge (shrink-0) para no perder el anillo", () => {
    render(<SidebarExpanded />);
    const zone = screen.getByTestId("sidebar-progress-zone");
    expect(zone.className).toContain("shrink-0");
    expect(screen.getByText("Tu avance")).toBeInTheDocument();
  });

  it("muestra el menú de usuario al fondo del sidebar (variante sidebar, trigger full)", () => {
    render(<SidebarExpanded />);
    const menu = screen.getByTestId("user-menu");
    expect(menu).toHaveAttribute("data-variant", "sidebar");
    expect(menu).toHaveAttribute("data-trigger", "full");
  });
});
