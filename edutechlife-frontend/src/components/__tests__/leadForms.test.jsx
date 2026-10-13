import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LeadCaptureModal from "../LeadCaptureModal";
import AutomationLeadCapture from "../AutomationLeadCapture";
import MetodoLeadModal from "../MetodoLeadModal";
import LeadsManager from "../LeadsManager";

// Sin I18nProvider, t() devuelve la clave: las aserciones usan claves.
vi.mock("../../utils/iconMapping", () => ({
  Icon: ({ name }) => <svg data-icon={name} />,
}));
vi.mock("../../utils/iconMapping.jsx", () => ({
  Icon: ({ name }) => <svg data-icon={name} />,
}));

const ok = () => new Response(JSON.stringify({ ok: true }), { status: 201 });
const body = (fetchMock) => JSON.parse(fetchMock.mock.calls[0][1].body);
const completarLead = (form) => {
  fireEvent.change(screen.getByLabelText("leadForm.profile_label"), {
    target: { value: "colegio" },
  });
  fireEvent.click(
    screen.getByRole("checkbox", { name: /leadForm.consent_text/ }),
  );
  fireEvent.submit(form);
};

describe("formularios de leads → /api/leads", () => {
  let fetchMock;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.restoreAllMocks();
    fetchMock = vi.spyOn(globalThis, "fetch");
  });

  it("Solicitar demo (menú móvil) funciona sin onSubmit y guarda el lead", async () => {
    fetchMock.mockResolvedValue(ok());
    render(<LeadCaptureModal isOpen onClose={() => {}} />);
    fireEvent.change(screen.getByLabelText("leadCapture.name_label"), {
      target: { value: "Ana Gómez" },
    });
    fireEvent.change(screen.getByLabelText("leadCapture.email_label"), {
      target: { value: "ana@ejemplo.co" },
    });
    completarLead(
      screen.getByLabelText("leadCapture.name_label").closest("form"),
    );

    expect(await screen.findByText("contact.thanks_title")).toBeInTheDocument();
    expect(body(fetchMock)).toMatchObject({
      fuente: "demo_movil",
      perfil: "colegio",
      producto_interes: "demo",
      autorizacion_datos: true,
    });
  });

  it("Automatización B2B: si el backend falla no muestra «enviado»", async () => {
    fetchMock.mockResolvedValue(new Response("{}", { status: 500 }));
    const { container } = render(<AutomationLeadCapture />);
    const [nombre, email, , empresa] = container.querySelectorAll("input");
    fireEvent.change(nombre, { target: { value: "Ana Gómez" } });
    fireEvent.change(email, { target: { value: "ana@empresa.co" } });
    fireEvent.change(empresa, { target: { value: "Café SAS" } });
    completarLead(container.querySelector("form"));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "leadForm.error_servidor",
    );
    expect(
      screen.queryByText("automation.lead.success_title"),
    ).not.toBeInTheDocument();
    expect(body(fetchMock)).toMatchObject({
      fuente: "automatizacion",
      mensaje: "Empresa: Café SAS",
    });
  });

  it("Método: envía con fuente metodo y ya no usa localStorage", async () => {
    fetchMock.mockResolvedValue(ok());
    const { container } = render(<MetodoLeadModal show onClose={() => {}} />);
    const [nombre, email, telefono] = container.querySelectorAll("input");
    fireEvent.change(nombre, { target: { value: "Ana Gómez" } });
    fireEvent.change(email, { target: { value: "ana@ejemplo.co" } });
    fireEvent.change(telefono, { target: { value: "3001234567" } });
    completarLead(container.querySelector("form"));

    expect(await screen.findByText("metodo.success_title")).toBeInTheDocument();
    expect(body(fetchMock).fuente).toBe("metodo");
    expect(localStorage.getItem("edutechlife_leads")).toBeNull();
  });
});

describe("LeadsManager (panel admin)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    sessionStorage.clear();
  });

  it("lee la tabla leads con el token de la sesión admin", async () => {
    sessionStorage.setItem("auth_token", "token-admin");
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          leads: [
            {
              id: "1",
              nombre: "Ana Gómez",
              perfil: "padre",
              fuente: "boletin",
              estado: "nuevo",
              created_at: "2026-10-13T15:00:00Z",
            },
          ],
        }),
        { status: 200 },
      ),
    );
    render(<LeadsManager />);

    expect(await screen.findByText("Ana Gómez")).toBeInTheDocument();
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/api\/leads$/);
    expect(options.headers.Authorization).toBe("Bearer token-admin");
  });

  it("sin rol admin muestra el motivo", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("{}", { status: 403 }),
    );
    render(<LeadsManager />);
    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(
        /rol de administrador/,
      ),
    );
  });
});
