import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import IngenIAPlanesSection from "../ingenia/IngenIAPlanesSection";

const PLANS = [
  {
    id: "base",
    name: "Base",
    price: "$49.900",
    period: "/mes",
    trial: "7 días gratis",
    features: ["Tutor Dani"],
    popular: true,
  },
  {
    id: "personalizado",
    name: "Personalizado",
    price: "$149.000",
    period: "/mes",
    trial: "Valoración gratis",
    features: ["Coach docente"],
    popular: false,
  },
];

const t = (key, params) => (params ? `${key}:${params.name}` : key);

function renderSection(props = {}) {
  return render(
    <IngenIAPlanesSection
      t={t}
      pricingPlans={PLANS}
      paymentMethods={[]}
      guarantee={{ icon: "fa-shield", title: "Garantía", desc: "Devolución" }}
      onSelectPlan={vi.fn()}
      {...props}
    />,
  );
}

describe("IngenIAPlanesSection", () => {
  it("al pulsar Elegir en un plan entrega ese plan a onSelectPlan", () => {
    const onSelectPlan = vi.fn();
    renderSection({ onSelectPlan });

    const botones = screen.getAllByRole("button", {
      name: /ingenia\.landing_pricing_choose/,
    });
    fireEvent.click(botones[0]);

    expect(onSelectPlan).toHaveBeenCalledTimes(1);
    expect(onSelectPlan).toHaveBeenCalledWith(
      expect.objectContaining({ id: "base" }),
    );
  });

  it("muestra el mensaje de error de pago cuando viene planError", () => {
    renderSection({
      planError:
        "No pudimos abrir el pago. Intenta de nuevo o escríbenos por WhatsApp.",
    });

    expect(screen.getByRole("alert")).toHaveTextContent(
      "No pudimos abrir el pago",
    );
  });

  it("no muestra alerta si no hay error", () => {
    renderSection();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
