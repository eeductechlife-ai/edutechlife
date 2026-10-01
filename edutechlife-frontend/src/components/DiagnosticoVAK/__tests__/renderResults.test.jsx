import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import renderResults from "../screens/renderResults";
import QuestionCard from "../components/QuestionCard";

vi.mock("framer-motion", async () => {
  const React = await import("react");
  return {
    motion: new Proxy(
      {},
      {
        get:
          (_, tag) =>
          ({ children, initial, animate, transition, whileTap, ...rest }) =>
            React.createElement(tag, rest, children),
      },
    ),
    AnimatePresence: ({ children }) => children,
  };
});

// Interpolates {params} so the assertions read like the real screen.
const t = (key, params = {}) =>
  Object.entries(params).reduce((acc, [k, v]) => `${acc} ${k}=${v}`, key);

const Results = (props) =>
  renderResults({
    t,
    parentName: "",
    setParentName: vi.fn(),
    onViewDocument: vi.fn(),
    onReset: vi.fn(),
    onPractice: vi.fn(),
    reduceMotion: true,
    ...props,
  });

const diagnosis = (overrides = {}) => ({
  studentName: "Ana",
  predominantStyle: "visual",
  secondaryStyle: null,
  isMixed: false,
  scores: { visual: 60, auditivo: 25, kinestesico: 15 },
  styleDetails: { name: "APRENDIZ VISUAL" },
  ...overrides,
});

describe("results screen", () => {
  it("shows the three percentages and one clear main action", () => {
    render(<Results diagnosis={diagnosis()} />);
    expect(screen.getByText("60%")).toBeInTheDocument();
    expect(screen.getByText("25%")).toBeInTheDocument();
    expect(screen.getByText("15%")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /result_cta_practice/ }),
    ).toBeInTheDocument();
  });

  it("names both styles when the profile is mixed", () => {
    render(
      <Results
        diagnosis={diagnosis({
          isMixed: true,
          secondaryStyle: "auditivo",
          scores: { visual: 40, auditivo: 35, kinestesico: 25 },
        })}
      />,
    );
    expect(
      screen.getByText(/result_mix_mixed first=Visual second=Auditivo/),
    ).toBeInTheDocument();
  });

  it("starts practice in IngenIA from the main button", () => {
    const onPractice = vi.fn();
    render(<Results diagnosis={diagnosis()} onPractice={onPractice} />);
    fireEvent.click(
      screen.getByRole("button", { name: /result_cta_practice/ }),
    );
    expect(onPractice).toHaveBeenCalledTimes(1);
  });

  it("does not describe the result as a diagnosis or a career fit", () => {
    const { container } = render(<Results diagnosis={diagnosis()} />);
    expect(container.textContent).not.toMatch(
      /diagn[oó]stico|carrera|psic[oó]log/i,
    );
  });
});

describe("question card", () => {
  const question = {
    emoji: "🌋",
    context: "Tu profe va a explicar un volcán.",
    text: "¿Qué te ayudaría más?",
    options: [
      { text: "Ver un video", emoji: "🎞️", type: "visual" },
      { text: "Escuchar una historia", emoji: "🎙️", type: "auditivo" },
      { text: "Armar una maqueta", emoji: "🧪", type: "kinestesico" },
    ],
  };

  const baseProps = {
    question,
    currentQuestion: 3,
    totalQuestions: 12,
    selectedText: "Escuchar una historia",
    mode: "pro",
    isSpeaking: true,
    onAnswer: vi.fn(),
    onBack: vi.fn(),
    onListen: vi.fn(),
    t: (k) => k,
  };

  it("keeps the answers clickable while Valeria is speaking", () => {
    const onAnswer = vi.fn();
    render(<QuestionCard {...baseProps} onAnswer={onAnswer} />);
    const option = screen.getByRole("button", { name: /Armar una maqueta/ });
    expect(option).not.toBeDisabled();
    fireEvent.click(option);
    expect(onAnswer).toHaveBeenCalledWith(question.options[2]);
  });

  it("marks the answer already given", () => {
    render(<QuestionCard {...baseProps} />);
    expect(
      screen.getByRole("button", { name: /Escuchar una historia/ }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("lets the student go back except on the first question", () => {
    const onBack = vi.fn();
    const { rerender } = render(
      <QuestionCard {...baseProps} onBack={onBack} />,
    );
    fireEvent.click(screen.getByRole("button", { name: /vak.ui.previous/ }));
    expect(onBack).toHaveBeenCalledTimes(1);

    rerender(
      <QuestionCard {...baseProps} currentQuestion={0} onBack={onBack} />,
    );
    expect(
      screen.getByRole("button", { name: /vak.ui.previous/ }),
    ).toBeDisabled();
  });
});
