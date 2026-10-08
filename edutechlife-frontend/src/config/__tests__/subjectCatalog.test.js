import { describe, it, expect } from "vitest";
import {
  SUBJECT_CATALOG,
  LEARN_SUBJECT_IDS,
  CHALLENGE_SUBJECTS,
  getCatalogSubject,
} from "../subjectCatalog";
import { DEFAULT_SUBJECTS } from "../../context/ingenIAData";
import { SUBJECT_META } from "../../components/kids-dashboard/practicarHub/practicarConfig";
import { isChallengeSubjectAvailable } from "../../components/kids-dashboard/challengeEngine/useChallengeEngine";
import { getSubjectEmoji } from "../subjectMappings";
import { DEFAULT_SUBJECTS as DEFAULT_NOTAS_SUBJECTS } from "../../components/kids-dashboard/gradeUtils";

describe("catálogo único de materias", () => {
  it("cada materia tiene id, nombre, emoji y color, sin repetir ids", () => {
    const ids = SUBJECT_CATALOG.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const s of SUBJECT_CATALOG) {
      expect(s.label).toBeTruthy();
      expect(s.emoji).toBeTruthy();
      expect(s.color).toMatch(/^#[0-9A-F]{6}$/i);
    }
  });

  it("Aprender y Practicar usan el mismo emoji y color por materia", () => {
    for (const subject of DEFAULT_SUBJECTS) {
      const meta = SUBJECT_META[subject.id];
      expect(meta, subject.id).toBeTruthy();
      expect(subject.icon).toBe(meta.emoji);
      expect(subject.color).toBe(meta.color);
    }
  });

  it("Historia e Inglés tienen un solo emoji en todas las pantallas", () => {
    expect(getCatalogSubject("historia").emoji).toBe("📜");
    expect(getCatalogSubject("ingles").emoji).toBe("🇬🇧");
    expect(getSubjectEmoji("Historia")).toBe("📜");
    expect(getSubjectEmoji("Inglés")).toBe("🇬🇧");
    expect(DEFAULT_SUBJECTS.find((s) => s.id === "ingles").icon).toBe("🇬🇧");
  });

  it("reconoce los nombres alternos del servidor", () => {
    expect(getCatalogSubject("ciencias_naturales").id).toBe("ciencias");
    expect(getCatalogSubject("ciencias_sociales").id).toBe("sociales");
    expect(getCatalogSubject("nada")).toBeNull();
  });

  it("los retos incluyen Lenguaje y Arte en cualquier grado, también 9.º", () => {
    const ids = CHALLENGE_SUBJECTS.map((s) => s.id);
    expect(ids).toContain("language");
    expect(ids).toContain("art");
    for (const grade of [3, 6, 9, 11]) {
      expect(isChallengeSubjectAvailable("language", grade)).toBe(true);
      expect(isChallengeSubjectAvailable("art", grade)).toBe(true);
    }
  });

  it("las materias especializadas solo aparecen si el grado tiene DBA", () => {
    expect(isChallengeSubjectAvailable("chemistry", 4)).toBe(false);
    expect(isChallengeSubjectAvailable("chemistry", 9)).toBe(true);
    expect(isChallengeSubjectAvailable("philosophy", 9)).toBe(false);
    expect(isChallengeSubjectAvailable("philosophy", 10)).toBe(true);
  });

  it("todo id de Aprender existe en el catálogo", () => {
    for (const id of LEARN_SUBJECT_IDS)
      expect(getCatalogSubject(id)).toBeTruthy();
  });

  it("Educación Física y Tecnología (que Notas ofrece) comparten emoji con el resto de pantallas", () => {
    expect(getCatalogSubject("educacion_fisica")).toMatchObject({
      label: "Educación Física",
      emoji: "⚽",
    });
    expect(getCatalogSubject("tecnologia")).toMatchObject({
      label: "Tecnología",
      emoji: "💻",
    });
    expect(getSubjectEmoji("Educación Física")).toBe("⚽");
    expect(getSubjectEmoji("Tecnología")).toBe("💻");
  });

  it("las materias de Notas existen todas en el catálogo", () => {
    for (const key of DEFAULT_NOTAS_SUBJECTS) {
      expect(getCatalogSubject(key), key).toBeTruthy();
    }
  });

  it("las materias sin reto no aparecen entre los retos ni rompen sus ids", () => {
    const ids = CHALLENGE_SUBJECTS.map((s) => s.id);
    expect(ids).not.toContain("educacion_fisica");
    expect(ids).not.toContain("tecnologia");
    expect(ids.every(Boolean)).toBe(true);
    expect(isChallengeSubjectAvailable("educacion_fisica", 9)).toBe(false);
  });
});
