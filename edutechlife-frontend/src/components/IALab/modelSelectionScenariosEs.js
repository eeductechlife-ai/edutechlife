// Escenarios de la Guía de selección de modelos.
export const SCENARIOS_ES = [
  {
    id: "customer-service",
    title: "Soporte al cliente 24/7 en tiempo real",
    context:
      "Tu empresa recibe 1000+ preguntas diarias. Necesitas responder en menos de 2 segundos, el costo por respuesta es crítico, y algunos clientes piden no compartir datos con terceros.",
    decision: "¿Qué modelo elegirías y por qué?",
    criteria: [
      { name: "Latencia", importance: "CRÍTICA", reason: "<2s por respuesta" },
      { name: "Costo", importance: "ALTA", reason: "1000+ consultas/día" },
      {
        name: "Privacidad",
        importance: "MEDIA",
        reason: "Algunos clientes exigen privacidad",
      },
      {
        name: "Capacidades",
        importance: "MEDIA",
        reason: "Preguntas rutinarias",
      },
    ],
    options: [
      {
        model: "ChatGPT (API)",
        cost: "Según plan",
        latency: "~800ms",
        privacy: "Cloud",
        note: "Más caro pero confiable",
      },
      {
        model: "Gemini",
        cost: "Según plan",
        latency: "~600ms",
        privacy: "Cloud",
        note: "Más barato, latencia mejor",
      },
      {
        model: "Gemini Notebook",
        cost: "Según plan",
        latency: "~5s",
        privacy: "Cloud",
        note: "Lento, no apto para tiempo real",
      },
      {
        model: "Llama 3.1 (self-hosted)",
        cost: "Según proveedor",
        latency: "~300ms",
        privacy: "On-premises",
        note: "Privacidad total, setup complejo",
      },
    ],
    expert: [
      "Latencia es lo primero: Gemini Notebook queda descartado (5s mínimo).",
      "Entre ChatGPT, Gemini y Llama self-hosted: Gemini gana en latencia (600ms) y costo bajo (costo bajo). ChatGPT es más confiable pero caro.",
      "Si privacidad es exigencia legal: Llama self-hosted en tu propia infraestructura, aunque requiere managing GPUs.",
      "Recomendación: Gemini como opción por defecto (costo-latencia), con ruta a Llama self-hosted si regulación lo exige.",
    ],
  },
  {
    id: "research-analysis",
    title: "Análisis profundo de documentos para research",
    context:
      "Investigas tendencias en 500+ artículos académicos por mes. Necesitas extracción precisa de datos, análisis comparativo, y poder procesar documentos de 50+ páginas. Presupuesto flexible.",
    decision: "¿Qué modelo elegirías y por qué?",
    criteria: [
      { name: "Latencia", importance: "BAJA", reason: "Puede tomar minutos" },
      {
        name: "Costo",
        importance: "MEDIA",
        reason: "500+ docs, pero presupuesto existe",
      },
      {
        name: "Privacidad",
        importance: "BAJA",
        reason: "Documentos públicos o internos sensibles?",
      },
      {
        name: "Capacidades",
        importance: "CRÍTICA",
        reason: "Análisis profundo, extracción precisa",
      },
    ],
    options: [
      {
        model: "ChatGPT",
        cost: "Según plan",
        latency: "2-5s",
        privacy: "Cloud",
        note: "Mejor razonamiento, preciso",
      },
      {
        model: "Gemini Advanced",
        cost: "Según plan",
        latency: "1-2s",
        privacy: "Cloud",
        note: "Rápido, pero menos profundo",
      },
      {
        model: "Gemini Notebook",
        cost: "Según plan",
        latency: "~2min/doc",
        privacy: "Cloud",
        note: "Hecho para esto: análisis + audio overviews",
      },
      {
        model: "Claude (via API)",
        cost: "Según plan",
        latency: "2-4s",
        privacy: "Cloud",
        note: "Bueno en análisis largo",
      },
    ],
    expert: [
      "Gemini Notebook está diseñado exactamente para esto: toma un documento largo y genera resumen + audio + insights automáticamente.",
      "Si necesitas extracción de datos estructurados: Claude o ChatGPT son opciones sólidas (verifica siempre). Si solo necesitas resumen: Gemini Notebook es la opción clara.",
      "Costo: depende del plan y del volumen; compara las tarifas vigentes antes de decidir.",
      "Recomendación: Gemini Notebook como flujo principal (resumen + audio para investigadores), con opción manual a Claude si necesitas datos estructurados en un doc.",
    ],
  },
  {
    id: "personalized-learning",
    title: "Sistema de tutoría personalizado en tiempo real",
    context:
      "Educador usa IA para dar feedback personalizado a 30 estudiantes. Cada sesión dura 15 min, el modelo debe recordar el contexto del estudiante (errores previos, ritmo), y los datos de estudiantes no pueden salir de tu servidor.",
    decision: "¿Qué modelo elegirías y por qué?",
    criteria: [
      {
        name: "Latencia",
        importance: "ALTA",
        reason: "Sesión en vivo, feedback inmediato",
      },
      {
        name: "Costo",
        importance: "MEDIA",
        reason: "30 estudiantes × 15 min/semana",
      },
      {
        name: "Privacidad",
        importance: "CRÍTICA",
        reason: "Datos sensibles de menores",
      },
      {
        name: "Capacidades",
        importance: "ALTA",
        reason: "Personalización y continuidad",
      },
    ],
    options: [
      {
        model: "ChatGPT (API)",
        cost: "Según uso",
        latency: "~800ms",
        privacy: "Cloud",
        note: "No cumple privacidad (datos a OpenAI)",
      },
      {
        model: "Gemini Advanced",
        cost: "Según plan",
        latency: "~600ms",
        privacy: "Cloud",
        note: "Igual restricción de privacidad",
      },
      {
        model: "Llama 2/3.1 (self-hosted)",
        cost: "Según proveedor",
        latency: "~300-500ms",
        privacy: "On-premises",
        note: "Cumple privacidad, latencia buena",
      },
      {
        model: "Mistral 7B (self-hosted)",
        cost: "Según proveedor",
        latency: "~200-300ms",
        privacy: "On-premises",
        note: "Más rápido, menos contexto",
      },
    ],
    expert: [
      "Privacidad es no-negociable: cualquier cloud (ChatGPT, Gemini, Gemini Notebook) viola reglamentos de protección de menores en la mayoría de países.",
      "Opción obligatoria: self-hosted (Llama o Mistral) en tu infraestructura propia.",
      "Entre Llama y Mistral: Llama es mejor para tareas complejas (más contexto), Mistral es más rápido y usa menos GPU (mejor costo).",
      "Recomendación: Mistral 7B self-hosted (equilibrio costo-latencia-privacidad), con evaluación a Llama 13B si necesitas mejor comprensión de contexto.",
    ],
  },
  {
    id: "bulk-content",
    title: "Generación de contenido en lotes: 1000+ textos/mes",
    context:
      "Generas descripciones de productos, emails, posts de redes sociales. Volumen alto, calidad media-alta, cambios frecuentes en tono/estilo. Costo es muy importante.",
    decision: "¿Qué modelo elegirías y por qué?",
    criteria: [
      {
        name: "Latencia",
        importance: "BAJA",
        reason: "Batch, no en tiempo real",
      },
      {
        name: "Costo",
        importance: "CRÍTICA",
        reason: "1000+ textos/mes, presupuesto limitado",
      },
      {
        name: "Privacidad",
        importance: "BAJA",
        reason: "Contenido público, no sensible",
      },
      {
        name: "Capacidades",
        importance: "MEDIA",
        reason: "Generación de texto, versatilidad",
      },
    ],
    options: [
      {
        model: "ChatGPT",
        cost: "Según uso",
        latency: "Batch OK",
        privacy: "Cloud",
        note: "Mejor calidad, más caro",
      },
      {
        model: "Gemini",
        cost: "Según plan",
        latency: "Batch OK",
        privacy: "Cloud",
        note: "Más barato, buena calidad",
      },
      {
        model: "Llama 3.1 70B (self-hosted)",
        cost: "Según proveedor",
        latency: "Batch OK",
        privacy: "On-premises",
        note: "Caro en compute, no rentable",
      },
      {
        model: "Open-source local (Mistral/Zephyr)",
        cost: "Según proveedor",
        latency: "Batch OK",
        privacy: "On-premises",
        note: "Muy barato, calidad media",
      },
    ],
    expert: [
      "Volumen alto + costo crítico → Gemini gana (0.075/1M vs 0.50/1M de ChatGPT es 6-7x más barato).",
      "Self-hosted para lotes no es rentable: el costo de GPU rental por horas supera rápidamente a la API cloud.",
      "Calidad: Gemini es suficiente para descripción de productos/emails. Si necesitas mejor calidad, costo adicional de ChatGPT vale la pena solo si margen de producto lo permite.",
      "Recomendación: Gemini API con lotes (batch procesamiento es más barato aún), y A/B testing contra ChatGPT solo en casos de alta conversión.",
    ],
  },
];
