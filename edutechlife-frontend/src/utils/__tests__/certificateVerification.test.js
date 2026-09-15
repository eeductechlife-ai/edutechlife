import { describe, it, expect } from "vitest";
import {
  CERT_VERIFY_BASE,
  normalizeCertNumber,
  isValidCertNumber,
  buildCertVerificationUrl,
} from "../certificateVerification.js";

describe("certificateVerification (Fase 6)", () => {
  it("normaliza el número (trim + mayúsculas)", () => {
    expect(normalizeCertNumber("  edl-2026-0001 ")).toBe("EDL-2026-0001");
    expect(normalizeCertNumber(null)).toBe("");
  });

  it("valida el formato del número de certificado", () => {
    expect(isValidCertNumber("EDL-2026-12345678")).toBe(true);
    expect(isValidCertNumber("edl-2026-12345678")).toBe(true);
    expect(isValidCertNumber("ABC")).toBe(false);
    expect(isValidCertNumber("has spaces")).toBe(false);
    expect(isValidCertNumber("")).toBe(false);
  });

  it("construye la URL pública de verificación", () => {
    expect(buildCertVerificationUrl("edl-2026-12345678")).toBe(
      `${CERT_VERIFY_BASE}/EDL-2026-12345678`,
    );
  });

  it("devuelve null si el número no es válido", () => {
    expect(buildCertVerificationUrl("no")).toBeNull();
    expect(buildCertVerificationUrl(undefined)).toBeNull();
  });
});
