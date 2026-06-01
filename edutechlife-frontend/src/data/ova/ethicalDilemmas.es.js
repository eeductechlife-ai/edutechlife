export const dilemmas = [
  {
    id: 1,
    scenario: "Eres estudiante de medicina y usas una IA para redactar un diagnóstico. La IA sugiere un tratamiento que no conoces. ¿Qué haces?",
    opts: [
      "Copio el diagnóstico y lo presento como mío, la IA nunca se equivoca.",
      "Verifico el tratamiento con fuentes médicas actualizadas y consulto a mi profesor antes de decidir.",
      "Modifico ligeramente el texto para que no parezca de IA y lo entrego."
    ],
    correct: 1,
    feedback: "La IA es una herramienta de apoyo, no un sustituto del criterio profesional. Verificar fuentes es tu responsabilidad ética."
  },
  {
    id: 2,
    scenario: "Un compañero te pide que uses IA para generar un ensayo académico completo que él presentará como propio. ¿Cómo respondes?",
    opts: [
      "Le ayudo, total, todos usan IA hoy en día.",
      "Le explico que el plagio académico aplica también a contenido generado por IA y le ofrezco enseñarle a usarla como herramienta de apoyo.",
      "Lo hago pero le pido que no se lo cuente a nadie."
    ],
    correct: 1,
    feedback: "Usar IA para generar contenido que se presenta como propio es plagio. La IA debe ser una herramienta de aprendizaje, no un atajo para engañar."
  },
  {
    id: 3,
    scenario: "Una empresa de reclutamiento usa un algoritmo de IA para filtrar currículums. El sistema rechaza sistemáticamente a mujeres para puestos técnicos. ¿Cuál es el problema ético principal?",
    opts: [
      "No hay problema, el algoritmo solo sigue datos históricos.",
      "El algoritmo perpetúa sesgos de género históricos y debe ser auditado y corregido para garantizar equidad.",
      "El problema es que las mujeres no aplican a esos puestos."
    ],
    correct: 1,
    feedback: "Los algoritmos pueden perpetuar y amplificar sesgos históricos. Es responsabilidad ética auditar los sistemas de IA para garantizar equidad."
  },
  {
    id: 4,
    scenario: "Estás desarrollando una app educativa con IA para niños. ¿Qué consideración ética es PRIORITARIA?",
    opts: [
      "Que la app sea visualmente atractiva y tenga muchos colores.",
      "Garantizar la privacidad de los datos infantiles, transparencia en cómo funciona la IA y supervisión parental.",
      "Que la IA responda lo más rápido posible."
    ],
    correct: 1,
    feedback: "Cuando se trabaja con menores, la privacidad, seguridad y transparencia son obligaciones éticas y legales prioritarias."
  },
  {
    id: 5,
    scenario: "Tu jefe te pide que implementes un chatbot de IA para atención al cliente, pero te dice: 'No les digas a los clientes que están hablando con una IA'. ¿Qué haces?",
    opts: [
      "Lo implemento sin decir nada, es lo que pide el jefe.",
      "Explicale que ocultar que es una IA viola principios de transparencia y confianza, y propongo informar claramente al inicio de la interacción.",
      "Lo implemento pero se lo cuento a un compañero en confianza."
    ],
    correct: 1,
    feedback: "La transparencia es un principio ético fundamental en IA. Los usuarios tienen derecho a saber si interactúan con un humano o una máquina."
  },
  {
    id: 6,
    scenario: "Usas IA para generar reseñas falsas de tu producto y mejorar tu reputación online. ¿Es ético?",
    opts: [
      "Sí, todas las empresas lo hacen para competir.",
      "No, generar reseñas falsas es engañoso, viola principios de honestidad y puede tener consecuencias legales.",
      "Solo un par de reseñas falsas no hacen daño a nadie."
    ],
    correct: 1,
    feedback: "Generar contenido falso o engañoso viola principios éticos de transparencia y honestidad, además de ser ilegal en muchos países."
  }
];

export const accordionData = [
  { id: "ac1", title: "Principio de Transparencia", icon: "🔍", content: "Los usuarios deben saber cuándo están interactuando con una IA. Ocultar la naturaleza de la interacción erosiona la confianza y viola principios éticos fundamentales." },
  { id: "ac2", title: "Responsabilidad Humana", icon: "👤", content: "Siempre debe haber un humano responsable de las decisiones tomadas con ayuda de IA. No puedes delegar la responsabilidad moral a una máquina." },
  { id: "ac3", title: "Equidad y No Discriminación", icon: "⚖️", content: "Los sistemas de IA deben ser auditados regularmente para detectar y corregir sesgos que puedan discriminar por género, raza, edad u otras características." }
];
