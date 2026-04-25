import { useState, lazy, Suspense } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/react';
import { PageLoader } from '../LoadingScreen';
import NicoModern from '../Nico/NicoModern';
import ContactModal from '../ContactModal';
import LeadCaptureModal from '../LeadCaptureModal';
import AdminLoginModal from '../AdminLoginModal';
import UserDropdownMenuPremium from '../UserDropdownMenuPremium';
import UserDropdownMenuSimplified from '../UserDropdownMenuSimplified';
import ScrollToTop from './ScrollToTop';

// Lazy load components
const GlobalCanvas = lazy(() => import('../GlobalCanvas'));

const AppLayout = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { user: clerkUser } = useUser();
  
  // Estados para modales y menú móvil
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showLeadCaptureModal, setShowLeadCaptureModal] = useState(false);
  const [adminLoginModalOpen, setAdminLoginModalOpen] = useState(false);
  
  // Estados para Nico (chatbot)
  const [botOpen, setBotOpen] = useState(false);
  const [isBotMinimized, setIsBotMinimized] = useState(false);
  const [isBotClosing, setIsBotClosing] = useState(false);
  const [botMsgs, setBotMsgs] = useState([{ 
    role: 'assistant', 
    text: 'Hola, soy Nico. ¿En qué puedo ayudarte hoy?',
    timestamp: new Date()
  }]);
  const [botInput, setBotInput] = useState('');
  
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
    
    setMobileMenuOpen(false);
  };
  
  // Función para abrir modal de contacto
  const openContactModal = () => {
    setShowContactModal(true);
    setMobileMenuOpen(false);
  };
  
  const location = useLocation();
  
  // Renderizar header condicionalmente basado en la ruta actual
  const shouldShowHeader = () => {
    // Ocultar header en rutas de IA Lab para experiencia inmersiva
    if (location.pathname.includes('/ialab')) {
      return false;
    }
    return true;
  };
  
  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-white text-[#004B63]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <Suspense fallback={null}>
        <GlobalCanvas />
      </Suspense>
      
      {/* Header - Navigation Premium */}
      {shouldShowHeader() && (
        <>
          <header className="sticky top-0 left-0 right-0 z-[1000] bg-white backdrop-blur-md border-b border-[#004B63]/10">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between">
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
                <button 
                  onClick={() => navigateToSection('/', 'esencia')}
                  className="px-4 py-2 text-sm font-semibold text-white bg-[#004B63] hover:bg-[#4DA8C4] rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <i className="fa-solid fa-graduation-cap text-xs text-white"></i>
                  Esencia
                </button>
                <button 
                  onClick={() => navigateToSection('/', 'ecosystem')}
                  className="px-4 py-2 text-sm font-semibold text-white bg-[#004B63] hover:bg-[#4DA8C4] rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <i className="fa-solid fa-layer-group text-xs text-white"></i>
                  Ecosistema
                </button>
                <button 
                  onClick={() => navigate('/vak')}
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] hover:from-[#66CCCC] hover:to-[#4DA8C4] rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <i className="fa-solid fa-brain text-xs"></i>
                  VAK Diagnosis
                </button>
                <button 
                  onClick={openContactModal}
                  className="px-4 py-2 text-sm font-semibold text-white bg-[#4DA8C4] hover:bg-[#004B63] rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <i className="fa-solid fa-envelope text-xs"></i>
                  Contacto
                </button>
                
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
                className="md:hidden p-2 text-[#004B63] hover:text-[#4DA8C4] hover:bg-[#4DA8C4]/10 rounded-full transition-all duration-300"
                aria-label="Abrir menú"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </header>
          
          {/* Mobile Menu Drawer */}
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-[1001] bg-black/50 backdrop-blur-sm md:hidden"
                onClick={() => setMobileMenuOpen(false)}
              />
              {/* Drawer - Expanded with scroll */}
              <div className="fixed top-0 right-0 z-[1002] h-full w-80 bg-white shadow-2xl md:hidden animate-slide-in flex flex-col">
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
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-[#004B63] hover:text-[#4DA8C4] hover:bg-[#4DA8C4]/10 rounded-full transition-all duration-300"
                    aria-label="Cerrar menú"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Mobile Menu Content */}
                <div className="flex-1 overflow-y-auto p-4">
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
                          onClick={() => navigateToSection('/', 'esencia')}
                          className="w-full text-left px-3 py-2 text-sm text-[#004B63] hover:bg-[#4DA8C4]/10 rounded-lg transition-colors"
                        >
                          Esencia
                        </button>
                        <button 
                          onClick={() => navigateToSection('/', 'ecosystem')}
                          className="w-full text-left px-3 py-2 text-sm text-[#004B63] hover:bg-[#4DA8C4]/10 rounded-lg transition-colors"
                        >
                          Ecosistema
                        </button>
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
                          onClick={() => navigate('/vak')}
                          className="w-full text-left px-3 py-2 text-sm text-[#004B63] hover:bg-[#4DA8C4]/10 rounded-lg transition-colors"
                        >
                          Diagnóstico VAK
                        </button>
                        <button 
                          onClick={() => navigate('/ialab')}
                          className="w-full text-left px-3 py-2 text-sm text-[#004B63] hover:bg-[#4DA8C4]/10 rounded-lg transition-colors"
                        >
                          IA Lab Pro
                        </button>
                        <button 
                          onClick={() => navigate('/smartboard')}
                          className="w-full text-left px-3 py-2 text-sm text-[#004B63] hover:bg-[#4DA8C4]/10 rounded-lg transition-colors"
                        >
                          SmartBoard
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
                </div>
              </div>
            </>
          )}
        </>
      )}
      
      {/* Main Content Area */}
      <main className="flex-1">
        <ScrollToTop />
        <Suspense fallback={<PageLoader message="Cargando contenido..." />}>
          <Outlet />
        </Suspense>
      </main>
      
      {/* Footer - Se renderiza condicionalmente en el componente de rutas */}
      
      {/* Nico Chatbot - oculto en IALab (solo Valerio) */}
      {!location.pathname.includes('/ialab') && <NicoModern 
        isOpen={botOpen}
        isMinimized={isBotMinimized}
        isClosing={isBotClosing}
        messages={botMsgs}
        inputValue={botInput}
        onInputChange={setBotInput}
        onToggle={() => {
          if (isBotClosing) return;
          if (botOpen) {
            setIsBotClosing(true);
            setTimeout(() => {
              setBotOpen(false);
              setIsBotClosing(false);
            }, 300);
          } else {
            setBotOpen(true);
            setIsBotMinimized(false);
          }
        }}
        onMinimize={() => setIsBotMinimized(true)}
        onSend={() => {
          // Lógica para enviar mensaje (se implementará después)
          console.log('Enviar mensaje:', botInput);
          setBotInput('');
        }}
        onNavigate={navigate}
      />}
      
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
        onLogin={() => {
          setAdminLoginModalOpen(false);
          navigate('/admin');
        }}
      />
    </div>
  );
};

export default AppLayout;