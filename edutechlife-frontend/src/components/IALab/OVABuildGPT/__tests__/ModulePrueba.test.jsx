import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi } from "vitest";
import ModulePrueba from "../screens/ModulePrueba";

// Paso 4 del Taller de Proyectos: solo avanza con la respuesta que verifica la fecha y el requisito.
describe("Taller de Proyectos · Paso 4 (prueba antes de usar)", () => {
  it("no avanza con una respuesta incorrecta y avanza con la correcta", () => {
    const onNext = vi.fn();
    const addXp = vi.fn();
    render(<ModulePrueba onNext={onNext} addXp={addXp} />);

    fireEvent.click(
      screen.getByText("El tono, porque las instrucciones ya lo piden."),
    );
    expect(
      screen.queryByRole("button", { name: /Continuar a la actividad/ }),
    ).toBeNull();
    expect(addXp).not.toHaveBeenCalled();

    fireEvent.click(
      screen.getByText(
        "La fecha y el requisito del documento, porque no están en los archivos del Proyecto.",
      ),
    );
    expect(addXp).toHaveBeenCalledTimes(1);
    fireEvent.click(
      screen.getByRole("button", { name: /Continuar a la actividad/ }),
    );
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it("suma XP una sola vez aunque el alumno vuelva a elegir la correcta", () => {
    const addXp = vi.fn();
    render(<ModulePrueba onNext={vi.fn()} addXp={addXp} />);
    const right = screen.getByText(
      "La fecha y el requisito del documento, porque no están en los archivos del Proyecto.",
    );
    fireEvent.click(right);
    fireEvent.click(right);
    expect(addXp).toHaveBeenCalledTimes(1);
  });
});
