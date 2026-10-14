import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import VakEnviarInforme from "../DiagnosticoVAK/VakEnviarInforme";
import IngenIAValoracion from "../ingenia/IngenIAValoracion";
import { generarInformePDF } from "../DiagnosticoVAK/vakPDFGenerator";

// El PDF lo genera el navegador (html2pdf): se simula el blob.
vi.mock("../DiagnosticoVAK/vakPDFGenerator", () => ({
  generarInformePDF: vi.fn(),
}));

// Sin I18nProvider, t() devuelve la clave: las aserciones usan claves.
vi.mock("../../utils/iconMapping", () => ({
  Icon: ({ name }) => <svg data-icon={name} />,
}));
vi.mock("../../utils/iconMapping.jsx", () => ({
  Icon: ({ name }) => <svg data-icon={name} />,
}));

const ok = () => new Response(JSON.stringify({ ok: true }), { status: 201 });
const body = (fetchMock) => JSON.parse(fetchMock.mock.calls[0][1].body);
const pdfFalso = () =>
  new Blob(["%PDF-1.4 informe de prueba"], { type: "application/pdf" });

function llenarInforme(container, { email = "laura@ejemplo.co" } = {}) {
  fireEvent.change(screen.getByLabelText("vak.informe.name_label"), {
    target: { value: "Laura Ortiz" },
  });
  fireEvent.change(screen.getByLabelText("vak.informe.email_label"), {
    target: { value: email },
  });
  fireEvent.change(screen.getByLabelText("leadForm.profile_label"), {
    target: { value: "padre" },
  });
  fireEvent.click(
    screen.getByRole("checkbox", { name: /leadForm.consent_text/ }),
  );
  fireEvent.submit(container.querySelector("form"));
}

describe("VakEnviarInforme (PDF adjunto al correo del adulto)", () => {
  let fetchMock;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.restoreAllMocks();
    generarInformePDF.mockResolvedValue(pdfFalso());
    fetchMock = vi.spyOn(globalThis, "fetch");
  });

  it("envía un PDF válido en base64 y solo datos del adulto", async () => {
    fetchMock.mockResolvedValue(ok());
    const { container } = render(<VakEnviarInforme />);
    llenarInforme(container);

    expect(
      await screen.findByText("vak.informe.sent_title"),
    ).toBeInTheDocument();
    const enviado = body(fetchMock);
    expect(enviado).toMatchObject({
      nombre: "Laura Ortiz",
      email: "laura@ejemplo.co",
      perfil: "padre",
      autorizacion_datos: true,
    });
    expect(atob(enviado.pdf_base64).startsWith("%PDF-")).toBe(true);
    expect(enviado).not.toHaveProperty("estilo_dominante");
    expect(JSON.stringify(enviado)).not.toMatch(/Juanito/);
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/api\/vak\/informe$/);
  });

  it("muestra el error real que devuelve el backend", async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          error: "Ya enviamos el informe a este correo 3 veces hoy.",
        }),
        { status: 429 },
      ),
    );
    const { container } = render(<VakEnviarInforme />);
    llenarInforme(container);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Ya enviamos el informe a este correo 3 veces hoy.",
    );
    expect(
      screen.queryByText("vak.informe.sent_title"),
    ).not.toBeInTheDocument();
  });

  it("un PDF de más de 2 MB no se envía", async () => {
    generarInformePDF.mockResolvedValue(
      new Blob([new Uint8Array(2 * 1024 * 1024 + 1)], {
        type: "application/pdf",
      }),
    );
    const { container } = render(<VakEnviarInforme />);
    llenarInforme(container);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "pesa más de 2 MB",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("pide autorización de datos antes de enviar", () => {
    render(<VakEnviarInforme />);
    expect(
      screen.getByRole("checkbox", { name: /leadForm.consent_text/ }),
    ).toBeRequired();
  });
});

describe("IngenIAValoracion (antes de Planes)", () => {
  it("muestra el bloque de valoración gratis con el formulario de la fuente ingenia_valoracion", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(ok());
    const { container } = render(<IngenIAValoracion />);
    expect(screen.getByText("ingenia.val_title")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("ingenia.lead_name_label"), {
      target: { value: "Ana Gómez" },
    });
    fireEvent.change(screen.getByLabelText("ingenia.lead_contact_label"), {
      target: { value: "ana@ejemplo.co" },
    });
    fireEvent.change(screen.getByLabelText("leadForm.profile_label"), {
      target: { value: "padre" },
    });
    fireEvent.click(
      screen.getByRole("checkbox", { name: /leadForm.consent_text/ }),
    );
    fireEvent.submit(container.querySelector("form"));

    expect(
      await screen.findByText("ingenia.lead_sent_title"),
    ).toBeInTheDocument();
    expect(body(fetchMock)).toMatchObject({ fuente: "ingenia_valoracion" });
  });
});
