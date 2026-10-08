import { describe, it, expect, beforeEach } from "vitest";
import { queueSyncOperation } from "../ingenIASync";

// La cola de sincronización se llamaba `smartboard_sync_queue` (nombre anterior
// del producto). Las operaciones sin sincronizar que haya dejado una versión
// vieja no se pueden perder al pasar a `ingenia_sync_queue`.
describe("cola de sincronización: paso de smartboard_sync_queue a ingenia_sync_queue", () => {
  beforeEach(() => localStorage.clear());

  it("escribe en la clave nueva", () => {
    queueSyncOperation({ type: "full_sync", n: 1 });
    expect(JSON.parse(localStorage.getItem("ingenia_sync_queue"))).toHaveLength(
      1,
    );
    expect(localStorage.getItem("smartboard_sync_queue")).toBeNull();
  });

  it("conserva, y pone primero, lo que dejó la clave anterior", () => {
    localStorage.setItem(
      "smartboard_sync_queue",
      JSON.stringify([
        { type: "full_sync", n: 0, queuedAt: "2026-01-01T00:00:00.000Z" },
      ]),
    );
    queueSyncOperation({ type: "full_sync", n: 1 });
    const queue = JSON.parse(localStorage.getItem("ingenia_sync_queue"));
    expect(queue.map((op) => op.n)).toEqual([0, 1]);
    expect(queue[0].queuedAt).toBe("2026-01-01T00:00:00.000Z");
    expect(localStorage.getItem("smartboard_sync_queue")).toBeNull();
  });

  it("mezcla lo anterior con lo que ya había en la clave nueva", () => {
    localStorage.setItem("smartboard_sync_queue", JSON.stringify([{ n: 0 }]));
    localStorage.setItem("ingenia_sync_queue", JSON.stringify([{ n: 1 }]));
    queueSyncOperation({ n: 2 });
    expect(
      JSON.parse(localStorage.getItem("ingenia_sync_queue")).map((op) => op.n),
    ).toEqual([0, 1, 2]);
  });

  it("una cola anterior corrupta no impide encolar", () => {
    localStorage.setItem("smartboard_sync_queue", "{no es json");
    queueSyncOperation({ n: 1 });
    expect(JSON.parse(localStorage.getItem("ingenia_sync_queue"))).toHaveLength(
      1,
    );
  });
});
