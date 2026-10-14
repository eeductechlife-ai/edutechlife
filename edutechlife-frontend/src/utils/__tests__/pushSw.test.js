/**
 * public/sw-push.js: aviso push del padre. Decisión del CEO 2026-10-13: la
 * notificación dice que el hijo/a está activo, sin nombre ni datos extra,
 * y al tocarla abre el panel de padres. El worker no intercepta peticiones.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const codigo = readFileSync(
  resolve(process.cwd(), "public/sw-push.js"),
  "utf8",
);

function cargarWorker() {
  const handlers = {};
  const self = {
    location: { origin: "https://edutechlife.co" },
    registration: { showNotification: vi.fn(() => Promise.resolve()) },
    clients: {
      matchAll: vi.fn(() => Promise.resolve([])),
      openWindow: vi.fn(() => Promise.resolve(null)),
    },
    addEventListener: (tipo, fn) => {
      handlers[tipo] = fn;
    },
  };
  new Function("self", codigo)(self);
  return { self, handlers };
}

/** Ejecuta un evento y espera las promesas pasadas a waitUntil. */
async function disparar(handler, evento) {
  const pendientes = [];
  handler({ ...evento, waitUntil: (p) => pendientes.push(p) });
  await Promise.all(pendientes);
}

describe("public/sw-push.js (avisos push del padre)", () => {
  test("al llegar una push muestra el aviso fijo, sin nombre ni datos extra", async () => {
    const { self, handlers } = cargarWorker();
    await disparar(handlers.push, { data: null });

    expect(self.registration.showNotification).toHaveBeenCalledTimes(1);
    const [titulo, opciones] = self.registration.showNotification.mock.calls[0];
    expect(titulo).toBe("Tu hijo/a está activo en IngenIA");
    expect(JSON.stringify(opciones)).not.toMatch(/Mateo|Pérez|nombre|body/i);
    expect(opciones.data).toEqual({ url: "/ingenia/padres" });
  });

  test("al tocar el aviso abre el panel de padres", async () => {
    const { self, handlers } = cargarWorker();
    const cerrar = vi.fn();
    await disparar(handlers.notificationclick, {
      notification: { close: cerrar },
    });

    expect(cerrar).toHaveBeenCalled();
    expect(self.clients.openWindow).toHaveBeenCalledWith(
      "https://edutechlife.co/ingenia/padres",
    );
  });

  test("si el panel ya está abierto lo enfoca en lugar de abrir otra pestaña", async () => {
    const { self, handlers } = cargarWorker();
    const focus = vi.fn(() => Promise.resolve());
    self.clients.matchAll.mockResolvedValueOnce([
      { url: "https://edutechlife.co/ingenia/padres", focus },
    ]);
    await disparar(handlers.notificationclick, {
      notification: { close: vi.fn() },
    });

    expect(focus).toHaveBeenCalled();
    expect(self.clients.openWindow).not.toHaveBeenCalled();
  });

  test("no intercepta peticiones ni guarda caché (no cambia cómo carga la app)", () => {
    const { handlers } = cargarWorker();
    expect(handlers.fetch).toBeUndefined();
    expect(codigo).not.toMatch(/caches\./);
  });
});
