import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useState } from "react";

const article = {
  id: "a1",
  category: "ia",
  title: "Cómo aprende una IA",
  summary: "Resumen corto",
  content: "Contenido completo del artículo.",
  readTime: "3 min",
  source: "Fuente de prueba",
};

vi.mock("framer-motion", async () => {
  const React = await import("react");
  const cache = {};
  return {
    motion: new Proxy(
      {},
      {
        get: (_, tag) =>
          (cache[tag] ||= React.forwardRef(
            (
              {
                children,
                initial,
                animate,
                exit,
                transition,
                whileHover,
                whileTap,
                layout,
                ...rest
              },
              ref,
            ) => React.createElement(tag, { ...rest, ref }, children),
          )),
      },
    ),
    AnimatePresence: ({ children }) => children,
  };
});
vi.mock("../../../../context/IngenIAKidsContext", () => ({
  useIngenIAKids: () => ({
    darkMode: false,
    setDocumentForDani: vi.fn(),
    addPoints: vi.fn(),
    studentAge: 12,
  }),
}));
vi.mock("../../practicarHub/practicarProgress", () => ({
  logPractice: vi.fn(),
}));
vi.mock("../../../../hooks/useReadReward", () => ({ useReadReward: vi.fn() }));
vi.mock("../../../../hooks/useNewsFeed", () => ({
  useNewsFeed: () => {
    const [openArticle, setOpenArticle] = useState(null);
    return {
      articles: [article],
      allArticles: [article],
      activeCategory: "ia",
      setCategory: vi.fn(),
      isLoading: false,
      error: null,
      readNews: [],
      unreadCount: 1,
      markAsRead: vi.fn(),
      openArticle,
      setOpenArticle,
    };
  },
}));

import TechNewsFeed from "../TechNewsFeed";

describe("TechNewsFeed: el artículo abierto es un cuadro de diálogo", () => {
  beforeEach(() => vi.clearAllMocks());

  const open = () => {
    render(<TechNewsFeed />);
    fireEvent.click(
      screen.getByRole("button", { name: `Leer: ${article.title}` }),
    );
  };

  it("tiene role=dialog, aria-modal y se nombra con el título del artículo", () => {
    open();
    const dialog = screen.getByRole("dialog");
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    const labelledBy = dialog.getAttribute("aria-labelledby");
    expect(document.getElementById(labelledBy).textContent).toBe(article.title);
    expect(screen.getByRole("dialog", { name: article.title })).toBeTruthy();
  });

  it("el foco entra al cuadro al abrirse", () => {
    open();
    const dialog = screen.getByRole("dialog");
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it("Escape lo cierra", () => {
    open();
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("el botón Cerrar lo cierra", () => {
    open();
    fireEvent.click(screen.getByRole("button", { name: "Cerrar artículo" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("sin artículo abierto no hay diálogo", () => {
    render(<TechNewsFeed />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
