import { lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { PageLoader } from "../LoadingScreen";
import SEO from "../SEO";

// Lazy load del componente NeuroEntorno
const NeuroEntorno = lazy(() => import("../neuroEntorno"));

/**
 * Página Neuro Entorno
 * Ruta: /neuroentorno
 * Pública - no requiere autenticación
 */
const NeuroEntornoPage = () => {
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
        title="NeuroEntorno"
        description="Explora el NeuroEntorno de Edutechlife y transforma la educación con neuropedagogía e inteligencia artificial."
      />
      <Suspense fallback={<PageLoader message="Cargando Neuro Entorno..." />}>
        <NeuroEntorno onBack={handleBack} onNavigate={handleNavigate} />
      </Suspense>
    </>
  );
};

export default NeuroEntornoPage;
