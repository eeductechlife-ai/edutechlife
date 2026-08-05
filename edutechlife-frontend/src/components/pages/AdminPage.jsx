// fix vercel casing cache
import { lazy, Suspense } from "react";
import { signOutUser } from "../../hooks/useAuthIdentity";
import { useNavigate } from "react-router-dom";
import { PageLoader } from "../LoadingScreen";
import { useTranslation } from "../../i18n/I18nProvider";

const AdminDashboard = lazy(() => import("../adminDashboard"));

/**
 * Página Admin Dashboard
 * Ruta: /admin
 * Protegida: Requiere autenticación + rol 'admin'
 */
const AdminPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    signOutUser("/", navigate);
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <Suspense fallback={<PageLoader message={t("page_loader.admin")} />}>
      <AdminDashboard onLogout={handleLogout} onBack={handleBack} />
    </Suspense>
  );
};

export default AdminPage;
