import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import QuizCard from "../QuizCard";

vi.mock("../../../../../i18n/I18nProvider", () => ({
  useTranslation: () => ({ t: (key) => key }),
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

const card = {
  front: "Fotosíntesis",
  back: "Proceso por el que las plantas fabrican su alimento",
  example: "Una hoja al sol",
};

const setup = (props = {}) => {
  const handlers = { onFlip: vi.fn(), onResult: vi.fn() };
  const view = render(
    <QuizCard
      card={card}
      flipped={false}
      idx={0}
      total={3}
      themeColor="#06D6A0"
      {...handlers}
      {...props}
    />,
  );
  return { ...handlers, ...view };
};

describe("QuizCard (EduCards): teclado y lectores de pantalla", () => {
  it("la cara visible es un botón con nombre, que se activa con click o teclado", () => {
    const { onFlip } = setup();
    const button = screen.getByRole("button", { name: /Fotosíntesis/ });
    expect(button.tagName).toBe("BUTTON");
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(button.getAttribute("aria-label")).toContain(
      "kid.flashcards.tap_to_reveal",
    );
    fireEvent.click(button);
    expect(onFlip).toHaveBeenCalledTimes(1);
  });

  it("la respuesta no está expuesta antes de voltear: cara de atrás con aria-hidden e inert", () => {
    setup();
    const back = screen.getByText(card.back).closest("[aria-hidden]");
    expect(back.getAttribute("aria-hidden")).toBe("true");
    expect(back.hasAttribute("inert")).toBe(true);
    // Ni siquiera sus botones se pueden encontrar como accesibles.
    expect(
      screen.queryByRole("button", { name: "kid.flashcards.understood" }),
    ).toBeNull();
  });

  it("al voltear se expone la respuesta y se oculta el frente", () => {
    setup({ flipped: true });
    const front = screen.getByText(card.front).closest("button");
    expect(front.getAttribute("aria-hidden")).toBe("true");
    expect(front.hasAttribute("inert")).toBe(true);
    expect(front.getAttribute("aria-expanded")).toBe("true");
    const back = screen.getByRole("group", {
      name: /kid.flashcards.definition_label/,
    });
    expect(back.hasAttribute("inert")).toBe(false);
    expect(
      screen.getByRole("button", { name: "kid.flashcards.understood" }),
    ).toBeTruthy();
  });

  it("los botones de resultado llaman a onResult con el valor correcto", () => {
    const { onResult } = setup({ flipped: true });
    fireEvent.click(
      screen.getByRole("button", { name: "kid.flashcards.understood" }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "kid.flashcards.not_understood" }),
    );
    expect(onResult).toHaveBeenNthCalledWith(1, true);
    expect(onResult).toHaveBeenNthCalledWith(2, false);
  });

  it("el foco pasa a la respuesta al voltear y vuelve al frente al pasar de tarjeta", () => {
    const { rerender, onFlip, onResult } = setup();
    const props = {
      card,
      idx: 0,
      total: 3,
      themeColor: "#06D6A0",
      onFlip,
      onResult,
    };
    rerender(<QuizCard {...props} flipped={true} />);
    expect(document.activeElement.getAttribute("role")).toBe("group");
    rerender(<QuizCard {...props} flipped={false} />);
    expect(document.activeElement.tagName).toBe("BUTTON");
    expect(document.activeElement.getAttribute("aria-expanded")).toBe("false");
  });

  it("no roba el foco en el primer render", () => {
    setup();
    expect(document.activeElement).toBe(document.body);
  });

  it("el emoji decorativo no se lee", () => {
    setup();
    expect(screen.getByText("📚").getAttribute("aria-hidden")).toBe("true");
  });
});
