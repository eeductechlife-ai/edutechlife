import { lazy, Suspense } from 'react';
import { PageLoader } from '../LoadingScreen';
import SEO from '../SEO';

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
const SEO_TITLES = {
  premium: { title: 'Diagnóstico VAK Premium', desc: 'Evaluación completa de tu estilo de aprendizaje visual, auditivo y kinestésico. Descubre cómo aprendes mejor con Edutechlife.' },
  simple: { title: 'Test VAK Rápido', desc: 'Test rápido de estilo de aprendizaje. Descubre si eres visual, auditivo o kinestésico en minutos.' },
}

const VAKDiagnosisPage = ({ variant = 'premium' }) => {
  const seo = SEO_TITLES[variant] || SEO_TITLES.premium
  return (
    <>
      <SEO title={seo.title} description={seo.desc} />
      <Suspense fallback={<PageLoader message="Cargando Diagnóstico VAK..." />}>
        <VAKDiagnosis variant={variant} />
      </Suspense>
    </>
  );
};

export default VAKDiagnosisPage;