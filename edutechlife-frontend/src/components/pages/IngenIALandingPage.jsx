import { lazy, Suspense, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { IngenIAKidsProvider } from "../../context/IngenIAKidsContext";
import { useAuthIdentity } from "../../hooks/useAuthIdentity";
import { PageLoader } from "../LoadingScreen";
import { useTranslation } from "../../i18n/I18nProvider";
import SEO from "../SEO";
import { API_BASE_URL as API_BASE } from "../../config/api";

const IngenIAKidsDashboard = lazy(
  () => import("../kids-dashboard/IngenIAKidsDashboard"),
);
const IngenIAParentDashboard = lazy(
  () => import("./ingenIAParentDashboard/IngenIAParentDashboard"),
);

const IngenIALandingPage = () => {
  const { t } = useTranslation();
  const { isLoaded, isSignedIn, token } = useAuthIdentity();
  const [role, setRole] = useState(null);
  const [accountType, setAccountType] = useState(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !token) return;
    fetch(`${API_BASE}/api/ingenia/user-role`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        setRole(data?.role || "student");
        setAccountType(data?.account_type || null);
      })
      .catch(() => setRole("student"));
  }, [isLoaded, isSignedIn, token]);

  if (!isLoaded || (isSignedIn && role === null)) {
    return <PageLoader message={t("ingenia.loading")} />;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-up/ingenia" replace />;
  }

  // Productos distintos: una cuenta de IALab (curso de IA generativa) no entra
  // al panel de los niños. Los padres con vínculo activo sí (role='parent').
  if (role !== "parent" && accountType === "ialab") {
    return (
      <div className="min-h-[100dvh] bg-gradient-to-br from-[#004B63] to-[#0A3550] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="text-4xl mb-3" aria-hidden="true">
            🎓
          </div>
          <h1 className="text-xl font-bold text-[#004B63] mb-2">
            {t("ingenia.product_mismatch_title")}
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            {t("ingenia.product_mismatch_desc")}
          </p>
          <Link
            to="/ialab"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white font-semibold hover:shadow-lg transition-all"
          >
            {t("ingenia.product_mismatch_cta")}
          </Link>
        </div>
      </div>
    );
  }

  if (role === "parent") {
    return (
      <Suspense fallback={<PageLoader message="Cargando panel de padres..." />}>
        <IngenIAParentDashboard />
      </Suspense>
    );
  }

  return (
    <>
      <SEO
        title={t("seo.ingenia_kids.title")}
        description={t("seo.ingenia_kids.desc")}
      />
      <IngenIAKidsProvider>
        <Suspense fallback={<PageLoader message={t("ingenia.loading")} />}>
          <IngenIAKidsDashboard />
        </Suspense>
      </IngenIAKidsProvider>
    </>
  );
};

export default IngenIALandingPage;
