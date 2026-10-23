import { renderGuide } from "./guias-render.mjs";
import { M1_ETICA } from "./guias-contenido-etica.mjs";
import { EN_M1_ETICA } from "./guias-en-a.mjs";
import { PT_M1_ETICA } from "./guias-pt-a.mjs";
const PUBLIC = "/Users/home/Desktop/edutechlife/edutechlife-frontend/public";
await renderGuide(M1_ETICA, `${PUBLIC}/ialab-resources/modulo1/guia-etica-es.pdf`);
await renderGuide(EN_M1_ETICA, `${PUBLIC}/ialab-resources/modulo1/guia-etica-en.pdf`);
await renderGuide(PT_M1_ETICA, `${PUBLIC}/ialab-resources/modulo1/guia-etica-pt.pdf`);
console.log("regenerated");
