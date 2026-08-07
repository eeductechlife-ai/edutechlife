import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { readFileSync } from "node:fs";
import FlashcardSystem from "../../components/kids-dashboard/flashcardSystem/FlashcardSystem";

const { mockState } = vi.hoisted(() => ({ mockState: { value: null } }));

vi.mock("@/context/SmartBoardKidsContext", () => ({
  useSmartBoardKids: () => mockState.value,
}));

const realDecks = JSON.parse(readFileSync("/tmp/real_decks.json", "utf-8"));

function setupDecks(decks) {
  mockState.value = {
    flashcardDecks: decks,
    setFlashcardDecks: () => {},
    activeStudyDeck: null,
    setActiveStudyDeck: () => {},
  };
}

describe("FlashcardSystem con mazos reales de producción", () => {
  it("renderiza la lista de mazos reales sin crashear", () => {
    setupDecks(realDecks);
    expect(() => render(<FlashcardSystem />)).not.toThrow();
  });

  it("no crashea al entrar a estudiar un mazo con tarjetas", () => {
    setupDecks(realDecks);
    render(<FlashcardSystem />);
    const studyButtons = screen.getAllByText("📖 Estudiar");
    expect(studyButtons.length).toBeGreaterThan(0);
    expect(() => fireEvent.click(studyButtons[0])).not.toThrow();
    expect(screen.queryByText("PALABRA CLAVE")).toBeTruthy();
  });

  it("no crashea al entrar a estudiar un mazo vacío (0 tarjetas)", () => {
    setupDecks([
      {
        id: "empty-deck",
        title: "mazo vacío",
        cards: [],
        stats: {},
        metadata: {},
      },
    ]);
    render(<FlashcardSystem />);
    const studyButtons = screen.getAllByText("📖 Estudiar");
    expect(() => fireEvent.click(studyButtons[0])).not.toThrow();
  });

  it("no crashea al iniciar modo 2 jugadores con mazo vacío primero", () => {
    setupDecks([
      {
        id: "empty-deck",
        title: "mazo vacío",
        cards: [],
        stats: {},
        metadata: {},
      },
      ...realDecks,
    ]);
    render(<FlashcardSystem />);
    const mpButton = screen.getByText(/Modo 2 Jugadores/);
    expect(() => fireEvent.click(mpButton)).not.toThrow();
  });
});
