/**
 * certificateVerification.js — Verificación pública de certificados (Fase 6)
 *
 * Utilidades puras para normalizar y validar el número de certificado y
 * construir su URL pública de verificación. Aditivo: no altera el flujo actual.
 */

export const CERT_VERIFY_BASE = "https://edutechlife.co/verificar";

const CERT_NUMBER_RE = /^[A-Z0-9-]{6,}$/;

export function normalizeCertNumber(value) {
  return String(value ?? "")
    .trim()
    .toUpperCase();
}

export function isValidCertNumber(value) {
  const normalized = normalizeCertNumber(value);
  if (!normalized) return false;
  return CERT_NUMBER_RE.test(normalized);
}

export function buildCertVerificationUrl(value) {
  const normalized = normalizeCertNumber(value);
  if (!isValidCertNumber(normalized)) return null;
  return `${CERT_VERIFY_BASE}/${normalized}`;
}
