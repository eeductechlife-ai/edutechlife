import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useIALabStore } from "../../store/ialabStore";
import IALab from "../IALab/IALab";

/**
 * Página AILab (Artificial Intelligence Lab)
 * Ruta: /ialab
 * Protegida: Requiere autenticación + rol 'ialab'
 */
const AILabPage = () => {
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

  return <IALab onBack={handleBack} />;
};

export default AILabPage;
