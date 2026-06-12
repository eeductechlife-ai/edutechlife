import { lazy } from 'react';
import InteractiveViewer from './InteractiveViewer';

const OVAChatGPTTools = lazy(() => import('../OVAChatGPTTools.jsx'));
const OVAEcosystemGuide = lazy(() => import('../OVAEcosystemGuide.jsx'));
const OVABuildGPT = lazy(() => import('../OVABuildGPT'));
const OVAEtica = lazy(() => import('../OVAEtica.jsx'));
const OVAIntroPrompt = lazy(() => import('../OVAIntroPrompt.jsx'));
const OVANotebookLab = lazy(() => import('../OVANotebookLab.jsx'));
const OVANotebookSimulator = lazy(() => import('../OVANotebookSimulator.jsx'));
const OVANotebookPodcastGuide = lazy(() => import('../OVANotebookPodcastGuide.jsx'));
const OVAPodcastStudio = lazy(() => import('../OVAPodcastStudio.jsx'));
const OVABiasLab = lazy(() => import('../OVABiasLab.jsx'));
const OVARiskSimulator = lazy(() => import('../OVARiskSimulator.jsx'));
const OVAEthicalDilemmas = lazy(() => import('../OVAEthicalDilemmas.jsx'));
const OvaEdutechlife = lazy(() => import('../OvaEdutechlife.jsx'));
const OVAPracticalCases = lazy(() => import('../OVAPracticalCases.jsx'));

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
};

export function renderOVAById(resourceId, resource, handleAutoComplete, handleClose) {
  const OVAComponent = OVA_COMPONENTS[resourceId];
  if (OVAComponent === InteractiveViewer) {
    return <InteractiveViewer resource={resource} />;
  }
  return OVAComponent ? <OVAComponent onComplete={handleAutoComplete} onClose={handleClose} /> : <InteractiveViewer resource={resource} />;
}
