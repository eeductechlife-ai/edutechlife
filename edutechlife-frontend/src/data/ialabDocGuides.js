// Lectura activa para documentos/PDF (Fase 1 pedagógica).
// "before": preguntas guía antes de leer. "after": reflexión de transferencia.
// "summary": resumen ejecutivo de 5 líneas para reducir carga cognitiva.

import { ES_PART1 } from "./ialabDocGuides.es.part1";
import { EN_PART1 } from "./ialabDocGuides.en.part1";
import { PT_PART1 } from "./ialabDocGuides.pt.part1";

const ES = { ...ES_PART1 };

const EN = { ...EN_PART1 };

const PT = { ...PT_PART1 };

export const DOC_GUIDES = { es: ES, en: EN, pt: PT };

export function getDocGuide(resourceId, locale = "es") {
  const lang = String(locale || "es").slice(0, 2);
  const pack = DOC_GUIDES[lang] || DOC_GUIDES.es;
  return pack[resourceId] || null;
}

export default DOC_GUIDES;
