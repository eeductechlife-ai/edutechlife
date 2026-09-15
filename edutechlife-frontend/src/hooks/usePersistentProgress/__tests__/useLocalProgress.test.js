import { renderHook, act } from "@testing-library/react";
import useLocalProgress from "../useLocalProgress";
import { scopedKey } from "../../../utils/userScopedStorage";

const data = {
  completedVideos: [],
  completedModules: [],
  completedExams: { 1: 88 },
  completedInfographics: [],
  completedActivities: [],
  challengeScores: { 1: 90 },
  completedCommunity: [],
};

beforeEach(() => {
  localStorage.clear();
});

describe("useLocalProgress — persistencia por cuenta", () => {
  test("guarda y lee las notas en la clave por cuenta", () => {
    localStorage.setItem("user_email", "ana@x.com");
    const { result } = renderHook(() => useLocalProgress());

    act(() => {
      result.current.saveToLocalStorage(data);
    });

    expect(
      localStorage.getItem(scopedKey("ialab_completed_exams")),
    ).not.toBeNull();

    const loaded = result.current.loadFromLocalStorage();
    expect(loaded.completedExams).toEqual({ 1: 88 });
    expect(loaded.challengeScores).toEqual({ 1: 90 });
  });

  test("migra el dato legacy sin scope al leer si la cuenta no tiene el suyo", () => {
    localStorage.setItem("user_email", "ana@x.com");
    localStorage.setItem(
      "ialab_completed_exams",
      JSON.stringify({ 1: 75 }),
    );
    const { result } = renderHook(() => useLocalProgress());

    const loaded = result.current.loadFromLocalStorage();

    expect(loaded.completedExams).toEqual({ 1: 75 });
    expect(
      JSON.parse(localStorage.getItem(scopedKey("ialab_completed_exams"))),
    ).toEqual({ 1: 75 });
  });
});
