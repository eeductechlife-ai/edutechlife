import { useState, useCallback } from 'react';

const useSidebarUserActions = () => {
  const [openModals, setOpenModals] = useState({
    profile: false,
    settings: false,
    notifications: false,
    billing: false,
    help: false,
  });

  const openModal = useCallback((modalId) => {
    setOpenModals((prev) => ({ ...prev, [modalId]: true }));
  }, []);

  const closeModal = useCallback((modalId) => {
    setOpenModals((prev) => ({ ...prev, [modalId]: false }));
  }, []);

  return {
    openModals,
    openModal,
    closeModal,
    handlers: {
      onProfile: () => openModal('profile'),
      onSettings: () => openModal('settings'),
      onNotifications: () => openModal('notifications'),
      onBilling: () => openModal('billing'),
      onHelp: () => openModal('help'),
    },
  };
};

export default useSidebarUserActions;
