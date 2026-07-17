// fix vercel consultoria casing
import { lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { PageLoader } from "../LoadingScreen";
import { useTranslation } from "../../i18n/I18nProvider";
import SEO from "../SEO";

const Consultoria = lazy(() => import("../consultoria"));

const ConsultoriaPage = () => {
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
        title="Consultoría Educativa"
        description="Consultoría educativa especializada con inteligencia artificial. Transforma tu institución con Edutechlife."
      />
      <Suspense fallback={<PageLoader message={t("page_loader.consulting")} />}>
        <Consultoria onBack={handleBack} onNavigate={handleNavigate} />
      </Suspense>
    </>
  );
};

export default ConsultoriaPage;
