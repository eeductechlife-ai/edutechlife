import { describe, it, expect, vi, beforeAll } from "vitest";
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { MemoryRouter } from "react-router-dom";
import Aliados from "../../components/Aliados";
import AIToolsSection from "../../components/AIToolsSection";
import Ecosystem from "../../components/Ecosystem";

expect.extend(toHaveNoViolations);

// Mismo criterio que la auditoría axe del workflow Deploy (WCAG 2.1 nivel A).
// Estas dos secciones de la portada fallaban ahí: lista de logos sin elementos
// de lista y tarjetas con role="button" que contenían enlaces.
const LEVEL_A = { runOnly: { type: "tag", values: ["wcag2a", "wcag21a"] } };

beforeAll(() => {
  window.matchMedia =
    window.matchMedia ||
    (() => ({
      matches: false,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
  window.HTMLMediaElement.prototype.play = () => Promise.resolve();
  window.HTMLMediaElement.prototype.pause = () => {};
});

vi.mock("../../i18n/I18nProvider", () => ({
  useTranslation: () => ({ t: (key) => key, locale: "es" }),
}));

vi.mock("../../utils/iconMapping.jsx", () => ({
  Icon: ({ name, className }) => (
    <svg data-icon={name} className={className} aria-hidden="true" />
  ),
}));

vi.mock("../../components/FloatingParticles", () => ({ default: () => null }));

vi.mock("framer-motion", async () => {
  const React = await import("react");
  const MOTION_ONLY = [
    "initial",
    "animate",
    "exit",
    "transition",
    "variants",
    "whileInView",
    "whileHover",
    "whileTap",
    "viewport",
    "layout",
  ];
  const cache = {};
  const motion = new Proxy(
    {},
    {
      get: (_, tag) => {
        if (!cache[tag]) {
          cache[tag] = ({ children, ...props }) => {
            const clean = Object.fromEntries(
              Object.entries(props).filter(([k]) => !MOTION_ONLY.includes(k)),
            );
            return React.createElement(tag, clean, children);
          };
        }
        return cache[tag];
      },
    },
  );
  return {
    motion,
    AnimatePresence: ({ children }) => children,
    useReducedMotion: () => false,
  };
});

const renderInRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe("Portada: accesibilidad WCAG 2.1 nivel A", () => {
  it("Aliados: la lista de logos solo contiene elementos de lista", async () => {
    const { container } = renderInRouter(<Aliados />);
    expect(await axe(container, LEVEL_A)).toHaveNoViolations();
  });

  it("Herramientas IA: las tarjetas no anidan controles interactivos", async () => {
    const { container } = renderInRouter(<AIToolsSection />);
    expect(await axe(container, LEVEL_A)).toHaveNoViolations();
  });

  it("Herramientas IA: el control accesible es el enlace, no la tarjeta", () => {
    const { container } = renderInRouter(<AIToolsSection />);
    expect(container.querySelectorAll('[role="button"]')).toHaveLength(0);
    expect(container.querySelectorAll("a[href]").length).toBeGreaterThan(0);
  });

  it("Ecosistema: el carrusel horizontal se puede enfocar y recorrer con teclado", async () => {
    const { container } = renderInRouter(<Ecosystem />);
    // En móvil la franja se desplaza en horizontal y sus tarjetas no tienen nada
    // enfocable (axe: scrollable-region-focusable): el contenedor lo es.
    const scroller = container.querySelector(".overflow-x-auto");
    expect(scroller).not.toBeNull();
    expect(scroller.getAttribute("tabindex")).toBe("0");
    expect(scroller.getAttribute("role")).toBe("region");
    expect(scroller.getAttribute("aria-label")).toBeTruthy();
    expect(await axe(container, LEVEL_A)).toHaveNoViolations();
  });
});
