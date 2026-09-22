import { lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { PageLoader } from "../LoadingScreen";
import Footer from "../Footer";
import { useTranslation } from "../../i18n/I18nProvider";
import SEO from "../SEO";

const IngenIALandingInfo = lazy(() => import("../IngenIALandingInfo"));

const IngenIAInfoPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleBack = () => {
    navigate("/");
  };

  const handleNavigate = (route) => {
    navigate(route);
  };

  return (
    <>
      <SEO
        title={t("seo.smartboard.title")}
        description={t("seo.smartboard.desc")}
      />
      <Suspense fallback={<PageLoader message={t("smartboard.loading")} />}>
        <IngenIALandingInfo onBack={handleBack} onNavigate={handleNavigate} />
      </Suspense>
      <Footer />
    </>
  );
};

export default IngenIAInfoPage;
