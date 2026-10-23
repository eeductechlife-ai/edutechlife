import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { vi, describe, test, expect, beforeEach, afterEach } from "vitest";
import DocGuidePanel from "../ResourceViewerModal/DocGuidePanel";
import { useIALabStore } from "../../../store/ialabStore";

vi.mock("../../../utils/iconMapping", () => ({
  Icon: ({ name }) => <span data-testid="icon" data-icon={name} />,
}));

vi.mock("../../../i18n/I18nProvider", () => ({
  useTranslation: () => ({ t: (k) => k, locale: "es", setLocale: vi.fn() }),
}));

describe("DocGuidePanel: reflexiones que suman XP", () => {
  let addXp;

  beforeEach(() => {
    localStorage.clear();
    addXp = vi
      .spyOn(useIALabStore.getState(), "addXp")
      .mockImplementation(() => {});
  });

  afterEach(() => {
    addXp.mockRestore();
  });

  test("una reflexión de al menos 20 caracteres suma XP al salir del campo", () => {
    render(<DocGuidePanel resourceId="prompt-guide-1" />);
    const first = screen.getAllByRole("textbox")[0];
    fireEvent.change(first, {
      target: { value: "Me falta el rol y el público del mensaje" },
    });
    fireEvent.blur(first);
    expect(addXp).toHaveBeenCalledTimes(1);
  });

  test("una respuesta demasiado corta no suma XP", () => {
    render(<DocGuidePanel resourceId="prompt-guide-1" />);
    const first = screen.getAllByRole("textbox")[0];
    fireEvent.change(first, { target: { value: "sí" } });
    fireEvent.blur(first);
    expect(addXp).not.toHaveBeenCalled();
  });

  test("editar y volver a salir del campo no repite la recompensa", () => {
    render(<DocGuidePanel resourceId="prompt-guide-1" />);
    const first = screen.getAllByRole("textbox")[0];
    fireEvent.change(first, {
      target: { value: "Falta el formato y el tono del texto final" },
    });
    fireEvent.blur(first);
    fireEvent.change(first, {
      target: { value: "Falta el formato, el tono y la longitud del texto" },
    });
    fireEvent.blur(first);
    expect(addXp).toHaveBeenCalledTimes(1);
  });

  test("el borrador se guarda por cuenta y se recupera al volver a abrir", () => {
    const { unmount } = render(<DocGuidePanel resourceId="prompt-guide-1" />);
    const first = screen.getAllByRole("textbox")[0];
    fireEvent.change(first, { target: { value: "Borrador de mi respuesta" } });
    unmount();
    render(<DocGuidePanel resourceId="prompt-guide-1" />);
    expect(screen.getAllByRole("textbox")[0]).toHaveValue(
      "Borrador de mi respuesta",
    );
  });
});
