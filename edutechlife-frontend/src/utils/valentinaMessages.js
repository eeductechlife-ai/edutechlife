/**
 * Mensajes de Valeria - Psicóloga Educativa VAK
 * Sistema conversacional adaptado por edad (6-10, 11-14, 15-17 años)
 * Rol: Psicóloga especialista en metodología VAK con 10 años de experiencia
 * NOTA: Los emojis NO están en los textos - se usan como expresiones visuales
 */

export const getAgeGroup = (age) => {
  if (age >= 6 && age <= 10) return 'child';
  if (age >= 11 && age <= 14) return 'preteen';
  if (age >= 15 && age <= 17) return 'teen';
  return 'preteen';
};

// Expresiones de Valeria (para mostrar visualmente, no se leen en voz alta)
export const VALERIA_EXPRESSIONS = {
  neutral: '🧠',        // Profesional/neutral
  happy: '😊',          // Feliz/alegre
  excited: '🤩',        // Emocionada
  thinking: '🤔',        // Pensando
  encouraging: '💪',     // Motivando
  celebrating: '🎉',    // Celebrando
  calm: '😌',            // Tranquila
  proud: '🌟',           // Orgullosa
  concerned: '😟',        // Preocupada
  curious: '🤓',        // Curiosa
};

export const VALENTINA_MESSAGES = {
  // Mensajes universales
  all: {
    readQuestion: (current, total, questionText, options) => {
      const optionsText = options.map((opt, i) => 
        `Opción ${i + 1}: ${opt.text}`
      ).join('. ');
      return `Pregunta ${current} de ${total}. ${questionText}. ${optionsText}`;
    },
    
    encouragement: (name, age) => {
      const messages = [
        `¡Muy bien, ${name}! Esa elección dice mucho sobre cómo funciona tu cerebro.`,
        `¡Excelente, ${name}! Tu cerebro está trabajando de manera excelente.`,
        `¡Perfecto! Continúa así, ${name}.`,
        `¡Buena elección! ¡Vas muy bien, ${name}!`,
        `¡Impresionante, ${name}! Tu intuición es muy buena.`
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    },
    
    finalFarewell: (name) => `Fue un placer acompañarte, ${name}. Recuerda practicar las estrategias de tu reporte. ¡Mucho éxito!`
  },

  // 6-10 años (Niños) - Tono: Cálido, lúdico, motivacional
  child: {
    welcome: () => `¡Hola! Soy Valeria, psicóloga educativa especialista en metodología VAK. Tengo 10 años de experiencia trabajando con estudiantes como tú.

Hoy vamos a descubrir cómo aprende mejor tu cerebro. ¿Sabías que cada persona tiene un superpower para aprender? Algunos prefieren ver las cosas, otros escuchar, y otros necesitan tocar y experimentar.

Este diagnóstico tiene 10 preguntas muy divertidas. Yo te las leeré una por una y tú seleccionarás la opción que mejor te describa.

No hay respuestas correctas o incorrectas, solo tu forma de ser.

¿Te emociona descubrir tu superpower de aprendizaje? ¡Vamos a comenzar!`,

    askName: () => `Primero, ¿cómo te llamas?`,

    confirmName: (name) => `¡Mucho gusto, ${name}! Soy Valeria y voy a ser tu guía en esta aventura. Es un placer conocerte. ¿Sabías que descubrir cómo aprendes puede hacer que tus tareas sean más fáciles y divertidas?`,

    askAge: (name) => `${name}, ¿cuántos años tienes?`,

    confirmAge: (name, age) => `¡Increíble, ${name}! A los ${age} años tu cerebro está en pleno crecimiento. La ciencia dice que conocer tu estilo de aprendizaje puede mejorar hasta un 40 por ciento cómo aprendes. ¡Imagina eso!`,

    askEmail: () => `¿Cuál es tu correo electrónico? Lo usaré para enviarte tu reporte especial.`,

    askPhone: () => `¿Y tu número de teléfono? Así podré contactarte si tienes dudas.`,

    askMood: (name) => `${name}, antes de comenzar, ¿cómo te sientes hoy?`,

    feedbackMood: (mood, name) => {
      const messages = {
        happy: `¡Qué maravillosa noticia, ${name}! Como psicóloga con experiencia, te digo que la felicidad es el mejor estado para aprender. Cuando estamos felices, nuestro cerebro crea nuevas conexiones más fácilmente. ¡Con esa energía, vas a descubrir cosas increíbles sobre ti mismo!`,
        
        excited: `¡Wow, ${name}! Tu emoción es contagiosa y crea el ambiente perfecto para aprender. Los estudiantes emocionados recuerdan mejor la información y exploran más opciones. ¡Vamos a usar esa energía para descubrir tu estilo!`,
        
        calm: `${name}, la calma es tu mejor amiga para este proceso. Cuando estamos tranquilos, nuestro cerebro puede enfocarse mejor y procesar información de manera más profunda. Respira hondo y disfrutemos este momento de descubrimiento.`,
        
        curious: `¡Me encanta tu curiosidad, ${name}! La curiosidad es el motor del aprendizaje. Los estudiantes curiosos hacen mejores preguntas y encuentran respuestas más profundas. ¡Perfecto para explorar cómo aprende tu cerebro!`,
        
        tired: `${name}, lo entiendo perfectamente. A veces el cansancio puede afectar cómo respondemos, pero no te preocupes. Este diagnóstico es rápido y las respuestas que nos des hoy te darán herramientas para tener más energía cuando estudies. ¿Comenzamos con calma?`,
        
        stressed: `${name}, quiero que sepas que estoy aquí para ayudarte. Como psicóloga, he ayudado a muchos estudiantes a manejar diferentes emociones. Respira profundo... así... muy bien. Los resultados de hoy te darán claridad y eso reducirá cualquier preocupación. ¡Confío en ti!`,
        
        neutral: `¡Perfecto, ${name}! Vamos a tomarnos nuestro tiempo para responder cada pregunta con calma y honestidad. No hay prisa, lo importante es que seas auténtico contigo mismo. ¿Comenzamos?`
      };
      return messages[mood] || messages.neutral;
    },

    transitionToTest: (name) => `¡Excelente, ${name}! Vamos a comenzar. Yo te leeré cada pregunta en voz alta y tú seleccionarás la opción que mejor te describa. No hay respuestas correctas o incorrectas, solo tu verdad. ¿Listos? ¡Aquí va la primera!`,

    progressMessages: {
      3: (name) => `¡${name}! Ya vamos por la pregunta 4. Casi terminamos la primera mitad. ¡Tu cerebro está trabajando de manera excelente! ¡Sigue así!`,
      6: (name) => `¡${name}! ¡Mitad del camino completado! ¡Estoy tan impresionada de lo bien que estás trabajando en conocerte a ti mismo! Continúa con esa misma energía increíble. ¡Ya casi terminamos!`,
      9: (name) => `¡${name}! Última pregunta, lo prometo. Solo una más y conocerás tu estilo de aprendizaje. Tu cerebro ha estado trabajando tan duro... ¡Estoy orgullosa de ti! ¡Tú puedes! ¡Ya casi!`
    },

    results: (name, style, percentage, description) => {
      const styleNames = {
        visual: 'APRENDIZ VISUAL',
        auditivo: 'APRENDIZ AUDITIVO',
        kinestesico: 'APRENDIZ KINESTÉSICO'
      };
      return `¡Felicidades, ${name}! Después de analizar tus respuestas con cuidado, he identificado tu estilo de aprendizaje predominante...

Eres un ${styleNames[style] || style} al ${percentage} por ciento.

Esto significa que tu cerebro procesa mejor la información cuando ${description}.

En tu reporte encontrarás estrategias específicas diseñadas para ti, ${name}, basadas en técnicas probadas por la psicología educativa que funcionan muy bien con tu tipo de cerebro.

¡Fue un placer acompañarte en este proceso de descubrimiento, ${name}! Si tienes dudas sobre tu diagnóstico, puedes consultarme cuando quieras. ¡Mucho éxito en tu camino de aprendizaje!`;
    }
  },

  // 11-14 años (Preadolescentes) - Tono: Equilibrado, respetuoso, motivacional
  preteen: {
    welcome: () => `Hola, soy Valeria. Soy psicóloga educativa especializada en metodología VAK con 10 años de experiencia trabajando con estudiantes de tu edad.

Hoy vamos a descubrir tu estilo de aprendizaje. ¿Sabías que cada persona tiene una forma única de procesar información?

Este diagnóstico tiene 10 preguntas. Yo te las leeré y tú seleccionarás la que mejor describa tu forma de aprender. No hay respuestas correctas o incorrectas, solo tus preferencias naturales.

Al final, te daré un reporte personalizado con estrategias específicas para mejorar tu estudio. ¿Listo?`,

    askName: () => `Antes de comenzar, ¿cómo te llamas?`,

    confirmName: (name) => `¡Mucho gusto, ${name}! Soy Valeria y voy a ser tu guía en este proceso. La psicología educativa dice que conocerte a ti mismo es el primer paso para mejorar tu aprendizaje.`,

    askAge: (name) => `${name}, ¿cuántos años tienes?`,

    confirmAge: (name, age) => `Perfecto, ${name}. A los ${age} años estás en una etapa ideal para descubrir cómo aprende tu cerebro. Los estudios muestran que el autoconocimiento mejora el rendimiento académico hasta en un 30 por ciento.`,

    askEmail: () => `¿Cuál es tu correo electrónico? Lo usaré para enviarte tu reporte personalizado.`,

    askPhone: () => `¿Y tu número de teléfono? Lo usaremos solo para contactarte si es necesario.`,

    askMood: (name) => `${name}, ¿cómo te sientes hoy? Tu estado emocional influye directamente en cómo procesas y retienes información.`,

    feedbackMood: (mood, name) => {
      const messages = {
        happy: `¡Qué bien, ${name}! La psicología positiva nos dice que las emociones positivas mejoran la memoria y la creatividad. Estudios demuestran que los estudiantes en estado positivo aprenden hasta un 40 por ciento más rápido. ¡Con esa energía, este diagnóstico será muy efectivo!`,
        
        excited: `¡Genial, ${name}! Tu entusiasmo es perfecto para aprender. Los estudiantes motivados retienen mejor la información y participan más activamente. ¡Vamos a aprovechar esa energía para descubrir tu estilo!`,
        
        calm: `${name}, la calma es ideal para reflexionar y procesar información profundamente. Cuando estamos tranquilos, podemos pensar con mayor claridad y tomar mejores decisiones. ¡Perfecto estado para este proceso!`,
        
        curious: `¡Excelente, ${name}! La curiosidad impulsa el aprendizaje profundo. Los estudiantes curiosos exploran más opciones, hacen mejores preguntas y recuerdan mejor la información. ¡Ideal para este diagnóstico!`,
        
        tired: `${name}, lo entiendo perfectamente. Este diagnóstico es breve y los resultados te darán herramientas útiles para el futuro. Conocer tu estilo de aprendizaje te ayudará a estudiar de manera más eficiente y con menos agotamiento. ¿Empezamos con calma?`,
        
        stressed: `${name}, estoy aquí para ayudarte. Como profesional con experiencia, he visto cómo el autoconocimiento reduce significativamente la ansiedad académica. Este diagnóstico te dará claridad sobre cómo aprendes mejor, y eso reducirá mucho tu estrés. ¡Confío en ti!`,
        
        neutral: `Perfecto, ${name}. Vamos a trabajar juntos para conocerte mejor. No hay presión, solo exploración honesta de cómo funciona tu cerebro. ¿Comenzamos el diagnóstico?`
      };
      return messages[mood] || messages.neutral;
    },

    transitionToTest: (name) => `¡Perfecto, ${name}! Vamos a comenzar el diagnóstico. Yo te leeré las preguntas una por una y tú seleccionarás la que mejor refleje tu forma natural de aprender. No hay respuestas correctas o incorrectas. ¿Listos? Aquí va la primera pregunta.`,

    progressMessages: {
      3: (name) => `¡${name}! Ya vamos por la pregunta 4. Casi completamos la primera mitad del diagnóstico. ¡Tu cerebro está funcionando muy bien! Continúa así.`,
      6: (name) => `¡${name}! ¡Mitad del camino completado! Estoy impresionada de lo bien que estás trabajando en conocerte a ti mismo. ¡Sigue con esa misma energía! Ya casi terminamos.`,
      9: (name) => `¡${name}! Última pregunta. Solo una más y conocerás tu estilo de aprendizaje. Tu cerebro ha estado procesando información de manera excelente. ¡Tú puedes! Ya casi.`
    },

    results: (name, style, percentage, description) => {
      const styleNames = {
        visual: 'APRENDIZ VISUAL',
        auditivo: 'APRENDIZ AUDITIVO',
        kinestesico: 'APRENDIZ KINESTÉSICO'
      };
      return `¡Felicidades, ${name}! Después de analizar tus respuestas con cuidado, he identificado tu estilo de aprendizaje predominante...

Eres un ${styleNames[style] || style} al ${percentage} por ciento.

Esto significa que tu cerebro procesa mejor la información cuando ${description}.

En tu reporte encontrarás estrategias específicas diseñadas para ti, ${name}, basadas en técnicas probadas por la psicología educativa que funcionan especialmente bien con tu tipo de cerebro.

¡Fue un placer acompañarte en este proceso, ${name}! Si tienes dudas sobre tu diagnóstico, puedes consultarme cuando quieras. ¡Mucho éxito en tu camino de aprendizaje!`;
    }
  },

  // 15-17 años (Adolescentes) - Tono: Profesional, directo, moderno
  teen: {
    welcome: () => `Soy Valeria, psicóloga especialista en metodología VAK. Con 10 años de experiencia en psicología educativa, te acompaño en este diagnóstico.

El objetivo: identificar tu estilo de aprendizaje predominante. Esto te dará insights concretos respaldados por la neurociencia cognitiva sobre cómo procesa información tu cerebro.

10 preguntas. Yo las leo, tú seleccionas tu respuesta más auténtica según cómo aprendes naturalmente. Sin juicio, solo autoconocimiento.

¿Comenzamos?`,

    askName: () => `¿Cómo te llamas?`,

    confirmName: (name) => `Encantada, ${name}. Soy Valeria. Procederemos con el diagnóstico.`,

    askAge: (name) => `${name}, ¿cuántos años tienes?`,

    confirmAge: (name, age) => `${name}, ${age} años. La adolescencia es una etapa crítica para el desarrollo cognitivo. Este diagnóstico te dará herramientas concretas para optimizar tu aprendizaje basado en evidencia científica.`,

    askEmail: () => `Correo electrónico (obligatorio para recibir tu reporte personalizado).`,

    askPhone: () => `Teléfono (para seguimiento académico si es necesario).`,

    askMood: (name) => `${name}, ¿cómo te sientes hoy? La investigación en neurociencia cognitiva demuestra que el estado emocional afecta directamente la capacidad de procesamiento y retención de información.`,

    feedbackMood: (mood, name) => {
      const messages = {
        happy: `${name}, la ciencia confirma que la felicidad mejora la memoria, la creatividad y la capacidad de resolución de problemas. Las emociones positivas optimizan la plasticidad cerebral para el aprendizaje.`,
        
        excited: `${name}, la excitación emocional activa los sistemas dopaminérgicos del cerebro, mejorando la atención y la consolidación de memoria. Ideal para el aprendizaje activo.`,
        
        calm: `${name}, la calma favorece la activación de la corteza prefrontal, lo que mejora la concentración profunda y el pensamiento analítico. Estado óptimo para procesar información compleja.`,
        
        curious: `${name}, la curiosidad activa el sistema de recompensa cerebral y promueve la liberación de dopamina, lo que facilita el aprendizaje profundo y la retención a largo plazo.`,
        
        tired: `${name}, el cansancio cognitivo afecta la función ejecutiva y la memoria de trabajo. Este diagnóstico es breve. Los resultados te darán estrategias para optimizar tu energía mental.`,
        
        stressed: `${name}, entiendo. El estrés crónico puede impair la memoria y la toma de decisiones. El autoconocimiento es una herramienta poderosa para reducir la ansiedad académica. Te ayudo con esto.`,
        
        neutral: `Bien, ${name}. Procedemos con el diagnóstico. La honestidad en tus respuestas es clave para obtener insights útiles sobre tu estilo de aprendizaje.`
      };
      return messages[mood] || messages.neutral;
    },

    transitionToTest: (name) => `Perfecto, ${name}. Iniciamos el diagnóstico. Te leeré las preguntas una por una. Selecciona la respuesta que mejor refleje cómo aprendes naturalmente. Sin presión, solo autoconocimiento.`,

    progressMessages: {
      3: (name) => `${name}, vamos por la pregunta 4. Primera mitad casi completa. Tu procesamiento cognitivo está funcionando muy bien.`,
      6: (name) => `${name}, mitad del diagnóstico completada. Estoy impresionada por tu nivel de autoconocimiento. Continúa con esa misma coherencia.`,
      9: (name) => `${name}, última pregunta. Solo una más. Tu perfil de aprendizaje está casi completo. ¡Ya casi!`
    },

    results: (name, style, percentage, description) => {
      const styleNames = {
        visual: 'APRENDIZ VISUAL',
        auditivo: 'APRENDIZ AUDITIVO',
        kinestesico: 'APRENDIZ KINESTÉSICO'
      };
      return `${name}, los resultados del diagnóstico están listos.

Tu estilo de aprendizaje predominante es: ${styleNames[style] || style} con un ${percentage} por ciento de correspondencia.

Esto indica que tu cerebro procesa información de manera más eficiente cuando ${description}.

En tu reporte personalizado encontrarás estrategias específicas respaldadas por la neurociencia cognitiva, diseñadas para optimizar tu proceso de aprendizaje basado en tu perfil neurológico único.

Fue un placer acompañarte en este proceso de autoconocimiento académico. Los insights de hoy te darán una ventaja significativa en tu desarrollo educativo. ¡Éxito!`;
    }
  }
};

// Funciones helper para obtener mensajes
export const getWelcomeMessage = () => {
  return VALENTINA_MESSAGES.preteen.welcome();
};

export const getEncouragement = (name, age) => {
  return VALENTINA_MESSAGES.all.encouragement(name, age);
};

export const getProgressMessage = (name, current, total, age) => {
  const ageGroup = getAgeGroup(age);
  const progressMessages = VALENTINA_MESSAGES[ageGroup].progressMessages;
  return progressMessages[current] ? progressMessages[current](name) : null;
};

export const getMoodFeedback = (mood, name, age) => {
  const ageGroup = getAgeGroup(age);
  return VALENTINA_MESSAGES[ageGroup].feedbackMood(mood, name);
};

export default VALENTINA_MESSAGES;
