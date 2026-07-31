import { useState, useRef, useEffect, lazy, Suspense } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuthIdentity } from "../../hooks/useAuthIdentity";
import { useStudentProfile } from "../../hooks/useStudentProfile";
import { PageLoader } from "../LoadingScreen";
import ContactModal from "../ContactModal";
import LeadCaptureModal from "../LeadCaptureModal";
import AdminLoginModal from "../AdminLoginModal";
import { ProgressProvider } from "../../context/ProgressContext";
import { useTranslation } from "../../i18n/I18nProvider";
import ScrollToTop from "./ScrollToTop";
import MobileDrawer from "./MobileDrawer";
import HeaderFluidIsland from "./HeaderFluidIsland";
import FloatingParticles from "../FloatingParticles";

// Lazy load components
const GlobalCanvas = lazy(() => import("../GlobalCanvas"));

const AppLayout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isSignedIn } = useAuthIdentity();
  const { profile: clerkUser } = useStudentProfile();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [drawerClosing, setDrawerClosing] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showLeadCaptureModal, setShowLeadCaptureModal] = useState(false);
  const [adminLoginModalOpen, setAdminLoginModalOpen] = useState(false);

  const closeDrawer = () => {
    if (drawerClosing) return;
    setDrawerClosing(true);
    setTimeout(() => {
      setMobileMenuOpen(false);
      setDrawerClosing(false);
    }, 250);
  };

  const navigateToSection = (route, sectionId = null) => {
    navigate(route);
    if (sectionId) {
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section)
          section.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
    closeDrawer();
  };

  const openContactModal = () => {
    setShowContactModal(true);
    closeDrawer();
  };

  const location = useLocation();

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

        <HeaderFluidIsland onOpenMobileMenu={() => setMobileMenuOpen(true)} />

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
