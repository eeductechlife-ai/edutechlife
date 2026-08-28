import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useStudentProfileSmartBoard } from "../../hooks/useStudentProfileSmartBoard";
import { useTranslation } from "../../i18n/I18nProvider";
import { useSmartBoardKids } from "../../context/SmartBoardKidsContext";
import { VAK_STYLES_MAP, getInitials, getVakKey } from "./userMenuConstants";
import UserMenuDropdown from "./UserMenuDropdown";
import EditProfileModal from "./EditProfileModal";

export { getInitials };

const UserMenu = ({
  authToken,
  studentName,
  darkMode,
  onTabChange,
  onLogout,
}) => {
  const { t } = useTranslation();
  const { toggleDarkMode, gradeLevel, setGradeLevel, setSchoolName } =
    useSmartBoardKids();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditingModal, setIsEditingModal] = useState(false);
  const { profile, loading, error, updateProfile, uploadAvatar, removeAvatar } =
    useStudentProfileSmartBoard(authToken);

  // Auto-sync grade and school from profile to SmartBoard context when profile loads
  useEffect(() => {
    if (!profile) return;
    if (profile.grade && !gradeLevel) {
      const parsed = parseInt(profile.grade, 10);
      if (!Number.isNaN(parsed) && parsed >= 1 && parsed <= 11) {
        setGradeLevel(parsed);
      }
    }
    if (profile.school && setSchoolName) {
      setSchoolName(profile.school);
    }
  }, [profile, gradeLevel, setGradeLevel, setSchoolName]);

  const displayName = profile?.name || studentName || t("kid.user.student");
  const vakKey = getVakKey(profile?.vakStyle);
  const vakMeta = VAK_STYLES_MAP[vakKey];
  const avatarUrl = profile?.avatarUrl;

  const openEditModal = () => {
    setIsEditingModal(true);
    setIsOpen(false);
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    if (onLogout) onLogout();
  };

  const handleProgressClick = () => {
    setIsOpen(false);
    if (onTabChange) onTabChange("progreso");
  };

  const handleSaveSuccess = (payload) => {
    if (payload.grade) {
      const parsed = parseInt(payload.grade, 10);
      if (!Number.isNaN(parsed) && parsed >= 1 && parsed <= 11)
        setGradeLevel(parsed);
    }
    if (payload.school && setSchoolName) setSchoolName(payload.school);
  };

  return (
    <>
      {/* Dropdown Trigger */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label={t("kid.user.open_menu")}
          aria-expanded={isOpen}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0077B6] to-[#00B4D8] flex items-center justify-center text-white overflow-hidden">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs font-bold">
                {getInitials(displayName)}
              </span>
            )}
          </div>
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <UserMenuDropdown
              displayName={displayName}
              avatarUrl={avatarUrl}
              vakMeta={vakMeta}
              loading={loading}
              profile={profile}
              error={error}
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
              onClose={() => setIsOpen(false)}
              onProgressClick={handleProgressClick}
              onEditProfile={openEditModal}
              onLogout={handleLogoutClick}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Modal Editar Perfil */}
      <AnimatePresence>
        {isEditingModal && (
          <EditProfileModal
            profile={profile}
            studentName={studentName}
            displayName={displayName}
            avatarUrl={avatarUrl}
            updateProfile={updateProfile}
            uploadAvatar={uploadAvatar}
            removeAvatar={removeAvatar}
            onClose={() => setIsEditingModal(false)}
            onSaveSuccess={handleSaveSuccess}
          />
        )}
      </AnimatePresence>
    </>
  );
};

UserMenu.propTypes = {
  authToken: PropTypes.string,
  studentName: PropTypes.string,
  darkMode: PropTypes.bool,
  onTabChange: PropTypes.func,
  onLogout: PropTypes.func,
};

export default UserMenu;
