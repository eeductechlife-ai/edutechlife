import { lazy, Suspense, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { SmartBoardKidsProvider } from "../../context/SmartBoardKidsContext";
import { useAuthIdentity } from "../../hooks/useAuthIdentity";
import { PageLoader } from "../LoadingScreen";
import { useTranslation } from "../../i18n/I18nProvider";
import SEO from "../SEO";
import { API_BASE_URL as API_BASE } from "../../config/api";

const SmartBoardKidsDashboard = lazy(
  () => import("../kids-dashboard/SmartBoardKidsDashboard"),
);
const SmartBoardParentDashboard = lazy(
  () => import("./smartBoardParentDashboard/SmartBoardParentDashboard"),
);

const SmartBoardLandingPage = () => {
  const { t } = useTranslation();
  const { isLoaded, isSignedIn, token } = useAuthIdentity();
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !token) return;
    fetch(`${API_BASE}/api/smartboard/user-role`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setRole(data?.role || "student"))
      .catch(() => setRole("student"));
  }, [isLoaded, isSignedIn, token]);

  if (!isLoaded || (isSignedIn && role === null)) {
    return <PageLoader message={t("smartboard.loading")} />;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-up/smartboard" replace />;
  }

  if (role === "parent") {
    return (
      <Suspense fallback={<PageLoader message="Cargando panel de padres..." />}>
        <SmartBoardParentDashboard />
      </Suspense>
    );
  }

  return (
    <>
      <SEO
        title={t("seo.smartboard_kids.title")}
        description={t("seo.smartboard_kids.desc")}
      />
      <SmartBoardKidsProvider>
        <Suspense fallback={<PageLoader message={t("smartboard.loading")} />}>
          <SmartBoardKidsDashboard />
        </Suspense>
      </SmartBoardKidsProvider>
    </>
  );
};

export default SmartBoardLandingPage;
