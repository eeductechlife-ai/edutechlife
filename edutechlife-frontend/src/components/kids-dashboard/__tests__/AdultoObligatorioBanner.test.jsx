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
    expect(await screen.findByRole("alert")).toHaveTextContent(/edad real/);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("no envía con una edad fuera de 6 a 16 años y con edad válida y correo bien escrito sí envía", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ mostrarAviso: true }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ enviado: true }),
      });
    render(<AdultoObligatorioBanner />);
    await screen.findByText(/Registra a tu padre, madre o acudiente/);
    fireEvent.click(
      screen.getByRole("button", { name: /Registrar a mi adulto/ }),
    );

    fireEvent.change(screen.getByLabelText(/Tu edad/), {
      target: { value: "17" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Enviar invitación/ }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/6 a 16/);
    expect(global.fetch).toHaveBeenCalledTimes(1);

    fireEvent.change(screen.getByLabelText(/Tu edad/), {
      target: { value: "11" },
    });
    fireEvent.change(screen.getByLabelText(/Correo del padre/), {
      target: { value: "madre@ejemplo.com" },
    });
    fireEvent.change(screen.getByLabelText(/Nombre del padre/), {
      target: { value: "Marta Pérez" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /Enviar invitación/ }));
    expect(
      await screen.findByText(/Enviamos la invitación/),
    ).toBeInTheDocument();
    const cuerpo = JSON.parse(global.fetch.mock.calls[1][1].body);
    expect(cuerpo.edad).toBe(11);
    expect(cuerpo.adulto.email).toBe("madre@ejemplo.com");
  });
});
