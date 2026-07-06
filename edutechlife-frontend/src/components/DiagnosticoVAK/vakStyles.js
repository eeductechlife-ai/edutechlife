export const STYLE_MAP = {
  visual: {
    name: 'APRENDIZ VISUAL',
    color: 'var(--color-corporate)',
    bgGradient: 'linear-gradient(135deg, rgba(77, 168, 196, 0.15), rgba(77, 168, 196, 0.05))',
    description: 'Tu cerebro procesa mejor la información cuando la ves. Aprendes más fácil con imágenes, gráficos, colores y diagramas.',
    strategies: ['Usa colores y subrayados en tus notas', 'Crea mapas mentales y diagramas', 'Prefiere videos educativos', 'Usa flashcards con imágenes', 'Organiza en esquemas visuales'],
    icon: 'Video',
    tip: 'Visiona el contenido antes de estudiarlo para mejor comprensión'
  },
  auditivo: {
    name: 'APRENDIZ AUDITIVO',
    color: 'var(--color-mint)',
    bgGradient: 'linear-gradient(135deg, rgba(102, 204, 204, 0.15), rgba(102, 204, 204, 0.05))',
    description: 'Aprendes mejor escuchando y hablando. Retienes información a través de conversaciones y audio.',
    strategies: ['Graba y escucha tus notas', 'Explica en voz alto lo que aprendes', 'Escucha podcasts educativos', 'Participa en debates y discusiones', 'Usa grabadora para clases'],
    icon: 'Headphones',
    tip: 'Graba tus notas y escúchalas en tus momentos de ocio'
  },
  kinestesico: {
    name: 'APRENDIZ KINESTÉSICO',
    color: 'var(--color-vak-kinestesico-500)',
    bgGradient: 'linear-gradient(135deg, rgba(232, 168, 56, 0.15), rgba(232, 168, 56, 0.05))',
    description: 'Necesitas moverte y practicar para aprender. Tu mejor aprendizaje viene de la experiencia práctica.',
    strategies: ['Toma notas a mano', 'Haz pausas activas cada 25 minutos', 'Practica con ejercicios reales', 'Usa el cuerpo para memorizar', 'Aprende haciendo proyectos'],
    icon: 'Activity',
    tip: 'Estudiar de pie o caminando mejora tu concentración'
  }
};

export const getCaracteristicasEstilo = (style) => {
  const map = {
    visual: [
      'Aprende mejor viendo imágenes, gráficos y diagramas',
      'Prefiere mapas mentales, esquemas y resúmenes visuales',
      'Excelente memoria fotográfica para rostros y lugares',
      'Organizado, detallista y con buena percepción espacial',
      'Se distrae con ruidos fuertes o ambientes caóticos',
      'Disfruta el arte, el diseño y las presentaciones visuales',
      'Procesa información rápidamente cuando está bien presentada',
      'Prefiere leer instrucciones antes que escucharlas'
    ],
    auditivo: [
      'Aprende mejor escuchando explicaciones y participando en diálogos',
      'Prefiere debates, discusiones y dinámicas verbales',
      'Excelente memoria para melodías, ritmos y secuencias habladas',
      'Se expresa con claridad y fluidez verbal',
      'Disfruta la música, los podcasts y los audiolibros',
      'Puede distraerse con estímulos visuales excesivos',
      'Procesa información repitiendo en voz alta o grabando',
      'Tiene facilidad para aprender idiomas y expresión oral'
    ],
    kinestesico: [
      'Aprende mejor haciendo, tocando y experimentando físicamente',
      'Prefiere actividades prácticas, proyectos y experimentos',
      'Excelente coordinación motora y memoria muscular',
      'Necesita movimiento frecuente para mantener la concentración',
      'Disfruta los deportes, la danza y las manualidades',
      'Aprendizaje experiencial: recuerda lo que vive y siente',
      'Procesa información mientras camina o se mueve',
      'Tiene facilidad para trabajos que requieren destreza física'
    ]
  };
  return map[style] || map.visual;
};

export const getTipsPadres = (style) => {
  const map = {
    visual: [
      'Crea un espacio de estudio visualmente organizado con colores y esquemas',
      'Utiliza calendarios visuales y listas de tareas con dibujos o iconos',
      'Refuerza el aprendizaje con documentales, infografías y videos educativos',
      'Anímalo a usar mapas mentales, cuadros sinópticos y resúmenes con colores',
      'Evita distracciones auditivas como música con letra o ruido ambiental',
      'Proporciona marcadores, post-its y herramientas de diseño visual',
      'Permite que decore y personalice su espacio de estudio'
    ],
    auditivo: [
      'Lee en voz alta los temas de estudio o pídele que te explique lo aprendido',
      'Graba las lecciones importantes para que pueda repasarlas después',
      'Utiliza podcasts educativos, audiolibros y canciones didácticas',
      'Fomenta discusiones y debates sobre temas escolares en casa',
      'Crea rimas, canciones o mnemotecnias para memorizar conceptos',
      'Permítele estudiar con música instrumental de fondo si lo necesita',
      'Anímalo a participar en grupos de estudio y exposiciones orales'
    ],
    kinestesico: [
      'Permite pausas activas frecuentes cada 20-25 minutos de estudio',
      'Utiliza experimentos prácticos, maquetas y proyectos manuales',
      'Anímalo a caminar, moverse o usar un balance board mientras repasa',
      'Proporciona materiales manipulables como plastilina, rompecabezas o kits',
      'Integra el movimiento en la rutina: estudiar de pie o con intervalos activos',
      'Usa juegos de rol, simulaciones y actividades al aire libre para enseñar',
      'Permite que tome notas a mano en lugar de escribir en computadora'
    ]
  };
  return map[style] || map.visual;
};

export const getCarrerasRecomendadas = (style) => {
  const map = {
    visual: ['Diseño Gráfico y Comunicación Visual', 'Arquitectura y Urbanismo', 'Cine, Fotografía y Producción Audiovisual', 'Desarrollo Web, UX/UI y Diseño Digital', 'Ilustración, Animación y Arte Digital', 'Marketing Visual y Publicidad', 'Ingeniería en Sistemas (interfaces visuales)', 'Diseño de Interiores y Decoración'],
    auditivo: ['Música, Composición y Producción Musical', 'Periodismo y Comunicación Social', 'Derecho y Ciencias Jurídicas', 'Psicología Clínica y Educativa', 'Docencia y Pedagogía', 'Traducción e Interpretación de Idiomas', 'Locución, Radio y Medios Audiovisuales', 'Terapia del Lenguaje y Foniatría'],
    kinestesico: ['Ingeniería Civil, Mecánica o Industrial', 'Medicina, Cirugía y Enfermería', 'Ciencias del Deporte y Entrenamiento Físico', 'Gastronomía y Artes Culinarias', 'Artes Escénicas: Teatro, Danza y Circo', 'Diseño Industrial y Fabricación Digital', 'Fisioterapia y Rehabilitación Física', 'Arquitectura Paisajista y Construcción']
  };
  return map[style] || map.visual;
};

export const getValentinaCommentary = (diagnosis, studentName, studentAge) => {
  if (!diagnosis) return '';

  const age = parseInt(diagnosis.studentAge) || parseInt(studentAge);
  if (!age || isNaN(age)) return '';

  let ageGroup = 'teen';
  if (age >= 6 && age <= 10) ageGroup = 'child';
  else if (age >= 11 && age <= 14) ageGroup = 'preteen';

  const style = diagnosis.predominantStyle;
  const percentage = diagnosis.percentage;
  const name = diagnosis.studentName || studentName || 'Estudiante';
  const counts = diagnosis.counts || { visual: 0, auditivo: 0, kinestesico: 0 };

  const styleNames = {
    visual: 'VISUAL',
    auditivo: 'AUDITIVO',
    kinestesico: 'KINESTÉSICO'
  };

  const buildReport = (styleKey) => {
    const styleName = styleNames[styleKey];
    const secondPlace = Object.entries(counts)
      .filter(([k]) => k !== styleKey)
      .sort(([,a], [,b]) => b - a)[0];
    const secondName = secondPlace ? styleNames[secondPlace[0]] : '';
    const secondScore = secondPlace ? secondPlace[1] : 0;

    const reportSections = {
      visual: {
        child: [
          `Informe Psicopedagógico — ${name}`,
          `Después de aplicar y analizar el Diagnóstico VAK, he identificado que tu estilo de aprendizaje predominante es VISUAL con un ${percentage}% de correspondencia. Esto significa que tu cerebro procesa y retiene información de manera más eficiente cuando utilizas el canal visual: imágenes, colores, diagramas y organizadores gráficos.`,
          `Puntajes obtenidos: Visual ${counts.visual}/10 — Auditivo ${counts.auditivo}/10 — Kinestésico ${counts.kinestesico}/10. Tu segundo canal más desarrollado es ${secondName} con ${secondScore}/10, lo que indica que también puedes beneficiarte de estrategias complementarias de ese estilo.`,
          `Fortalezas identificadas: Excelente capacidad para recordar información presentada visualmente; habilidad para organizar ideas mediante esquemas y mapas conceptuales; facilidad para detectar detalles y patrones; buena orientación espacial y sentido estético.`,
          `Como psicóloga educativa especialista en metodología VAK, te recomiendo priorizar estas estrategias: utiliza colores y símbolos en tus apuntes, crea mapas mentales antes de cada evaluación, transforma texto en diagramas de flujo, y complementa tu estudio con videos educativos e infografías.`,
          `Confío en que aplicando estas recomendaciones potenciarás significativamente tu rendimiento académico. Tu perfil visual es una fortaleza enorme en un mundo cada vez más gráfico y digital. ¡Adelante!`
        ],
        preteen: [
          `Informe Psicopedagógico — ${name}`,
          `Tras aplicar el Diagnóstico VAK y analizar detalladamente tus respuestas, determino que tu estilo de aprendizaje predominante es VISUAL con un ${percentage}% de consistencia. Procesas mejor la información cuando puedes verla representada gráficamente: imágenes, esquemas, colores y organizadores visuales facilitan tu comprensión y memoria.`,
          `Desglose de resultados: canal Visual ${counts.visual}/10, Auditivo ${counts.auditivo}/10, Kinestésico ${counts.kinestesico}/10. Tu perfil muestra un ${secondName} como canal secundario con ${secondScore}/10, lo que enriquece tu versatilidad para aprender en diferentes contextos.`,
          `Fortalezas detectadas: Piensas en imágenes y recuerdas con facilidad lo que has visto; tienes buena capacidad de síntesis visual; eres observador y detallista; aprendes rápidamente con demostraciones visuales; disfrutas organizar información de manera estructurada.`,
          `Recomendaciones basadas en evidencia: diseña tus apuntes con colores y jerarquía visual, utiliza herramientas digitales como Canva o Notion para organizar información, transforma conceptos complejos en dibujos o diagramas, y practica con flashcards visuales. Alterna con estrategias auditivas como explicar en voz alta lo que aprendes.`,
          `Tu perfil visual es una ventaja competitiva en tu formación académica. Implementa estas estrategias de manera constante y verás una mejora notable en tu rendimiento. Estoy aquí para acompañarte en este proceso.`
        ],
        teen: [
          `Informe Psicopedagógico VAK — ${name}`,
          `Tras aplicar el instrumento de Diagnóstico VAK (Visual-Auditivo-Kinestésico) y realizar el análisis cuantitativo y cualitativo de tus respuestas, determino que tu perfil de aprendizaje predominante es VISUAL con un ${percentage}% de correspondencia sobre el total de ítems evaluados. Este resultado indica que tu sistema de representación primario procesa información de manera más eficiente a través del canal visual, privilegiando estímulos como imágenes, gráficos, diagramas, mapas conceptuales y códigos cromáticos.`,
          `Resultados cuantitativos: canal Visual ${counts.visual}/10 — Auditivo ${counts.auditivo}/10 — Kinestésico ${counts.kinestesico}/10. Se observa que tu canal secundario es ${secondName} con ${secondScore}/10, lo que sugiere que posees flexibilidad cognitiva para beneficiarte de estrategias multimodales. La diferencia entre tu canal primario y los secundarios refleja una clara especialización en el procesamiento visual de la información.`,
          `Fortalezas cognitivas identificadas: capacidad sobresaliente para sintetizar información compleja en representaciones visuales; memoria fotográfica para detalles y patrones; habilidad para establecer relaciones conceptuales mediante organizadores gráficos; pensamiento espacial desarrollado; preferencia por el orden visual y la estética en la presentación de información.`,
          `Recomendaciones estratégicas fundamentadas en neuroeducación: implementa la técnica de Cornell con códigos de color para la toma de apuntes; utiliza software de mapas mentales como XMind o MindMeister para estructurar conocimientos; complementa tu estudio con infografías, tutoriales visuales y documentales; practica la conversión de información textual a diagramas de flujo o cuadros sinópticos. Integra estrategias de tu canal secundario para maximizar la retención.`,
          `Como especialista en psicología educativa con enfoque VAK, concluyo que tu perfil visual constituye una ventaja significativa en entornos académicos que demandan procesamiento simbólico y representación gráfica. La implementación sistemática de estas recomendaciones optimizará tu rendimiento y facilitará un aprendizaje más profundo y significativo.`
        ]
      },
      auditivo: {
        child: [
          `Informe Psicopedagógico — ${name}`,
          `¡Qué emoción! Después de completar el Diagnóstico VAK, he descubierto que tu estilo de aprendizaje predominante es AUDITIVO con un ${percentage}% de correspondencia. Esto quiere decir que tu cerebro aprende mejor cuando escuchas, hablas y trabajas con sonidos y palabras. ¡Tu oído es tu superpoder!`,
          `Resultados: Auditivo ${counts.auditivo}/10 — Visual ${counts.visual}/10 — Kinestésico ${counts.kinestesico}/10. Tu segundo canal más fuerte es ${secondName} con ${secondScore}/10, lo que significa que también puedes aprender combinando con imágenes o movimiento.`,
          `Tus fortalezas: Tienes una memoria excelente para canciones, rimas y explicaciones; te expresas muy bien y te gusta participar en clase; aprendes fácilmente cuando alguien te explica; disfrutas los cuentos y las conversaciones; eres bueno para recordar instrucciones verbales.`,
          `Te recomiendo: graba tus clases y escúchalas después, explica en voz alta lo que aprendiste, escucha podcasts educativos, inventa canciones para memorizar, y participa en grupos de estudio donde puedas hablar y discutir.`,
          `Tu forma de aprender es muy valiosa. Usa estos consejos y verás cómo todo se vuelve más fácil. ¡Estoy muy orgullosa de ti!`
        ],
        preteen: [
          `Informe Psicopedagógico — ${name}`,
          `Tras analizar tus respuestas en el Diagnóstico VAK, determino que tu estilo de aprendizaje predominante es AUDITIVO con un ${percentage}% de correspondencia. Eres una persona que procesa y retiene información de manera óptima a través del canal auditivo, aprovechando el sonido, la palabra hablada y las explicaciones verbales.`,
          `Desglose de puntajes: Auditivo ${counts.auditivo}/10 — Visual ${counts.visual}/10 — Kinestésico ${counts.kinestesico}/10. Tu segundo canal más desarrollado es ${secondName} con ${secondScore}/10, lo que amplía tus posibilidades de aprendizaje cuando combinas estrategias.`,
          `Fortalezas identificadas: Excelente memoria para secuencias verbales y melodías; facilidad para expresar ideas de forma clara y organizada; buena capacidad para seguir instrucciones orales; aprendes eficazmente en discusiones y debates; disfrutas explorar temas a través de podcasts y audiolibros.`,
          `Estrategias recomendadas: utiliza grabadoras de voz para registrar tus clases y repasarlas, participa activamente en debates y exposiciones, estudia en voz alta explicando los temas como si enseñaras a alguien más, escucha contenido educativo relevante y coméntalo con compañeros. Complementa con resúmenes escritos para reforzar.`,
          `Tu perfil auditivo es una fortaleza en entornos colaborativos y de diálogo. Aplicando estas estrategias potenciarás tu aprendizaje y te sentirás más seguro en tu proceso académico. Cuenta conmigo para seguir acompañándote.`
        ],
        teen: [
          `Informe Psicopedagógico VAK — ${name}`,
          `Tras aplicar el instrumento de Diagnóstico VAK (Visual-Auditivo-Kinestésico) y realizar el análisis cuantitativo y cualitativo de tus respuestas, determino que tu perfil de aprendizaje predominante es AUDITIVO con un ${percentage}% de correspondencia. Este resultado indica que tu sistema de representación primario procesa información de manera más eficiente a través del canal auditivo, privilegiando estímulos como la palabra hablada, las explicaciones verbales, los debates y los recursos sonoros.`,
          `Resultados cuantitativos: Auditivo ${counts.auditivo}/10 — Visual ${counts.visual}/10 — Kinestésico ${counts.kinestesico}/10. Se observa que tu canal secundario es ${secondName} con ${secondScore}/10, lo que sugiere que posees flexibilidad cognitiva para beneficiarte de estrategias multimodales complementarias.`,
          `Fortalezas cognitivas identificadas: capacidad sobresaliente para procesar y retener información verbal; habilidad para articular ideas con claridad y estructura lógica; memoria auditiva desarrollada para secuencias, ritmos y patrones sonoros; facilidad para el aprendizaje de idiomas y expresión oral; pensamiento dialéctico desarrollado a través de la discusión y el debate.`,
          `Recomendaciones estratégicas fundamentadas en neuroeducación: implementa la técnica de grabación y repaso auditivo para consolidar contenidos; participa activamente en grupos de discusión y seminarios; utiliza la técnica de Feynman (explicar en voz alta como si enseñaras) para verificar comprensión; complementa tu estudio con podcasts académicos y audiolibros especializados; integra estrategias visuales complementarias como esquemas para reforzar la retención.`,
          `Como especialista en psicología educativa con enfoque VAK, concluyo que tu perfil auditivo constituye una ventaja significativa en entornos académicos que demandan procesamiento verbal, expresión oral y pensamiento crítico-discursivo. La implementación sistemática de estas recomendaciones optimizará tu rendimiento y facilitará un aprendizaje más profundo y significativo.`
        ]
      },
      kinestesico: {
        child: [
          `Informe Psicopedagógico — ${name}`,
          `¡Qué increíble! Después de hacer el Diagnóstico VAK, descubrí que tu estilo de aprendizaje predominante es KINESTÉSICO con un ${percentage}% de correspondencia. ¡Eres un aprendiz que necesita moverse, tocar y experimentar! Tu cuerpo es parte importante de cómo aprendes.`,
          `Puntajes obtenidos: Kinestésico ${counts.kinestesico}/10 — Visual ${counts.visual}/10 — Auditivo ${counts.auditivo}/10. Tu segundo canal más desarrollado es ${secondName} con ${secondScore}/10.`,
          `Tus fortalezas: Aprendes mejor cuando haces las cosas con tus propias manos; tienes mucha energía y coordinación; eres muy bueno para los deportes y actividades físicas; recuerdas mejor lo que has vivido y practicado; eres creativo y te gusta construir cosas.`,
          `Te recomiendo: toma notas a mano en lugar de escribir en computadora, haz pausas para moverte cada 20 minutos, estudia caminando o de pie, usa materiales como plastilina o maquetas para entender conceptos, y convierte el estudio en un juego o experimento.`,
          `¡Tu forma de aprender es muy especial! Aprovecha estas estrategias y verás lo fácil que puede ser estudiar cuando usas todo tu cuerpo. ¡Sigue brillando!`
        ],
        preteen: [
          `Informe Psicopedagógico — ${name}`,
          `Tras analizar tus respuestas en el Diagnóstico VAK, determino que tu estilo de aprendizaje predominante es KINESTÉSICO con un ${percentage}% de correspondencia. Eres una persona que necesita la experiencia práctica y el movimiento para procesar y retener información de manera efectiva.`,
          `Desglose de puntajes: Kinestésico ${counts.kinestesico}/10 — Visual ${counts.visual}/10 — Auditivo ${counts.auditivo}/10. Tu canal secundario es ${secondName} con ${secondScore}/10, lo que enriquece tu perfil de aprendizaje.`,
          `Fortalezas identificadas: Excelente coordinación y memoria muscular; facilidad para aprender mediante experimentación y práctica directa; alta energía y capacidad de concentración en actividades físicas; pensamiento creativo aplicado a la resolución de problemas; aprendizaje significativo a través de experiencias concretas.`,
          `Estrategias recomendadas: toma notas escritas a mano para activar la memoria muscular, realiza pausas activas cada 20-25 minutos, estudia en movimiento (caminando o de pie), utiliza materiales manipulables como maquetas o kits de experimentos, y aplica lo aprendido en proyectos prácticos. Complementa con resúmenes visuales para reforzar.`,
          `Tu perfil kinestésico es una fortaleza en contextos que requieren aplicación práctica y resolución activa de problemas. Implementa estas recomendaciones y transformarás tu experiencia de aprendizaje. Estoy aquí para apoyarte.`
        ],
        teen: [
          `Informe Psicopedagógico VAK — ${name}`,
          `Tras aplicar el instrumento de Diagnóstico VAK (Visual-Auditivo-Kinestésico) y realizar el análisis cuantitativo y cualitativo de tus respuestas, determino que tu perfil de aprendizaje predominante es KINESTÉSICO con un ${percentage}% de correspondencia. Este resultado indica que tu sistema de representación primario procesa información de manera más eficiente a través del canal kinestésico, privilegiando la experiencia práctica, el movimiento, la manipulación de objetos y el aprendizaje basado en la acción.`,
          `Resultados cuantitativos: Kinestésico ${counts.kinestesico}/10 — Visual ${counts.visual}/10 — Auditivo ${counts.auditivo}/10. Se observa que tu canal secundario es ${secondName} con ${secondScore}/10, lo que sugiere que posees flexibilidad cognitiva para complementar tu aprendizaje con estrategias multimodales.`,
          `Fortalezas cognitivas identificadas: capacidad sobresaliente para el aprendizaje experiencial y la aplicación práctica de conocimientos; excelente coordinación motora y memoria procedimental; facilidad para resolver problemas mediante ensayo y error; pensamiento concreto aplicado a situaciones reales; alta resistencia y concentración en actividades que involucran movimiento y manipulación.`,
          `Recomendaciones estratégicas fundamentadas en neuroeducación: implementa la técnica de estudio activo alternando períodos de 25 minutos de trabajo con 5 minutos de movimiento; utiliza métodos de aprendizaje basados en proyectos y simulaciones prácticas; transforma conceptos abstractos en experiencias concretas mediante maquetas, laboratorios o prototipos; estudia en espacios que permitan movimiento; complementa con organizadores visuales y discusiones orales para integrar los canales secundarios.`,
          `Como especialista en psicología educativa con enfoque VAK, concluyo que tu perfil kinestésico constituye una ventaja significativa en entornos de aprendizaje activo y aplicación práctica del conocimiento. La implementación sistemática de estas recomendaciones optimizará tu rendimiento y facilitará un aprendizaje más profundo, significativo y duradero.`
        ]
      }
    };

    return reportSections[styleKey]?.[ageGroup]?.join('\n\n') ||
      `Hola ${name}, soy Valeria, psicóloga educativa especialista en VAK. Tras analizar tus respuestas, he identificado que tu estilo de aprendizaje predominante es ${styleName} con un ${percentage}% de correspondencia. Tus resultados completos son: Visual ${counts.visual}/10, Auditivo ${counts.auditivo}/10, Kinestésico ${counts.kinestesico}/10. Te recomiendo implementar las estrategias detalladas en este informe para optimizar tu proceso de aprendizaje.`;
  };

  return buildReport(style);
};
