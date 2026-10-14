import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AutomationArchitect from "../AutomationArchitect";

vi.mock("../../i18n/I18nProvider", () => ({
  useTranslation: () => ({ t: (key) => key, locale: "es" }),
}));

vi.mock("../../utils/api", () => ({
  callDeepseek: vi.fn(),
}));

vi.mock("../AutomationArchitectureViewer", () => ({
  default: () => null,
}));

// C-030: el botón del paso 1 no debe quedar bloqueado para siempre.
// El select escribe `industria`; el botón exigía un campo `sector` que ningún input llena.
describe("AutomationArchitect - paso 1 (C-030)", () => {
  it("habilita 'Siguiente' al completar empresa y al menos un proceso", () => {
    const { container, getByRole, getByLabelText } = render(
      <AutomationArchitect />,
    );
    const nextBtn = getByRole("button", {
      name: /btn_next_arch/,
    });
    expect(nextBtn.disabled).toBe(true);

    fireEvent.change(getByLabelText(/empresa_label/), {
      target: { value: "Acme" },
    });
    fireEvent.click(container.querySelector(".aa-process-card"));

    expect(nextBtn.disabled).toBe(false);
  });

  it("avanza al paso 2 al pulsar 'Siguiente'", () => {
    const { container, getByRole, getByLabelText, getByText } = render(
      <AutomationArchitect />,
    );
    fireEvent.change(getByLabelText(/empresa_label/), {
      target: { value: "Acme" },
    });
    fireEvent.click(container.querySelector(".aa-process-card"));
    fireEvent.click(getByRole("button", { name: /btn_next_arch/ }));

    expect(getByText("automation.architect.select_arch")).toBeTruthy();
  });
});
