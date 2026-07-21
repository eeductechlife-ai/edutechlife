import { useState, useRef, useEffect, lazy, Suspense } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth, useUser } from "@clerk/react";
import { PageLoader } from "../LoadingScreen";
import ContactModal from "../ContactModal";
import LeadCaptureModal from "../LeadCaptureModal";
import AdminLoginModal from "../AdminLoginModal";
import UserDropdownMenuPremium from "../userDropdownMenuPremium";
import { ProgressProvider } from "../../context/ProgressContext";
import { useTranslation } from "../../i18n/I18nProvider";
import LocaleSwitcher from "../LocaleSwitcher";
import ScrollToTop from "./ScrollToTop";
import MobileDrawer from "./MobileDrawer";
import FloatingParticles from "../FloatingParticles";

// Lazy load components
const GlobalCanvas = lazy(() => import("../GlobalCanvas"));

const AppLayout = () => {
  const { t } = useTranslation();
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
      if (
        loginDropdownRef.current &&
        !loginDropdownRef.current.contains(e.target)
      ) {
        setShowLoginDropdown(false);
      }
      if (
        contactInfoRef.current &&
        !contactInfoRef.current.contains(e.target)
      ) {
        setShowContactInfo(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cerrar menú móvil con Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
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
          section.scrollIntoView({ behavior: "smooth", block: "start" });
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
    if (
      location.pathname.includes("/ialab") ||
      location.pathname === "/login" ||
      location.pathname.includes("/vak") ||
      location.pathname.includes("/smartboard") ||
      location.pathname.includes("/conoce-smartboard")
    ) {
      return false;
    }
    return true;
  };

  return (
    <ProgressProvider>
      <div
        className="flex flex-col min-h-screen bg-white text-[#004B63]"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        <Suspense
          fallback={
            <div
              className="fixed inset-0 z-[-1] bg-gradient-to-b from-petroleum/5 to-transparent"
              aria-hidden="true"
            />
          }
        >
          <GlobalCanvas />
        </Suspense>

        {/* Global Particle Background - Full viewport behind header and content */}
        <div
          className="fixed inset-0 z-[5] pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <FloatingParticles
            count={45}
            colors={["#4DA8C4", "#66CCCC", "#004B63", "#B2D8E5"]}
          />
        </div>

        {/* Header - Navigation Premium (fixed glass with integrated 3D orbs) */}
        {shouldShowHeader() && (
          <header className="fixed top-0 left-0 w-full z-50 bg-white/50 backdrop-blur-lg">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-2 sm:py-3 flex items-center justify-between relative z-10">
              {/* Logo - Premium Clean */}
              <div className="flex items-center">
                <button
                  onClick={() => navigate("/")}
                  aria-label={t("nav.home_aria")}
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: "0",
                    outline: "none",
                  }}
                >
                  <img
                    src="/images/logo-edutechlife.webp"
                    alt="Edutechlife"
                    className="w-20 sm:w-24 md:w-24 lg:w-24 object-contain"
                    style={{
                      height: "80px",
                      transform: "scale(1.8)",
                      transformOrigin: "left center",
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      boxShadow: "none",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </button>
              </div>

              {/* Navigation Links - Desktop */}
              <nav className="hidden md:flex items-center gap-3">
                <LocaleSwitcher />
                {/* Dropdown Iniciar Sesión */}
                <div className="relative" ref={loginDropdownRef}>
                  <button
                    onClick={() => setShowLoginDropdown(!showLoginDropdown)}
                    className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] hover:from-[#66CCCC] hover:to-[#4DA8C4] rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    <i className="fa-solid fa-right-to-bracket text-xs text-white"></i>
                    {t("nav.login")}
                    <i
                      className={`fa-solid fa-chevron-down text-[10px] text-white ml-1 transition-transform duration-200 ${showLoginDropdown ? "rotate-180" : ""}`}
                    ></i>
                  </button>

                  {/* Dropdown menu */}
                  <div
                    className={`absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#4DA8C4]/10 p-2 transition-all duration-200 z-50 ${
                      showLoginDropdown
                        ? "opacity-100 visible"
                        : "opacity-0 invisible pointer-events-none"
                    }`}
                  >
                    <button
                      onClick={() => {
                        navigate("/ialab");
                        setShowLoginDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm font-semibold text-[#004B63] hover:bg-[#4DA8C4]/10 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <i className="fa-solid fa-robot text-[#4DA8C4]"></i>
                      {t("nav.ialab_pro")}
                    </button>
                    <button
                      onClick={() => {
                        navigate("/sign-up/smartboard");
                        setShowLoginDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm font-semibold text-[#004B63] hover:bg-[#4DA8C4]/10 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <i className="fa-solid fa-chalkboard text-[#4DA8C4]"></i>
                      {t("nav.smartboard")}
                    </button>
                    <button
                      onClick={() => {
                        navigate("/planes");
                        setShowLoginDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm font-semibold text-[#004B63] hover:bg-[#4DA8C4]/10 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <i className="fa-solid fa-tag text-[#D4A017]"></i>
                      {t("nav.planes")}
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
                    {t("nav.contact")}
                  </button>

                  <div
                    className={`absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-[#4DA8C4]/10 p-4 transition-all duration-200 z-50 ${
                      showContactInfo
                        ? "opacity-100 visible"
                        : "opacity-0 invisible pointer-events-none"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100">
                      <div className="w-9 h-9 rounded-full bg-[#4DA8C4]/10 flex items-center justify-center">
                        <i className="fa-solid fa-headset text-[#4DA8C4]"></i>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#004B63]">
                          {t("nav.contact_title")}
                        </p>
                        <p className="text-xs text-gray-500">
                          {t("nav.contact_subtitle")}
                        </p>
                      </div>
                    </div>
                    <a
                      href="mailto:info@edutechlife.co"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#4DA8C4]/5 transition-colors text-sm text-[#004B63]"
                    >
                      <i className="fa-solid fa-envelope text-[#4DA8C4] w-4 text-center"></i>
                      info@edutechlife.co
                    </a>
                    <a
                      href="https://wa.me/573001234567"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#4DA8C4]/5 transition-colors text-sm text-[#004B63]"
                    >
                      <i className="fa-brands fa-whatsapp text-[#4DA8C4] w-4 text-center"></i>
                      {t("nav.whatsapp")}
                    </a>
                    <button
                      onClick={() => {
                        setShowContactInfo(false);
                        openContactModal();
                      }}
                      className="w-full mt-2 px-3 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] rounded-lg hover:from-[#66CCCC] hover:to-[#4DA8C4] transition-all flex items-center justify-center gap-2"
                    >
                      <i className="fa-solid fa-paper-plane text-xs"></i>
                      {t("nav.send_message")}
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
                aria-label={t("nav.menu_aria")}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </header>
        )}

        {/* Floating hamburger for routes without header (except /ialab and /smartboard which have their own) */}
        {!shouldShowHeader() &&
          !location.pathname.includes("/ialab") &&
          !location.pathname.includes("/smartboard") && (
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="fixed bottom-6 right-6 z-[999] md:hidden p-3 text-white bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] rounded-full shadow-lg hover:shadow-xl transition-all safe-area-bottom focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004B63]/50"
              aria-label={t("nav.menu_aria")}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}

        {(mobileMenuOpen || drawerClosing) && (
          <MobileDrawer
            drawerClosing={drawerClosing}
            onClose={closeDrawer}
            isSignedIn={isSignedIn}
            clerkUser={clerkUser}
            navigate={navigate}
            navigateToSection={navigateToSection}
            openContactModal={openContactModal}
            setShowLeadCaptureModal={setShowLeadCaptureModal}
            t={t}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1">
          <ScrollToTop />
          <Suspense fallback={<PageLoader message={t("header.loading")} />}>
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
