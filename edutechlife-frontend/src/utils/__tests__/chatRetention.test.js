import { describe, it, expect } from "vitest";
import {
  retainChat,
  CHAT_MAX_AGE_DAYS,
  CHAT_MAX_MESSAGES,
} from "../chatRetention";

const NOW = Date.parse("2026-10-08T12:00:00Z");
const DAY = 24 * 60 * 60 * 1000;
const msg = (text, daysAgo) => ({
  role: "user",
  text,
  at: new Date(NOW - daysAgo * DAY).toISOString(),
});

describe("retainChat: chats de menores en el navegador", () => {
  it("conserva 14 días y 100 mensajes", () => {
    expect(CHAT_MAX_AGE_DAYS).toBe(14);
    expect(CHAT_MAX_MESSAGES).toBe(100);
  });

  it("mantiene lo reciente y descarta lo de más de 14 días", () => {
    const out = retainChat(
      [msg("viejo", 20), msg("justo", 13), msg("hoy", 0)],
      { now: NOW },
    );
    expect(out.map((m) => m.text)).toEqual(["justo", "hoy"]);
  });

  it("el límite es de 14 días exactos (inclusive)", () => {
    expect(retainChat([msg("borde", 14)], { now: NOW })).toHaveLength(1);
    expect(retainChat([msg("pasado", 14.01)], { now: NOW })).toHaveLength(0);
  });

  it("se queda con los últimos 100 mensajes", () => {
    const many = Array.from({ length: 130 }, (_, i) => msg(`m${i}`, 0));
    const out = retainChat(many, { now: NOW });
    expect(out).toHaveLength(100);
    expect(out[0].text).toBe("m30");
    expect(out.at(-1).text).toBe("m129");
  });

  it("los mensajes antiguos sin fecha se fechan ahora y empiezan a caducar desde ahí", () => {
    const out = retainChat([{ role: "user", text: "sin fecha" }], { now: NOW });
    expect(out).toHaveLength(1);
    expect(out[0].at).toBe(new Date(NOW).toISOString());
    // Una vez fechado, 15 días después ya no se conserva.
    expect(retainChat(out, { now: NOW + 15 * DAY })).toHaveLength(0);
  });

  it("una fecha inválida se trata como sin fecha", () => {
    const out = retainChat([{ role: "user", text: "x", at: "ayer" }], {
      now: NOW,
    });
    expect(out[0].at).toBe(new Date(NOW).toISOString());
  });

  it("no modifica el arreglo ni los mensajes originales", () => {
    const original = [{ role: "user", text: "a" }];
    const copy = JSON.parse(JSON.stringify(original));
    retainChat(original, { now: NOW });
    expect(original).toEqual(copy);
  });

  it("tolera entradas que no son una lista o elementos vacíos", () => {
    expect(retainChat(null)).toEqual([]);
    expect(retainChat(undefined)).toEqual([]);
    expect(retainChat("x")).toEqual([]);
    expect(
      retainChat([null, undefined, 3, msg("ok", 0)], { now: NOW }),
    ).toHaveLength(1);
  });

  it("admite otros límites", () => {
    const out = retainChat([msg("a", 2), msg("b", 0)], {
      now: NOW,
      maxAgeDays: 1,
      maxMessages: 5,
    });
    expect(out.map((m) => m.text)).toEqual(["b"]);
  });
});
