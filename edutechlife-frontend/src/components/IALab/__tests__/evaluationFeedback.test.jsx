import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

const mockCtx = vi.hoisted(() => ({ activeMod: 1 }));

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

vi.mock("@/context/IALabContext", () => ({
  useIALabProgressContext: () => ({
    activeMod: mockCtx.activeMod,
    markExamComplete: vi.fn(),
  }),
}));

vi.mock("@/store/ialabStore", () => ({
  useIALabStore: {
    getState: () => ({
      getChallengeRemainingAttempts: () => 3,
      canAttemptChallengeRetry: () => true,
      getNextAttemptTime: () => null,
    }),
  },
}));

vi.mock("@/hooks/useActivityTracker", () => ({
  useActivityTracker: () => ({ trackActivity: vi.fn() }),
}));

vi.mock("@/hooks/usePremiumStatus", () => ({
  usePremiumStatus: () => ({ isPremium: false }),
}));

vi.mock("canvas-confetti", () => ({ default: vi.fn() }));
vi.mock("@/utils/iconMapping", () => ({ Icon: () => null }));
vi.mock("@/components/IALab/ScoreBreakdown", () => ({ default: () => null }));
vi.mock("@/components/IALab/FeedbackPanel", () => ({ default: () => null }));
vi.mock("@/components/IALab/CompetenceRadar", () => ({ default: () => null }));

import IALabEvaluationResults from "../IALabEvaluationResults";

const evaluation = {
  notaGlobal: 90,
  nota_ej1: 90,
  nota_ej2: 90,
  nota_ej3: 90,
  nota_ej4: 90,
  feedback_ej1: "a",
  feedback_ej2: "b",
  feedback_ej3: "c",
  feedback_ej4: "d",
};

describe("IALabEvaluationResults - mensaje de dominio por módulo", () => {
  beforeEach(() => {
    mockCtx.activeMod = 1;
  });

  it("con moduleId=1 muestra el texto específico del M1", () => {
    render(
      <IALabEvaluationResults evaluation={evaluation} onClose={() => {}} />,
    );

    expect(screen.getByText(/diseño de prompts/i)).toBeInTheDocument();
  });

  it("con moduleId=3 no muestra el texto del M1 y usa el del M3", () => {
    mockCtx.activeMod = 3;
    render(
      <IALabEvaluationResults evaluation={evaluation} onClose={() => {}} />,
    );

    expect(screen.queryByText(/diseño de prompts/i)).toBeNull();
    expect(screen.getByText(/Gemini/i)).toBeInTheDocument();
  });
});
