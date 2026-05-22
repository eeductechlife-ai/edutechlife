import { useState, useEffect, useCallback, useRef } from 'react';
import { useIALabStore } from '../../store/ialabStore';

const SECTION_DATA = {
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

const MODULE_DATA = [
  { id: 1, title: 'Introducción a IA Generativa', level: 'Principiante', progress: 100, locked: false },
  { id: 2, title: 'Fundamentos de Machine Learning', level: 'Principiante', progress: 100, locked: false },
  { id: 3, title: 'Redes Neuronales', level: 'Intermedio', progress: 30, locked: true },
  { id: 4, title: 'Deep Learning Avanzado', level: 'Avanzado', progress: 0, locked: true },
  { id: 5, title: 'Proyecto Final', level: 'Avanzado', progress: 0, locked: true },
];

const COURSE_DATA = {
  duration: '2h',
  level: 'Intermedio',
  rating: '4.8',
  videos: 42,
  proyectos: 5,
};

const MOBILE_BREAKPOINT = 1024;

export function useSidebarState(initialState = { videos: true, recursos: false }) {
  const store = useIALabStore();
  const persistedState = store.getSidebarState(null);
  const [collapsedSections, setCollapsedSections] = useState(
    persistedState || initialState
  );
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const initialRef = useRef(initialState);
  const debounceRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const mobile = window.innerWidth < MOBILE_BREAKPOINT;
        setIsMobile(mobile);
        if (mobile) setIsCollapsed(true);
      }, 100);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const persist = useCallback((state) => {
    store.setSidebarState(state);
  }, [store]);

  const toggleSection = useCallback((name) => {
    setCollapsedSections(prev => {
      const next = { ...prev, [name]: !prev[name] };
      persist(next);
      return next;
    });
  }, [persist]);

  const expandAll = useCallback(() => {
    setCollapsedSections(prev => {
      const next = Object.keys(prev).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});
      persist(next);
      return next;
    });
  }, [persist]);

  const collapseAll = useCallback(() => {
    setCollapsedSections(prev => {
      const next = Object.keys(prev).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      persist(next);
      return next;
    });
  }, [persist]);

  const isSectionCollapsed = useCallback((name) => {
    return collapsedSections[name] || false;
  }, [collapsedSections]);

  const reset = useCallback(() => {
    setCollapsedSections(initialRef.current);
    store.removeSidebarState();
  }, [store]);

  const toggleSidebar = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  const getSectionData = useCallback((sectionId) => {
    return SECTION_DATA[sectionId] || null;
  }, []);

  const getModuleData = useCallback(() => {
    return MODULE_DATA;
  }, []);

  const getCourseData = useCallback(() => {
    return COURSE_DATA;
  }, []);

  const getProgress = useCallback(() => {
    const total = MODULE_DATA.reduce((sum, mod) => sum + mod.progress, 0);
    return Math.round(total / MODULE_DATA.length);
  }, []);

  const getCompletedModules = useCallback(() => {
    return MODULE_DATA.filter(mod => mod.progress >= 100).map(mod => mod.id);
  }, []);

  const isModuleLocked = useCallback((moduleId) => {
    const mod = MODULE_DATA.find(m => m.id === moduleId);
    return mod ? mod.locked : true;
  }, []);

  return {
    collapsedSections,
    toggleSection,
    expandAll,
    collapseAll,
    isSectionCollapsed,
    reset,
    isMobile,
    isCollapsed,
    toggleSidebar,
    getSectionData,
    getModuleData,
    getCourseData,
    getProgress,
    getCompletedModules,
    isModuleLocked,
  };
}
