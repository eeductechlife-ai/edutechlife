import { useMemo } from 'react'

const FALLBACK_BY_MODULE = {
  1: {
    en: {
      noMatch: `I want to help you with that. Let me share what I know about prompt engineering.

Understanding how to craft effective prompts is like learning a new language — it takes practice, but the results are worth it. Here are the key principles:

1. Be specific: instead of "write something," say "write a 200-word article"
2. Assign a role: "act as an expert copywriter" gives much better results
3. Provide examples: showing what you want works better than describing it
4. Iterate: refine your prompt based on what you get back

Try applying these to your question and see how the response improves. Need me to explain any of these in more detail?`
    },
    es: {
      noMatch: `Quiero ayudarte con eso. Déjame compartir lo que sé sobre ingeniería de prompts.

Entender cómo crear prompts efectivos es como aprender un nuevo idioma — requiere práctica, pero los resultados valen la pena. Estos son los principios clave:

1. Sé específico: en lugar de "escribe algo", di "escribe un artículo de 200 palabras"
2. Asigna un rol: "actúa como un copywriter experto" da resultados mucho mejores
3. Proporciona ejemplos: mostrar lo que quieres funciona mejor que describirlo
4. Itera: refina tu prompt según lo que obtengas

Prueba aplicar estos a tu pregunta y verás cómo mejora la respuesta. ¿Necesitas que te explique alguno con más detalle?`
    }
  },
  2: {
    en: {
      noMatch: `I'd like to help with that from our ChatGPT module perspective.

ChatGPT offers several powerful features beyond simple conversation: custom GPTs, Advanced Data Analysis for file processing, DALL-E integration for image generation, and Browse with Bing for web access. Each tool serves a different purpose.

The key to mastering ChatGPT is knowing which tool to use for which task. For example:
• Need to analyze a spreadsheet? Use Advanced Data Analysis
• Want a specialized assistant? Create a custom GPT
• Need current information? Enable web browsing

What specific aspect of ChatGPT are you working with? I can give you more targeted guidance.`
    },
    es: {
      noMatch: `Me gustaría ayudarte con eso desde la perspectiva de nuestro módulo de ChatGPT.

ChatGPT ofrece varias funciones potentes más allá de la conversación simple: GPTs personalizados, Advanced Data Analysis para procesar archivos, integración con DALL-E para generar imágenes y Búsqueda web para información actualizada. Cada herramienta tiene un propósito diferente.

La clave para dominar ChatGPT es saber qué herramienta usar para cada tarea. Por ejemplo:
• ¿Necesitas analizar una hoja de cálculo? Usa Advanced Data Analysis
• ¿Quieres un asistente especializado? Crea un GPT personalizado
• ¿Necesitas información actual? Activa la búsqueda web

¿Con qué aspecto específico de ChatGPT estás trabajando? Puedo darte una guía más precisa.`
    }
  },
  3: {
    en: {
      noMatch: `Let me think about this from our Gemini module perspective.

Gemini stands out for three key capabilities: multimodal input (text, images, audio, video), deep integration with Google Workspace, and Deep Research for thorough investigation with source verification.

A practical way to leverage Gemini's strengths:
• Research: use Deep Research for topics requiring verified sources
• Analysis: upload images, PDFs, or data and ask Gemini to extract insights
• Productivity: use Gemini within Gmail, Docs, and Sheets to save time

What type of task are you trying to accomplish? I can point you to the right approach.`
    },
    es: {
      noMatch: `Déjame pensar en esto desde la perspectiva de nuestro módulo de Gemini.

Gemini destaca por tres capacidades clave: entrada multimodal (texto, imágenes, audio, video), integración profunda con Google Workspace y Deep Research para investigación exhaustiva con verificación de fuentes.

Una forma práctica de aprovechar las fortalezas de Gemini:
• Investigación: usa Deep Research para temas que requieran fuentes verificadas
• Análisis: sube imágenes, PDFs o datos y pide a Gemini que extraiga información
• Productividad: usa Gemini en Gmail, Docs y Sheets para ahorrar tiempo

¿Qué tipo de tarea estás tratando de realizar? Puedo indicarte el enfoque correcto.`
    }
  },
  4: {
    en: {
      noMatch: `I can help you with that from our NotebookLM module perspective.

NotebookLM transforms how you interact with documents. Instead of reading everything, you upload your sources and ask questions — the AI answers are grounded in your specific documents, which eliminates hallucination risks.

Key use cases:
• Research synthesis: upload multiple PDFs and get a unified summary
• Study prep: create an FAQ from your course materials
• Podcast creation: use Audio Overview to turn notes into engaging audio
• Project planning: upload briefs and ask for structured analysis

Are you working with specific documents or exploring what NotebookLM can do?`
    },
    es: {
      noMatch: `Puedo ayudarte con eso desde la perspectiva de nuestro módulo de NotebookLM.

NotebookLM transforma cómo interactúas con documentos. En lugar de leer todo, subes tus fuentes y haces preguntas — las respuestas de la IA se fundamentan en tus documentos específicos, lo que elimina riesgos de alucinación.

Casos de uso clave:
• Síntesis de investigación: sube múltiples PDFs y obtén un resumen unificado
• Preparación de estudio: crea un FAQ desde tus materiales del curso
• Creación de podcast: usa Audio Overview para convertir notas en audio atractivo
• Planificación de proyectos: sube briefs y pide análisis estructurado

¿Estás trabajando con documentos específicos o explorando lo que NotebookLM puede hacer?`
    }
  },
  5: {
    en: {
      noMatch: `I'd like to address that from our AI Ethics module perspective.

Using AI responsibly involves understanding three core areas:

1. Bias awareness: AI models can reflect societal biases in their training data. Always critically evaluate outputs, especially for decisions affecting people.
2. Privacy protection: be mindful of what data you share with AI tools. Avoid uploading sensitive personal or corporate information to public models.
3. Transparency: be honest when using AI-generated content. Disclosure builds trust and credibility.

A practical exercise: the next time you use AI, run it through our ethical checklist — is it fair, transparent, accountable, and privacy-respecting?

Would you like to explore any of these areas more deeply?`
    },
    es: {
      noMatch: `Me gustaría abordar eso desde la perspectiva de nuestro módulo de Ética en IA.

Usar la IA responsablemente implica entender tres áreas fundamentales:

1. Conciencia de sesgos: los modelos de IA pueden reflejar sesgos sociales en sus datos de entrenamiento. Siempre evalúa críticamente los resultados, especialmente en decisiones que afectan a personas.
2. Protección de privacidad: ten cuidado con qué datos compartes con herramientas de IA. Evita subir información personal o corporativa sensible a modelos públicos.
3. Transparencia: sé honesto cuando uses contenido generado por IA. La divulgación genera confianza y credibilidad.

Un ejercicio práctico: la próxima vez que uses IA, pásala por nuestro checklist ético — ¿es justa, transparente, responsable y respeta la privacidad?

¿Te gustaría explorar alguna de estas áreas más a fondo?`
    }
  }
}

const FALLBACK_DEFAULT = {
  en: {
    noMatch: `Thanks for your question. I'm Valerio, your AI coach, and I'm here to help you learn.

Since I'm currently thinking about how to best address your question, let me share some general guidance that applies across all IALab modules:

• Practice is key: the more you interact with AI tools, the more intuitive they become
• Use the resources: each module has videos, PDFs, and interactive labs designed to reinforce concepts
• Ask specific questions: the more precise your question, the better I can help

Could you tell me which module or topic you're working on? That way I can give you a more targeted answer.`
  },
  es: {
    noMatch: `Gracias por tu pregunta. Soy Valerio, tu coach de IA, y estoy aquí para ayudarte a aprender.

Mientras pienso en la mejor forma de abordar tu pregunta, déjame compartirte una guía general que aplica a todos los módulos de IALab:

• La práctica es clave: cuanto más interactúes con herramientas de IA, más intuitivas se vuelven
• Usa los recursos: cada módulo tiene videos, PDFs y laboratorios interactivos diseñados para reforzar conceptos
• Haz preguntas específicas: cuanto más precisa sea tu pregunta, mejor podré ayudarte

¿Podrías decirme en qué módulo o tema estás trabajando? Así puedo darte una respuesta más enfocada.`
  }
}

export const useValerioFallback = (currentModule) => {
  const moduleId = currentModule?.id || 0

  return useMemo(() => {
    const moduleFallback = FALLBACK_BY_MODULE[moduleId] || FALLBACK_DEFAULT
    return moduleFallback
  }, [moduleId])
}

export const smartFallback = (inputText, locale, { currentModule, userLevel }) => {
  const isEn = locale === 'en'
  const moduleId = currentModule?.id || 0
  const moduleFallback = FALLBACK_BY_MODULE[moduleId] || FALLBACK_DEFAULT
  const text = inputText.toLowerCase()
  const moduleTitle = currentModule?.title || (isEn ? 'this module' : 'este módulo')
  const levelLabel = userLevel < 3
    ? (isEn ? 'a beginner' : 'principiante')
    : userLevel < 6
      ? (isEn ? 'an intermediate' : 'intermedio')
      : (isEn ? 'an advanced' : 'avanzado')

  if (text.includes('explic') || text.includes('qu') || text.includes('what') || text.includes('explain') || text.includes('how') || text.includes('cómo')) {
    const base = moduleFallback[locale]?.noMatch || FALLBACK_DEFAULT[locale]?.noMatch
    if (isEn) {
      return `Great question! Let me break this down based on what we cover in "${moduleTitle}".

${base}

Since you're at ${levelLabel} level, I recommend focusing on the fundamentals first, then gradually exploring more complex applications. What specific aspect would you like me to dive deeper into?`
    }
    return `¡Excelente pregunta! Déjame explicarte esto basado en lo que cubrimos en "${moduleTitle}".

${base}

Como estás en nivel ${levelLabel}, te recomiendo enfocarte primero en los fundamentos y luego explorar aplicaciones más complejas gradualmente. ¿Qué aspecto específico te gustaría que profundice?`
  }

  if (isEn) {
    return `I understand your question about "${inputText.slice(0, 80)}". Let me help you with that from the perspective of "${moduleTitle}".

The most effective way to approach this is to connect it with the course material you already have. Think about what you've learned so far and how it applies to your question.

Would you like me to explain a specific concept, provide a practical example, or help you work through the module challenge? I'm here for whatever you need.`
  }
  return `Entiendo tu pregunta sobre "${inputText.slice(0, 80)}". Déjame ayudarte con eso desde la perspectiva de "${moduleTitle}".

La forma más efectiva de abordar esto es conectarlo con el material del curso que ya tienes. Piensa en lo que has aprendido hasta ahora y cómo aplica a tu pregunta.

¿Te gustaría que te explique un concepto específico, te dé un ejemplo práctico, o te ayude con el desafío del módulo? Estoy aquí para lo que necesites.`
}
