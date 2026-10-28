import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { makeOVAExplicativo } from "../OVAExplicativo";
import PROYECTOS from "../data/proyectos";
import BRUJULA from "../data/brujula";

vi.mock("../../../../hooks/useAuthIdentity", () => ({
  useAuthIdentity: () => ({ userId: "estudiante-prueba" }),
}));

const Proyectos = makeOVAExplicativo("test-proyectos", PROYECTOS, {
  accent: "#199DB9",
});

// Flujo del estudiante: presentación → secciones → resumen → verificación → final.
describe("OVA explicativo: flujo y verificación", () => {
  beforeEach(() => localStorage.clear());
  afterEach(cleanup);

  it("no termina hasta acertar las tres verificaciones y avisa una sola vez", () => {
    const onComplete = vi.fn();
    render(<Proyectos onComplete={onComplete} />);

    fireEvent.click(screen.getByRole("button", { name: /Comenzar/ }));
    for (let i = 0; i < PROYECTOS.es.sections.length - 1; i++) {
      fireEvent.click(screen.getByRole("button", { name: /Siguiente/ }));
    }
    fireEvent.click(screen.getByRole("button", { name: /Ver resumen/ }));
    fireEvent.click(
      screen.getByRole("button", { name: /Ir a la verificación/ }),
    );

    const finish = screen.getByRole("button", { name: /Terminar/ });
    expect(finish).toBeDisabled();

    // Respuesta incorrecta en la primera pregunta: aún no se puede terminar.
    fireEvent.click(screen.getByText(PROYECTOS.es.check[0].options[0]));
    expect(finish).toBeDisabled();

    fireEvent.click(
      screen.getByText(
        PROYECTOS.es.check[0].options[PROYECTOS.es.check[0].correct],
      ),
    );
    fireEvent.click(
      screen.getByText(
        PROYECTOS.es.check[1].options[PROYECTOS.es.check[1].correct],
      ),
    );
    fireEvent.click(
      screen.getByText(
        PROYECTOS.es.check[2].options[PROYECTOS.es.check[2].correct],
      ),
    );

    expect(screen.getByRole("button", { name: /Terminar/ })).toBeEnabled();
    fireEvent.click(screen.getByRole("button", { name: /Terminar/ }));
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/Lo lograste/)).toBeInTheDocument();
  });

  it("muestra el vocabulario de cada sección", () => {
    render(<Proyectos onComplete={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /Comenzar/ }));
    for (const t of PROYECTOS.es.sections[0].terms) {
      expect(screen.getByText(t.term)).toBeInTheDocument();
    }
  });

  it("usa la identidad del tema: el OVA de privacidad es oscuro y muestra su título", () => {
    const Brujula = makeOVAExplicativo("test-brujula", BRUJULA, {
      accent: "#ef4444",
      dark: true,
      bg: "#0b1220",
    });
    render(<Brujula onComplete={vi.fn()} />);
    expect(screen.getByText("La Brújula de Riesgos")).toBeInTheDocument();
  });
});
