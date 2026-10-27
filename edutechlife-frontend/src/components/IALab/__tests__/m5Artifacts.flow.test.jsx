import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi } from "vitest";
import OVAClaudeArtifacts from "../OVAClaudeArtifacts";
import { ARTIFACTS_DATA } from "../ova/claudeArtifactsData";
import { ARTIFACTS_EXTRA } from "../ova/claudeArtifactsExtra";
import { ARTIFACTS_SCENARIOS } from "../ova/claudeArtifactsScenarios";

// Recorre el OVA "El Taller de Artifacts" como un estudiante: tipo de pieza, pedido de ejemplo,
// cambios en orden, verificación de cifras, quiz, comparación y revisión.
describe("OVA El Taller de Artifacts: recorrido completo", () => {
  it("se completa con el flujo del estudiante", () => {
    const copy = ARTIFACTS_DATA.es;
    const extra = ARTIFACTS_EXTRA.es;
    const scenarios = ARTIFACTS_SCENARIOS.es;
    const onComplete = vi.fn();
    render(<OVAClaudeArtifacts onComplete={onComplete} />);

    // Qué es: elegir tipo de pieza
    fireEvent.click(screen.getByRole("button", { name: new RegExp(`^${extra.types[0].name}`) }));
    fireEvent.click(screen.getByRole("button", { name: copy.next }));

    // Pedido: ejemplo completo
    fireEvent.click(screen.getByRole("button", { name: copy.example }));
    expect(screen.getByText(new RegExp(copy.quality[3]))).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: copy.next }));

    // Cambios en orden acumulado
    for (const c of extra.changes) fireEvent.click(screen.getByRole("button", { name: c.label }));
    const verifyBoxes = screen.getAllByRole("checkbox");
    verifyBoxes.slice(0, 3).forEach((box) => fireEvent.click(box));
    fireEvent.click(screen.getByRole("button", { name: extra.verifyCheck }));
    expect(screen.getByText(extra.verifyOk)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: copy.next }));

    // Quiz (respuestas correctas) y comparación
    for (const s of scenarios) {
      fireEvent.click(screen.getByRole("button", { name: s.options[s.correct] }));
      fireEvent.click(screen.getAllByRole("button", { name: /Siguiente|Ver resultado/ })[0]);
    }
    expect(screen.getByText(copy.quizPassed)).toBeInTheDocument();
    const compare = screen.getByText(extra.compare.title).closest("div");
    fireEvent.click(within(compare).getByRole("button", { name: extra.compare.chooseB }));
    fireEvent.click(screen.getByRole("button", { name: copy.next }));

    // Revisión antes de compartir
    screen.getAllByRole("checkbox").forEach((box) => fireEvent.click(box));
    expect(screen.getByText(copy.done, { exact: false })).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
