import { describe, test, expect } from "vitest";
import { VIDEO_QUIZZES, getVideoQuiz } from "../ialabVideoQuizzes";
import { RESOURCES_ES } from "../../components/IALab/constants/moduleResources/resourcesEs.js";

const videoIds = Object.values(RESOURCES_ES)
  .flatMap((topic) => topic.resources || [])
  .filter((r) => r.type === "video")
  .map((r) => r.id);

describe("ialabVideoQuizzes", () => {
  test("every video resource has a micro-quiz in es", () => {
    videoIds.forEach((id) => {
      expect(getVideoQuiz(id, "es"), `falta quiz para ${id}`).toBeTruthy();
    });
  });

  test("quizzes exist for es, en and pt", () => {
    ["es", "en", "pt"].forEach((lang) => {
      expect(Object.keys(VIDEO_QUIZZES[lang]).length).toBe(videoIds.length);
    });
  });

  test("each quiz has 3 valid questions", () => {
    ["es", "en", "pt"].forEach((lang) => {
      Object.entries(VIDEO_QUIZZES[lang]).forEach(([id, items]) => {
        expect(items.length, `${lang}:${id}`).toBe(3);
        items.forEach((item) => {
          expect(item.q.length).toBeGreaterThan(5);
          expect(item.options.length).toBeGreaterThanOrEqual(2);
          expect(item.correct).toBeGreaterThanOrEqual(0);
          expect(item.correct).toBeLessThan(item.options.length);
        });
      });
    });
  });
});
