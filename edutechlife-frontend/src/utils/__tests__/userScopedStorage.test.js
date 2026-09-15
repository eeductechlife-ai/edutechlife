import { claimStorageForCurrentUser, scopedKey } from "../userScopedStorage";

beforeEach(() => {
  localStorage.clear();
});

describe("claimStorageForCurrentUser — migración de notas legacy", () => {
  test("migra las notas sin scope a la clave por cuenta antes de borrarlas", () => {
    localStorage.setItem("user_email", "ana@x.com");
    localStorage.setItem(
      "ialab_completed_exams",
      JSON.stringify({ 1: 90 }),
    );

    claimStorageForCurrentUser();

    expect(
      JSON.parse(localStorage.getItem(scopedKey("ialab_completed_exams"))),
    ).toEqual({ 1: 90 });
    expect(localStorage.getItem("ialab_completed_exams")).toBeNull();
  });

  test("no sobrescribe la clave por cuenta si ya existe", () => {
    localStorage.setItem("user_email", "ana@x.com");
    localStorage.setItem(
      "ialab_completed_exams",
      JSON.stringify({ 1: 50 }),
    );
    localStorage.setItem(
      scopedKey("ialab_completed_exams"),
      JSON.stringify({ 1: 90 }),
    );

    claimStorageForCurrentUser();

    expect(
      JSON.parse(localStorage.getItem(scopedKey("ialab_completed_exams"))),
    ).toEqual({ 1: 90 });
  });
});
