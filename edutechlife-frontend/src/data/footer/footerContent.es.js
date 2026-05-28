export const vakContent = {
  subtitle: 'Aprendizaje Visual, Auditivo y Kinestésico',
  description: 'La metodología VAK identifica el estilo de aprendizaje predominante de cada estudiante, permitiendo una educación personalizada que maximiza el potencial cognitivo y la retención de conocimiento.',
  styles: [
    { icon: 'fa-eye', title: 'Visual', description: 'Aprende mejor con imágenes, diagramas y videos. Recuerda lo que ve.' },
    { icon: 'fa-headphones', title: 'Auditivo', description: 'Aprende mejor escuchando, discutiendo y explicando conceptos en voz alta.' },
    { icon: 'fa-hand', title: 'Kinestésico', description: 'Aprende mejor haciendo, tocando y experimentando con materiales prácticos.' }
  ],
  calloutTitle: 'Diagnóstico VAK en Edutechlife',
  calloutDesc: 'Realiza nuestro diagnóstico gratuito para descubrir tu estilo de aprendizaje y recibir recomendaciones personalizadas de estudio.'
};

export const certificationsContent = {
  subtitle: 'Reconocimiento oficial de competencias',
  description: 'Obtén certificaciones reconocidas que validan tus competencias en tecnologías educativas y metodologías pedagógicas de vanguardia.',
  list: [
    { titulo: 'Certificación en IA Educativa', descripcion: 'Implementación de inteligencia artificial en entornos pedagógicos', nivel: 'Avanzado' },
    { titulo: 'Metodología VAK Premium', descripcion: 'Dominio de técnicas de aprendizaje multimodal', nivel: 'Intermedio' },
    { titulo: 'EdTech Integration Specialist', descripcion: 'Integración de herramientas tecnológicas en el aula', nivel: 'Básico' },
    { titulo: 'SmartBoard Master', descripcion: 'Certificación en pizarras interactivas inteligentes', nivel: 'Intermedio' },
    { titulo: 'Neuroentorno Educativo', descripcion: 'Diseño de ambientes de aprendizaje basados en neurociencia', nivel: 'Avanzado' }
  ],
  calloutTitle: '¿Interesado en certificarte?',
  calloutDesc: 'Contáctanos para más información sobre próximos programas de certificación.'
};

export const blogArticles = [
  { id: 'ia-educacion', titulo: 'El futuro de la IA en la educación', fecha: '15 Mar 2026', categoria: 'Inteligencia Artificial', autor: 'Dr. Carlos Mendoza', tiempoLectura: '8 min' },
  { id: 'vak-aula', titulo: 'Cómo implementar VAK en el aula', fecha: '10 Mar 2026', categoria: 'Metodología', autor: 'Lic. Ana Sofía Torres', tiempoLectura: '6 min' },
  { id: 'smartboard', titulo: 'SmartBoard: Guía completa 2026', fecha: '5 Mar 2026', categoria: 'Herramientas', autor: 'Ing. Roberto Chen', tiempoLectura: '7 min' },
  { id: 'neurociencia', titulo: 'Neurociencia y aprendizaje efectivo', fecha: '28 Feb 2026', categoria: 'Neuroentorno', autor: 'Dra. Patricia Vázquez', tiempoLectura: '9 min' },
  { id: 'automatizacion', titulo: 'Automatización de procesos educativos', fecha: '20 Feb 2026', categoria: 'Automation', autor: 'Mg. Luis Hernández', tiempoLectura: '5 min' }
];

export const blogArticleContents = {
  'ia-educacion': {
    titulo: 'El futuro de la IA en la educación',
    imagen: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    introduccion: 'La inteligencia artificial está transformando radicalmente el panorama educativo mundial. Según el informe de UNESCO 2025, el 85% de las instituciones educativas implementarán alguna forma de IA para 2027, representando un mercado de $400 mil millones.',
    secciones: [
      {
        titulo: 'Adopción Global de IA en Educación',
        contenido: 'Los datos demuestran un crecimiento exponencial en la adopción de tecnologías de IA en el sector educativo. Un estudio de HolonIQ revela que la inversión en EdTech alcanzó $18.2 mil millones en 2024, con proyecciones de alcanzar $400 mil millones para 2027.',
        grafica: 'linea',
        datos: [
          { anio: '2023', valor: 95 },
          { anio: '2024', valor: 142 },
          { anio: '2025', valor: 220 },
          { anio: '2026', valor: 310 },
          { anio: '2027', valor: 400 }
        ],
        unidad: 'Miles de millones USD'
      },
      {
        titulo: 'Casos de Éxito en Universidades Top',
        contenido: 'Las universidades líderes han implementado IA con resultados extraordinarios. Stanford reportó una mejora del 35% en retención estudiantil mediante sistemas de tutoring con IA. MIT desarrolló algoritmos que predicen con 90% de precisión estudiantes en riesgo de deserción.',
        grafica: 'barras',
        datos: [
          { categoria: 'Stanford', mejora: 35 },
          { categoria: 'MIT', mejora: 28 },
          { categoria: 'Oxford', mejora: 32 },
          { categoria: 'Harvard', mejora: 40 },
          { categoria: 'Cambridge', mejora: 25 }
        ],
        unidad: '% Mejora en retención'
      },
      {
        titulo: 'Impacto en el Aprendizaje',
        contenido: 'Los estudios de meta-análisis muestran que los estudiantes que utilizan herramientas de IA mejoran su rendimiento académico en un promedio del 25%. La personalización del aprendizaje, imposible de lograr a escala sin IA, permite adaptar el contenido al ritmo de cada estudiante.'
      },
      {
        titulo: 'Tendencias 2026-2030',
        contenido: 'Las predicciones de Gartner indican que para 2030, la IA será responsable del 40% de las tareas administrativas educativas, liberando a los docentes para enfocarse en la mentoría y desarrollo socioemocional de los estudiantes.'
      }
    ],
    conclusion: 'La IA no reemplazará a los educadores, pero aquellos que dominen las herramientas de IA reemplazarán a quienes no lo hagan. La transformación digital en educación es inevitable, y las instituciones que lideren esta adopción definirán el futuro del aprendizaje.'
  },
  'vak-aula': {
    titulo: 'Cómo implementar VAK en el aula',
    imagen: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop',
    introduccion: 'La metodología VAK (Visual, Auditivo, Kinestésico) identifica el estilo de aprendizaje predominante de cada estudiante. Investigaciones de la Universidad de Harvard demuestran que personalizar la enseñanza según el estilo de aprendizaje mejora la retención de información en un 30%.',
    secciones: [
      {
        titulo: 'Los Tres Estilos de Aprendizaje',
        contenido: 'Según el modelo de Neil Fleming, existen tres canales principales de percepción: Visual (aprenden viendo), Auditivo (aprenden escuchando) y Kinestésico (aprenden haciendo). La mayoría de personas tienen una combinación, aunque predomina un estilo.',
        grafica: 'dona',
        datos: [
          { nombre: 'Visual', valor: 45 },
          { nombre: 'Auditivo', valor: 30 },
          { nombre: 'Kinestésico', valor: 25 }
        ],
        unidad: '% Población'
      },
      {
        titulo: 'Paso 1: Diagnóstico Inicial',
        contenido: 'Antes de implementar VAK, es fundamental identificar el estilo predominante de cada estudiante. El diagnóstico debe incluir: observación comportamental, cuestionario de preferencias y análisis de rendimiento académico en diferentes actividades.',
        imagen: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=300&fit=crop'
      },
      {
        titulo: 'Paso 2: Diseño de Actividades Multimodales',
        contenido: 'Cada lección debe incluir actividades para los tres estilos. Para contenido sobre la Revolución Francesa: Visual (mapas conceptuales, líneas de tiempo), Auditivo (debates, podcasts, lectura en voz alta), Kinestésico (dramatización, simulaciones).',
        lista: [
          'Proporcionar diagramas y infografías para aprendices visuales',
          'Incluir podcasts y discusión grupal para auditivos',
          'Diseñar experimentos y proyectos prácticos para kinestésicos'
        ]
      },
      {
        titulo: 'Paso 3: Evaluación Adaptativa',
        contenido: 'Las evaluaciones deben permitir demostrar conocimiento de múltiples formas: presentación oral (auditivo), informe escrito con gráficos (visual), proyecto práctico (kinestésico). Esto permite que cada estudiante muestre su verdadero dominio.',
        grafica: 'barras',
        datos: [
          { categoria: 'Tradicional', retention: 40 },
          { categoria: 'VAK', retention: 70 }
        ],
        unidad: '% Retención'
      },
      {
        titulo: 'Resultados Esperados',
        contenido: 'Estudios longitudinales en escuelas que implementaron VAK durante 3 años muestran: 30% mayor retención de información, 25% mejora en evaluaciones estandarizadas, 40% reducción en comportamientos disruptivos, 35% aumento en motivación estudiantil.'
      }
    ],
    conclusion: 'Implementar VAK no requiere tecnología avanzada, sino un cambio metodológico. Los docentes deben diseñar experiencias diversificadas que alcancen a todos los estilos, monitorear resultados y ajustar estrategias continuamente.'
  },
  'smartboard': {
    titulo: 'SmartBoard: Guía completa 2026',
    imagen: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
    introduccion: 'Las pizarras interactivas inteligentes han evolucionado significativamente. Según el informe de EdTech Magazine 2025, las instituciones que implementaron SmartBoards reportan un 40% de aumento en participación estudiantil y 28% mejora en comprensión de conceptos complejos.',
    secciones: [
      {
        titulo: 'Evolución Tecnológica 2024-2026',
        contenido: 'Los SmartBoards modernos incorporan: pantallas 4K con táctil de precisión, integración con IA para reconocimiento de escritura, conectividad con dispositivos móviles, software de colaboración en tiempo real y análisis de engagement estudiantil.',
        grafica: 'linea',
        datos: [
          { anio: '2024', capacidad: 65 },
          { anio: '2025', capacidad: 78 },
          { anio: '2026', capacidad: 92 }
        ],
        unidad: '% Funcionalidades'
      },
      {
        titulo: 'Casos de Implementación Exitosa',
        contenido: 'El Colegio Americano de México implementó 50 SmartBoards en 2023. Resultados después de 18 meses: 42% aumento en participación, 31% mejoría en matemáticas, 89% de docentes reportaron satisfacción positiva.',
        grafica: 'barras',
        datos: [
          { categoria: 'Participación', antes: 45, despues: 87 },
          { categoria: 'Comprensión', antes: 52, despues: 78 },
          { categoria: 'Colaboración', antes: 38, despues: 82 }
        ],
        unidad: '%'
      },
      {
        titulo: 'Funcionalidades Esenciales 2026',
        contenido: 'Las características que todo SmartBoard debe tener incluyen: pizarra colaborativa infinita, integración con LMS institucionales, herramientas de evaluación en tiempo real, compatibilidad con dispositivos de estudiantes, análisis de patrones de atención mediante IA.',
        lista: [
          'Pizarra colaborativa con almacenamiento en la nube',
          'Integración nativa con Google Classroom y Microsoft Teams',
          'Reconocimiento de escritura a texto en tiempo real',
          'Grabación de sesiones para revisión posterior',
          'Análisis de engagement con heatmaps'
        ]
      },
      {
        titulo: 'ROI Educativo',
        contenido: 'El retorno de inversión se manifiesta en múltiples áreas: reducción de materiales didácticos físicos (-35%), mayor retención de estudiantes (-20% deserción), preparación para entornos digitales profesionales, y eficiencia en la explicación de conceptos abstractos.',
        grafica: 'barras',
        datos: [
          { categoria: 'ROI 1 año', valor: 145 },
          { categoria: 'ROI 3 años', valor: 280 },
          { categoria: 'ROI 5 años', valor: 420 }
        ],
        unidad: '%'
      }
    ],
    conclusion: 'La inversión en SmartBoards es una decisión estratégica que posiciona a las instituciones a la vanguardia de la educación digital. El costo inicial se recupera en 18-24 meses considerando todos los beneficios cuantificables.'
  },
  'neurociencia': {
    titulo: 'Neurociencia y aprendizaje efectivo',
    imagen: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=400&fit=crop',
    introduccion: 'La neurociencia educativa ha revolucionado nuestra comprensión del aprendizaje. Investigadores de Stanford (2025) demuestran que comprender cómo funciona el cerebro permite diseñar intervenciones pedagógicas hasta 50% más efectivas.',
    secciones: [
      {
        titulo: 'Principios Fundamentales del Neuroaprendizaje',
        contenido: 'Los cuatro principios clave que todo educador debe conocer: Neuroplasticidad (el cerebro puede cambiar a cualquier edad), Consolidación de memoria (el sueño es esencial), Atención selectiva (limitada a 20 min), y Transferencia (aprender en un contexto ayuda en otros).',
        grafica: 'dona',
        datos: [
          { nombre: 'Neuroplasticidad', valor: 30 },
          { nombre: 'Consolidación', valor: 25 },
          { nombre: 'Atención', valor: 25 },
          { nombre: 'Transferencia', valor: 20 }
        ],
        unidad: 'Importancia'
      },
      {
        titulo: 'El Ciclo de Aprendizaje Neurocientífico',
        contenido: 'Basado en investigaciones de Howard Gardner y neurocientíficos de Harvard, el ciclo óptimo de aprendizaje incluye: Activación de conocimientos previos (5 min), Presentación de nuevo contenido (15-20 min), Procesamiento activo (10 min), Consolidación mediante sueño o descanso.',
        imagen: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=300&fit=crop'
      },
      {
        titulo: 'Investigaciones Recientes (2024-2026)',
        contenido: 'Estudios de la Universidad de Cambridge (2025) demuestran que el aprendizaje interleaved (mezclar temas) mejora la retención en 43% comparado con el aprendizaje bloqueado. Otro estudio de MIT muestra que explicar conceptos a otros activa las mismas regiones cerebrales que aprenderlos.',
        grafica: 'barras',
        datos: [
          { categoria: 'Bloqueado', retention: 45 },
          { categoria: 'Interleaved', retention: 72 },
          { categoria: 'Espaciado', retention: 68 },
          { categoria: 'Activo', retention: 78 }
        ],
        unidad: '% Retención'
      },
      {
        titulo: 'Aplicaciones Pedagógicas Basadas en Evidencia',
        contenido: 'Las estrategias con mayor evidencia científica incluyen: Repetición espaciada (repasar a intervalos crecientes), Retrieval practice (recuperar información sin ayuda), Interleaving (mezclar tipos de problemas), y Generación (generar preguntas propias).',
        lista: [
          'Aplicar la regla 10-5-2: revisar a los 10 min, 5 horas, 2 días',
          'Usar preguntas de autoevaluación antes de revisar',
          'Mezclar temas diferentes en una sesión',
          'Pedir a estudiantes que generen preguntas de examen'
        ]
      },
      {
        titulo: 'Ambientes de Aprendizaje Óptimos',
        contenido: 'La investigación demuestra que factores ambientales impactan hasta 25% en el rendimiento: Iluminación natural (+15% rendimiento), Temperatura 20-24°C (pico de atención), Sonido blanco o silencio (vs música), Espacios flexibles que permitan movimiento.'
      }
    ],
    conclusion: 'La neurociencia no es solo teoría; es una guía práctica para optimizar cada aspecto del proceso educativo. Los docentes que aplican estos principios basados en evidencia ven mejoras significativas en el aprendizaje de sus estudiantes.'
  },
  'automatizacion': {
    titulo: 'Automatización de procesos educativos',
    imagen: 'https://images.unsplash.com/photo-1451015618060-fa747ccd567c?w=800&h=400&fit=crop',
    introduccion: 'La automatización en educación ya no es un lujo, es una necesidad. Según McKinsey (2025), las instituciones que automatizan procesos administrativos reducen costos operativos en un 35% y liberan 60% del tiempo de los docentes para enfocarse en la enseñanza.',
    secciones: [
      {
        titulo: 'Estado Actual de la Automatización Educativa',
        contenido: 'El informe de EDUCAUSE 2025 revela que el 67% de las universidades han implementado algún nivel de automatización, pero solo el 23% han alcanzado automatización avanzada. Las áreas con mayor adopción son: inscripciones, calificaciones y comunicaciones.',
        grafica: 'barras',
        datos: [
          { categoria: 'Inscripciones', avance: 85 },
          { categoria: 'Calificaciones', avance: 78 },
          { categoria: 'Comunicación', avance: 65 },
          { categoria: 'Evaluación', avance: 45 },
          { categoria: 'Personalización', avance: 30 }
        ],
        unidad: '% Implementación'
      },
      {
        titulo: 'Procesos con Mayor Impacto de Automatización',
        contenido: 'Identificamos los 5 procesos con mayor ROI: Envío automático de retroalimentación (ahorra 8 horas/semana), Programación inteligente de evaluaciones (reduce conflictos 90%), Seguimiento de progreso automatizado (identifica estudiantes en riesgo), Chatbots de admisión (atienden 24/7), Generación de informes institucionales.',
        lista: [
          'Feedback automático con IA personalizado',
          'Algoritmos de programación académica',
          'Dashboards de progreso estudiantil',
          'Asistentes virtuales para estudiantes',
          'Reportes automáticos para acreditación'
        ]
      },
      {
        titulo: 'Métricas de Eficiencia por Área',
        contenido: 'Las instituciones que implementaron automatización completa reportan: Admisiones -50% tiempo de procesamiento, Evaluación -70% tiempo en corrección, Comunicación -40% tiempo en notificaciones, Reporting -80% tiempo en generación de informes.',
        grafica: 'linea',
        datos: [
          { anio: '2023', tiempo: 100 },
          { anio: '2024', tiempo: 82 },
          { anio: '2025', tiempo: 58 },
          { anio: '2026', tiempo: 40 }
        ],
        unidad: '% Tiempo administrativo'
      },
      {
        titulo: 'Casos de Éxito en Instituciones',
        contenido: 'La Universidad Tecnológica de México automatizó su proceso de admisiones en 2024. Resultado: Tiempo de respuesta reducido de 15 días a 48 horas, Satisfacción de candidatos aumentó de 72% a 94%, Costo por admisión reducido 40%.',
        grafica: 'barras',
        datos: [
          { categoria: 'Tiempo', antes: 15, despues: 2 },
          { categoria: 'Satisfacción', antes: 72, despues: 94 },
          { categoria: 'Costo', antes: 100, despues: 60 }
        ],
        unidad: 'Días / % / %'
      },
      {
        titulo: 'Tendencias en Automatización Educativa 2026',
        contenido: 'Las tendencias emergentes incluyen: Automatización de workflows con IA generativa, Chatbots con capacidad de tutoría, Predicción de deserción con ML, Personalización masiva de rutas de aprendizaje, Integración blockchain para credenciales.'
      }
    ],
    conclusion: 'La automatización no significa menos educación personalizada; significa más tiempo para la interacción humana significativa. Las instituciones que adoptan estas herramientas hoy estarán mejor posicionadas para competir en un mercado educativo cada vez más digitalizado.'
  }
};

export const helpArticles = [
  { id: 'inicio-rapido', titulo: 'Guía de inicio rápido', descripcion: 'Primeros pasos con la plataforma', icono: 'fa-rocket', tiempo: '5 min' },
  { id: 'manual-ia', titulo: 'Manual de herramientas IA', descripcion: 'Funciones y configuración de IA Lab', icono: 'fa-robot', tiempo: '12 min' },
  { id: 'tutorial-smartboard', titulo: 'Tutorial SmartBoard', descripcion: 'Configuración y uso de pizarra interactiva', icono: 'fa-chalkboard', tiempo: '8 min' },
  { id: 'api-docs', titulo: 'API Documentation', descripcion: 'Integración con sistemas externos', icono: 'fa-code', tiempo: '15 min' },
  { id: 'faq', titulo: 'FAQ frecuentes', descripcion: 'Preguntas y respuestas comunes', icono: 'fa-circle-question', tiempo: '3 min' }
];

export const blogIntro = 'Explora nuestros artículos más recientes sobre tendencias educativas, tecnología e innovación pedagógica.';
export const blogSubtitle = 'Artículos, noticias y recursos';

export const helpIntro = 'Accede a toda la documentación necesaria para implementar y aprovechar al máximo las herramientas de Edutechlife.';
export const helpSubtitle = 'Manuales, guías y recursos técnicos';
export const helpNeedHelp = '¿Necesitas más ayuda?';
export const helpNeedHelpDesc = 'Contacta nuestro equipo de soporte para asistencia técnica personalizada.';

export const privacyLastUpdate = 'Última actualización: 15 de Marzo 2026';
export const termsLastUpdate = 'Última actualización: 15 de Marzo 2026';

export const helpArticleContents = {
  'inicio-rapido': {
    titulo: 'Guía de inicio rápido',
    introduccion: 'Bienvenido a Edutechlife. Esta guía te llevará a través de los primeros pasos para comenzar a utilizar la plataforma de manera efectiva. En menos de 10 minutos podrás navegar y utilizar las herramientas principales.',
    secciones: [
      {
        titulo: '1. Crear tu cuenta',
        contenido: 'El primer paso es crear tu cuenta en Edutechlife. Visita la página de registro e ingresa tu correo electrónico institucional. Recibirás un correo de verificación en menos de 2 minutos.',
        pasos: [
          'Ingresa a edutechlife.com y haz clic en "Registrarse"',
          'Ingresa tu correo electrónico institucional',
          'Crea una contraseña segura (mínimo 8 caracteres)',
          'Verifica tu correo electrónico',
          'Completa tu perfil con tu información académica'
        ]
      },
      {
        titulo: '2. Explorando el Dashboard',
        contenido: 'Una vez iniciado sesión, llegarás al Dashboard principal. Aquí encontrarás: navegación principal a la izquierda, panel de métricas en el centro, y accesos rápidos a herramientas en la parte superior.',
        imagen: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop'
      },
      {
        titulo: '3. Tu primera sesión con IA Lab',
        contenido: 'IA Lab es tu asistente de inteligencia artificial. Para comenzar tu primera sesión: selecciona "IA Lab" en el menú de herramientas, elige el modelo de IA preferido, escribe tu primera consulta en el campo de texto.',
        consejos: [
          'Sé específico en tus preguntas para obtener mejores resultados',
          'Utiliza los prompts predefinidos para comenzar',
          'Guarda tus conversaciones para referencia futura'
        ]
      },
      {
        titulo: '4. Configurar tu entorno',
        contenido: 'Personaliza tu experiencia en Edutechlife: accede a Configuración desde el menú, ajusta el idioma y zona horaria, configura tus preferencias de notificaciones, vincula tu calendario institucional.'
      },
      {
        titulo: '5. Próximos pasos',
        contenido: 'Una vez completado el inicio básico, te recomendamos: explorar el diagnóstico VAK para personalizar tu aprendizaje, revisar los tutoriales de SmartBoard si planeas usar pizarras interactivas, consultar la sección de automatización para optimizar procesos.'
      }
    ]
  },
  'manual-ia': {
    titulo: 'Manual de herramientas IA',
    introduccion: 'IA Lab es el núcleo de inteligencia artificial de Edutechlife. Esta guía te enseña a configurar y utilizar todas las capacidades de IA para potenciar tu práctica educativa.',
    secciones: [
      {
        titulo: 'Introducción a IA Lab',
        contenido: 'IA Lab integra modelos de IA avanzados para asistir en la creación de contenido educativo, análisis de datos y personalización del aprendizaje. El sistema soporta múltiples idiomas incluyendo español, inglés y portugués.',
        grafica: 'dona',
        datos: [
          { nombre: 'Generación de contenido', valor: 35 },
          { nombre: 'Análisis y evaluación', valor: 30 },
          { nombre: 'Asesoría pedagógica', valor: 25 },
          { nombre: 'Investigación', valor: 10 }
        ],
        unidad: 'Uso'
      },
      {
        titulo: 'Configuración de Modelos',
        contenido: 'Edutechlife ofrece múltiples modelos de IA optimizados para diferentes propósitos educativos. La selección del modelo correcto puede mejorar significativamente tus resultados.',
        modelos: [
          { nombre: 'Valerio', descripcion: 'Asistente pedagógico especializado en metodologías educativas', caso: 'Creación de planes de clase' },
          { nombre: 'Analítico', descripcion: 'Análisis de datos de estudiantes y generar reportes', caso: 'Identificación de patrones de aprendizaje' },
          { nombre: 'Creador', descripcion: 'Generación de contenido educativo diverso', caso: 'Materiales didácticos' },
          { nombre: 'Investigador', descripcion: 'Búsqueda y síntesis de información académica', caso: 'Revisión de literatura' }
        ]
      },
      {
        titulo: 'Prompts Personalizados',
        contenido: 'Los prompts son instrucciones que guían a la IA para generar respuestas específicas. Edutechlife incluye una biblioteca de prompts optimizados para diferentes escenarios educativos.',
        lista: [
          'Prompts para generación de evaluaciones',
          'Prompts para creación de rúbricas',
          'Prompts para diseño de actividades',
          'Prompts para retroalimentación automática'
        ]
      },
      {
        titulo: 'Configuración Avanzada',
        contenido: 'Para usuarios avanzados, IA Lab permite ajustar parámetros como: temperatura (creatividad vs precisión), longitud de respuesta, nivel de detalle, formato de salida.',
        grafica: 'barras',
        datos: [
          { categoria: 'Productividad', antes: 45, despues: 82 },
          { categoria: 'Calidad contenido', antes: 60, despues: 91 },
          { categoria: 'Tiempo preparación', antes: 100, despues: 35 }
        ],
        unidad: '%'
      },
      {
        titulo: 'Integración con Valerio',
        contenido: 'Valerio es el avatar inteligente de Edutechlife que combina técnicas de coaching con IA. Compatible con IA Lab, Valerio proporciona respuestas contextualizadas basadas en las mejores prácticas pedagógicas.'
      }
    ]
  },
  'tutorial-smartboard': {
    titulo: 'Tutorial SmartBoard',
    introduccion: 'SmartBoard es la solución de pizarra interactiva inteligente de Edutechlife. Esta guía te ayudará a configurar y utilizar todas las funciones para maximizar el engagement de tus estudiantes.',
    secciones: [
      {
        titulo: 'Especificaciones Técnicas',
        contenido: 'Antes de comenzar, conoce las especificaciones de tu SmartBoard: pantalla 4K multitáctil, tamaño de 65-86 pulgadas, tecnología infrarroja de alta precisión, conectividad HDMI, USB-C y WiFi 6.',
        especificacion: [
          { label: 'Resolución', valor: '3840 x 2160 (4K)' },
          { label: 'Táctil', valor: '20 puntos simultáneos' },
          { label: 'Tiempo respuesta', valor: '< 8ms' },
          { label: 'Brillo', valor: '400 cd/m²' },
          { label: 'Conectividad', valor: 'HDMI 2.0, USB-C, WiFi 6' }
        ]
      },
      {
        titulo: 'Instalación y Configuración',
        contenido: 'El proceso de instalación incluye: montaje en pared o soporte móvil, conexión de cables de energía y datos, calibración inicial de la pantalla, emparejamiento con el software Edutechlife.',
        pasos: [
          'Desempaca el SmartBoard y verifica todos los componentes',
          'Instala el soporte siguiendo las instrucciones del fabricante',
          'Conecta el cable HDMI al puerto correspondiente',
          'Enciende el dispositivo y espera a que cargue el sistema',
          'Descarga e instala la aplicación Edutechlife desde el centro de descargas'
        ]
      },
      {
        titulo: 'Herramientas Interactivas',
        contenido: 'SmartBoard incluye un conjunto completo de herramientas: pizarra colaborativa infinita, reconocimiento de escritura a mano, herramientas geométricas, editor de imágenes, grabación de sesiones.',
        grafica: 'linea',
        datos: [
          { anio: '2024', engagement: 65 },
          { anio: '2025', engagement: 78 },
          { anio: '2026', engagement: 92 }
        ],
        unidad: '% Engagement'
      },
      {
        titulo: 'Integración con Dispositivos',
        contenido: 'Maximiza la funcionalidad conectando dispositivos adicionales: tablets de estudiantes para compartir contenido, voting systems para evaluaciones en tiempo real, sistemas de audio mejorados para conferencias.',
        opciones: [
          'Conexión por código QR para compartir pantalla',
          'Emparejamiento Bluetooth para control remoto',
          'Sincronización con Google Classroom y Microsoft Teams'
        ]
      },
      {
        titulo: 'Solución de Problemas Comunes',
        contenido: 'Problemas frecuentes y sus soluciones: La pantalla no responde - verificar conexiones y reiniciar; La conexión WiFi falla - mover el router más cerca o usar cable Ethernet; El táctil no funciona - recalibrar desde configuración.',
        faqs: [
          { q: '¿Puedo usar el SmartBoard sin internet?', a: 'Sí, las funciones básicas funcionan offline' },
          { q: '¿Cuántos dispositivos puedo conectar?', a: 'Hasta 50 dispositivos simultáneamente' },
          { q: '¿El software es compatible con Mac?', a: 'Totalmente compatible con macOS 12+' }
        ]
      }
    ]
  },
  'api-docs': {
    titulo: 'API Documentation',
    introduccion: 'La API de Edutechlife permite integrar nuestras funcionalidades con tus sistemas existentes. Esta documentación está diseñada para desarrolladores que necesitan conectar LMS, sistemas de gestión académica o aplicaciones personalizadas.',
    secciones: [
      {
        titulo: 'Información General',
        contenido: 'La API de Edutechlife sigue arquitectura RESTful con autenticación JWT. Todos los endpoints requieren una clave API válida que puedes obtener desde el panel de administración.',
        detalle: {
          base: 'https://api.edutechlife.com/v1',
          formato: 'JSON',
          autenticacion: 'Bearer Token (JWT)',
          version: 'v1 (actual)'
        }
      },
      {
        titulo: 'Endpoints Principales',
        contenido: 'Los endpoints disponibles cubren las principales funcionalidades de la plataforma. A continuación se detallan los más utilizados:',
        endpoints: [
          { metodo: 'GET', ruta: '/usuarios', descripcion: 'Lista todos los usuarios' },
          { metodo: 'POST', ruta: '/usuarios', descripcion: 'Crea un nuevo usuario' },
          { metodo: 'GET', ruta: '/estudiantes/{id}', descripcion: 'Obtiene datos de un estudiante' },
          { metodo: 'PUT', ruta: '/estudiantes/{id}', descripcion: 'Actualiza información del estudiante' },
          { metodo: 'GET', ruta: '/resultados/vak', descripcion: 'Obtiene resultados de diagnóstico VAK' },
          { metodo: 'POST', ruta: '/ia/chat', descripcion: 'Envía mensaje al chat de IA' }
        ]
      },
      {
        titulo: 'Ejemplo de Autenticación',
        contenido: 'Para autenticarte con la API, incluye el token en el header de cada solicitud:',
        codigo: `// JavaScript - Fetch
const response = await fetch('https://api.edutechlife.com/v1/usuarios', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer TU_TOKEN_AQUI',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);`,
        lenguaje: 'JavaScript'
      },
      {
        titulo: 'Integración con LMS',
        contenido: 'Edutechlife se integra nativamente con los principales sistemas de gestión del aprendizaje:',
        integraciones: [
          { lms: 'Moodle', tipo: 'Plugin disponible', estado: 'Producción' },
          { lms: 'Canvas', tipo: 'API REST', estado: 'Producción' },
          { lms: 'Blackboard', tipo: 'LTI 1.3', estado: 'Beta' },
          { lms: 'Google Classroom', tipo: 'API OAuth', estado: 'Producción' }
        ]
      },
      {
        titulo: 'Rate Limits y Best Practices',
        contenido: 'Para garantizar la estabilidad del servicio, aplicamos límites de uso: 1000 requests/hora por API key, 100 requests/minuto en endpoints de IA. Recomendamos implementar caché local y webhooks para notificaciones asíncronas.',
        grafica: 'barras',
        datos: [
          { categoria: 'Gratis', valor: 100 },
          { categoria: 'Profesional', valor: 1000 },
          { categoria: 'Institucional', valor: 10000 },
          { categoria: 'Enterprise', valor: 100000 }
        ],
        unidad: 'Requests/hora'
      }
    ]
  },
  'faq': {
    titulo: 'FAQ Frecuentes',
    introduccion: 'Aquí encontrarás respuestas a las preguntas más frecuentes sobre Edutechlife. Si no encuentras la respuesta que buscas, contacta nuestro equipo de soporte.',
    secciones: [
      {
        titulo: 'Cuenta y Facturación',
        contenido: '',
        faqs: [
          { q: '¿Cómo puedo cambiar mi plan de suscripción?', a: 'Desde Configuración > Suscripción puedes cambiar tu plan en cualquier momento. El cambio será efectivo al siguiente ciclo de facturación.' },
          { q: '¿Qué métodos de pago aceptan?', a: 'Aceptamos tarjetas de crédito/débito (Visa, Mastercard, Amex), PayPal, y transferencias bancarias para planes anuales.' },
          { q: '¿Puedo obtener factura fiscal?', a: 'Sí, todas las transacciones incluyen factura fiscal. Descárgala desde Configuración > Facturación.' },
          { q: '¿Qué sucede si supero mi límite de usuarios?', a: 'Te notificaremos cuando alcances el 80% de tu límite. Puedes actualizar tu plan o esperar al siguiente ciclo.' }
        ]
      },
      {
        titulo: 'Técnicas',
        contenido: '',
        faqs: [
          { q: '¿Qué navegadores son compatibles?', a: 'Chrome 90+, Firefox 88+, Safari 15+, Edge 90+. Recomendamos Chrome para mejor rendimiento.' },
          { q: '¿Edutechlife funciona sin internet?', a: 'Algunas funciones básicas funcionan offline. Sincronizará automáticamente cuando vuelvas a conectar.' },
          { q: '¿Mis datos están seguros?', a: 'Utilizamos encriptación AES-256, cumplimiento con GDPR y SOC 2 Type II. Tus datos nunca se comparten.' },
          { q: '¿Puedo exportar mis datos?', a: 'Sí, desde Configuración > Datos puedes exportar en formato CSV, PDF o Excel.' }
        ]
      },
      {
        titulo: 'Pedagógicas',
        contenido: '',
        faqs: [
          { q: '¿El diagnóstico VAK es gratuito?', a: 'El diagnóstico básico es gratuito. La versión completa con análisis detallado requiere plan Profesional.' },
          { q: '¿Puedo usar Edutechlife para educación online?', a: 'Totalmente. Todas nuestras herramientas están optimizadas para entornos presenciales, híbridos y remotos.' },
          { q: '¿Cómo mido el ROI de usar la plataforma?', a: 'Incluimos un ROI Calculator que analiza métricas de rendimiento, engagement y reducción de tiempo administrativo.' },
          { q: '¿Las certificaciones tienen validez oficial?', a: 'Nuestras certificaciones son emitidas por Edutechlife y reconocidas por instituciones educativas aliadas.' }
        ]
      },
      {
        titulo: 'Soporte',
        contenido: '',
        faqs: [
          { q: '¿Cómo contacto al soporte?', a: 'Desde el chat en vivo (disponible 24/7), email a soporte@edutechlife.com, o a través del formulario en el Centro de Ayuda.' },
          { q: '¿Tienen capacitación para instituciones?', a: 'Sí, ofrecemos capacitación virtual y presencial para implementaciones institucionales.' },
          { q: '¿Cuál es el tiempo de respuesta?', a: 'Plan Gratuito: 48h, Profesional: 24h, Enterprise: 4h con administrador dedicado.' }
        ]
      }
    ]
  }
};

export const privacyContent = {
  lastUpdate: 'Última actualización: 15 de Marzo 2026',
  sections: [
    {
      title: '1. Introducción',
      content: 'En Edutechlife, accesible desde edutechlife.com, una de nuestras prioridades principales es la privacidad de nuestros usuarios. Este documento de Política de Privacidad contiene tipos de información que se recopilan y registran por Edutechlife y cómo la usamos.'
    },
    {
      title: '2. Información que recopilamos',
      content: 'Recopilamos información que nos proporcionas directamente al registrarte, crear un perfil o utilizar nuestros servicios. Esta puede incluir:',
      items: [
        'Información de identificación personal (nombre, correo electrónico, institución)',
        'Datos de uso de la plataforma y métricas de rendimiento',
        'Contenido generado por el usuario (materiales educativos, evaluaciones)',
        'Información de dispositivo y conexión'
      ]
    },
    {
      title: '3. Cómo usamos tu información',
      content: 'Utilizamos la información recopilada para diversos fines:',
      uses: [
        { title: 'Proveer servicios', desc: 'Mantener y mejorar nuestra plataforma educativa' },
        { title: 'Personalización', desc: 'Adaptar la experiencia de aprendizaje a tus necesidades' },
        { title: 'Comunicación', desc: 'Enviar actualizaciones y soporte técnico' },
        { title: 'Investigación', desc: 'Analizar patrones de uso para mejorar servicios' }
      ]
    },
    {
      title: '4. Cookies y tecnologías similares',
      content: 'Edutechlife utiliza "cookies" y tecnologías de seguimiento similares para mejorar tu experiencia. Estos archivos pequeños se almacenan en tu dispositivo y nos ayudan a analizar el tráfico web, personalizar contenido y comprender el comportamiento del usuario.'
    },
    {
      title: '5. Protección de datos',
      content: 'Implementamos medidas de seguridad robustas para proteger tu información personal:',
      security: [
        { icon: 'fa-lock', label: 'Encriptación AES-256' },
        { icon: 'fa-shield-halved', label: 'Firewall avanzado' },
        { icon: 'fa-server', label: 'Servidores seguros' },
        { icon: 'fa-user-shield', label: 'Autenticación 2FA' }
      ]
    },
    {
      title: '6. Tus derechos',
      content: 'Tienes derecho a acceder, corregir o eliminar tus datos personales. Puedes ejercer estos derechos contactándonos en privacidad@edutechlife.com. Responderemos a tu solicitud dentro de 30 días.'
    }
  ]
};

export const termsContent = {
  lastUpdate: 'Última actualización: 15 de Marzo 2026',
  sections: [
    {
      title: '1. Aceptación de términos',
      content: 'Al acceder y utilizar Edutechlife, aceptas cumplir con estos Términos de Uso. Si no estás de acuerdo con alguna parte de estos términos, no deberías utilizar nuestro servicio.'
    },
    {
      title: '2. Uso del servicio',
      content: 'Edutechlife proporciona una plataforma educativa para instituciones, docentes y estudiantes. Puedes utilizar nuestro servicio únicamente para fines educativos legítimos.'
    },
    {
      title: '3. Cuentas de usuario',
      content: 'Cuando creas una cuenta en Edutechlife, debes proporcionar información precisa y completa. Eres responsable de mantener la confidencialidad de tu cuenta y contraseña.'
    },
    {
      title: '4. Contenido del usuario',
      content: 'Puedes subir contenido a nuestra plataforma, incluyendo materiales educativos, evaluaciones y comentarios. Mantienes la propiedad de tu contenido pero nos otorgas licencia para usarlo.'
    },
    {
      title: '5. Uso prohibido',
      content: 'No puedes utilizar Edutechlife para:',
      prohibitions: [
        'Actividades ilegales',
        'Intento de acceso no autorizado',
        'Distribución de malware',
        'Acoso o intimidación',
        'Violación de privacidad',
        'Propaganda o discurso de odio',
        'Spam o phishing',
        'Manipulación de precios'
      ]
    },
    {
      title: '6. Propiedad intelectual',
      content: 'El servicio de Edutechlife y todo el contenido proporcionado, incluyendo texto, gráficos, logos e imágenes, son propiedad de Edutechlife o sus licenciantes y están protegidos por leyes de propiedad intelectual.'
    },
    {
      title: '7. Limitación de responsabilidad',
      content: 'Edutechlife no será responsable por daños indirectos, incidentales, especiales o consecuentes derivados del uso o incapacidad de usar el servicio.'
    }
  ]
};
