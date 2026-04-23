import { useState, useCallback, useEffect } from 'react';

/**
 * useSidebarState - Hook especializado para manejar estado del sidebar
 * 
 * Características:
 * - Estado colapsable/expandible de secciones
 * - Persistencia en localStorage
 * - Animaciones controladas
 * - Responsive state management
 */

export const useSidebarState = (initialState = {}) => {
  // Estado de secciones colapsables
  const [collapsedSections, setCollapsedSections] = useState(() => {
    // Intentar cargar desde localStorage
    try {
      const saved = localStorage.getItem('ialab-sidebar-state');
      return saved ? JSON.parse(saved) : initialState;
    } catch {
      return initialState;
    }
  });

  // Estado responsive
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Detectar mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-colapsar en mobile
  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [isMobile]);

  // Toggle sección
  const toggleSection = useCallback((sectionId) => {
    setCollapsedSections(prev => {
      const newState = {
        ...prev,
        [sectionId]: !prev[sectionId]
      };
      
      // Persistir en localStorage
      try {
        localStorage.setItem('ialab-sidebar-state', JSON.stringify(newState));
      } catch (error) {
        console.warn('No se pudo guardar estado del sidebar:', error);
      }
      
      return newState;
    });
  }, []);

  // Expandir todas las secciones
  const expandAll = useCallback(() => {
    const expandedState = Object.keys(collapsedSections).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {});
    
    setCollapsedSections(expandedState);
    try {
      localStorage.setItem('ialab-sidebar-state', JSON.stringify(expandedState));
    } catch (error) {
      console.warn('No se pudo guardar estado del sidebar:', error);
    }
  }, [collapsedSections]);

  // Colapsar todas las secciones
  const collapseAll = useCallback(() => {
    const collapsedState = Object.keys(collapsedSections).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    
    setCollapsedSections(collapsedState);
    try {
      localStorage.setItem('ialab-sidebar-state', JSON.stringify(collapsedState));
    } catch (error) {
      console.warn('No se pudo guardar estado del sidebar:', error);
    }
  }, [collapsedSections]);

  // Toggle sidebar completo (mobile)
  const toggleSidebar = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  // Reset al estado inicial
  const reset = useCallback(() => {
    setCollapsedSections(initialState);
    try {
      localStorage.removeItem('ialab-sidebar-state');
    } catch (error) {
      console.warn('No se pudo resetear estado del sidebar:', error);
    }
  }, [initialState]);

  // Verificar si una sección está colapsada
  const isSectionCollapsed = useCallback((sectionId) => {
    return collapsedSections[sectionId] ?? false;
  }, [collapsedSections]);

  // Datos para secciones del sidebar
  const getSectionData = useCallback((sectionType) => {
    const sections = {
      videos: {
        id: 'videos',
        title: 'Videos del Módulo',
        icon: 'fa-video-camera',
        items: [
          {
            id: 'video-1',
            title: 'Mastery Framework',
            type: 'video',
            level: 'principiante',
            duration: '12:45',
            popular: true,
            action: 'play'
          },
          {
            id: 'video-2',
            title: 'Contexto Dinámico',
            type: 'video',
            level: 'intermedio',
            duration: '18:20',
            action: 'play'
          },
          {
            id: 'video-3',
            title: 'Chain-of-Thought',
            type: 'video',
            level: 'avanzado',
            duration: '22:10',
            action: 'play'
          },
          {
            id: 'video-4',
            title: 'Zero-Shot Prompting',
            type: 'video',
            level: 'intermedio',
            duration: '15:30',
            action: 'play'
          }
        ]
      },
      recursos: {
        id: 'recursos',
        title: 'Recursos Adicionales',
        icon: 'fa-book',
        items: [
          {
            id: 'recurso-1',
            title: 'Cheat Sheet RTF',
            type: 'pdf',
            size: '2 páginas',
            action: 'download'
          },
          {
            id: 'recurso-2',
            title: 'Ejemplos Prácticos',
            type: 'json',
            size: '15 ejemplos',
            action: 'download'
          },
          {
            id: 'recurso-3',
            title: 'Plantillas Premium',
            type: 'templates',
            size: '8 plantillas',
            popular: true,
            action: 'download'
          },
          {
            id: 'recurso-4',
            title: 'Casos de Estudio',
            type: 'caseStudies',
            size: '5 casos',
            action: 'download'
          }
        ]
      }
    };

    return sections[sectionType] || { id: sectionType, title: 'Sección', items: [] };
  }, []);

  // Datos de módulos para el sidebar
  const getModuleData = useCallback(() => {
    return [
      {
        id: 1,
        title: 'Introducción a IA Generativa',
        duration: '12 min',
        level: 'Principiante',
        icon: 'fa-brain'
      },
      {
        id: 2,
        title: '¿Qué es un Prompt?',
        duration: '15 min',
        level: 'Principiante',
        icon: 'fa-comment-alt'
      },
      {
        id: 3,
        title: 'Estructura de Prompt Efectivo',
        duration: '18 min',
        level: 'Intermedio',
        icon: 'fa-sitemap'
      },
      {
        id: 4,
        title: 'Técnicas de Refinamiento',
        duration: '22 min',
        level: 'Intermedio',
        icon: 'fa-magic'
      },
      {
        id: 5,
        title: 'Práctica Asistida',
        duration: '25 min',
        level: 'Avanzado',
        icon: 'fa-flask'
      }
    ];
  }, []);

  // Datos del curso actual
  const getCourseData = useCallback(() => {
    return {
      duration: '2h 30min',
      level: 'Intermedio',
      videos: '12 videos',
      projects: '3 proyectos',
      students: '1,234',
      rating: '4.8',
      completionRate: '87%'
    };
  }, []);

  return {
    // Estado
    collapsedSections,
    isMobile,
    isCollapsed,
    
    // Acciones
    toggleSection,
    expandAll,
    collapseAll,
    toggleSidebar,
    reset,
    
    // Getters
    isSectionCollapsed,
    getSectionData,
    getModuleData,
    getCourseData,
    
    // Métodos de utilidad
    getProgress: () => {
      const modules = getModuleData();
      const completed = modules.filter(m => m.id <= 2).length; // Ejemplo: primeros 2 completados
      return Math.round((completed / modules.length) * 100);
    },
    
    getCompletedModules: () => [1, 2], // Ejemplo: módulos 1 y 2 completados
    
    isModuleLocked: (moduleId) => {
      // Ejemplo: módulos 4 y 5 bloqueados hasta completar anteriores
      return moduleId >= 4;
    }
  };
};

export default useSidebarState;