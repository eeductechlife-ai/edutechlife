const modulesData = {
  1: {
    id: 1,
    title: 'Ingeniería de Prompts',
    description: 'Domina el arte de comunicarte con la IA a nivel experto.',
    duration: '4h 30min',
    level: 'Avanzado',
    videos: 12,
    projects: 3,
    topics: ['Mastery Framework', 'Contexto Dinámico', 'Zero-Shot Prompting', 'Chain-of-Thought'],
    challenge: 'Diseña un prompt que obligue a la IA a debatir la ética de su propia existencia.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    materials: [
      { name: 'Guía de Ingeniería de Prompts', type: 'pdf', url: '/materials/modulo1-guia.pdf' },
      { name: 'Template MasterPrompt', type: 'md', url: '/materials/modulo1-template.md' },
      { name: 'Ejercicios Prácticos', type: 'pdf', url: '/materials/modulo1-ejercicios.pdf' }
    ],
    resources: [
      { title: 'Documentación Oficial', url: 'https://platform.openai.com/docs/guides/prompt-engineering' },
      { title: 'Curso Avanzado', url: 'https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/' }
    ]
  },
  2: {
    id: 2,
    title: 'Potencia ChatGPT',
    description: 'Desbloquea todo el potencial de los modelos GPT con técnicas avanzadas.',
    duration: '5h 00min',
    level: 'Avanzado',
    videos: 15,
    projects: 4,
    topics: ['Análisis Predictivo', 'GPTs Personalizados', 'Function Calling', 'System Prompts'],
    challenge: 'Estructura un GPT para análisis de mercados cuánticos.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    materials: [
      { name: 'Guía ChatGPT Avanzado', type: 'pdf', url: '/materials/modulo2-guia.pdf' },
      { name: 'Template GPTs', type: 'json', url: '/materials/modulo2-template.json' }
    ]
  },
  3: {
    id: 3,
    title: 'Rastreo Profundo',
    description: 'Técnicas de investigación profunda con IA para resultados de élite.',
    duration: '3h 45min',
    level: 'Intermedio',
    videos: 10,
    projects: 2,
    topics: ['Razonamiento Multimodal', 'Grounding Real-Time', 'Deep Research', 'Fact-Checking IA'],
    challenge: 'Genera una comparativa técnica de latencia entre arquitecturas IA.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    materials: [
      { name: 'Guía de Investigación IA', type: 'pdf', url: '/materials/modulo3-guia.pdf' }
    ]
  },
  4: {
    id: 4,
    title: 'Inmersión NotebookLM',
    description: 'Convierte cualquier documento en conocimiento accionable con IA.',
    duration: '4h 00min',
    level: 'Intermedio',
    videos: 8,
    projects: 3,
    topics: ['Curaduría de Fuentes', 'Síntesis de Conocimiento', 'Audio Overviews', 'Gestión Documental'],
    challenge: 'Genera un podcast analizando 5 papers sobre neuro-plasticidad.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    materials: [
      { name: 'Guía NotebookLM', type: 'pdf', url: '/materials/modulo4-guia.pdf' },
      { name: 'Template Podcast', type: 'md', url: '/materials/modulo4-template.md' }
    ]
  },
  5: {
    id: 5,
    title: 'Proyecto Disruptivo',
    description: 'Aplica todo lo aprendido en un proyecto de impacto real.',
    duration: '6h 00min',
    level: 'Experto',
    videos: 6,
    projects: 5,
    topics: ['Integración Total', 'MVP Inteligente', 'Pitch Deck IA', 'Roadmap Estratégico'],
    challenge: 'Propón una automatización integral para una industria local de alto nivel.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    materials: [
      { name: 'Plantilla Proyecto Final', type: 'pdf', url: '/materials/modulo5-plantilla.pdf' },
      { name: 'Guía Pitch Deck', type: 'pptx', url: '/materials/modulo5-pitch.pptx' }
    ]
  }
};

const modulesList = [
  { id: 1, title: 'Ingeniería de Prompts', description: 'Domina el arte de comunicarte con la IA a nivel experto.', level: 'Avanzado' },
  { id: 2, title: 'Potencia ChatGPT', description: 'Desbloquea todo el potencial de los modelos GPT con técnicas avanzadas.', level: 'Avanzado' },
  { id: 3, title: 'Rastreo Profundo', description: 'Técnicas de investigación profunda con IA para resultados de élite.', level: 'Intermedio' },
  { id: 4, title: 'Inmersión NotebookLM', description: 'Convierte cualquier documento en conocimiento accionable con IA.', level: 'Intermedio' },
  { id: 5, title: 'Proyecto Disruptivo', description: 'Aplica todo lo aprendido en un proyecto de impacto real.', level: 'Experto' }
];

module.exports = { modulesData, modulesList };
