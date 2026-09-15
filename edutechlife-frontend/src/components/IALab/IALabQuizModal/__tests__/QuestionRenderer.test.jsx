import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

vi.mock("../../../../utils/iconMapping", () => ({
  Icon: () => React.createElement("span"),
}));
vi.mock("../../VoiceReader", () => ({ default: () => null }));

import es from "../../../../i18n/es.json";
const interpolate = (str, params = {}) =>
  str.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? `{${k}}`);
const t = (key, params) =>
  es[key] === undefined ? key : interpolate(es[key], params);
vi.mock("../../../../i18n/I18nProvider", () => ({
  useTranslation: () => ({ t, locale: "es" }),
}));

import { QuestionRenderer } from "../components/QuestionRenderer";

const question = {
  id: "q1",
  question: "¿Pregunta?",
  options: [
    { id: "a", label: "Opción A" },
    { id: "b", label: "Opción B" },
  ],
  correctAnswer: "a",
  topic: "Tema",
  difficulty: "fácil",
};

const baseProps = {
  question,
  questionIndex: 0,
  totalQuestions: 1,
  markedQuestions: new Set(),
  onSelectAnswer: () => {},
  onToggleMark: () => {},
};

describe("QuestionRenderer — feedback inmediato", () => {
  it("con feedback: verde en la correcta y rojo en la elegida incorrecta", () => {
    render(<QuestionRenderer {...baseProps} selectedAnswer="b" showFeedback />);
    expect(document.getElementById("quiz-option-0-a").className).toContain(
      "border-emerald-500",
    );
    expect(document.getElementById("quiz-option-0-b").className).toContain(
      "border-red-500",
    );
  });

  it("sin feedback: no colorea correcta ni incorrecta", () => {
    render(
      <QuestionRenderer {...baseProps} selectedAnswer="b" showFeedback={false} />,
    );
    expect(document.getElementById("quiz-option-0-a").className).not.toContain(
      "border-emerald-500",
    );
    expect(document.getElementById("quiz-option-0-b").className).not.toContain(
      "border-red-500",
    );
  });
});
