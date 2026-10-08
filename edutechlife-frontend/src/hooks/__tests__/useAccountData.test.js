import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

const signOutUser = vi.fn();
vi.mock("../useAuthIdentity", () => ({
  signOutUser: (...a) => signOutUser(...a),
}));

import {
  useAccountData,
  isDeleteConfirmed,
  DELETE_CONFIRM_WORD,
} from "../useAccountData";

const json = (body, ok = true, status = 200) => ({
  ok,
  status,
  json: async () => body,
  blob: async () =>
    new Blob([JSON.stringify(body)], { type: "application/json" }),
});

describe("isDeleteConfirmed", () => {
  it("exige la palabra BORRAR, sin importar mayúsculas ni espacios", () => {
    expect(DELETE_CONFIRM_WORD).toBe("BORRAR");
    expect(isDeleteConfirmed("BORRAR")).toBe(true);
    expect(isDeleteConfirmed(" borrar ")).toBe(true);
  });
  it("rechaza todo lo demás", () => {
    for (const t of ["", "bora", "borrar todo", "ELIMINAR", null, undefined]) {
      expect(isDeleteConfirmed(t), String(t)).toBe(false);
    }
  });
});

describe("useAccountData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    localStorage.clear();
    global.fetch = vi.fn();
  });
  afterEach(() => vi.restoreAllMocks());

  describe("borrar", () => {
    it("sin la palabra de confirmación no manda nada al servidor", async () => {
      sessionStorage.setItem("auth_token", "tok");
      const { result } = renderHook(() => useAccountData());
      let ok;
      await act(async () => {
        ok = await result.current.deleteData("borra");
      });
      expect(ok).toBe(false);
      expect(fetch).not.toHaveBeenCalled();
      expect(signOutUser).not.toHaveBeenCalled();
    });

    it("sin sesión no intenta borrar y lo explica", async () => {
      const { result } = renderHook(() => useAccountData());
      await act(async () => {
        await result.current.deleteData("BORRAR");
      });
      expect(fetch).not.toHaveBeenCalled();
      expect(result.current.removal.status).toBe("error");
      expect(result.current.removal.message).toMatch(/sesión terminó/);
    });

    it("con la palabra y sesión llama a DELETE con el token y cierra la sesión", async () => {
      sessionStorage.setItem("auth_token", "tok-123");
      fetch.mockResolvedValue(json({ message: "ok" }));
      const navigate = vi.fn();
      const { result } = renderHook(() => useAccountData({ navigate }));
      await act(async () => {
        await result.current.deleteData("BORRAR");
      });
      const [url, init] = fetch.mock.calls[0];
      expect(url).toBe("/api/ingenia/delete-user-data");
      expect(init.method).toBe("DELETE");
      expect(init.headers.Authorization).toBe("Bearer tok-123");
      expect(signOutUser).toHaveBeenCalledWith("/login", navigate);
      expect(result.current.removal.status).toBe("done");
    });

    it("si el servidor rechaza (p. ej. falta permiso de los padres) muestra su mensaje y NO cierra la sesión", async () => {
      sessionStorage.setItem("auth_token", "tok");
      fetch.mockResolvedValue(
        json(
          { error: "Se necesita la autorización de tus padres." },
          false,
          403,
        ),
      );
      const { result } = renderHook(() => useAccountData());
      await act(async () => {
        await result.current.deleteData("BORRAR");
      });
      expect(result.current.removal).toEqual({
        status: "error",
        message: "Se necesita la autorización de tus padres.",
      });
      expect(signOutUser).not.toHaveBeenCalled();
    });

    it("si falla la red avisa y no cierra la sesión", async () => {
      sessionStorage.setItem("auth_token", "tok");
      fetch.mockRejectedValue(new Error("Failed to fetch"));
      const { result } = renderHook(() => useAccountData());
      await act(async () => {
        await result.current.deleteData("BORRAR");
      });
      expect(result.current.removal.status).toBe("error");
      expect(signOutUser).not.toHaveBeenCalled();
    });
  });

  describe("descargar", () => {
    it("sin sesión no llama al servidor", async () => {
      const { result } = renderHook(() => useAccountData());
      await act(async () => {
        await result.current.downloadData();
      });
      expect(fetch).not.toHaveBeenCalled();
      expect(result.current.download.status).toBe("error");
    });

    it("descarga el JSON como archivo", async () => {
      sessionStorage.setItem("auth_token", "tok");
      fetch.mockResolvedValue(json({ data: { profile: { name: "Ana" } } }));
      global.URL.createObjectURL = vi.fn(() => "blob:x");
      global.URL.revokeObjectURL = vi.fn();
      const click = vi
        .spyOn(HTMLAnchorElement.prototype, "click")
        .mockImplementation(() => {});
      const { result } = renderHook(() => useAccountData());
      await act(async () => {
        await result.current.downloadData();
      });
      expect(fetch.mock.calls[0][0]).toBe("/api/ingenia/export-user-data");
      expect(fetch.mock.calls[0][1].headers.Authorization).toBe("Bearer tok");
      expect(click).toHaveBeenCalledTimes(1);
      expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:x");
      expect(result.current.download.status).toBe("done");
    });

    it("si el servidor falla muestra el error y no descarga nada", async () => {
      sessionStorage.setItem("auth_token", "tok");
      fetch.mockResolvedValue(
        json({ error: "Error al exportar datos personales" }, false, 500),
      );
      const click = vi
        .spyOn(HTMLAnchorElement.prototype, "click")
        .mockImplementation(() => {});
      const { result } = renderHook(() => useAccountData());
      await act(async () => {
        await result.current.downloadData();
      });
      expect(result.current.download).toEqual({
        status: "error",
        message: "Error al exportar datos personales",
      });
      expect(click).not.toHaveBeenCalled();
    });
  });

  describe("contraseña", () => {
    it("sin correo guardado pide volver a entrar", async () => {
      const { result } = renderHook(() => useAccountData());
      await act(async () => {
        await result.current.sendPasswordEmail();
      });
      expect(fetch).not.toHaveBeenCalled();
      expect(result.current.password.status).toBe("error");
    });

    it("manda el correo de recuperación y confirma a qué dirección", async () => {
      localStorage.setItem("user_email", "ana@correo.co");
      fetch.mockResolvedValue(json({ ok: true }));
      const { result } = renderHook(() => useAccountData());
      await act(async () => {
        await result.current.sendPasswordEmail();
      });
      const [url, init] = fetch.mock.calls[0];
      expect(url).toBe("/api/auth/reset-password");
      expect(JSON.parse(init.body)).toEqual({ email: "ana@correo.co" });
      expect(result.current.password.status).toBe("done");
      expect(result.current.password.message).toContain("ana@correo.co");
    });
  });
});
