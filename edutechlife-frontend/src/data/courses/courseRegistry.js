/**
 * courseRegistry.js — Registro de cursos y superficie del motor (Fase 7)
 *
 * Abstrae el curso actual (IALab) detrás de un contrato estable para poder
 * reutilizar el motor (módulos, temas y exámenes) en nuevos cursos y roles,
 * sin cambiar el comportamiento instalado.
 *
 * Contrato de curso:
 *   { id, slug, titleKey, moduleIds, contentPath, verifyPath, engine }
 */
import { getModules } from "../ialab";
import { getModuleExams } from "../ialabQuizData/index.js";
import {
  EXAM_QUESTION_COUNT,
  PASSING_SCORE,
  MAX_ATTEMPTS,
} from "../ialabQuizData/config.js";

export const DEFAULT_COURSE_ID = "ialab-ia-generativa";
export const DEMO_COURSE_ID = "demo-curso-1";

export const COURSE_ROLES = ["student", "teacher", "parent", "admin"];

const ROLE_HOME = {
  student: "/ialab",
  teacher: "/ialab",
  parent: "/ialab",
  admin: "/admin",
};

export const COURSES = {
  [DEFAULT_COURSE_ID]: {
    id: DEFAULT_COURSE_ID,
    slug: "introduccion-ia-generativa",
    titleKey: "ialab.course_title",
    moduleIds: [1, 2, 3, 4, 5],
    contentPath: "/ialab",
    verifyPath: "/verificar",
    engine: "ialab",
    enabled: true,
  },
  // Curso de demostración para probar la reutilización del motor sin exponer
  // contenido incompleto. Deshabilitado por defecto: no altera la plataforma.
  [DEMO_COURSE_ID]: {
    id: DEMO_COURSE_ID,
    slug: "curso-demo",
    titleKey: "ialab.course_title",
    moduleIds: [1],
    contentPath: "/ialab",
    verifyPath: "/verificar",
    engine: "ialab",
    enabled: false,
  },
};

export function isCourseEnabled(courseId) {
  return getCourse(courseId).enabled === true;
}

export function listEnabledCourses() {
  return listCourses().filter((course) => course.enabled === true);
}

export function getCourse(courseId) {
  return COURSES[courseId] || COURSES[DEFAULT_COURSE_ID];
}

export function getDefaultCourse() {
  return COURSES[DEFAULT_COURSE_ID];
}

export function listCourses() {
  return Object.values(COURSES);
}

/** Módulos (temas) del curso, delegando en el contenido existente. */
export function getCourseModules(_courseId, locale) {
  return getModules(locale);
}

/** Banco de exámenes del curso, delegando en el motor existente. */
export function getCourseExams(_courseId, locale) {
  return getModuleExams(locale);
}

/** Configuración de examen del curso actual. */
export function getCourseExamConfig(courseId) {
  const course = getCourse(courseId);
  if (course.engine !== "ialab") {
    return {
      questionCount: EXAM_QUESTION_COUNT,
      passingScore: PASSING_SCORE,
      maxAttempts: MAX_ATTEMPTS,
    };
  }
  return {
    questionCount: EXAM_QUESTION_COUNT,
    passingScore: PASSING_SCORE,
    maxAttempts: MAX_ATTEMPTS,
  };
}

/** Ruta de inicio por rol (con fallback de estudiante). */
export function getRoleHome(role) {
  return ROLE_HOME[role] || ROLE_HOME.student;
}
