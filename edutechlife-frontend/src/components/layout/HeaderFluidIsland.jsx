import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth, useUser } from "@clerk/react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTranslation } from "../../i18n/I18nProvider";
import LocaleSwitcher from "../LocaleSwitcher";
import UserDropdownMenuPremium from "../userDropdownMenuPremium";
import ContactModal from "../ContactModal";

const loginOptions = [
  {
    id: "ialab",
    label: "iLab Academic",
    path: "/sign-up/ialab",
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#4DA8C4"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    id: "smartboard",
    label: "SmartBoard",
    path: "/sign-up/smartboard",
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#004B63"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
  },
];

const HeaderFluidIsland = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { user: clerkUser } = useUser();
  const location = useLocation();

  const prefersReducedMotion = useReducedMotion();
  const [navExpanded, setNavExpanded] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const loginDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        loginDropdownRef.current &&
        !loginDropdownRef.current.contains(e.target)
      )
        setLoginDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && navExpanded) setNavExpanded(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [navExpanded]);

  useEffect(() => {
    setNavExpanded(false);
    setContactModalOpen(false);
    setLoginDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (navExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [navExpanded]);

  const shouldShow = () => {
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

  if (!shouldShow()) return null;

  const headerContent = (
    <>
      <div className="flex items-center justify-between px-4 md:px-6 h-16">
        <button
          onClick={() => {
            navigate("/");
            setNavExpanded(false);
          }}
          aria-label={t("nav.home_aria")}
          className="outline-none border-none bg-transparent p-0 flex-shrink-0"
        >
          <img
            src="/images/logo-edutechlife.webp"
            alt="Edutechlife"
            className="w-20 sm:w-24 object-contain"
            style={{
              height: "80px",
              transform: "scale(1.6)",
              transformOrigin: "left center",
            }}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </button>

        <div className="hidden md:flex items-center gap-3">
          <LocaleSwitcher />
          {isSignedIn && clerkUser ? (
            <UserDropdownMenuPremium
              userInfo={clerkUser}
              onNavigate={navigate}
            />
          ) : (
            <div className="relative" ref={loginDropdownRef}>
              <button
                onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] hover:from-[#66CCCC] hover:to-[#4DA8C4] rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 active:scale-[0.97]"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                {t("nav.login")}
                <svg
                  className={`w-3 h-3 transition-transform duration-200 ${loginDropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <AnimatePresence>
                {loginDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-full right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50"
                  >
                    {loginOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          navigate(opt.path);
                          setLoginDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-3 text-sm font-semibold text-[#004B63] hover:bg-[#4DA8C4]/10 rounded-xl transition-colors flex items-center gap-3"
                      >
                        {opt.icon}
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          <button
            onClick={() => setContactModalOpen(true)}
            className="px-5 py-2 text-sm font-semibold text-white bg-[#4DA8C4] hover:bg-petroleum rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 active:scale-[0.97]"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            {t("nav.contact")}
          </button>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <LocaleSwitcher />
          <button
            onClick={() => setNavExpanded(!navExpanded)}
            className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-petroleum/5 transition-all duration-300 active:scale-[0.9]"
            aria-label={navExpanded ? t("nav.close_aria") : t("nav.menu_aria")}
          >
            <div className="relative w-5 h-5">
              <motion.span
                animate={
                  prefersReducedMotion
                    ? {}
                    : { rotate: navExpanded ? 45 : 0, y: navExpanded ? 0 : -5 }
                }
                className="absolute left-0 w-full h-[2px] bg-petroleum rounded-full"
                style={{ top: "50%", marginTop: "-1px" }}
                transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              />
              <motion.span
                animate={
                  prefersReducedMotion ? {} : { opacity: navExpanded ? 0 : 1 }
                }
                className="absolute left-0 w-full h-[2px] bg-petroleum rounded-full"
                style={{ top: "50%", marginTop: "-1px" }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                animate={
                  prefersReducedMotion
                    ? {}
                    : { rotate: navExpanded ? -45 : 0, y: navExpanded ? 0 : 5 }
                }
                className="absolute left-0 w-full h-[2px] bg-petroleum rounded-full"
                style={{ top: "50%", marginTop: "-1px" }}
                transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              />
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {navExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden border-t border-gray-100/50"
          >
            <div className="px-6 py-8 space-y-3">
              <button
                onClick={() => {
                  navigate("/");
                  setNavExpanded(false);
                }}
                className="w-full text-left px-4 py-3 rounded-xl transition-all text-gray-700 hover:bg-gray-50"
              >
                <div className="text-sm font-semibold">{t("nav.home")}</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {t("nav.home_desc")}
                </div>
              </button>

              <div className="flex flex-col gap-3 pt-4 border-t border-gray-100/50">
                {isSignedIn && clerkUser ? (
                  <UserDropdownMenuPremium
                    userInfo={clerkUser}
                    onNavigate={navigate}
                  />
                ) : (
                  <div className="space-y-1">
                    {loginOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          navigate(opt.path);
                          setNavExpanded(false);
                        }}
                        className="w-full py-3 px-4 text-sm font-semibold text-[#004B63] hover:bg-[#4DA8C4]/10 rounded-xl transition-colors flex items-center gap-3"
                      >
                        {opt.icon}
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => {
                    setContactModalOpen(true);
                    setNavExpanded(false);
                  }}
                  className="w-full py-3 px-4 text-sm font-semibold text-white bg-gradient-to-r from-[#66CCCC] to-[#4DA8C4] rounded-xl hover:from-[#4DA8C4] hover:to-[#66CCCC] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {t("nav.contact")}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <motion.header
          initial={false}
          animate={
            prefersReducedMotion
              ? {}
              : {
                  borderRadius: navExpanded ? "1.5rem" : "9999px",
                  marginTop: navExpanded ? "1rem" : "1rem",
                  width: navExpanded
                    ? "min(95vw, 1200px)"
                    : "min(90vw, 1200px)",
                }
          }
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          className={`pointer-events-auto relative bg-transparent backdrop-blur-none border border-white/10 shadow-lg shadow-black/5 ${navExpanded ? "overflow-hidden" : ""}`}
        >
          {headerContent}
        </motion.header>
      </div>

      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
    </>
  );
};

export default HeaderFluidIsland;
