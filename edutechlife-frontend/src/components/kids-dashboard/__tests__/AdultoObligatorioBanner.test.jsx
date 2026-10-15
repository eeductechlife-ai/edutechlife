import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdultoObligatorioBanner from "../AdultoObligatorioBanner";

vi.mock("../../../hooks/useAuthIdentity", () => ({
  useAuthIdentity: () => ({ token: "tok", isLoaded: true, isSignedIn: true }),
}));

describe("AdultoObligatorioBanner", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("no muestra nada si el servidor no pide aviso", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ mostrarAviso: false }),
    });
    const { container } = render(<AdultoObligatorioBanner />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    expect(container).toBeEmptyDOMElement();
  });

  it("muestra el aviso sin bloquear y valida antes de enviar la invitación", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ mostrarAviso: true }),
    });
    render(<AdultoObligatorioBanner />);
    await screen.findByText(/Registra a tu padre, madre o acudiente/);
    fireEvent.click(
      screen.getByRole("button", { name: /Registrar a mi adulto/ }),
    );
    fireEvent.click(screen.getByRole("button", { name: /Enviar invitación/ }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/correo válido/);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
