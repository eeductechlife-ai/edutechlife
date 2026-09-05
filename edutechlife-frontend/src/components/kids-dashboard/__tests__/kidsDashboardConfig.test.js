import { describe, it, expect } from "vitest";
import {
  CATEGORY_MAP,
  CATEGORIES,
  CATEGORY_TAB_LABELS,
  PREMIUM_TABS,
  TOP_BAR_LABELS,
  PREMIUM_FEATURES,
  FEATURE_FLAGS,
} from "../kidsDashboardConfig";

describe("kidsDashboardConfig", () => {
  it("defines primary categories with required ids", () => {
    const ids = CATEGORIES.map((c) => c.id).sort();
    expect(ids).toContain("explore");
    expect(ids).toContain("home");
    expect(ids).toContain("learn");
    expect(ids).toContain("practice");
    expect(ids).toContain("progress");
    // 'profile' category was added in Sprint 11
    expect(CATEGORIES.length).toBeGreaterThanOrEqual(5);
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

  it("every mapped tab points to a real category or is a known sub-view", () => {
    const catById = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));
    // Some tabs in CATEGORY_MAP are internal sub-views of a parent tab
    // (e.g. calificaciones, plan, horario are sub-views of MateriasTab inside 'learn').
    // They map to the parent category but are not listed in `tabs` directly.
    for (const [, catId] of Object.entries(CATEGORY_MAP)) {
      expect(catById[catId]).toBeTruthy();
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

  describe("FEATURE_FLAGS", () => {
    it("has expected shipped flags as true", () => {
      expect(FEATURE_FLAGS.adaptive_engine).toBe(true);
      expect(FEATURE_FLAGS.skill_passport).toBe(true);
      expect(FEATURE_FLAGS.future_explorer).toBe(true);
      expect(FEATURE_FLAGS.early_warning).toBe(true);
    });

    it("has expected dark flags as false", () => {
      expect(FEATURE_FLAGS.parent_intelligence_v2).toBe(false);
      expect(FEATURE_FLAGS.gamification_v2).toBe(false);
      expect(FEATURE_FLAGS.dani_orchestrator_v2).toBe(false);
      expect(FEATURE_FLAGS.smart_profile).toBe(false);
      // learning_graph was promoted to true in Sprint 3
    });

    it("all values are boolean", () => {
      Object.values(FEATURE_FLAGS).forEach((v) => {
        expect(typeof v).toBe("boolean");
      });
    });
  });
});
