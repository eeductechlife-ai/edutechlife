// Genera las guías en portugués (sufijo -pt) con el mismo sistema visual.
import { renderGuide } from "./guias-render.mjs";
import { PT_M1_PROMPT, PT_M1_PRIVACIDADE, PT_M1_ETICA } from "./guias-pt-a.mjs";
import { PT_M2_CHATGPT, PT_M3_GEMINI, PT_M3_PRATICA } from "./guias-pt-b.mjs";
import { PT_M4_GUIA, PT_M4_PLANTILLAS } from "./guias-pt-c.mjs";

const PUBLIC = "/Users/home/Desktop/edutechlife/edutechlife-frontend/public";
const jobs = [
  [PT_M1_PROMPT, "ialab-resources/modulo1/guia-prompt-pt.pdf"],
  [PT_M1_PRIVACIDADE, "ialab-resources/modulo1/guia-privacidad-pt.pdf"],
  [PT_M1_ETICA, "ialab-resources/modulo1/guia-etica-pt.pdf"],
  [PT_M2_CHATGPT, "ialab-resources/modulo2/guia-chatgpt-pt.pdf"],
  [PT_M3_GEMINI, "ialab-resources/modulo3/guia-gemini-pt.pdf"],
  [PT_M3_PRATICA, "ialab-resources/modulo3/practica-gemini-pt.pdf"],
  [PT_M4_GUIA, "ialab-resources/modulo4/guia-gemini-notebook-pt.pdf"],
  [PT_M4_PLANTILLAS, "ialab-resources/modulo4/plantillas-cuaderno-del-futuro-pt.pdf"],
];
for (const [doc, rel] of jobs) await renderGuide(doc, `${PUBLIC}/${rel}`);
