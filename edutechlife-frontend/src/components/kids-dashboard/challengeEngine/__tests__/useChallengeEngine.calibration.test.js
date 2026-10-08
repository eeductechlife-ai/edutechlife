import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

const ctx = {
  gradeLevel: 9,
  studentAge: 12,
  ageGroup: "middle",
  addPoints: vi.fn(),
  supabaseQueries: { studentData: { data: { id: "s1", grade_level: 9 } } },
};

vi.mock("../../../../utils/api", () => ({ callDeepseekIngenia: vi.fn() }));
vi.mock("../../../../context/IngenIAKidsContext", () => ({
  useIngenIAKids: () => ctx,
}));
vi.mock("../../../../hooks/useCompetencyTracking", () => ({
  useCompetencyTracking: () => ({ trackActivity: vi.fn() }),
}));
vi.mock("../../../../hooks/useFeedbackLog", () => ({
  useFeedbackLog: () => ({ logFeedback: vi.fn() }),
}));
vi.mock("../../../../lib/analytics", () => ({ track: vi.fn() }));

import { callDeepseekIngenia } from "../../../../utils/api";
import { useChallengeEngine } from "../useChallengeEngine";

const q = (question) => ({
  question,
  options: ["a", "b", "c", "d"],
  correct: 0,
  explanation: "e",
});
const good = (n) =>
  Array.from({ length: n }, (_, i) => q(`¿Cuánto es ${i}+1?`));

async function start(difficultyId, subjectId = "math") {
  const hook = renderHook(() => useChallengeEngine());
  const { result } = hook;
  act(() => {
    result.current.setSubject(
      result.current.CHALLENGE_SUBJECTS.find((s) => s.id === subjectId),
    );
    result.current.setDifficulty(
      result.current.DIFFICULTIES.find((d) => d.id === difficultyId),
    );
  });
  await act(async () => {
    await result.current.startChallenge();
  });
  return result;
}

const systemPrompt = () =>
  callDeepseekIngenia.mock.calls.at(-1)[0].find((m) => m.role === "system")
    .content;

describe("retos: nivel según edad y grado", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(ctx, { gradeLevel: 9, studentAge: 12 });
  });

  it("12 años con grado 9 en el perfil: el reto Normal es de grado 7, no de 9", async () => {
    callDeepseekIngenia.mockResolvedValue({ questions: good(5) });
    await start("medium");
    expect(systemPrompt()).toContain("niños de grado 7 en Colombia");
    expect(systemPrompt()).not.toContain("grado 9");
  });

  it("«Fácil» baja un grado y pide conceptos básicos", async () => {
    callDeepseekIngenia.mockResolvedValue({ questions: good(3) });
    await start("easy");
    expect(systemPrompt()).toContain("niños de grado 6 en Colombia");
    expect(systemPrompt()).toContain("uno o dos grados por debajo");
  });

  it("con edad y grado coherentes usa el grado del perfil", async () => {
    Object.assign(ctx, { gradeLevel: 7, studentAge: 12 });
    callDeepseekIngenia.mockResolvedValue({ questions: good(5) });
    await start("medium");
    expect(systemPrompt()).toContain("niños de grado 7 en Colombia");
  });

  it("el prompt prohíbe gráficas, figuras y tablas que no se ven", async () => {
    callDeepseekIngenia.mockResolvedValue({ questions: good(5) });
    await start("medium");
    expect(systemPrompt()).toMatch(
      /NO uses gráficas, figuras, imágenes, mapas ni tablas/,
    );
  });
});

describe("retos: preguntas que citan figuras que no existen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(ctx, { gradeLevel: 7, studentAge: 12 });
  });

  it("descarta la pregunta de la gráfica y conserva el resto", async () => {
    callDeepseekIngenia.mockResolvedValue({
      questions: [
        q(
          "La gráfica de dispersión muestra una tendencia lineal decreciente. ¿Qué indica?",
        ),
        q("¿Cuánto es 2+2?"),
        q("¿Cuánto es 3+3?"),
      ],
    });
    const result = await start("easy");
    expect(result.current.phase).toBe("playing");
    expect(result.current.questions.map((x) => x.question)).toEqual([
      "¿Cuánto es 2+2?",
      "¿Cuánto es 3+3?",
    ]);
  });

  it("si casi todas dependen de una imagen, no arranca y pide intentar otra vez", async () => {
    callDeepseekIngenia.mockResolvedValue({
      questions: [
        q("Según la tabla, ¿cuál es el mayor?"),
        q("Observa la figura y calcula el área."),
        q("¿Cuánto es 2+2?"),
      ],
    });
    const result = await start("easy");
    expect(result.current.phase).toBe("setup");
    expect(result.current.error).toMatch(/sin una imagen/);
  });
});

describe("retos: materias disponibles", () => {
  beforeEach(() => Object.assign(ctx, { gradeLevel: 9, studentAge: 14 }));

  it("Lenguaje y Arte aparecen aunque el grado 9 no tenga DBA de Lenguaje", () => {
    const { result } = renderHook(() => useChallengeEngine());
    const ids = result.current.CHALLENGE_SUBJECTS.map((s) => s.id);
    expect(ids).toEqual(
      expect.arrayContaining([
        "language",
        "art",
        "math",
        "science",
        "social",
        "english",
      ]),
    );
  });

  it("un reto de Arte se genera por grado, sin secuencia de DBA", async () => {
    callDeepseekIngenia.mockResolvedValue({ questions: good(5) });
    const result = await start("medium", "art");
    expect(result.current.phase).toBe("playing");
    expect(systemPrompt()).toContain("Arte");
    expect(systemPrompt()).toContain("variadas y representativas");
  });
});
