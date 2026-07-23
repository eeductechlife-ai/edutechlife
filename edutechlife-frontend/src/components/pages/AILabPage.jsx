import { lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { PageLoader } from "../LoadingScreen";
import { useTranslation } from "../../i18n/I18nProvider";

// Lazy load del componente IALab
const IALab = lazy(() => import("../IALab/IALab"));

/**
 * Página AILab (Artificial Intelligence Lab)
 * Ruta: /ialab
 * Protegida: Requiere autenticación + rol 'ialab'
 */
const AILabPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  return (
    <Suspense fallback={<PageLoader message={t("common.loading")} />}>
      <IALab onBack={handleBack} />
    </Suspense>
  );
};

export default AILabPage;
