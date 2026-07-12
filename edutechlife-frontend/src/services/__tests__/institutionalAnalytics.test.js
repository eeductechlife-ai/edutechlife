import {
  saveVakDiagnostic,
  fetchVakDiagnostics,
  aggregateDiagnostics,
} from "../institutionalAnalytics";

function buildMockSupabase({
  insertError = null,
  selectError = null,
  selectData = [],
} = {}) {
  const insertMock = vi.fn(() => Promise.resolve({ error: insertError }));
  const eqMock = vi.fn(() =>
    Promise.resolve({ data: selectData, error: selectError }),
  );
  const limitMock = vi.fn(() => {
    const result = Promise.resolve({ data: selectData, error: selectError });
    result.eq = eqMock;
    return result;
  });
  const orderMock = vi.fn(() => ({ limit: limitMock }));
  const selectMock = vi.fn(() => ({ order: orderMock }));

  return {
    from: vi.fn(() => ({
      insert: insertMock,
      select: selectMock,
    })),
    __mocks: { insertMock, selectMock, orderMock, limitMock, eqMock },
  };
}

describe("saveVakDiagnostic", () => {
  test("returns error when client is missing", async () => {
    const res = await saveVakDiagnostic(null, {
      userId: "u1",
      diagnosis: { predominantStyle: "visual" },
    });
    expect(res).toEqual({ ok: false, error: "missing args" });
  });

  test("returns error when userId is missing", async () => {
    const client = buildMockSupabase();
    const res = await saveVakDiagnostic(client, {
      diagnosis: { predominantStyle: "visual" },
    });
    expect(res).toEqual({ ok: false, error: "missing args" });
    expect(client.from).not.toHaveBeenCalled();
  });

  test("returns error when diagnosis is missing", async () => {
    const client = buildMockSupabase();
    const res = await saveVakDiagnostic(client, { userId: "u1" });
    expect(res).toEqual({ ok: false, error: "missing args" });
    expect(client.from).not.toHaveBeenCalled();
  });

  test("builds the correct insert payload from a full diagnosis", async () => {
    const client = buildMockSupabase();
    const diagnosis = {
      studentName: "Ana",
      studentAge: 10,
      studentEmail: "ana@example.com",
      studentPhone: "555-1234",
      studentMood: "feliz",
      parentName: "Carlos",
      parentPhone: "555-5678",
      parentEmail: "carlos@example.com",
      predominantStyle: "visual",
      percentage: 72.4,
      counts: { visual: 8, auditivo: 3, kinestesico: 2 },
      timeSpent: 245,
    };

    const res = await saveVakDiagnostic(client, {
      userId: "user-1",
      institutionId: "inst-1",
      diagnosis,
    });

    expect(client.from).toHaveBeenCalledWith("vak_diagnostics");
    expect(client.__mocks.insertMock).toHaveBeenCalledWith({
      user_id: "user-1",
      institution_id: "inst-1",
      student_name: "Ana",
      student_age: "10",
      student_email: "ana@example.com",
      student_phone: "555-1234",
      student_mood: "feliz",
      parent_name: "Carlos",
      parent_phone: "555-5678",
      parent_email: "carlos@example.com",
      predominant_style: "visual",
      percentage: 72.4,
      score_visual: 8,
      score_auditivo: 3,
      score_kinestesico: 2,
      time_spent_seconds: 245,
      result: diagnosis,
    });
    expect(res).toEqual({ ok: true });
  });

  test("fills defaults when optional fields are absent", async () => {
    const client = buildMockSupabase();
    const diagnosis = { predominantStyle: "auditivo" };

    await saveVakDiagnostic(client, { userId: "user-1", diagnosis });

    expect(client.__mocks.insertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        institution_id: null,
        student_name: null,
        student_age: null,
        student_email: null,
        student_phone: null,
        student_mood: null,
        parent_name: null,
        parent_phone: null,
        parent_email: null,
        percentage: 0,
        score_visual: 0,
        score_auditivo: 0,
        score_kinestesico: 0,
        time_spent_seconds: 0,
      }),
    );
  });

  test("returns ok:false with message when insert fails", async () => {
    const client = buildMockSupabase({ insertError: { message: "db down" } });

    const res = await saveVakDiagnostic(client, {
      userId: "user-1",
      diagnosis: { predominantStyle: "visual" },
    });

    expect(res).toEqual({ ok: false, error: "db down" });
  });

  test("catches thrown exceptions and returns ok:false", async () => {
    const client = {
      from: vi.fn(() => {
        throw new Error("boom");
      }),
    };

    const res = await saveVakDiagnostic(client, {
      userId: "user-1",
      diagnosis: { predominantStyle: "visual" },
    });

    expect(res).toEqual({ ok: false, error: "boom" });
  });
});

describe("fetchVakDiagnostics", () => {
  test("returns empty array when client is missing", async () => {
    const res = await fetchVakDiagnostics(null);
    expect(res).toEqual([]);
  });

  test("queries vak_diagnostics ordered by created_at desc with default limit", async () => {
    const rows = [{ id: 1 }, { id: 2 }];
    const client = buildMockSupabase({ selectData: rows });

    const res = await fetchVakDiagnostics(client);

    expect(client.from).toHaveBeenCalledWith("vak_diagnostics");
    expect(client.__mocks.selectMock).toHaveBeenCalledWith("*");
    expect(client.__mocks.orderMock).toHaveBeenCalledWith("created_at", {
      ascending: false,
    });
    expect(client.__mocks.limitMock).toHaveBeenCalledWith(1000);
    expect(client.__mocks.eqMock).not.toHaveBeenCalled();
    expect(res).toEqual(rows);
  });

  test("applies institutionId filter and custom limit when provided", async () => {
    const rows = [{ id: 1 }];
    const client = buildMockSupabase({ selectData: rows });

    const res = await fetchVakDiagnostics(client, {
      institutionId: "inst-9",
      limit: 50,
    });

    expect(client.__mocks.limitMock).toHaveBeenCalledWith(50);
    expect(client.__mocks.eqMock).toHaveBeenCalledWith(
      "institution_id",
      "inst-9",
    );
    expect(res).toEqual(rows);
  });

  test("returns empty array (not null/undefined) when data is null", async () => {
    const client = buildMockSupabase({ selectData: null });

    const res = await fetchVakDiagnostics(client);

    expect(res).toEqual([]);
  });

  test("throws an Error when the query fails", async () => {
    const client = buildMockSupabase({
      selectError: { message: "query failed" },
    });

    await expect(fetchVakDiagnostics(client)).rejects.toThrow("query failed");
  });
});

describe("aggregateDiagnostics", () => {
  test("returns zeroed aggregate for an empty array with no division-by-zero", () => {
    const res = aggregateDiagnostics([]);

    expect(res.total).toBe(0);
    expect(res.byStyle).toEqual({ visual: 0, auditivo: 0, kinestesico: 0 });
    expect(res.stylePercents).toEqual({
      visual: 0,
      auditivo: 0,
      kinestesico: 0,
    });
    expect(res.avgPercentage).toBe(0);
    expect(res.avgTimeSeconds).toBe(0);
    expect(res.students).toEqual([]);
    expect(res.timeline).toEqual([]);
  });

  test("returns the same zeroed aggregate when called with no arguments", () => {
    const res = aggregateDiagnostics();
    expect(res.total).toBe(0);
    expect(res.students).toEqual([]);
  });

  test("computes style distribution, percents, averages and student mapping", () => {
    const rows = [
      {
        id: 1,
        predominant_style: "visual",
        percentage: 80,
        time_spent_seconds: 100,
        student_name: "Ana",
        student_age: 10,
        score_visual: 8,
        score_auditivo: 1,
        score_kinestesico: 1,
        student_mood: "feliz",
        student_email: "ana@example.com",
        institution_id: "inst-1",
        created_at: "2026-07-10T10:00:00Z",
      },
      {
        id: 2,
        predominant_style: "auditivo",
        percentage: 60,
        time_spent_seconds: 200,
        created_at: "2026-07-10T12:00:00Z",
      },
      {
        id: 3,
        predominant_style: "kinestesico",
        percentage: 40,
        time_spent_seconds: 300,
        created_at: "2026-07-11T09:00:00Z",
      },
      {
        id: 4,
        predominant_style: "visual",
        percentage: 100,
        time_spent_seconds: 400,
        created_at: "2026-07-11T15:00:00Z",
      },
    ];

    const res = aggregateDiagnostics(rows);

    expect(res.total).toBe(4);
    expect(res.byStyle).toEqual({ visual: 2, auditivo: 1, kinestesico: 1 });
    expect(res.stylePercents).toEqual({
      visual: 50,
      auditivo: 25,
      kinestesico: 25,
    });
    // avg percentage: (80+60+40+100)/4 = 70
    expect(res.avgPercentage).toBe(70);
    // avg time: (100+200+300+400)/4 = 250
    expect(res.avgTimeSeconds).toBe(250);
    expect(res.students).toHaveLength(4);

    const first = res.students[0];
    expect(first).toEqual({
      id: 1,
      name: "Ana",
      age: 10,
      vak: "Visual",
      style: "visual",
      percentage: 80,
      scores: { visual: 8, auditivo: 1, kinestesico: 1 },
      mood: "feliz",
      email: "ana@example.com",
      institution: "inst-1",
      date: "2026-07-10T10:00:00Z",
    });

    expect(res.timeline).toEqual([
      { day: "2026-07-10", count: 2 },
      { day: "2026-07-11", count: 2 },
    ]);
  });

  test("applies fallback defaults for missing optional student fields", () => {
    const rows = [{ id: 5, predominant_style: "visual" }];

    const res = aggregateDiagnostics(rows);

    expect(res.students[0]).toEqual({
      id: 5,
      name: "Estudiante",
      age: "",
      vak: "Visual",
      style: "visual",
      percentage: 0,
      scores: { visual: 0, auditivo: 0, kinestesico: 0 },
      mood: null,
      email: null,
      institution: null,
      date: undefined,
    });
  });

  test("maps unknown/missing predominant_style to the em-dash label without affecting byStyle counts", () => {
    const rows = [
      { id: 1, predominant_style: "unknown_style", percentage: 50 },
      { id: 2, predominant_style: undefined, percentage: 50 },
    ];

    const res = aggregateDiagnostics(rows);

    expect(res.byStyle).toEqual({ visual: 0, auditivo: 0, kinestesico: 0 });
    expect(res.students[0].vak).toBe("—");
    expect(res.students[1].vak).toBe("—");
  });

  test("prefers diagnosed_at over created_at for the student date field", () => {
    const rows = [
      {
        id: 1,
        predominant_style: "visual",
        diagnosed_at: "2026-07-01T00:00:00Z",
        created_at: "2026-07-02T00:00:00Z",
      },
    ];

    const res = aggregateDiagnostics(rows);

    expect(res.students[0].date).toBe("2026-07-01T00:00:00Z");
  });

  test("builds timeline sorted by day and skips rows without created_at", () => {
    const rows = [
      {
        id: 1,
        predominant_style: "visual",
        created_at: "2026-07-05T08:00:00Z",
      },
      {
        id: 2,
        predominant_style: "visual",
        created_at: "2026-07-03T08:00:00Z",
      },
      { id: 3, predominant_style: "visual", created_at: "" },
      { id: 4, predominant_style: "visual" },
    ];

    const res = aggregateDiagnostics(rows);

    expect(res.timeline).toEqual([
      { day: "2026-07-03", count: 1 },
      { day: "2026-07-05", count: 1 },
    ]);
  });
});
