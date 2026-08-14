import React, { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthIdentity, signOutUser } from "../../hooks/useAuthIdentity";
import { useStudentProfile } from "../../hooks/useStudentProfile";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useTranslation } from "../../i18n/I18nProvider";
import { getUserInfo } from "../../utils/userInfo";
import { useAvatarUrl } from "../userProfileSmartCard/resolveAvatar";
import UserProfileSmartCard from "../userProfileSmartCard";
import ErrorBoundary from "../forum/ErrorBoundary";
import UserCoursesDashboard from "../IALab/UserCoursesDashboard";
import UserMenuHeader from "./components/UserMenuHeader";
import UserMenuItems from "./components/UserMenuItems";
import UserMenuFooter from "./components/UserMenuFooter";

const ActivityHistory = lazy(() => import("../ActivityHistory"));
const StudyPlannerModal = lazy(() => import("../IALab/StudyPlannerModal"));

const UserDropdownMenuPremium = ({ onNavigate }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showStudyPlanner, setShowStudyPlanner] = useState(false);
  const [showCourses, setShowCourses] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Identidad y perfil desde Supabase (Clerk ya no autentica a nadie).
  const { userId, isLoaded, isSignedIn } = useAuthIdentity();
  const { profile } = useStudentProfile();
  const user = profile ? { ...profile, id: userId } : null;

  useEffect(() => {
    if (isLoaded) {
      setIsLoading(false);
    }
  }, [isLoaded]);

  const userInfo = getUserInfo(profile);
  // La foto subida por ChangeAvatarModal se guarda en localStorage; usarla
  // como fuente primaria (fallback: avatar_url de la BD). Reactiva ante el
  // evento avatar-updated.
  const avatarUrl = useAvatarUrl(profile);

  const handleLogout = async () => {
    try {
      signOutUser("/", navigate);
    } catch (error) {
      console.error(t("modals.settings.logout_error"), error);
    }
  };

  const handleProfile = () => {
    // El modal de Clerk ya no existe; abrimos la tarjeta de perfil propia.
    {
      setIsProfileOpen(true);
    }
  };

  const handleSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleCertificates = () => {
    setShowCourses(true);
  };

  const handleHistory = () => setShowHistory(true);
  const handleStudyPlanner = () => setShowStudyPlanner(true);

  const handleChangePassword = () => {
    // Antes intentaba abrir el perfil de Clerk; ahora el cambio de contraseña
    // se hace en el modal propio.
    setIsChangePasswordOpen(true);
  };

  if (!isSignedIn) {
    return (
      <Button
        variant="ghost"
        className="relative h-10 w-10 rounded-full p-0"
        aria-label={t("modals.settings.unauthenticated_aria")}
        onClick={() => navigate("/login")}
      >
        <Avatar className="h-10 w-10 border-2 border-white">
          <AvatarFallback className="bg-slate-100 text-slate-400">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </AvatarFallback>
        </Avatar>
      </Button>
    );
  }

  if (!isSignedIn) {
    return (
      <Button
        variant="ghost"
        className="relative h-10 w-10 rounded-full p-0 hover:bg-cyan-50"
        aria-label={t("modals.settings.sign_in_aria")}
        onClick={() => navigate("/login")}
      >
        <Avatar className="h-10 w-10 border-2 border-white">
          <AvatarFallback className="bg-gradient-to-br from-slate-400 to-slate-600 text-white">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </AvatarFallback>
        </Avatar>
      </Button>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full p-0 hover:bg-cyan-50 transition-all duration-200"
            aria-label={t("modals.settings.user_menu_aria")}
          >
            <Avatar className="h-10 w-10 border-2 border-white shadow-md">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={userInfo.displayName} />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-[#004B63] to-[#00BCD4] text-white font-semibold">
                  {userInfo.initials}
                </AvatarFallback>
              )}
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-80 max-w-[calc(100vw-1rem)] max-h-[80vh] overflow-y-auto border border-slate-100 shadow-2xl shadow-slate-200/50 rounded-2xl bg-white"
          align="end"
          sideOffset={8}
        >
          <UserMenuHeader
            userInfo={userInfo}
            avatarUrl={avatarUrl}
            t={t}
            isSignedIn={isSignedIn}
          />

          <UserMenuItems
            t={t}
            onProfile={handleProfile}
            onHistory={handleHistory}
            onStudyPlanner={handleStudyPlanner}
            onSettings={handleSettings}
            onCertificates={handleCertificates}
            onChangePassword={handleChangePassword}
          />

          <UserMenuFooter onLogout={handleLogout} t={t} />
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal de Cambio de Contraseña */}
      <Dialog
        open={isChangePasswordOpen}
        onOpenChange={setIsChangePasswordOpen}
      >
        <DialogContent className="sm:max-w-md max-h-[85dvh] overflow-y-auto bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] shadow-indigo-900/5 relative">
          <button
            onClick={() => setIsChangePasswordOpen(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 hover:bg-slate-100 p-2 rounded-full transition-colors duration-200 z-50"
            aria-label={t("modals.password.close")}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>

          <div className="space-y-6 p-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">
                {t("modals.password.change_password")}
              </h2>
              <p className="text-sm text-slate-500">
                {t("modals.password.manage_security")}
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                {isSignedIn
                  ? t("modals.password.use_clerk")
                  : t("modals.password.not_available")}
              </p>

              <div className="bg-gradient-to-br from-indigo-50/80 to-white p-4 rounded-xl border border-slate-100 transition-all duration-300 hover:shadow-sm">
                <p className="text-sm text-slate-800 font-medium">
                  {isSignedIn
                    ? t("modals.password.clerk_configured")
                    : t("modals.password.clerk_not_signed_in")}
                </p>
              </div>

              {isSignedIn && (
                <Button
                  onClick={() => {
                    setIsChangePasswordOpen(false);
                    handleProfile();
                  }}
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                >
                  {t("modals.password.go_to_profile")}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Configuración */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-lg bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] shadow-indigo-900/5 relative overflow-hidden">
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 hover:bg-slate-100 p-2 rounded-full transition-colors duration-200 z-50"
            aria-label={t("modals.settings.close")}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>

          <div className="space-y-6 p-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">
                {t("modals.settings.account_settings_title")}
              </h2>
              <p className="text-sm text-slate-500">
                {t("modals.settings.customize_experience")}
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-b from-slate-50 to-white p-6 rounded-2xl border border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  {t("modals.settings.preferences_title")}
                </h3>

                <div className="space-y-4">
                  <div className="group flex items-center justify-between p-3 rounded-xl font-semibold text-sm text-slate-600 transition-all duration-300 hover:bg-indigo-50/80 hover:text-indigo-700 hover:translate-x-1 hover:shadow-sm">
                    <div className="flex items-center gap-3">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-slate-400 group-hover:text-indigo-600"
                      >
                        <path d="M6 8a6 6 0 0 1 12 0c0 7 4 11 4 11H2s4-4 4-11" />
                        <path d="M9.02 19a3 3 0 0 0 5.96 0" />
                      </svg>
                      <div>
                        <p className="font-medium">
                          {t("modals.settings.email_notifications_label")}
                        </p>
                        <p className="text-xs text-slate-500 group-hover:text-indigo-500">
                          {t("modals.settings.email_notifications_desc")}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={emailNotifications}
                      onClick={() => setEmailNotifications(!emailNotifications)}
                      className={`h-6 w-11 rounded-full relative transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${emailNotifications ? "bg-indigo-500" : "bg-slate-200"}`}
                    >
                      <div
                        className={`h-5 w-5 rounded-full bg-white absolute top-0.5 shadow-sm transition-all duration-300 ${emailNotifications ? "left-[calc(100%-1.25rem)]" : "left-0.5"}`}
                      ></div>
                    </button>
                  </div>

                  <div className="group flex items-center justify-between p-3 rounded-xl font-semibold text-sm text-slate-600 transition-all duration-300 hover:bg-indigo-50/80 hover:text-indigo-700 hover:translate-x-1 hover:shadow-sm">
                    <div className="flex items-center gap-3">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-slate-400 group-hover:text-indigo-600"
                      >
                        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                      </svg>
                      <div>
                        <p className="font-medium">
                          {t("modals.settings.dark_mode_label")}
                        </p>
                        <p className="text-xs text-slate-500 group-hover:text-indigo-500">
                          {t("modals.settings.dark_interface_desc")}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={darkMode}
                      onClick={() => setDarkMode(!darkMode)}
                      className={`h-6 w-11 rounded-full relative transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${darkMode ? "bg-indigo-500" : "bg-slate-200"}`}
                    >
                      <div
                        className={`h-5 w-5 rounded-full bg-white absolute top-0.5 shadow-sm transition-all duration-300 ${darkMode ? "left-[calc(100%-1.25rem)]" : "left-0.5"}`}
                      ></div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-b from-slate-50 to-white p-6 rounded-2xl border border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  {t("modals.settings.privacy_title")}
                </h3>

                <div className="space-y-4">
                  <p className="text-sm text-slate-600">
                    {t("modals.settings.privacy_desc")}
                  </p>

                  <Button
                    variant="outline"
                    className="w-full border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-300 hover:translate-x-1"
                  >
                    {t("modals.settings.view_privacy_policy")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Perfil Personalizado */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="sm:max-w-lg bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] shadow-indigo-900/5 relative overflow-hidden">
          <button
            onClick={() => setIsProfileOpen(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 hover:bg-slate-100 p-2 rounded-full transition-colors duration-200 z-50"
            aria-label={t("modals.settings.close")}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>

          <div className="space-y-6 p-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">
                {t("modals.settings.user_profile_title")}
              </h2>
              <p className="text-sm text-slate-500">
                {t("modals.settings.manage_info_desc")}
              </p>
            </div>

            <div className="flex items-center gap-4 bg-gradient-to-b from-slate-50 to-white p-6 rounded-2xl border border-slate-100">
              <Avatar className="h-16 w-16 border-2 border-white shadow-md">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt={userInfo.displayName} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-[#004B63] to-[#00BCD4] text-white text-xl font-semibold">
                    {userInfo.initials}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  {userInfo.displayName}
                </h3>
                <p className="text-sm text-slate-500">
                  {userInfo.displayEmail}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  ID: {userId || t("common.not_available")}
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-b from-slate-50 to-white p-6 rounded-2xl border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                {t("modals.settings.account_info_title")}
              </h3>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="group p-3 rounded-xl transition-all duration-300 hover:bg-indigo-50/80 hover:translate-x-1">
                    <p className="text-sm font-medium text-slate-500 group-hover:text-indigo-600">
                      {t("modals.settings.role_label")}
                    </p>
                    <p className="text-sm text-slate-800 font-semibold group-hover:text-indigo-700">
                      {userInfo.role === "teacher"
                        ? t("mobile_menu.role_teacher")
                        : t("mobile_menu.role_student")}
                    </p>
                  </div>

                  <div className="group p-3 rounded-xl transition-all duration-300 hover:bg-indigo-50/80 hover:translate-x-1">
                    <p className="text-sm font-medium text-slate-500 group-hover:text-indigo-600">
                      {t("modals.settings.status_label")}
                    </p>
                    <p className="text-sm text-green-600 font-semibold group-hover:text-green-700">
                      {t("modals.settings.active_status")}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <p className="text-sm text-slate-600 mb-4">
                    {t("modals.settings.clerk_profile_desc")}
                  </p>

                  <Button
                    onClick={() => {
                      // openUserProfile era el modal de Clerk; abrimos la
                      // tarjeta de perfil propia.
                      setIsProfileOpen(false);
                      setShowProfile(true);
                    }}
                    className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                  >
                    {t("modals.settings.open_full_profile")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showProfile && (
        <Dialog open={showProfile} onOpenChange={setShowProfile}>
          <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border-0">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-[#334155]">
                {t("mobile_menu.my_profile")}
              </DialogTitle>
            </DialogHeader>
            <ErrorBoundary>
              <UserProfileSmartCard userId={userId} />
            </ErrorBoundary>
          </DialogContent>
        </Dialog>
      )}

      {showHistory && (
        <Dialog open={showHistory} onOpenChange={setShowHistory}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border-0">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-[#334155]">
                {t("mobile_menu.my_history")}
              </DialogTitle>
            </DialogHeader>
            <ErrorBoundary>
              <Suspense
                fallback={
                  <div className="p-8 text-center text-sm text-slate-500">
                    {t("common.loading")}
                  </div>
                }
              >
                <ActivityHistory userId={userId} />
              </Suspense>
            </ErrorBoundary>
          </DialogContent>
        </Dialog>
      )}

      {showStudyPlanner && (
        <Dialog open={showStudyPlanner} onOpenChange={setShowStudyPlanner}>
          <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border-0">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-[#334155]">
                {t("mobile_menu.study_plan")}
              </DialogTitle>
            </DialogHeader>
            <ErrorBoundary>
              <Suspense
                fallback={
                  <div className="p-8 text-center text-sm text-slate-500">
                    {t("common.loading")}
                  </div>
                }
              >
                <StudyPlannerModal onClose={() => setShowStudyPlanner(false)} />
              </Suspense>
            </ErrorBoundary>
          </DialogContent>
        </Dialog>
      )}

      {showCourses && (
        <Dialog open={showCourses} onOpenChange={setShowCourses}>
          <DialogContent className="sm:max-w-[800px] max-h-[85vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border-0">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-[#334155]">
                {t("modals.certificates.my_courses_title")}
              </DialogTitle>
            </DialogHeader>
            <ErrorBoundary>
              <UserCoursesDashboard />
            </ErrorBoundary>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default UserDropdownMenuPremium;
