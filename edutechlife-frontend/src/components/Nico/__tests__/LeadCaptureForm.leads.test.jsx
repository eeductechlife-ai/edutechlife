import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LeadCaptureForm from "../LeadCaptureForm";

describe("Nico: LeadCaptureForm → /api/leads", () => {
  beforeEach(() => vi.restoreAllMocks());

  const llenarYEnviar = (container) => {
    fireEvent.change(container.querySelector('[name="nombreCompleto"]'), {
      target: { value: "Ana Gómez" },
    });
    fireEvent.change(container.querySelector('[name="telefono"]'), {
      target: { value: "3001234567" },
    });
    fireEvent.change(screen.getByLabelText("leadForm.profile_label"), {
      target: { value: "padre" },
    });
    fireEvent.click(
      screen.getByRole("checkbox", { name: /leadForm.consent_text/ }),
    );
    fireEvent.submit(container.querySelector("form"));
  };

  it("guarda en el backend (solo WhatsApp, sin correo) y luego sigue el chat", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), { status: 201 }),
      );
    const onSave = vi.fn().mockResolvedValue({});
    const { container } = render(<LeadCaptureForm onSave={onSave} />);
    llenarYEnviar(container);

    await waitFor(() => expect(onSave).toHaveBeenCalled());
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({
      nombre: "Ana Gómez",
      telefono: "3001234567",
      email: null,
      perfil: "padre",
      fuente: "nico",
    });
  });

  it("si el backend falla, Nico no da el lead por registrado", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("{}", { status: 500 }),
    );
    const onSave = vi.fn();
    const { container } = render(<LeadCaptureForm onSave={onSave} />);
    llenarYEnviar(container);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "leadForm.error_servidor",
    );
    expect(onSave).not.toHaveBeenCalled();
  });
});
