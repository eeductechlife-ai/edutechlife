import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import IngenIALeadForm from "../ingenia/IngenIALeadForm";
import IngenIAWhatsappCta, {
  whatsappNicoUrl,
} from "../ingenia/IngenIAWhatsappCta";
import IngenIAMobileBar from "../ingenia/IngenIAMobileBar";

// Sin I18nProvider, t() devuelve la clave: las aserciones usan claves.
vi.mock("../../utils/iconMapping", () => ({
  Icon: ({ name }) => <svg data-icon={name} />,
}));
vi.mock("../../utils/iconMapping.jsx", () => ({
  Icon: ({ name }) => <svg data-icon={name} />,
}));

const ok = () => new Response(JSON.stringify({ ok: true }), { status: 201 });
const body = (fetchMock) => JSON.parse(fetchMock.mock.calls[0][1].body);

function llenarYEnviar(container, { contacto, perfil = "padre" }) {
  fireEvent.change(screen.getByLabelText("ingenia.lead_name_label"), {
    target: { value: "Ana Gómez" },
  });
  fireEvent.change(screen.getByLabelText("ingenia.lead_contact_label"), {
    target: { value: contacto },
  });
  fireEvent.change(screen.getByLabelText("leadForm.profile_label"), {
    target: { value: perfil },
  });
  fireEvent.click(
    screen.getByRole("checkbox", { name: /leadForm.consent_text/ }),
  );
  fireEvent.submit(container.querySelector("form"));
}

describe("IngenIALeadForm (hero, fuente ingenia_hero)", () => {
  let fetchMock;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.restoreAllMocks();
    fetchMock = vi.spyOn(globalThis, "fetch");
  });

  it("con correo envía email (no teléfono) con fuente ingenia_hero", async () => {
    fetchMock.mockResolvedValue(ok());
    const { container } = render(<IngenIALeadForm fuente="ingenia_hero" />);
    llenarYEnviar(container, { contacto: "ana@ejemplo.co" });

    expect(
      await screen.findByText("ingenia.lead_sent_title"),
    ).toBeInTheDocument();
    expect(body(fetchMock)).toMatchObject({
      nombre: "Ana Gómez",
      email: "ana@ejemplo.co",
      perfil: "padre",
      fuente: "ingenia_hero",
      autorizacion_datos: true,
    });
    expect(body(fetchMock).telefono).toBeUndefined();
  });

  it("con número de WhatsApp envía telefono (no correo)", async () => {
    fetchMock.mockResolvedValue(ok());
    const { container } = render(<IngenIALeadForm fuente="ingenia_hero" />);
    llenarYEnviar(container, { contacto: "300 123 4567", perfil: "docente" });

    expect(
      await screen.findByText("ingenia.lead_sent_title"),
    ).toBeInTheDocument();
    expect(body(fetchMock)).toMatchObject({
      telefono: "300 123 4567",
      perfil: "docente",
      fuente: "ingenia_hero",
    });
    expect(body(fetchMock).email).toBeUndefined();
  });

  it("si el envío falla muestra el error real y no «enviado»", async () => {
    fetchMock.mockResolvedValue(new Response("{}", { status: 500 }));
    const { container } = render(<IngenIALeadForm fuente="ingenia_hero" />);
    llenarYEnviar(container, { contacto: "ana@ejemplo.co" });

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "leadForm.error_servidor",
    );
    expect(
      screen.queryByText("ingenia.lead_sent_title"),
    ).not.toBeInTheDocument();
  });

  it("no ofrece «Estudiante»: el formulario lo llena un adulto", () => {
    const { container } = render(<IngenIALeadForm fuente="ingenia_hero" />);
    expect(
      screen.queryByRole("option", { name: "leadForm.profile_estudiante" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "leadForm.profile_padre" }),
    ).toBeInTheDocument();
    expect(container.querySelector("form")).not.toBeNull();
  });

  it("indica que un niño le pida a un adulto que lo llene", () => {
    render(<IngenIALeadForm fuente="ingenia_hero" />);
    expect(screen.getByText("ingenia.lead_child_notice")).toBeInTheDocument();
  });
});

describe("IngenIAWhatsappCta", () => {
  it("abre WhatsApp de Nico con mensaje prellenado, sin formulario", () => {
    render(<IngenIAWhatsappCta />);
    const link = screen.getByRole("link", { name: /ingenia.wa_btn/ });
    // Sin I18nProvider el mensaje es la clave: se verifica el texto prellenado.
    expect(link).toHaveAttribute("href", whatsappNicoUrl("ingenia.wa_message"));
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
    expect(
      whatsappNicoUrl("Hola").startsWith("https://wa.me/573238365517?text="),
    ).toBe(true);
    expect(
      decodeURIComponent(link.getAttribute("href").split("text=")[1]),
    ).toBe("ingenia.wa_message");
  });
});

describe("IngenIAMobileBar", () => {
  it("solo se ve en pantallas pequeñas y lleva al hero o a WhatsApp", () => {
    const onProbar = vi.fn();
    const { container } = render(<IngenIAMobileBar onProbar={onProbar} />);
    expect(container.firstChild).toHaveClass("md:hidden");

    fireEvent.click(screen.getByRole("button", { name: /ingenia.mobile_try/ }));
    expect(onProbar).toHaveBeenCalledTimes(1);

    expect(
      screen.getByRole("link", { name: /ingenia.mobile_wa/ }),
    ).toHaveAttribute("href", whatsappNicoUrl("ingenia.wa_message"));
  });
});
