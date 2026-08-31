import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import QuizCard from "../../components/kids-dashboard/flashcardSystem/components/QuizCard";

// Dump local opcional de tarjetas de producción; en CI/otras máquinas no existe
// y el test se omite en lugar de romper la colección.
let realCards = [];
try {
  realCards = JSON.parse(readFileSync("/tmp/real_cards.json", "utf-8"));
} catch {
  realCards = [];
}

describe("QuizCard con tarjetas reales de producción", () => {
  it.skipIf(realCards.length === 0)(
    "renderiza todas las tarjetas reales sin crashear",
    () => {
      realCards.forEach((card, i) => {
        const { unmount } = render(
          <QuizCard
            card={card}
            flipped={false}
            onFlip={() => {}}
            onResult={() => {}}
            idx={0}
            total={10}
            themeColor="#4DA8C4"
            themeIcon="📚"
          />,
        );
        unmount();
      });
    },
  );

  it("renderiza con tarjeta indefinida (deck vacío) sin crashear", () => {
    expect(() =>
      render(
        <QuizCard
          card={undefined}
          flipped={false}
          onFlip={() => {}}
          onResult={() => {}}
          idx={0}
          total={1}
        />,
      ),
    ).not.toThrow();
  });
});
