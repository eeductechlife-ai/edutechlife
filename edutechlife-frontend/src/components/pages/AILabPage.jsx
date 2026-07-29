import { lazy, Suspense, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageLoader } from "../LoadingScreen";
import { useTranslation } from "../../i18n/I18nProvider";
import { useIALabStore } from "../../store/ialabStore";

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
  const { moduleId } = useParams();

  useEffect(() => {
    if (moduleId) {
      const parsed = parseInt(moduleId, 10);
      const current = useIALabStore.getState().lastVisitedLesson;
      if (!current || current.moduleId !== parsed) {
        useIALabStore.getState().setLastVisitedLesson(parsed, null);
      }
    }
  }, [moduleId]);

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
