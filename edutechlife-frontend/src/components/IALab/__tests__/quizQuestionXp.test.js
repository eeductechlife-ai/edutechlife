import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { useIALabStore } from "../../../store/ialabStore";
import { awardQuestionXp, QUESTION_XP } from "../quizQuestionXp";

describe("awardQuestionXp", () => {
  let addXp;

  beforeEach(() => {
    localStorage.clear();
    addXp = vi
      .spyOn(useIALabStore.getState(), "addXp")
      .mockImplementation(() => {});
  });

  afterEach(() => {
    addXp.mockRestore();
  });

  test("suma XP la primera vez que se responde bien una pregunta", () => {
    expect(awardQuestionXp("video:v1:0")).toBe(QUESTION_XP);
    expect(addXp).toHaveBeenCalledWith(QUESTION_XP);
  });

  test("no vuelve a sumar la misma pregunta (repetir el quiz no infla el ranking)", () => {
    awardQuestionXp("exam:2:m2q5");
    expect(awardQuestionXp("exam:2:m2q5")).toBe(0);
    expect(addXp).toHaveBeenCalledTimes(1);
  });

  test("preguntas distintas suman por separado", () => {
    awardQuestionXp("video:v1:0");
    awardQuestionXp("video:v1:1");
    expect(addXp).toHaveBeenCalledTimes(2);
  });
});
