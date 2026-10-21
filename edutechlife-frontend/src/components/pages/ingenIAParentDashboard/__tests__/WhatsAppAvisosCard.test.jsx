import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import WhatsAppAvisosCard from "../components/WhatsAppAvisosCard";

const VERSION = "whatsapp-padres-v1-2026-10-21";
const SIN_CONFIGURAR = {
  activo: false,
  telefonoVisible: null,
  avisoConexion: true,
  informeSemanal: true,
  verificacionPendiente: false,
};
const ACTIVO = {
  activo: true,
  telefonoVisible: "•••• 2233",
  avisoConexion: true,
  informeSemanal: true,
  verificacionPendiente: false,
};

/** Servidor simulado: una respuesta por «MÉTODO /ruta». */
function servidor(rutas) {
  global.fetch = vi.fn(async (url, opciones = {}) => {
    const ruta = url.split("/api/ingenia/padre/whatsapp")[1] ?? "";
    const clave = `${opciones.method || "GET"} ${ruta || "/"}`;
    const r = rutas[clave];
    if (!r) throw new Error(`ruta no simulada: ${clave}`);
    const { estado = 200, cuerpo } = typeof r === "function" ? r(opciones) : r;
    return { ok: estado < 400, status: estado, json: async () => cuerpo };
  });
}
const llamadas = (metodo, ruta) =>
  global.fetch.mock.calls.filter(
    ([u, o]) =>
      (o?.method || "GET") === metodo && u.endsWith(`/padre/whatsapp${ruta}`),
  );
const cuerpoDe = (metodo, ruta) =>
  JSON.parse(llamadas(metodo, ruta).at(-1)[1].body);

const disponible = (preferencias = SIN_CONFIGURAR) => ({
  "GET /": {
    cuerpo: { disponible: true, versionTexto: VERSION, preferencias },
  },
});

describe("WhatsAppAvisosCard", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("no se muestra si el servidor no tiene WhatsApp configurado", async () => {
    servidor({
      "GET /": {
        cuerpo: {
          disponible: false,
          versionTexto: VERSION,
          preferencias: SIN_CONFIGURAR,
        },
      },
    });
    const { container } = render(<WhatsAppAvisosCard authToken="tok" />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(container).toBeEmptyDOMElement());
  });

  it("no se muestra si no se puede consultar al servidor", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("red"));
    const { container } = render(<WhatsAppAvisosCard authToken="tok" />);
    await waitFor(() => expect(container).toBeEmptyDOMElement());
  });

  it("sin sesión no llama al servidor", () => {
    global.fetch = vi.fn();
    render(<WhatsAppAvisosCard authToken={undefined} />);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("pide aceptar y dar el número antes de poder enviar el código", async () => {
    servidor(disponible());
    render(<WhatsAppAvisosCard authToken="tok" />);
    const boton = await screen.findByRole("button", {
      name: /enviarme un código/i,
    });
    expect(boton).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText("+57 300 111 2233"), {
      target: { value: "3001112233" },
    });
    expect(boton).toBeDisabled(); // falta aceptar
    fireEvent.click(screen.getByRole("checkbox"));
    expect(boton).toBeEnabled();
  });

  it("pide el código con el número, la aceptación y la versión del texto, y pasa a verificar", async () => {
    servidor({
      ...disponible(),
      "POST /codigo": {
        estado: 201,
        cuerpo: { enviado: true, expiraEnMinutos: 10 },
      },
    });
    render(<WhatsAppAvisosCard authToken="tok" />);
    fireEvent.change(await screen.findByPlaceholderText("+57 300 111 2233"), {
      target: { value: "3001112233" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(
      screen.getByRole("button", { name: /enviarme un código/i }),
    );

    await screen.findByLabelText("Código de verificación");
    expect(cuerpoDe("POST", "/codigo")).toEqual({
      telefono: "3001112233",
      acepta: true,
      version: VERSION,
    });
    expect(llamadas("POST", "/codigo")[0][1].headers.Authorization).toBe(
      "Bearer tok",
    );
  });

  it("confirma el código y muestra los avisos activos con el número tapado", async () => {
    servidor({
      ...disponible({ ...SIN_CONFIGURAR, verificacionPendiente: true }),
      "POST /confirmar": { cuerpo: { preferencias: ACTIVO } },
    });
    render(<WhatsAppAvisosCard authToken="tok" />);
    const campo = await screen.findByLabelText("Código de verificación");
    const confirmar = screen.getByRole("button", { name: /^confirmar$/i });
    expect(confirmar).toBeDisabled();

    fireEvent.change(campo, { target: { value: "12ab34" } }); // solo se aceptan dígitos
    expect(campo).toHaveValue("1234");
    fireEvent.change(campo, { target: { value: "123456" } });
    fireEvent.click(confirmar);

    await screen.findByText(/Activos en el WhatsApp •••• 2233/);
    expect(cuerpoDe("POST", "/confirmar")).toEqual({ codigo: "123456" });
    expect(screen.queryByText(/3001112233/)).not.toBeInTheDocument();
  });

  it("un código incorrecto muestra el motivo y deja reintentar", async () => {
    servidor({
      ...disponible({ ...SIN_CONFIGURAR, verificacionPendiente: true }),
      "POST /confirmar": {
        estado: 400,
        cuerpo: { error: "x", motivo: "codigo_incorrecto" },
      },
    });
    render(<WhatsAppAvisosCard authToken="tok" />);
    fireEvent.change(await screen.findByLabelText("Código de verificación"), {
      target: { value: "000000" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^confirmar$/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "El código no es correcto.",
    );
    expect(screen.getByLabelText("Código de verificación")).toBeInTheDocument();
  });

  it("muestra el texto que corresponde a cada motivo de error al pedir el código", async () => {
    servidor({
      ...disponible(),
      "POST /codigo": {
        estado: 400,
        cuerpo: { error: "x", motivo: "telefono_invalido" },
      },
    });
    render(<WhatsAppAvisosCard authToken="tok" />);
    fireEvent.change(await screen.findByPlaceholderText("+57 300 111 2233"), {
      target: { value: "123" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(
      screen.getByRole("button", { name: /enviarme un código/i }),
    );
    expect(await screen.findByRole("alert")).toHaveTextContent(
      /número de WhatsApp válido/,
    );
  });

  it("si el servidor no responde, avisa sin romper la tarjeta", async () => {
    servidor({ ...disponible() });
    render(<WhatsAppAvisosCard authToken="tok" />);
    fireEvent.change(await screen.findByPlaceholderText("+57 300 111 2233"), {
      target: { value: "3001112233" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(
      screen.getByRole("button", { name: /enviarme un código/i }),
    ); // ruta no simulada: lanza
    expect(await screen.findByRole("alert")).toHaveTextContent(
      /No pudimos conectar/,
    );
    expect(screen.getByTestId("whatsapp-avisos-card")).toBeInTheDocument();
  });

  it("con los avisos activos, cada interruptor se guarda por separado", async () => {
    servidor({
      ...disponible(ACTIVO),
      "PUT /": (o) => ({
        cuerpo: { preferencias: { ...ACTIVO, ...JSON.parse(o.body) } },
      }),
    });
    render(<WhatsAppAvisosCard authToken="tok" />);
    const conexion = await screen.findByLabelText(/Avisarme cuando mi hijo/);
    fireEvent.click(conexion);
    await waitFor(() => expect(conexion).not.toBeChecked());
    expect(cuerpoDe("PUT", "")).toEqual({ avisoConexion: false });
    expect(screen.getByLabelText(/informe semanal/)).toBeChecked();

    fireEvent.click(screen.getByLabelText(/informe semanal/));
    await waitFor(() =>
      expect(screen.getByLabelText(/informe semanal/)).not.toBeChecked(),
    );
    expect(cuerpoDe("PUT", "")).toEqual({ informeSemanal: false });
  });

  it("desactivar los avisos vuelve al formulario", async () => {
    servidor({
      ...disponible(ACTIVO),
      "DELETE /": { cuerpo: { preferencias: SIN_CONFIGURAR } },
    });
    render(<WhatsAppAvisosCard authToken="tok" />);
    fireEvent.click(
      await screen.findByRole("button", { name: /desactivar los avisos/i }),
    );
    expect(
      await screen.findByRole("button", { name: /enviarme un código/i }),
    ).toBeInTheDocument();
    expect(llamadas("DELETE", "")).toHaveLength(1);
  });

  it("cambiar de número muestra el formulario y se puede cancelar", async () => {
    servidor(disponible(ACTIVO));
    render(<WhatsAppAvisosCard authToken="tok" />);
    fireEvent.click(
      await screen.findByRole("button", { name: /cambiar número/i }),
    );
    expect(
      screen.getByRole("button", { name: /enviarme un código/i }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /cancelar/i }));
    expect(screen.getByText(/Activos en el WhatsApp/)).toBeInTheDocument();
  });
});
