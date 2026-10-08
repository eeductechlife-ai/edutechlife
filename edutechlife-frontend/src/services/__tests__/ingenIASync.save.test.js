import { describe, it, expect, vi, beforeEach } from "vitest";
import { saveToSupabase } from "../ingenIASync";

/**
 * Cliente falso que registra el orden de las llamadas. `updateRows` es lo que
 * devuelve el UPDATE (filas actualizadas); `insertResult` lo del INSERT.
 */
function fakeClient({
  updateRows = [{ user_id: "u1" }],
  updateError = null,
  insertResult = { data: { user_id: "u1" }, error: null },
} = {}) {
  const log = [];
  const client = {
    log,
    from: vi.fn((table) => {
      const chain = {
        update: (payload) => {
          log.push(["update", table, payload]);
          return chain;
        },
        insert: (payload) => {
          log.push(["insert", table, payload]);
          return chain;
        },
        select: (cols) => {
          log.push(["select", cols]);
          return chain;
        },
        eq: (col, val) => {
          log.push(["eq", col, val]);
          return chain;
        },
        maybeSingle: () => Promise.resolve(insertResult),
        then: (resolve, reject) =>
          Promise.resolve({ data: updateRows, error: updateError }).then(
            resolve,
            reject,
          ),
      };
      return chain;
    }),
  };
  return client;
}

const data = {
  totalPoints: 120,
  daniChatHistory: [{ role: "user", text: "hola" }],
};

beforeEach(() => {
  localStorage.clear();
  Object.defineProperty(navigator, "onLine", {
    value: true,
    configurable: true,
  });
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("saveToSupabase: un solo viaje cuando la fila ya existe", () => {
  it("actualiza directamente (sin consultar antes si existe)", async () => {
    const client = fakeClient();
    const result = await saveToSupabase(client, "u1", data);
    expect(result).toEqual({ success: true, data: { user_id: "u1" } });
    const ops = client.log.map((e) => e[0]);
    expect(ops.filter((o) => o === "update")).toHaveLength(1);
    expect(ops).not.toContain("insert");
    expect(client.from).toHaveBeenCalledTimes(1); // antes: SELECT + UPDATE = 2
  });

  it("manda el JSON del estudiante solo una vez y pide de vuelta solo user_id", async () => {
    const client = fakeClient();
    await saveToSupabase(client, "u1", data);
    const update = client.log.find((e) => e[0] === "update");
    expect(update[2]).toEqual({ user_id: "u1", platform: "smartboard", data });
    const select = client.log.find((e) => e[0] === "select");
    expect(select[1]).toBe("user_id"); // antes: select("*") devolvía el JSON completo
    expect(client.log).toContainEqual(["eq", "user_id", "u1"]);
  });

  it("si no había fila (el UPDATE no cambió nada) inserta", async () => {
    const client = fakeClient({ updateRows: [] });
    const result = await saveToSupabase(client, "u1", data);
    expect(result.success).toBe(true);
    const ops = client.log.map((e) => e[0]);
    expect(ops).toContain("update");
    expect(ops).toContain("insert");
    expect(ops.indexOf("update")).toBeLessThan(ops.indexOf("insert"));
    expect(client.log.find((e) => e[0] === "insert")[2].user_id).toBe("u1");
  });
});

describe("saveToSupabase: fallos", () => {
  it("sin cliente o sin usuario no hace nada", async () => {
    expect(await saveToSupabase(null, "u1", data)).toEqual({
      success: false,
      error: "Cliente Supabase o userId no disponible",
    });
    expect((await saveToSupabase(fakeClient(), null, data)).success).toBe(
      false,
    );
  });

  it("sin conexión guarda en la cola local y avisa", async () => {
    Object.defineProperty(navigator, "onLine", {
      value: false,
      configurable: true,
    });
    const client = fakeClient();
    const result = await saveToSupabase(client, "u1", data);
    expect(result).toEqual({ success: false, error: "offline", offline: true });
    expect(client.from).not.toHaveBeenCalled();
    expect(JSON.parse(localStorage.getItem("ingenia_sync_queue"))).toHaveLength(
      1,
    );
  });

  it("un error de sesión (JWT) deja la operación en cola para reintentar", async () => {
    const client = fakeClient({
      updateError: { status: 401, message: "JWT expired" },
    });
    const result = await saveToSupabase(client, "u1", data);
    expect(result).toMatchObject({ success: false, offline: true });
    expect(JSON.parse(localStorage.getItem("ingenia_sync_queue"))).toHaveLength(
      1,
    );
  });

  it("otro error del servidor también se encola y se informa", async () => {
    const client = fakeClient({
      updateError: { status: 500, message: "boom" },
    });
    const result = await saveToSupabase(client, "u1", data);
    expect(result).toEqual({ success: false, error: "boom" });
    expect(JSON.parse(localStorage.getItem("ingenia_sync_queue"))).toHaveLength(
      1,
    );
  });

  it("si el insert falla se encola y se informa", async () => {
    const client = fakeClient({
      updateRows: [],
      insertResult: {
        data: null,
        error: { status: 500, message: "sin permiso" },
      },
    });
    const result = await saveToSupabase(client, "u1", data);
    expect(result).toEqual({ success: false, error: "sin permiso" });
    expect(JSON.parse(localStorage.getItem("ingenia_sync_queue"))).toHaveLength(
      1,
    );
  });
});
