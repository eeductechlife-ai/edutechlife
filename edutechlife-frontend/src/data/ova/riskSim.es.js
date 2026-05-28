export const gameData = [
  {
    q: "Un sistema de IA genera una lista de 'Personajes Históricos Importantes' y todos son hombres europeos. ¿Qué sesgo identificas?",
    opts: ["Sesgo de datos históricos y representación.", "Sesgo de automatización.", "Error de red de internet."],
    correct: 0,
    feedback: "¡Correcto! Refleja la falta de diversidad y el sesgo cultural en los datos de entrenamiento."
  },
  {
    q: "Estás usando IA para un diagnóstico y arroja un resultado que contradice tu criterio profesional. ¿Cómo actúas?",
    opts: ["Acepto la IA porque es más inteligente que yo.", "Cuestiono el sesgo de automatización y verifico con expertos.", "Dejo que la IA decida la medicación."],
    correct: 1,
    feedback: "¡Excelente! No debes delegar la responsabilidad moral a un sistema que no puede asumirla."
  },
  {
    q: "Quieres que la IA escriba un cuento sobre liderazgo. Para evitar estereotipos de género, ¿qué haces?",
    opts: ["Borro la aplicación.", "Genero el cuento y confío en que la IA será justa.", "Reformulo el prompt pidiendo explícitamente inclusión y equidad de género."],
    correct: 2,
    feedback: "¡Muy bien! Instruir explícitamente a la IA es una gran estrategia de mitigación."
  }
];

export const accordionData = [
  { id: 'acc1', title: 'Sesgo Geográfico y Cultural', icon: '🌍', content: 'Los modelos entrenados principalmente con datos del Norte Global generan respuestas con marcos culturales ajenos. Ejemplo: Ejemplos sobre historia, política o cultura que ignoran perspectivas latinoamericanas o africanas.' },
  { id: 'acc2', title: 'Sesgo de Representación y Género (Experimento Stanford)', icon: '👥', content: 'En 2023, investigadores pidieron a modelos de lenguaje: "Escribe la historia de un CEO exitoso". En el 78% de los casos, generó un hombre. Al pedir historias de "enfermeras", el 91% fueron mujeres. Esto muestra cómo los sesgos históricos se replican automáticamente.' },
  { id: 'acc3', title: 'Sesgo de Automatización', icon: '🤖', content: 'Las personas tienden a confiar más en las respuestas de una IA que en las de un humano. Ejemplo: Aceptar sin cuestionar un diagnóstico o recomendación de IA aunque contradiga el criterio experto.' }
];

export const mitigations = [
  { title: 'Pensamiento Crítico', icon: '💡', desc: 'No aceptes ninguna respuesta de IA sin evaluar su coherencia, verificar datos clave y comparar con otras fuentes. Pregúntate: ¿De dónde viene esta afirmación?' },
  { title: 'Diversificar Fuentes', icon: '📚', desc: 'Complementa las respuestas de la IA con fuentes académicas, perspectivas de autores latinoamericanos y datos locales. La IA tiene un sesgo hacia el mundo anglosajón.' },
  { title: 'Asumir Responsabilidad', icon: '🛡️', desc: 'Cualquier contenido que publiques o entregues generado con IA es tu responsabilidad. Si contiene sesgos o errores, eres tú quien los respalda.' }
];
