export const CONTENT_TYPES = [
  { id: 'academico', label: 'Académico', icon: '📚', desc: 'Papers, tesis, artículos de investigación' },
  { id: 'tecnico', label: 'Técnico', icon: '⚙️', desc: 'Manuales, guías, documentación técnica' },
  { id: 'creativo', label: 'Creativo', icon: '🎨', desc: 'Guías de diseño, marketing, contenido' },
  { id: 'mixto', label: 'Mixto', icon: '📦', desc: 'Combinación de varios tipos' }
];

export const GOALS = [
  { id: 'estudiar', label: 'Estudiar', icon: '📖', desc: 'Repasar y comprender conceptos clave' },
  { id: 'resumir', label: 'Resumir', icon: '📝', desc: 'Extraer lo esencial de documentos largos' },
  { id: 'presentar', label: 'Presentar', icon: '🎤', desc: 'Preparar material para una exposición' },
  { id: 'explorar', label: 'Explorar', icon: '🔍', desc: 'Investigación inicial sobre un tema nuevo' }
];

export const DOC_COUNTS = [
  { id: 'pocos', label: '1-2 docs', icon: '📄', desc: 'Pocos documentos, muy enfocados' },
  { id: 'medio', label: '3-5 docs', icon: '📚', desc: 'Cantidad ideal para un buen debate' },
  { id: 'varios', label: '6-10 docs', icon: '📚📚', desc: 'Visión amplia del tema' },
  { id: 'muchos', label: '10+ docs', icon: '📚📚📚', desc: 'Investigación exhaustiva' }
];

export const SOURCE_TIPS = {
  academico: 'Usa papers revisados por pares, tesis y artículos académicos. La calidad de las fuentes define la profundidad del análisis.',
  tecnico: 'Manuales oficiales y documentación técnica generan podcasts precisos. Incluye ejemplos prácticos.',
  creativo: 'Guías de estilo, briefs y casos de éxito. La IA captura bien el tono creativo si las fuentes son descriptivas.',
  mixto: 'Agrupa tus fuentes por tema antes de subirlas. NotebookLM cruza información entre todas, así que la organización importa.'
};

export const GOAL_TIPS = {
  estudiar: 'Escucha el podcast primero para contexto general, luego lee los documentos para profundizar. El audio te da el mapa mental.',
  resumir: 'Selecciona las fuentes más importantes. El Audio Overview será un gran resumen conversacional, pero complementa con notas escritas.',
  presentar: 'Genera el podcast para obtener una narrativa coherente. Úsalo como inspiración para estructurar tu presentación.',
  explorar: 'Sube 5-10 fuentes diversas. El debate entre los presentadores te dará perspectivas que no habías considerado.'
};

export const DOC_TIPS = {
  pocos: 'Con pocos documentos, el podcast será muy enfocado. Ideal para repasar conceptos específicos antes de un examen.',
  medio: 'Cantidad ideal. Los presentadores tendrán suficiente material para generar un debate interesante con profundidad.',
  varios: 'Buena variedad de perspectivas. El podcast será más amplio pero menos profundo en cada tema.',
  muchos: 'El podcast cubrirá muchas ideas pero cada una superficialmente. Mejor divide en grupos temáticos y genera varios podcasts.'
};

export const ESTIMATED_TIME = { pocos: '3-5 minutos', medio: '5-10 minutos', varios: '10-15 minutos', muchos: '10-15 minutos' };

export const IDEAL_SOURCES = { pocos: '2-3 fuentes', medio: '3-5 fuentes', varios: '6-8 fuentes', muchos: '6-8 fuentes' };

export const FORMATS = { academico: 'PDF, Google Docs', tecnico: 'PDF, TXT, URLs', creativo: 'PDF, Google Docs, URLs', mixto: 'PDF, Google Docs, TXT, URLs' };

export const CHECKLIST_ITEMS = [
  { id: 'select', label: 'Seleccioné y organicé mis mejores fuentes' },
  { id: 'create', label: 'Creé un notebook nuevo en NotebookLM' },
  { id: 'upload', label: 'Subí todas mis fuentes al notebook' },
  { id: 'generate', label: 'Inicié la generación del Audio Overview' },
  { id: 'listen', label: 'Escuché el resultado completo' },
  { id: 'notes', label: 'Tomé notas de los puntos clave' }
];
