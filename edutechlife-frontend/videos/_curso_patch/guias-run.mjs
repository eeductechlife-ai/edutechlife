// Genera las guías PDF de IALab en public/ialab-resources/ (sistema visual unificado).
// Uso: node guias-run.mjs
import { renderGuide } from "./guias-render.mjs";
import { M2_CHATGPT, M3_GEMINI } from "./guias-contenido-m2-m3.mjs";
import { M4_GUIA, M4_PLANTILLAS } from "./guias-contenido-m4.mjs";
import { M1_PROMPT, M1_PRIVACIDAD, M3_PRACTICA } from "./guias-contenido-pendientes.mjs";
import { M1_ETICA } from "./guias-contenido-etica.mjs";

const PUBLIC = "/Users/home/Desktop/edutechlife/edutechlife-frontend/public";
const jobs = [
  [M2_CHATGPT, "ialab-resources/modulo2/guia-chatgpt-es.pdf"],
  [M3_GEMINI, "ialab-resources/modulo3/guia-gemini-es.pdf"],
  [M4_GUIA, "ialab-resources/modulo4/guia-gemini-notebook-es.pdf"],
  [M4_PLANTILLAS, "ialab-resources/modulo4/plantillas-cuaderno-del-futuro-es.pdf"],
  [M1_PROMPT, "ialab-resources/modulo1/guia-prompt-es.pdf"],
  [M1_PRIVACIDAD, "ialab-resources/modulo1/guia-privacidad-es.pdf"],
  [M3_PRACTICA, "ialab-resources/modulo3/practica-gemini-es.pdf"],
  [M1_ETICA, "ialab-resources/modulo1/guia-etica-es.pdf"],
];
for (const [doc, rel] of jobs) await renderGuide(doc, `${PUBLIC}/${rel}`);
