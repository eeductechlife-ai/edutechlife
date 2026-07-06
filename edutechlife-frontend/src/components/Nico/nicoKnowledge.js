const KNOWLEDGE = {
  intents: [
    {
      id: 'precios_vak',
      patterns: [
        'cuánto cuesta vak',
        'precio vak',
        'valor vak',
        'costo vak',
        'cuánto vale vak',
        'precios vak',
        'cuánto es vak',
        'precio del diagnóstico vak',
      ],
      category: 'precios',
      response: 'El diagnóstico VAK es completamente gratuito. Incluye una evaluación completa de tu estilo de aprendizaje con resultados detallados y recomendaciones personalizadas. Los planes de seguimiento tienen costo.',
    },
    {
      id: 'precios_stem',
      patterns: [
        'cuánto cuesta stem',
        'precio stem',
        'valor stem',
        'costo stem',
        'cuánto vale stem',
        'precios stem',
        'cuánto es stem',
        'precio de robótica',
        'precio de programación',
      ],
      category: 'precios',
      response: 'Los planes STEM varían según la modalidad y duración. Tenemos planes desde $99.000 mensuales. La primera clase es gratuita para que puedas probar sin compromiso.',
    },
    {
      id: 'precios_tutorias',
      patterns: [
        'cuánto cuesta una tutoría',
        'precio tutoría',
        'valor tutorías',
        'costo tutorías',
        'precio de tutorías',
        'cuánto vale una tutoría',
        'costo de tutorías',
      ],
      category: 'precios',
      response: 'Las tutorías personalizadas tienen un costo desde $X por sesión. También ofrecemos paquetes mensuales con descuento. La primera tutoría es gratuita.',
    },
    {
      id: 'precios_bienestar',
      patterns: [
        'cuánto cuesta bienestar',
        'precio bienestar',
        'precio psicología',
        'costo bienestar',
        'cuánto vale bienestar',
        'precios bienestar',
        'cuánto cuesta el programa de bienestar',
      ],
      category: 'precios',
      response: 'Nuestro programa de bienestar tiene planes desde $X mensuales. Incluye sesiones con profesionales en psicología educativa.',
    },
    {
      id: 'precios_ingles',
      patterns: [
        'cuánto cuesta inglés',
        'precio inglés',
        'valor inglés',
        'costo inglés',
        'cuánto vale inglés',
        'precios inglés',
        'precio del curso de inglés',
      ],
      category: 'precios',
      response: 'Los cursos de inglés tienen planes desde $X mensuales. Contamos con niveles desde básico hasta avanzado, con profesores nativos.',
    },
    {
      id: 'planes_disponibles',
      patterns: [
        'qué planes tienen',
        'planes disponibles',
        'planes de pago',
        'planes mensuales',
        'planes estudiante',
        'planes educador',
        'planes institución',
        'planes de suscripción',
      ],
      category: 'precios',
      response: 'Tenemos tres planes: Estudiante desde $99.000/mes con diagnóstico VAK incluido, plan de estudio personalizado y contenido STEAM. Educador desde $199.000/mes con SmartBoard, Valerio ilimitado y certificaciones IBM. Institución desde $499.000/mes con usuarios ilimitados y API personalizada.',
    },
    {
      id: 'primera_clase_gratis',
      patterns: [
        'primera clase gratis',
        'primera clase gratuita',
        'clase gratis',
        'clase gratuita',
        'prueba gratis',
        'sin costo',
        'gratuito',
        'gratis',
      ],
      category: 'promociones',
      response: 'Ofrecemos primera clase completamente gratuita en todos nuestros servicios para que puedas conocer la metodología sin compromiso. Dura entre 30 y 45 minutos.',
    },
    {
      id: 'descuentos',
      patterns: [
        'descuento',
        'descuentos',
        'promociones',
        'ofertas',
        'hermanos',
        'planes familiares',
        'descuento para hermanos',
      ],
      category: 'precios',
      response: 'Manejamos descuentos para hermanos, planes especiales para grupos de 10 o más personas, becas para casos especiales, y descuentos institucionales para colegios y universidades.',
    },
    {
      id: 'cancelacion',
      patterns: [
        'cancelar',
        'cancelación',
        'cancelacion',
        'permanencia',
        'sin permanencia',
        'me puedo salir',
        'darse de baja',
        'terminar contrato',
        'cancelar suscripción',
      ],
      category: 'politicas',
      response: 'Puedes cancelar tu suscripción en cualquier momento desde tu panel de usuario. No hay permanencia mínima ni costos de cancelación. Mantienes acceso hasta el final del período pagado.',
    },
    {
      id: 'horarios',
      patterns: [
        'horarios',
        'horario',
        'horario de atención',
        'cuándo tienen clases',
        'en qué horario',
        'a qué hora',
        'días de clase',
        'fines de semana',
        'sábados',
      ],
      category: 'generales',
      response: 'Tenemos horarios flexibles de lunes a sábado. Mañanas de 8am a 12pm, tardes de 2pm a 6pm, y evenings de 6pm a 8pm. Modalidad presencial, online o híbrida.',
    },
    {
      id: 'modalidades',
      patterns: [
        'modalidad',
        'presencial',
        'online',
        'virtual',
        'hibrido',
        'híbrido',
        'a distancia',
        'en línea',
        'en linea',
        'cómo son las clases',
      ],
      category: 'generales',
      response: 'Ofrecemos tres modalidades: presencial en Bogotá y otras ciudades con aulas equipadas, online en vivo con profesor desde cualquier lugar, e híbrida combinando ambas. Tú eliges la que mejor se adapte a ti.',
    },
    {
      id: 'edades',
      patterns: [
        'para qué edad',
        'para qué edades',
        'qué edades',
        'edad vak',
        'edad stem',
        'edad mínima',
        'edad máxima',
        'desde qué edad',
        'hasta qué edad',
      ],
      category: 'servicios',
      response: 'Tenemos programas para todas las edades: Niños de 5 a 11 años, Adolescentes de 12 a 17 años, y Adultos de 18 años en adelante. También ofrecemos programas para padres y docentes.',
    },
    {
      id: 'inscripcion',
      patterns: [
        'cómo me inscribo',
        'inscribirme',
        'registrarme',
        'proceso de inscripción',
        'cómo me registro',
        'qué necesito para inscribirme',
        'requisitos de inscripción',
        'cómo empezar',
      ],
      category: 'inscripcion',
      response: 'El proceso es simple: toma el diagnóstico VAK gratuito para conocer tu estilo de aprendizaje, te asesoramos sobre el programa ideal, te inscribes y comienzas con tu primera clase gratuita. ¿Quieres que te guíe en el proceso?',
    },
    {
      id: 'metodos_pago',
      patterns: [
        'métodos de pago',
        'método de pago',
        'formas de pago',
        'cómo pago',
        'medios de pago',
        'pago con tarjeta',
        'pago en efectivo',
        'transferencia',
        'pago mensual',
        'cómo puedo pagar',
      ],
      category: 'pagos',
      response: 'Aceptamos tarjetas de crédito y débito, transferencia bancaria, efectivo, y pagos a través de nuestra plataforma en línea. Tenemos planes mensuales y descuentos por pago anticipado.',
    },
    {
      id: 'certificaciones',
      patterns: [
        'certificación',
        'certificado',
        'certificaciones',
        'diploma',
        'constancia',
        'validez',
        'reconocido',
        'reconocida',
        'certificación internacional',
      ],
      category: 'servicios',
      response: 'Emitimos certificaciones en colaboración con IBM y Coursera, reconocidas internacionalmente. Como operadores oficiales SenaTIC, nuestras certificaciones tienen validez oficial en Colombia.',
    },
    {
      id: 'contacto',
      patterns: [
        'contacto',
        'teléfono',
        'whatsapp',
        'correo',
        'email',
        'dirección',
        'dónde están',
        'ubicación',
        'cómo contactarlos',
        'más información',
      ],
      category: 'contacto',
      response: 'Puedes contactarnos por WhatsApp al +57 300 123 4567, por email a info@edutechlife.com, o visitar nuestra web edutechlife.com. También puedes dejar tus datos y te contactamos.',
    },
    {
      id: 'que_es_vak',
      patterns: [
        'qué es vak',
        'que es vak',
        'qué es el diagnóstico vak',
        'explicación vak',
        'para qué sirve vak',
        'en qué consiste vak',
        'beneficios vak',
        'qué significa vak',
      ],
      category: 'servicios',
      response: 'VAK significa Visual, Auditivo y Kinestésico. Es un diagnóstico que identifica tu estilo de aprendizaje predominante usando algoritmos de visión cognitiva. Te ayuda a aprender de la forma más efectiva para ti. Es gratuito y toma entre 10 y 30 minutos.',
    },
    {
      id: 'que_es_stem',
      patterns: [
        'qué es stem',
        'que es stem',
        'explicación stem',
        'qué es robótica educativa',
        'para qué sirve stem',
        'en qué consiste stem',
        'qué es steam',
        'programación para niños',
      ],
      category: 'servicios',
      response: 'STEM integra Ciencia, Tecnología, Ingeniería y Matemáticas. En EdutechLife lo aplicamos con robótica LEGO y Arduino, programación en Scratch, Python y JavaScript, y proyectos prácticos que desarrollan pensamiento crítico y habilidades tecnológicas.',
    },
    {
      id: 'que_es_bienestar',
      patterns: [
        'qué es bienestar',
        'que es bienestar',
        'programa de bienestar',
        'apoyo psicológico',
        'psicología educativa',
        'bienestar emocional',
        'salud emocional',
        'acompañamiento psicológico',
      ],
      category: 'servicios',
      response: 'Nuestro programa de bienestar ofrece acompañamiento psicológico escolar, desarrollo de inteligencia emocional, manejo de ansiedad académica y coaching motivacional. Trabajamos con profesionales certificados.',
    },
    {
      id: 'que_son_tutorias',
      patterns: [
        'qué son las tutorías',
        'que son las tutorías',
        'tutorías personalizadas',
        'clases particulares',
        'apoyo escolar',
        'refuerzo académico',
        'tutoría académica',
      ],
      category: 'servicios',
      response: 'Las tutorías personalizadas son sesiones uno a uno con profesionales especializados. Ofrecemos apoyo en matemáticas todos los niveles, ciencias física química y biología, inglés conversacional y gramática, y técnicas de estudio.',
    },
    {
      id: 'que_es_smartboard',
      patterns: [
        'qué es smartboard',
        'que es smartboard',
        'smartboard',
        'dashboard educativo',
        'panel de aprendizaje',
      ],
      category: 'servicios',
      response: 'SmartBoard es un dashboard de acompañamiento académico y emocional para estudiantes de 8 a 16 años. Incluye misiones educativas, seguimiento de progreso, diagnóstico VAK y chat con Valerio AI.',
    },
    {
      id: 'que_es_ai_lab',
      patterns: [
        'qué es ai lab',
        'que es ai lab',
        'ai lab academic',
        'entrenamiento de ia',
        'curso de ia',
        'curso de inteligencia artificial',
      ],
      category: 'servicios',
      response: 'AI Lab Academic es un entrenamiento de élite con agentes de IA. Incluye 5 módulos: Ingeniería de Prompts, Potencia ChatGPT, Rastreo Profundo, Inmersión NotebookLM y Proyecto Disruptivo. Es un curso certificado.',
    },
    {
      id: 'valerio',
      patterns: [
        'valerio',
        'coach virtual',
        'qué es valerio',
        'asistente de ia',
        'tutor ia',
      ],
      category: 'servicios',
      response: 'Valerio es tu coach virtual basado en IA, entrenado con metodologías socráticas y pedagógicas. Puede responder preguntas sobre aprendizaje, analizar documentos, crear planes de estudio y guiarte en tu proceso educativo.',
    },
    {
      id: 'objeccion_caro',
      patterns: [
        'es muy caro',
        'muy costoso',
        'no tengo presupuesto',
        'está muy caro',
        'no me alcanza',
        'caro',
        'costoso',
        'no puedo pagar',
      ],
      category: 'objeciones',
      response: 'Entiendo que el presupuesto es importante. Tenemos planes flexibles desde $99.000 mensuales y la primera clase es gratuita para que puedas probar antes de decidir. También ofrecemos descuentos para hermanos y becas para casos especiales.',
    },
    {
      id: 'objeccion_tiempo',
      patterns: [
        'no tengo tiempo',
        'muy ocupado',
        'no me da tiempo',
        'sin tiempo',
        'horario complicado',
        'no tengo horario',
        'muy ocupada',
      ],
      category: 'objeciones',
      response: 'Entendemos que los horarios son ajustados. Por eso ofrecemos modalidad online y horarios flexibles incluyendo sábados. Las sesiones son de 45 a 60 minutos y tú eliges la frecuencia semanal.',
    },
    {
      id: 'objeccion_no_estoy_seguro',
      patterns: [
        'no estoy seguro',
        'no estoy segura',
        'voy a pensarlo',
        'lo voy a pensar',
        'después te confirmo',
        'más adelante',
        'todavía no sé',
        'lo pensaré',
      ],
      category: 'objeciones',
      response: 'Por supuesto, tómate el tiempo que necesites. Mientras tanto, la primera clase es gratuita y sin compromiso. Así puedes conocer nuestra metodología directamente. ¿Te gustaría agendarla?',
    },
    {
      id: 'vak_resultado',
      patterns: [
        'resultados vak',
        'resultado vak',
        'mi estilo de aprendizaje',
        'soy visual',
        'soy auditivo',
        'soy kinestésico',
        'qué significa mi resultado',
        'interpretar vak',
      ],
      category: 'servicios',
      response: 'Tu resultado VAK identifica tu estilo de aprendizaje predominante. Si eres Visual aprendes mejor con imágenes y diagramas. Auditivo con explicaciones y sonidos. Kinestésico con movimiento y práctica práctica. Usamos esto para personalizar tu aprendizaje al máximo.',
    },
    {
      id: 'metodologia',
      patterns: [
        'metodología',
        'metodologia',
        'cómo enseñan',
        'método de enseñanza',
        'cómo son las clases',
        'sistema de aprendizaje',
        'pedagogía',
      ],
      category: 'generales',
      response: 'Nuestra metodología combina pedagogía de alto impacto con inteligencia artificial. Usamos el diagnóstico VAK para personalizar cada clase según tu estilo de aprendizaje, integramos tecnología STEM con robótica y programación, y ofrecemos acompañamiento emocional con bienestar. Todo se adapta a tu ritmo.',
    },
    {
      id: 'garantia',
      patterns: [
        'garantía',
        'garantia',
        'satisfacción garantizada',
        'qué pasa si no me gusta',
        'devolución',
        'reembolso',
        'si no funciona',
      ],
      category: 'politicas',
      response: 'Ofrecemos primera clase gratuita para que pruebes sin riesgo. Además, si no estás satisfecho, puedes cancelar en cualquier momento sin penalización ni permanencia. Tu satisfacción es nuestra prioridad.',
    },
    {
      id: 'diferencia',
      patterns: [
        'por qué elegirlos',
        'por qué edutechlife',
        'qué los hace diferentes',
        'diferencia',
        'ventajas',
        'beneficios',
        'qué ofrecen que otros no',
        'por qué ustedes',
      ],
      category: 'ventas',
      response: 'Nos diferenciamos por nuestro enfoque integral y personalizado. Combinamos diagnóstico VAK para aprender según tu estilo, tecnología STEM y robótica educativa, acompañamiento emocional con profesionales, y modalidades flexibles presencial online e híbrido. Todo con primera clase gratuita y cancelación sin permanencia.',
    },
    {
      id: 'duracion',
      patterns: [
        'cuánto dura el curso',
        'duración',
        'cuánto tiempo',
        'cuántas clases',
        'cuánto dura',
        'duración del programa',
        'cuánto dura cada clase',
      ],
      category: 'generales',
      response: 'La duración depende del programa. Generalmente los cursos son trimestrales o semestrales con sesiones semanales de 45 a 60 minutos. Tú decides la frecuencia que mejor se adapte a tu agenda.',
    },
    {
      id: 'profesores',
      patterns: [
        'profesores',
        'quiénes son los profesores',
        'instructores',
        'docentes',
        'certificación profesores',
        'están capacitados',
        'experiencia profesores',
        'quién enseña',
      ],
      category: 'generales',
      response: 'Todos nuestros profesionales son certificados y con amplia experiencia. Tenemos docentes especializados en educación STEM, psicólogos educativos para bienestar, y tutores expertos en refuerzo académico. Todos reciben capacitación continua.',
    },
    {
      id: 'smartboard_funciones',
      patterns: [
        'qué hace smartboard',
        'funciones smartboard',
        'misiones educativas',
        'seguimiento smartboard',
        'progreso smartboard',
      ],
      category: 'servicios',
      response: 'SmartBoard incluye misiones educativas interactivas, seguimiento de progreso en tiempo real, diagnóstico VAK integrado, chat con Valerio AI, y reportes para padres. Está diseñado para estudiantes de 8 a 16 años.',
    },
    {
      id: 'problema_plataforma',
      patterns: [
        'no carga la plataforma',
        'problema con la plataforma',
        'no funciona la página',
        'error en la plataforma',
        'no puedo acceder',
        'falla técnica',
      ],
      category: 'soporte',
      response: 'Si tienes problemas para acceder a la plataforma, verifica tu conexión a internet o intenta con otro navegador como Chrome o Safari. Si el problema persiste, escríbenos por WhatsApp y te ayudamos.',
    },
    {
      id: 'reprogramar',
      patterns: [
        'reprogramar clase',
        'cancelar clase',
        'cambiar horario',
        'mover clase',
        'no puedo ir a la clase',
        'repogramar',
      ],
      category: 'soporte',
      response: 'Si necesitas reprogramar una clase, hazlo con al menos 24 horas de anticipación desde tu perfil en la plataforma o contactándonos directamente por WhatsApp.',
    },
    {
      id: 'problema_pago',
      patterns: [
        'no me cobraron',
        'cobro incorrecto',
        'problema con el pago',
        'pago no procesado',
        'error de pago',
        'cobro duplicado',
      ],
      category: 'soporte',
      response: 'Si tienes problemas con un pago, verifica los datos de tu tarjeta o intenta con otro método de pago. Si el problema persiste, contáctanos por WhatsApp y lo resolvemos.',
    },
    {
      id: 'grupales',
      patterns: [
        'clases grupales',
        'clases en grupo',
        'grupos pequeños',
        'máximo estudiantes por clase',
        'cuántos por clase',
      ],
      category: 'servicios',
      response: 'Ofrecemos clases individuales uno a uno para atención personalizada y clases grupales con máximo 6 estudiantes para fomentar la colaboración. Las grupales tienen un costo menor.',
    },
    {
      id: 'ubicacion',
      patterns: [
        'dónde están ubicados',
        'dirección',
        'sede',
        'lugar',
        'cómo llegar',
        'instalaciones',
        'domicilio',
      ],
      category: 'contacto',
      response: 'Nuestras instalaciones están en Bogotá y otras ciudades. Contamos con aulas equipadas con tecnología de punta, laboratorio STEM, y espacios cómodos para aprendizaje. Si prefieres desde casa, ofrecemos clases online.',
    },
    {
      id: 'empresas',
      patterns: [
        'empresas',
        'para empresas',
        'programas corporativos',
        'B2B',
        'consultoría empresarial',
        'instituciones',
        'para colegios',
        'programas institucionales',
      ],
      category: 'servicios',
      response: 'Ofrecemos consultoría B2B para instituciones educativas y empresas, con diagnósticos personalizados, programas de capacitación, y proyectos de impacto nacional. También tenemos planes especiales para colegios y universidades.',
    },
    {
      id: 'becas',
      patterns: [
        'beca',
        'becas',
        'programa de becas',
        'ayuda financiera',
        'apoyo económico',
        'subsidio',
      ],
      category: 'precios',
      response: 'Contamos con un programa de becas por rendimiento académico y situación socioeconómica. También ofrecemos descuentos para hermanos y planes especiales para grupos. Pregunta por las convocatorias vigentes.',
    },
    {
      id: 'cuenta_gratuita',
      patterns: [
        'cuenta gratis',
        'cuenta gratuita',
        'versión gratis',
        'versión gratuita',
        'prueba gratuita',
        'plan gratis',
      ],
      category: 'promociones',
      response: 'Puedes empezar con el diagnóstico VAK gratuito que te toma entre 10 y 30 minutos y obtienes un perfil detallado de tu estilo de aprendizaje. También ofrecemos primera clase gratuita en todos los programas.',
    },
    {
      id: 'frecuencia_clases',
      patterns: [
        'cada cuánto son las clases',
        'frecuencia de clases',
        'cuántas veces por semana',
        'clases semanales',
        'cuántos días a la semana',
        'una vez por semana',
        'dos veces por semana',
        'frecuencia semanal',
      ],
      category: 'generales',
      response: 'Las clases son generalmente una o dos veces por semana, con sesiones de 45 a 60 minutos. Tú decides la frecuencia según tu disponibilidad y ritmo de aprendizaje.',
    },
    {
      id: 'clases_grabadas',
      patterns: [
        'clases grabadas',
        'quedan grabadas',
        'puedo ver después',
        'grabación de clases',
        'ver clase después',
        'recuperar clase',
        'si falto',
        'si no puedo ir',
      ],
      category: 'generales',
      response: 'Sí, todas las clases quedan grabadas para que puedas repasarlas cuando quieras. Así si faltas a una sesión puedes ponerte al día viendo la grabación.',
    },
    {
      id: 'material_apoyo',
      patterns: [
        'material de estudio',
        'material didáctico',
        'guías de estudio',
        'ejercicios',
        'talleres',
        'tareas',
        'deberes',
        'material incluido',
      ],
      category: 'servicios',
      response: 'Incluimos material didáctico digital interactivo, guías de estudio personalizadas según tu estilo VAK, ejercicios prácticos y acceso a nuestra plataforma con recursos adicionales.',
    },
    {
      id: 'resultados_esperados',
      patterns: [
        'cuánto tiempo en ver resultados',
        'resultados visibles',
        'mejora académica',
        'cuándo se ven resultados',
        'progreso académico',
        'mejorar notas',
        'subir calificaciones',
        'resultados rápidos',
      ],
      category: 'ventas',
      response: 'Los estudiantes suelen notar mejoras significativas en las primeras 4 a 6 semanas. Con nuestra metodología personalizada y seguimiento continuo, el progreso académico es constante y medible.',
    },
    {
      id: 'nivelacion',
      patterns: [
        'nivelación',
        'ponerme al día',
        'estoy atrasado',
        'nivelación académica',
        'recuperar materias',
        'estoy mal en',
        'necesito ayuda urgente',
        'curso de nivelación',
      ],
      category: 'servicios',
      response: 'Ofrecemos programas intensivos de nivelación para ponerte al día en matemáticas, ciencias e inglés. Evaluamos tu nivel actual y creamos un plan personalizado para cubrir vacíos académicos.',
    },
    {
      id: 'prueba_nivel',
      patterns: [
        'prueba de nivel',
        'evaluación diagnóstica',
        'test de nivel',
        'diagnóstico gratuito',
        'evaluación inicial',
        'qué nivel tengo',
        'saber mi nivel',
      ],
      category: 'servicios',
      response: 'Realizamos una evaluación diagnóstica gratuita para determinar tu nivel actual en la materia. Esto nos permite crear un plan de estudios personalizado y medir tu progreso.',
    },
    {
      id: 'convenios',
      patterns: [
        'convenios',
        'alianzas',
        'colegios asociados',
        'universidades asociadas',
        'certificación ibm',
        'coursera',
        'senatic',
        'operador oficial',
      ],
      category: 'generales',
      response: 'Tenemos alianzas con IBM, Coursera, y somos operadores oficiales SenaTIC. Nuestras certificaciones tienen validez internacional y oficial en Colombia.',
    },
    {
      id: 'recomendaciones',
      patterns: [
        'recomendar',
        'recomendado',
        'referido',
        'amigo',
        'familiar',
        'recomiendas',
        'han usado',
        'opiniones',
        'testimonios',
      ],
      category: 'ventas',
      response: 'Nuestros estudiantes y sus familias nos recomiendan por la calidad del acompañamiento personalizado y los resultados visibles. Tenemos más de 2000 estudiantes activos y un índice de satisfacción superior al 95%.',
    },
    {
      id: 'pago_diferido',
      patterns: [
        'pago diferido',
        'pagar después',
        'financiación',
        'cuotas',
        'pago por cuotas',
        'aplazar pago',
        'pagar más tarde',
        'plan de pagos',
      ],
      category: 'precios',
      response: 'Manejamos planes flexibles de pago. Puedes pagar por mes sin permanencia, o acceder a descuentos por pago anticipado del semestre o año completo.',
    },
    {
      id: 'adaptacion_curricular',
      patterns: [
        'necesidades especiales',
        'adaptación curricular',
        'dificultades de aprendizaje',
        'tdah',
        'dislexia',
        'discapacidad',
        'educación inclusiva',
        'necesidades educativas especiales',
      ],
      category: 'servicios',
      response: 'Sí, adaptamos nuestros programas para estudiantes con necesidades educativas especiales como TDAH, dislexia y otras condiciones. Trabajamos con profesionales en psicopedagogía para crear planes inclusivos y personalizados.',
    },
    {
      id: 'grupo_edad_especifica',
      patterns: [
        'programa para niños de',
        'clases para niños de',
        'curso para niños de',
        'programa para adolescentes',
        'clases para adolescentes',
        'programa para adultos',
        'clases para adultos',
        'mayores de',
        'menores de',
      ],
      category: 'servicios',
      response: 'Tenemos programas para niños desde los 5 años, adolescentes hasta 17 años y adultos sin límite de edad. Cada programa está adaptado pedagógicamente a la etapa de desarrollo del estudiante.',
    },
  ],

  categories: {
    precios: { proactive: true, priority: 1, label: 'precios y planes' },
    promociones: { proactive: true, priority: 2, label: 'promociones' },
    servicios: { proactive: true, priority: 3, label: 'servicios educativos' },
    inscripcion: { proactive: true, priority: 4, label: 'inscripción' },
    ventas: { proactive: true, priority: 5, label: 'ventas' },
    objeciones: { proactive: true, priority: 6, label: 'objeciones' },
    pagos: { proactive: true, priority: 7, label: 'métodos de pago' },
    politicas: { proactive: false, priority: 8, label: 'políticas' },
    generales: { proactive: false, priority: 9, label: 'generales' },
    contacto: { proactive: false, priority: 10, label: 'contacto' },
    soporte: { proactive: false, priority: 11, label: 'soporte' },
  },
}

const normalize = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const getWords = (text) => {
  return normalize(text).split(/\s+/).filter(w => w.length > 2)
}

const wordOverlapScore = (queryWords, patternWords) => {
  if (queryWords.length === 0 || patternWords.length === 0) return 0
  const patternSet = new Set(patternWords)
  let matches = 0
  for (const word of queryWords) {
    if (patternSet.has(word)) matches++
  }
  return matches / Math.min(queryWords.length, patternWords.length + 1)
}

export function matchIntent(text) {
  if (!text) return null
  const normalized = normalize(text)
  const queryWords = getWords(text)

  let bestMatch = null
  let bestScore = 0

  for (const intent of KNOWLEDGE.intents) {
    for (const pattern of intent.patterns) {
      const normalizedPattern = normalize(pattern)
      
      // Exact match first (highest priority)
      if (normalized.includes(normalizedPattern)) {
        return {
          id: intent.id,
          response: intent.response,
          category: intent.category,
        }
      }
      
      // Word overlap scoring as fallback
      const patternWords = getWords(pattern)
      const score = wordOverlapScore(queryWords, patternWords)
      if (score > bestScore) {
        bestScore = score
        bestMatch = intent
      }
    }
  }

  // Return best fuzzy match if score is high enough
  if (bestMatch && bestScore >= 0.4) {
    return {
      id: bestMatch.id,
      response: bestMatch.response,
      category: bestMatch.category,
    }
  }

  return null
}

export function getKnowledgeStats() {
  return {
    totalIntents: KNOWLEDGE.intents.length,
    categories: Object.keys(KNOWLEDGE.categories).length,
  }
}
