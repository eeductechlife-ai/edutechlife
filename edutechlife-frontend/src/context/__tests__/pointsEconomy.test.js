import { describe, it, expect } from "vitest";
import {
  POINTS,
  DAILY_CAP,
  CATEGORY,
  earnedToday,
  capPoints,
  isRetiredReward,
  storeRewards,
  missionXp,
} from "../pointsEconomy";
import { DEFAULT_MISSIONS, ADN_COMPLETION_XP } from "../ingenIAData";

const now = new Date("2026-10-07T15:00:00");
const entry = (points, category, when = now) => ({
  points,
  category,
  timestamp: when,
});

describe("jerarquía de la economía: reto > ADN > conversar", () => {
  it("un reto completo vale más que conversar con Dani", () => {
    expect(POINTS.challenge.medium).toBeGreaterThan(POINTS.daniMission);
    expect(POINTS.challenge.easy).toBeGreaterThan(POINTS.daniMission);
  });

  it("el ADN (una vez) vale lo mismo que un reto Normal y más que conversar", () => {
    expect(ADN_COMPLETION_XP).toBe(POINTS.adn);
    expect(POINTS.adn).toBeGreaterThanOrEqual(POINTS.challenge.medium);
    expect(POINTS.adn).toBeGreaterThan(POINTS.daniMission);
  });

  it("las misiones de hablar con Dani ya no son las más rentables", () => {
    const dani = DEFAULT_MISSIONS.find((m) => m.id === 3);
    expect(dani.xp).toBe(POINTS.daniMission);
    const best = Math.max(...DEFAULT_MISSIONS.map((m) => m.xp));
    expect(dani.xp).toBeLessThan(best);
    expect(dani.xp).toBeLessThan(POINTS.adn);
  });

  it("un reto Fácil aprobado supera a una misión de conversar con Dani", () => {
    // Auditoría: un reto de 3 preguntas daba +15 y «3 preguntas a Dani» +90.
    expect(POINTS.challenge.easy).toBeGreaterThan(
      missionXp({ id: "w_dani3", xp: 90 }),
    );
    expect(POINTS.challenge.easy).toBeGreaterThan(missionXp({ id: 3, xp: 75 }));
  });
});

describe("missionXp", () => {
  it("rebaja las misiones guardadas de hablar con Dani para todas las cuentas", () => {
    expect(missionXp({ id: 3, xp: 75 })).toBe(POINTS.daniMission);
    expect(missionXp({ id: "w_dani3", xp: 90 })).toBe(POINTS.daniMission);
  });
  it("deja el resto de misiones como están y tolera datos vacíos", () => {
    expect(missionXp({ id: 6, xp: 80 })).toBe(80);
    expect(missionXp({ id: "w_reto3", xp: 120 })).toBe(120);
    expect(missionXp(null)).toBe(0);
    expect(missionXp({ id: 99 })).toBe(0);
  });
});

describe("tope diario", () => {
  it("cada categoría repetible tiene tope y los retos el más alto", () => {
    expect(DAILY_CAP.challenge_complete).toBeGreaterThan(DAILY_CAP.quiz_pass);
    expect(DAILY_CAP.quiz_pass).toBeGreaterThan(DAILY_CAP.participation);
    for (const cat of Object.values(CATEGORY)) {
      expect(DAILY_CAP[cat], cat).toBeGreaterThan(0);
    }
  });

  it("las categorías son valores válidos del servidor (lista cerrada)", () => {
    const allowed = [
      "lesson_complete",
      "quiz_pass",
      "quiz_excellent",
      "streak_bonus",
      "achievement_unlock",
      "challenge_complete",
      "participation",
      "correction",
      "bonus",
      "adjustment",
    ];
    for (const cat of Object.values(CATEGORY)) expect(allowed).toContain(cat);
  });

  it("suma solo lo ganado hoy en esa categoría", () => {
    const yesterday = new Date("2026-10-06T15:00:00");
    const history = [
      entry(100, "challenge_complete"),
      entry(200, "challenge_complete", yesterday),
      entry(50, "quiz_pass"),
      entry(-500, "challenge_complete"), // canje: no cuenta
      { points: 70, reason: "sin categoría", timestamp: now },
    ];
    expect(earnedToday("challenge_complete", history, now)).toBe(100);
    expect(earnedToday("quiz_pass", history, now)).toBe(50);
    expect(earnedToday("participation", history, now)).toBe(0);
  });

  it("da todos los puntos mientras haya margen", () => {
    expect(
      capPoints({
        category: "challenge_complete",
        amount: 100,
        history: [],
        now,
      }),
    ).toBe(100);
  });

  it("recorta lo que pasa del tope y da 0 cuando ya se llegó", () => {
    const history = [entry(550, "challenge_complete")];
    expect(
      capPoints({ category: "challenge_complete", amount: 200, history, now }),
    ).toBe(50);
    const full = [entry(600, "challenge_complete")];
    expect(
      capPoints({
        category: "challenge_complete",
        amount: 200,
        history: full,
        now,
      }),
    ).toBe(0);
  });

  it("al día siguiente el tope vuelve a empezar", () => {
    const history = [
      entry(600, "challenge_complete", new Date("2026-10-06T20:00:00")),
    ];
    expect(
      capPoints({ category: "challenge_complete", amount: 100, history, now }),
    ).toBe(100);
  });

  it("una categoría sin tope (o un monto negativo) no se toca", () => {
    expect(
      capPoints({ category: "bonus", amount: 500, history: [], now }),
    ).toBe(500);
    expect(
      capPoints({
        category: "challenge_complete",
        amount: -50,
        history: [],
        now,
      }),
    ).toBe(-50);
  });

  it("repetir el mismo mazo no sube de nivel: EduCards se frena", () => {
    const perSession = 2 * 10 + 3 * 10; // 10 tarjetas, todas entendidas
    let history = [];
    let total = 0;
    for (let i = 0; i < 20; i++) {
      const granted = capPoints({
        category: CATEGORY.educards,
        amount: perSession,
        history,
        now,
      });
      total += granted;
      history = [...history, entry(granted, CATEGORY.educards)];
    }
    expect(total).toBe(DAILY_CAP.quiz_pass);
  });
});

describe("premios retirados de la tienda", () => {
  it("«Día Libre», «Certificado VAK» y «Tema Oscuro» se reconocen aunque cambie tilde o mayúscula", () => {
    expect(isRetiredReward({ name: "Día Libre" })).toBe(true);
    expect(isRetiredReward({ name: "dia libre" })).toBe(true);
    expect(isRetiredReward({ name: "Certificado VAK" })).toBe(true);
    expect(isRetiredReward({ name: "Tema Oscuro" })).toBe(true);
    expect(isRetiredReward({ name: "Avatar Dani Animado" })).toBe(false);
    expect(isRetiredReward(null)).toBe(false);
  });

  const catalog = [
    { id: 0, name: "Primer Paso" },
    { id: 1, name: "Tema Oscuro" },
    { id: 4, name: "Día Libre" },
    { id: 6, name: "Certificado VAK" },
    { id: 3, name: "Avatar Dani Animado" },
  ];

  it("la tienda no los ofrece", () => {
    expect(storeRewards(catalog, []).map((r) => r.name)).toEqual([
      "Primer Paso",
      "Avatar Dani Animado",
    ]);
  });

  it("quien ya lo canjeó lo sigue viendo", () => {
    expect(storeRewards(catalog, [4]).map((r) => r.name)).toContain(
      "Día Libre",
    );
    expect(storeRewards(catalog, [4]).map((r) => r.name)).not.toContain(
      "Tema Oscuro",
    );
  });

  it("tolera una lista vacía", () => {
    expect(storeRewards(null)).toEqual([]);
  });
});
