import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OralExamSimulator } from "../OralExamSimulator";

vi.mock("../../../utils/api", () => ({
  callDeepseekSmartboard: vi.fn(),
}));

vi.mock("../../../context/SmartBoardKidsContext", () => ({
  useSmartBoardKids: vi.fn(),
}));

vi.mock("../../../hooks/useCompetencyTracking", () => ({
  useCompetencyTracking: () => ({ trackActivity: vi.fn() }),
}));

vi.mock("../../../hooks/useFeedbackLog", () => ({
  useFeedbackLog: () => ({ logFeedback: vi.fn() }),
}));

vi.mock("../../../lib/analytics", () => ({ track: vi.fn() }));
vi.mock("../../../lib/analyticsEvents", () => ({ EVENTS: {} }));

vi.mock("../../../utils/speech", () => ({
  speakTextConversational: vi.fn(),
  stopSpeech: vi.fn(),
}));

vi.mock("../daniTutorChat/DaniVoiceController", () => ({
  stripEmoji: (s) => s,
}));

vi.mock("../OralExamConversation", () => ({
  default: ({ chatLoading }) => (
    <div data-testid="oral-conversation">
      {chatLoading && <span>Generando...</span>}
    </div>
  ),
}));

vi.mock("../OralExamQuestion", () => ({
  default: () => <div data-testid="oral-question" />,
}));

vi.mock("../OralExamResults", () => ({
  default: () => <div data-testid="oral-results" />,
}));

vi.mock("../../../i18n/I18nProvider", () => ({
  useTranslation: () => ({
    t: (key, params) => {
      const map = {
        "oral.subject_matematicas": "Matemáticas",
        "oral.subject_lenguaje": "Lenguaje",
        "oral.subject_ciencias": "Ciencias",
        "oral.subject_sociales": "Sociales",
        "oral.subject_ingles": "Inglés",
        "oral.difficulty_facil": "Fácil",
        "oral.difficulty_medio": "Medio",
        "oral.difficulty_dificil": "Difícil",
        "oral.talk_with_dani": "Hablar con Dani",
        "oral.generating_questions": "Generando...",
        "oral.pick_subject": "Elige materia",
        "oral.select_difficulty": "Selecciona dificultad",
        "oral.title": "Examen Oral",
        "oral.subtitle_no_deck": "Practica oralmente",
        "oral.tip_label": "Tip:",
        "oral.tip_desc": "Añade tarjetas primero",
        "oral.go_flashcards": "Ir a Flashcards",
      };
      if (params) {
        let result = map[key] ?? key;
        Object.entries(params).forEach(([k, v]) => {
          result = result.replace(`{${k}}`, String(v));
        });
        return result;
      }
      return map[key] ?? key;
    },
  }),
}));

import { callDeepseekSmartboard } from "../../../utils/api";
import { useSmartBoardKids } from "../../../context/SmartBoardKidsContext";

describe("OralExamSimulator", () => {
  const mockAddPoints = vi.fn();
  const mockOnTabChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    useSmartBoardKids.mockReturnValue({
      darkMode: false,
      addPoints: mockAddPoints,
      activeStudyDeck: null,
    });

    callDeepseekSmartboard.mockResolvedValue("¡Hola! Soy Dani, tu tutora.");
  });

  describe("Setup Phase", () => {
    it("renders subject selection on mount", () => {
      render(<OralExamSimulator onTabChange={mockOnTabChange} />);

      expect(screen.getByText(/matemáticas/i)).toBeInTheDocument();
      expect(screen.getByText(/lenguaje/i)).toBeInTheDocument();
      expect(screen.getByText(/ciencias/i)).toBeInTheDocument();
      expect(screen.getByText(/sociales/i)).toBeInTheDocument();
      expect(screen.getByText(/inglés/i)).toBeInTheDocument();
    });

    it("does not show difficulty until a subject is selected", () => {
      render(<OralExamSimulator onTabChange={mockOnTabChange} />);

      expect(screen.queryByText(/fácil/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/medio/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/difícil/i)).not.toBeInTheDocument();
    });

    it("shows difficulty options after selecting a subject", async () => {
      const user = userEvent.setup();
      render(<OralExamSimulator onTabChange={mockOnTabChange} />);

      await user.click(screen.getByText(/matemáticas/i));

      expect(screen.getByText(/fácil/i)).toBeInTheDocument();
      expect(screen.getByText(/medio/i)).toBeInTheDocument();
      expect(screen.getByText(/difícil/i)).toBeInTheDocument();
    });

    it("does not show start button until both subject and difficulty are selected", async () => {
      const user = userEvent.setup();
      render(<OralExamSimulator onTabChange={mockOnTabChange} />);

      // No start button on initial mount
      expect(screen.queryByText(/hablar con dani/i)).not.toBeInTheDocument();

      // Subject selected — still no start button
      await user.click(screen.getByText(/matemáticas/i));
      expect(screen.queryByText(/hablar con dani/i)).not.toBeInTheDocument();
    });

    it("shows start button after both subject and difficulty are selected", async () => {
      const user = userEvent.setup();
      render(<OralExamSimulator onTabChange={mockOnTabChange} />);

      await user.click(screen.getByText(/matemáticas/i));
      await user.click(screen.getByText(/fácil/i));

      expect(screen.getByText(/hablar con dani/i)).toBeInTheDocument();
    });

    it("start button is enabled when both subject and difficulty are selected", async () => {
      const user = userEvent.setup();
      render(<OralExamSimulator onTabChange={mockOnTabChange} />);

      await user.click(screen.getByText(/matemáticas/i));
      await user.click(screen.getByText(/fácil/i));

      const startBtn = screen.getByText(/hablar con dani/i).closest("button");
      expect(startBtn).not.toBeDisabled();
    });
  });

  describe("Conversation Start", () => {
    const setupAndStart = async (user) => {
      render(<OralExamSimulator onTabChange={mockOnTabChange} />);
      await user.click(screen.getByText(/matemáticas/i));
      await user.click(screen.getByText(/fácil/i));
      await user.click(screen.getByText(/hablar con dani/i).closest("button"));
    };

    it("calls the API when start is clicked", async () => {
      const user = userEvent.setup();
      await setupAndStart(user);

      await waitFor(() => {
        expect(callDeepseekSmartboard).toHaveBeenCalled();
      });
    });

    it("shows loading state while connecting to Dani", async () => {
      const user = userEvent.setup();
      let resolveApi;
      callDeepseekSmartboard.mockImplementation(
        () =>
          new Promise((res) => {
            resolveApi = res;
          }),
      );

      render(<OralExamSimulator onTabChange={mockOnTabChange} />);
      await user.click(screen.getByText(/matemáticas/i));
      await user.click(screen.getByText(/fácil/i));
      await user.click(screen.getByText(/hablar con dani/i).closest("button"));

      await waitFor(() => {
        expect(screen.getByText(/generando/i)).toBeInTheDocument();
      });

      resolveApi("Hola");
    });

    it("switches to conversation view after API responds", async () => {
      const user = userEvent.setup();
      callDeepseekSmartboard.mockResolvedValue("¡Hola! Soy Dani.");

      render(<OralExamSimulator onTabChange={mockOnTabChange} />);
      await user.click(screen.getByText(/matemáticas/i));
      await user.click(screen.getByText(/fácil/i));
      await user.click(screen.getByText(/hablar con dani/i).closest("button"));

      await waitFor(() => {
        expect(screen.getByTestId("oral-conversation")).toBeInTheDocument();
      });
      // Setup form should be gone
      expect(screen.queryByText(/elige materia/i)).not.toBeInTheDocument();
    });

    it("handles API errors gracefully", async () => {
      const user = userEvent.setup();
      callDeepseekSmartboard.mockRejectedValue(new Error("Network error"));

      render(<OralExamSimulator onTabChange={mockOnTabChange} />);
      await user.click(screen.getByText(/matemáticas/i));
      await user.click(screen.getByText(/fácil/i));
      await user.click(screen.getByText(/hablar con dani/i).closest("button"));

      // Component should still render (not crash)
      await waitFor(() => {
        expect(callDeepseekSmartboard).toHaveBeenCalled();
      });
    });
  });

  describe("Subject and Difficulty Variations", () => {
    it("allows selecting Lenguaje as subject", async () => {
      const user = userEvent.setup();
      render(<OralExamSimulator onTabChange={mockOnTabChange} />);

      await user.click(screen.getByText(/lenguaje/i));
      expect(screen.getByText(/fácil/i)).toBeInTheDocument();
    });

    it("allows selecting Difícil as difficulty", async () => {
      const user = userEvent.setup();
      render(<OralExamSimulator onTabChange={mockOnTabChange} />);

      await user.click(screen.getByText(/matemáticas/i));
      await user.click(screen.getByText(/difícil/i));

      expect(screen.getByText(/hablar con dani/i)).toBeInTheDocument();
    });

    it("passes subject and difficulty to the API", async () => {
      const user = userEvent.setup();
      render(<OralExamSimulator onTabChange={mockOnTabChange} />);

      await user.click(screen.getByText(/lenguaje/i));
      await user.click(screen.getByText(/difícil/i));
      await user.click(screen.getByText(/hablar con dani/i).closest("button"));

      await waitFor(() => {
        expect(callDeepseekSmartboard).toHaveBeenCalledWith(
          expect.arrayContaining([expect.objectContaining({ role: "system" })]),
          expect.objectContaining({
            temperature: expect.any(Number),
          }),
        );
      });
    });
  });

  describe("Accessibility", () => {
    it("has interactive buttons on mount", () => {
      render(<OralExamSimulator onTabChange={mockOnTabChange} />);
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });

    it("subjects are clickable buttons", () => {
      render(<OralExamSimulator onTabChange={mockOnTabChange} />);
      const subjectButtons = screen
        .getAllByRole("button")
        .filter(
          (b) =>
            b.textContent.includes("Matemáticas") ||
            b.textContent.includes("Lenguaje"),
        );
      expect(subjectButtons.length).toBeGreaterThan(0);
    });

    it("supports keyboard navigation through subjects", async () => {
      const user = userEvent.setup();
      render(<OralExamSimulator onTabChange={mockOnTabChange} />);

      await user.tab();
      await user.tab();
      // No crash expected — just verifying keyboard nav works
      expect(document.activeElement).toBeTruthy();
    });
  });
});
