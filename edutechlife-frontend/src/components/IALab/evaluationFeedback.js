const SUPPORTED_MODULE_IDS = [1, 2, 3, 4, 5];

const GENERIC_MASTERY_KEY = "ialab.evaluation.results.mastery_message";

/**
 * Devuelve el mensaje de dominio del módulo indicado. Si el módulo no tiene
 * un mensaje específico o la traducción no existe, cae al mensaje genérico.
 */
export function getMasteryMessage(moduleId, t) {
  const id = Number(moduleId);
  if (SUPPORTED_MODULE_IDS.includes(id)) {
    const key = `ialab.evaluation.results.mastery_message_m${id}`;
    const value = t(key);
    if (value && value !== key) return value;
  }
  return t(GENERIC_MASTERY_KEY);
}
