import { Icon } from '../../../utils/iconMapping.jsx';

const ProfileSecuritySection = ({ t, onClose, onOpenChangeAvatar, handleOpenChangePassword }) => (
  <div>
    <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
      <Icon name="fa-cog" className="text-[#004B63] text-xs" />
      {t('profile.actions_title')}
    </h4>

    <div className="space-y-2">
      <button
        onClick={() => { onClose(); if (onOpenChangeAvatar) onOpenChangeAvatar(); }}
        className="w-full flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200/60 border-l-4 border-l-[#004B63] rounded-lg shadow-sm hover:shadow hover:border-l-[#00BCD4] hover:bg-slate-50 transition-all duration-300 text-left"
      >
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center flex-shrink-0">
          <Icon name="fa-camera" className="text-[#004B63] text-xs" />
        </div>
        <span className="text-xs font-semibold text-slate-800">{t('profile.change_photo')}</span>
      </button>

      <button
        onClick={handleOpenChangePassword}
        className="w-full flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200/60 border-l-4 border-l-[#004B63] rounded-lg shadow-sm hover:shadow hover:border-l-[#00BCD4] hover:bg-slate-50 transition-all duration-300 text-left"
      >
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center flex-shrink-0">
          <Icon name="fa-key" className="text-[#004B63] text-xs" />
        </div>
        <span className="text-xs font-semibold text-slate-800">{t('mobile_menu.change_password')}</span>
      </button>
    </div>
  </div>
);

export default ProfileSecuritySection;
