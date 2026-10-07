import { describe, it, expect, beforeEach } from "vitest";
import { clearIngenIAUserData } from "../userDataStorage";

const A = "12ecdbf4-22ea-4ba9-80b4-56bd96ffec05";
const B = "5b02f700-faca-49a2-89ad-be2f9bbea45d";

const seed = () => {
  [A, B].forEach((id) => {
    localStorage.setItem(`edutechlife_dani_chat_${id}`, "[chat]");
    localStorage.setItem(`edutechlife_grades_${id}`, "[notas]");
    localStorage.setItem(`edutechlife_vak_${id}`, "{vak}");
    localStorage.setItem(`improvement_plan_${id}`, "{plan}");
  });
  localStorage.setItem("student_name", "Sofia");
  localStorage.setItem("student_age", "12");
  localStorage.setItem("student_grade", "9");
  localStorage.setItem("refresh_token", "r-123");
  localStorage.setItem("edutechlife_student_info", "{}");
  // No son datos de estudiantes: deben sobrevivir siempre.
  localStorage.setItem("edutechlife_dani_voice", "true");
  localStorage.setItem("edutechlife_dani_socratic", "false");
  localStorage.setItem("ialab-store::ana@x.com", "{}");
  localStorage.setItem("theme", "light");
};

describe("clearIngenIAUserData", () => {
  beforeEach(() => localStorage.clear());

  it("on sign-out removes every account's student data and the last session's globals", () => {
    seed();
    const removed = clearIngenIAUserData();

    expect(removed).toBe(8 + 5);
    expect(localStorage.getItem(`edutechlife_dani_chat_${A}`)).toBeNull();
    expect(localStorage.getItem(`edutechlife_dani_chat_${B}`)).toBeNull();
    expect(localStorage.getItem(`improvement_plan_${A}`)).toBeNull();
    ["student_name", "student_age", "student_grade", "refresh_token"].forEach(
      (k) => expect(localStorage.getItem(k)).toBeNull(),
    );
  });

  it("leaves preferences and unrelated keys alone", () => {
    seed();
    clearIngenIAUserData();
    expect(localStorage.getItem("edutechlife_dani_voice")).toBe("true");
    expect(localStorage.getItem("edutechlife_dani_socratic")).toBe("false");
    expect(localStorage.getItem("ialab-store::ana@x.com")).toBe("{}");
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("on sign-in removes only OTHER accounts' data and keeps the current one", () => {
    seed();
    const removed = clearIngenIAUserData({ keepUserId: A });

    expect(removed).toBe(4);
    expect(localStorage.getItem(`edutechlife_dani_chat_${A}`)).toBe("[chat]");
    expect(localStorage.getItem(`edutechlife_grades_${A}`)).toBe("[notas]");
    expect(localStorage.getItem(`edutechlife_dani_chat_${B}`)).toBeNull();
    expect(localStorage.getItem(`edutechlife_vak_${B}`)).toBeNull();
    // las claves globales son de la sesión actual
    expect(localStorage.getItem("student_name")).toBe("Sofia");
    expect(localStorage.getItem("refresh_token")).toBe("r-123");
  });

  it("matches the user id regardless of letter case", () => {
    localStorage.setItem(`edutechlife_grades_${A.toUpperCase()}`, "[x]");
    clearIngenIAUserData({ keepUserId: A.toLowerCase() });
    expect(localStorage.getItem(`edutechlife_grades_${A.toUpperCase()}`)).toBe(
      "[x]",
    );
  });

  it("does nothing, without throwing, when there is nothing stored", () => {
    expect(clearIngenIAUserData()).toBe(0);
  });
});
