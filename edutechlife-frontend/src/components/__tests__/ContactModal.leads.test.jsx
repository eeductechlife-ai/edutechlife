import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ContactModal from "../ContactModal";

// Sin I18nProvider, t() devuelve la clave: las aserciones usan claves.
vi.mock("../../utils/iconMapping", () => ({
  Icon: ({ name }) => <svg data-icon={name} />,
}));

const llenar = () => {
  fireEvent.change(screen.getByLabelText("contact.full_name_label"), {
    target: { value: "Ana Gómez" },
  });
  fireEvent.change(screen.getByLabelText("contact.email_label_form"), {
    target: { value: "ana@ejemplo.co" },
  });
  fireEvent.change(screen.getByLabelText("leadForm.profile_label"), {
    target: { value: "padre" },
  });
};
const enviar = () =>
  fireEvent.submit(
    screen.getByLabelText("contact.full_name_label").closest("form"),
  );

describe("ContactModal → /api/leads", () => {
  let fetchMock;

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    fetchMock = vi.spyOn(globalThis, "fetch");
  });

  it("envía el lead al backend y solo entonces muestra el agradecimiento", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 201 }),
    );
    render(<ContactModal isOpen onClose={() => {}} />);
    llenar();
    fireEvent.click(
      screen.getByRole("checkbox", { name: /leadForm.consent_text/ }),
    );
    enviar();

    expect(await screen.findByText("contact.thanks_title")).toBeInTheDocument();
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body).toMatchObject({
      nombre: "Ana Gómez",
      email: "ana@ejemplo.co",
      fuente: "contacto_header",
      perfil: "padre",
      autorizacion_datos: true,
    });
    // Ya no se guarda en el navegador del visitante.
    expect(localStorage.getItem("edutechlife_leads")).toBeNull();
  });

  it("si el backend falla muestra el error real y no dice «enviado»", async () => {
    fetchMock.mockResolvedValue(new Response("{}", { status: 500 }));
    render(<ContactModal isOpen onClose={() => {}} />);
    llenar();
    fireEvent.click(
      screen.getByRole("checkbox", { name: /leadForm.consent_text/ }),
    );
    enviar();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "leadForm.error_servidor",
    );
    expect(screen.queryByText("contact.thanks_title")).not.toBeInTheDocument();
  });

  it("sin la autorización de datos no envía nada", async () => {
    render(<ContactModal isOpen onClose={() => {}} />);
    llenar();
    enviar();

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(
        "leadForm.error_consentimiento",
      ),
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sin elegir «Soy…» no envía nada", async () => {
    render(<ContactModal isOpen onClose={() => {}} />);
    fireEvent.change(screen.getByLabelText("contact.full_name_label"), {
      target: { value: "Ana Gómez" },
    });
    fireEvent.click(
      screen.getByRole("checkbox", { name: /leadForm.consent_text/ }),
    );
    enviar();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "leadForm.error_perfil",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
