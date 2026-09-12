import { renderHook, act } from "@testing-library/react";
import { useContentSequence } from "../useContentSequence";
import { useIALabStore } from "../../../store/ialabStore";

beforeEach(() => {
  localStorage.clear();
});

describe("useContentSequence — secuencia de contenidos del módulo 1", () => {
  test("solo el primer recurso está disponible al inicio", () => {
    const { result } = renderHook(() => useContentSequence(1, "es"));

    expect(result.current.firstUnviewedFlat).toBe(0);
    expect(result.current.isResourceLocked("intro-video-1")).toBe(false);
    expect(result.current.isResourceLocked("intro-ova-1")).toBe(true);
    expect(result.current.topics[0].isUnlocked).toBe(true);
    expect(result.current.topics[1].isUnlocked).toBe(false);
  });

  test("al ver el primer recurso se habilita el segundo", () => {
    const { result } = renderHook(() => useContentSequence(1, "es"));

    act(() => {
      useIALabStore.getState().addViewedResource("intro-video-1");
    });

    expect(result.current.isResourceLocked("intro-video-1")).toBe(false);
    expect(result.current.isResourceLocked("intro-ova-1")).toBe(false);
  });

  test("al completar el tema 1 se habilita el tema 2", () => {
    const { result } = renderHook(() => useContentSequence(1, "es"));

    act(() => {
      useIALabStore.getState().addViewedResource("intro-video-1");
      useIALabStore.getState().addViewedResource("intro-ova-1");
    });

    expect(result.current.topics[0].isCompleted).toBe(true);
    expect(result.current.topics[1].isUnlocked).toBe(true);
    expect(result.current.allTopicsCompleted).toBe(false);
  });

  test("al completar todos los temas el módulo queda completo", () => {
    const { result } = renderHook(() => useContentSequence(1, "es"));

    act(() => {
      ["intro-video-1", "intro-ova-1", "prompt-video-1", "prompt-guide-1", "prompt-ova-html-1", "prompt-lab-ova-1"].forEach(
        (id) => useIALabStore.getState().addViewedResource(id),
      );
    });

    expect(result.current.firstUnviewedFlat).toBe(-1);
    expect(result.current.topics.every((t) => t.isCompleted)).toBe(true);
    expect(result.current.allTopicsCompleted).toBe(true);
    expect(result.current.isResourceLocked("prompt-lab-ova-1")).toBe(false);
  });

  test("fail-open: un recurso ajeno al módulo no se bloquea", () => {
    const { result } = renderHook(() => useContentSequence(1, "es"));
    expect(result.current.isResourceLocked("recurso-de-otro-modulo")).toBe(false);
  });
});
