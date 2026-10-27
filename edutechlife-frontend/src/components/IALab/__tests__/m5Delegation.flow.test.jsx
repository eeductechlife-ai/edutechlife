import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi } from "vitest";
import OVAClaudeDelegation from "../OVAClaudeDelegation";
import { DELEGATION_DATA } from "../ova/claudeDelegationData";
import { PROJECT_BUILDER } from "../ova/claudeProjectBuilderData";

// Recorre el OVA "El Tablero de Delegación" como un estudiante: reglas, las ocho tareas,
// tu propia tarea, tu Proyecto y tu Skill, y el resumen.
describe("OVA El Tablero de Delegación: recorrido completo", () => {
  it("se completa con el flujo del estudiante", () => {
    const copy = DELEGATION_DATA.es;
    const pb = PROJECT_BUILDER.es;
    const onComplete = vi.fn();
    render(<OVAClaudeDelegation onComplete={onComplete} />);

    // Reglas
    fireEvent.click(screen.getByRole("button", { name: copy.next }));

    // Tablero: clasifica las ocho tareas
    for (const t of copy.tasks) {
      const group = screen.getByRole("group", { name: t.task });
      fireEvent.click(within(group).getByRole("button", { name: copy.categories[t.answer] }));
    }
    fireEvent.click(screen.getByRole("button", { name: copy.next }));

    // Tu propia tarea: texto y tres preguntas (todas "No" → delegar)
    fireEvent.change(screen.getByPlaceholderText(copy.ownPlaceholder), { target: { value: "Preparar el boletín mensual" } });
    screen.getAllByRole("button", { name: copy.no }).forEach((b) => fireEvent.click(b));
    expect(screen.getByText(`${copy.ownResult}: ${copy.categories.delegate}`)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: copy.next }));

    // Tu Proyecto y tu Skill
    pb.projectFields.forEach((f) => fireEvent.change(screen.getByPlaceholderText(f.placeholder), { target: { value: "Dos palabras" } }));
    pb.skillFields.forEach((f) => fireEvent.change(screen.getByPlaceholderText(f.placeholder), { target: { value: "Cuatro palabras de prueba" } }));
    pb.files.forEach((f, i) => { if (f.ok) fireEvent.click(screen.getByRole("checkbox", { name: f.t })); });
    fireEvent.click(screen.getByRole("button", { name: pb.connectorOptions[pb.connectorCorrect] }));
    expect(screen.getByText(pb.ready)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: copy.next }));

    // Resumen: 8 de 8 y completado
    expect(screen.getByText(copy.score.replace("{n}", "8").replace("{total}", "8"))).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
