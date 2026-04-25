/**
 * Barrel exports para componentes IALab
 * Exporta todos los componentes modulares para importación conveniente
 */

// Componentes principales
export { default as IALab } from './IALab';
export { default as IALabHeader } from './IALabHeader';
export { default as IALabSidebar } from './IALabSidebar';
export { default as IALabModuleHeader } from './IALabModuleHeader';
export { default as IALabContentAccordion } from './IALabContentAccordion';
export { default as IALabChallengeSection } from './IALabChallengeSection';
export { default as IALabForumSection } from './IALabForumSection';
export { default as IALabSynthesizer } from './IALabSynthesizer';
export { default as IALabEvaluationModal } from './IALabEvaluationModal';
export { default as IALabQuizModal } from './IALabQuizModal';
export { default as IALabValerioPanel } from './IALabValerioPanel';

// Hooks especializados
export { default as useIALabForum } from '../../hooks/IALab/useIALabForum';
export { default as useIALabSynthesizer } from '../../hooks/IALab/useIALabSynthesizer';
export { default as useIALabTimer } from '../../hooks/IALab/useIALabTimer';
export { default as useIALabProgress } from '../../hooks/IALab/useIALabProgress';
export { default as useIALabQuiz } from '../../hooks/IALab/useIALabQuiz';
export { default as useIALabSecurity } from '../../hooks/IALab/useIALabSecurity';

// Context provider
export { IALabProvider, useIALabContext } from '../../context/IALabContext';

/**
 * Uso recomendado:
 * 
 * Importación completa:
 * import { IALab } from './components/IALab';
 * 
 * Importación de componentes individuales:
 * import { IALabHeader, IALabSidebar } from './components/IALab';
 * 
 * Importación de hooks:
 * import { useIALabForum, useIALabSynthesizer } from './components/IALab';
 */