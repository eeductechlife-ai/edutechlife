import { Icon } from "../../utils/iconMapping.jsx";
import { Card, CardContent } from "../ui/card-simple";
import { resolveAvatarUrl } from "./resolveAvatar";
import { useProfileData } from "./useProfileData";
import ProfileInfoSection from "./components/ProfileInfoSection";
import ProfileProgressSection from "./components/ProfileProgressSection";
import ProfileSecuritySection from "./components/ProfileSecuritySection";

const UserProfileSmartCard = ({ isOpen, onClose, onOpenChangeAvatar }) => {
  const {
    t,
    locale,
    profileData,
    stats,
    isLoading,
    editingField,
    tempValue,
    isSaving,
    saveMessage,
    phoneError,
    nameInputRef,
    phoneInputRef,
    getUserInitials,
    getRoleLabel,
    getRoleBadgeColor,
    hasPendingChanges,
    formatDate,
    displayEmail,
    displayName,
    startEditing,
    handleTempChange,
    handleCancelEdit,
    handleSaveAll,
    handleOpenChangePassword,
  } = useProfileData({ isOpen, onClose, onOpenChangeAvatar });

  // Avatar guardado por usuario (antes venia de Clerk). Prioriza la foto local
  // de ChangeAvatarModal y cae a avatar_url de la BD.
  const avatarUrl = resolveAvatarUrl(profileData);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />

      <Card className="w-full max-w-md bg-white rounded-xl border border-slate-200/60 shadow-lg max-h-[90vh] overflow-hidden relative z-10 animate-in fade-in-0 zoom-in-95 duration-300 flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
          aria-label={t("common.close")}
        >
          <Icon name="fa-times" className="text-lg" />
        </button>

        <div className="relative bg-gradient-to-r from-[#004B63] to-[#00BCD4] px-6 pt-8 pb-16">
          <div className="flex flex-col items-center">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-20 h-20 rounded-full object-cover border-4 border-white/30 shadow-lg mb-3"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30 shadow-lg mb-3">
                <span className="text-white font-bold text-2xl">
                  {getUserInitials()}
                </span>
              </div>
            )}
            <h2 className="text-white font-bold text-base text-center leading-tight">
              {displayName}
            </h2>
            <span
              className={`mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${getRoleBadgeColor(profileData.role)}`}
            >
              {getRoleLabel(profileData.role)}
            </span>
          </div>
        </div>

        <CardContent className="p-5 overflow-y-auto flex-1">
          <div className="mb-5 p-3 bg-gradient-to-r from-[#004B63]/5 to-[#00BCD4]/5 border border-[#004B63]/10 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center flex-shrink-0">
                <Icon
                  name="fa-graduation-cap"
                  className="text-[#004B63] text-sm"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                  {t("profile.enrolled_course")}
                </p>
                <p className="text-xs font-bold text-slate-800 leading-snug mt-0.5">
                  {t("profile.course_name")}
                </p>
                {stats.enrollmentDate && (
                  <p className="text-[10px] text-slate-500 mt-1">
                    {t("profile.enrolled_from", {
                      date: formatDate(stats.enrollmentDate),
                    })}
                  </p>
                )}
              </div>
            </div>
          </div>

          <ProfileInfoSection
            t={t}
            profileData={profileData}
            editingField={editingField}
            tempValue={tempValue}
            phoneError={phoneError}
            isSaving={isSaving}
            displayEmail={displayEmail}
            displayName={displayName}
            nameInputRef={nameInputRef}
            phoneInputRef={phoneInputRef}
            startEditing={startEditing}
            handleTempChange={handleTempChange}
            handleCancelEdit={handleCancelEdit}
          />

          <ProfileProgressSection t={t} stats={stats} />

          {hasPendingChanges() && (
            <div className="mb-5">
              <button
                onClick={handleSaveAll}
                disabled={isSaving || (phoneError && tempValue.length > 0)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#004B63] to-[#00BCD4] text-white font-semibold text-sm rounded-lg shadow-sm hover:shadow-md hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Icon name="fa-spinner" className="animate-spin" />
                    {t("profile.saving")}
                  </>
                ) : (
                  <>
                    <Icon name="fa-save" />
                    {t("profile.save_button")}
                  </>
                )}
              </button>
            </div>
          )}

          {saveMessage && (
            <div
              className={`mb-5 p-3 rounded-lg border ${saveMessage.type === "success" ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"}`}
            >
              <p
                className={`text-xs flex items-center gap-2 ${saveMessage.type === "success" ? "text-emerald-600" : "text-rose-600"}`}
              >
                <Icon
                  name={
                    saveMessage.type === "success"
                      ? "fa-check-circle"
                      : "fa-exclamation-circle"
                  }
                  className={
                    saveMessage.type === "success"
                      ? "text-emerald-500"
                      : "text-rose-500"
                  }
                />
                {saveMessage.text}
              </p>
            </div>
          )}

          <ProfileSecuritySection
            t={t}
            onClose={onClose}
            onOpenChangeAvatar={onOpenChangeAvatar}
            handleOpenChangePassword={handleOpenChangePassword}
          />

          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20">
              <div className="flex flex-col items-center gap-2">
                <Icon
                  name="fa-spinner"
                  className="text-2xl text-[#00BCD4] animate-spin"
                />
                <p className="text-xs text-slate-500">{t("profile.loading")}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfileSmartCard;
