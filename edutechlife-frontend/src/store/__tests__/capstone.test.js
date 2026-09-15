import { describe, it, expect, beforeEach } from "vitest";
import { useIALabStore } from "../ialabStore";
import { BADGE_INFO, BADGE_INFO_EN, BADGE_INFO_PT } from "@/data/ialab";

beforeEach(() => {
  useIALabStore.setState({
    xp: 0,
    streak: 0,
    badges: [],
    badgesDates: {},
    completedModules: [],
    completedExams: {},
    lessonProgress: {},
    moduleProgress: {},
  });
});

const completeAllModulesWithExams = (scores = { 1: 90, 2: 85, 3: 80, 4: 95, 5: 88 }) => {
  useIALabStore.setState({
    completedModules: [1, 2, 3, 4, 5],
    completedExams: scores,
  });
};

describe("Capstone (Fase 3 — proyecto integrador + insignia)", () => {
  it("otorga la insignia capstone con 5 módulos y 80+ en cada examen", () => {
    completeAllModulesWithExams();
    useIALabStore.getState().checkAndAwardBadges();
    expect(useIALabStore.getState().badges).toContain("capstone");
  });

  it("no otorga capstone si un examen queda por debajo de 80", () => {
    completeAllModulesWithExams({ 1: 90, 2: 85, 3: 79, 4: 95, 5: 88 });
    useIALabStore.getState().checkAndAwardBadges();
    expect(useIALabStore.getState().badges).not.toContain("capstone");
  });

  it("no otorga capstone si faltan módulos", () => {
    useIALabStore.setState({
      completedModules: [1, 2, 3],
      completedExams: { 1: 90, 2: 85, 3: 80 },
    });
    useIALabStore.getState().checkAndAwardBadges();
    expect(useIALabStore.getState().badges).not.toContain("capstone");
  });

  it("la insignia capstone existe en es, en y pt", () => {
    expect(BADGE_INFO.capstone).toBeDefined();
    expect(BADGE_INFO_EN.capstone).toBeDefined();
    expect(BADGE_INFO_PT?.capstone).toBeDefined();
  });
});
