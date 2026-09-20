import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// t() con las traducciones reales de es.json: si el componente omite el
// parámetro {score}, el placeholder literal queda visible en pantalla.
vi.mock("@/i18n/I18nProvider", async () => {
  const es = (await import("@/i18n/es.json")).default;
  const t = (key, params) => {
    let value = es[key] ?? key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        value = value.replaceAll(`{${k}}`, String(v));
      });
    }
    return value;
  };
  return { useTranslation: () => ({ t, locale: "es", setLocale: () => {} }) };
});

vi.mock("@/utils/iconMapping", () => ({ Icon: () => null }));
vi.mock("@/utils/speech", () => ({ fireConfetti: vi.fn() }));
vi.mock("@/store/ialabStore", () => ({ useIALabStore: vi.fn() }));

import { QuizResults } from "../IALabQuizModal/components/QuizResults";

const renderPassed = () =>
  render(
    <QuizResults
      quizQuestions={[]}
      quizAnswers={{}}
      quizScore={80}
      quizPassed
      quizResult={{ correctCount: 4, failedQuestions: [] }}
      activeMod={1}
      PASSING_SCORE={80}
      TOTAL_QUESTIONS={5}
      generateTopicFeedback={() => []}
      isAdmin={false}
      onClose={() => {}}
      onRetry={() => {}}
    />,
  );

describe("QuizResults - feedback aprobado", () => {
  it("interpola el umbral real (80%) sin placeholders", () => {
    const { container } = renderPassed();

    expect(screen.getByText(/Aprobaste con 80%/)).toBeInTheDocument();
    expect(container.textContent).not.toContain("{");
  });
});
