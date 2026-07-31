import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  lazy,
  Suspense,
} from "react";
import { useAuthIdentity, signOutUser } from "./../hooks/useAuthIdentity";
import { useStudentProfile } from "./../hooks/useStudentProfile";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "../utils/userInfo";
import { Icon } from "../utils/iconMapping.jsx";
import ErrorBoundary from "./forum/ErrorBoundary";
import UserProfileSection from "./userDropdownMenuSimplified/UserProfileSection";
import UserSettingsSection from "./userDropdownMenuSimplified/UserSettingsSection";
import { useTranslation } from "../i18n/I18nProvider";

const UserProfileSmartCard = lazy(() => import("./userProfileSmartCard"));
const SettingsSupportModal = lazy(
  () => import("./modals/SettingsSupportModal"),
);
const CertificatesModal = lazy(() => import("./modals/CertificatesModal"));
const ChangeAvatarModal = lazy(() => import("./modals/ChangeAvatarModal"));
const ActivityHistory = lazy(() => import("./ActivityHistory"));
const StudyPlannerModal = lazy(() => import("./IALab/StudyPlannerModal"));

const MENU_ITEMS_COUNT = 7;

const UserDropdownMenuSimplified = ({ onNavigate }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userId, email: authEmail, isSignedIn } = useAuthIdentity();
  const { profile } = useStudentProfile();
  const user = profile ? { ...profile, id: userId } : null;

  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const menuItemRefs = useRef([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [profileName, setProfileName] = useState(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const userInfo = getUserInfo(profile, authEmail);
  const displayName =
    profileName || userInfo.displayName || t("mobile_menu.user_fallback");

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const handleProfileUpdate = (event) => {
      if (event.detail?.full_name) {
        setProfileName(event.detail.full_name);
      }
    };
    window.addEventListener("profile-updated", handleProfileUpdate);
    return () =>
      window.removeEventListener("profile-updated", handleProfileUpdate);
  }, []);

  const closeWithAnimation = useCallback(() => {
    if (prefersReducedMotion) {
      setIsOpen(false);
      return;
    }
    setIsClosing(true);
    setFocusedIndex(-1);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 150);
  }, [prefersReducedMotion]);

  const closeAndFocusTrigger = useCallback(() => {
    closeWithAnimation();
    triggerRef.current?.focus();
  }, [closeWithAnimation]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeWithAnimation();
      }
    };

    if (isOpen) {
      document.addEventListener("pointerdown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [isOpen, closeWithAnimation]);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        menuItemRefs.current[0]?.focus();
        setFocusedIndex(0);
      });
    }
  }, [isOpen]);

  const handleMenuKeyDown = useCallback(
    (e) => {
      const { key } = e;
      if (key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((prev) => {
          const next = prev < MENU_ITEMS_COUNT - 1 ? prev + 1 : 0;
          menuItemRefs.current[next]?.focus();
          return next;
        });
      } else if (key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex((prev) => {
          const next = prev > 0 ? prev - 1 : MENU_ITEMS_COUNT - 1;
          menuItemRefs.current[next]?.focus();
          return next;
        });
      } else if (key === "Home") {
        e.preventDefault();
        setFocusedIndex(0);
        menuItemRefs.current[0]?.focus();
      } else if (key === "End") {
        e.preventDefault();
        setFocusedIndex(MENU_ITEMS_COUNT - 1);
        menuItemRefs.current[MENU_ITEMS_COUNT - 1]?.focus();
      } else if (key === "Escape") {
        e.preventDefault();
        closeAndFocusTrigger();
      } else if (key === "Tab") {
        e.preventDefault();
        closeWithAnimation();
      }
    },
    [closeAndFocusTrigger, closeWithAnimation],
  );

  const setMenuItemRef = useCallback(
    (index) => (el) => {
      menuItemRefs.current[index] = el;
    },
    [],
  );

  const handleTriggerClick = useCallback(() => {
    if (isClosing) return;
    if (isOpen) {
      closeWithAnimation();
    } else {
      setIsOpen(true);
    }
  }, [isOpen, isClosing, closeWithAnimation]);

  const handleCloseSection = useCallback(() => {
    closeWithAnimation();
    navigate("/");
  }, [navigate, closeWithAnimation]);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCertificatesOpen, setIsCertificatesOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsSupportOpen, setIsSettingsSupportOpen] = useState(false);
  const [showStudyPlanner, setShowStudyPlanner] = useState(false);

  const handleProfile = useCallback(() => {
    closeWithAnimation();
    setIsProfileOpen(true);
  }, [closeWithAnimation]);

  const handleCertificates = useCallback(() => {
    closeWithAnimation();
    setIsCertificatesOpen(true);
  }, [closeWithAnimation]);

  const handleStudyPlanner = useCallback(() => {
    closeWithAnimation();
    setShowStudyPlanner(true);
  }, [closeWithAnimation]);

  const handleSettingsSupport = useCallback(() => {
    closeWithAnimation();
    setIsSettingsSupportOpen(true);
  }, [closeWithAnimation]);

  const handleHistory = useCallback(() => {
    closeWithAnimation();
    setIsHistoryOpen(true);
  }, [closeWithAnimation]);

  const handleAvatarClick = useCallback(
    (e) => {
      e.stopPropagation();
      closeWithAnimation();
      setIsAvatarOpen(true);
    },
    [closeWithAnimation],
  );

  const getUserInitials = () => {
    if (displayName) {
      const names = displayName.split(" ");
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    return "U";
  };

  const staggerStyle = (index) => {
    if (prefersReducedMotion) return undefined;
    return {
      animationDelay: `${index * 40}ms`,
      animationFillMode: "backwards",
    };
  };

  const isVisible = isOpen || isClosing;
  const animClasses = prefersReducedMotion
    ? ""
    : isClosing
      ? "animate-out fade-out-0 zoom-out-95"
      : "animate-in fade-in-0 zoom-in-95";

  return (
    <>
      <div className="relative z-50" ref={dropdownRef}>
        <div className="flex items-center h-12 min-w-[200px] rounded-full bg-white border border-slate-200/60 shadow-sm">
          <button
            onClick={handleAvatarClick}
            className="flex-shrink-0 w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-sm hover:ring-2 hover:ring-corporate/50 hover:ring-offset-2 transition-all duration-200 cursor-pointer"
            aria-label={t("modals.settings.change_photo_aria")}
            title={t("modals.settings.change_photo_aria")}
          >
            {userInfo.avatarUrl ? (
              <img
                src={userInfo.avatarUrl}
                alt={displayName}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {getUserInitials()}
                </span>
              </div>
            )}
          </button>

          <button
            ref={triggerRef}
            className="flex-1 flex items-center gap-2 pl-2 pr-3 min-w-0"
            onClick={handleTriggerClick}
            aria-haspopup="true"
            aria-expanded={isOpen}
            aria-label={t("modals.settings.user_menu_aria")}
            data-tour="tour-undermenu-desktop"
          >
            <div className="flex-1 min-w-0 text-left">
              <div className="text-sm font-semibold text-petroleum truncate">
                {displayName}
              </div>
              <div className="text-xs text-slate-500 truncate">
                {userInfo.role === "teacher"
                  ? t("mobile_menu.role_teacher")
                  : t("mobile_menu.role_student")}
              </div>
            </div>

            <svg
              className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-corporate" : "text-slate-400"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        {isVisible && (
          <div
            className={`absolute right-0 top-full mt-2 w-60 border border-slate-200/60 shadow-xl rounded-xl bg-white z-[999] overflow-hidden ${animClasses}`}
            role="menu"
            aria-label={t("modals.settings.user_options_aria")}
            onKeyDown={handleMenuKeyDown}
          >
            <UserProfileSection
              userInfo={userInfo}
              displayName={displayName}
              getUserInitials={getUserInitials}
              handleAvatarClick={handleAvatarClick}
              t={t}
            />

            <div className="p-2 space-y-1">
              <button
                ref={setMenuItemRef(0)}
                role="menuitem"
                tabIndex={focusedIndex === 0 ? 0 : -1}
                className="group flex items-center gap-2.5 w-full px-3 py-2.5 bg-white border border-slate-200/60 border-l-4 border-l-petroleum rounded-lg shadow-sm hover:shadow hover:border-l-corporate hover:bg-slate-50 transition-all duration-200 cursor-pointer text-left"
                onClick={handleProfile}
                style={staggerStyle(0)}
              >
                <Icon
                  name="fa-user-circle"
                  className="text-sm text-petroleum flex-shrink-0"
                />
                <span className="text-xs font-semibold text-slate-800 group-hover:text-petroleum transition-colors duration-200">
                  {t("mobile_menu.my_profile")}
                </span>
              </button>

              <button
                ref={setMenuItemRef(1)}
                role="menuitem"
                tabIndex={focusedIndex === 1 ? 0 : -1}
                className="group flex items-center gap-2.5 w-full px-3 py-2.5 bg-white border border-slate-200/60 border-l-4 border-l-petroleum rounded-lg shadow-sm hover:shadow hover:border-l-corporate hover:bg-slate-50 transition-all duration-200 cursor-pointer text-left"
                onClick={handleHistory}
                style={staggerStyle(1)}
              >
                <Icon
                  name="fa-clock"
                  className="text-sm text-petroleum flex-shrink-0"
                />
                <span className="text-xs font-semibold text-slate-800 group-hover:text-petroleum transition-colors duration-200">
                  {t("mobile_menu.my_history")}
                </span>
              </button>

              <button
                ref={setMenuItemRef(2)}
                role="menuitem"
                tabIndex={focusedIndex === 2 ? 0 : -1}
                className="group flex items-center gap-2.5 w-full px-3 py-2.5 bg-white border border-slate-200/60 border-l-4 border-l-petroleum rounded-lg shadow-sm hover:shadow hover:border-l-corporate hover:bg-slate-50 transition-all duration-200 cursor-pointer text-left"
                onClick={handleCertificates}
                style={staggerStyle(2)}
              >
                <Icon
                  name="fa-certificate"
                  className="text-sm text-petroleum flex-shrink-0"
                />
                <span className="text-xs font-semibold text-slate-800 group-hover:text-petroleum transition-colors duration-200">
                  {t("mobile_menu.certificates")}
                </span>
              </button>

              <button
                ref={setMenuItemRef(3)}
                role="menuitem"
                tabIndex={focusedIndex === 3 ? 0 : -1}
                className="group flex items-center gap-2.5 w-full px-3 py-2.5 bg-white border border-slate-200/60 border-l-4 border-l-petroleum rounded-lg shadow-sm hover:shadow hover:border-l-corporate hover:bg-slate-50 transition-all duration-200 cursor-pointer text-left"
                onClick={handleStudyPlanner}
                style={staggerStyle(3)}
              >
                <Icon
                  name="fa-calendar"
                  className="text-sm text-petroleum flex-shrink-0"
                />
                <span className="text-xs font-semibold text-slate-800 group-hover:text-petroleum transition-colors duration-200">
                  {t("mobile_menu.study_plan")}
                </span>
              </button>

              <UserSettingsSection
                setMenuItemRef={setMenuItemRef}
                focusedIndex={focusedIndex}
                staggerStyle={staggerStyle}
                handleSettingsSupport={handleSettingsSupport}
                t={t}
              />

              <div className="border-t border-slate-200/60 my-1"></div>

              <button
                ref={setMenuItemRef(5)}
                role="menuitem"
                tabIndex={focusedIndex === 5 ? 0 : -1}
                className="group flex items-center gap-2.5 w-full px-3 py-2.5 bg-white border border-slate-200/60 border-l-4 border-l-petroleum rounded-lg shadow-sm hover:shadow hover:border-l-corporate hover:bg-slate-50 transition-all duration-200 cursor-pointer text-left"
                onClick={handleCloseSection}
                style={staggerStyle(5)}
              >
                <Icon
                  name="fa-sign-out-alt"
                  className="text-sm text-petroleum flex-shrink-0"
                />
                <span className="text-xs font-semibold text-slate-800 group-hover:text-petroleum transition-colors duration-200">
                  {t("mobile_menu.close_section")}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      <Suspense fallback={null}>
        <UserProfileSmartCard
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          onOpenChangeAvatar={() => setIsAvatarOpen(true)}
        />

        <StudyPlannerModal
          isOpen={showStudyPlanner}
          onClose={() => setShowStudyPlanner(false)}
        />

        <SettingsSupportModal
          isOpen={isSettingsSupportOpen}
          onClose={() => setIsSettingsSupportOpen(false)}
        />

        <CertificatesModal
          isOpen={isCertificatesOpen}
          onClose={() => setIsCertificatesOpen(false)}
        />

        <ChangeAvatarModal
          isOpen={isAvatarOpen}
          onClose={() => setIsAvatarOpen(false)}
        />

        <ErrorBoundary>
          <ActivityHistory
            isOpen={isHistoryOpen}
            onClose={() => setIsHistoryOpen(false)}
          />
        </ErrorBoundary>
      </Suspense>
    </>
  );
};

export default React.memo(UserDropdownMenuSimplified);
