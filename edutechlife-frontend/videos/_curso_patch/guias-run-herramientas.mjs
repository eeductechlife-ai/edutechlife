// Genera la guía de herramientas integradas de ChatGPT en inglés y portugués.
import { renderGuide } from "./guias-render.mjs";
import { EN_HERRAMIENTAS, PT_HERRAMIENTAS } from "./guias-herramientas-en-pt.mjs";
const PUBLIC = "/Users/home/Desktop/edutechlife/edutechlife-frontend/public/ialab-resources";
await renderGuide(EN_HERRAMIENTAS, `${PUBLIC}/modulo2/guia-herramientas-chatgpt-en.pdf`);
await renderGuide(PT_HERRAMIENTAS, `${PUBLIC}/modulo2/guia-herramientas-chatgpt-pt.pdf`);
console.log("HERRAMIENTAS_DONE");
