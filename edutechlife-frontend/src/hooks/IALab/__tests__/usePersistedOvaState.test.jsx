import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

let mockUserId = "u1";
vi.mock("../../useAuthIdentity", () => ({
  useAuthIdentity: () => ({ userId: mockUserId }),
}));

import {
  usePersistedOvaState,
  clearOvaState,
} from "../usePersistedOvaState";

function Counter({ ova = "ova-a" }) {
  const [n, setN] = usePersistedOvaState(ova, "n", 0);
  return (
    <button type="button" onClick={() => setN(n + 1)}>
      valor:{n}
    </button>
  );
}

describe("usePersistedOvaState", () => {
  beforeEach(() => {
    localStorage.clear();
    mockUserId = "u1";
  });
  afterEach(cleanup);

  it("recuerda el valor al cerrar y volver a abrir el OVA", () => {
    const first = render(<Counter />);
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveTextContent("valor:2");
    first.unmount();

    render(<Counter />);
    expect(screen.getByRole("button")).toHaveTextContent("valor:2");
  });

  it("no mezcla el progreso de dos OVA distintos", () => {
    const a = render(<Counter ova="ova-a" />);
    fireEvent.click(screen.getByRole("button"));
    a.unmount();

    render(<Counter ova="ova-b" />);
    expect(screen.getByRole("button")).toHaveTextContent("valor:0");
  });

  it("no mezcla el progreso de dos estudiantes", () => {
    const first = render(<Counter />);
    fireEvent.click(screen.getByRole("button"));
    first.unmount();

    mockUserId = "u2";
    render(<Counter />);
    expect(screen.getByRole("button")).toHaveTextContent("valor:0");
  });

  it("clearOvaState borra lo guardado de ese OVA", () => {
    const first = render(<Counter />);
    fireEvent.click(screen.getByRole("button"));
    first.unmount();

    clearOvaState("u1", "ova-a");
    render(<Counter />);
    expect(screen.getByRole("button")).toHaveTextContent("valor:0");
  });

  it("sigue funcionando si el navegador no deja guardar", () => {
    const spy = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("cuota");
      });
    render(<Counter />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveTextContent("valor:1");
    spy.mockRestore();
  });
});
