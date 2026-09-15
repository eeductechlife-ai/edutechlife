import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import "@testing-library/jest-dom/vitest";

const rpc = vi.fn();
vi.mock("../../../lib/supabase", () => ({ supabase: { rpc: (...a) => rpc(...a) } }));
vi.mock("../../../i18n/I18nProvider", () => ({
  useTranslation: () => ({ t: (k) => k, locale: "es" }),
}));
vi.mock("../../SEO", () => ({ default: () => null }));

import CertificateVerificationPage from "../CertificateVerificationPage";

const renderAt = (certNumber) =>
  render(
    <MemoryRouter initialEntries={[`/verificar/${certNumber}`]}>
      <Routes>
        <Route path="verificar/:certNumber" element={<CertificateVerificationPage />} />
      </Routes>
    </MemoryRouter>,
  );

beforeEach(() => {
  rpc.mockReset();
});

describe("CertificateVerificationPage (Fase 6)", () => {
  it("con formato inválido muestra el estado inválido y no llama a la RPC", async () => {
    renderAt("abc");
    await waitFor(() =>
      expect(screen.getByTestId("verify-invalid")).toBeInTheDocument(),
    );
    expect(rpc).not.toHaveBeenCalled();
  });

  it("con un certificado existente muestra los datos verificados", async () => {
    rpc.mockResolvedValue({
      data: [
        {
          cert_number: "EDL-2026-12345678",
          cert_name: "Ana Pérez",
          overall_score: 95,
          modules_completed: 5,
          issued_at: "2026-01-02T00:00:00Z",
        },
      ],
      error: null,
    });
    renderAt("edl-2026-12345678");
    await waitFor(() =>
      expect(screen.getByTestId("verify-valid")).toBeInTheDocument(),
    );
    expect(screen.getByText("Ana Pérez")).toBeInTheDocument();
    expect(rpc).toHaveBeenCalledWith("verify_certificate", {
      p_cert_number: "EDL-2026-12345678",
    });
  });

  it("si la RPC no devuelve filas muestra no encontrado", async () => {
    rpc.mockResolvedValue({ data: [], error: null });
    renderAt("EDL-2026-99999999");
    await waitFor(() =>
      expect(screen.getByTestId("verify-not-found")).toBeInTheDocument(),
    );
  });

  it("si la RPC falla muestra el estado no disponible", async () => {
    rpc.mockResolvedValue({ data: null, error: { message: "boom" } });
    renderAt("EDL-2026-99999999");
    await waitFor(() =>
      expect(screen.getByTestId("verify-unavailable")).toBeInTheDocument(),
    );
  });
});
