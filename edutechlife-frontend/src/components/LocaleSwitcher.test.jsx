import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import LocaleSwitcher from "./LocaleSwitcher";

const i18nState = vi.hoisted(() => ({ locale: "es", setLocale: vi.fn() }));

vi.mock("../i18n/I18nProvider", () => ({
  useTranslation: () => ({ locale: i18nState.locale, setLocale: i18nState.setLocale }),
}));

vi.mock("../utils/iconMapping", () => ({
  Icon: ({ name }) => <span data-testid="icon" data-icon={name} />,
}));

const openMenu = () => {
  const trigger = screen.getByRole("button");
  fireEvent.pointerDown(trigger);
  fireEvent.click(trigger);
};

describe("LocaleSwitcher", () => {
  beforeEach(() => {
    i18nState.locale = "es";
    i18nState.setLocale.mockClear();
  });

  it("shows the current locale code in the trigger", () => {
    render(<LocaleSwitcher />);
    expect(screen.getByText("ES")).toBeInTheDocument();
  });

  it("offers the three supported languages", async () => {
    render(<LocaleSwitcher />);
    openMenu();
    expect(await screen.findByText("Español")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("Português")).toBeInTheDocument();
  });

  it("switches to Portuguese when selected", async () => {
    render(<LocaleSwitcher />);
    openMenu();
    fireEvent.click(await screen.findByText("Português"));
    expect(i18nState.setLocale).toHaveBeenCalledWith("pt");
  });

  it("switches to English when selected", async () => {
    render(<LocaleSwitcher />);
    openMenu();
    fireEvent.click(await screen.findByText("English"));
    expect(i18nState.setLocale).toHaveBeenCalledWith("en");
  });
});
