import trainingData from './nico-training-data.json';

export const EDUTECHLIFE_KNOWLEDGE = (() => {
  const d = trainingData;
  const aboutContent = `${d.company.description} ${d.company.problem}`;

  const vakStyles = Object.entries(d.services.diagnostico_vak?.styles || {}).map(
    ([k, v]) => `${k}: ${v}`
  ).join('. ');

  return {
    about: {
      title: "Qué es EdutechLife",
      content: aboutContent,
      tags: ["educación", "STEM", "acompañamiento", "integral"]
    },
    problem: {
      title: "Problema que resuelve EdutechLife",
      content: d.company.problem,
      tags: ["problema", "bienestar", "emocional", "conexión"]
    },
    market: {
      title: "Estudios de Mercado",
      content: {
        necesidad: d.company.metrics.students,
        tendencias: d.company.metrics.gradeImprovement,
        crecimiento: "Crecimiento anual del sector: 50% aumento en usuarios en últimos 6 meses.",
        stem: "Programas STEM integrados con metodología VAK."
      },
      tags: ["mercado", "investigación", "estadísticas"]
    },
    traction: {
      title: "Tracción de EdutechLife",
      content: {
        crecimiento: `${d.company.metrics.activeUsersGrowth}. Total: ${d.company.metrics.totalStudents}.`,
        retencion: `Retención: ${d.company.metrics.retention}. Renovación: ${d.company.metrics.annualRenewal}.`,
        resultados: `${d.company.metrics.gradeImprovement}. ${d.company.metrics.parentSatisfaction}.`
      },
      tags: ["crecimiento", "usuarios", "resultados", "premios"]
    },
    objectives: {
      title: "Objetivos de EdutechLife",
      content: [
        "Mejorar el Rendimiento Académico",
        "Promover el Bienestar Emocional",
        "Desarrollar Habilidades STEM",
        "Ofrecer Acompañamiento Integral",
        "Expandir el Alcance"
      ],
      tags: ["objetivos", "metas", "misión"]
    },
    team: {
      title: "Equipo de EdutechLife",
      content: d.team,
      tags: ["equipo", "directivos", "profesionales"]
    },
    services: {
      title: "Servicios de EdutechLife",
      content: {
        stem: d.services.stem_steam.description,
        vak: d.services.diagnostico_vak.description,
        bienestar: d.services.bienestar_emocional.description,
        tutoring: d.services.tutoring.description,
        certificaciones: d.services.certificaciones.description
      },
      tags: ["servicios", "educación", "programas"]
    },
    contact: {
      title: "Contacto",
      content: d.contact,
      tags: ["contacto", "soporte"]
    }
  };
})();

export default EDUTECHLIFE_KNOWLEDGE;
