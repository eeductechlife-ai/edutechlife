import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/vitest";

vi.mock("../../hooks/useAuthIdentity", () => ({
  useAuthIdentity: () => ({
    token: "token-prueba",
    isLoaded: true,
    isSignedIn: true,
  }),
}));
vi.mock("../../components/kids-dashboard/IngenIALoadingSkeleton", () => ({
  default: () => <div data-testid="skeleton" />,
}));

import AutorizacionPadresGate from "../../components/kids-dashboard/AutorizacionPadresGate";
import AutorizacionPadres from "../../pages/AutorizacionPadres";

function respuesta(body, ok = true) {
  return Promise.resolve({
    ok,
    status: ok ? 200 : 500,
    json: () => Promise.resolve(body),
  });
}

let fetchMock;

beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("AutorizacionPadresGate (estudiante)", () => {
  it("muestra el dashboard cuando la cuenta no está restringida", async () => {
    fetchMock.mockImplementation(() =>
      respuesta({ restringido: false, estado: "no_requerida" }),
    );

    render(
      <MemoryRouter>
        <AutorizacionPadresGate>
          <div>dashboard-real</div>
        </AutorizacionPadresGate>
      </MemoryRouter>,
    );

    expect(await screen.findByText("dashboard-real")).toBeInTheDocument();
    expect(
      screen.queryByText(/Tu papá o mamá debe autorizar/),
    ).not.toBeInTheDocument();
  });

  it("restringida: no muestra el dashboard y pide la autorización una sola vez", async () => {
    fetchMock.mockImplementation((url, opts) => {
      if (String(url).endsWith("/authorization/status")) {
        return respuesta({ restringido: true, estado: "sin_solicitud" });
      }
      if (
        String(url).endsWith("/authorization/request") &&
        opts?.method === "POST"
      ) {
        return respuesta({ estado: "pendiente" });
      }
      return respuesta({}, false);
    });

    render(
      <MemoryRouter>
        <AutorizacionPadresGate>
          <div>dashboard-real</div>
        </AutorizacionPadresGate>
      </MemoryRouter>,
    );

    expect(
      await screen.findByText("Tu papá o mamá debe autorizar tu acceso"),
    ).toBeInTheDocument();
    expect(screen.queryByText("dashboard-real")).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Hacer mi diagnóstico VAK" }),
    ).toHaveAttribute("href", "/vak");
    expect(
      await screen.findByText(/Enviamos un correo a tu papá o mamá/),
    ).toBeInTheDocument();

    const pedidos = fetchMock.mock.calls.filter(([url]) =>
      String(url).endsWith("/authorization/request"),
    );
    expect(pedidos).toHaveLength(1);
  });

  it("sin vínculo de padre informa al estudiante y no ofrece reintentar", async () => {
    fetchMock.mockImplementation((url) => {
      if (String(url).endsWith("/authorization/status")) {
        return respuesta({ restringido: true, estado: "sin_solicitud" });
      }
      return respuesta({ estado: "sin_vinculo" });
    });

    render(
      <MemoryRouter>
        <AutorizacionPadresGate>
          <div>dashboard-real</div>
        </AutorizacionPadresGate>
      </MemoryRouter>,
    );

    expect(
      await screen.findByText(/No encontramos un padre o madre vinculado/),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Volver a enviar/ }),
    ).not.toBeInTheDocument();
  });
});

describe("AutorizacionPadres (enlace del correo)", () => {
  const TOKEN = "t".repeat(43);

  function renderPagina(url = `/autorizacion-padres?token=${TOKEN}`) {
    return render(
      <MemoryRouter initialEntries={[url]}>
        <AutorizacionPadres />
      </MemoryRouter>,
    );
  }

  it("un enlace sin token muestra que no es válido", async () => {
    renderPagina("/autorizacion-padres");
    expect(
      await screen.findByText("Este enlace no es válido."),
    ).toBeInTheDocument();
  });

  it("un enlace vencido muestra el motivo y no ofrece confirmar", async () => {
    fetchMock.mockImplementation(() =>
      respuesta({ valida: false, motivo: "vencido" }),
    );
    renderPagina();
    expect(await screen.findByText(/Este enlace venció/)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Autorizar" }),
    ).not.toBeInTheDocument();
  });

  it("exige marcar las tres casillas antes de autorizar y envía la versión de la política", async () => {
    fetchMock.mockImplementation((url) => {
      if (String(url).includes("/authorization/preview")) {
        return respuesta({ valida: true, versionPolitica: "2026-10" });
      }
      return respuesta({ estado: "autorizada", versionPolitica: "2026-10" });
    });

    renderPagina();
    const boton = await screen.findByRole("button", { name: "Autorizar" });
    expect(boton).toBeDisabled();

    const casillas = screen.getAllByRole("checkbox");
    expect(casillas).toHaveLength(3);
    casillas.forEach((c) => fireEvent.click(c));
    expect(boton).toBeEnabled();

    fireEvent.click(boton);
    expect(
      await screen.findByText(/Registramos tu autorización/),
    ).toBeInTheDocument();

    const confirmacion = fetchMock.mock.calls.find(([url]) =>
      String(url).endsWith("/authorization/confirm"),
    );
    const cuerpo = JSON.parse(confirmacion[1].body);
    expect(cuerpo).toEqual({
      token: TOKEN,
      versionPolitica: "2026-10",
      aceptaPolitica: true,
      aceptaTerminos: true,
      autorizaTratamiento: true,
    });
  });
});
