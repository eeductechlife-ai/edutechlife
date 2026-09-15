import { saveGradeToSupabase } from "../useIALabEvaluation/supabase";

function makeDb() {
  const upsert = vi.fn().mockReturnValue({
    select: () => ({
      maybeSingle: () =>
        Promise.resolve({ data: { id: 1 }, error: null }),
    }),
  });
  return { from: vi.fn(() => ({ upsert })), upsert };
}

describe("saveGradeToSupabase", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  test("guarda la nota del Desafío con activity_type 'challenge'", async () => {
    const { from, upsert } = makeDb();

    const res = await saveGradeToSupabase({
      user: { id: "user-1" },
      moduleId: 2,
      getAuthDb: async () => ({ from }),
      evaluation: { notaGlobal: 85, nota_ej1: 90 },
      activityType: "challenge",
    });

    expect(res.success).toBe(true);
    const payload = upsert.mock.calls[0][0];
    expect(payload.activity_type).toBe("challenge");
    expect(payload.user_id).toBe("user-1");
    expect(payload.module_id).toBe(2);
    expect(payload.score).toBe(85);
    expect(payload.completed_lessons).toEqual({ notaGlobal: 85, nota_ej1: 90 });
  });

  test("guarda la nota del reto con activity_type 'exam'", async () => {
    const { from, upsert } = makeDb();

    const res = await saveGradeToSupabase({
      user: { id: "user-1" },
      moduleId: 1,
      getAuthDb: async () => ({ from }),
      evaluation: { notaGlobal: 70 },
      activityType: "exam",
    });

    expect(res.success).toBe(true);
    expect(upsert.mock.calls[0][0].activity_type).toBe("exam");
  });

  test("devuelve error si no hay usuario", async () => {
    const res = await saveGradeToSupabase({
      user: null,
      moduleId: 1,
      getAuthDb: async () => makeDb(),
      evaluation: { notaGlobal: 90 },
    });
    expect(res.success).toBe(false);
  });
});
