import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

vi.mock("framer-motion", () => {
  const passthrough = ({ children, ...props }) =>
    React.createElement("div", { className: props.className }, children);
  return { motion: new Proxy({}, { get: () => passthrough }) };
});
vi.mock("../../../../utils/iconMapping", () => ({
  Icon: () => React.createElement("span"),
}));
vi.mock("../../../../utils/speech", () => ({ fireConfetti: () => {} }));

import es from "../../../../i18n/es.json";

const interpolate = (str, params = {}) =>
  str.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? `{${k}}`);
const t = (key, params) =>
  es[key] === undefined ? key : interpolate(es[key], params);
vi.mock("../../../../i18n/I18nProvider", () => ({
  useTranslation: () => ({ t, locale: "es" }),
}));

import { AnswerReview } from "../components/QuizResults";

const questions = [
  {
    id: "q1",
    question: "¿Pregunta de prueba?",
    options: [
      { id: "a", label: "Opción A" },
      { id: "b", label: "Opción B" },
    ],
    correctAnswer: "b",
    topic: "Tema",
    difficulty: "fácil",
    feedback: "Explicación de prueba",
    source: "Fuente X",
  },
];

describe("AnswerReview — explicación por pregunta", () => {
  it("muestra la explicación (en fallo) y la fuente al revisar", () => {
    render(<AnswerReview quizQuestions={questions} quizAnswers={{ q1: "a" }} />);
    fireEvent.click(screen.getByText(/Revisar respuestas/));
    expect(screen.getByText(/Explicación de prueba/)).toBeInTheDocument();
    expect(screen.getByText(/Fuente X/)).toBeInTheDocument();
  });

  it("no muestra la explicación cuando la respuesta es correcta", () => {
    render(<AnswerReview quizQuestions={questions} quizAnswers={{ q1: "b" }} />);
    fireEvent.click(screen.getByText(/Revisar respuestas/));
    expect(screen.queryByText(/Explicación de prueba/)).toBeNull();
    expect(screen.getByText(/Fuente X/)).toBeInTheDocument();
  });
});
