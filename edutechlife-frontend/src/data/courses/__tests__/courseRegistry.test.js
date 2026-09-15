import { describe, it, expect } from "vitest";
import {
  DEFAULT_COURSE_ID,
  DEMO_COURSE_ID,
  COURSE_ROLES,
  COURSES,
  getCourse,
  getDefaultCourse,
  listCourses,
  getCourseModules,
  getCourseExams,
  getCourseExamConfig,
  getRoleHome,
  isCourseEnabled,
  listEnabledCourses,
} from "../courseRegistry.js";
import { getModules } from "../../ialab.js";
import { getModuleExams } from "../../ialabQuizData/index.js";
import { EXAM_QUESTION_COUNT, PASSING_SCORE, MAX_ATTEMPTS } from "../../ialabQuizData/config.js";

describe("courseRegistry (Fase 7 — escalabilidad)", () => {
  it("expone un curso por defecto con 5 módulos", () => {
    const course = getDefaultCourse();
    expect(course.id).toBe(DEFAULT_COURSE_ID);
    expect(course.moduleIds).toEqual([1, 2, 3, 4, 5]);
    expect(COURSES[DEFAULT_COURSE_ID]).toBe(course);
  });

  it("getCourse devuelve el curso por defecto ante un id desconocido", () => {
    expect(getCourse("no-existe").id).toBe(DEFAULT_COURSE_ID);
    expect(getCourse(DEFAULT_COURSE_ID).id).toBe(DEFAULT_COURSE_ID);
  });

  it("listCourses devuelve un arreglo de cursos", () => {
    const list = listCourses();
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThanOrEqual(1);
    expect(list.map((c) => c.id)).toContain(DEFAULT_COURSE_ID);
  });

  it("la superficie del motor delega en el contenido existente (módulos)", () => {
    expect(getCourseModules(DEFAULT_COURSE_ID, "es")).toBe(getModules("es"));
    expect(getCourseModules(DEFAULT_COURSE_ID, "en")).toBe(getModules("en"));
  });

  it("la superficie del motor delega en el contenido existente (exámenes)", () => {
    expect(getCourseExams(DEFAULT_COURSE_ID, "es")).toBe(getModuleExams("es"));
    expect(getCourseExams(DEFAULT_COURSE_ID, "en")).toBe(getModuleExams("en"));
  });

  it("expone la configuración de examen del curso", () => {
    expect(getCourseExamConfig(DEFAULT_COURSE_ID)).toEqual({
      questionCount: EXAM_QUESTION_COUNT,
      passingScore: PASSING_SCORE,
      maxAttempts: MAX_ATTEMPTS,
    });
  });

  it("mapea roles a su ruta de inicio", () => {
    expect(COURSE_ROLES).toEqual(
      expect.arrayContaining(["student", "teacher", "parent", "admin"]),
    );
    expect(getRoleHome("student")).toBe("/ialab");
    expect(getRoleHome("teacher")).toBe("/ialab");
    expect(getRoleHome("desconocido")).toBe("/ialab");
  });

  it("el curso por defecto está habilitado y el demo deshabilitado", () => {
    expect(isCourseEnabled(DEFAULT_COURSE_ID)).toBe(true);
    expect(isCourseEnabled(DEMO_COURSE_ID)).toBe(false);
    const enabledIds = listEnabledCourses().map((c) => c.id);
    expect(enabledIds).toContain(DEFAULT_COURSE_ID);
    expect(enabledIds).not.toContain(DEMO_COURSE_ID);
  });
});
