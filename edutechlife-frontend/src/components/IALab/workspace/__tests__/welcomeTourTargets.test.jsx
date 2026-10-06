import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

vi.mock("framer-motion", () => {
  const passthrough = ({ children, ...props }) =>
    React.createElement("div", { className: props.className }, children);
  return { motion: new Proxy({}, { get: () => passthrough }) };
});

import es from "../../../../i18n/es.json";

const t = (key) => (es[key] === undefined ? key : es[key]);
vi.mock("../../../../i18n/I18nProvider", () => ({
  useTranslation: () => ({ t, locale: "es", setLocale: vi.fn() }),
}));

import ArtesanoWelcome from "../ArtesanoWelcome";
import ChatGPTWelcome from "../ChatGPTWelcome";
import GeminiWelcome from "../GeminiWelcome";
import GuardianWelcome from "../GuardianWelcome";
import NotebookLMWelcome from "../NotebookLMWelcome";

const props = {
  topics: [{ title: "Tema A" }],
  onSelectSection: () => {},
  onSelectTopic: () => {},
  onHome: () => {},
};

// El tour apunta a estas tarjetas en móvil/tablet (donde las pestañas de
// escritorio no existen): Objetivos, Contenido, Actividades y Práctica.
const WELCOMES = [
  ["ArtesanoWelcome", ArtesanoWelcome],
  ["ChatGPTWelcome", ChatGPTWelcome],
  ["GeminiWelcome", GeminiWelcome],
  ["GuardianWelcome", GuardianWelcome],
  ["NotebookLMWelcome", NotebookLMWelcome],
];

describe.each(WELCOMES)("%s — objetivos del tour", (_name, Component) => {
  it("marca las tarjetas de sección con data-tour", () => {
    const { container } = render(<Component {...props} />);
    const marks = [...container.querySelectorAll("[data-tour]")].map((e) =>
      e.getAttribute("data-tour"),
    );
    for (const section of [
      "objetivos",
      "contenido",
      "actividades",
      "practica",
    ]) {
      expect(marks).toContain(`tour-section-${section}`);
    }
  });
});
