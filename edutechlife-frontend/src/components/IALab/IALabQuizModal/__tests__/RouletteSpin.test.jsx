import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

vi.mock("framer-motion", () => {
  const motion = new Proxy(
    {},
    {
      get: (_, tag) => {
        const Tag = typeof tag === "string" ? tag : "div";
        const Comp = ({ children, ...props }) =>
          React.createElement(
            Tag,
            {
              className: props.className,
              onClick: props.onClick,
              disabled: props.disabled,
            },
            children,
          );
        return Comp;
      },
    },
  );
  return { motion, useReducedMotion: () => true };
});
vi.mock("../../../../utils/iconMapping", () => ({
  Icon: () => React.createElement("span"),
}));

import es from "../../../../i18n/es.json";
const t = (k) => es[k] ?? k;
vi.mock("../../../../i18n/I18nProvider", () => ({
  useTranslation: () => ({ t, locale: "es" }),
}));

import RouletteSpin from "../components/RouletteSpin";

describe("RouletteSpin", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("al girar, corre el marcador y revela la pregunta", () => {
    const onReveal = vi.fn();
    render(<RouletteSpin total={10} onReveal={onReveal} />);
    fireEvent.click(screen.getByRole("button", { name: /Girar la ruleta/i }));
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(onReveal).toHaveBeenCalledTimes(1);
  });

  it("no vuelve a girar mientras está girando", () => {
    const onReveal = vi.fn();
    render(<RouletteSpin total={10} onReveal={onReveal} />);
    const btn = screen.getByRole("button", { name: /Girar la ruleta/i });
    fireEvent.click(btn);
    fireEvent.click(btn);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(onReveal).toHaveBeenCalledTimes(1);
  });
});
