import { Icon } from '../../../utils/iconMapping.jsx';

const ProfileInfoSection = ({
  t,
  profileData,
  editingField,
  tempValue,
  phoneError,
  isSaving,
  displayEmail,
  displayName,
  nameInputRef,
  phoneInputRef,
  startEditing,
  handleTempChange,
  handleCancelEdit,
}) => (
  <div className="mb-5">
    <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
      <Icon name="fa-user" className="text-[#004B63] text-xs" />
      {t('profile.personal_info')}
    </h4>

    <div className="space-y-2.5">
      <div>
        <label className="text-[10px] font-medium text-slate-500 block mb-1">{t('profile.email_label')}</label>
        <div className="px-3 py-2.5 bg-slate-50 border border-slate-200/60 rounded-full flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Icon name="fa-envelope" className="text-slate-400 text-xs flex-shrink-0" />
            <span className="text-xs text-slate-700 truncate">{displayEmail || t('profile.no_email')}</span>
          </div>
          <Icon name="fa-lock" className="text-slate-300 text-xs ml-2 flex-shrink-0" />
        </div>
      </div>

      <div>
        <label className="text-[10px] font-medium text-slate-500 block mb-1">{t('profile.phone_label')}</label>
        {editingField === 'phone' ? (
          <div>
            <div className="relative">
              <input
                ref={phoneInputRef}
                type="tel"
                value={tempValue}
                onChange={(e) => handleTempChange('phone', e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Escape') handleCancelEdit(); }}
                className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00BCD4]/50 focus:border-[#00BCD4] text-xs"
                placeholder={t('profile.phone_placeholder')}
                maxLength="10"
                disabled={isSaving}
              />
              <Icon name="fa-phone" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <button onClick={handleCancelEdit} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                <Icon name="fa-times" className="text-xs" />
              </button>
            </div>
            {phoneError && <p className="text-[10px] text-amber-600 mt-1 ml-2">{phoneError}</p>}
          </div>
        ) : (
          <div
            className="px-3 py-2.5 bg-white border border-slate-200/60 rounded-full cursor-pointer hover:bg-slate-50 hover:border-[#00BCD4]/30 transition-all flex items-center justify-between"
            onClick={() => startEditing('phone')}
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Icon name="fa-phone" className="text-slate-400 text-xs flex-shrink-0" />
              <span className={`text-xs truncate ${profileData.phone ? 'text-slate-700' : 'text-slate-400 italic'}`}>
                {profileData.phone || t('profile.tap_to_add')}
              </span>
            </div>
            <Icon name="fa-pencil" className="text-slate-400 text-xs ml-2 flex-shrink-0" />
          </div>
        )}
      </div>

      <div>
        <label className="text-[10px] font-medium text-slate-500 block mb-1">{t('profile.name_label')}</label>
        {editingField === 'full_name' ? (
          <div className="relative">
            <input
              ref={nameInputRef}
              type="text"
              value={tempValue}
              onChange={(e) => handleTempChange('full_name', e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Escape') handleCancelEdit(); }}
              className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00BCD4]/50 focus:border-[#00BCD4] text-xs"
              placeholder={t('profile.name_placeholder')}
              disabled={isSaving}
            />
            <Icon name="fa-user" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <button onClick={handleCancelEdit} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
              <Icon name="fa-times" className="text-xs" />
            </button>
          </div>
        ) : (
          <div
            className="px-3 py-2.5 bg-white border border-slate-200/60 rounded-full cursor-pointer hover:bg-slate-50 hover:border-[#00BCD4]/30 transition-all flex items-center justify-between"
            onClick={() => startEditing('full_name')}
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Icon name="fa-user" className="text-slate-400 text-xs flex-shrink-0" />
              <span className="text-xs text-slate-700 truncate">{displayName}</span>
            </div>
            <Icon name="fa-pencil" className="text-slate-400 text-xs ml-2 flex-shrink-0" />
          </div>
        )}
      </div>
    </div>
  </div>
);

export default ProfileInfoSection;
