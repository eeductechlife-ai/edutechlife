// Genera las guías en inglés (sufijo -en) con el mismo sistema visual.
import { renderGuide } from "./guias-render.mjs";
import { EN_M1_PROMPT, EN_M1_PRIVACIDAD, EN_M1_ETICA } from "./guias-en-a.mjs";
import { EN_M2_CHATGPT, EN_M3_GEMINI, EN_M3_PRACTICA } from "./guias-en-b.mjs";
import { EN_M4_GUIA, EN_M4_PLANTILLAS } from "./guias-en-c.mjs";

const PUBLIC = "/Users/home/Desktop/edutechlife/edutechlife-frontend/public";
const jobs = [
  [EN_M1_PROMPT, "ialab-resources/modulo1/guia-prompt-en.pdf"],
  [EN_M1_PRIVACIDAD, "ialab-resources/modulo1/guia-privacidad-en.pdf"],
  [EN_M1_ETICA, "ialab-resources/modulo1/guia-etica-en.pdf"],
  [EN_M2_CHATGPT, "ialab-resources/modulo2/guia-chatgpt-en.pdf"],
  [EN_M3_GEMINI, "ialab-resources/modulo3/guia-gemini-en.pdf"],
  [EN_M3_PRACTICA, "ialab-resources/modulo3/practica-gemini-en.pdf"],
  [EN_M4_GUIA, "ialab-resources/modulo4/guia-gemini-notebook-en.pdf"],
  [EN_M4_PLANTILLAS, "ialab-resources/modulo4/plantillas-cuaderno-del-futuro-en.pdf"],
];
for (const [doc, rel] of jobs) await renderGuide(doc, `${PUBLIC}/${rel}`);
