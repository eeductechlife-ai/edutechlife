import { lazy, Suspense } from "react";
import { signOutUser } from "../../hooks/useAuthIdentity";
import { useNavigate } from "react-router-dom";
import { PageLoader } from "../LoadingScreen";
import { useTranslation } from "../../i18n/I18nProvider";

const SmartBoardDashboard = lazy(() => import("../smartBoardDashboard"));

const SmartBoardPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = async () => {
    signOutUser("/");
    navigate("/");
  };

  return (
    <Suspense fallback={<PageLoader message={t("smartboard.loading")} />}>
      <SmartBoardDashboard onNavigate={navigate} onLogout={handleLogout} />
    </Suspense>
  );
};

export default SmartBoardPage;
