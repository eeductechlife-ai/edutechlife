import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthIdentity } from "../hooks/useAuthIdentity";
import { PageLoader } from "./LoadingScreen";
import { useTranslation } from "../i18n/I18nProvider";

/**
 * SmartBoardLoginRedirect: Intelligent routing for /smartboard/login
 *
 * This route should NOT be a login page.
 * Instead, redirect based on auth status:
 * - Not authenticated → /sign-up/smartboard (registration)
 * - Authenticated → /smartboard (dashboard)
 */
const SmartBoardLoginRedirect = () => {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useAuthIdentity();
  const { t } = useTranslation();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      // Already logged in → go to dashboard
      navigate("/smartboard", { replace: true });
    } else {
      // Not logged in → go to signup
      navigate("/sign-up/smartboard", { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0077B6] via-[#00B4D8] to-[#48CAE4]">
      <PageLoader message={t("common.loading")} />
    </div>
  );
};

export default SmartBoardLoginRedirect;
