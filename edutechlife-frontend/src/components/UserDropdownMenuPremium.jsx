import React, { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/react';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Icon } from '../utils/iconMapping.jsx';
import { getClerkUserInfo } from '../utils/clerk-utils';
import UserProfileSmartCard from './UserProfileSmartCard';
import ActivityHistory from './ActivityHistory';
import ErrorBoundary from './forum/ErrorBoundary';
import { useTranslation } from '../i18n/I18nProvider';
import StudyPlannerModal from './IALab/StudyPlannerModal';
import UserCoursesDashboard from './IALab/UserCoursesDashboard';

/**
 * UserDropdownMenuPremium - Componente premium con shadcn/ui
 * 
 * Características:
 * 1. Diseño premium con shadcn components
 * 2. Integración oficial con Clerk (@clerk/react)
 * 3. Estilos corporativos Edutechlife
 * 4. Funcionalidades 100% operativas con fallback robusto
 */
const UserDropdownMenuPremium = ({ onNavigate }) => {
  const { t } = useTranslation();
  // Estados faltantes - CRÍTICO para estabilización
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showStudyPlanner, setShowStudyPlanner] = useState(false);
  const [showCourses, setShowCourses] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Integración oficial Clerk - Patrón recomendado
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut, openUserProfile } = useClerk();
  
  // Manejo de estado de carga - Patrón clerk-react-patterns
  useEffect(() => {
    if (isLoaded) {
      setIsLoading(false);
    }
  }, [isLoaded]);
  
  // Clerk es el ÚNICO proveedor de identidad
  const userInfo = getClerkUserInfo(user);
  
  // Manejar logout exclusivamente con Clerk oficial
  const handleLogout = async () => {
    try {
      await signOut();
      if (onNavigate) {
        onNavigate('landing');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };
  
  // Manejar perfil con Clerk oficial - Patrón clerk-react-patterns
  const handleProfile = () => {
    if (openUserProfile) {
      openUserProfile();
    } else {
      setIsProfileOpen(true);
    }
  };
  
  // Manejar configuración
  const handleSettings = () => {
    setIsSettingsOpen(true);
  };
  
  // Manejar certificados
  const handleCertificates = () => {
    setShowCourses(true);
  };

  const handleHistory = () => setShowHistory(true);
  const handleStudyPlanner = () => setShowStudyPlanner(true);

  // Manejar cambio de contraseña integrado con Clerk
  const handleChangePassword = () => {
    if (openUserProfile) {
      // Clerk v5+ - intentar redirigir a sección de seguridad
      window.location.href = '/user-profile?section=security';
    } else {
      setIsChangePasswordOpen(true);
    }
  };
  
  // Blindaje del componente - Evita colapso total
  if (!isSignedIn) {
    return (
      <Button 
        variant="ghost" 
        className="relative h-10 w-10 rounded-full p-0"
        aria-label={t('modals.settings.unauthenticated_aria')}
        onClick={() => {
          // Redirigir a login si no está autenticado
          window.location.href = '/login';
        }}
      >
        <Avatar className="h-10 w-10 border-2 border-white">
          <AvatarFallback className="bg-slate-100 text-slate-400">
            <Icon name="user" size={16} />
          </AvatarFallback>
        </Avatar>
      </Button>
    );
  }
  
  // Fallback para usuarios no autenticados
  if (!isSignedIn) {
    return (
      <Button 
        variant="ghost" 
        className="relative h-10 w-10 rounded-full p-0 hover:bg-cyan-50"
        aria-label={t('modals.settings.sign_in_aria')}
        onClick={() => window.location.href = '/login'}
      >
        <Avatar className="h-10 w-10 border-2 border-white">
          <AvatarFallback className="bg-gradient-to-br from-slate-400 to-slate-600 text-white">
            <Icon name="fa-user" className="text-sm" />
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
            aria-label={t('modals.settings.user_menu_aria')}
          >
            <Avatar className="h-10 w-10 border-2 border-white shadow-md">
              {userInfo.avatarUrl ? (
                <AvatarImage src={userInfo.avatarUrl} alt={userInfo.displayName} />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-[#004B63] to-[#00BCD4] text-white font-semibold">
                  {userInfo.initials}
                </AvatarFallback>
              )}
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          className="w-80 border border-slate-100 shadow-2xl shadow-slate-200/50 rounded-2xl bg-white"
          align="end"
          sideOffset={8}
        >
          {/* Header con información del usuario */}
          <DropdownMenuLabel className="p-5 border-b border-slate-100 bg-slate-50">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                {userInfo.avatarUrl ? (
                  <AvatarImage src={userInfo.avatarUrl} alt={userInfo.displayName} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-[#004B63] to-[#00BCD4] text-white text-lg font-semibold">
                    {userInfo.initials}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#00374A] truncate">
                  {userInfo.displayName}
                </p>
                 <p className="text-xs text-slate-400 truncate">
                   {userInfo.displayEmail}
                 </p>
                 <div className="flex items-center gap-1 mt-2">
                    <span className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-700 uppercase font-bold rounded-full">
                      {userInfo.role === 'teacher' ? t('mobile_menu.role_teacher') : t('mobile_menu.role_student')}
                   </span>
                    {isSignedIn && (
                      <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 uppercase font-bold rounded-full">
                        Clerk
                      </span>
                    )}
                 </div>
              </div>
            </div>
          </DropdownMenuLabel>
          
           <DropdownMenuGroup className="p-2">
              {/* Mi Perfil */}
              <DropdownMenuItem 
                className="flex items-center gap-3 px-4 py-3 w-full text-left cursor-pointer text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors duration-200"
                onClick={() => setShowProfile(true)}
              >
                <div className="w-5 h-5 flex items-center justify-center text-slate-500 group-hover:text-indigo-600">
                  <Icon name="fa-user-circle" className="text-sm" />
                </div>
                <span className="text-sm font-medium">{t('mobile_menu.my_profile')}</span>
              </DropdownMenuItem>

              {/* Mi Historial */}
              <DropdownMenuItem 
                className="flex items-center gap-3 px-4 py-3 w-full text-left cursor-pointer text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors duration-200"
                onClick={handleHistory}
              >
                <div className="w-5 h-5 flex items-center justify-center text-slate-500 group-hover:text-indigo-600">
                  <Icon name="fa-chart-line" className="text-sm" />
                </div>
                <span className="text-sm font-medium">{t('mobile_menu.my_history')}</span>
              </DropdownMenuItem>

              {/* Plan de Estudio */}
              <DropdownMenuItem 
                className="flex items-center gap-3 px-4 py-3 w-full text-left cursor-pointer text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors duration-200"
                onClick={handleStudyPlanner}
              >
                <div className="w-5 h-5 flex items-center justify-center text-slate-500 group-hover:text-indigo-600">
                  <Icon name="fa-calendar" className="text-sm" />
                </div>
                <span className="text-sm font-medium">{t('mobile_menu.study_plan')}</span>
              </DropdownMenuItem>
              
              {/* Configuración */}
              <DropdownMenuItem 
                className="flex items-center gap-3 px-4 py-3 w-full text-left cursor-pointer text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors duration-200"
                onClick={handleSettings}
              >
                <div className="w-5 h-5 flex items-center justify-center text-slate-500 group-hover:text-indigo-600">
                  <Icon name="fa-cog" className="text-sm" />
                </div>
                <span className="text-sm font-medium">{t('modals.settings.tab_settings')}</span>
              </DropdownMenuItem>
               
               {/* Mis Certificados */}
               <DropdownMenuItem
                 className="flex items-center gap-3 px-4 py-3 w-full text-left cursor-pointer text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors duration-200"
                 onClick={handleCertificates}
               >
                 <div className="w-5 h-5 flex items-center justify-center text-slate-500 group-hover:text-indigo-600">
                   <Icon name="fa-medal" className="text-sm" />
                 </div>
                 <span className="text-sm font-medium">{t('mobile_menu.certificates')}</span>
               </DropdownMenuItem>

               {/* Cambiar Contraseña */}
              <DropdownMenuItem 
                className="flex items-center gap-3 px-4 py-3 w-full text-left cursor-pointer text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors duration-200"
                onClick={handleChangePassword}
              >
                <div className="w-5 h-5 flex items-center justify-center text-slate-500 group-hover:text-indigo-600">
                  <Icon name="fa-key" className="text-sm" />
                </div>
                <span className="text-sm font-medium">{t('mobile_menu.change_password')}</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          
           <DropdownMenuSeparator className="bg-slate-100" />
           
           {/* Cerrar Sesión */}
           <DropdownMenuItem 
             className="flex items-center gap-3 px-4 py-3 w-full text-left cursor-pointer text-rose-600 hover:bg-rose-50 transition-colors duration-200 border-t border-slate-100"
             onClick={handleLogout}
           >
             <div className="w-5 h-5 flex items-center justify-center">
               <Icon name="fa-sign-out" className="text-sm" />
             </div>
              <span className="text-sm font-medium">{t('sidebar.logout')}</span>
           </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Modal de Cambio de Contraseña */}
      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] shadow-indigo-900/5 relative overflow-hidden">
          {/* Botón de cerrar flotante */}
          <button
            onClick={() => setIsChangePasswordOpen(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 hover:bg-slate-100 p-2 rounded-full transition-colors duration-200 z-50"
            aria-label={t('modals.password.close')}
          >
            <Icon name="fa-times" className="text-sm" />
          </button>
          
          <div className="space-y-6 p-6">
            {/* Título personalizado */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">{t('modals.password.change_password')}</h2>
              <p className="text-sm text-slate-500">{t('modals.password.manage_security')}</p>
            </div>
            
            <div className="space-y-4">
                <p className="text-sm text-slate-600">
                 {isSignedIn 
                   ? t('modals.password.use_clerk')
                   : t('modals.password.not_available')
                 }
               </p>
              
              <div className="bg-gradient-to-br from-indigo-50/80 to-white p-4 rounded-xl border border-slate-100 transition-all duration-300 hover:shadow-sm">
                 <p className="text-sm text-slate-800 font-medium">
                   {isSignedIn 
                     ? t('modals.password.clerk_configured')
                     : t('modals.password.clerk_not_signed_in')
                   }
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
                  {t('modals.password.go_to_profile')}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Modal de Configuración */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-lg bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] shadow-indigo-900/5 relative overflow-hidden">
          {/* Botón de cerrar flotante */}
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 hover:bg-slate-100 p-2 rounded-full transition-colors duration-200 z-50"
            aria-label={t('modals.settings.close')}
          >
            <Icon name="fa-times" className="text-sm" />
          </button>
          
          <div className="space-y-6 p-6">
            {/* Título personalizado */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">{t('modals.settings.account_settings_title')}</h2>
              <p className="text-sm text-slate-500">{t('modals.settings.customize_experience')}</p>
            </div>
            
            <div className="space-y-6">
              {/* Sección Preferencias */}
              <div className="bg-gradient-to-b from-slate-50 to-white p-6 rounded-2xl border border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('modals.settings.preferences_title')}</h3>
                
                <div className="space-y-4">
                  {/* Notificaciones por email */}
                  <div className="group flex items-center justify-between p-3 rounded-xl font-semibold text-sm text-slate-600 transition-all duration-300 hover:bg-indigo-50/80 hover:text-indigo-700 hover:translate-x-1 hover:shadow-sm">
                    <div className="flex items-center gap-3">
                      <Icon name="fa-bell" className="text-slate-400 group-hover:text-indigo-600" />
                      <div>
                        <p className="font-medium">{t('modals.settings.email_notifications_label')}</p>
                        <p className="text-xs text-slate-500 group-hover:text-indigo-500">{t('modals.settings.email_notifications_desc')}</p>
                      </div>
                    </div>
                    <div className="h-6 w-11 rounded-full bg-slate-200 relative group-hover:bg-indigo-200 transition-colors duration-300">
                      <div className="h-5 w-5 rounded-full bg-white absolute top-0.5 left-0.5 shadow-sm group-hover:shadow-md transition-all duration-300"></div>
                    </div>
                  </div>
                  
                  {/* Modo oscuro */}
                  <div className="group flex items-center justify-between p-3 rounded-xl font-semibold text-sm text-slate-600 transition-all duration-300 hover:bg-indigo-50/80 hover:text-indigo-700 hover:translate-x-1 hover:shadow-sm">
                    <div className="flex items-center gap-3">
                      <Icon name="fa-moon" className="text-slate-400 group-hover:text-indigo-600" />
                      <div>
                        <p className="font-medium">{t('modals.settings.dark_mode_label')}</p>
                        <p className="text-xs text-slate-500 group-hover:text-indigo-500">{t('modals.settings.dark_interface_desc')}</p>
                      </div>
                    </div>
                    <div className="h-6 w-11 rounded-full bg-slate-200 relative group-hover:bg-indigo-200 transition-colors duration-300">
                      <div className="h-5 w-5 rounded-full bg-white absolute top-0.5 left-0.5 shadow-sm group-hover:shadow-md transition-all duration-300"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Sección Privacidad */}
              <div className="bg-gradient-to-b from-slate-50 to-white p-6 rounded-2xl border border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('modals.settings.privacy_title')}</h3>
                
                <div className="space-y-4">
                  <p className="text-sm text-slate-600">
                    {t('modals.settings.privacy_desc')}
                  </p>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-300 hover:translate-x-1"
                  >
                    {t('modals.settings.view_privacy_policy')}
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
          {/* Botón de cerrar flotante */}
          <button
            onClick={() => setIsProfileOpen(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 hover:bg-slate-100 p-2 rounded-full transition-colors duration-200 z-50"
            aria-label={t('modals.settings.close')}
          >
            <Icon name="fa-times" className="text-sm" />
          </button>
          
          <div className="space-y-6 p-6">
            {/* Título personalizado */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">{t('modals.settings.user_profile_title')}</h2>
              <p className="text-sm text-slate-500">{t('modals.settings.manage_info_desc')}</p>
            </div>
            
            {/* Cabecera con degradado */}
            <div className="flex items-center gap-4 bg-gradient-to-b from-slate-50 to-white p-6 rounded-2xl border border-slate-100">
              <Avatar className="h-16 w-16 border-2 border-white shadow-md">
                {userInfo.avatarUrl ? (
                  <AvatarImage src={userInfo.avatarUrl} alt={userInfo.displayName} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-[#004B63] to-[#00BCD4] text-white text-xl font-semibold">
                    {userInfo.initials}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">{userInfo.displayName}</h3>
                <p className="text-sm text-slate-500">{userInfo.displayEmail}</p>
                <p className="text-xs text-slate-400 mt-1">ID: {user?.id || t('common.not_available')}</p>
              </div>
            </div>
            
            {/* Información de la Cuenta */}
            <div className="bg-gradient-to-b from-slate-50 to-white p-6 rounded-2xl border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('modals.settings.account_info_title')}</h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {/* Rol */}
                  <div className="group p-3 rounded-xl transition-all duration-300 hover:bg-indigo-50/80 hover:translate-x-1">
                    <p className="text-sm font-medium text-slate-500 group-hover:text-indigo-600">{t('modals.settings.role_label')}</p>
                    <p className="text-sm text-slate-800 font-semibold group-hover:text-indigo-700">
                      {userInfo.role === 'teacher' ? t('mobile_menu.role_teacher') : t('mobile_menu.role_student')}
                    </p>
                  </div>
                  
                  {/* Estado */}
                  <div className="group p-3 rounded-xl transition-all duration-300 hover:bg-indigo-50/80 hover:translate-x-1">
                    <p className="text-sm font-medium text-slate-500 group-hover:text-indigo-600">{t('modals.settings.status_label')}</p>
                    <p className="text-sm text-green-600 font-semibold group-hover:text-green-700">{t('modals.settings.active_status')}</p>
                  </div>
                </div>
                
                {/* Separador */}
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-sm text-slate-600 mb-4">
                    {t('modals.settings.clerk_profile_desc')}
                  </p>
                  
                  <Button 
                    onClick={() => {
                      setIsProfileOpen(false);
                      if (openUserProfile) {
                        openUserProfile();
                      }
                    }}
                    className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                  >
                    {t('modals.settings.open_full_profile')}
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
               <DialogTitle className="text-lg font-bold text-[#334155]">{t('mobile_menu.my_profile')}</DialogTitle>
             </DialogHeader>
             <ErrorBoundary>
               <UserProfileSmartCard userId={user?.id} />
             </ErrorBoundary>
           </DialogContent>
         </Dialog>
       )}

       {showHistory && (
         <Dialog open={showHistory} onOpenChange={setShowHistory}>
           <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border-0">
             <DialogHeader>
               <DialogTitle className="text-lg font-bold text-[#334155]">{t('mobile_menu.my_history')}</DialogTitle>
             </DialogHeader>
             <ErrorBoundary>
               <ActivityHistory userId={user?.id} />
             </ErrorBoundary>
           </DialogContent>
         </Dialog>
       )}

        {showStudyPlanner && (
          <Dialog open={showStudyPlanner} onOpenChange={setShowStudyPlanner}>
            <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border-0">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-[#334155]">{t('mobile_menu.study_plan')}</DialogTitle>
              </DialogHeader>
              <ErrorBoundary>
                <StudyPlannerModal onClose={() => setShowStudyPlanner(false)} />
              </ErrorBoundary>
            </DialogContent>
          </Dialog>
        )}

        {showCourses && (
          <Dialog open={showCourses} onOpenChange={setShowCourses}>
            <DialogContent className="sm:max-w-[800px] max-h-[85vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border-0">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-[#334155]">{t('modals.certificates.my_courses_title')}</DialogTitle>
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