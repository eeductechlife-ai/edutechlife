import { lazy, Suspense } from 'react';
import { PageLoader } from '../LoadingScreen';

// Lazy load del componente VAKDiagnosis
const VAKDiagnosis = lazy(() => import('../DiagnosticoVAK'));

/**
 * Página VAK Diagnosis
 * Rutas: /vak, /vak-simple, /vak-premium
 * Pública - no requiere autenticación
 * 
 * @param {Object} props
 * @param {string} props.variant - Variante del diagnóstico: 'premium', 'simple'
 */
const VAKDiagnosisPage = ({ variant = 'premium' }) => {
  return (
    <Suspense fallback={<PageLoader message="Cargando Diagnóstico VAK..." />}>
      <VAKDiagnosis variant={variant} />
    </Suspense>
  );
};

export default VAKDiagnosisPage;