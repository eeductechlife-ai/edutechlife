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
    const { initial, animate, exit, transition, variants, whileHover, whileTap } = props;
    return React.createElement("div", { className: props.className, onClick: props.onClick }, children);
  };
  return {
    AnimatePresence: ({ children }) => children,
    motion: new Proxy({}, { get: (_, tag) => (tag === "button" ? "button" : passthrough) }),
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

describe("SidebarExpanded titles", () => {
  it("renderiza los títulos de las zonas con texto traducido (no claves crudas)", () => {
    render(<SidebarExpanded />);
    expect(screen.getByText("Tu Avance")).toBeInTheDocument();
    expect(screen.getByText("MÓDULOS DEL CURSO")).toBeInTheDocument();
    expect(screen.getByText("Herramientas")).toBeInTheDocument();
  });

  it("renderiza el botón 'Continúa aquí' con el título del módulo activo", () => {
    render(<SidebarExpanded />);
    expect(screen.getByText("Continúa aquí")).toBeInTheDocument();
    expect(screen.getAllByText("Ingeniería de Prompts").length).toBeGreaterThanOrEqual(1);
  });

  it("renderiza los accesos de herramientas traducidos", () => {
    render(<SidebarExpanded />);
    expect(screen.getByText("Mi Progreso")).toBeInTheDocument();
    expect(screen.getByText("Plan de estudio")).toBeInTheDocument();
    expect(screen.getByText("Ranking")).toBeInTheDocument();
  });

  it("no renderiza ninguna clave de traducción cruda (patrón 'sidebar.*')", () => {
    render(<SidebarExpanded />);
    const bodyText = document.body.textContent;
    expect(bodyText).not.toMatch(/sidebar\./);
    expect(bodyText).not.toMatch(/ialab\./);
  });

  it("abre el modal de historial (ActivityHistory) al hacer clic en 'Mi Progreso'", () => {
    mockShowHistory.mockClear();
    render(<SidebarExpanded />);
    fireEvent.click(screen.getByText("Mi Progreso"));
    expect(mockShowHistory).toHaveBeenCalledTimes(1);
    expect(mockShowHistory).toHaveBeenCalledWith(true);
  });

  it("colapsa el sidebar al hacer clic en el círculo de progreso", () => {
    mockToggleSidebar.mockClear();
    render(<SidebarExpanded />);
    fireEvent.click(screen.getByRole("progressbar"));
    expect(mockToggleSidebar).toHaveBeenCalledTimes(1);
  });
});
