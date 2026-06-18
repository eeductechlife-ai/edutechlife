/**
 * Banco de preguntas VAK por grupo etario
 * Adaptadas al nivel de comprensión de cada edad
 */

const QUESTIONS_BY_AGE = {
  "6-9": [
    {
      text: "¿Cómo te gusta más aprender algo nuevo?",
      options: [
        { text: "Viendo videos o dibujos animados", type: "visual", icon: "Eye" },
        { text: "Escuchando a mi profesor o a mis papás", type: "auditivo", icon: "Headphones" },
        { text: "Haciéndolo yo mismo con mis manos", type: "kinestesico", icon: "Activity" }
      ]
    },
    {
      text: "Cuando te cuentan un cuento, ¿qué prefieres?",
      options: [
        { text: "Ver las imágenes del libro", type: "visual", icon: "BookOpen" },
        { text: "Escuchar la historia con atención", type: "auditivo", icon: "Volume" },
        { text: "Actuar el cuento con mis amigos", type: "kinestesico", icon: "Users" }
      ]
    },
    {
      text: "En clase, ¿qué actividad te divierte más?",
      options: [
        { text: "Dibujar y colorear", type: "visual", icon: "Sparkles" },
        { text: "Cantar canciones", type: "auditivo", icon: "Mic" },
        { text: "Jugar con plastilina o bloques", type: "kinestesico", icon: "Cpu" }
      ]
    },
    {
      text: "Si quieres recordar algo importante, ¿qué haces?",
      options: [
        { text: "Lo escribo o hago un dibujo", type: "visual", icon: "ListOrdered" },
        { text: "Lo repito en voz alta", type: "auditivo", icon: "MessageCircle" },
        { text: "Hago una seña o gesto para recordarlo", type: "kinestesico", icon: "Activity" }
      ]
    },
    {
      text: "¿Cómo te gusta más jugar?",
      options: [
        { text: "Con rompecabezas y juegos de mesa", type: "visual", icon: "Globe" },
        { text: "Escuchando música y bailando", type: "auditivo", icon: "Headphones" },
        { text: "Corriendo, saltando y moviéndome", type: "kinestesico", icon: "Zap" }
      ]
    },
    {
      text: "Cuando estás en el parque, ¿qué haces primero?",
      options: [
        { text: "Observar los árboles, flores y pájaros", type: "visual", icon: "Eye" },
        { text: "Escuchar los sonidos de la naturaleza", type: "auditivo", icon: "Volume" },
        { text: "Trepar, correr y jugar en los columpios", type: "kinestesico", icon: "Rocket" }
      ]
    },
    {
      text: "Para aprender los números, ¿cómo te fue más fácil?",
      options: [
        { text: "Viendo las tablas con colores", type: "visual", icon: "CheckSquare" },
        { text: "Escuchando una canción de números", type: "auditivo", icon: "Mic" },
        { text: "Contando objetos con mis dedos", type: "kinestesico", icon: "Wrench" }
      ]
    },
    {
      text: "¿Cómo prefieres que te expliquen una tarea?",
      options: [
        { text: "Que me muestren un ejemplo", type: "visual", icon: "Video" },
        { text: "Que me la expliquen hablando", type: "auditivo", icon: "MessageCircle" },
        { text: "Haciéndola juntos paso a paso", type: "kinestesico", icon: "Users" }
      ]
    },
    {
      text: "Si te regalan algo nuevo, ¿qué haces primero?",
      options: [
        { text: "Miro todos los detalles y colores", type: "visual", icon: "Eye" },
        { text: "Pregunto cómo funciona", type: "auditivo", icon: "Headphones" },
        { text: "Lo toco y empiezo a usarlo", type: "kinestesico", icon: "Activity" }
      ]
    },
    {
      text: "En una fiesta de cumpleaños, ¿qué te gusta más?",
      options: [
        { text: "Ver la decoración y los globos", type: "visual", icon: "Sparkles" },
        { text: "Cantar y escuchar la música", type: "auditivo", icon: "Music" },
        { text: "Bailar y jugar con los demás", type: "kinestesico", icon: "Zap" }
      ]
    }
  ],

  "10-13": [
    {
      text: "Para estudiar un tema nuevo, ¿qué prefieres?",
      options: [
        { text: "Ver videos educativos o documentales", type: "visual", icon: "Video" },
        { text: "Escuchar un podcast o explicación grabada", type: "auditivo", icon: "Headphones" },
        { text: "Hacer un experimento o proyecto práctico", type: "kinestesico", icon: "Wrench" },
        { text: "Leer un libro con muchas ilustraciones", type: "visual", icon: "BookOpen" }
      ]
    },
    {
      text: "En una exposición escolar, ¿cómo te preparas mejor?",
      options: [
        { text: "Creando diapositivas con muchas imágenes", type: "visual", icon: "Eye" },
        { text: "Practicando mi discurso en voz alta", type: "auditivo", icon: "Mic" },
        { text: "Ensayando con gestos y movimientos", type: "kinestesico", icon: "Activity" },
        { text: "Grabando un audio para repasar después", type: "auditivo", icon: "Music" }
      ]
    },
    {
      text: "¿Cómo organizas mejor tus ideas?",
      options: [
        { text: "Con mapas mentales y esquemas de colores", type: "visual", icon: "Globe" },
        { text: "Hablando sobre el tema con alguien", type: "auditivo", icon: "MessageCircle" },
        { text: "Escribiendo y haciendo borradores", type: "kinestesico", icon: "BookOpen" },
        { text: "Usando notas adhesivas de colores", type: "visual", icon: "Lightbulb" }
      ]
    },
    {
      text: "En tu tiempo libre, ¿qué actividad disfrutas más?",
      options: [
        { text: "Ver series, películas o videos", type: "visual", icon: "Video" },
        { text: "Escuchar música o tocar un instrumento", type: "auditivo", icon: "Music" },
        { text: "Hacer deporte o manualidades", type: "kinestesico", icon: "Rocket" },
        { text: "Armar rompecabezas o jugar videojuegos", type: "kinestesico", icon: "Cpu" }
      ]
    },
    {
      text: "Cuando lees un libro, ¿qué te ayuda más a entenderlo?",
      options: [
        { text: "Ver las ilustraciones y diagramas", type: "visual", icon: "BookOpen" },
        { text: "Leerlo en voz alta o que te lo lean", type: "auditivo", icon: "Volume" },
        { text: "Tomar notas o subrayar mientras lees", type: "kinestesico", icon: "ListOrdered" },
        { text: "Hacer un resumen con tus propias palabras", type: "auditivo", icon: "MessageCircle" }
      ]
    },
    {
      text: "¿Cómo recuerdas mejor una información?",
      options: [
        { text: "Visualizando imágenes mentales", type: "visual", icon: "Eye" },
        { text: "Repitiéndola en voz alta o grabándola", type: "auditivo", icon: "Mic" },
        { text: "Escribiéndola varias veces", type: "kinestesico", icon: "Wrench" },
        { text: "Asociándola con un color o dibujo", type: "visual", icon: "Sparkles" }
      ]
    },
    {
      text: "En un trabajo en grupo, ¿qué rol prefieres?",
      options: [
        { text: "Diseñar la presentación visual", type: "visual", icon: "Cpu" },
        { text: "Explicar el tema al resto del grupo", type: "auditivo", icon: "Users" },
        { text: "Armar la maqueta o el material", type: "kinestesico", icon: "Cpu" },
        { text: "Investigar y recopilar información", type: "visual", icon: "List" }
      ]
    },
    {
      text: "¿Qué tipo de clases te gustan más?",
      options: [
        { text: "Las que usan videos, imágenes y diapositivas", type: "visual", icon: "Video" },
        { text: "Las que incluyen debates y discusiones", type: "auditivo", icon: "MessageCircle" },
        { text: "Las que tienen laboratorios y actividades prácticas", type: "kinestesico", icon: "Activity" },
        { text: "Las que permiten trabajar con las manos", type: "kinestesico", icon: "Wrench" }
      ]
    },
    {
      text: "Para aprender un nuevo juego o deporte, ¿cómo lo haces?",
      options: [
        { text: "Viendo a otros jugar primero", type: "visual", icon: "Eye" },
        { text: "Escuchando las reglas y explicaciones", type: "auditivo", icon: "Headphones" },
        { text: "Empezando a jugar y aprendiendo sobre la marcha", type: "kinestesico", icon: "Zap" },
        { text: "Leyendo las instrucciones detenidamente", type: "visual", icon: "BookOpen" }
      ]
    },
    {
      text: "Cuando tienes que memorizar algo, ¿qué técnica usas?",
      options: [
        { text: "Hacer tarjetas con colores y dibujos", type: "visual", icon: "Lightbulb" },
        { text: "Crear una canción o rima", type: "auditivo", icon: "Mic" },
        { text: "Caminar mientras repaso", type: "kinestesico", icon: "Activity" },
        { text: "Explicárselo a un amigo o familiar", type: "auditivo", icon: "Users" }
      ]
    }
  ],

  "14-17": [
    {
      text: "Frente a un concepto académico complejo, ¿cómo prefieres abordarlo?",
      options: [
        { text: "Analizando gráficos, diagramas e infografías", type: "visual", icon: "Eye" },
        { text: "Escuchando una explicación detallada o un podcast", type: "auditivo", icon: "Headphones" },
        { text: "Realizando un experimento o proyecto práctico", type: "kinestesico", icon: "Wrench" },
        { text: "Leyendo textos con ejemplos ilustrados", type: "visual", icon: "BookOpen" }
      ]
    },
    {
      text: "¿Cuál es tu método de estudio más efectivo?",
      options: [
        { text: "Crear resúmenes visuales con colores y esquemas", type: "visual", icon: "Lightbulb" },
        { text: "Explicar el tema en voz alta o debatirlo en grupo", type: "auditivo", icon: "Mic" },
        { text: "Resolver ejercicios prácticos y casos reales", type: "kinestesico", icon: "Cpu" },
        { text: "Escuchar grabaciones de las clases", type: "auditivo", icon: "Music" }
      ]
    },
    {
      text: "En una conferencia o clase magistral, ¿qué haces?",
      options: [
        { text: "Tomo notas con diagramas y símbolos visuales", type: "visual", icon: "BookOpen" },
        { text: "Escucho atentamente y grabo si es posible", type: "auditivo", icon: "Volume" },
        { text: "Participo activamente haciendo preguntas", type: "kinestesico", icon: "Users" },
        { text: "Hago esquemas rápidos mientras escucho", type: "visual", icon: "Target" }
      ]
    },
    {
      text: "¿Cómo prefieres recibir retroalimentación sobre tu trabajo?",
      options: [
        { text: "Con comentarios escritos y correcciones marcadas", type: "visual", icon: "ListOrdered" },
        { text: "En una conversación cara a cara", type: "auditivo", icon: "MessageCircle" },
        { text: "Con ejemplos prácticos de cómo mejorar", type: "kinestesico", icon: "CheckSquare" },
        { text: "En una reunión donde pueda tomar notas", type: "kinestesico", icon: "Lightbulb" }
      ]
    },
    {
      text: "Al planificar un proyecto grande, ¿qué haces primero?",
      options: [
        { text: "Crear un diagrama de flujo o mapa conceptual", type: "visual", icon: "Globe" },
        { text: "Discutir el plan con mi equipo en reuniones", type: "auditivo", icon: "Users" },
        { text: "Hacer una lista de tareas y empezar a ejecutar", type: "kinestesico", icon: "Rocket" },
        { text: "Diseñar un cronograma visual en una pizarra", type: "visual", icon: "Calendar" }
      ]
    },
    {
      text: "¿Qué tipo de contenido educativo consumes más?",
      options: [
        { text: "Videos de YouTube, documentales, infografías", type: "visual", icon: "Video" },
        { text: "Podcasts, audiolibros, conferencias grabadas", type: "auditivo", icon: "Headphones" },
        { text: "Cursos interactivos, tutoriales paso a paso", type: "kinestesico", icon: "Activity" },
        { text: "Charlas TEDx y debates en vivo", type: "auditivo", icon: "Mic" }
      ]
    },
    {
      text: "Cuando aprendes un idioma nuevo, ¿qué método prefieres?",
      options: [
        { text: "Apps con imágenes, tarjetas visuales y videos", type: "visual", icon: "Eye" },
        { text: "Escuchar conversaciones y practicar hablando", type: "auditivo", icon: "Mic" },
        { text: "Escribir y practicar con ejercicios interactivos", type: "kinestesico", icon: "Wrench" },
        { text: "Leer libros y artículos en ese idioma", type: "visual", icon: "BookOpen" }
      ]
    },
    {
      text: "En una situación de estrés académico, ¿qué te ayuda más?",
      options: [
        { text: "Organizar visualmente mis pendientes en un tablero", type: "visual", icon: "Target" },
        { text: "Hablar con alguien sobre lo que me preocupa", type: "auditivo", icon: "MessageCircle" },
        { text: "Hacer ejercicio o una actividad física", type: "kinestesico", icon: "Zap" },
        { text: "Respirar profundo y caminar para despejarme", type: "kinestesico", icon: "Activity" }
      ]
    },
    {
      text: "¿Cómo defines tu espacio ideal de estudio?",
      options: [
        { text: "Limpio, ordenado y con materiales visuales a la vista", type: "visual", icon: "Lightbulb" },
        { text: "Tranquilo, en silencio o con música suave de fondo", type: "auditivo", icon: "Volume" },
        { text: "Con espacio para moverme y cambiar de posición", type: "kinestesico", icon: "Activity" },
        { text: "Con un pizarrón o pared para anotar ideas", type: "visual", icon: "List" }
      ]
    },
    {
      text: "Si pudieras elegir una carrera futura, ¿hacia dónde te inclinas?",
      options: [
        { text: "Diseño, arquitectura, artes visuales, tecnología", type: "visual", icon: "Cpu" },
        { text: "Música, derecho, periodismo, psicología, docencia", type: "auditivo", icon: "Mic" },
        { text: "Deportes, ingeniería, medicina, gastronomía", type: "kinestesico", icon: "Rocket" },
        { text: "Investigación, laboratorio, ciencias aplicadas", type: "kinestesico", icon: "Target" }
      ]
    }
  ]
};

/**
 * Obtiene las preguntas según la edad del estudiante
 * @param {number} age - Edad del estudiante
 * @returns {Array} 10 preguntas adaptadas a la edad
 */
export function getQuestionsByAge(age) {
  const ageNum = parseInt(age) || 12;
  
  if (ageNum <= 9) return QUESTIONS_BY_AGE["6-9"];
  if (ageNum <= 13) return QUESTIONS_BY_AGE["10-13"];
  return QUESTIONS_BY_AGE["14-17"];
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
