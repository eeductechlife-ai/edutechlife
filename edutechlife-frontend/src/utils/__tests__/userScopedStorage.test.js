import { claimStorageForCurrentUser, scopedKey } from "../userScopedStorage";

beforeEach(() => {
  localStorage.clear();
});

describe("claimStorageForCurrentUser — migración de notas legacy", () => {
  test("migra las notas sin scope a la clave por cuenta antes de borrarlas", () => {
    localStorage.setItem("user_email", "ana@x.com");
    localStorage.setItem("ialab_completed_exams", JSON.stringify({ 1: 90 }));

    claimStorageForCurrentUser();

    expect(
      JSON.parse(localStorage.getItem(scopedKey("ialab_completed_exams"))),
    ).toEqual({ 1: 90 });
    expect(localStorage.getItem("ialab_completed_exams")).toBeNull();
  });

  test("no sobrescribe la clave por cuenta si ya existe", () => {
    localStorage.setItem("user_email", "ana@x.com");
    localStorage.setItem("ialab_completed_exams", JSON.stringify({ 1: 50 }));
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

describe("tours por cuenta", () => {
  test("una cuenta nueva en un navegador ya usado no hereda el tour visto", () => {
    localStorage.setItem("ialab_storage_owner", "ana@x.com");
    localStorage.setItem("ialab_tour_completed", "true");
    localStorage.setItem("ialab-welcome-tour-completed", "2026-10-01");
    localStorage.setItem("ialab-visit-count", "5");
    localStorage.setItem("user_email", "nuevo@x.com");

    claimStorageForCurrentUser();

    expect(localStorage.getItem("ialab_tour_completed")).toBeNull();
    expect(localStorage.getItem("ialab-welcome-tour-completed")).toBeNull();
    expect(localStorage.getItem("ialab-visit-count")).toBeNull();
    expect(localStorage.getItem(scopedKey("ialab_tour_completed"))).toBeNull();
    expect(
      localStorage.getItem(scopedKey("ialab-welcome-tour-completed")),
    ).toBeNull();
  });
});
