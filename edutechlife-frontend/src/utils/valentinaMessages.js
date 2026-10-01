/**
 * Frases que Valeria dice en voz alta en el ADN de Aprendizaje.
 * Valeria es una guía de aprendizaje con IA: no se presenta como psicóloga ni
 * afirma estudios o cifras. El texto de las preguntas y del resultado está en
 * español, así que la voz también.
 */
const STYLE_VERBS = {
  visual: "viendo",
  auditivo: "escuchando",
  kinestesico: "haciendo",
};

export const VALENTINA_MESSAGES = {
  all: {
    readQuestion: (current, total, questionText, options) => {
      const optionsText = options.map((opt) => opt.text).join(". ");
      return `Pregunta ${current} de ${total}. ${questionText}. ${optionsText}`;
    },

    resultsShort: (name, style) => {
      const verb = STYLE_VERBS[style] || style;
      return `¡Listo, ${name}! Hoy se te da más aprender ${verb}. En pantalla tienes tu mezcla, tu superpoder, unos trucos para estudiar y un reto para esta semana. Recuerda que esto muestra cómo te gusta aprender hoy y puede cambiar. ¡Fue un placer acompañarte!`;
    },
  },
};

export default VALENTINA_MESSAGES;
