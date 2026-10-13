import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Footer from "../Footer";

vi.mock("../../utils/iconMapping.jsx", () => ({
  Icon: ({ name }) => <svg data-icon={name} />,
}));

describe("Footer: boletín → /api/leads", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("guarda el correo como lead con fuente boletin (antes se descartaba)", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), { status: 201 }),
      );
    render(<Footer />);
    const email = screen.getByLabelText("footer.email_placeholder");
    fireEvent.change(email, { target: { value: "ana@ejemplo.co" } });
    fireEvent.change(screen.getByLabelText("leadForm.profile_label"), {
      target: { value: "docente" },
    });
    fireEvent.click(
      screen.getByRole("checkbox", { name: /leadForm.consent_text/ }),
    );
    fireEvent.submit(email.closest("form"));

    expect(await screen.findByText("footer.thanks")).toBeInTheDocument();
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({
      email: "ana@ejemplo.co",
      perfil: "docente",
      fuente: "boletin",
      autorizacion_datos: true,
    });
  });

  it("si falla no dice «gracias»", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(
      new TypeError("Failed to fetch"),
    );
    render(<Footer />);
    const email = screen.getByLabelText("footer.email_placeholder");
    fireEvent.change(email, { target: { value: "ana@ejemplo.co" } });
    fireEvent.change(screen.getByLabelText("leadForm.profile_label"), {
      target: { value: "padre" },
    });
    fireEvent.click(
      screen.getByRole("checkbox", { name: /leadForm.consent_text/ }),
    );
    fireEvent.submit(email.closest("form"));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "leadForm.error_red",
    );
    expect(screen.queryByText("footer.thanks")).not.toBeInTheDocument();
  });
});
