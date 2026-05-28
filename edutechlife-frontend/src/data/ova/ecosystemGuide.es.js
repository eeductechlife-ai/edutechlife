export const infographicData = {
  header: { title: "Dominando el Ecosistema ChatGPT", subtitle: "De la Teoría a la Acción Profesional" },
  sections: [
    {
      id: "evolution", title: "Evolución del Motor de IA (Modelos GPT)", icon: "TrendingUp", color: "border-blue-500",
      content: "ChatGPT se convirtió en la aplicación de más rápido crecimiento en la historia tras su lanzamiento en noviembre de 2022, alcanzando 100 Millones de Usuarios en 2 meses.",
      details: [
        { title: "GPT-4o", date: "Mayo 2024", text: "Multimodal omni (texto, imagen, audio).", extendedText: "Este modelo rompió las barreras de latencia. Permite interacciones de voz en tiempo real sin los retrasos típicos, puede 'ver' a través de la cámara de un smartphone y analizar el entorno instantáneamente, y procesa audio de forma nativa en lugar de convertirlo previamente a texto." },
        { title: "GPT-5", date: "Agosto 2025", text: "Sistema optimizado, drástica reducción de alucinaciones.", extendedText: "Un salto cualitativo hacia la fiabilidad empresarial. Se enfoca en flujos de trabajo orientados a agentes (Agentic Workflows), donde la IA puede interactuar de manera más segura con bases de datos externas y cometer significativamente menos errores lógicos o inventar datos." },
        { title: "GPT-5.5", date: "Abril 2026", text: "Razonamiento autónomo y planificación paso a paso.", extendedText: "Representa el modelo más inteligente de la década. Puede recibir un objetivo complejo (ej. 'Crea una campaña de marketing completa'), desglosarlo en tareas pequeñas, ejecutar el código necesario, corregir sus propios errores y usar múltiples herramientas web sin intervención humana constante." }
      ]
    },
    {
      id: "modes", title: "Modos de Operación", icon: "Cpu", color: "border-teal-500",
      content: "La IA adapta su capacidad de procesamiento y tiempo de respuesta según la complejidad de la tarea.",
      details: [
        { title: "Modo Fast (Rápido)", text: "Respuestas instantáneas a tareas simples y directas.", extendedText: "Ideal para la productividad diaria: resumir cadenas de correos largos, generar ideas rápidas de contenido (brainstorming), redactar respuestas a clientes o corregir la gramática de un texto en segundos. Prioriza la velocidad sobre el análisis profundo." },
        { title: "Modo Thinking (Profundo)", text: "Análisis detallados y decisiones estratégicas. Requiere tiempo de procesamiento.", extendedText: "La IA invierte tiempo en 'pensar' antes de escribir. Es esencial para resolver bugs de código complejos, diseñar arquitecturas de software, escribir ensayos académicos analíticos, o modelar escenarios financieros donde un error superficial sería costoso." }
      ]
    },
    {
      id: "tools", title: "La Caja de Herramientas Integrada", icon: "Wrench", color: "border-orange-500",
      content: "ChatGPT evolucionó de ser un simple chatbot a convertirse en un entorno de trabajo digital (Workspace) completo.",
      details: [
        { title: "Búsqueda Web e Intérprete de Código", text: "Acceso a datos en vivo y ejecución de scripts en Python.", icon: "Search", extendedText: "Puedes subir un archivo Excel crudo y pedirle que limpie los datos, haga análisis estadísticos (como regresiones) y genere gráficos interactivos. La IA escribe el código Python en segundo plano, lo ejecuta y te entrega el resultado visual." },
        { title: "Canvas: Edición Colaborativa", text: "Un entorno de trabajo conjunto en una ventana lateral.", icon: "Layout", extendedText: "En lugar de regenerar todo un texto en el chat, Canvas te abre un documento lateral. Puedes seleccionar un solo párrafo y pedir 'haz este párrafo más profesional', o editar el código directamente mientras la IA revisa tus cambios. Ideal para proyectos largos." },
        { title: "Memoria y Proyectos", text: "Recuerda preferencias y organiza contextos complejos bajo 'Proyectos'.", icon: "Database", extendedText: "Si configuras un 'Proyecto' para Edutechlife, puedes subir el manual de marca y directrices. A partir de ahí, cualquier chat dentro de ese proyecto recordará usar tus colores, tono de voz institucional y formatos preferidos sin tener que repetirlo." }
      ]
    },
    {
      id: "automation", title: "Conectividad y Automatización", icon: "Share2", color: "border-purple-500",
      content: "El verdadero poder llega al conectar tu IA con el mundo exterior y tus aplicaciones del día a día.",
      details: [
        { title: "Zapier", text: "Automatizaciones Simples e intuitivas.", icon: "Zap", extendedText: "Excelente para principiantes. Ejemplo: 'Cada vez que reciba un correo etiquetado como Factura en Gmail, usa la IA para extraer el monto y añádelo automáticamente a una fila en Google Sheets'." },
        { title: "Make (Integromat)", text: "Flujos Complejos y potentes (1,000 operaciones/mes gratis).", icon: "Settings", extendedText: "Permite bifurcaciones lógicas avanzadas. Ejemplo: 'Si entra un lead por Facebook, analiza su mensaje con IA. Si está enojado, notifica en Slack urgente. Si es una duda común, envía un email automático usando el manual de la empresa'." },
        { title: "Integración Nativa: Workspace y Slack", text: "Capacidad de actuar directamente sobre tus plataformas corporativas.", icon: "MessageSquare", extendedText: "La IA ya no vive solo en su app. Puedes usar @ChatGPT en Slack para que te resuma un hilo de 50 mensajes de tus compañeros mientras estabas en una reunión, ahorrando minutos vitales de lectura." }
      ]
    },
    {
      id: "prompt", title: "El Arte del Prompt Estratégico", icon: "Target", color: "border-rose-500",
      content: "La calidad de la respuesta de la IA depende directamente de la ingeniería de la instrucción (Prompt Engineering).",
      details: [
        { title: "Los 6 Elementos del Prompt Perfecto", text: "Rol, Contexto, Tarea, Formato, Restricciones y Ejemplos.", extendedText: "1. Rol: 'Actúa como un experto en e-learning'. 2. Contexto: 'Doy clases a universitarios'. 3. Tarea: 'Crea un temario'. 4. Formato: 'En tabla Markdown'. 5. Restricciones: 'Máximo 4 módulos'. 6. Ejemplos (Few-shot): 'Aquí tienes un ejemplo de cómo me gusta el estilo...'." },
        { title: "Chain of Thought (Cadena de Pensamiento)", text: "Forzar a la IA a desglosar su razonamiento mejora su precisión.", icon: "Brain", extendedText: "Si añades la frase 'Piensa paso a paso y explica tu lógica antes de dar la respuesta final', el rendimiento de la IA en matemáticas o toma de decisiones sube drásticamente, ya que el modelo se da espacio para procesar antes de predecir la última palabra." },
        { title: "Gestión de Alucinaciones", text: "La advertencia crítica: La IA puede generar datos falsos con gran elocuencia.", icon: "AlertTriangle", extendedText: "Los modelos lingüísticos buscan predecir la siguiente palabra de forma probable, no buscar la 'verdad'. Es imperativo usar la herramienta de 'Búsqueda Web' si necesitas hechos recientes, y siempre verificar fechas, cifras y citas bibliográficas en fuentes primarias." }
      ]
    }
  ]
};
