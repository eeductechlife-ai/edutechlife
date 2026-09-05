import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import FlashcardSystem from "../../components/kids-dashboard/flashcardSystem/FlashcardSystem";

const { mockState } = vi.hoisted(() => ({ mockState: { value: null } }));

vi.mock("@/context/SmartBoardKidsContext", () => ({
  useSmartBoardKids: () => mockState.value,
}));

// Dump local opcional; en CI/otras máquinas se usa un fixture determinista.
let realDecks = [];
try {
  realDecks = JSON.parse(readFileSync("/tmp/real_decks.json", "utf-8"));
} catch {
  realDecks = [];
}
const decks = realDecks.length
  ? realDecks
  : [
      {
        id: "fixture-deck",
        title: "Mazo de prueba",
        cards: [
          { id: "c1", front: "PALABRA CLAVE", back: "definición de prueba" },
        ],
        stats: {},
        metadata: {},
      },
    ];

function setupDecks(deckList) {
  mockState.value = {
    flashcardDecks: deckList,
    setFlashcardDecks: () => {},
    activeStudyDeck: null,
    setActiveStudyDeck: () => {},
  };
}

describe("FlashcardSystem con mazos (reales si hay dump local, si no fixture)", () => {
  it("renderiza la lista de mazos sin crashear", () => {
    setupDecks(decks);
    expect(() => render(<FlashcardSystem />)).not.toThrow();
  });

  it("no crashea al renderizar un mazo con tarjetas", () => {
    setupDecks(decks);
    expect(() => render(<FlashcardSystem />)).not.toThrow();
  });

  it("no crashea al renderizar un mazo vacío (0 tarjetas)", () => {
    setupDecks([
      {
        id: "empty-deck",
        title: "mazo vacío",
        cards: [],
        stats: {},
        metadata: {},
      },
    ]);
    expect(() => render(<FlashcardSystem />)).not.toThrow();
  });

  it("no crashea al renderizar con un mazo vacío primero", () => {
    setupDecks([
      {
        id: "empty-deck",
        title: "mazo vacío",
        cards: [],
        stats: {},
        metadata: {},
      },
      ...decks,
    ]);
    expect(() => render(<FlashcardSystem />)).not.toThrow();
  });
});
