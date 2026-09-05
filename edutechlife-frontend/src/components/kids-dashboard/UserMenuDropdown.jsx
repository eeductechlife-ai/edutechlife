import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Edit3, Loader2, LogOut, BarChart3, Moon, Sun } from "lucide-react";
import { useTranslation } from "../../i18n/I18nProvider";
import { getInitials } from "./userMenuConstants";
import { SB_GRADIENTS, glow } from "./smartboardTheme";

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

  const card = darkMode ? "rgba(30,41,59,0.96)" : "rgba(255,255,255,0.98)";
  const border = darkMode ? "rgba(51,65,85,0.7)" : "rgba(226,232,240,0.8)";
  const textPrimary = darkMode ? "#F1F5F9" : "#0F172A";
  const textSecondary = darkMode ? "#94A3B8" : "#64748B";
  const chipBg = darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,75,99,0.06)";
  const rowHover = darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,119,182,0.06)";

  return (
    <>
      {/* Backdrop — closes the dropdown when clicking outside */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.97 }}
        transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-1rem)] rounded-2xl z-50 overflow-hidden"
        style={{
          background: card,
          border: `1px solid ${border}`,
          boxShadow: darkMode
            ? "0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)"
            : "0 20px 40px rgba(0,75,99,0.18), 0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        {/* Header — brand gradient */}
        <div className="px-4 py-4" style={{ background: SB_GRADIENTS.hero }}>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white overflow-hidden flex-shrink-0"
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "1.5px solid rgba(255,255,255,0.35)",
                boxShadow: glow("#48CAE4", 0.3),
              }}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-base font-black">
                  {getInitials(displayName)}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-black text-sm text-white truncate leading-tight">
                {displayName}
              </p>
              <p className="text-[11px] text-white/65 mt-0.5">
                {t("kid.user.smartboard_profile")}
              </p>
              {vakMeta && (
                <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold text-white/90 bg-white/15 border border-white/20">
                  {vakMeta.icon} {t(vakMeta.labelKey)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-6 flex flex-col items-center gap-2">
            <Loader2
              className="w-5 h-5 animate-spin"
              style={{ color: "#0077B6" }}
            />
            <p className="text-xs" style={{ color: textSecondary }}>
              {t("kid.user.loading")}
            </p>
          </div>
        )}

        {/* Profile data */}
        {!loading && profile && (
          <div className="px-3 py-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div
                className="rounded-xl p-2.5"
                style={{ background: chipBg, border: `1px solid ${border}` }}
              >
                <p
                  className="text-[9px] font-black uppercase tracking-widest mb-0.5"
                  style={{ color: "#0096C7" }}
                >
                  {t("kid.user.age")}
                </p>
                <p className="text-sm font-bold" style={{ color: textPrimary }}>
                  {profile.age
                    ? t("kid.user.age_value", { age: profile.age })
                    : "—"}
                </p>
              </div>
              <div
                className="rounded-xl p-2.5"
                style={{ background: chipBg, border: `1px solid ${border}` }}
              >
                <p
                  className="text-[9px] font-black uppercase tracking-widest mb-0.5"
                  style={{ color: "#06D6A0" }}
                >
                  {t("kid.user.grade")}
                </p>
                <p className="text-sm font-bold" style={{ color: textPrimary }}>
                  {profile.grade || "—"}
                </p>
              </div>
            </div>

            {vakMeta && (
              <div
                className="rounded-xl p-2.5 flex items-center justify-between"
                style={{ background: chipBg, border: `1px solid ${border}` }}
              >
                <p
                  className="text-[9px] font-black uppercase tracking-widest"
                  style={{ color: "#F59E0B" }}
                >
                  {t("kid.user.vak_type")}
                </p>
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold"
                  style={{ backgroundColor: vakMeta.bg, color: vakMeta.color }}
                >
                  {vakMeta.icon} {t(vakMeta.labelKey)}
                </span>
              </div>
            )}

            {profile.school && (
              <div
                className="rounded-xl p-2.5"
                style={{ background: chipBg, border: `1px solid ${border}` }}
              >
                <p
                  className="text-[9px] font-black uppercase tracking-widest mb-0.5"
                  style={{ color: textSecondary }}
                >
                  {t("kid.user.school")}
                </p>
                <p
                  className="text-sm font-semibold truncate"
                  style={{ color: textPrimary }}
                >
                  {profile.school}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <p className="px-4 py-3 text-xs text-center text-[#EF476F]">
            {t("kid.user.load_error")}
          </p>
        )}

        {/* Actions */}
        {!loading && (
          <div
            className="px-3 pb-3 space-y-1"
            style={{ borderTop: `1px solid ${border}`, paddingTop: "10px" }}
          >
            {/* Dark mode toggle */}
            <button
              onClick={() => {
                toggleDarkMode();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors text-left"
              style={{ color: textPrimary }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = rowHover)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              {darkMode ? (
                <Sun
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: "#F59E0B" }}
                />
              ) : (
                <Moon
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: "#6366F1" }}
                />
              )}
              {darkMode ? "Modo claro" : "Modo oscuro"}
            </button>

            {/* Progress */}
            <button
              onClick={onProgressClick}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors text-left"
              style={{ color: textPrimary }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = rowHover)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <BarChart3
                className="w-4 h-4 flex-shrink-0"
                style={{ color: "#FB8500" }}
              />
              {t("kid.user.progress")}
            </button>

            {/* Edit profile — CTA */}
            <button
              onClick={onEditProfile}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 active:scale-[0.98]"
              style={{
                background: SB_GRADIENTS.brand,
                boxShadow: glow("#00B4D8", 0.3),
              }}
            >
              <Edit3 className="w-4 h-4" />
              {t("kid.user.edit_profile")}
            </button>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-colors"
              style={{ color: "#EF476F" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(239,71,111,0.08)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <LogOut className="w-4 h-4" />
              {t("kid.user.logout")}
            </button>
          </div>
        )}
      </motion.div>
    </>
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
