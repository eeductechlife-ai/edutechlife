import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import PlanesPage from "../pages/PlanesPage";
import { I18nContext } from "../../i18n/I18nProvider";
import es from "../../i18n/es.json";
import en from "../../i18n/en.json";
import pt from "../../i18n/pt.json";

const { mockNavigate, mockAuth, mockGetPlans, mockStartCheckout } = vi.hoisted(
  () => ({
    mockNavigate: vi.fn(),
    mockAuth: { isSignedIn: true },
    mockGetPlans: vi.fn(),
    mockStartCheckout: vi.fn(),
  }),
);

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock("../../hooks/useAuthIdentity", () => ({
  useAuthIdentity: () => ({ isSignedIn: mockAuth.isSignedIn, isLoaded: true }),
}));

vi.mock("../../services/stripeClient", () => ({
  getPlans: (...args) => mockGetPlans(...args),
  startCheckout: (...args) => mockStartCheckout(...args),
}));

vi.mock("../SEO", () => ({ default: () => null }));

// test-setup mockea I18nProvider con t() que devuelve la clave: aquí se usa el
// real para comprobar los textos de es/en/pt.
vi.unmock("@/i18n/I18nProvider");

// Sin VITE_STRIPE_PUBLISHABLE_KEY (no hay .env en el worktree), canPay depende
// solo de la moneda: COP se cobra con Wompi, USD no se puede pagar en línea.
const PLANS = [
  {
    id: "base",
    name: "Base",
    price: 2900000,
    currency: "cop",
    features: ["Acceso básico"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 4900000,
    currency: "cop",
    features: ["Acceso completo"],
  },
  {
    id: "ingenia_intensivo",
    name: "Intensivo",
    price: 2490000,
    currency: "cop",
    features: ["Sesiones con coach"],
  },
  {
    id: "global",
    name: "Global",
    price: 1000,
    currency: "usd",
    features: ["Plan en dólares"],
  },
];

const MESSAGES = {
  es: {
    translations: es,
    unavailable: "Este plan no está disponible para pagar en línea.",
    error:
      "No pudimos abrir el pago. Intenta de nuevo o escríbenos por WhatsApp.",
  },
  en: {
    translations: en,
    unavailable: "This plan is not available for online payment.",
    error:
      "We couldn't open the payment. Please try again or message us on WhatsApp.",
  },
  pt: {
    translations: pt,
    unavailable: "Este plano não está disponível para pagamento online.",
    error:
      "Não conseguimos abrir o pagamento. Tente novamente ou fale conosco pelo WhatsApp.",
  },
};

function renderPage(locale = "es") {
  const { translations } = MESSAGES[locale];
  const value = {
    t: (key) => translations[key] ?? key,
    locale,
    setLocale: () => {},
  };
  return render(
    <I18nContext.Provider value={value}>
      <PlanesPage />
    </I18nContext.Provider>,
  );
}

async function clickSubscribeBase() {
  const botones = await screen.findAllByRole("button", { name: "Suscribirse" });
  fireEvent.click(botones[0]);
}

describe("PlanesPage: botón Suscribirse", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.isSignedIn = true;
    mockGetPlans.mockResolvedValue(PLANS);
    delete window.location;
    window.location = { href: "" };
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    window.location = originalLocation;
    vi.restoreAllMocks();
  });

  it("sin sesión: navega a /login?returnTo=/planes y no inicia el pago", async () => {
    mockAuth.isSignedIn = false;
    renderPage();

    await clickSubscribeBase();

    expect(mockNavigate).toHaveBeenCalledWith("/login?returnTo=/planes");
    expect(mockStartCheckout).not.toHaveBeenCalled();
  });

  it("con sesión y URL de Wompi: redirige a esa URL", async () => {
    const url = "https://checkout.wompi.co/p/abc123";
    mockStartCheckout.mockResolvedValue({ url });
    renderPage();

    await clickSubscribeBase();

    expect(mockStartCheckout).toHaveBeenCalledWith("base");
    expect(window.location.href).toBe(url);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("con sesión y error de startCheckout: muestra el mensaje de error y registra el error", async () => {
    mockStartCheckout.mockRejectedValue(new Error("Wompi caído"));
    renderPage();

    await clickSubscribeBase();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      MESSAGES.es.error,
    );
    expect(console.error).toHaveBeenCalled();
    expect(window.location.href).toBe("");
  });

  it("con sesión y respuesta sin URL: muestra el mensaje de error", async () => {
    mockStartCheckout.mockResolvedValue({});
    renderPage();

    await clickSubscribeBase();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      MESSAGES.es.error,
    );
    expect(window.location.href).toBe("");
  });

  it("plan que no se puede pagar: muestra un mensaje visible y no inicia el pago", async () => {
    renderPage();

    fireEvent.click(
      await screen.findByRole("button", { name: "Próximamente" }),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      MESSAGES.es.unavailable,
    );
    expect(mockStartCheckout).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it.each([true, false])(
    "plan Intensivo (personalizado, isSignedIn=%s): lleva a la valoración gratis y no inicia el pago",
    async (isSignedIn) => {
      mockAuth.isSignedIn = isSignedIn;
      renderPage();

      const botones = await screen.findAllByRole("button", {
        name: "Suscribirse",
      });
      fireEvent.click(botones[2]);

      expect(mockNavigate).toHaveBeenCalledWith("/conoce-ingenia#valoracion");
      expect(mockStartCheckout).not.toHaveBeenCalled();
      expect(window.location.href).toBe("");
    },
  );

  it.each(["es", "en", "pt"])(
    "en %s muestra el aviso de plan no disponible y el de error de pago",
    async (locale) => {
      mockStartCheckout.mockRejectedValue(new Error("boom"));

      const { unmount } = renderPage(locale);
      fireEvent.click(
        await screen.findByRole("button", { name: "Próximamente" }),
      );
      expect(await screen.findByRole("alert")).toHaveTextContent(
        MESSAGES[locale].unavailable,
      );
      unmount();

      renderPage(locale);
      await clickSubscribeBase();
      expect(await screen.findByRole("alert")).toHaveTextContent(
        MESSAGES[locale].error,
      );
    },
  );
});
