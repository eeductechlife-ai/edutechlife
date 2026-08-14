import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import QuizCard from "../../components/kids-dashboard/flashcardSystem/components/QuizCard";

const realCards = JSON.parse(
  readFileSync("/tmp/real_cards.json", "utf-8"),
);

describe("QuizCard con tarjetas reales de producción", () => {
  it("renderiza todas las tarjetas reales sin crashear", () => {
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
  });

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
