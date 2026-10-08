import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

const signOutUser = vi.fn();
vi.mock("../../../../hooks/useAuthIdentity", () => ({
  signOutUser: (...a) => signOutUser(...a),
}));

import AccountDataSection from "../AccountDataSection";

const okJson = (body = {}) => ({
  ok: true,
  status: 200,
  json: async () => body,
  blob: async () => new Blob(["{}"]),
});

describe("AccountDataSection: Mis datos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    localStorage.clear();
    sessionStorage.setItem("auth_token", "tok");
    global.fetch = vi.fn().mockResolvedValue(okJson());
  });

  it("ofrece descargar, cambiar la contraseña y borrar", () => {
    render(<AccountDataSection dm={false} />);
    expect(screen.getByRole("heading", { name: "Mis datos" })).toBeTruthy();
    expect(
      screen.getByRole("button", { name: /Descargar mis datos/ }),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: /Cambiar mi contraseña/ }),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: /Borrar mis datos/ }),
    ).toBeTruthy();
  });

  it("no abre ningún diálogo ni llama al servidor hasta que se pide", () => {
    render(<AccountDataSection dm={false} />);
    expect(screen.queryByRole("alertdialog")).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });

  describe("borrar", () => {
    const open = () => {
      render(<AccountDataSection dm={false} />);
      fireEvent.click(screen.getByRole("button", { name: /Borrar mis datos/ }));
      return screen.getByRole("alertdialog");
    };
    const confirmButton = () =>
      screen.getByRole("button", { name: /Borrar todo/ });

    it("el cuadro es un alertdialog con título y explicación, y avisa que no se deshace", () => {
      const dialog = open();
      expect(dialog.getAttribute("aria-modal")).toBe("true");
      expect(
        screen.getByRole("alertdialog", { name: "¿Borrar todos mis datos?" }),
      ).toBeTruthy();
      expect(dialog.textContent).toMatch(/No se puede deshacer/);
    });

    it("el botón queda apagado hasta escribir BORRAR", () => {
      open();
      expect(confirmButton().disabled).toBe(true);
      const input = screen.getByLabelText(/Escribe BORRAR para confirmar/);
      fireEvent.change(input, { target: { value: "borra" } });
      expect(confirmButton().disabled).toBe(true);
      fireEvent.change(input, { target: { value: "borrar" } });
      expect(confirmButton().disabled).toBe(false);
    });

    it("sin confirmar, pulsar el botón apagado no manda nada", () => {
      open();
      fireEvent.click(confirmButton());
      expect(fetch).not.toHaveBeenCalled();
    });

    it("Cancelar y Escape cierran sin borrar", () => {
      open();
      fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
      expect(screen.queryByRole("alertdialog")).toBeNull();
      fireEvent.click(screen.getByRole("button", { name: /Borrar mis datos/ }));
      fireEvent.keyDown(screen.getByRole("alertdialog"), { key: "Escape" });
      expect(screen.queryByRole("alertdialog")).toBeNull();
      expect(fetch).not.toHaveBeenCalled();
    });

    it("el foco entra al cuadro al abrirse", () => {
      const dialog = open();
      expect(dialog.contains(document.activeElement)).toBe(true);
    });

    it("confirmado, borra con DELETE y cierra la sesión", async () => {
      open();
      fireEvent.change(screen.getByLabelText(/Escribe BORRAR para confirmar/), {
        target: { value: "BORRAR" },
      });
      fireEvent.click(confirmButton());
      await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
      expect(fetch.mock.calls[0][0]).toBe("/api/ingenia/delete-user-data");
      expect(fetch.mock.calls[0][1].method).toBe("DELETE");
      await waitFor(() =>
        expect(signOutUser).toHaveBeenCalledWith("/login", undefined),
      );
    });

    it("si el servidor lo rechaza, el cuadro sigue abierto con el motivo", async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 403,
        json: async () => ({
          error: "Se necesita la autorización de tus padres.",
        }),
      });
      open();
      fireEvent.change(screen.getByLabelText(/Escribe BORRAR para confirmar/), {
        target: { value: "BORRAR" },
      });
      fireEvent.click(confirmButton());
      const alert = await screen.findByRole("alert");
      expect(alert.textContent).toBe(
        "Se necesita la autorización de tus padres.",
      );
      expect(screen.getByRole("alertdialog")).toBeTruthy();
      expect(signOutUser).not.toHaveBeenCalled();
    });
  });

  describe("descargar y contraseña", () => {
    it("descargar muestra el resultado", async () => {
      global.URL.createObjectURL = vi.fn(() => "blob:x");
      global.URL.revokeObjectURL = vi.fn();
      vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(
        () => {},
      );
      render(<AccountDataSection dm={false} />);
      fireEvent.click(
        screen.getByRole("button", { name: /Descargar mis datos/ }),
      );
      const status = await screen.findByRole("status");
      expect(status.textContent).toMatch(/se descargó/);
    });

    it("cambiar la contraseña manda el correo y confirma", async () => {
      localStorage.setItem("user_email", "ana@correo.co");
      render(<AccountDataSection dm={false} />);
      fireEvent.click(
        screen.getByRole("button", { name: /Cambiar mi contraseña/ }),
      );
      const status = await screen.findByRole("status");
      expect(status.textContent).toContain("ana@correo.co");
    });
  });
});
