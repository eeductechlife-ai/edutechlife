import { lazy, Suspense } from "react";
import { signOutUser } from "../../hooks/useAuthIdentity";
import { useNavigate } from "react-router-dom";
import { PageLoader } from "../LoadingScreen";
import { useTranslation } from "../../i18n/I18nProvider";

const IngenIADashboard = lazy(() => import("../ingenIADashboard"));

const IngenIAPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = async () => {
    signOutUser("/", navigate);
  };

  return (
    <Suspense fallback={<PageLoader message={t("smartboard.loading")} />}>
      <IngenIADashboard onNavigate={navigate} onLogout={handleLogout} />
    </Suspense>
  );
};

export default IngenIAPage;
