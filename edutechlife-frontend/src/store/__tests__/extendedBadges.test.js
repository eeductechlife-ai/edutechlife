import { describe, it, expect, beforeEach } from "vitest";
import { useIALabStore } from "../ialabStore";
import { BADGE_INFO, BADGE_INFO_EN, BADGE_INFO_PT } from "@/data/ialab";

const NEW_BADGES = ["first_challenge", "all_challenges", "perfect_exam"];

beforeEach(() => {
  useIALabStore.setState({
    xp: 0,
    streak: 0,
    badges: [],
    badgesDates: {},
    completedModules: [],
    completedExams: {},
    challengeScores: {},
    lessonProgress: {},
    moduleProgress: {},
  });
});

describe("Logros ampliados (Fase D)", () => {
  it("otorga first_challenge al completar el primer desafío", () => {
    useIALabStore.setState({ challengeScores: { 1: 85 } });
    useIALabStore.getState().checkAndAwardBadges();
    expect(useIALabStore.getState().badges).toContain("first_challenge");
  });

  it("otorga all_challenges con los 5 desafíos aprobados", () => {
    useIALabStore.setState({
      challengeScores: { 1: 85, 2: 90, 3: 80, 4: 95, 5: 88 },
    });
    useIALabStore.getState().checkAndAwardBadges();
    expect(useIALabStore.getState().badges).toContain("all_challenges");
  });

  it("no otorga all_challenges si falta un desafío", () => {
    useIALabStore.setState({ challengeScores: { 1: 85, 2: 90, 3: 80, 4: 95 } });
    useIALabStore.getState().checkAndAwardBadges();
    expect(useIALabStore.getState().badges).not.toContain("all_challenges");
  });

  it("otorga perfect_exam con 100 en cualquier examen", () => {
    useIALabStore.setState({ completedExams: { 1: 100 } });
    useIALabStore.getState().checkAndAwardBadges();
    expect(useIALabStore.getState().badges).toContain("perfect_exam");
  });

  it("no otorga perfect_exam sin un examen de 100", () => {
    useIALabStore.setState({ completedExams: { 1: 99, 2: 85 } });
    useIALabStore.getState().checkAndAwardBadges();
    expect(useIALabStore.getState().badges).not.toContain("perfect_exam");
  });

  it("las insignias existen en es, en y pt", () => {
    for (const id of NEW_BADGES) {
      expect(BADGE_INFO[id], `es ${id}`).toBeDefined();
      expect(BADGE_INFO_EN[id], `en ${id}`).toBeDefined();
      expect(BADGE_INFO_PT[id], `pt ${id}`).toBeDefined();
    }
  });
});
