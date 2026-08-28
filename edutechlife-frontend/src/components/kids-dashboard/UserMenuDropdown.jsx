import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Edit3, Loader2, LogOut, BarChart3 } from "lucide-react";
import { useTranslation } from "../../i18n/I18nProvider";
import { getInitials } from "./userMenuConstants";

const UserMenuDropdown = ({
  displayName,
  avatarUrl,
  vakMeta,
  loading,
  profile,
  error,
  darkMode,
  toggleDarkMode,
  onClose,
  onProgressClick,
  onEditProfile,
  onLogout,
}) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-xl border border-gray-200 z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0077B6] to-[#00B4D8] p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-white overflow-hidden flex-shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg font-bold">
                {getInitials(displayName)}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-base truncate">{displayName}</p>
            <p className="text-xs text-white/80">
              {t("kid.user.smartboard_profile")}
            </p>
            {vakMeta && (
              <span
                className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{ background: "rgba(255,255,255,0.2)" }}
              >
                {vakMeta.icon} {t(vakMeta.labelKey)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-4 text-center">
          <Loader2 className="w-5 h-5 animate-spin inline text-[#0077B6]" />
          <p className="text-sm text-gray-600 mt-2">{t("kid.user.loading")}</p>
        </div>
      )}

      {/* Profile Data */}
      {!loading && profile && (
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-[#F0F9FF] border border-[#BAE6FD] p-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#0284C7]">
                {t("kid.user.age")}
              </p>
              <p className="text-sm text-gray-800 mt-0.5">
                {profile.age
                  ? t("kid.user.age_value", { age: profile.age })
                  : t("kid.user.not_specified_age")}
              </p>
            </div>
            <div className="rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] p-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#15803D]">
                {t("kid.user.grade")}
              </p>
              <p className="text-sm text-gray-800 mt-0.5">
                {profile.grade || t("kid.user.not_specified")}
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-[#FFFBEB] border border-[#FDE68A] p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#B45309]">
              {t("kid.user.vak_type")}
            </p>
            <div className="flex items-center gap-2 mt-1">
              {vakMeta ? (
                <>
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
                    style={{
                      backgroundColor: vakMeta.bg,
                      color: vakMeta.color,
                    }}
                  >
                    {vakMeta.icon} {t(vakMeta.labelKey)}
                  </span>
                </>
              ) : (
                <p className="text-sm text-gray-800">
                  {t("kid.user.not_detected")}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-xl bg-[#F8FAFC] border border-gray-200 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
              {t("kid.user.school")}
            </p>
            <p className="text-sm text-gray-800 mt-0.5">
              {profile.school || t("kid.user.not_specified")}
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="p-4 text-center text-red-600 text-sm">
          {t("kid.user.load_error")}
        </div>
      )}

      {/* Actions */}
      {!loading && (
        <div className="p-3 border-t border-gray-200 space-y-2">
          <button
            onClick={() => {
              toggleDarkMode();
              onClose();
            }}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-[#F0F9FF] transition-colors"
          >
            <span className="text-base leading-none">
              {darkMode ? "☀️" : "\u{1F319}"}
            </span>
            {darkMode ? "Modo claro" : "Modo oscuro"}
          </button>
          <button
            onClick={onProgressClick}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-[#F0F9FF] transition-colors"
          >
            <BarChart3 className="w-4 h-4 text-[#0077B6]" />
            {t("kid.user.progress")}
          </button>
          <button
            onClick={onEditProfile}
            className="w-full flex items-center justify-center gap-2 bg-[#0077B6] hover:bg-[#005fa3] text-white py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            {t("kid.user.edit_profile")}
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {t("kid.user.logout")}
          </button>
        </div>
      )}
    </motion.div>
  );
};

UserMenuDropdown.propTypes = {
  displayName: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string,
  vakMeta: PropTypes.object,
  loading: PropTypes.bool,
  profile: PropTypes.object,
  error: PropTypes.object,
  darkMode: PropTypes.bool,
  toggleDarkMode: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onProgressClick: PropTypes.func.isRequired,
  onEditProfile: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default UserMenuDropdown;
