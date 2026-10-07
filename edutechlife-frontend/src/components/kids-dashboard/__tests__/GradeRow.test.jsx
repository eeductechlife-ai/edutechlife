import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import GradeRow, { NOTE_RANGE_MESSAGE } from "../GradeRow";

// Un componente estable por etiqueta: si el mock devolviera una función nueva
// en cada render, React desmontaría el campo en cada tecla.
vi.mock("framer-motion", async () => {
  const React = await import("react");
  const cache = {};
  return {
    motion: new Proxy(
      {},
      {
        get: (_, tag) =>
          (cache[tag] ||= ({
            children,
            initial,
            animate,
            exit,
            transition,
            ...rest
          }) => React.createElement(tag, rest, children)),
      },
    ),
  };
});

const subjects = [{ v: "matematicas", l: "Matemáticas", i: "🔢" }];
const setup = (grade = {}) => {
  const onUpdate = vi.fn();
  render(
    <GradeRow
      grade={{ id: 1, subject: "matematicas", p1: null, ...grade }}
      subjects={subjects}
      onUpdate={onUpdate}
      onRemove={vi.fn()}
    />,
  );
  return { onUpdate, input: screen.getByLabelText("Nota P1") };
};
const type = (input, value) => fireEvent.change(input, { target: { value } });

describe("GradeRow: validación de notas", () => {
  it("acepta una nota válida, también con coma decimal", () => {
    const { onUpdate, input } = setup();
    type(input, "3,5");
    expect(onUpdate).toHaveBeenCalledWith(1, "p1", 3.5);
    expect(screen.queryByRole("alert")).toBeNull();
    expect(input.value).toBe("3,5");
  });

  it.each(["7", "abc", "-2", "0", "5,1", "0,9"])(
    "avisa con «%s» y no guarda el valor",
    (value) => {
      const { onUpdate, input } = setup();
      type(input, value);
      expect(screen.getByRole("alert").textContent).toBe(NOTE_RANGE_MESSAGE);
      expect(onUpdate).not.toHaveBeenCalled();
    },
  );

  it("el mensaje dice lo que se espera: entre 1,0 y 5,0", () => {
    expect(NOTE_RANGE_MESSAGE).toBe("Escribe una nota entre 1,0 y 5,0");
  });

  it("los extremos 1 y 5 son válidos", () => {
    const { onUpdate, input } = setup();
    type(input, "1");
    type(input, "5");
    expect(onUpdate).toHaveBeenCalledWith(1, "p1", 1);
    expect(onUpdate).toHaveBeenCalledWith(1, "p1", 5);
  });

  it("al salir del campo vuelve a la última nota válida y quita el aviso", () => {
    const { input } = setup({ p1: 3.2 });
    type(input, "9");
    expect(screen.getByRole("alert")).toBeTruthy();
    fireEvent.focusOut(input);
    expect(screen.queryByRole("alert")).toBeNull();
    expect(input.value).toBe("3.2");
  });

  it("vaciar el campo borra la nota sin avisar", () => {
    const { onUpdate, input } = setup({ p1: 3.2 });
    type(input, "");
    expect(onUpdate).toHaveBeenCalledWith(1, "p1", null);
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("la nota guardada se muestra con un decimal razonable", () => {
    const { input } = setup({ p1: 4 });
    expect(input.value).toBe("4");
  });
});
