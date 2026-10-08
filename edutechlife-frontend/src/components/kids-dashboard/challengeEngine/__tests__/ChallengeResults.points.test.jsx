import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("../../../../context/IngenIAKidsContext", () => ({
  useIngenIAKidsSafe: () => ({ studentAge: 12, setFlashcardDecks: vi.fn() }),
}));
vi.mock("../../improvementPlan/PlanTaskDone", () => ({
  usePlanTaskOnFinish: () => null,
  PlanTaskDoneBanner: () => null,
}));
vi.mock("framer-motion", async () => {
  const React = await import("react");
  const cache = {};
  return {
    motion: new Proxy(
      {},
      {
        get: (_, tag) =>
          (cache[tag] ||= ({
            children,
            initial,
            animate,
            exit,
            transition,
            whileHover,
            whileTap,
            ...rest
          }) => React.createElement(tag, rest, children)),
      },
    ),
  };
});

import ChallengeResults from "../ChallengeResults";

const questions = [1, 2, 3].map((n) => ({
  question: `¿${n}+1?`,
  options: ["1", "2", "3", "4"],
  correct: 0,
  explanation: "porque sí",
}));
const answers = questions.map(() => ({ selectedIndex: 0, isCorrect: true }));

const renderResults = (xpGranted) =>
  render(
    <ChallengeResults
      score={100}
      answers={answers}
      questions={questions}
      difficulty={{ id: "easy", label: "Explorador", xp: 50, questions: 3 }}
      subject={{
        id: "math",
        label: "Matemáticas",
        emoji: "🔢",
        color: "#FB8500",
      }}
      xpGranted={xpGranted}
      onRetry={vi.fn()}
      onEasier={vi.fn()}
      onTabChange={vi.fn()}
      darkMode={false}
    />,
  );

describe("ChallengeResults: muestra los puntos que se dieron", () => {
  it("sin dato del servidor muestra los del reto", () => {
    renderResults(undefined);
    expect(screen.getByText("+50")).toBeTruthy();
    expect(screen.queryByText(/tope de puntos/)).toBeNull();
  });

  it("con todos los puntos dados no avisa de ningún tope", () => {
    renderResults(50);
    expect(screen.getByText("+50")).toBeTruthy();
    expect(screen.queryByText(/tope de puntos/)).toBeNull();
  });

  it("con tope parcial muestra lo dado y lo explica", () => {
    renderResults(20);
    expect(screen.getByText("+20")).toBeTruthy();
    expect(screen.queryByText("+50")).toBeNull();
    expect(
      screen.getByText(/Hoy llegaste al tope de puntos por retos/),
    ).toBeTruthy();
  });

  it("con el tope alcanzado muestra +0 y lo explica (no promete lo que no dio)", () => {
    renderResults(0);
    expect(screen.getByText("+0")).toBeTruthy();
    expect(screen.getByText(/Mañana sigues sumando/)).toBeTruthy();
  });
});
