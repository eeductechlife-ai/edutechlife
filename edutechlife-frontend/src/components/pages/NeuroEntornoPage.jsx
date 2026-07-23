import { lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { PageLoader } from "../LoadingScreen";
import SEO from "../SEO";
import { useTranslation } from "../../i18n/I18nProvider";

const NeuroEntorno = lazy(() => import("../neuroEntorno"));

const NeuroEntornoPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  const handleNavigate = (route) => {
    navigate(route);
  };

  return (
    <>
      <SEO
        title={t("seo.neuroentorno.title")}
        description={t("seo.neuroentorno.desc")}
      />
      <Suspense fallback={<PageLoader message={t("page_loader.neuro")} />}>
        <NeuroEntorno onBack={handleBack} onNavigate={handleNavigate} />
      </Suspense>
    </>
  );
};

export default NeuroEntornoPage;
