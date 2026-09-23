/**
 * Catálogo de DBA (Derechos Básicos de Aprendizaje, MEN Colombia) con IDs estables.
 * v2 — fuerza rebuild de Vercel tras fallo de caché en deploy 9dce32ed.
 * Espejo del backend (src/services/dbaCatalog.js) para selección client-side
 * sin llamada de red — mismo criterio de generación de IDs en ambos lados.
 */
import curriculo from "../data/curriculo_col.json";

const DBA_BY_SUBJECT_GRADE = new Map();

function buildCatalog() {
  for (const gradeEntry of curriculo.grades) {
    const grade = gradeEntry.grado;
    for (const materia of gradeEntry.materias) {
      const subject = materia.id;
      const key = `${subject}_${grade}`;
      const list = (materia.dba || []).map((text, index) => ({
        id: `co_${subject}_g${grade}_dba${index + 1}`,
        text,
        subject,
        subjectLabel: materia.nombre,
        grade,
      }));
      DBA_BY_SUBJECT_GRADE.set(key, list);
    }
  }
}

buildCatalog();

/** Devuelve los DBA reales de una materia y grado (puede ser []). */
export function getDbaForSubjectGrade(subject, grade) {
  return DBA_BY_SUBJECT_GRADE.get(`${subject}_${grade}`) || [];
}

/**
 * Elige `count` DBA para una materia/grado. Si hay menos DBA que `count`,
 * repite cíclicamente en vez de fallar — un reto siempre debe poder generarse.
 */
export function pickDbaSequence(subject, grade, count) {
  const list = getDbaForSubjectGrade(subject, grade);
  if (list.length === 0) return [];
  const shuffled = [...list].sort(() => Math.random() - 0.5);
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(shuffled[i % shuffled.length]);
  }
  return result;
}
