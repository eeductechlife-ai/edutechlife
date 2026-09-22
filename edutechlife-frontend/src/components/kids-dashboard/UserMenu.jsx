import { useEffect } from "react";
import PropTypes from "prop-types";
import { useStudentProfileIngenIA } from "../../hooks/useStudentProfileIngenIA";
import { useIngenIAKids } from "../../context/IngenIAKidsContext";
import { getInitials } from "./userMenuConstants";

export { getInitials };

const UserMenu = ({ authToken, studentName, darkMode, onTabChange }) => {
  const { gradeLevel, setGradeLevel, setSchoolName } = useIngenIAKids();
  const { profile } = useStudentProfileIngenIA(authToken);

  // Sync grade and school from profile to context
  useEffect(() => {
    if (!profile) return;
    if (profile.grade && !gradeLevel) {
      const parsed = parseInt(profile.grade, 10);
      if (!Number.isNaN(parsed) && parsed >= 1 && parsed <= 11)
        setGradeLevel(parsed);
    }
    if (profile.school && setSchoolName) setSchoolName(profile.school);
  }, [profile, gradeLevel, setGradeLevel, setSchoolName]);

  const displayName = profile?.name || studentName || "Estudiante";
  const avatarUrl = profile?.avatarUrl;

  return (
    <button
      onClick={() => onTabChange?.("perfil")}
      className={`flex items-center gap-1 pl-1 pr-2 py-1 rounded-full transition-colors ${
        darkMode ? "hover:bg-white/10" : "hover:bg-[#E8F4F8]"
      }`}
      aria-label="Ir a Mi Perfil"
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0077B6] to-[#00B4D8] flex items-center justify-center text-white overflow-hidden ring-2 ring-white/30">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-xs font-bold">{getInitials(displayName)}</span>
        )}
      </div>
    </button>
  );
};

UserMenu.propTypes = {
  authToken: PropTypes.string,
  studentName: PropTypes.string,
  darkMode: PropTypes.bool,
  onTabChange: PropTypes.func,
};

export default UserMenu;
