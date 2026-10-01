import { describe, test, expect, vi } from "vitest";
import {
  ageBandFor,
  saveAnonymousVakResult,
  fetchAnonymousVakResults,
  aggregateDiagnostics,
} from "../institutionalAnalytics";

const diagnosis = {
  studentName: "Mateo",
  studentAge: "11",
  predominantStyle: "auditivo",
  secondaryStyle: "visual",
  scores: { visual: 35, auditivo: 40, kinestesico: 25 },
  total: 20,
  timeSpent: 190,
};

function insertClient(error = null) {
  const insert = vi.fn(() => Promise.resolve({ error }));
  return { from: vi.fn(() => ({ insert })), insert };
}

describe("ageBandFor", () => {
  test.each([
    [8, "8"],
    ["9", "9-10"],
    [10, "9-10"],
    [11, "11-13"],
    [13, "11-13"],
    [14, "14-16"],
    [16, "14-16"],
  ])("%s -> %s", (age, band) => expect(ageBandFor(age)).toBe(band));

  test.each([7, 17, "x", null, undefined])("%s is out of range", (age) =>
    expect(ageBandFor(age)).toBeNull(),
  );
});

describe("saveAnonymousVakResult", () => {
  test("stores the result without name, contact data or the exact age", async () => {
    const client = insertClient();
    const res = await saveAnonymousVakResult(client, {
      institutionSlug: "colegio-ejemplo",
      diagnosis,
      mode: "explorer",
    });
    expect(res).toEqual({ ok: true });
    expect(client.from).toHaveBeenCalledWith("vak_anonymous_results");
    const row = client.insert.mock.calls[0][0];
    expect(row).toEqual({
      institution_slug: "colegio-ejemplo",
      age_band: "11-13",
      mode: "explorer",
      question_count: 20,
      predominant_style: "auditivo",
      secondary_style: "visual",
      score_visual: 35,
      score_auditivo: 40,
      score_kinestesico: 25,
      duration_seconds: 190,
    });
    expect(JSON.stringify(row)).not.toMatch(/Mateo|email|phone|name/i);
  });

  test("drops an institution slug that is not a plain slug", async () => {
    const client = insertClient();
    await saveAnonymousVakResult(client, {
      institutionSlug: "Colegio X; drop table",
      diagnosis,
    });
    expect(client.insert.mock.calls[0][0].institution_slug).toBeNull();
  });

  test("caps the duration so a forgotten tab does not skew the average", async () => {
    const client = insertClient();
    await saveAnonymousVakResult(client, {
      diagnosis: { ...diagnosis, timeSpent: 99999 },
    });
    expect(client.insert.mock.calls[0][0].duration_seconds).toBe(7200);
  });

  test("refuses incomplete results and a missing client", async () => {
    expect(await saveAnonymousVakResult(null, { diagnosis })).toEqual({
      ok: false,
      error: "missing args",
    });
    const client = insertClient();
    expect(
      await saveAnonymousVakResult(client, {
        diagnosis: { ...diagnosis, studentAge: "40" },
      }),
    ).toEqual({ ok: false, error: "incomplete result" });
    expect(client.insert).not.toHaveBeenCalled();
  });

  test("reports a database error without throwing", async () => {
    const client = insertClient({ message: "table missing" });
    expect(await saveAnonymousVakResult(client, { diagnosis })).toEqual({
      ok: false,
      error: "table missing",
    });
  });
});

describe("fetchAnonymousVakResults", () => {
  function selectClient(result) {
    const eq = vi.fn(() => Promise.resolve(result));
    const limit = vi.fn(() => {
      const p = Promise.resolve(result);
      p.eq = eq;
      return p;
    });
    const order = vi.fn(() => ({ limit }));
    const select = vi.fn(() => ({ order }));
    return { from: vi.fn(() => ({ select })), eq };
  }

  const rows = [
    {
      id: "a1",
      institution_slug: "colegio-ejemplo",
      age_band: "9-10",
      predominant_style: "visual",
      score_visual: 60,
      score_auditivo: 25,
      score_kinestesico: 15,
      duration_seconds: 150,
      created_at: "2026-09-30T10:00:00Z",
    },
  ];

  test("maps rows to the shape the admin panel already aggregates", async () => {
    const client = selectClient({ data: rows, error: null });
    const [row] = await fetchAnonymousVakResults(client, {
      institutionId: "colegio-ejemplo",
    });
    expect(client.eq).toHaveBeenCalledWith(
      "institution_slug",
      "colegio-ejemplo",
    );
    expect(row).toMatchObject({
      id: "anon-a1",
      institution_id: "colegio-ejemplo",
      student_name: "Anónimo",
      student_age: "9-10",
      predominant_style: "visual",
      percentage: 60,
      time_spent_seconds: 150,
    });

    const agg = aggregateDiagnostics([row]);
    expect(agg.total).toBe(1);
    expect(agg.byStyle.visual).toBe(1);
    expect(agg.avgPercentage).toBe(60);
  });

  test("returns [] when the table is missing or the read is not allowed", async () => {
    const client = selectClient({ data: null, error: { message: "denied" } });
    expect(await fetchAnonymousVakResults(client)).toEqual([]);
    expect(await fetchAnonymousVakResults(null)).toEqual([]);
  });
});
