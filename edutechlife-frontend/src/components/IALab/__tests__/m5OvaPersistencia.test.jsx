import React from "react";
import { render, screen, fireEvent, cleanup, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import OVAClaudeFirstRequest from "../OVAClaudeFirstRequest";
import OVADelegation from "../OVAClaudeDelegation";
import { FIRST_REQUEST_DATA } from "../ova/claudeFirstRequestData";
import { FIRST_REQUEST_EXTRA } from "../ova/claudeFirstRequestExtra";
import { DELEGATION_DATA } from "../ova/claudeDelegationData";

vi.mock("../../../hooks/useAuthIdentity", () => ({
  useAuthIdentity: () => ({ userId: "estudiante-prueba" }),
}));

// Los OVA del módulo 5 guardan el avance: cerrar el recurso o recargar la página
// no devuelve al estudiante al inicio.
describe("OVA del módulo 5: el avance se guarda", () => {
  beforeEach(() => localStorage.clear());
  afterEach(cleanup);

  it("El Primer Pedido vuelve a la etapa donde se dejó", () => {
    const copy = FIRST_REQUEST_DATA.es;
    const extra = FIRST_REQUEST_EXTRA.es;
    const first = render(<OVAClaudeFirstRequest onComplete={vi.fn()} />);
    for (let i = 0; i < extra.flowSteps.length - 1; i++) {
      fireEvent.click(screen.getByRole("button", { name: copy.next2 }));
    }
    fireEvent.click(screen.getByRole("button", { name: copy.next }));
    // Ya estamos en el simulador: la etapa 1 (recorrido) ya no se ve.
    expect(screen.queryByRole("button", { name: copy.next2 })).toBeNull();
    first.unmount();

    render(<OVAClaudeFirstRequest onComplete={vi.fn()} />);
    expect(screen.queryByRole("button", { name: copy.next2 })).toBeNull();
    expect(
      screen.getAllByRole("button", { name: copy.parts[0].label })[0],
    ).toBeInTheDocument();
  });

  it("El Tablero de Delegación recuerda las tareas ya clasificadas", () => {
    const copy = DELEGATION_DATA.es;
    const t = copy.tasks[0];
    const first = render(<OVADelegation onComplete={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: copy.next }));
    const group = screen.getByRole("group", { name: t.task });
    fireEvent.click(
      within(group).getByRole("button", { name: copy.categories[t.answer] }),
    );
    first.unmount();

    // Al volver, el estudiante sigue en el tablero con su respuesta marcada.
    render(<OVADelegation onComplete={vi.fn()} />);
    const restored = screen.getByRole("group", { name: t.task });
    expect(
      within(restored).getByRole("button", { name: copy.categories[t.answer] }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("el avance de un estudiante no aparece en la cuenta de otro", () => {
    const copy = FIRST_REQUEST_DATA.es;
    const extra = FIRST_REQUEST_EXTRA.es;
    const first = render(<OVAClaudeFirstRequest onComplete={vi.fn()} />);
    for (let i = 0; i < extra.flowSteps.length - 1; i++) {
      fireEvent.click(screen.getByRole("button", { name: copy.next2 }));
    }
    first.unmount();
    const guardado = Object.keys(localStorage).filter((k) =>
      k.startsWith("ialab_ova_state::estudiante-prueba::"),
    );
    expect(guardado.length).toBeGreaterThan(0);
    expect(
      Object.keys(localStorage).some((k) => k.includes("::otro-estudiante::")),
    ).toBe(false);
  });
});
