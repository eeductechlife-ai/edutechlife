import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
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

import GeminiWelcome from "../GeminiWelcome";

const topics = [{ title: "Tema A" }, { title: "Tema B" }];

describe("GeminiWelcome — temas completados", () => {
  it("marca en verde solo los temas completados", () => {
    const sequenceByIndex = new Map([
      [0, { index: 0, isCompleted: true }],
      [1, { index: 1, isCompleted: false }],
    ]);
    render(
      <GeminiWelcome
        topics={topics}
        sequenceByIndex={sequenceByIndex}
        onSelectSection={() => {}}
        onSelectTopic={() => {}}
        onHome={() => {}}
      />,
    );
    expect(screen.getByTestId("gem-topic-completed-0")).toBeInTheDocument();
    expect(screen.queryByTestId("gem-topic-completed-1")).toBeNull();
  });

  it("localiza los textos del chrome (i18n)", () => {
    render(
      <GeminiWelcome
        topics={topics}
        onSelectSection={() => {}}
        onSelectTopic={() => {}}
        onHome={() => {}}
      />,
    );
    expect(screen.getByText("Objetivos")).toBeInTheDocument();
  });
});
