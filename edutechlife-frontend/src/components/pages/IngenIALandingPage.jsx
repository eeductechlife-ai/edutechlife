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
    fetch(`${API_BASE}/api/smartboard/user-role`, {
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
    return <PageLoader message={t("smartboard.loading")} />;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-up/smartboard" replace />;
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
            {t("smartboard.product_mismatch_title") ||
              "Esta cuenta es de IALab"}
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            {t("smartboard.product_mismatch_desc") ||
              "IngenIA es para niños y sus padres, con un panel y permisos distintos. Tu cuenta pertenece al curso de IA generativa del IALab."}
          </p>
          <Link
            to="/ialab"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white font-semibold hover:shadow-lg transition-all"
          >
            {t("smartboard.product_mismatch_cta") || "Ir a mi curso (IALab)"}
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
        title={t("seo.smartboard_kids.title")}
        description={t("seo.smartboard_kids.desc")}
      />
      <IngenIAKidsProvider>
        <Suspense fallback={<PageLoader message={t("smartboard.loading")} />}>
          <IngenIAKidsDashboard />
        </Suspense>
      </IngenIAKidsProvider>
    </>
  );
};

export default IngenIALandingPage;
