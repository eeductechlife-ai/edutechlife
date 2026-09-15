/**
 * featureFlags.js — Banderas de funcionalidad (default seguro: apagadas).
 *
 * Permiten integrar trabajo en curso sin alterar el comportamiento instalado.
 */
export const FEATURE_FLAGS = {
  PEER_REVIEW: false,
};

export function isFeatureEnabled(name) {
  return FEATURE_FLAGS[name] === true;
}
