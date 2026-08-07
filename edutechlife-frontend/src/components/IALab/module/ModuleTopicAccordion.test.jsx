import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import ModuleTopicAccordion from "./ModuleTopicAccordion";
import { getModuleOverviewData, getModuleAccordionContent } from "../constants/moduleContent";
import { getResourcesForTopic } from "../constants/moduleResources";

const i18nState = vi.hoisted(() => ({ locale: "es" }));

vi.mock("framer-motion", () => {
  const passthrough = ({ children, ...props }) => {
    const { initial, animate, exit, transition, variants, whileHover, whileTap, ...rest } = props;
    return React.createElement("div", rest, children);
  };
  return {
    AnimatePresence: ({ children }) => children,
    motion: new Proxy(
      {},
      { get: (_, tag) => (tag === "button" ? "button" : passthrough) },
    ),
  };
});

vi.mock("../../../i18n/I18nProvider", () => ({
  useTranslation: () => ({ t: (k) => k, locale: i18nState.locale, setLocale: vi.fn() }),
}));

vi.mock("../../../store/ialabStore", () => ({
  useIALabStore: () => ({}),
}));

vi.mock("../../../utils/iconMapping", () => ({
  Icon: ({ name }) => <span data-testid="icon" data-icon={name} />,
}));

const buildProps = ({ moduleId = 2, locale = "es", expandedTopic = 0 } = {}) => {
  const moduleData = getModuleOverviewData(moduleId, locale);
  const resourcesByTopic = {};
  for (const top of moduleData.topics) {
    resourcesByTopic[top.title] = getResourcesForTopic(top.title, locale);
  }
  return {
    moduleData,
    expandedTopic,
    setExpandedTopic: vi.fn(),
    filterType: "all",
    setFilterType: vi.fn(),
    resourcesByTopic,
    viewedIds: [],
    isAdmin: true,
    isResourceLocked: () => false,
    calculateTopicDuration: () => "10 min",
    toggleBookmark: vi.fn(),
    prefersReducedMotion: true,
    activeMod: moduleId,
    setSelectedResource: vi.fn(),
    setSelectedResourceType: vi.fn(),
    setCurrentTopicResources: vi.fn(),
    setActiveResourceIndex: vi.fn(),
    setViewerModalOpen: vi.fn(),
    justCompletedId: null,
    bookmarkedIds: [],
    t: (k) => k,
  };
};

describe("ModuleTopicAccordion accordionContent rendering", () => {
  it("renders the educational prose card (intro only; warnings and example removed) for module 2 topic 1", () => {
    const moduleId = 2;
    const locale = "es";
    const accordion = getModuleAccordionContent(moduleId, locale);
    const topic1 = accordion[1];

    render(<ModuleTopicAccordion {...buildProps({ moduleId, locale, expandedTopic: 0 })} />);

    expect(screen.getByText(topic1.objective)).toBeInTheDocument();
    if (topic1.objectiveDesc) {
      expect(screen.getByText(topic1.objectiveDesc)).toBeInTheDocument();
    }
    for (const a of topic1.achievements) {
      expect(screen.queryByText(a.text)).not.toBeInTheDocument();
    }
    for (const w of topic1.warnings) {
      expect(screen.queryByText(w.text)).not.toBeInTheDocument();
    }
    if (topic1.example) {
      expect(screen.queryByText(topic1.example.label)).not.toBeInTheDocument();
      expect(screen.queryByText(topic1.example.weak)).not.toBeInTheDocument();
      expect(screen.queryByText(topic1.example.strong)).not.toBeInTheDocument();
    }
  });

  it("renders the prose card of the topic matching the expanded index (topic 3 of module 4)", () => {
    const moduleId = 4;
    const locale = "es";
    const accordion = getModuleAccordionContent(moduleId, locale);
    const topic3 = accordion[3];

    render(<ModuleTopicAccordion {...buildProps({ moduleId, locale, expandedTopic: 2 })} />);

    expect(screen.getByText(topic3.objective)).toBeInTheDocument();
  });

  it("renders localized content when locale is 'en'", () => {
    i18nState.locale = "en";
    const accordion = getModuleAccordionContent(2, "en");
    const topic1 = accordion[1];

    render(<ModuleTopicAccordion {...buildProps({ moduleId: 2, locale: "en", expandedTopic: 0 })} />);

    expect(screen.getByText(topic1.objective)).toBeInTheDocument();
    i18nState.locale = "es";
  });

  it("renders the prose card intro when the module has accordionContent (module 1)", () => {
    const moduleId = 1;
    const locale = "es";
    const accordion = getModuleAccordionContent(moduleId, locale);
    const topic1 = accordion[1];

    expect(topic1.objective).toBeDefined();

    render(<ModuleTopicAccordion {...buildProps({ moduleId, locale, expandedTopic: 0 })} />);

    expect(screen.getByText(topic1.objective)).toBeInTheDocument();
    expect(screen.getByText(topic1.objectiveDesc)).toBeInTheDocument();
  });

  it("renders the intro for the last topic of module 2 (topic 4, previously missing)", () => {
    const moduleId = 2;
    const locale = "es";
    const accordion = getModuleAccordionContent(moduleId, locale);
    const lastTopic = accordion[4];

    expect(lastTopic.objective).toBeDefined();

    render(<ModuleTopicAccordion {...buildProps({ moduleId, locale, expandedTopic: 3 })} />);

    expect(screen.getByText(lastTopic.objective)).toBeInTheDocument();
    expect(screen.getByText(lastTopic.objectiveDesc)).toBeInTheDocument();
  });
});
