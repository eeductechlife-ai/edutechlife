export const SECTION_DATA = {
  videos: {
    id: 'videos',
    title: 'Videos del Módulo',
    items: [
      { id: 'video-1', title: 'Introducción al tema', duration: '12:30', completed: false },
      { id: 'video-2', title: 'Conceptos Avanzados', duration: '15:45', completed: false },
      { id: 'video-3', title: 'Ejemplo Práctico', duration: '8:20', completed: false },
      { id: 'video-4', title: 'Resumen', duration: '5:10', completed: false },
    ],
  },
  recursos: {
    id: 'recursos',
    title: 'Recursos Adicionales',
    items: [
      { id: 'recurso-1', title: 'Cheat Sheet', type: 'pdf', completed: false },
      { id: 'recurso-2', title: 'Ejemplos Prácticos', type: 'code', completed: false },
      { id: 'recurso-3', title: 'Plantillas Premium', type: 'doc', completed: false },
      { id: 'recurso-4', title: 'Casos de Estudio', type: 'pdf', completed: false },
    ],
  },
};

export const MODULE_DATA = [
  { id: 1, title: 'Introducción a IA Generativa', level: 'Principiante', progress: 100, locked: false },
  { id: 2, title: 'Fundamentos de Machine Learning', level: 'Principiante', progress: 100, locked: false },
  { id: 3, title: 'Redes Neuronales', level: 'Intermedio', progress: 30, locked: true },
  { id: 4, title: 'Deep Learning Avanzado', level: 'Avanzado', progress: 0, locked: true },
  { id: 5, title: 'Proyecto Final', level: 'Avanzado', progress: 0, locked: true },
];

export const COURSE_DATA = {
  duration: '2h',
  level: 'Intermedio',
  rating: '4.8',
  videos: 42,
  proyectos: 5,
};
