/**
 * Catálogo de DBA (Derechos Básicos de Aprendizaje, MEN Colombia) con IDs estables.
 *
 * Reemplaza los IDs de competencia genéricos de competencyMastery.js
 * (ej. co_matematicas_6-7_0..3, sin relación con contenido real) por IDs
 * atados a un DBA específico del currículo, para que el dominio del
 * estudiante se mida por tema real ("fracciones") y no por materia entera.
 *
 * NOTA: curriculo_col.json vive duplicado aquí y en
 * edutechlife-frontend/src/data/ porque Vercel empaqueta cada función
 * serverless solo con archivos dentro de su propio directorio de deploy —
 * una referencia cruzada a la carpeta del frontend funcionaría en local
 * pero rompería en producción. Si el currículo cambia, actualizar ambas copias.
 */

const curriculo = require('../data/curriculo_col.json');

// id -> { id, text, subject, grade, competencia }
const DBA_BY_ID = new Map();
// "subject_grade" -> [dbaId, ...]
const DBA_BY_SUBJECT_GRADE = new Map();

function buildCatalog() {
  for (const gradeEntry of curriculo.grades) {
    const grade = gradeEntry.grado;
    for (const materia of gradeEntry.materias) {
      const subject = materia.id;
      const key = `${subject}_${grade}`;
      const ids = [];
      (materia.dba || []).forEach((text, index) => {
        const id = `co_${subject}_g${grade}_dba${index + 1}`;
        DBA_BY_ID.set(id, {
          id,
          text,
          subject,
          subjectLabel: materia.nombre,
          grade,
        });
        ids.push(id);
      });
      DBA_BY_SUBJECT_GRADE.set(key, ids);
    }
  }
}

buildCatalog();

/**
 * Devuelve los DBA reales de una materia y grado.
 * @param {string} subject - ej. 'matematicas'
 * @param {number} grade - 1 a 11
 * @returns {Array<{id, text, subject, subjectLabel, grade}>}
 */
function getDbaForSubjectGrade(subject, grade) {
  const ids = DBA_BY_SUBJECT_GRADE.get(`${subject}_${grade}`) || [];
  return ids.map((id) => DBA_BY_ID.get(id));
}

/**
 * Devuelve un DBA al azar de una materia/grado — usado para generar
 * preguntas de retos/exámenes atadas a un tema específico real.
 */
function getRandomDba(subject, grade) {
  const list = getDbaForSubjectGrade(subject, grade);
  if (list.length === 0) return null;
  return list[Math.floor(Math.random() * list.length)];
}

/**
 * Busca un DBA por su ID estable.
 */
function getDbaById(id) {
  return DBA_BY_ID.get(id) || null;
}

/**
 * Todos los DBA de una materia a través de todos los grados (para reportes
 * agregados del plan de mejora / padre).
 */
function getDbaForSubject(subject) {
  return Array.from(DBA_BY_ID.values()).filter((d) => d.subject === subject);
}

module.exports = {
  getDbaForSubjectGrade,
  getRandomDba,
  getDbaById,
  getDbaForSubject,
};
