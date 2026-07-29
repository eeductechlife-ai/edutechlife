import LocaleSwitcher from "../LocaleSwitcher";
import UserDropdownMenuSimplified from "../UserDropdownMenuSimplified";

const MobileDrawer = ({
  drawerClosing,
  onClose,
  isSignedIn,
  clerkUser,
  navigate,
  navigateToSection,
  openContactModal,
  setShowLeadCaptureModal,
  t,
}) => {
  return (
    <>
      <div
        className={`fixed inset-0 z-[1001] bg-black/50 backdrop-blur-sm md:hidden ${drawerClosing ? "animate-fade-out" : ""}`}
        role="presentation"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("ialab.nav_menu_aria")}
        className={`fixed top-0 right-0 z-[1002] h-dvh w-[85vw] max-w-sm bg-white shadow-2xl md:hidden flex flex-col ${drawerClosing ? "animate-slide-out" : "animate-slide-in"}`}
        style={{ willChange: "transform" }}
      >
        <div className="p-4 border-b border-[#4DA8C4]/20 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center">
            <img
              src="/images/logo-edutechlife.webp"
              alt={t("nav.logo_alt")}
              className="w-32 h-auto object-contain"
            />
          </div>
          <div className="flex items-center gap-1">
            <LocaleSwitcher />
            <button
              onClick={onClose}
              className="p-2 text-[#004B63] hover:text-[#4DA8C4] hover:bg-[#4DA8C4]/10 rounded-full transition-all duration-300"
              aria-label={t("header.close_menu")}
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 pb-20">
          {isSignedIn && clerkUser && (
            <div className="mb-6 pb-4 border-b border-[#4DA8C4]/10">
              <UserDropdownMenuSimplified
                userInfo={clerkUser}
                onNavigate={navigate}
              />
            </div>
          )}

          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-semibold text-[#4DA8C4] uppercase tracking-wider mb-2">
                {t("nav.home_aria")}
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => navigateToSection("/", "herramientas")}
                  className="w-full text-left px-3 py-2 text-sm text-[#004B63] hover:bg-[#4DA8C4]/10 rounded-lg transition-colors"
                >
                  {t("header.tools")}
                </button>
                <button
                  onClick={() => navigateToSection("/", "metodo")}
                  className="w-full text-left px-3 py-2 text-sm text-[#004B63] hover:bg-[#4DA8C4]/10 rounded-lg transition-colors"
                >
                  {t("header.method")}
                </button>
                <button
                  onClick={() => navigateToSection("/", "aliados")}
                  className="w-full text-left px-3 py-2 text-sm text-[#004B63] hover:bg-[#4DA8C4]/10 rounded-lg transition-colors"
                >
                  {t("header.allies")}
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-[#4DA8C4] uppercase tracking-wider mb-2">
                {t("header.tools")}
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => navigate("/ialab")}
                  className="w-full text-left px-3 py-2 text-sm text-[#004B63] hover:bg-[#4DA8C4]/10 rounded-lg transition-colors"
                >
                  {t("nav.ialab_pro")}
                </button>
                <button
                  onClick={() => navigate("/sign-up/smartboard")}
                  className="w-full text-left px-3 py-2 text-sm text-[#004B63] hover:bg-[#4DA8C4]/10 rounded-lg transition-colors"
                >
                  {t("nav.smartboard")}
                </button>
                <button
                  onClick={() => navigate("/vak")}
                  className="w-full text-left px-3 py-2 text-sm text-[#004B63] hover:bg-[#4DA8C4]/10 rounded-lg transition-colors"
                >
                  {t("footer.vak")}
                </button>
                <button
                  onClick={() => navigate("/automation")}
                  className="w-full text-left px-3 py-2 text-sm text-[#004B63] hover:bg-[#4DA8C4]/10 rounded-lg transition-colors"
                >
                  {t("footer.automation")}
                </button>
                <button
                  onClick={() => navigate("/planes")}
                  className="w-full text-left px-3 py-2 text-sm text-[#004B63] hover:bg-[#4DA8C4]/10 rounded-lg transition-colors"
                >
                  {t("nav.planes")}
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-[#4DA8C4] uppercase tracking-wider mb-2">
                {t("nav.contact")}
              </h3>
              <div className="space-y-1">
                <button
                  onClick={openContactModal}
                  className="w-full text-left px-3 py-2 text-sm text-[#004B63] hover:bg-[#4DA8C4]/10 rounded-lg transition-colors"
                >
                  {t("header.contact_us")}
                </button>
                <button
                  onClick={() => setShowLeadCaptureModal(true)}
                  className="w-full text-left px-3 py-2 text-sm text-[#004B63] hover:bg-[#4DA8C4]/10 rounded-lg transition-colors"
                >
                  {t("header.request_demo")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileDrawer;
