import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

const locale = vi.hoisted(() => ({ value: "es" }));

vi.mock("../../i18n/I18nProvider", () => ({
  useTranslation: () => ({
    t: (key) => (key === "footer.privacy" ? "Política de Privacidad" : key),
    locale: locale.value,
  }),
}));
vi.mock("../SEO", () => ({ default: () => null }));

import PrivacidadPage from "../pages/PrivacidadPage";

describe("PrivacidadPage", () => {
  it("muestra el contenido de la política en español con el dominio edutechlife.co", () => {
    locale.value = "es";
    render(<PrivacidadPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Política de Privacidad" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "1. Introducción" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/accesible desde edutechlife\.co, una de nuestras/),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/accesible desde edutechlife\.com/),
    ).not.toBeInTheDocument();
  });

  it("usa el contenido en inglés cuando el idioma es en", () => {
    locale.value = "en";
    render(<PrivacidadPage />);

    expect(
      screen.getByRole("heading", { level: 2, name: "1. Introduction" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/accessible from edutechlife\.co, one of our/),
    ).toBeInTheDocument();
  });

  it("usa el contenido en portugués cuando el idioma es pt", () => {
    locale.value = "pt";
    render(<PrivacidadPage />);

    expect(
      screen.getByRole("heading", { level: 2, name: "1. Introdução" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/acessível em edutechlife\.co, uma de/),
    ).toBeInTheDocument();
  });
});
