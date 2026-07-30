import { describe, it, expect } from "vitest";
import {
  CATEGORY_MAP,
  CATEGORIES,
  CATEGORY_TAB_LABELS,
  PREMIUM_TABS,
  TOP_BAR_LABELS,
  PREMIUM_FEATURES,
} from "../kidsDashboardConfig";

describe("kidsDashboardConfig", () => {
  it("defines exactly 5 primary categories", () => {
    expect(CATEGORIES).toHaveLength(5);
    expect(CATEGORIES.map((c) => c.id).sort()).toEqual(
      ["explore", "home", "learn", "practice", "progress"],
    );
  });

  it("every category exposes an Icon component", () => {
    for (const cat of CATEGORIES) {
      expect(cat.Icon).toBeTruthy();
      expect(cat.gradient).toContain("linear-gradient");
      expect(cat.color).toMatch(/^#[0-9A-F]{6}$/i);
      expect(cat.tabs.length).toBeGreaterThan(0);
    }
  });

  it("CATEGORY_MAP entries all point to a real category id", () => {
    const validIds = new Set(CATEGORIES.map((c) => c.id));
    for (const catId of Object.values(CATEGORY_MAP)) {
      expect(validIds.has(catId)).toBe(true);
    }
  });

  it("every mapped tab is included in its category's tabs list", () => {
    const catById = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));
    for (const [tab, catId] of Object.entries(CATEGORY_MAP)) {
      expect(catById[catId].tabs).toContain(tab);
    }
  });

  it("PREMIUM_TABS are all known tabs", () => {
    const allTabs = Object.keys(CATEGORY_MAP);
    for (const t of PREMIUM_TABS) {
      expect(allTabs).toContain(t);
    }
  });

  it("provides a label for every top-bar tab", () => {
    for (const tab of Object.keys(CATEGORY_MAP)) {
      expect(TOP_BAR_LABELS[tab]).toBeTruthy();
      expect(CATEGORY_TAB_LABELS[tab]).toBeTruthy();
    }
  });

  it("PREMIUM_FEATURES describes each locked-tab feature", () => {
    for (const tab of PREMIUM_TABS) {
      // 'padres' is also a premium feature though not in CATEGORY_MAP
      const feature = PREMIUM_FEATURES[tab];
      if (feature) {
        expect(feature.title).toBeTruthy();
        expect(feature.description).toBeTruthy();
      }
    }
  });
});
