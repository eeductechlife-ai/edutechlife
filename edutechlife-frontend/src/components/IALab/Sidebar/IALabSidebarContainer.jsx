import React from 'react';
import { useUser, useClerk } from '@clerk/react';
import { useIALabContext } from '../../../context/IALabContext';
import useSidebarState from '../../../hooks/IALab/useSidebarState';
import useSidebarUserActions from '../../../hooks/IALab/useSidebarUserActions';
import IALabSidebar from './IALabSidebar';
import SidebarUserModals from './SidebarUserModals';

/**
 * IALabSidebarContainer - Componente container que maneja lógica del sidebar
 * Responsabilidades:
 * - Integrar con contexto global IALab
 * - Manejar estado del sidebar
 * - Proporcionar datos a componentes presentacionales
 * - Gestionar navegación entre módulos
 */
const IALabSidebarContainer = () => {
  const { user: clerkUser } = useUser();
  const { signOut } = useClerk();
  const {
    activeMod,
    setActiveMod,
    completedModules,
    modules,
    isModuleLocked,
    getCurrentModule
  } = useIALabContext();

  const sidebarState = useSidebarState({
    videos: false,
    recursos: false
  });

  const { openModals, closeModal, handlers: userHandlers } = useSidebarUserActions();

  const currentModule = getCurrentModule();

  const handleModuleSelect = (moduleId) => {
    if (!sidebarState.isModuleLocked(moduleId)) {
      setActiveMod(moduleId);
    }
  };

  const handleSectionItemClick = (item) => {
    console.log('Item clicked:', item);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  const sidebarData = {
    progress: sidebarState.getProgress(),
    completedModules: sidebarState.getCompletedModules(),
    totalModules: modules.length,
    modules: sidebarState.getModuleData().map(module => ({
      ...module,
      isLocked: sidebarState.isModuleLocked(module.id)
    })),
    activeMod,
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
    course: {
      ...sidebarState.getCourseData(),
      ...currentModule
    },
    user: {
      name: clerkUser?.fullName || clerkUser?.firstName || 'Usuario Edutechlife',
      email: clerkUser?.primaryEmailAddress?.emailAddress || 'usuario@edutechlife.com',
      imageUrl: clerkUser?.imageUrl
    },
    isMobile: sidebarState.isMobile,
    isCollapsed: sidebarState.isCollapsed
  };

  const handlers = {
    onModuleSelect: handleModuleSelect,
    onSectionToggle: sidebarState.toggleSection,
    onSectionItemClick: handleSectionItemClick,
    onUserSettings: userHandlers.onSettings,
    onSignOut: handleSignOut,
    onToggleSidebar: sidebarState.toggleSidebar,
    isModuleLocked: sidebarState.isModuleLocked,
    onProfile: userHandlers.onProfile,
    onNotifications: userHandlers.onNotifications,
    onBilling: userHandlers.onBilling,
    onHelp: userHandlers.onHelp
  };

  return (
    <>
      <IALabSidebar
        data={sidebarData}
        handlers={handlers}
      />
      <SidebarUserModals
        openModals={openModals}
        closeModal={closeModal}
      />
    </>
  );
};

export default IALabSidebarContainer;