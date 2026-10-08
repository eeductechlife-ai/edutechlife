import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("../../../i18n/I18nProvider", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));
vi.mock("../../../context/IngenIAKidsContext", () => ({
  useIngenIAKids: () => ({ darkMode: false, addPoints: vi.fn() }),
}));
vi.mock("../../../utils/api", () => ({ callDeepseekIngenia: vi.fn() }));
vi.mock("../../../utils/speech", () => ({
  speakTextConversational: vi.fn(),
  stopSpeech: vi.fn(),
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
    AnimatePresence: ({ children }) => children,
  };
});

import StudyPodcast from "../StudyPodcast";

describe("StudyPodcast", () => {
  it("se muestra sin romperse (el componente principal usaba t sin definirla)", () => {
    render(<StudyPodcast />);
    expect(screen.getByText("kid.podcast.title")).toBeTruthy();
    expect(screen.getByText("kid.podcast.generate_btn")).toBeTruthy();
  });
});
