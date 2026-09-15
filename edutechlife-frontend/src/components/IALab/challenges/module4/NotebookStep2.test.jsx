import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

vi.mock("framer-motion", () => {
  const motion = new Proxy(
    {},
    {
      get: () => ({ children, ...props }) =>
        React.createElement("div", props, children),
    },
  );
  return {
    motion,
    AnimatePresence: ({ children }) =>
      React.createElement(React.Fragment, null, children),
    useReducedMotion: () => true,
  };
});

vi.mock("../../../../utils/iconMapping.jsx", () => ({
  Icon: () => React.createElement("span", { "data-testid": "icon" }),
}));

vi.mock("../../../../i18n/I18nProvider", () => ({
  useTranslation: () => ({ t: (k) => k, locale: "es" }),
}));

vi.mock("../../challenges/shared/AutoGrowTextarea", () => ({
  default: () => React.createElement("textarea"),
}));
vi.mock("../../challenges/shared/StepFeedback", () => ({
  default: () => null,
}));
vi.mock("../../challenges/shared/ExampleToggle", () => ({
  default: () => null,
}));
vi.mock("../../challenges/shared/ResearchContextBanner", () => ({
  default: () => null,
}));
vi.mock("../../challenges/shared/ProgressStepper", () => ({
  default: () => null,
}));

import NotebookStep2 from "./NotebookStep2";

describe("NotebookStep2 — preguntas de síntesis", () => {
  it("muestra las preguntas de síntesis del ejercicio aunque no haya documentos seleccionados", () => {
    render(
      <NotebookStep2
        exercise={{}}
        exercises={{ preguntasSintesis: ["¿Pregunta uno?", "¿Pregunta dos?"] }}
        response=""
        onResponseChange={() => {}}
        selectedDocs={[]}
      />,
    );
    expect(screen.getByText("¿Pregunta uno?")).toBeInTheDocument();
    expect(screen.getByText("¿Pregunta dos?")).toBeInTheDocument();
  });

  it("no muestra el panel si no hay preguntas", () => {
    render(
      <NotebookStep2
        exercise={{}}
        exercises={{}}
        response=""
        onResponseChange={() => {}}
        selectedDocs={[]}
      />,
    );
    expect(screen.queryByText("¿Pregunta uno?")).toBeNull();
  });
});
