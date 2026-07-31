import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthIdentity } from "../../hooks/useAuthIdentity";
import { useStudentProfile } from "../../hooks/useStudentProfile";
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

const HeaderFluidIsland = ({ onOpenMobileMenu }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isSignedIn } = useAuthIdentity();
  const { profile: clerkUser } = useStudentProfile();
  const location = useLocation();

  const prefersReducedMotion = useReducedMotion();
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
    setContactModalOpen(false);
    setLoginDropdownOpen(false);
  }, [location.pathname]);

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
      <div className="flex items-center md:gap-32 px-4 md:px-6 h-16">
        <button
          onClick={() => {
            navigate("/");
          }}
          aria-label={t("nav.home_aria")}
          className="outline-none border-none bg-transparent p-0 flex-shrink-0"
        >
          <img
            src="/images/logo-edutechlife.webp"
            alt="Edutechlife"
            className="w-16 sm:w-20 md:w-24 object-contain"
            style={{
              height: "40px",
              transform: "scale(1.3)",
              transformOrigin: "left center",
            }}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </button>

        <div className="hidden md:flex items-center gap-3 ml-auto">
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

        <div className="flex md:hidden items-center gap-2 ml-auto">
          <LocaleSwitcher />
          <button
            onClick={() => onOpenMobileMenu?.()}
            className="relative w-11 h-11 flex items-center justify-center rounded-full hover:bg-petroleum/5 transition-all duration-300 active:scale-[0.9]"
            aria-label={t("nav.menu_aria")}
          >
            <div className="relative w-5 h-5">
              <span
                className="absolute left-0 w-full h-[2px] bg-petroleum rounded-full"
                style={{
                  top: "50%",
                  marginTop: "-1px",
                  transform: "translateY(-5px)",
                }}
              />
              <span
                className="absolute left-0 w-full h-[2px] bg-petroleum rounded-full"
                style={{ top: "50%", marginTop: "-1px" }}
              />
              <span
                className="absolute left-0 w-full h-[2px] bg-petroleum rounded-full"
                style={{
                  top: "50%",
                  marginTop: "-1px",
                  transform: "translateY(5px)",
                }}
              />
            </div>
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <motion.header className="pointer-events-auto relative w-full md:w-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/10 shadow-lg shadow-black/5 rounded-none md:rounded-full">
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
