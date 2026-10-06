/**
 * TEST: gating de OVAs de casos (La Línea de Montaje y Casos del Guardián).
 * Un paso evaluable (m2–m5) no se puede saltar con "Siguiente" y el recurso
 * solo se completa tras hacer las actividades.
 */
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import OVAAutomationFlows from "./OVAAutomationFlows";
import OVAEthicsCases from "./OVAEthicsCases";

vi.mock("framer-motion", () => ({
  motion: new Proxy({}, { get: (_t, tag) => tag }),
  AnimatePresence: ({ children }) => children,
  useReducedMotion: () => false,
}));

vi.mock("../../utils/speech", async (importOriginal) => ({
  ...(await importOriginal()),
  stopSpeech: vi.fn(),
  speakText: vi.fn(),
  speakTextConversational: vi.fn(),
  fireConfetti: vi.fn(),
}));

const cases = [
  ["OVAAutomationFlows", OVAAutomationFlows],
  ["OVAEthicsCases", OVAEthicsCases],
];

describe.each(cases)("%s gating", (_name, Component) => {
  test("no se puede pasar de un paso evaluable sin hacer su actividad", () => {
    const onComplete = vi.fn();
    const { container } = render(
      <Component onComplete={onComplete} onClose={vi.fn()} />,
    );

    // welcome -> m1 (contenido pasivo)
    const start = [...container.querySelectorAll("button")].find((b) =>
      /comenzar|empezar|start|iniciar|ova\./i.test(b.textContent),
    );
    if (start) fireEvent.click(start);

    const nextBtn = () =>
      [...container.querySelectorAll("button")].find((b) =>
        /nav_next|siguiente|next/i.test(b.textContent),
      );

    // m1 -> m2: permitido
    if (nextBtn() && !nextBtn().disabled) fireEvent.click(nextBtn());

    // En m2 el botón Siguiente debe estar deshabilitado hasta decidir el caso.
    expect(nextBtn()).toBeDefined();
    expect(nextBtn().disabled).toBe(true);
    expect(onComplete).not.toHaveBeenCalled();
  });
});
