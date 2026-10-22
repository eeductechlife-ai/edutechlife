import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdultoMenorConfirmar from "../AdultoMenorConfirmar";

vi.mock("../../hooks/useAuthIdentity", () => ({
  useAuthIdentity: () => ({ token: "tok", isLoaded: true, isSignedIn: true }),
}));

const TOKEN = "t".repeat(40);

function pagina() {
  return render(
    <MemoryRouter initialEntries={[`/adulto-menor/confirmar?token=${TOKEN}`]}>
      <AdultoMenorConfirmar />
    </MemoryRouter>,
  );
}

describe("AdultoMenorConfirmar", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ valida: true }),
    });
  });

  it("no envía nada al cargar: la activación exige que el adulto la confirme", () => {
    pagina();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("el botón queda desactivado hasta marcar la autorización", () => {
    pagina();
    expect(
      screen.getByRole("button", { name: /confirmar y activar/i }),
    ).toBeDisabled();
  });

  it("al confirmar envía la aceptación y la versión del texto", async () => {
    pagina();
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(
      screen.getByRole("button", { name: /confirmar y activar/i }),
    );

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    const [url, opciones] = global.fetch.mock.calls[0];
    expect(url).toMatch(/\/api\/auth\/adulto-menor\/confirmar$/);
    expect(JSON.parse(opciones.body)).toEqual({
      token: TOKEN,
      aceptaAutorizacion: true,
      versionAutorizacion: "adulto-menor-v1-2026-10-20",
    });
    expect(await screen.findByText(/Quedaste vinculado/)).toBeInTheDocument();
  });

  it("muestra el motivo del servidor si el enlace ya fue usado", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ motivo: "usada", error: "x" }),
    });
    pagina();
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(
      screen.getByRole("button", { name: /confirmar y activar/i }),
    );
    expect(
      await screen.findByText(/Este enlace ya fue usado/),
    ).toBeInTheDocument();
  });
});
