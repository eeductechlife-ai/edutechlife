import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import ChallengePlay from "../ChallengePlay";

const question = {
  question: "¿Cuánto es 7 × 8?",
  options: ["54", "56", "64", "48"],
  correct: 1,
  explanation: "7 × 8 = 56.",
};
const subject = {
  id: "math",
  label: "Matemáticas",
  emoji: "🔢",
  color: "#FB8500",
};

function setup(props = {}) {
  const onAnswer = vi.fn();
  render(
    <ChallengePlay
      question={question}
      currentIndex={0}
      total={3}
      onAnswer={onAnswer}
      subject={subject}
      timeLimit={null}
      {...props}
    />,
  );
  return { onAnswer };
}

describe("ChallengePlay", () => {
  it("waits for the student before moving on, so the explanation can be read", () => {
    const { onAnswer } = setup();
    fireEvent.click(screen.getByText("56"));
    expect(screen.getByText(/7 × 8 = 56/)).toBeInTheDocument();
    expect(onAnswer).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText("Siguiente →"));
    expect(onAnswer).toHaveBeenCalledWith(1);
  });

  it("shows the correct answer after a mistake", () => {
    const { onAnswer } = setup();
    fireEvent.click(screen.getByText("64"));
    expect(screen.getByText(/La respuesta correcta es/)).toBeInTheDocument();
    fireEvent.click(screen.getByText("Siguiente →"));
    expect(onAnswer).toHaveBeenCalledWith(2);
  });

  it("has no countdown for young students", () => {
    setup({ timeLimit: null });
    expect(screen.queryByRole("timer")).toBeNull();
  });

  it("reveals the answer when time runs out and reports -1", () => {
    vi.useFakeTimers();
    const { onAnswer } = setup({ timeLimit: 2 });
    act(() => vi.advanceTimersByTime(1000));
    act(() => vi.advanceTimersByTime(1000));
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByText(/Se acabó el tiempo/)).toBeInTheDocument();
    fireEvent.click(screen.getByText("Siguiente →"));
    expect(onAnswer).toHaveBeenCalledWith(-1);
    vi.useRealTimers();
  });

  it("labels the last question's button as the result step", () => {
    setup({ currentIndex: 2 });
    fireEvent.click(screen.getByText("56"));
    expect(screen.getByText(/Ver mi resultado/)).toBeInTheDocument();
  });
});
