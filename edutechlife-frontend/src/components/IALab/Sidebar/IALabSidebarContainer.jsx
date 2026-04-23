import React from 'react';
import { useIALabContext } from '../../../context/IALabContext';
import useSidebarState from '../../../hooks/IALab/useSidebarState';
import IALabSidebar from './IALabSidebar';

/**
 * IALabSidebarContainer - Componente container que maneja lógica del sidebar
 * Responsabilidades:
 * - Integrar con contexto global IALab
 * - Manejar estado del sidebar
 * - Proporcionar datos a componentes presentacionales
 * - Gestionar navegación entre módulos
 */
const IALabSidebarContainer = () => {
  // Contexto global IALab
  const {
    activeMod,
    setActiveMod,
    completedModules,
    modules,
    isModuleLocked,
    getCurrentModule
  } = useIALabContext();

  // Estado del sidebar
  const sidebarState = useSidebarState({
    videos: false,
    recursos: false
  });

  // Obtener datos del módulo actual
  const currentModule = getCurrentModule();

  // Handler para seleccionar módulo
  const handleModuleSelect = (moduleId) => {
    if (!sidebarState.isModuleLocked(moduleId)) {
      setActiveMod(moduleId);
    }
  };

  // Handler para items de secciones
  const handleSectionItemClick = (item) => {
    console.log('Item clicked:', item);
    // Aquí se podría implementar lógica específica por tipo de item
    // Ej: abrir video, descargar recurso, etc.
  };

  // Handler para configuración de usuario
  const handleUserSettings = () => {
    console.log('Open user settings');
    // Aquí se podría integrar con Clerk o abrir modal de configuración
  };

  // Handler para cerrar sesión
  const handleSignOut = () => {
    console.log('Sign out');
    // Aquí se integraría con Clerk signOut
  };

  // Preparar datos para componentes presentacionales
  const sidebarData = {
    // Progreso
    progress: sidebarState.getProgress(),
    completedModules: sidebarState.getCompletedModules(),
    totalModules: modules.length,
    
    // Módulos
    modules: sidebarState.getModuleData().map(module => ({
      ...module,
      isLocked: sidebarState.isModuleLocked(module.id)
    })),
    activeMod,
    
    // Secciones colapsables
    sections: {
      videos: {
        ...sidebarState.getSectionData('videos'),
        isOpen: !sidebarState.isSectionCollapsed('videos')
      },
      recursos: {
        ...sidebarState.getSectionData('recursos'),
        isOpen: !sidebarState.isSectionCollapsed('recursos')
      }
    },
    
    // Detalles del curso
    course: {
      ...sidebarState.getCourseData(),
      ...currentModule
    },
    
    // Usuario
    user: {
      name: 'Usuario Edutechlife',
      email: 'usuario@edutechlife.com'
    },
    
    // Estado responsive
    isMobile: sidebarState.isMobile,
    isCollapsed: sidebarState.isCollapsed
  };

  // Handlers para componentes presentacionales
  const handlers = {
    // Navegación
    onModuleSelect: handleModuleSelect,
    onSectionToggle: sidebarState.toggleSection,
    onSectionItemClick: handleSectionItemClick,
    
    // Usuario
    onUserSettings: handleUserSettings,
    onSignOut: handleSignOut,
    
    // Responsive
    onToggleSidebar: sidebarState.toggleSidebar,
    
    // Utilidades
    isModuleLocked: sidebarState.isModuleLocked
  };

  return (
    <IALabSidebar
      data={sidebarData}
      handlers={handlers}
    />
  );
};

export default IALabSidebarContainer;