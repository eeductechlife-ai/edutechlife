import { lazy } from "react";
import {
  Briefcase,
  BookOpen,
  ShieldAlert,
  Layers,
  Search,
  Hammer,
  Scale,
  Wrench,
  FlaskConical,
  Blocks,
  Users,
  Send,
  Headphones,
} from "lucide-react";
import InteractiveViewer from "./InteractiveViewer";
import { makeOVAExplicativo } from "../ova-explicativo/OVAExplicativo";
import PROYECTOS from "../ova-explicativo/data/proyectos";
import GRIMORIO from "../ova-explicativo/data/grimorio";
import BRUJULA from "../ova-explicativo/data/brujula";
import PLANO from "../ova-explicativo/data/plano";
import ARCHIVO from "../ova-explicativo/data/archivo";
import CINCEL from "../ova-explicativo/data/cincel";
import ESPEJO from "../ova-explicativo/data/espejo";
import CRISOL from "../ova-explicativo/data/crisol";
import CAJA from "../ova-explicativo/data/caja";
import ESTUDIO from "../ova-explicativo/data/estudio";
import ARTIFACTS from "../ova-explicativo/data/artifacts";
import DELEGACION from "../ova-explicativo/data/delegacion";
import PRIMER_PEDIDO from "../ova-explicativo/data/primer-pedido";

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

const OVAEtica = lazyWithRetry(() => import("../OVAEtica.jsx"));
const OVAEthicalDilemmas = lazyWithRetry(
  () => import("../OVAEthicalDilemmas.jsx"),
);
const OVAPracticalCases = lazyWithRetry(
  () => import("../OVAPracticalCases.jsx"),
);
const OVAPromptLab = lazyWithRetry(() => import("../OVAPromptLab.jsx"));
const OVAEthicsCases = lazyWithRetry(() => import("../OVAEthicsCases.jsx"));
const OVAAutomationFlows = lazyWithRetry(
  () => import("../OVAAutomationFlows.jsx"),
);
const OVADocumentMastery = lazyWithRetry(
  () => import("../OVADocumentMastery.jsx"),
);
const OVANotebookPodcastGuide = lazyWithRetry(
  () => import("../OVANotebookPodcastGuide.jsx"),
);
// Componentes originales de Gemini (curador: conservar y añadir glosario).
const OvaEdutechlife = lazyWithRetry(() => import("../OvaEdutechlife.jsx"));
const OVAMultimodalLab = lazyWithRetry(() => import("../OVAMultimodalLab.jsx"));

// Lotes 1 y 2 de OVA explicativos: cada uno con su identidad visual (paleta, fondo e icono).
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
const OVACincel = makeOVAExplicativo("prompt-ova-html-1", CINCEL, {
  accent: "#475569",
  accent2: "#f59e0b",
  bg: "#f8fafc",
  heroIcon: Hammer,
});
const OVAEspejo = makeOVAExplicativo("bias-ova-1", ESPEJO, {
  accent: "#7c3aed",
  accent2: "#06b6d4",
  bg: "#f5f3ff",
  heroIcon: Scale,
});
const OVACrisol = makeOVAExplicativo("notebook-summary-ova-1", CRISOL, {
  accent: "#b45309",
  accent2: "#14b8a6",
  bg: "#fffbeb",
  heroIcon: FlaskConical,
});
const OVACaja = makeOVAExplicativo("workflow-ova-herramientas", CAJA, {
  accent: "#ea580c",
  accent2: "#199DB9",
  bg: "#fff7ed",
  heroIcon: Wrench,
});
const OVAEstudio = makeOVAExplicativo("notebook-audio-ova-1", ESTUDIO, {
  accent: "#be185d",
  accent2: "#facc15",
  bg: "#fdf2f8",
  heroIcon: Headphones,
});
const OVAArtifacts = makeOVAExplicativo("claude-artifacts-ova-1", ARTIFACTS, {
  accent: "#4338ca",
  accent2: "#f97316",
  bg: "#eef2ff",
  heroIcon: Blocks,
});
const OVADelegacion = makeOVAExplicativo(
  "claude-delegation-ova-1",
  DELEGACION,
  {
    accent: "#4d7c0f",
    accent2: "#0ea5e9",
    bg: "#f7fee7",
    heroIcon: Users,
  },
);
const OVAPrimerPedido = makeOVAExplicativo(
  "claude-first-request-ova-1",
  PRIMER_PEDIDO,
  {
    accent: "#9333ea",
    accent2: "#f59e0b",
    bg: "#faf5ff",
    heroIcon: Send,
  },
);

export const OVA_COMPONENTS = {
  "workflow-ova-herramientas": OVACaja,
  "workspace-ova-1": OvaEdutechlife,
  "gemini-deep-research-ova-1": OVAArchivo,
  "gemini-multimodal-ova-1": OVAMultimodalLab,
  "claude-first-request-ova-1": OVAPrimerPedido,
  "gpts-ova-1": OVAProyectos,
  "chatgpt-ova-ecosystem": OVAPlano,
  "intro-ova-1": OVAEtica,
  "prompt-ova-html-1": OVACincel,
  "notebooklm-ova-1": OVAGrimorio,
  "notebook-summary-ova-1": OVACrisol,
  "notebook-audio-ova-1": OVAEstudio,
  "bias-ova-1": OVAEspejo,
  "privacy-ova-1": OVABrujula,
  "claude-artifacts-ova-1": OVAArtifacts,
  "claude-delegation-ova-1": OVADelegacion,
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
