import { describe, test, expect } from "vitest";
import { QUICK_ACTIONS, getQuickActionMessage } from "../daniQuickActions";

describe("QUICK_ACTIONS", () => {
  test("exports an array of 6 quick action items", () => {
    expect(Array.isArray(QUICK_ACTIONS)).toBe(true);
    expect(QUICK_ACTIONS).toHaveLength(6);
  });

  test("each item has icon, label, and value properties", () => {
    QUICK_ACTIONS.forEach((action) => {
      expect(action).toHaveProperty("icon");
      expect(action).toHaveProperty("label");
      expect(action).toHaveProperty("value");
    });
  });

  test("includes the expected action values", () => {
    const values = QUICK_ACTIONS.map((a) => a.value);
    expect(values).toContain("ayuda_tarea");
    expect(values).toContain("motivame");
    expect(values).toContain("vak_estrategias");
    expect(values).toContain("que_hacer_hoy");
    expect(values).toContain("explicar_tema");
    expect(values).toContain("apoyo_emocional");
  });
});

describe("getQuickActionMessage", () => {
  test("returns a non-empty string for every known action", () => {
    const actions = [
      "ayuda_tarea",
      "motivame",
      "vak_estrategias",
      "que_hacer_hoy",
      "explicar_tema",
      "apoyo_emocional",
    ];
    actions.forEach((action) => {
      const msg = getQuickActionMessage(action);
      expect(typeof msg).toBe("string");
      expect(msg.length).toBeGreaterThan(10);
    });
  });

  test("every known action message mentions Dani", () => {
    const actions = [
      "ayuda_tarea",
      "motivame",
      "vak_estrategias",
      "que_hacer_hoy",
      "explicar_tema",
      "apoyo_emocional",
    ];
    actions.forEach((action) => {
      expect(getQuickActionMessage(action)).toContain("Dani");
    });
  });

  test("returns the action string itself for unknown actions", () => {
    expect(getQuickActionMessage("unknown_value")).toBe("unknown_value");
    expect(getQuickActionMessage("")).toBe("");
  });

  test("ayuda_tarea message mentions tarea", () => {
    expect(getQuickActionMessage("ayuda_tarea")).toContain("tarea");
  });

  test("motivame message mentions motivar/motives", () => {
    const msg = getQuickActionMessage("motivame");
    expect(msg.toLowerCase()).toContain("motiv");
  });

  test("apoyo_emocional message mentions apoyo", () => {
    const msg = getQuickActionMessage("apoyo_emocional");
    expect(msg.toLowerCase()).toContain("apoyo");
  });
});
