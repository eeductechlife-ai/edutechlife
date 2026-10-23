// Genera las guías nuevas (fundamentos, fachada, Deep Research, audio y documentos) en es/en/pt.
import { renderGuide } from "./guias-render.mjs";
import { ES_FUNDAMENTOS, EN_FUNDAMENTOS, PT_FUNDAMENTOS } from "./guias-nuevas-a.mjs";
import { ES_FACHADA, EN_FACHADA, PT_FACHADA, } from "./guias-nuevas-b.mjs";
import { ES_DEEP, EN_DEEP, PT_DEEP, ES_AUDIO, EN_AUDIO, PT_AUDIO } from "./guias-nuevas-c.mjs";
const PUBLIC = "/Users/home/Desktop/edutechlife/edutechlife-frontend/public/ialab-resources";
const jobs = [
  [ES_FUNDAMENTOS, "modulo1/guia-fundamentos-es.pdf"], [EN_FUNDAMENTOS, "modulo1/guia-fundamentos-en.pdf"], [PT_FUNDAMENTOS, "modulo1/guia-fundamentos-pt.pdf"],
  [ES_FACHADA, "modulo2/guia-fachada-es.pdf"], [EN_FACHADA, "modulo2/guia-fachada-en.pdf"], [PT_FACHADA, "modulo2/guia-fachada-pt.pdf"],
  [ES_DEEP, "modulo3/guia-deep-research-es.pdf"], [EN_DEEP, "modulo3/guia-deep-research-en.pdf"], [PT_DEEP, "modulo3/guia-deep-research-pt.pdf"],
  [ES_AUDIO, "modulo4/guia-audio-documentos-es.pdf"], [EN_AUDIO, "modulo4/guia-audio-documentos-en.pdf"], [PT_AUDIO, "modulo4/guia-audio-documentos-pt.pdf"],
];
for (const [doc, rel] of jobs) await renderGuide(doc, `${PUBLIC}/${rel}`);
console.log("NUEVAS_DONE");
