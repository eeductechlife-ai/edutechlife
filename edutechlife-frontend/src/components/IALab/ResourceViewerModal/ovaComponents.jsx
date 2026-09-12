import { lazy } from 'react';
import InteractiveViewer from './InteractiveViewer';

// Reintenta la carga del chunk ante fallos transitorios (reinicio del dev
// server, re-optimización de deps o chunk obsoleto tras un deploy). Sin esto,
// React.lazy memoriza el rechazo y "Reintentar" nunca puede recuperarse.
const lazyWithRetry = (importFn, retries = 2) =>
  lazy(() => {
    const attempt = (remaining) =>
      importFn().catch((error) => {
        if (remaining <= 0) throw error;
        return new Promise((resolve) => setTimeout(resolve, 400)).then(() =>
          attempt(remaining - 1),
        );
      });
    return attempt(retries);
  });

const OVAChatGPTTools = lazyWithRetry(() => import('../OVAChatGPTTools.jsx'));
const OVAEcosystemGuide = lazyWithRetry(() => import('../OVAEcosystemGuide.jsx'));
const OVABuildGPT = lazyWithRetry(() => import('../OVABuildGPT'));
const OVAEtica = lazyWithRetry(() => import('../OVAEtica.jsx'));
const OVAIntroPrompt = lazyWithRetry(() => import('../OVAIntroPrompt.jsx'));
const OVANotebookLab = lazyWithRetry(() => import('../OVANotebookLab.jsx'));
const OVANotebookSimulator = lazyWithRetry(() => import('../OVANotebookSimulator.jsx'));
const OVANotebookPodcastGuide = lazyWithRetry(() => import('../OVANotebookPodcastGuide.jsx'));
const OVAPodcastStudio = lazyWithRetry(() => import('../OVAPodcastStudio.jsx'));
const OVABiasLab = lazyWithRetry(() => import('../OVABiasLab.jsx'));
const OVARiskSimulator = lazyWithRetry(() => import('../OVARiskSimulator.jsx'));
const OVAEthicalDilemmas = lazyWithRetry(() => import('../OVAEthicalDilemmas.jsx'));
const OvaEdutechlife = lazyWithRetry(() => import('../OvaEdutechlife.jsx'));
const OVAPracticalCases = lazyWithRetry(() => import('../OVAPracticalCases.jsx'));
const OVAPromptLab = lazyWithRetry(() => import('../OVAPromptLab.jsx'));
const OVAEthicsCases = lazyWithRetry(() => import('../OVAEthicsCases.jsx'));
const OVAAutomationFlows = lazyWithRetry(() => import('../OVAAutomationFlows.jsx'));
const OVADocumentMastery = lazyWithRetry(() => import('../OVADocumentMastery.jsx'));

export const OVA_COMPONENTS = {
  'workflow-ova-herramientas': OVAChatGPTTools,
  'gemini-ova-1': InteractiveViewer,
  'workspace-ova-1': OvaEdutechlife,
  'gemini-cases-ova-1': OVAPracticalCases,
  'ethics-ova-1': OVAEthicalDilemmas,
  'gpts-ova-1': OVABuildGPT,
  'chatgpt-ova-ecosystem': OVAEcosystemGuide,
  'intro-ova-1': OVAEtica,
  'prompt-ova-html-1': OVAIntroPrompt,
  'notebooklm-ova-1': OVANotebookLab,
  'notebook-summary-ova-1': OVANotebookSimulator,
  'notebook-audio-guide-1': OVANotebookPodcastGuide,
  'notebook-audio-ova-1': OVAPodcastStudio,
  'bias-ova-1': OVABiasLab,
  'privacy-ova-1': OVARiskSimulator,
  'prompt-lab-ova-1': OVAPromptLab,
  'ethics-cases-ova-1': OVAEthicsCases,
  'automation-flows-ova-1': OVAAutomationFlows,
  'document-mastery-ova-1': OVADocumentMastery,
};

export function renderOVAById(resourceId, resource, handleAutoComplete, handleClose) {
  const OVAComponent = OVA_COMPONENTS[resourceId];
  if (OVAComponent === InteractiveViewer) {
    return <InteractiveViewer resource={resource} />;
  }
  return OVAComponent ? <OVAComponent onComplete={handleAutoComplete} onClose={handleClose} /> : <InteractiveViewer resource={resource} />;
}
