import { precios } from "./intents/precios.js";
import { promociones } from "./intents/promociones.js";
import { servicios } from "./intents/servicios.js";
import { inscripcion } from "./intents/inscripcion.js";
import { ventas } from "./intents/ventas.js";
import { objeciones } from "./intents/objeciones.js";
import { pagos } from "./intents/pagos.js";
import { politicas } from "./intents/politicas.js";
import { generales } from "./intents/generales.js";
import { contacto } from "./intents/contacto.js";
import { soporte } from "./intents/soporte.js";
import { categories } from "./categories.js";
import {
  matchIntent as _matchIntent,
  getKnowledgeStats as _getKnowledgeStats,
} from "./engine.js";

const intents = [
  ...precios,
  ...promociones,
  ...servicios,
  ...inscripcion,
  ...ventas,
  ...objeciones,
  ...pagos,
  ...politicas,
  ...generales,
  ...contacto,
  ...soporte,
];

export const KNOWLEDGE = { intents, categories };

export function matchIntent(text) {
  return _matchIntent(text, KNOWLEDGE.intents);
}

export function getKnowledgeStats() {
  return _getKnowledgeStats(KNOWLEDGE);
}

export { categories };
