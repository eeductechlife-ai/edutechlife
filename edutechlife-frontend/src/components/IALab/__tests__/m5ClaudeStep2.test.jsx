import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi } from "vitest";
import ClaudeStep2 from "../challenges/module5/ClaudeStep2";
import { parseBriefEvidence } from "../../../data/ova/claudeBriefEvidence";

// Paso 2 del desafío: el pedido, el resultado pegado y las tres revisiones se guardan juntos.
function Harness({ onChange }) {
  const [value, setValue] = useState("");
  return (
    <ClaudeStep2
      exercise={{ casoBrief: "Caso de prueba" }}
      response={value}
      onResponseChange={(next) => {
        setValue(next);
        onChange(next);
      }}
    />
  );
}

describe("desafío del Módulo 5, paso 2: pedido, resultado y revisión", () => {
  it("guarda el pedido, el resultado pegado y las revisiones marcadas", () => {
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    fireEvent.change(screen.getByPlaceholderText("Escribe el pedido para Claude…"), {
      target: { value: "Objetivo: alianza. Audiencia: rectoría." },
    });
    fireEvent.change(screen.getByPlaceholderText("Pega el texto completo que generó Claude…"), {
      target: { value: "Resultado de prueba" },
    });
    screen.getAllByRole("checkbox").forEach((box) => fireEvent.click(box));
    const saved = parseBriefEvidence(onChange.mock.calls.at(-1)[0]);
    expect(saved.pedido).toBe("Objetivo: alianza. Audiencia: rectoría.");
    expect(saved.resultado).toBe("Resultado de prueba");
    expect(saved.revision).toEqual([true, true, true]);
  });
});
