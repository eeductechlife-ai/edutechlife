import { describe, it, expect } from "vitest";
import { activityRoute, subjectIdFor, routeLabel } from "../planActivity";

describe("subjectIdFor", () => {
  it("maps the AI's subject prose to Practicar subjects", () => {
    expect(subjectIdFor("Matemáticas")).toBe("matematicas");
    expect(subjectIdFor("Ciencias Naturales")).toBe("ciencias");
    expect(subjectIdFor("Ciencias Sociales")).toBe("historia");
    expect(subjectIdFor("Inglés")).toBe("ingles");
    expect(subjectIdFor("Todas")).toBeNull();
  });
});

describe("activityRoute", () => {
  const week = { focus: "Matemáticas" };

  it("uses the activity's words first", () => {
    expect(activityRoute({ titulo: "Reto de fracciones" }, week).tool).toBe(
      "retos",
    );
    expect(
      activityRoute({ titulo: "Tarjetas de vocabulario" }, { focus: "Inglés" }),
    ).toMatchObject({ tool: "educards", subjectId: "ingles" });
    expect(
      activityRoute(
        { titulo: "Haz un mapa mental de la célula" },
        { focus: "Ciencias" },
      ),
    ).toMatchObject({ tool: "material", type: "mapa", subjectId: "ciencias" });
    expect(
      activityRoute(
        { titulo: "Línea del tiempo de la independencia" },
        { focus: "Sociales" },
      ).type,
    ).toBe("infografia");
  });

  it("falls back to the activity type, then the kid's ADN style", () => {
    const pizza = { titulo: "Fracciones con pizza de papel" };
    expect(activityRoute({ ...pizza, tipo: "kinestesico" }, week).type).toBe(
      "ejercicios",
    );
    expect(activityRoute(pizza, week, { vakStyle: "auditivo" }).type).toBe(
      "resumen",
    );
    const r = activityRoute(pizza, week);
    expect(r).toMatchObject({
      tool: "material",
      type: "infografia",
      subjectId: "matematicas",
      topic: "Fracciones con pizza de papel",
    });
    expect(routeLabel(r)).toBe("🖼️ Infografía");
  });

  it("gives EduCards and retos the subject matter, not the tool words", () => {
    expect(
      activityRoute({ titulo: "Tarjetas de las tablas del 6" }, week).topic,
    ).toBe("tablas del 6");
    expect(
      activityRoute({ titulo: "Haz un reto de fracciones" }, week).topic,
    ).toBe("fracciones");
    expect(
      activityRoute({ titulo: "Fracciones con pizza de papel" }, week).topic,
    ).toBe("Fracciones con pizza de papel");
  });

  it("uses the plan's weakest subject when the week is general", () => {
    const r = activityRoute(
      { titulo: "Repaso general" },
      { focus: "Todas" },
      { weakSubjects: ["Inglés"] },
    );
    expect(r.subjectId).toBe("ingles");
  });
});
