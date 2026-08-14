import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import ModulePractice from "./ModulePractice";

const translations = {
  "ialab.practice.title": "Practicar",
  "ialab.practice.subtitle": "Refuerza tu aprendizaje",
  "ialab.practice.tool_prompts": "Herramientas para Crear Prompts",
  "ialab.practice.tool_prompts_desc": "Mejora tus prompts",
  "ialab.practice.tool_tutoring": "Tutorías Virtuales",
  "ialab.practice.tool_tutoring_desc": "Conecta en vivo",
  "ialab.practice.flashcards_hint":
    "¿Buscas repasar con flashcards? Están al final del último tema de cada módulo: repasa y gana +30 XP.",
};

vi.mock("framer-motion", () => {
  const passthrough = ({ children, ...props }) => {
    const { whileHover, whileTap, ...rest } = props;
    return React.createElement("button", rest, children);
  };
  return {
    AnimatePresence: ({ children }) => children,
    motion: new Proxy(
      {},
      { get: (_, tag) => (tag === "button" ? "button" : passthrough) },
    ),
    useReducedMotion: () => true,
  };
});

vi.mock("../../i18n/I18nProvider", () => ({
  useTranslation: () => ({ t: (k) => translations[k] || k }),
}));

vi.mock("../../utils/iconMapping", () => ({
  Icon: ({ name }) => <span data-testid="icon" data-icon={name} />,
}));

describe("ModulePractice", () => {
  it("renders the two practice tools with their labels", () => {
    render(<ModulePractice activeMod={1} onAction={vi.fn()} />);

    expect(screen.getByText("Herramientas para Crear Prompts")).toBeInTheDocument();
    expect(screen.getByText("Tutorías Virtuales")).toBeInTheDocument();
  });

  it("shows the flashcards hint pointing to the last topic", () => {
    render(<ModulePractice activeMod={1} onAction={vi.fn()} />);

    expect(screen.getByText(/Están al final del último tema de cada módulo/)).toBeInTheDocument();
  });

  it("triggers onAction with OPEN_TOOL_PROMPTS when the module tool is clicked", () => {
    const onAction = vi.fn();
    render(<ModulePractice activeMod={1} onAction={onAction} />);

    fireEvent.click(screen.getByText("Herramientas para Crear Prompts"));
    expect(onAction).toHaveBeenCalledWith("OPEN_TOOL_PROMPTS");
  });

  it("triggers onAction with OPEN_TUTORING when tutoring is clicked", () => {
    const onAction = vi.fn();
    render(<ModulePractice activeMod={1} onAction={onAction} />);

    fireEvent.click(screen.getByText("Tutorías Virtuales"));
    expect(onAction).toHaveBeenCalledWith("OPEN_TUTORING");
  });
});
