import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi } from "vitest";
import OVAClaudeFirstRequest from "../OVAClaudeFirstRequest";
import { FIRST_REQUEST_DATA } from "../ova/claudeFirstRequestData";
import { FIRST_REQUEST_EXTRA } from "../ova/claudeFirstRequestExtra";
import { FIRST_REQUEST_SCENARIOS } from "../ova/claudeFirstRequestScenarios";

// Recorre el OVA "El Primer Pedido" como un estudiante: etapas, simulador, versiones,
// quiz (4 de 5), comparación, constructor del pedido y completado.
describe("OVA El Primer Pedido: recorrido completo", () => {
  it("se completa con el flujo del estudiante", () => {
    const copy = FIRST_REQUEST_DATA.es;
    const extra = FIRST_REQUEST_EXTRA.es;
    const scenarios = FIRST_REQUEST_SCENARIOS.es;
    const onComplete = vi.fn();
    render(<OVAClaudeFirstRequest onComplete={onComplete} />);

    // Etapa 1: recorrido del procesamiento y tarjetas
    for (let i = 0; i < extra.flowSteps.length - 1; i++) fireEvent.click(screen.getByRole("button", { name: copy.next2 }));
    fireEvent.click(screen.getByRole("button", { name: copy.next }));

    // Etapa 2: simulador (activa las cinco partes) y diagnóstico
    for (const p of copy.parts) fireEvent.click(screen.getAllByRole("button", { name: p.label, pressed: false })[0]);
    expect(screen.getByText(copy.ready)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: copy.next }));

    // Etapa 3: versiones por capas
    for (let i = 0; i < extra.iterations.length - 1; i++) fireEvent.click(screen.getByRole("button", { name: copy.nextVersion }));
    fireEvent.click(screen.getByRole("button", { name: copy.next }));

    // Etapa 4: quiz (respuestas correctas) y comparación
    for (const s of scenarios) {
      fireEvent.click(screen.getByRole("button", { name: s.options[s.correct] }));
      fireEvent.click(screen.getAllByRole("button", { name: /Siguiente|Ver resultado/ })[0]);
    }
    expect(screen.getByText(copy.quizPassed)).toBeInTheDocument();
    const compare = screen.getByText(extra.compare.title).closest("div");
    fireEvent.click(within(compare).getByRole("button", { name: extra.compare.chooseB }));
    fireEvent.click(screen.getByRole("button", { name: copy.next }));

    // Etapa 5: constructor del pedido
    const fields = copy.fields.map((f) => screen.getByPlaceholderText(f.placeholder));
    fields.forEach((input) => fireEvent.change(input, { target: { value: "Frase de tres palabras" } }));
    expect(screen.getByText(copy.builderReady)).toBeInTheDocument();
    expect(screen.getByText(copy.done)).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
