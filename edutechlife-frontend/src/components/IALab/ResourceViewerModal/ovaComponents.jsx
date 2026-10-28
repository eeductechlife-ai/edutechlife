import { lazy } from "react";
import { Briefcase, BookOpen, ShieldAlert, Layers, Search } from "lucide-react";
import InteractiveViewer from "./InteractiveViewer";
import { makeOVAExplicativo } from "../ova-explicativo/OVAExplicativo";
import PROYECTOS from "../ova-explicativo/data/proyectos";
import GRIMORIO from "../ova-explicativo/data/grimorio";
import BRUJULA from "../ova-explicativo/data/brujula";
import PLANO from "../ova-explicativo/data/plano";
import ARCHIVO from "../ova-explicativo/data/archivo";

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

const OVAChatGPTTools = lazyWithRetry(() => import("../OVAChatGPTTools.jsx"));
const OVAEcosystemGuide = lazyWithRetry(
  () => import("../OVAEcosystemGuide.jsx"),
);
const OVABuildGPT = lazyWithRetry(() => import("../OVABuildGPT"));
const OVAEtica = lazyWithRetry(() => import("../OVAEtica.jsx"));
const OVAIntroPrompt = lazyWithRetry(() => import("../OVAIntroPrompt.jsx"));
const OVANotebookLab = lazyWithRetry(() => import("../OVANotebookLab.jsx"));
const OVANotebookSimulator = lazyWithRetry(
  () => import("../OVANotebookSimulator.jsx"),
);
const OVANotebookPodcastGuide = lazyWithRetry(
  () => import("../OVANotebookPodcastGuide.jsx"),
);
const OVAPodcastStudio = lazyWithRetry(() => import("../OVAPodcastStudio.jsx"));
const OVABiasLab = lazyWithRetry(() => import("../OVABiasLab.jsx"));
const OVARiskSimulator = lazyWithRetry(() => import("../OVARiskSimulator.jsx"));
const OVAEthicalDilemmas = lazyWithRetry(
  () => import("../OVAEthicalDilemmas.jsx"),
);
const OvaEdutechlife = lazyWithRetry(() => import("../OvaEdutechlife.jsx"));
const OVAPracticalCases = lazyWithRetry(
  () => import("../OVAPracticalCases.jsx"),
);
const OVAPromptLab = lazyWithRetry(() => import("../OVAPromptLab.jsx"));
const OVAEthicsCases = lazyWithRetry(() => import("../OVAEthicsCases.jsx"));
const OVAClaudeArtifacts = lazyWithRetry(
  () => import("../OVAClaudeArtifacts.jsx"),
);
const OVAClaudeDelegation = lazyWithRetry(
  () => import("../OVAClaudeDelegation.jsx"),
);
const OVAAutomationFlows = lazyWithRetry(
  () => import("../OVAAutomationFlows.jsx"),
);
const OVADocumentMastery = lazyWithRetry(
  () => import("../OVADocumentMastery.jsx"),
);
const OVAGeminiDeepResearch = lazyWithRetry(
  () => import("../OVAGeminiDeepResearch.jsx"),
);
const OVAMultimodalLab = lazyWithRetry(() => import("../OVAMultimodalLab.jsx"));
const OVAClaudeFirstRequest = lazyWithRetry(
  () => import("../OVAClaudeFirstRequest.jsx"),
);

// Lote 1 de OVA explicativos: cada uno con su identidad visual (paleta, fondo e icono).
const OVAProyectos = makeOVAExplicativo("gpts-ova-1", PROYECTOS, {
  accent: "#199DB9",
  accent2: "#f59e0b",
  bg: "#f0f9fb",
  heroIcon: Briefcase,
});
const OVAGrimorio = makeOVAExplicativo("notebooklm-ova-1", GRIMORIO, {
  accent: "#0d9488",
  accent2: "#6366f1",
  bg: "#f0fdfa",
  heroIcon: BookOpen,
});
const OVABrujula = makeOVAExplicativo("privacy-ova-1", BRUJULA, {
  accent: "#ef4444",
  accent2: "#facc15",
  dark: true,
  bg: "#0b1220",
  heroIcon: ShieldAlert,
});
const OVAPlano = makeOVAExplicativo("chatgpt-ova-ecosystem", PLANO, {
  accent: "#2563eb",
  accent2: "#f59e0b",
  bg: "#eff6ff",
  heroIcon: Layers,
});
const OVAArchivo = makeOVAExplicativo("gemini-deep-research-ova-1", ARCHIVO, {
  accent: "#059669",
  accent2: "#0891b2",
  bg: "#ecfdf5",
  heroIcon: Search,
});

export const OVA_COMPONENTS = {
  "workflow-ova-herramientas": OVAChatGPTTools,
  "workspace-ova-1": OvaEdutechlife,
  "gemini-deep-research-ova-1": OVAArchivo,
  "gemini-multimodal-ova-1": OVAMultimodalLab,
  "claude-first-request-ova-1": OVAClaudeFirstRequest,
  "gpts-ova-1": OVAProyectos,
  "chatgpt-ova-ecosystem": OVAPlano,
  "intro-ova-1": OVAEtica,
  "prompt-ova-html-1": OVAIntroPrompt,
  "notebooklm-ova-1": OVAGrimorio,
  "notebook-summary-ova-1": OVANotebookSimulator,
  "notebook-audio-ova-1": OVAPodcastStudio,
  "bias-ova-1": OVABiasLab,
  "privacy-ova-1": OVABrujula,
  "claude-artifacts-ova-1": OVAClaudeArtifacts,
  "claude-delegation-ova-1": OVAClaudeDelegation,
};

// OVA fuera de los temas (regla 1 video + 1 PDF + 1 OVA): se conservan para reasignarlos.
export const OVA_COMPONENTS_RESERVE = {
  "ethics-cases-ova-1": OVAEthicsCases,
  "gemini-cases-ova-1": OVAPracticalCases,
  "ethics-ova-1": OVAEthicalDilemmas,
  "notebook-audio-guide-1": OVANotebookPodcastGuide,
  "prompt-lab-ova-1": OVAPromptLab,
  "automation-flows-ova-1": OVAAutomationFlows,
  "document-mastery-ova-1": OVADocumentMastery,
};

export function renderOVAById(
  resourceId,
  resource,
  handleAutoComplete,
  handleClose,
) {
  const OVAComponent = OVA_COMPONENTS[resourceId];
  if (OVAComponent === InteractiveViewer) {
    return <InteractiveViewer resource={resource} />;
  }
  return OVAComponent ? (
    <OVAComponent onComplete={handleAutoComplete} onClose={handleClose} />
  ) : (
    <InteractiveViewer resource={resource} />
  );
}
