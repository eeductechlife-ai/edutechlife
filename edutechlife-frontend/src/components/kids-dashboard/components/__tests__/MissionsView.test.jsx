import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { contrastRatio } from "../../../../utils/contrast";

const ctx = {
  darkMode: false,
  studentAge: 12,
  vakResult: null,
  totalPoints: 100,
  pointsHistory: [],
  daniChatHistory: [],
  calendarEvents: [],
  exams: [],
};

vi.mock("../../../../context/IngenIAKidsContext", () => ({
  useIngenIAKids: () => ctx,
}));
vi.mock("../../../../lib/analytics", () => ({ track: vi.fn() }));
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
            whileTap,
            ...rest
          }) => React.createElement(tag, rest, children)),
      },
    ),
  };
});

import MissionsView from "../MissionsView";

const missions = [
  {
    id: 3,
    title: "Habla con Dani",
    description: "Escribe 5 mensajes",
    xp: 75,
    icon: "💬",
    completed: false,
  },
  {
    id: 1,
    title: "Haz tu ADN",
    description: "Descubre cómo aprendes",
    xp: 100,
    icon: "🧠",
    completed: true,
  },
];

const setup = (darkMode) => {
  ctx.darkMode = darkMode;
  return render(
    <MissionsView
      missions={missions}
      onCompleteMission={vi.fn()}
      onTabChange={vi.fn()}
    />,
  );
};

const cardOf = (title) => screen.getByText(title).closest(".rounded-2xl");

describe("MissionsView: modo oscuro", () => {
  beforeEach(() => vi.clearAllMocks());

  it("en tema claro las tarjetas son blancas", () => {
    setup(false);
    expect(cardOf("Habla con Dani").className).toContain("bg-white");
  });

  it("en tema oscuro las tarjetas dejan de ser blancas (antes seguían blancas)", () => {
    setup(true);
    const card = cardOf("Habla con Dani");
    expect(card.className).not.toContain("bg-white");
    expect(card.className).toContain("bg-[#1E293B]");
  });

  it("el título «Misiones de siempre» y los títulos son claros sobre el fondo oscuro", () => {
    setup(true);
    expect(screen.getByText("Habla con Dani").className).toContain(
      "text-white",
    );
    expect(screen.getByText("Habla con Dani").className).not.toContain(
      "text-[#1E293B]",
    );
  });

  it("la tarjeta completada tiene su propio verde oscuro", () => {
    setup(true);
    expect(cardOf("Haz tu ADN").className).toContain("bg-[#0F2A22]");
  });

  it("los textos secundarios usan #94A3B8 en oscuro y #64748B en claro", () => {
    const { unmount } = setup(true);
    expect(screen.getByText("Escribe 5 mensajes").className).toContain(
      "text-[#94A3B8]",
    );
    unmount();
    setup(false);
    expect(screen.getByText("Escribe 5 mensajes").className).toContain(
      "text-[#64748B]",
    );
  });
});

describe("MissionsView: contraste de los colores elegidos", () => {
  const pairs = [
    ["texto secundario claro", "#64748B", "#FFFFFF"],
    ["texto secundario oscuro", "#94A3B8", "#1E293B"],
    ["título oscuro", "#FFFFFF", "#1E293B"],
    ["puntos (morado) claro", "#7B2FF7", "#FFFFFF"],
    ["puntos (morado) oscuro", "#C77DFF", "#1E293B"],
    ["verde de «lograda» claro", "#166534", "#F0FDF4"],
    ["verde de «lograda» oscuro", "#86EFAC", "#0F2A22"],
    ["botón reclamar", "#FFFFFF", "#15803D"],
  ];
  it.each(pairs)("%s cumple 4,5:1", (_n, fg, bg) => {
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(4.5);
  });
});
