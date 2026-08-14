export const getAgeGroup = (age) => {
  if (age >= 6 && age <= 10) return "child";
  if (age >= 11 && age <= 14) return "preteen";
  if (age >= 15 && age <= 17) return "teen";
  return "preteen";
};

export const VALERIA_EXPRESSIONS = {
  neutral: "🧠",
  happy: "😊",
  excited: "🤩",
  thinking: "🤔",
  encouraging: "💪",
  celebrating: "🎉",
  calm: "😌",
  proud: "🌟",
  concerned: "😟",
  curious: "🤓",
};

export const VALENTINA_MESSAGES = {
  all: {
    readQuestion: (current, total, questionText, options) => {
      const optionsText = options.map((opt, i) => `${opt.text}`).join(". ");
      return `Pregunta ${current} de ${total}. ${questionText}. ${optionsText}`;
    },

    encouragement: (name, age) => {
      const messages = [
        `¡Muy bien, ${name}! Esa elección dice mucho sobre cómo funciona tu cerebro.`,
        `¡Excelente, ${name}! Tu cerebro está trabajando de manera excelente.`,
        `¡Perfecto! Continúa así, ${name}.`,
        `¡Buena elección! ¡Vas muy bien, ${name}!`,
        `¡Impresionante, ${name}! Tu intuición es muy buena.`,
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    },

    finalFarewell: (name) =>
      `Fue un placer acompañarte, ${name}. Recuerda practicar las estrategias de tu reporte. ¡Mucho éxito!`,

    resultsShort: (name, style, percentage, age) => {
      const styleNames = {
        visual: "VISUAL",
        auditivo: "AUDITIVO",
        kinestesico: "KINESTÉSICO",
      };
      const styleName = styleNames[style] || style;
      const isChild = age >= 6 && age <= 10;
      const downloadHint = isChild
        ? 'Pídele a tu acudiente que descargue el PDF completo con el botón "Descargar PDF".'
        : 'Puedes descargar tu diagnóstico completo en PDF con el botón "Descargar PDF" que verás en pantalla.';
      return `¡Felicidades, ${name}! Tu estilo de aprendizaje predominante es ${styleName} con un ${percentage} por ciento de correspondencia. En pantalla puedes ver tu informe completo con estrategias, fortalezas y carreras recomendadas especialmente para ti. ${downloadHint} ¡Fue un placer acompañarte en este proceso!`;
    },
  },

  child: {
    welcome: () =>
      `¡Hola! Soy Valeria, psicóloga educativa. Hoy descubriremos cómo aprende mejor tu cerebro. Son 10 preguntas divertidas. Yo las leo, tú eliges la opción que más te guste. No hay respuestas incorrectas. ¿Listo para descubrir tu superpoder de aprendizaje? ¡Empecemos!`,

    askName: () => `Primero, ¿cómo te llamas?`,

    confirmName: (name) =>
      `¡Mucho gusto, ${name}! Soy Valeria y voy a ser tu guía en esta aventura. Es un placer conocerte. ¿Sabías que descubrir cómo aprendes puede hacer que tus tareas sean más fáciles y divertidas?`,

    askAge: (name) => `${name}, ¿cuántos años tienes?`,

    confirmAge: (name, age) =>
      `¡Increíble, ${name}! A los ${age} años tu cerebro está en pleno crecimiento. La ciencia dice que conocer tu estilo de aprendizaje puede mejorar hasta un 40 por ciento cómo aprendes. ¡Imagina eso!`,

    askEmail: () =>
      `¿Cuál es tu correo electrónico? Lo usaré para enviarte tu reporte especial.`,

    askPhone: () =>
      `¿Y tu número de teléfono? Así podré contactarte si tienes dudas.`,

    askMood: (name) => `${name}, antes de comenzar, ¿cómo te sientes hoy?`,

    feedbackMood: (mood, name) => {
      const messages = {
        happy: `¡Qué maravillosa noticia, ${name}! Como psicóloga con experiencia, te digo que la felicidad es el mejor estado para aprender. Cuando estamos felices, nuestro cerebro crea nuevas conexiones más fácilmente. ¡Con esa energía, vas a descubrir cosas increíbles sobre ti mismo!`,

        excited: `¡Wow, ${name}! Tu emoción es contagiosa y crea el ambiente perfecto para aprender. Los estudiantes emocionados recuerdan mejor la información y exploran más opciones. ¡Vamos a usar esa energía para descubrir tu estilo!`,

        calm: `${name}, la calma es tu mejor amiga para este proceso. Cuando estamos tranquilos, nuestro cerebro puede enfocarse mejor y procesar información de manera más profunda. Respira hondo y disfrutemos este momento de descubrimiento.`,

        curious: `¡Me encanta tu curiosidad, ${name}! La curiosidad es el motor del aprendizaje. Los estudiantes curiosos hacen mejores preguntas y encuentran respuestas más profundas. ¡Perfecto para explorar cómo aprende tu cerebro!`,

        tired: `${name}, lo entiendo perfectamente. A veces el cansancio puede afectar cómo respondemos, pero no te preocupes. Este diagnóstico es rápido y las respuestas que nos des hoy te darán herramientas para tener más energía cuando estudies. ¿Comenzamos con calma?`,

        stressed: `${name}, quiero que sepas que estoy aquí para ayudarte. Como psicóloga, he ayudado a muchos estudiantes a manejar diferentes emociones. Respira profundo... así... muy bien. Los resultados de hoy te darán claridad y eso reducirá cualquier preocupación. ¡Confío en ti!`,

        neutral: `¡Perfecto, ${name}! Vamos a tomarnos nuestro tiempo para responder cada pregunta con calma y honestidad. No hay prisa, lo importante es que seas auténtico contigo mismo. ¿Comenzamos?`,
      };
      return messages[mood] || messages.neutral;
    },

    transitionToTest: (name) =>
      `¡Excelente, ${name}! Vamos a comenzar. Yo te leeré cada pregunta en voz alta y tú seleccionarás la opción que mejor te describa. No hay respuestas correctas o incorrectas, solo tu verdad. ¿Listos? ¡Aquí va la primera!`,

    progressMessages: {
      3: (name) =>
        `¡${name}! Ya vamos por la pregunta 4. Casi terminamos la primera mitad. ¡Tu cerebro está trabajando de manera excelente! ¡Sigue así!`,
      6: (name) =>
        `¡${name}! ¡Mitad del camino completado! ¡Estoy tan impresionada de lo bien que estás trabajando en conocerte a ti mismo! Continúa con esa misma energía increíble. ¡Ya casi terminamos!`,
      9: (name) =>
        `¡${name}! Última pregunta, lo prometo. Solo una más y conocerás tu estilo de aprendizaje. Tu cerebro ha estado trabajando tan duro... ¡Estoy orgullosa de ti! ¡Tú puedes! ¡Ya casi!`,
    },

    results: (name, style, percentage, description) => {
      const styleNames = {
        visual: "APRENDIZ VISUAL",
        auditivo: "APRENDIZ AUDITIVO",
        kinestesico: "APRENDIZ KINESTÉSICO",
      };
      return `¡Felicidades, ${name}! Después de analizar tus respuestas con cuidado, he identificado tu estilo de aprendizaje predominante...

Eres un ${styleNames[style] || style} al ${percentage} por ciento.

Esto significa que tu cerebro procesa mejor la información cuando ${description}.

En tu reporte encontrarás estrategias específicas diseñadas para ti, ${name}, basadas en técnicas probadas por la psicología educativa que funcionan muy bien con tu tipo de cerebro.

¡Fue un placer acompañarte en este proceso de descubrimiento, ${name}! Si tienes dudas sobre tu diagnóstico, puedes consultarme cuando quieras. ¡Mucho éxito en tu camino de aprendizaje!`;
    },
  },

  preteen: {
    welcome: () =>
      `Hola, soy Valeria, psicóloga educativa. Hoy identificaremos tu estilo de aprendizaje. Son 10 preguntas, yo las leo y tú seleccionas la opción que mejor te describa. No hay respuestas incorrectas. Al final tendrás un reporte personalizado. ¿Comenzamos?`,

    askName: () => `Antes de comenzar, ¿cómo te llamas?`,

    confirmName: (name) =>
      `¡Mucho gusto, ${name}! Soy Valeria y voy a ser tu guía en este proceso. La psicología educativa dice que conocerte a ti mismo es el primer paso para mejorar tu aprendizaje.`,

    askAge: (name) => `${name}, ¿cuántos años tienes?`,

    confirmAge: (name, age) =>
      `Perfecto, ${name}. A los ${age} años estás en una etapa ideal para descubrir cómo aprende tu cerebro. Los estudios muestran que el autoconocimiento mejora el rendimiento académico hasta en un 30 por ciento.`,

    askEmail: () =>
      `¿Cuál es tu correo electrónico? Lo usaré para enviarte tu reporte personalizado.`,

    askPhone: () =>
      `¿Y tu número de teléfono? Lo usaremos solo para contactarte si es necesario.`,

    askMood: (name) =>
      `${name}, ¿cómo te sientes hoy? Tu estado emocional influye directamente en cómo procesas y retienes información.`,

    feedbackMood: (mood, name) => {
      const messages = {
        happy: `¡Qué bien, ${name}! La psicología positiva nos dice que las emociones positivas mejoran la memoria y la creatividad. Estudios demuestran que los estudiantes en estado positivo aprenden hasta un 40 por ciento más rápido. ¡Con esa energía, este diagnóstico será muy efectivo!`,

        excited: `¡Genial, ${name}! Tu entusiasmo es perfecto para aprender. Los estudiantes motivados retienen mejor la información y participan más activamente. ¡Vamos a aprovechar esa energía para descubrir tu estilo!`,

        calm: `${name}, la calma es ideal para reflexionar y procesar información profundamente. Cuando estamos tranquilos, podemos pensar con mayor claridad y tomar mejores decisiones. ¡Perfecto estado para este proceso!`,

        curious: `¡Excelente, ${name}! La curiosidad impulsa el aprendizaje profundo. Los estudiantes curiosos exploran más opciones, hacen mejores preguntas y recuerdan mejor la información. ¡Ideal para este diagnóstico!`,

        tired: `${name}, lo entiendo perfectamente. Este diagnóstico es breve y los resultados te darán herramientas útiles para el futuro. Conocer tu estilo de aprendizaje te ayudará a estudiar de manera más eficiente y con menos agotamiento. ¿Empezamos con calma?`,

        stressed: `${name}, estoy aquí para ayudarte. Como profesional con experiencia, he visto cómo el autoconocimiento reduce significativamente la ansiedad académica. Este diagnóstico te dará claridad sobre cómo aprendes mejor, y eso reducirá mucho tu estrés. ¡Confío en ti!`,

        neutral: `Perfecto, ${name}. Vamos a trabajar juntos para conocerte mejor. No hay presión, solo exploración honesta de cómo funciona tu cerebro. ¿Comenzamos el diagnóstico?`,
      };
      return messages[mood] || messages.neutral;
    },

    transitionToTest: (name) =>
      `¡Perfecto, ${name}! Vamos a comenzar el diagnóstico. Yo te leeré las preguntas una por una y tú seleccionarás la que mejor refleje tu forma natural de aprender. No hay respuestas correctas o incorrectas. ¿Listos? Aquí va la primera pregunta.`,

    progressMessages: {
      3: (name) =>
        `¡${name}! Ya vamos por la pregunta 4. Casi completamos la primera mitad del diagnóstico. ¡Tu cerebro está funcionando muy bien! Continúa así.`,
      6: (name) =>
        `¡${name}! ¡Mitad del camino completado! Estoy impresionada de lo bien que estás trabajando en conocerte a ti mismo. ¡Sigue con esa misma energía! Ya casi terminamos.`,
      9: (name) =>
        `¡${name}! Última pregunta. Solo una más y conocerás tu estilo de aprendizaje. Tu cerebro ha estado procesando información de manera excelente. ¡Tú puedes! Ya casi.`,
    },

    results: (name, style, percentage, description) => {
      const styleNames = {
        visual: "APRENDIZ VISUAL",
        auditivo: "APRENDIZ AUDITIVO",
        kinestesico: "APRENDIZ KINESTÉSICO",
      };
      return `¡Felicidades, ${name}! Después de analizar tus respuestas con cuidado, he identificado tu estilo de aprendizaje predominante...

Eres un ${styleNames[style] || style} al ${percentage} por ciento.

Esto significa que tu cerebro procesa mejor la información cuando ${description}.

En tu reporte encontrarás estrategias específicas diseñadas para ti, ${name}, basadas en técnicas probadas por la psicología educativa que funcionan especialmente bien con tu tipo de cerebro.

¡Fue un placer acompañarte en este proceso, ${name}! Si tienes dudas sobre tu diagnóstico, puedes consultarme cuando quieras. ¡Mucho éxito en tu camino de aprendizaje!`;
    },
  },

  teen: {
    welcome: () =>
      `Soy Valeria, psicóloga especialista en metodología VAK. 10 preguntas para identificar tu estilo de aprendizaje. Yo las leo, tú seleccionas tu respuesta más auténtica. Sin juicio, solo autoconocimiento. ¿Comenzamos?`,

    askName: () => `¿Cómo te llamas?`,

    confirmName: (name) =>
      `Encantada, ${name}. Soy Valeria. Procederemos con el diagnóstico.`,

    askAge: (name) => `${name}, ¿cuántos años tienes?`,

    confirmAge: (name, age) =>
      `${name}, ${age} años. La adolescencia es una etapa crítica para el desarrollo cognitivo. Este diagnóstico te dará herramientas concretas para optimizar tu aprendizaje basado en evidencia científica.`,

    askEmail: () =>
      `Correo electrónico (obligatorio para recibir tu reporte personalizado).`,

    askPhone: () => `Teléfono (para seguimiento académico si es necesario).`,

    askMood: (name) =>
      `${name}, ¿cómo te sientes hoy? La investigación en neurociencia cognitiva demuestra que el estado emocional afecta directamente la capacidad de procesamiento y retención de información.`,

    feedbackMood: (mood, name) => {
      const messages = {
        happy: `${name}, la ciencia confirma que la felicidad mejora la memoria, la creatividad y la capacidad de resolución de problemas. Las emociones positivas optimizan la plasticidad cerebral para el aprendizaje.`,

        excited: `${name}, la excitación emocional activa los sistemas dopaminérgicos del cerebro, mejorando la atención y la consolidación de memoria. Ideal para el aprendizaje activo.`,

        calm: `${name}, la calma favorece la activación de la corteza prefrontal, lo que mejora la concentración profunda y el pensamiento analítico. Estado óptimo para procesar información compleja.`,

        curious: `${name}, la curiosidad activa el sistema de recompensa cerebral y promueve la liberación de dopamina, lo que facilita el aprendizaje profundo y la retención a largo plazo.`,

        tired: `${name}, el cansancio cognitivo afecta la función ejecutiva y la memoria de trabajo. Este diagnóstico es breve. Los resultados te darán estrategias para optimizar tu energía mental.`,

        stressed: `${name}, entiendo. El estrés crónico puede impair la memoria y la toma de decisiones. El autoconocimiento es una herramienta poderosa para reducir la ansiedad académica. Te ayudo con esto.`,

        neutral: `Bien, ${name}. Procedemos con el diagnóstico. La honestidad en tus respuestas es clave para obtener insights útiles sobre tu estilo de aprendizaje.`,
      };
      return messages[mood] || messages.neutral;
    },

    transitionToTest: (name) =>
      `Perfecto, ${name}. Iniciamos el diagnóstico. Te leeré las preguntas una por una. Selecciona la respuesta que mejor refleje cómo aprendes naturalmente. Sin presión, solo autoconocimiento.`,

    progressMessages: {
      3: (name) =>
        `${name}, vamos por la pregunta 4. Primera mitad casi completa. Tu procesamiento cognitivo está funcionando muy bien.`,
      6: (name) =>
        `${name}, mitad del diagnóstico completada. Estoy impresionada por tu nivel de autoconocimiento. Continúa con esa misma coherencia.`,
      9: (name) =>
        `${name}, última pregunta. Solo una más. Tu perfil de aprendizaje está casi completo. ¡Ya casi!`,
    },

    results: (name, style, percentage, description) => {
      const styleNames = {
        visual: "APRENDIZ VISUAL",
        auditivo: "APRENDIZ AUDITIVO",
        kinestesico: "APRENDIZ KINESTÉSICO",
      };
      return `${name}, los resultados del diagnóstico están listos.

Tu estilo de aprendizaje predominante es: ${styleNames[style] || style} con un ${percentage} por ciento de correspondencia.

Esto indica que tu cerebro procesa información de manera más eficiente cuando ${description}.

En tu reporte personalizado encontrarás estrategias específicas respaldadas por la neurociencia cognitiva, diseñadas para optimizar tu proceso de aprendizaje basado en tu perfil neurológico único.

Fue un placer acompañarte en este proceso de autoconocimiento académico. Los insights de hoy te darán una ventaja significativa en tu desarrollo educativo. ¡Éxito!`;
    },
  },
};

export const VALENTINA_MESSAGES_EN = {
  all: {
    readQuestion: (current, total, questionText, options) => {
      const optionsText = options.map((opt, i) => `${opt.text}`).join(". ");
      return `Question ${current} of ${total}. ${questionText}. ${optionsText}`;
    },

    encouragement: (name, age) => {
      const messages = [
        `Great job, ${name}! That choice says a lot about how your brain works.`,
        `Excellent, ${name}! Your brain is working in an excellent way.`,
        `Perfect! Keep it up, ${name}.`,
        `Good choice! You are doing great, ${name}!`,
        `Amazing, ${name}! Your intuition is very good.`,
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    },

    finalFarewell: (name) =>
      `It was a pleasure working with you, ${name}. Remember to practice the strategies from your report. Best of luck!`,

    resultsShort: (name, style, percentage, age) => {
      const styleNames = {
        visual: "VISUAL",
        auditivo: "AUDITORY",
        kinestesico: "KINESTHETIC",
      };
      const styleName = styleNames[style] || style;
      const isChild = age >= 6 && age <= 10;
      const downloadHint = isChild
        ? 'Ask your guardian to download the full PDF using the "Download PDF" button.'
        : 'You can download your complete diagnosis as a PDF using the "Download PDF" button on screen.';
      return `Congratulations, ${name}! Your predominant learning style is ${styleName} with ${percentage} percent match. On screen you can see your full report with strategies, strengths and recommended careers designed for you. ${downloadHint} It was a pleasure guiding you through this process!`;
    },
  },

  child: {
    welcome: () =>
      `Hi! I am Valeria, an educational psychologist. Today we will discover how your brain learns best. There are 10 fun questions. I will read them, you choose the option you like most. There are no wrong answers. Ready to discover your learning superpower? Let us start!`,

    askName: () => `First, what is your name?`,

    confirmName: (name) =>
      `Nice to meet you, ${name}! I am Valeria and I will be your guide on this adventure. It is a pleasure to meet you. Did you know that discovering how you learn can make your homework easier and more fun?`,

    askAge: (name) => `${name}, how old are you?`,

    confirmAge: (name, age) =>
      `Amazing, ${name}! At ${age} years old, your brain is growing fast. Science says that knowing your learning style can improve how you learn by up to 40 percent. Imagine that!`,

    askEmail: () =>
      `What is your email address? I will use it to send you your special report.`,

    askPhone: () =>
      `And your phone number? So I can contact you if you have questions.`,

    askMood: (name) => `${name}, before we start, how are you feeling today?`,

    feedbackMood: (mood, name) => {
      const messages = {
        happy: `What wonderful news, ${name}! As an experienced psychologist, I can tell you that happiness is the best state for learning. When we are happy, our brain creates new connections more easily. With that energy, you will discover amazing things about yourself!`,

        excited: `Wow, ${name}! Your excitement is contagious and creates the perfect environment for learning. Excited students remember information better and explore more options. Let us use that energy to discover your style!`,

        calm: `${name}, calmness is your best friend for this process. When we are calm, our brain can focus better and process information more deeply. Take a deep breath and let us enjoy this moment of discovery.`,

        curious: `I love your curiosity, ${name}! Curiosity is the engine of learning. Curious students ask better questions and find deeper answers. Perfect for exploring how your brain learns!`,

        tired: `${name}, I understand completely. Sometimes tiredness can affect how we respond, but do not worry. This diagnosis is quick and the answers you give today will give you tools to have more energy when studying. Shall we start calmly?`,

        stressed: `${name}, I want you to know that I am here to help you. As a psychologist, I have helped many students manage different emotions. Take a deep breath... there you go... very good. Today's results will give you clarity and that will reduce any worry. I believe in you!`,

        neutral: `Perfect, ${name}! Let us take our time to answer each question calmly and honestly. There is no rush, the important thing is that you are authentic with yourself. Shall we begin?`,
      };
      return messages[mood] || messages.neutral;
    },

    transitionToTest: (name) =>
      `Excellent, ${name}! Let us begin. I will read each question out loud and you will select the option that best describes you. There are no right or wrong answers, only your truth. Ready? Here is the first one!`,

    progressMessages: {
      3: (name) =>
        `${name}! We are on question 4. Almost done with the first half. Your brain is working great! Keep it up!`,
      6: (name) =>
        `${name}! Halfway done! I am so impressed with how well you are working to know yourself. Keep that amazing energy going! Almost there!`,
      9: (name) =>
        `${name}! Last question, I promise. Just one more and you will know your learning style. Your brain has been working so hard... I am proud of you! You can do it! Almost there!`,
    },

    results: (name, style, percentage, description) => {
      const styleNames = {
        visual: "VISUAL LEARNER",
        auditivo: "AUDITORY LEARNER",
        kinestesico: "KINESTHETIC LEARNER",
      };
      return `Congratulations, ${name}! After carefully analyzing your responses, I have identified your predominant learning style...

You are a ${styleNames[style] || style} at ${percentage} percent.

This means your brain processes information best when ${description}.

In your report you will find specific strategies designed for you, ${name}, based on proven educational psychology techniques that work very well with your brain type.

It was a pleasure accompanying you on this discovery journey, ${name}! If you have questions about your diagnosis, you can ask me anytime. Best of luck on your learning path!`;
    },
  },

  preteen: {
    welcome: () =>
      `Hi, I am Valeria, an educational psychologist. Today we will identify your learning style. There are 10 questions, I read them and you select the option that best describes you. There are no wrong answers. At the end you will have a personalized report. Shall we begin?`,

    askName: () => `Before we start, what is your name?`,

    confirmName: (name) =>
      `Nice to meet you, ${name}! I am Valeria and I will be your guide in this process. Educational psychology says that knowing yourself is the first step to improving your learning.`,

    askAge: (name) => `${name}, how old are you?`,

    confirmAge: (name, age) =>
      `Perfect, ${name}. At ${age} years old, you are at an ideal stage to discover how your brain learns. Studies show that self-awareness improves academic performance by up to 30 percent.`,

    askEmail: () =>
      `What is your email address? I will use it to send you your personalized report.`,

    askPhone: () =>
      `And your phone number? We will only use it to contact you if necessary.`,

    askMood: (name) =>
      `${name}, how are you feeling today? Your emotional state directly influences how you process and retain information.`,

    feedbackMood: (mood, name) => {
      const messages = {
        happy: `Great, ${name}! Positive psychology tells us that positive emotions improve memory and creativity. Studies show that students in a positive state learn up to 40 percent faster. With that energy, this diagnosis will be very effective!`,

        excited: `Awesome, ${name}! Your enthusiasm is perfect for learning. Motivated students retain information better and participate more actively. Let us use that energy to discover your style!`,

        calm: `${name}, calmness is ideal for reflecting and processing information deeply. When we are calm, we can think more clearly and make better decisions. Perfect state for this process!`,

        curious: `Excellent, ${name}! Curiosity drives deep learning. Curious students explore more options, ask better questions, and remember information better. Ideal for this diagnosis!`,

        tired: `${name}, I understand completely. This diagnosis is brief and the results will give you useful tools for the future. Knowing your learning style will help you study more efficiently and with less exhaustion. Shall we start calmly?`,

        stressed: `${name}, I am here to help you. As an experienced professional, I have seen how self-awareness significantly reduces academic anxiety. This diagnosis will give you clarity on how you learn best, and that will reduce your stress. I believe in you!`,

        neutral: `Perfect, ${name}. Let us work together to know you better. No pressure, just honest exploration of how your brain works. Shall we start the diagnosis?`,
      };
      return messages[mood] || messages.neutral;
    },

    transitionToTest: (name) =>
      `Perfect, ${name}! Let us start the diagnosis. I will read the questions one by one and you will select the one that best reflects your natural way of learning. There are no right or wrong answers. Ready? Here is the first question.`,

    progressMessages: {
      3: (name) =>
        `${name}! We are on question 4. Almost done with the first half of the diagnosis. Your brain is working very well! Keep it up.`,
      6: (name) =>
        `${name}! Halfway done! I am impressed with how well you are working to know yourself. Keep that same energy! Almost there.`,
      9: (name) =>
        `${name}! Last question. Just one more and you will know your learning style. Your brain has been processing information excellently. You can do it! Almost there.`,
    },

    results: (name, style, percentage, description) => {
      const styleNames = {
        visual: "VISUAL LEARNER",
        auditivo: "AUDITORY LEARNER",
        kinestesico: "KINESTHETIC LEARNER",
      };
      return `Congratulations, ${name}! After carefully analyzing your responses, I have identified your predominant learning style...

You are a ${styleNames[style] || style} at ${percentage} percent.

This means your brain processes information best when ${description}.

In your report you will find specific strategies designed for you, ${name}, based on proven educational psychology techniques that work especially well with your brain type.

It was a pleasure accompanying you on this process, ${name}! If you have questions about your diagnosis, you can ask me anytime. Best of luck on your learning path!`;
    },
  },

  teen: {
    welcome: () =>
      `I am Valeria, a psychologist specializing in VAK methodology. 10 questions to identify your learning style. I read them, you select your most authentic answer. No judgment, just self-awareness. Shall we begin?`,

    askName: () => `What is your name?`,

    confirmName: (name) =>
      `Pleased to meet you, ${name}. I am Valeria. We will proceed with the diagnosis.`,

    askAge: (name) => `${name}, how old are you?`,

    confirmAge: (name, age) =>
      `${name}, ${age} years old. Adolescence is a critical stage for cognitive development. This diagnosis will give you concrete tools to optimize your learning based on scientific evidence.`,

    askEmail: () =>
      `Email address (required to receive your personalized report).`,

    askPhone: () => `Phone number (for academic follow-up if necessary).`,

    askMood: (name) =>
      `${name}, how are you feeling today? Cognitive neuroscience research shows that emotional state directly affects information processing and retention capacity.`,

    feedbackMood: (mood, name) => {
      const messages = {
        happy: `${name}, science confirms that happiness improves memory, creativity, and problem-solving ability. Positive emotions optimize brain plasticity for learning.`,

        excited: `${name}, emotional excitement activates the brain's dopaminergic systems, improving attention and memory consolidation. Ideal for active learning.`,

        calm: `${name}, calmness favors prefrontal cortex activation, improving deep concentration and analytical thinking. Optimal state for processing complex information.`,

        curious: `${name}, curiosity activates the brain's reward system and promotes dopamine release, facilitating deep learning and long-term retention.`,

        tired: `${name}, cognitive fatigue affects executive function and working memory. This diagnosis is brief. The results will give you strategies to optimize your mental energy.`,

        stressed: `${name}, I understand. Chronic stress can impair memory and decision-making. Self-awareness is a powerful tool to reduce academic anxiety. Let me help you with this.`,

        neutral: `Good, ${name}. Let us proceed with the diagnosis. Honesty in your answers is key to getting useful insights about your learning style.`,
      };
      return messages[mood] || messages.neutral;
    },

    transitionToTest: (name) =>
      `Perfect, ${name}. Let us begin the diagnosis. I will read the questions one by one. Select the answer that best reflects how you naturally learn. No pressure, just self-awareness.`,

    progressMessages: {
      3: (name) =>
        `${name}, we are on question 4. First half almost complete. Your cognitive processing is working very well.`,
      6: (name) =>
        `${name}, halfway through the diagnosis. I am impressed by your level of self-awareness. Keep that same consistency.`,
      9: (name) =>
        `${name}, last question. Just one more. Your learning profile is almost complete. Almost there!`,
    },

    results: (name, style, percentage, description) => {
      const styleNames = {
        visual: "VISUAL LEARNER",
        auditivo: "AUDITORY LEARNER",
        kinestesico: "KINESTHETIC LEARNER",
      };
      return `${name}, the diagnosis results are ready.

Your predominant learning style is: ${styleNames[style] || style} with ${percentage} percent match.

This indicates that your brain processes information most efficiently when ${description}.

In your personalized report you will find specific strategies backed by cognitive neuroscience, designed to optimize your learning process based on your unique neurological profile.

It was a pleasure to accompany you on this academic self-discovery journey. Today's insights will give you a significant advantage in your educational development. Best of luck!`;
    },
  },
};

export const VALENTINA_MESSAGES_PT = {
  all: {
    readQuestion: (current, total, questionText, options) => {
      const optionsText = options.map((opt, i) => `${opt.text}`).join(". ");
      return `Pergunta ${current} de ${total}. ${questionText}. ${optionsText}`;
    },

    encouragement: (name, age) => {
      const messages = [
        `Muito bem, ${name}! Essa escolha diz muito sobre como o seu cérebro funciona.`,
        `Excelente, ${name}! O seu cérebro está trabalhando de um jeito incrível.`,
        `Perfeito! Continue assim, ${name}.`,
        `Boa escolha! Você está indo muito bem, ${name}!`,
        `Impressionante, ${name}! A sua intuição é muito boa.`,
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    },

    finalFarewell: (name) =>
      `Foi um prazer te acompanhar, ${name}. Lembre-se de praticar as estratégias do seu relatório. Muito sucesso!`,

    resultsShort: (name, style, percentage, age) => {
      const styleNames = {
        visual: "VISUAL",
        auditivo: "AUDITIVO",
        kinestesico: "CINESTÉSICO",
      };
      const styleName = styleNames[style] || style;
      const isChild = age >= 6 && age <= 10;
      const downloadHint = isChild
        ? 'Peça para o seu responsável baixar o PDF completo com o botão "Baixar PDF".'
        : 'Você pode baixar o seu diagnóstico completo em PDF com o botão "Baixar PDF" que aparece na tela.';
      return `Parabéns, ${name}! O seu estilo de aprendizagem predominante é ${styleName} com ${percentage} por cento de correspondência. Na tela você pode ver o seu relatório completo com estratégias, pontos fortes e carreiras recomendadas especialmente para você. ${downloadHint} Foi um prazer te acompanhar nesse processo!`;
    },
  },

  child: {
    welcome: () =>
      `Olá! Eu sou a Valéria, psicóloga educacional. Hoje vamos descobrir como o seu cérebro aprende melhor. São 10 perguntas divertidas. Eu leio as perguntas e você escolhe a opção que mais gostar. Não existe resposta errada. Está pronto para descobrir o seu superpoder de aprendizagem? Vamos começar!`,

    askName: () => `Primeiro, como você se chama?`,

    confirmName: (name) =>
      `Muito prazer, ${name}! Eu sou a Valéria e vou ser a sua guia nessa aventura. É um prazer te conhecer. Você sabia que descobrir como você aprende pode deixar as suas tarefas mais fáceis e divertidas?`,

    askAge: (name) => `${name}, quantos anos você tem?`,

    confirmAge: (name, age) =>
      `Incrível, ${name}! Aos ${age} anos o seu cérebro está em pleno crescimento. A ciência diz que conhecer o seu estilo de aprendizagem pode melhorar em até 40 por cento a forma como você aprende. Imagine só!`,

    askEmail: () =>
      `Qual é o seu e-mail? Vou usá-lo para enviar o seu relatório especial.`,

    askPhone: () =>
      `E o seu número de telefone? Assim posso falar com você se tiver alguma dúvida.`,

    askMood: (name) =>
      `${name}, antes de começar, como você está se sentindo hoje?`,

    feedbackMood: (mood, name) => {
      const messages = {
        happy: `Que notícia maravilhosa, ${name}! Como psicóloga experiente, te digo que a felicidade é o melhor estado para aprender. Quando estamos felizes, o nosso cérebro cria novas conexões com mais facilidade. Com essa energia, você vai descobrir coisas incríveis sobre você mesmo!`,

        excited: `Nossa, ${name}! A sua animação é contagiante e cria o ambiente perfeito para aprender. Estudantes animados lembram melhor das informações e exploram mais opções. Vamos usar essa energia para descobrir o seu estilo!`,

        calm: `${name}, a calma é a sua melhor amiga nesse processo. Quando estamos tranquilos, o nosso cérebro consegue focar melhor e processar as informações de forma mais profunda. Respire fundo e vamos aproveitar esse momento de descoberta.`,

        curious: `Adoro a sua curiosidade, ${name}! A curiosidade é o motor da aprendizagem. Estudantes curiosos fazem perguntas melhores e encontram respostas mais profundas. Perfeito para explorar como o seu cérebro aprende!`,

        tired: `${name}, eu entendo perfeitamente. Às vezes o cansaço pode atrapalhar a forma como respondemos, mas não se preocupe. Este diagnóstico é rápido e as respostas que você der hoje vão te dar ferramentas para ter mais energia na hora de estudar. Vamos começar com calma?`,

        stressed: `${name}, quero que você saiba que estou aqui para te ajudar. Como psicóloga, já ajudei muitos estudantes a lidar com diferentes emoções. Respire fundo... isso... muito bem. Os resultados de hoje vão te dar clareza e isso vai reduzir qualquer preocupação. Confio em você!`,

        neutral: `Perfeito, ${name}! Vamos com calma para responder cada pergunta com tranquilidade e honestidade. Não tem pressa, o importante é que você seja autêntico consigo mesmo. Vamos começar?`,
      };
      return messages[mood] || messages.neutral;
    },

    transitionToTest: (name) =>
      `Excelente, ${name}! Vamos começar. Eu vou ler cada pergunta em voz alta e você vai selecionar a opção que mais combina com você. Não existe resposta certa ou errada, só a sua verdade. Pronto? Aí vai a primeira!`,

    progressMessages: {
      3: (name) =>
        `${name}! Já estamos na pergunta 4. Quase terminando a primeira metade. O seu cérebro está trabalhando de um jeito incrível! Continue assim!`,
      6: (name) =>
        `${name}! Metade do caminho concluída! Estou tão impressionada com o quanto você está se dedicando para se conhecer! Continue com essa energia maravilhosa. Já estamos quase terminando!`,
      9: (name) =>
        `${name}! Última pergunta, eu prometo. Só falta uma para você conhecer o seu estilo de aprendizagem. O seu cérebro trabalhou tão duro... Estou orgulhosa de você! Você consegue! Falta pouco!`,
    },

    results: (name, style, percentage, description) => {
      const styleNames = {
        visual: "APRENDIZ VISUAL",
        auditivo: "APRENDIZ AUDITIVO",
        kinestesico: "APRENDIZ CINESTÉSICO",
      };
      return `Parabéns, ${name}! Depois de analisar as suas respostas com cuidado, identifiquei o seu estilo de aprendizagem predominante...

Você é um ${styleNames[style] || style} com ${percentage} por cento.

Isso significa que o seu cérebro processa melhor as informações quando ${description}.

No seu relatório você vai encontrar estratégias específicas feitas para você, ${name}, baseadas em técnicas comprovadas da psicologia educacional que funcionam muito bem com o seu tipo de cérebro.

Foi um prazer te acompanhar nesse processo de descoberta, ${name}! Se tiver dúvidas sobre o seu diagnóstico, pode me perguntar quando quiser. Muito sucesso na sua jornada de aprendizagem!`;
    },
  },

  preteen: {
    welcome: () =>
      `Olá, eu sou a Valéria, psicóloga educacional. Hoje vamos identificar o seu estilo de aprendizagem. São 10 perguntas, eu leio e você seleciona a opção que melhor te descreve. Não existe resposta errada. No final você terá um relatório personalizado. Vamos começar?`,

    askName: () => `Antes de começar, como você se chama?`,

    confirmName: (name) =>
      `Muito prazer, ${name}! Eu sou a Valéria e vou ser a sua guia nesse processo. A psicologia educacional diz que se conhecer é o primeiro passo para melhorar a sua aprendizagem.`,

    askAge: (name) => `${name}, quantos anos você tem?`,

    confirmAge: (name, age) =>
      `Perfeito, ${name}. Aos ${age} anos você está em uma fase ideal para descobrir como o seu cérebro aprende. Os estudos mostram que o autoconhecimento melhora o desempenho acadêmico em até 30 por cento.`,

    askEmail: () =>
      `Qual é o seu e-mail? Vou usá-lo para enviar o seu relatório personalizado.`,

    askPhone: () =>
      `E o seu número de telefone? Vamos usá-lo somente se for preciso falar com você.`,

    askMood: (name) =>
      `${name}, como você está se sentindo hoje? O seu estado emocional influencia diretamente a forma como você processa e retém as informações.`,

    feedbackMood: (mood, name) => {
      const messages = {
        happy: `Que ótimo, ${name}! A psicologia positiva nos mostra que as emoções positivas melhoram a memória e a criatividade. Os estudos comprovam que estudantes em estado positivo aprendem até 40 por cento mais rápido. Com essa energia, este diagnóstico vai ser muito eficaz!`,

        excited: `Que legal, ${name}! O seu entusiasmo é perfeito para aprender. Estudantes motivados retêm melhor as informações e participam com mais atividade. Vamos aproveitar essa energia para descobrir o seu estilo!`,

        calm: `${name}, a calma é ideal para refletir e processar as informações de forma profunda. Quando estamos tranquilos, conseguimos pensar com mais clareza e tomar decisões melhores. Estado perfeito para esse processo!`,

        curious: `Excelente, ${name}! A curiosidade impulsiona a aprendizagem profunda. Estudantes curiosos exploram mais opções, fazem perguntas melhores e lembram melhor das informações. Ideal para este diagnóstico!`,

        tired: `${name}, eu entendo perfeitamente. Este diagnóstico é rápido e os resultados vão te dar ferramentas úteis para o futuro. Conhecer o seu estilo de aprendizagem vai te ajudar a estudar com mais eficiência e com menos cansaço. Vamos começar com calma?`,

        stressed: `${name}, estou aqui para te ajudar. Como profissional experiente, já vi como o autoconhecimento reduz significativamente a ansiedade acadêmica. Este diagnóstico vai te dar clareza sobre como você aprende melhor, e isso vai reduzir muito o seu estresse. Confio em você!`,

        neutral: `Perfeito, ${name}. Vamos trabalhar juntos para você se conhecer melhor. Sem pressão, só uma exploração honesta de como o seu cérebro funciona. Vamos começar o diagnóstico?`,
      };
      return messages[mood] || messages.neutral;
    },

    transitionToTest: (name) =>
      `Perfeito, ${name}! Vamos começar o diagnóstico. Eu vou ler as perguntas uma a uma e você vai selecionar a que melhor reflete a sua forma natural de aprender. Não existe resposta certa ou errada. Pronto? Aí vai a primeira pergunta.`,

    progressMessages: {
      3: (name) =>
        `${name}! Já estamos na pergunta 4. Quase completamos a primeira metade do diagnóstico. O seu cérebro está funcionando muito bem! Continue assim.`,
      6: (name) =>
        `${name}! Metade do caminho concluída! Estou impressionada com o quanto você está se dedicando para se conhecer. Continue com essa mesma energia! Já estamos quase terminando.`,
      9: (name) =>
        `${name}! Última pergunta. Só falta uma para você conhecer o seu estilo de aprendizagem. O seu cérebro tem processado as informações de um jeito incrível. Você consegue! Falta pouco.`,
    },

    results: (name, style, percentage, description) => {
      const styleNames = {
        visual: "APRENDIZ VISUAL",
        auditivo: "APRENDIZ AUDITIVO",
        kinestesico: "APRENDIZ CINESTÉSICO",
      };
      return `Parabéns, ${name}! Depois de analisar as suas respostas com cuidado, identifiquei o seu estilo de aprendizagem predominante...

Você é um ${styleNames[style] || style} com ${percentage} por cento.

Isso significa que o seu cérebro processa melhor as informações quando ${description}.

No seu relatório você vai encontrar estratégias específicas feitas para você, ${name}, baseadas em técnicas comprovadas da psicologia educacional que funcionam especialmente bem com o seu tipo de cérebro.

Foi um prazer te acompanhar nesse processo, ${name}! Se tiver dúvidas sobre o seu diagnóstico, pode me perguntar quando quiser. Muito sucesso na sua jornada de aprendizagem!`;
    },
  },

  teen: {
    welcome: () =>
      `Eu sou a Valéria, psicóloga especialista em metodologia VAK. 10 perguntas para identificar o seu estilo de aprendizagem. Eu leio, você seleciona a resposta mais autêntica. Sem julgamentos, só autoconhecimento. Vamos começar?`,

    askName: () => `Como você se chama?`,

    confirmName: (name) =>
      `Prazer em te conhecer, ${name}. Eu sou a Valéria. Vamos prosseguir com o diagnóstico.`,

    askAge: (name) => `${name}, quantos anos você tem?`,

    confirmAge: (name, age) =>
      `${name}, ${age} anos. A adolescência é uma etapa crítica para o desenvolvimento cognitivo. Este diagnóstico vai te dar ferramentas concretas para otimizar a sua aprendizagem com base em evidências científicas.`,

    askEmail: () =>
      `E-mail (obrigatório para receber o seu relatório personalizado).`,

    askPhone: () => `Telefone (para acompanhamento acadêmico, se necessário).`,

    askMood: (name) =>
      `${name}, como você está se sentindo hoje? A pesquisa em neurociência cognitiva demonstra que o estado emocional afeta diretamente a capacidade de processamento e retenção de informações.`,

    feedbackMood: (mood, name) => {
      const messages = {
        happy: `${name}, a ciência confirma que a felicidade melhora a memória, a criatividade e a capacidade de resolver problemas. As emoções positivas otimizam a plasticidade cerebral para a aprendizagem.`,

        excited: `${name}, a excitação emocional ativa os sistemas dopaminérgicos do cérebro, melhorando a atenção e a consolidação da memória. Ideal para a aprendizagem ativa.`,

        calm: `${name}, a calma favorece a ativação do córtex pré-frontal, melhorando a concentração profunda e o pensamento analítico. Estado ótimo para processar informações complexas.`,

        curious: `${name}, a curiosidade ativa o sistema de recompensa do cérebro e promove a liberação de dopamina, facilitando a aprendizagem profunda e a retenção em longo prazo.`,

        tired: `${name}, o cansaço cognitivo afeta a função executiva e a memória de trabalho. Este diagnóstico é breve. Os resultados vão te dar estratégias para otimizar a sua energia mental.`,

        stressed: `${name}, eu entendo. O estresse crônico pode prejudicar a memória e a tomada de decisões. O autoconhecimento é uma ferramenta poderosa para reduzir a ansiedade acadêmica. Eu te ajudo com isso.`,

        neutral: `Bem, ${name}. Vamos prosseguir com o diagnóstico. A honestidade nas suas respostas é essencial para obter informações úteis sobre o seu estilo de aprendizagem.`,
      };
      return messages[mood] || messages.neutral;
    },

    transitionToTest: (name) =>
      `Perfeito, ${name}. Vamos iniciar o diagnóstico. Vou ler as perguntas uma a uma. Selecione a resposta que melhor reflete como você aprende naturalmente. Sem pressão, só autoconhecimento.`,

    progressMessages: {
      3: (name) =>
        `${name}, vamos para a pergunta 4. A primeira metade está quase completa. O seu processamento cognitivo está funcionando muito bem.`,
      6: (name) =>
        `${name}, metade do diagnóstico concluída. Estou impressionada com o seu nível de autoconhecimento. Continue com essa mesma consistência.`,
      9: (name) =>
        `${name}, última pergunta. Só falta uma. O seu perfil de aprendizagem está quase completo. Falta pouco!`,
    },

    results: (name, style, percentage, description) => {
      const styleNames = {
        visual: "APRENDIZ VISUAL",
        auditivo: "APRENDIZ AUDITIVO",
        kinestesico: "APRENDIZ CINESTÉSICO",
      };
      return `${name}, os resultados do diagnóstico estão prontos.

O seu estilo de aprendizagem predominante é: ${styleNames[style] || style} com ${percentage} por cento de correspondência.

Isso indica que o seu cérebro processa informações de forma mais eficiente quando ${description}.

No seu relatório personalizado você vai encontrar estratégias específicas respaldadas pela neurociência cognitiva, desenhadas para otimizar o seu processo de aprendizagem com base no seu perfil neurológico único.

Foi um prazer te acompanhar nesse processo de autoconhecimento acadêmico. Os insights de hoje vão te dar uma vantagem significativa no seu desenvolvimento educacional. Sucesso!`;
    },
  },
};

const getMessages = (locale) => {
  if (locale === "en") return VALENTINA_MESSAGES_EN;
  if (locale === "pt") return VALENTINA_MESSAGES_PT;
  return VALENTINA_MESSAGES;
};

export const getWelcomeMessage = (locale) => {
  return getMessages(locale).preteen.welcome();
};

export const getEncouragement = (name, age, locale) => {
  return getMessages(locale).all.encouragement(name, age);
};

export const getProgressMessage = (name, current, total, age, locale) => {
  const ageGroup = getAgeGroup(age);
  const progressMessages = getMessages(locale)[ageGroup].progressMessages;
  return progressMessages[current] ? progressMessages[current](name) : null;
};

export const getMoodFeedback = (mood, name, age, locale) => {
  const ageGroup = getAgeGroup(age);
  return getMessages(locale)[ageGroup].feedbackMood(mood, name);
};

export default VALENTINA_MESSAGES;
