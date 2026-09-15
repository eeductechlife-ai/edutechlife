import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

vi.mock("framer-motion", () => {
  const passthrough = ({ children, ...props }) =>
    React.createElement("div", { className: props.className }, children);
  return { motion: new Proxy({}, { get: () => passthrough }) };
});

import es from "../../../../i18n/es.json";

const interpolate = (str, params = {}) =>
  str.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? `{${k}}`);
const t = (key, params) =>
  es[key] === undefined ? key : interpolate(es[key], params);
vi.mock("../../../../i18n/I18nProvider", () => ({
  useTranslation: () => ({ t, locale: "es", setLocale: vi.fn() }),
}));

import NotebookLMWelcome from "../NotebookLMWelcome";

const topics = [
  { title: "El Alquimista de Documentos", duration: "20 min" },
  { title: "El Arte de la Curaduría", duration: "20 min" },
  { title: "La Fórmula Secreta", duration: "44 min" },
];

describe("NotebookLMWelcome — temas completados", () => {
  it("marca en verde solo los temas completados", () => {
    const sequenceByIndex = new Map([
      [0, { index: 0, isCompleted: true }],
      [1, { index: 1, isCompleted: false }],
    ]);
    render(
      <NotebookLMWelcome
        topics={topics}
        sequenceByIndex={sequenceByIndex}
        onSelectSection={() => {}}
        onSelectTopic={() => {}}
        onHome={() => {}}
      />,
    );
    expect(screen.getByTestId("nlm-topic-completed-0")).toBeInTheDocument();
    expect(screen.queryByTestId("nlm-topic-completed-1")).toBeNull();
  });

  it("el tile 'Desafío' del Studio dispara OPEN_CHALLENGE", () => {
    const onAction = vi.fn();
    render(
      <NotebookLMWelcome
        topics={topics}
        onAction={onAction}
        onSelectSection={() => {}}
        onSelectTopic={() => {}}
        onHome={() => {}}
      />,
    );
    fireEvent.click(screen.getByTestId("studio-tile-desafio"));
    expect(onAction).toHaveBeenCalledWith("OPEN_CHALLENGE");
  });

  it("localiza los textos del chrome (i18n)", () => {
    render(
      <NotebookLMWelcome
        topics={topics}
        onSelectSection={() => {}}
        onSelectTopic={() => {}}
        onHome={() => {}}
      />,
    );
    expect(screen.getByText("Temas del módulo")).toBeInTheDocument();
  });
});
