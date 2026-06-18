/**
 * Banco de preguntas VAK por grupo etario
 * Adaptadas al nivel de comprensión de cada edad
 */

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const QUESTIONS_BY_AGE = {
  "6-9": [
    {
      id: "vak_6_001",
      text: "¿Cómo te gusta más aprender algo nuevo?",
      style: "visual",
      difficulty: 0.65,
      discrimination: 0.48,
      options: [
        { text: "Viendo videos o dibujos animados", type: "visual", icon: "Eye" },
        { text: "Escuchando a mi profesor o a mis papás", type: "auditivo", icon: "Headphones" },
        { text: "Haciéndolo yo mismo con mis manos", type: "kinestesico", icon: "Activity" }
      ]
    },
    {
      id: "vak_6_002",
      text: "Cuando te cuentan un cuento, ¿qué prefieres?",
      style: "visual",
      difficulty: 0.55,
      discrimination: 0.42,
      options: [
        { text: "Ver las imágenes del libro", type: "visual", icon: "BookOpen" },
        { text: "Escuchar la historia con atención", type: "auditivo", icon: "Volume" },
        { text: "Actuar el cuento con mis amigos", type: "kinestesico", icon: "Users" }
      ]
    },
    {
      id: "vak_6_003",
      text: "En clase, ¿qué actividad te divierte más?",
      style: "kinestesico",
      difficulty: 0.45,
      discrimination: 0.50,
      options: [
        { text: "Dibujar y colorear", type: "visual", icon: "Sparkles" },
        { text: "Cantar canciones", type: "auditivo", icon: "Mic" },
        { text: "Jugar con plastilina o bloques", type: "kinestesico", icon: "Cpu" }
      ]
    },
    {
      id: "vak_6_004",
      text: "Si quieres recordar algo importante, ¿qué haces?",
      style: "visual",
      difficulty: 0.60,
      discrimination: 0.52,
      options: [
        { text: "Lo escribo o hago un dibujo", type: "visual", icon: "ListOrdered" },
        { text: "Lo repito en voz alta", type: "auditivo", icon: "MessageCircle" },
        { text: "Hago una seña o gesto para recordarlo", type: "kinestesico", icon: "Activity" }
      ]
    },
    {
      id: "vak_6_005",
      text: "¿Cómo te gusta más jugar?",
      style: "kinestesico",
      difficulty: 0.40,
      discrimination: 0.55,
      options: [
        { text: "Con rompecabezas y juegos de mesa", type: "visual", icon: "Globe" },
        { text: "Escuchando música y bailando", type: "auditivo", icon: "Headphones" },
        { text: "Corriendo, saltando y moviéndome", type: "kinestesico", icon: "Zap" }
      ]
    },
    {
      id: "vak_6_006",
      text: "Cuando estás en el parque, ¿qué haces primero?",
      style: "visual",
      difficulty: 0.35,
      discrimination: 0.38,
      options: [
        { text: "Observar los árboles, flores y pájaros", type: "visual", icon: "Eye" },
        { text: "Escuchar los sonidos de la naturaleza", type: "auditivo", icon: "Volume" },
        { text: "Trepar, correr y jugar en los columpios", type: "kinestesico", icon: "Rocket" }
      ]
    },
    {
      id: "vak_6_007",
      text: "Para aprender los números, ¿cómo te fue más fácil?",
      style: "visual",
      difficulty: 0.50,
      discrimination: 0.45,
      options: [
        { text: "Viendo las tablas con colores", type: "visual", icon: "CheckSquare" },
        { text: "Escuchando una canción de números", type: "auditivo", icon: "Mic" },
        { text: "Contando objetos con mis dedos", type: "kinestesico", icon: "Wrench" }
      ]
    },
    {
      id: "vak_6_008",
      text: "¿Cómo prefieres que te expliquen una tarea?",
      style: "visual",
      difficulty: 0.55,
      discrimination: 0.50,
      options: [
        { text: "Que me muestren un ejemplo", type: "visual", icon: "Video" },
        { text: "Que me la expliquen hablando", type: "auditivo", icon: "MessageCircle" },
        { text: "Haciéndola juntos paso a paso", type: "kinestesico", icon: "Users" }
      ]
    },
    {
      id: "vak_6_009",
      text: "Si te regalan algo nuevo, ¿qué haces primero?",
      style: "kinestesico",
      difficulty: 0.35,
      discrimination: 0.48,
      options: [
        { text: "Miro todos los detalles y colores", type: "visual", icon: "Eye" },
        { text: "Pregunto cómo funciona", type: "auditivo", icon: "Headphones" },
        { text: "Lo toco y empiezo a usarlo", type: "kinestesico", icon: "Activity" }
      ]
    },
    {
      id: "vak_6_010",
      text: "En una fiesta de cumpleaños, ¿qué te gusta más?",
      style: "kinestesico",
      difficulty: 0.30,
      discrimination: 0.42,
      options: [
        { text: "Ver la decoración y los globos", type: "visual", icon: "Sparkles" },
        { text: "Cantar y escuchar la música", type: "auditivo", icon: "Music" },
        { text: "Bailar y jugar con los demás", type: "kinestesico", icon: "Zap" }
      ]
    },
    {
      id: "vak_6_011",
      text: "¿Cómo aprendes mejor las canciones nuevas?",
      style: "auditivo",
      difficulty: 0.50,
      discrimination: 0.45,
      options: [
        { text: "Escuchándolas muchas veces", type: "auditivo", icon: "Headphones" },
        { text: "Viendo el video de la canción", type: "visual", icon: "Video" },
        { text: "Bailando al ritmo de la música", type: "kinestesico", icon: "Activity" }
      ]
    },
    {
      id: "vak_6_012",
      text: "Cuando te explican algo nuevo, ¿qué prefieres?",
      style: "auditivo",
      difficulty: 0.55,
      discrimination: 0.48,
      options: [
        { text: "Que te lo digan paso a paso", type: "auditivo", icon: "Volume" },
        { text: "Que te lo muestren con dibujos", type: "visual", icon: "Eye" },
        { text: "Hacerlo tú mismo mientras te explican", type: "kinestesico", icon: "Wrench" }
      ]
    },
    {
      id: "vak_6_013",
      text: "¿Cómo te gusta participar en clase?",
      style: "auditivo",
      difficulty: 0.45,
      discrimination: 0.42,
      options: [
        { text: "Respondiendo preguntas en voz alta", type: "auditivo", icon: "Mic" },
        { text: "Escribiendo en el pizarrón", type: "visual", icon: "BookOpen" },
        { text: "Haciendo actividades con las manos", type: "kinestesico", icon: "Activity" }
      ]
    },
    {
      id: "vak_6_014",
      text: "¿Qué te ayuda más a calmarte cuando estás enojado?",
      style: "auditivo",
      difficulty: 0.50,
      discrimination: 0.46,
      options: [
        { text: "Escuchar música suave", type: "auditivo", icon: "Music" },
        { text: "Ver un libro de dibujos", type: "visual", icon: "BookOpen" },
        { text: "Saltar o hacer ejercicio", type: "kinestesico", icon: "Zap" }
      ]
    },
    {
      id: "vak_6_015",
      text: "¿Cómo prefieres explorar un lugar nuevo?",
      style: "kinestesico",
      difficulty: 0.40,
      discrimination: 0.55,
      options: [
        { text: "Tocando y probando todo", type: "kinestesico", icon: "Activity" },
        { text: "Mirando con atención todo a mi alrededor", type: "visual", icon: "Eye" },
        { text: "Preguntando sobre lo que veo", type: "auditivo", icon: "MessageCircle" }
      ]
    },
    {
      id: "vak_6_016",
      text: "¿Qué haces cuando estás aburrido?",
      style: "kinestesico",
      difficulty: 0.45,
      discrimination: 0.52,
      options: [
        { text: "Busco algo para construir o hacer", type: "kinestesico", icon: "Cpu" },
        { text: "Canto o hablo con alguien", type: "auditivo", icon: "Users" },
        { text: "Veo dibujos o leo un libro", type: "visual", icon: "BookOpen" }
      ]
    }
  ],

  "10-13": [
    {
      id: "vak_10_001",
      text: "Para estudiar un tema nuevo, ¿qué prefieres?",
      style: "visual",
      difficulty: 0.65,
      discrimination: 0.50,
      options: [
        { text: "Ver videos educativos o documentales", type: "visual", icon: "Video" },
        { text: "Escuchar un podcast o explicación grabada", type: "auditivo", icon: "Headphones" },
        { text: "Hacer un experimento o proyecto práctico", type: "kinestesico", icon: "Wrench" },
        { text: "Leer un libro con muchas ilustraciones", type: "visual", icon: "BookOpen" }
      ]
    },
    {
      id: "vak_10_002",
      text: "En una exposición escolar, ¿cómo te preparas mejor?",
      style: "auditivo",
      difficulty: 0.60,
      discrimination: 0.55,
      options: [
        { text: "Creando diapositivas con muchas imágenes", type: "visual", icon: "Eye" },
        { text: "Practicando mi discurso en voz alta", type: "auditivo", icon: "Mic" },
        { text: "Ensayando con gestos y movimientos", type: "kinestesico", icon: "Activity" },
        { text: "Grabando un audio para repasar después", type: "auditivo", icon: "Music" }
      ]
    },
    {
      id: "vak_10_003",
      text: "¿Cómo organizas mejor tus ideas?",
      style: "visual",
      difficulty: 0.55,
      discrimination: 0.48,
      options: [
        { text: "Con mapas mentales y esquemas de colores", type: "visual", icon: "Globe" },
        { text: "Hablando sobre el tema con alguien", type: "auditivo", icon: "MessageCircle" },
        { text: "Escribiendo y haciendo borradores", type: "kinestesico", icon: "BookOpen" },
        { text: "Usando notas adhesivas de colores", type: "visual", icon: "Lightbulb" }
      ]
    },
    {
      id: "vak_10_004",
      text: "En tu tiempo libre, ¿qué actividad disfrutas más?",
      style: "kinestesico",
      difficulty: 0.45,
      discrimination: 0.45,
      options: [
        { text: "Ver series, películas o videos", type: "visual", icon: "Video" },
        { text: "Escuchar música o tocar un instrumento", type: "auditivo", icon: "Music" },
        { text: "Hacer deporte o manualidades", type: "kinestesico", icon: "Rocket" },
        { text: "Armar rompecabezas o jugar videojuegos", type: "kinestesico", icon: "Cpu" }
      ]
    },
    {
      id: "vak_10_005",
      text: "Cuando lees un libro, ¿qué te ayuda más a entenderlo?",
      style: "visual",
      difficulty: 0.60,
      discrimination: 0.50,
      options: [
        { text: "Ver las ilustraciones y diagramas", type: "visual", icon: "BookOpen" },
        { text: "Leerlo en voz alta o que te lo lean", type: "auditivo", icon: "Volume" },
        { text: "Tomar notas o subrayar mientras lees", type: "kinestesico", icon: "ListOrdered" },
        { text: "Hacer un resumen con tus propias palabras", type: "auditivo", icon: "MessageCircle" }
      ]
    },
    {
      id: "vak_10_006",
      text: "¿Cómo recuerdas mejor una información?",
      style: "visual",
      difficulty: 0.55,
      discrimination: 0.52,
      options: [
        { text: "Visualizando imágenes mentales", type: "visual", icon: "Eye" },
        { text: "Repitiéndola en voz alta o grabándola", type: "auditivo", icon: "Mic" },
        { text: "Escribiéndola varias veces", type: "kinestesico", icon: "Wrench" },
        { text: "Asociándola con un color o dibujo", type: "visual", icon: "Sparkles" }
      ]
    },
    {
      id: "vak_10_007",
      text: "En un trabajo en grupo, ¿qué rol prefieres?",
      style: "visual",
      difficulty: 0.50,
      discrimination: 0.42,
      options: [
        { text: "Diseñar la presentación visual", type: "visual", icon: "Cpu" },
        { text: "Explicar el tema al resto del grupo", type: "auditivo", icon: "Users" },
        { text: "Armar la maqueta o el material", type: "kinestesico", icon: "Cpu" },
        { text: "Investigar y recopilar información", type: "visual", icon: "List" }
      ]
    },
    {
      id: "vak_10_008",
      text: "¿Qué tipo de clases te gustan más?",
      style: "kinestesico",
      difficulty: 0.45,
      discrimination: 0.50,
      options: [
        { text: "Las que usan videos, imágenes y diapositivas", type: "visual", icon: "Video" },
        { text: "Las que incluyen debates y discusiones", type: "auditivo", icon: "MessageCircle" },
        { text: "Las que tienen laboratorios y actividades prácticas", type: "kinestesico", icon: "Activity" },
        { text: "Las que permiten trabajar con las manos", type: "kinestesico", icon: "Wrench" }
      ]
    },
    {
      id: "vak_10_009",
      text: "Para aprender un nuevo juego o deporte, ¿cómo lo haces?",
      style: "kinestesico",
      difficulty: 0.40,
      discrimination: 0.55,
      options: [
        { text: "Viendo a otros jugar primero", type: "visual", icon: "Eye" },
        { text: "Escuchando las reglas y explicaciones", type: "auditivo", icon: "Headphones" },
        { text: "Empezando a jugar y aprendiendo sobre la marcha", type: "kinestesico", icon: "Zap" },
        { text: "Leyendo las instrucciones detenidamente", type: "visual", icon: "BookOpen" }
      ]
    },
    {
      id: "vak_10_010",
      text: "Cuando tienes que memorizar algo, ¿qué técnica usas?",
      style: "visual",
      difficulty: 0.50,
      discrimination: 0.45,
      options: [
        { text: "Hacer tarjetas con colores y dibujos", type: "visual", icon: "Lightbulb" },
        { text: "Crear una canción o rima", type: "auditivo", icon: "Mic" },
        { text: "Caminar mientras repaso", type: "kinestesico", icon: "Activity" },
        { text: "Explicárselo a un amigo o familiar", type: "auditivo", icon: "Users" }
      ]
    },
    {
      id: "vak_10_011",
      text: "¿Cómo aprendes mejor un concepto nuevo en clase?",
      style: "auditivo",
      difficulty: 0.60,
      discrimination: 0.50,
      options: [
        { text: "Escuchando una explicación detallada del profesor", type: "auditivo", icon: "Headphones" },
        { text: "Viendo un video o diagrama explicativo", type: "visual", icon: "Video" },
        { text: "Haciendo un experimento o actividad práctica", type: "kinestesico", icon: "Wrench" }
      ]
    },
    {
      id: "vak_10_012",
      text: "Cuando trabajas en equipo, ¿cómo contribuyes más?",
      style: "auditivo",
      difficulty: 0.55,
      discrimination: 0.48,
      options: [
        { text: "Dando ideas y opiniones durante la discusión", type: "auditivo", icon: "Users" },
        { text: "Organizando la información visualmente", type: "visual", icon: "Globe" },
        { text: "Construyendo o armando el proyecto", type: "kinestesico", icon: "Activity" }
      ]
    },
    {
      id: "vak_10_013",
      text: "¿Cómo prefieres repasar para un examen?",
      style: "auditivo",
      difficulty: 0.50,
      discrimination: 0.45,
      options: [
        { text: "Explicando el tema en voz alta", type: "auditivo", icon: "Mic" },
        { text: "Leyendo resúmenes con colores y dibujos", type: "visual", icon: "BookOpen" },
        { text: "Haciendo ejercicios de práctica", type: "kinestesico", icon: "CheckSquare" }
      ]
    },
    {
      id: "vak_10_014",
      text: "¿Qué tipo de contenido educativo te llama más la atención?",
      style: "auditivo",
      difficulty: 0.55,
      discrimination: 0.50,
      options: [
        { text: "Entrevistas y conversaciones informativas", type: "auditivo", icon: "MessageCircle" },
        { text: "Videotutoriales con animaciones", type: "visual", icon: "Video" },
        { text: "Actividades interactivas donde puedo participar", type: "kinestesico", icon: "Activity" }
      ]
    },
    {
      id: "vak_10_015",
      text: "¿Cómo aprendes mejor en la clase de ciencias?",
      style: "kinestesico",
      difficulty: 0.50,
      discrimination: 0.52,
      options: [
        { text: "Realizando experimentos prácticos", type: "kinestesico", icon: "Wrench" },
        { text: "Escuchando la explicación del profesor", type: "auditivo", icon: "Headphones" },
        { text: "Viendo diagramas y modelos visuales", type: "visual", icon: "Eye" }
      ]
    },
    {
      id: "vak_10_016",
      text: "¿Qué haces cuando necesitas resolver un problema difícil?",
      style: "kinestesico",
      difficulty: 0.45,
      discrimination: 0.50,
      options: [
        { text: "Lo intento hacer de diferentes maneras", type: "kinestesico", icon: "Cpu" },
        { text: "Pregunto a alguien cómo resolverlo", type: "auditivo", icon: "MessageCircle" },
        { text: "Hago un dibujo o diagrama del problema", type: "visual", icon: "Lightbulb" }
      ]
    }
  ],

  "14-17": [
    {
      id: "vak_14_001",
      text: "Frente a un concepto académico complejo, ¿cómo prefieres abordarlo?",
      style: "visual",
      difficulty: 0.75,
      discrimination: 0.55,
      options: [
        { text: "Analizando gráficos, diagramas e infografías", type: "visual", icon: "Eye" },
        { text: "Escuchando una explicación detallada o un podcast", type: "auditivo", icon: "Headphones" },
        { text: "Realizando un experimento o proyecto práctico", type: "kinestesico", icon: "Wrench" },
        { text: "Leyendo textos con ejemplos ilustrados", type: "visual", icon: "BookOpen" }
      ]
    },
    {
      id: "vak_14_002",
      text: "¿Cuál es tu método de estudio más efectivo?",
      style: "visual",
      difficulty: 0.65,
      discrimination: 0.50,
      options: [
        { text: "Crear resúmenes visuales con colores y esquemas", type: "visual", icon: "Lightbulb" },
        { text: "Explicar el tema en voz alta o debatirlo en grupo", type: "auditivo", icon: "Mic" },
        { text: "Resolver ejercicios prácticos y casos reales", type: "kinestesico", icon: "Cpu" },
        { text: "Escuchar grabaciones de las clases", type: "auditivo", icon: "Music" }
      ]
    },
    {
      id: "vak_14_003",
      text: "En una conferencia o clase magistral, ¿qué haces?",
      style: "visual",
      difficulty: 0.70,
      discrimination: 0.52,
      options: [
        { text: "Tomo notas con diagramas y símbolos visuales", type: "visual", icon: "BookOpen" },
        { text: "Escucho atentamente y grabo si es posible", type: "auditivo", icon: "Volume" },
        { text: "Participo activamente haciendo preguntas", type: "kinestesico", icon: "Users" },
        { text: "Hago esquemas rápidos mientras escucho", type: "visual", icon: "Target" }
      ]
    },
    {
      id: "vak_14_004",
      text: "¿Cómo prefieres recibir retroalimentación sobre tu trabajo?",
      style: "visual",
      difficulty: 0.55,
      discrimination: 0.48,
      options: [
        { text: "Con comentarios escritos y correcciones marcadas", type: "visual", icon: "ListOrdered" },
        { text: "En una conversación cara a cara", type: "auditivo", icon: "MessageCircle" },
        { text: "Con ejemplos prácticos de cómo mejorar", type: "kinestesico", icon: "CheckSquare" },
        { text: "En una reunión donde pueda tomar notas", type: "kinestesico", icon: "Lightbulb" }
      ]
    },
    {
      id: "vak_14_005",
      text: "Al planificar un proyecto grande, ¿qué haces primero?",
      style: "visual",
      difficulty: 0.65,
      discrimination: 0.55,
      options: [
        { text: "Crear un diagrama de flujo o mapa conceptual", type: "visual", icon: "Globe" },
        { text: "Discutir el plan con mi equipo en reuniones", type: "auditivo", icon: "Users" },
        { text: "Hacer una lista de tareas y empezar a ejecutar", type: "kinestesico", icon: "Rocket" },
        { text: "Diseñar un cronograma visual en una pizarra", type: "visual", icon: "Calendar" }
      ]
    },
    {
      id: "vak_14_006",
      text: "¿Qué tipo de contenido educativo consumes más?",
      style: "auditivo",
      difficulty: 0.60,
      discrimination: 0.50,
      options: [
        { text: "Videos de YouTube, documentales, infografías", type: "visual", icon: "Video" },
        { text: "Podcasts, audiolibros, conferencias grabadas", type: "auditivo", icon: "Headphones" },
        { text: "Cursos interactivos, tutoriales paso a paso", type: "kinestesico", icon: "Activity" },
        { text: "Charlas TEDx y debates en vivo", type: "auditivo", icon: "Mic" }
      ]
    },
    {
      id: "vak_14_007",
      text: "Cuando aprendes un idioma nuevo, ¿qué método prefieres?",
      style: "visual",
      difficulty: 0.70,
      discrimination: 0.52,
      options: [
        { text: "Apps con imágenes, tarjetas visuales y videos", type: "visual", icon: "Eye" },
        { text: "Escuchar conversaciones y practicar hablando", type: "auditivo", icon: "Mic" },
        { text: "Escribir y practicar con ejercicios interactivos", type: "kinestesico", icon: "Wrench" },
        { text: "Leer libros y artículos en ese idioma", type: "visual", icon: "BookOpen" }
      ]
    },
    {
      id: "vak_14_008",
      text: "En una situación de estrés académico, ¿qué te ayuda más?",
      style: "kinestesico",
      difficulty: 0.50,
      discrimination: 0.48,
      options: [
        { text: "Organizar visualmente mis pendientes en un tablero", type: "visual", icon: "Target" },
        { text: "Hablar con alguien sobre lo que me preocupa", type: "auditivo", icon: "MessageCircle" },
        { text: "Hacer ejercicio o una actividad física", type: "kinestesico", icon: "Zap" },
        { text: "Respirar profundo y caminar para despejarme", type: "kinestesico", icon: "Activity" }
      ]
    },
    {
      id: "vak_14_009",
      text: "¿Cómo defines tu espacio ideal de estudio?",
      style: "visual",
      difficulty: 0.55,
      discrimination: 0.45,
      options: [
        { text: "Limpio, ordenado y con materiales visuales a la vista", type: "visual", icon: "Lightbulb" },
        { text: "Tranquilo, en silencio o con música suave de fondo", type: "auditivo", icon: "Volume" },
        { text: "Con espacio para moverme y cambiar de posición", type: "kinestesico", icon: "Activity" },
        { text: "Con un pizarrón o pared para anotar ideas", type: "visual", icon: "List" }
      ]
    },
    {
      id: "vak_14_010",
      text: "Si pudieras elegir una carrera futura, ¿hacia dónde te inclinas?",
      style: "kinestesico",
      difficulty: 0.60,
      discrimination: 0.50,
      options: [
        { text: "Diseño, arquitectura, artes visuales, tecnología", type: "visual", icon: "Cpu" },
        { text: "Música, derecho, periodismo, psicología, docencia", type: "auditivo", icon: "Mic" },
        { text: "Deportes, ingeniería, medicina, gastronomía", type: "kinestesico", icon: "Rocket" },
        { text: "Investigación, laboratorio, ciencias aplicadas", type: "kinestesico", icon: "Target" }
      ]
    },
    {
      id: "vak_14_011",
      text: "¿Cómo procesas mejor la información durante una clase?",
      style: "auditivo",
      difficulty: 0.70,
      discrimination: 0.55,
      options: [
        { text: "Participando en debates y haciendo preguntas", type: "auditivo", icon: "MessageCircle" },
        { text: "Tomando notas con esquemas y diagramas", type: "visual", icon: "BookOpen" },
        { text: "Aplicando los conceptos en ejercicios prácticos", type: "kinestesico", icon: "Wrench" }
      ]
    },
    {
      id: "vak_14_012",
      text: "¿Cuál es tu estrategia favorita para aprender un tema complejo?",
      style: "auditivo",
      difficulty: 0.65,
      discrimination: 0.52,
      options: [
        { text: "Discutirlo en grupo para entender perspectivas", type: "auditivo", icon: "Users" },
        { text: "Crear mapas mentales con colores y conexiones", type: "visual", icon: "Globe" },
        { text: "Descomponerlo en partes y practicar cada una", type: "kinestesico", icon: "Cpu" }
      ]
    },
    {
      id: "vak_14_013",
      text: "¿Cómo te preparas mejor para una presentación oral?",
      style: "auditivo",
      difficulty: 0.60,
      discrimination: 0.48,
      options: [
        { text: "Practico mi discurso en voz alta varias veces", type: "auditivo", icon: "Mic" },
        { text: "Diseño diapositivas visuales impactantes", type: "visual", icon: "Eye" },
        { text: "Ensayó con gestos y movimientos escénicos", type: "kinestesico", icon: "Activity" }
      ]
    },
    {
      id: "vak_14_014",
      text: "¿Qué enfoque usas para aprender nuevas herramientas tecnológicas?",
      style: "kinestesico",
      difficulty: 0.65,
      discrimination: 0.55,
      options: [
        { text: "Explorando y probando funciones por mi cuenta", type: "kinestesico", icon: "Cpu" },
        { text: "Viendo tutoriales y guías visuales", type: "visual", icon: "Video" },
        { text: "Escuchando explicaciones de expertos", type: "auditivo", icon: "Headphones" }
      ]
    },
    {
      id: "vak_14_015",
      text: "¿Cómo manejas mejor el estrés antes de un examen importante?",
      style: "kinestesico",
      difficulty: 0.60,
      discrimination: 0.50,
      options: [
        { text: "Haciendo ejercicio o saliendo a caminar", type: "kinestesico", icon: "Zap" },
        { text: "Hablando con alguien sobre mis nervios", type: "auditivo", icon: "MessageCircle" },
        { text: "Organizando visualmente mi plan de estudio", type: "visual", icon: "Target" }
      ]
    },
    {
      id: "vak_14_016",
      text: "¿Qué método usas para recordar información teórica densa?",
      style: "kinestesico",
      difficulty: 0.55,
      discrimination: 0.48,
      options: [
        { text: "Relacionándola con movimientos o experiencias", type: "kinestesico", icon: "Activity" },
        { text: "Repitiéndola en voz alta como si enseñara", type: "auditivo", icon: "Mic" },
        { text: "Creando esquemas visuales con ejemplos", type: "visual", icon: "List" }
      ]
    }
  ]
};

/**
 * Obtiene las preguntas según la edad del estudiante
 * @param {number} age - Edad del estudiante
 * @returns {Array} Preguntas adaptadas a la edad, mezcladas aleatoriamente
 */
export function getQuestionsByAge(age) {
  const ageNum = parseInt(age) || 12;
  let groupKey;
  if (ageNum <= 9) groupKey = "6-9";
  else if (ageNum <= 13) groupKey = "10-13";
  else groupKey = "14-17";

  const questions = QUESTIONS_BY_AGE[groupKey];
  return shuffleArray(questions);
}

/**
 * Obtiene el grupo etario como string
 * @param {number} age
 * @returns {string} "6-9" | "10-13" | "14-17"
 */
export function getAgeGroupKey(age) {
  const ageNum = parseInt(age) || 12;
  if (ageNum <= 9) return "6-9";
  if (ageNum <= 13) return "10-13";
  return "14-17";
}

export default QUESTIONS_BY_AGE;
