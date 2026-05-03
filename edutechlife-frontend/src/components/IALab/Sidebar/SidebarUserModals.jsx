import React from 'react';
import UserProfileSmartCard from '../UserProfileSmartCard';
import SettingsModal from './SettingsModal';
import NotificationsModal from './NotificationsModal';
import BillingModal from './BillingModal';
import HelpModal from './HelpModal';

const SidebarUserModals = ({
  openModals,
  closeModal,
}) => {
  return (
    <>
      <UserProfileSmartCard
        isOpen={openModals.profile}
        onClose={() => closeModal('profile')}
        onOpenChangeAvatar={() => {
          closeModal('profile');
          setTimeout(() => closeModal('settings'), 100);
        }}
      />

      <SettingsModal
        isOpen={openModals.settings}
        onClose={() => closeModal('settings')}
      />

      <NotificationsModal
        isOpen={openModals.notifications}
        onClose={() => closeModal('notifications')}
      />

      <BillingModal
        isOpen={openModals.billing}
        onClose={() => closeModal('billing')}
      />

      <HelpModal
        isOpen={openModals.help}
        onClose={() => closeModal('help')}
      />
    </>
  );
};

export default SidebarUserModals;
