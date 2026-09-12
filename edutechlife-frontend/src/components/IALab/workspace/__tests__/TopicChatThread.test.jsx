import React from "react";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import TopicChatThread from "../TopicChatThread";
import { useIALabStore } from "../../../../store/ialabStore";

vi.mock("framer-motion", () => {
  const passthrough = ({ children, ...props }) => {
    const {
      initial,
      animate,
      exit,
      transition,
      variants,
      whileHover,
      whileTap,
      ...rest
    } = props;
    return React.createElement("div", rest, children);
  };
  return {
    AnimatePresence: ({ children }) => children,
    useReducedMotion: () => true,
    motion: new Proxy(
      {},
      { get: (_, tag) => (tag === "button" ? "button" : passthrough) },
    ),
  };
});

vi.mock("../../../i18n/I18nProvider", () => ({
  useTranslation: () => ({ t: (k) => k, locale: "es", setLocale: vi.fn() }),
}));

vi.mock("../../../utils/iconMapping", () => ({
  Icon: ({ name }) => <span data-testid="icon" data-icon={name} />,
}));

// Modal de mentira: expone un botón que simula el fin del recurso.
vi.mock("../../ResourceViewerModal", () => ({
  default: ({ onMarkAsViewed, resource }) => (
    <button
      data-testid="mock-mark"
      onClick={() => onMarkAsViewed?.(resource?.id)}
    >
      mark
    </button>
  ),
}));

beforeEach(() => {
  localStorage.clear();
  vi.useRealTimers();
});

describe("TopicChatThread — secuencia y auto-avance", () => {
  test("bloquea recursos posteriores y marca verde los vistos", () => {
    render(<TopicChatThread topicIndex={0} activeMod={1} />);

    const first = screen.getByTestId("resource-btn-intro-video-1");
    const second = screen.getByTestId("resource-btn-intro-ova-1");

    expect(first).not.toBeDisabled();
    expect(second).toBeDisabled();
  });

  test("al completar el tema auto-avanza al siguiente tema", async () => {
    localStorage.setItem(
      "ialab_viewed_resources::anon",
      JSON.stringify(["intro-video-1"]),
    );

    const onAdvanceTopic = vi.fn();
    render(
      <TopicChatThread
        topicIndex={0}
        activeMod={1}
        onAdvanceTopic={onAdvanceTopic}
      />,
    );

    fireEvent.click(screen.getByTestId("resource-btn-intro-ova-1"));
    fireEvent.click(await screen.findByTestId("mock-mark"));

    await waitFor(() => expect(onAdvanceTopic).toHaveBeenCalledWith(1), {
      timeout: 3000,
    });
  });

  test("no auto-avanza en el último tema y ofrece ir a actividades", async () => {
    localStorage.setItem(
      "ialab_viewed_resources::anon",
      JSON.stringify([
        "intro-video-1",
        "intro-ova-1",
        "prompt-video-1",
        "prompt-guide-1",
        "prompt-ova-html-1",
      ]),
    );

    const onAdvanceTopic = vi.fn();
    const onGoToActivities = vi.fn();
    render(
      <TopicChatThread
        topicIndex={1}
        activeMod={1}
        onAdvanceTopic={onAdvanceTopic}
        onGoToActivities={onGoToActivities}
      />,
    );

    fireEvent.click(screen.getByTestId("resource-btn-prompt-lab-ova-1"));
    fireEvent.click(await screen.findByTestId("mock-mark"));
    // El modal real también persiste el recurso visto (markResourceInContext).
    act(() => {
      useIALabStore.getState().addViewedResource("prompt-lab-ova-1");
    });
    fireEvent.click(
      await screen.findByText("ialab.continue_to_activities"),
    );

    expect(onAdvanceTopic).not.toHaveBeenCalled();
    expect(onGoToActivities).toHaveBeenCalled();
  });

  test("resuelve recursos aunque el título de lessons difiera del de topics (módulo 3, tema 2)", () => {
    render(<TopicChatThread topicIndex={1} activeMod={3} />);

    expect(
      screen.getByTestId("resource-btn-workspace-template-1"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("resource-btn-workspace-ova-1"),
    ).toBeInTheDocument();
  });
});
