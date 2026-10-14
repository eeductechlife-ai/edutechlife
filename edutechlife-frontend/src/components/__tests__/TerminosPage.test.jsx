import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

const locale = vi.hoisted(() => ({ value: "es" }));

vi.mock("../../i18n/I18nProvider", () => ({
  useTranslation: () => ({ t: (key) => key, locale: locale.value }),
}));
vi.mock("../SEO", () => ({ default: () => null }));

import TerminosPage from "../pages/TerminosPage";

describe("TerminosPage", () => {
  it("muestra el texto completo de los términos en español", () => {
    locale.value = "es";
    render(<TerminosPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /TÉRMINOS Y CONDICIONES DE SUSCRIPCIÓN Y COMPRA/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "7. Derecho de retracto" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "10. Ley aplicable y jurisdicción",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Conforme al Art\. 47 de la Ley 1480 de 2011/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Gratis \(IngenIA\): \$0 COP/)).toBeInTheDocument();
  });

  it("no muestra la nota de idioma en español", () => {
    locale.value = "es";
    render(<TerminosPage />);
    expect(screen.queryByRole("note")).not.toBeInTheDocument();
  });

  it("muestra la nota de que el documento vigente está en español en en y pt", () => {
    locale.value = "en";
    const { unmount } = render(<TerminosPage />);
    expect(screen.getByRole("note")).toHaveTextContent(
      /only available in Spanish/,
    );
    unmount();

    locale.value = "pt";
    render(<TerminosPage />);
    expect(screen.getByRole("note")).toHaveTextContent(/apenas em espanhol/);
  });
});
