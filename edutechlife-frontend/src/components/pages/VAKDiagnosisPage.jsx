import { lazy, Suspense } from "react";
import { PageLoader } from "../LoadingScreen";
import SEO from "../SEO";
import { useTranslation } from "../../i18n/I18nProvider";

const VAKDiagnosis = lazy(() => import("../DiagnosticoVAK"));

const SEO_KEYS = {
  premium: { title: "seo.vak_premium.title", desc: "seo.vak_premium.desc" },
  simple: { title: "seo.vak_simple.title", desc: "seo.vak_simple.desc" },
};

const VAKDiagnosisPage = ({ variant = "premium" }) => {
  const { t } = useTranslation();
  const seo = SEO_KEYS[variant] || SEO_KEYS.premium;
  return (
    <>
      <SEO title={t(seo.title)} description={t(seo.desc)} />
      <Suspense fallback={<PageLoader message={t("page_loader.vak")} />}>
        <VAKDiagnosis variant={variant} />
      </Suspense>
    </>
  );
};

export default VAKDiagnosisPage;
