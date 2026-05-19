import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/react';
import { PageLoader } from '../LoadingScreen';
import ContactModal from '../ContactModal';
import LeadCaptureModal from '../LeadCaptureModal';
import AdminLoginModal from '../AdminLoginModal';
import UserDropdownMenuPremium from '../UserDropdownMenuPremium';
import UserDropdownMenuSimplified from '../UserDropdownMenuSimplified';
import { ProgressProvider } from '../../context/ProgressContext';
import ScrollToTop from './ScrollToTop';
import FloatingParticles from '../FloatingParticles';

// Lazy load components
const GlobalCanvas = lazy(() => import('../GlobalCanvas'));

const AppLayout = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { user: clerkUser } = useUser();
  
  // Estados para modales y menú móvil
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [drawerClosing, setDrawerClosing] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showLeadCaptureModal, setShowLeadCaptureModal] = useState(false);
  const [adminLoginModalOpen, setAdminLoginModalOpen] = useState(false);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  
  const loginDropdownRef = useRef(null);
  const contactInfoRef = useRef(null);

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (loginDropdownRef.current && !loginDropdownRef.current.contains(e.target)) {
        setShowLoginDropdown(false);
      }
      if (contactInfoRef.current && !contactInfoRef.current.contains(e.target)) {
        setShowContactInfo(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cerrar menú móvil con Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen]);
  
  // Cerrar drawer con animación
  const closeDrawer = () => {
    if (drawerClosing) return;
    setDrawerClosing(true);
    setTimeout(() => {
      setMobileMenuOpen(false);
      setDrawerClosing(false);
    }, 250);
  };
  
  // Función para navegación con scroll a secciones
  const navigateToSection = (route, sectionId = null) => {
    navigate(route);
    
    if (sectionId) {
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
    
    closeDrawer();
  };
  
  // Función para abrir modal de contacto
  const openContactModal = () => {
    setShowContactModal(true);
    closeDrawer();
  };
  
  const location = useLocation();
  
  // Renderizar header condicionalmente basado en la ruta actual
  const shouldShowHeader = () => {
    if (location.pathname.includes('/ialab') || location.pathname === '/login' || location.pathname.includes('/vak') || location.pathname.includes('/smartboard') || location.pathname.includes('/conoce-smartboard')) {
      return false;
    }
    return true;
  };
  
  return (
    <ProgressProvider>
      <div className="flex flex-col min-h-screen bg-white text-[#004B63]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
        <Suspense fallback={null}>
          <GlobalCanvas />
        </Suspense>

      {/* Global Particle Background - Full viewport behind everything */}
      <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden" aria-hidden="true">
        <FloatingParticles count={45} colors={['#4DA8C4', '#66CCCC', '#004B63', '#B2D8E5']} />
      </div>
      
      {/* Header - Navigation Premium (floats over content) */}
      {shouldShowHeader() && (
        <header className="absolute top-0 left-0 w-full z-50 bg-transparent">
            
            {/* 3D Ambient Orbs - Background depth effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
              {/* Large atmospheric bg-orbs with blur */}
              <div className="absolute w-[400px] h-[400px] rounded-full opacity-20 -top-[280px] -right-[100px]" 
                   style={{ background: 'radial-gradient(circle, rgba(77,168,196,0.25), transparent 70%)', filter: 'blur(60px)', animation: 'orb-float-1 8s ease-in-out infinite' }} />
              <div className="absolute w-[300px] h-[300px] rounded-full opacity-15 -bottom-[200px] -left-[80px]"
                   style={{ background: 'radial-gradient(circle, rgba(0,75,99,0.2), transparent 70%)', filter: 'blur(50px)', animation: 'orb-float-2 10s ease-in-out infinite' }} />
              <div className="absolute w-[200px] h-[200px] rounded-full opacity-10 top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2"
                   style={{ background: 'radial-gradient(circle, rgba(102,204,204,0.18), transparent 70%)', filter: 'blur(40px)', animation: 'orb-float-3 6s ease-in-out infinite' }} />

              {/* Small floating ambient orbs */}
              <div className="absolute top-[10%] left-[5%] w-2 h-2 bg-[#4DA8C4]/20 rounded-full animate-[float-3d_6s_ease-in-out_infinite]" style={{ animationDelay: '-2s' }} />
              <div className="absolute top-[60%] left-[2%] w-1.5 h-1.5 bg-[#66CCCC]/18 rounded-full animate-[float-3d_8s_ease-in-out_infinite]" style={{ animationDelay: '-1s' }} />
              <div className="absolute top-[20%] left-[15%] w-1.5 h-1.5 bg-[#B2D8E5]/15 rounded-full animate-[float-3d_7s_ease-in-out_infinite]" style={{ animationDelay: '-3s' }} />
              <div className="absolute top-[15%] right-[15%] w-2 h-2 bg-[#4DA8C4]/18 rounded-full animate-[float-3d_7s_ease-in-out_infinite]" />
              <div className="absolute top-[65%] right-[8%] w-1.5 h-1.5 bg-[#66CCCC]/20 rounded-full animate-[float-3d_9s_ease-in-out_infinite]" />
              <div className="absolute top-[30%] right-[25%] w-2.5 h-2.5 bg-[#B2D8E5]/12 rounded-full animate-[float-3d_8s_ease-in-out_infinite]" style={{ animationDelay: '-4s' }} />
              <div className="absolute top-[80%] right-[20%] w-1.5 h-1.5 bg-[#4DA8C4]/15 rounded-full animate-[float-3d_10s_ease-in-out_infinite]" style={{ animationDelay: '-2s' }} />
              <div className="absolute top-[50%] left-[35%] w-1 h-1 bg-[#66CCCC]/15 rounded-full animate-[float-3d_6s_ease-in-out_infinite]" style={{ animationDelay: '-5s' }} />
            </div>

            {/* Subtle Floating Particles */}
            <FloatingParticles count={12} className="z-0" colors={['#4DA8C4', '#66CCCC', '#004B63', '#B2D8E5']} />

            {/* Orbf keyframes injected for header scope */}
            <style>{`
              @keyframes orb-float-1 {
                0%, 100% { transform: translate(0, 0) scale(1); }
                33% { transform: translate(20px, -15px) scale(1.05); }
                66% { transform: translate(-15px, 15px) scale(0.95); }
              }
              @keyframes orb-float-2 {
                0%, 100% { transform: translate(0, 0) scale(1); }
                33% { transform: translate(-20px, 10px) scale(1.05); }
                66% { transform: translate(15px, -15px) scale(0.95); }
              }
              @keyframes orb-float-3 {
                0%, 100% { transform: translate(0, 0) scale(1); }
                50% { transform: translate(0, 0) scale(1.1); }
              }
              @keyframes float-3d {
                0%, 100% { transform: translateY(0px); opacity: 0.6; }
                50% { transform: translateY(-10px); opacity: 1; }
              }
              @keyframes particle-float-3d {
                0%, 100% { transform: translate(0, 0) scale(1) translateZ(0); opacity: 0.2; }
                25% { transform: translate(15px, -20px) scale(1.2) translateZ(10px); opacity: 0.5; }
                50% { transform: translate(-10px, -40px) scale(0.7) translateZ(-10px); opacity: 0.15; }
                75% { transform: translate(20px, -15px) scale(1.1) translateZ(5px); opacity: 0.4; }
              }
            `}</style>

            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between relative z-10">
              {/* Logo - Premium Clean */}
              <div className="flex items-center">
                <button 
                  onClick={() => navigate('/')}
                  aria-label="Ir al inicio"
                  style={{ 
                    background: 'transparent', 
                    border: 'none', 
                    padding: '0',
                    outline: 'none',
                  }}
                >
                  <img 
                    src="/images/logo-edutechlife.webp" 
                    alt="Edutechlife" 
                    className="w-24 object-contain"
                    style={{ 
                      height: '80px',
                      transform: 'scale(1.8)',
                      transformOrigin: 'left center',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      boxShadow: 'none',
                    }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </button>
              </div>
              
              {/* Navigation Links - Desktop */}
              <nav className="hidden md:flex items-center gap-3">
                {/* Dropdown Iniciar Sesión */}
                <div className="relative" ref={loginDropdownRef}>
                  <button
                    onClick={() => setShowLoginDropdown(!showLoginDropdown)}
                    className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] hover:from-[#66CCCC] hover:to-[#4DA8C4] rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    <i className="fa-solid fa-right-to-bracket text-xs text-white"></i>
                    Iniciar Sesión
                    <i className={`fa-solid fa-chevron-down text-[10px] text-white ml-1 transition-transform duration-200 ${showLoginDropdown ? 'rotate-180' : ''}`}></i>
                  </button>
                  
                  {/* Dropdown menu */}
                  <div className={`absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#4DA8C4]/10 p-2 transition-all duration-200 z-50 ${
                    showLoginDropdown ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                  }`}>
                    <button onClick={() => { navigate('/ialab'); setShowLoginDropdown(false); }} className="w-full text-left px-3 py-2 text-sm font-semibold text-[#004B63] hover:bg-[#4DA8C4]/10 rounded-lg transition-colors flex items-center gap-2">
                      <i className="fa-solid fa-robot text-[#4DA8C4]"></i>
                      IA Lab Pro
                    </button>
                    <button onClick={() => { navigate('/sign-up/smartboard'); setShowLoginDropdown(false); }} className="w-full text-left px-3 py-2 text-sm font-semibold text-[#004B63] hover:bg-[#4DA8C4]/10 rounded-lg transition-colors flex items-center gap-2">
                      <i className="fa-solid fa-chalkboard text-[#4DA8C4]"></i>
                      SmartBoard
                    </button>
                  </div>
                </div>
                
                {/* Contacto - Inline Info */}
                <div className="relative" ref={contactInfoRef}>
                  <button
                    onClick={() => setShowContactInfo(!showContactInfo)}
                    className="px-4 py-2 text-sm font-semibold text-white bg-[#4DA8C4] hover:bg-[#004B63] rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    <i className="fa-solid fa-envelope text-xs text-white"></i>
                    Contacto
                  </button>
                  
                  <div className={`absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-[#4DA8C4]/10 p-4 transition-all duration-200 z-50 ${
                    showContactInfo ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                  }`}>
                    <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100">
                      <div className="w-9 h-9 rounded-full bg-[#4DA8C4]/10 flex items-center justify-center">
                        <i className="fa-solid fa-headset text-[#4DA8C4]"></i>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#004B63]">Contáctanos</p>
                        <p className="text-xs text-gray-500">Estamos aquí para ayudarte</p>
                      </div>
                    </div>
                    <a href="mailto:info@edutechlife.co" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#4DA8C4]/5 transition-colors text-sm text-[#004B63]">
                      <i className="fa-solid fa-envelope text-[#4DA8C4] w-4 text-center"></i>
                      info@edutechlife.co
                    </a>
                    <a href="https://wa.me/573001234567" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#4DA8C4]/5 transition-colors text-sm text-[#004B63]">
                      <i className="fa-brands fa-whatsapp text-[#4DA8C4] w-4 text-center"></i>
                      WhatsApp
                    </a>
                    <button
                      onClick={() => { setShowContactInfo(false); openContactModal(); }}
                      className="w-full mt-2 px-3 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] rounded-lg hover:from-[#66CCCC] hover:to-[#4DA8C4] transition-all flex items-center justify-center gap-2"
                    >
                      <i className="fa-solid fa-paper-plane text-xs"></i>
                      Enviar mensaje
                    </button>
                  </div>
                </div>
                
                {/* User Dropdown para usuarios autenticados */}
                {isSignedIn && clerkUser && (
                  <div className="ml-2">
                    <UserDropdownMenuPremium 
                      userInfo={clerkUser}
                      onNavigate={navigate}
                    />
                  </div>
                )}
              </nav>
              
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 text-[#004B63] hover:text-[#4DA8C4] hover:bg-[#4DA8C4]/10 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004B63]/50"
                aria-label="Abrir menú"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </header>
        )}

      {/* Floating hamburger for routes without header (except /ialab and /smartboard which have their own) */}
      {!shouldShowHeader() && !location.pathname.includes('/ialab') && !location.pathname.includes('/smartboard') && (
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="fixed bottom-6 right-6 z-[999] md:hidden p-3 text-white bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] rounded-full shadow-lg hover:shadow-xl transition-all safe-area-bottom focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004B63]/50"
          aria-label="Abrir menú"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Mobile Menu Drawer */}
      {(mobileMenuOpen || drawerClosing) && (
            <>
              {/* Backdrop */}
              <div 
                className={`fixed inset-0 z-[1001] bg-black/50 backdrop-blur-sm md:hidden ${drawerClosing ? 'animate-fade-out' : ''}`}
                role="presentation"
                onClick={closeDrawer}
              />
              {/* Drawer - Expanded with scroll */}
              <div 
                role="dialog"
                aria-modal="true"
                aria-label="Menú de navegación"
                className={`fixed top-0 right-0 z-[1002] h-dvh w-80 bg-white shadow-2xl md:hidden flex flex-col ${drawerClosing ? 'animate-slide-out' : 'animate-slide-in'}`}
                style={{ willChange: 'transform' }}
              >
                {/* Header */}
                <div className="p-4 border-b border-[#4DA8C4]/20 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center">
                    <img 
                      src="/images/logo-edutechlife.webp" 
                      alt="Edutechlife" 
                      className="w-24 object-contain"
                      style={{ 
                        height: '80px',
                        transform: 'scale(1.8)',
                        transformOrigin: 'left center',
                      }}
                    />
                  </div>
                  <button 
                    onClick={closeDrawer}
                    className="p-2 text-[#004B63] hover:text-[#4DA8C4] hover:bg-[#4DA8C4]/10 rounded-full transition-all duration-300"
                    aria-label="Cerrar menú"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Mobile Menu Content */}
                <div className="flex-1 overflow-y-auto p-4 pb-20">
                  {/* User Info Section */}
                  {isSignedIn && clerkUser && (
                    <div className="mb-6 pb-4 border-b border-[#4DA8C4]/10">
                      <UserDropdownMenuSimplified 
                        userInfo={clerkUser}
                        onNavigate={navigate}
                      />
                    </div>
                  )}
                  
                  {/* Navigation Categories */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xs font-semibold text-[#4DA8C4] uppercase tracking-wider mb-2">INICIO</h3>
                      <div className="space-y-1">
                        <button 
                          onClick={() => navigate('/')}
                          className="w-full text-left px-3 py-2 text-sm text-[#004B63] hover:bg-[#4DA8C4]/10 rounded-lg transition-colors"
                        >
                          Herramientas IA
                        </button>
                        <button 
                          onClick={() => navigateToSection('/', 'metodo')}
                          className="w-full text-left px-3 py-2 text-sm text-[#004B63] hover:bg-[#4DA8C4]/10 rounded-lg transition-colors"
                        >
                          Método
                        </button>
                        <button 
                          onClick={() => navigateToSection('/', 'aliados')}
                          className="w-full text-left px-3 py-2 text-sm text-[#004B63] hover:bg-[#4DA8C4]/10 rounded-lg transition-colors"
                        >
                          Aliados
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xs font-semibold text-[#4DA8C4] uppercase tracking-wider mb-2">HERRAMIENTAS</h3>
                      <div className="space-y-1">
                        <button 
                          onClick={() => navigate('/ialab')}
                          className="w-full text-left px-3 py-2 text-sm text-[#004B63] hover:bg-[#4DA8C4]/10 rounded-lg transition-colors"
                        >
                          IA Lab Pro
                        </button>
                        <button 
                          onClick={() => navigate('/sign-up/smartboard')}
                          className="w-full text-left px-3 py-2 text-sm text-[#004B63] hover:bg-[#4DA8C4]/10 rounded-lg transition-colors"
                        >
                          SmartBoard
                        </button>
                        <button 
                          onClick={() => navigate('/vak')}
                          className="w-full text-left px-3 py-2 text-sm text-[#004B63] hover:bg-[#4DA8C4]/10 rounded-lg transition-colors"
                        >
                          Diagnóstico VAK
                        </button>
                        <button 
                          onClick={() => navigate('/automation')}
                          className="w-full text-left px-3 py-2 text-sm text-[#004B63] hover:bg-[#4DA8C4]/10 rounded-lg transition-colors"
                        >
                          Automatización
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xs font-semibold text-[#4DA8C4] uppercase tracking-wider mb-2">CONTACTO</h3>
                      <div className="space-y-1">
                        <button 
                          onClick={openContactModal}
                          className="w-full text-left px-3 py-2 text-sm text-[#004B63] hover:bg-[#4DA8C4]/10 rounded-lg transition-colors"
                        >
                          Contáctanos
                        </button>
                        <button 
                          onClick={() => setShowLeadCaptureModal(true)}
                          className="w-full text-left px-3 py-2 text-sm text-[#004B63] hover:bg-[#4DA8C4]/10 rounded-lg transition-colors"
                        >
                          Solicitar Demo
                        </button>
                      </div>
                    </div>
                  </div>

                  {!isSignedIn && (
                    <div className="mt-6 pt-4 border-t border-[#4DA8C4]/20 space-y-2">
                      <button
                        onClick={() => { closeDrawer(); navigate('/login'); }}
                        className="w-full py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] rounded-full shadow-md hover:shadow-lg transition-all"
                      >
                        <i className="fa-solid fa-right-to-bracket mr-2"></i>
                        Iniciar Sesión
                      </button>
                      <button
                        onClick={() => { closeDrawer(); setShowLeadCaptureModal(true); }}
                        className="w-full py-3 text-sm font-semibold text-[#004B63] border-2 border-[#4DA8C4]/30 rounded-full hover:border-[#4DA8C4] transition-colors"
                      >
                        Solicitar Demo Gratuita
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
      
        {/* Main Content Area */}
        <main className="flex-1">
          <ScrollToTop />
          <Suspense fallback={<PageLoader message="Cargando contenido..." />}>
            <Outlet />
          </Suspense>
        </main>
      
        {/* Modales Globales */}
        <ContactModal 
          isOpen={showContactModal} 
          onClose={() => setShowContactModal(false)} 
        />
        <LeadCaptureModal 
          isOpen={showLeadCaptureModal} 
          onClose={() => setShowLeadCaptureModal(false)} 
        />
        <AdminLoginModal 
          isOpen={adminLoginModalOpen} 
          onClose={() => setAdminLoginModalOpen(false)} 
        />
      </div>
    </ProgressProvider>
  );
};

export default AppLayout;