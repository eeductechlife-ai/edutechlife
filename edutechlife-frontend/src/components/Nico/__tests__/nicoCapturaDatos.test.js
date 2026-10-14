import { describe, it, expect, vi, beforeEach } from "vitest";
import { submitLead, LeadSubmitError } from "../../../services/leads";
import {
  avanzarCaptura,
  capturaInicial,
  completarEnvio,
  esDisparador,
  esMenorDeEdad,
  RESP,
  WHATSAPP,
} from "../nicoCapturaDatos";

vi.mock("../../../services/leads", async (importOriginal) => {
  const real = await importOriginal();
  return { ...real, submitLead: vi.fn() };
});

// Recorre una conversación completa; devuelve el último resultado y el estado.
function correr(mensajes) {
  let estado = capturaInicial();
  let ultimo = null;
  for (const texto of mensajes) {
    const r = avanzarCaptura(estado, texto);
    if (!r) return { estado, ultimo, interceptado: false };
    estado = r.estado;
    ultimo = r;
  }
  return { estado, ultimo, interceptado: true };
}

const CONVERSACION_COMPLETA = [
  "quiero que me contacten",
  "Acepto",
  "sí",
  "Ana Gómez",
  "300 123 4567",
  "padre",
  "omitir",
  "tarde",
  "lunes",
];

describe("Nico captura de datos: consentimiento obligatorio", () => {
  beforeEach(() => {
    vi.mocked(submitLead).mockReset();
  });

  it("muestra el aviso de la Ley 1581 con enlace antes de pedir cualquier dato", () => {
    const r = avanzarCaptura(capturaInicial(), "quiero que me contacten");
    expect(r.estado.paso).toBe("consentimiento");
    expect(r.respuesta).toContain("Ley 1581 de 2012");
    expect(r.enlace.url).toBe("/privacy");
    expect(r.estado.datos).toEqual({});
  });

  it("sin aceptación no pide ni guarda datos: el nombre no avanza la captura", () => {
    const inicio = avanzarCaptura(capturaInicial(), "quiero que me contacten");
    const r = avanzarCaptura(inicio.estado, "Ana Gómez");
    expect(r.estado.paso).toBe("consentimiento");
    expect(r.respuesta).toBe(RESP.reaviso);
    expect(r.estado.datos.nombre).toBeUndefined();
    expect(submitLead).not.toHaveBeenCalled();
  });

  it("rechazar cierra la captura y no envía nada", async () => {
    const inicio = avanzarCaptura(capturaInicial(), "quiero que me contacten");
    const r = avanzarCaptura(inicio.estado, "No acepto");
    expect(r.estado.paso).toBe("inactiva");
    expect(r.respuesta).toBe(RESP.noAcepto);
    expect(r.enviar).toBeUndefined();
    expect(submitLead).not.toHaveBeenCalled();
  });

  it("solo una aceptación explícita avanza a la pregunta de edad", () => {
    const inicio = avanzarCaptura(capturaInicial(), "quiero que me contacten");
    const r = avanzarCaptura(inicio.estado, "Acepto");
    expect(r.estado.paso).toBe("edad");
    expect(r.estado.datos.consentimiento).toBe(true);
    expect(r.respuesta).toBe(RESP.pideEdad);
  });
});

describe("Nico captura de datos: menor de edad no deja datos", () => {
  beforeEach(() => {
    vi.mocked(submitLead).mockReset();
  });

  it("un niño que pide ser contactado recibe la indicación de pedirle a un adulto", () => {
    const r = avanzarCaptura(
      capturaInicial(),
      "Soy un niño, quiero que me llamen",
    );
    expect(r.estado.paso).toBe("inactiva");
    expect(r.respuesta).toBe(RESP.menor);
    expect(r.respuesta).toContain("pídele a un adulto");
  });

  it("si responde que no es mayor de edad, no se piden datos", () => {
    const { estado, ultimo } = correr([
      "quiero que me contacten",
      "Acepto",
      "no",
    ]);
    expect(ultimo.respuesta).toBe(RESP.menor);
    expect(estado.paso).toBe("inactiva");
    expect(ultimo.estado.datos.nombre).toBeUndefined();
  });

  it("declarar una edad menor de 18 corta la captura", () => {
    const { ultimo } = correr([
      "quiero que me contacten",
      "Acepto",
      "tengo 12",
    ]);
    expect(ultimo.respuesta).toBe(RESP.menor);
    expect(ultimo.enviar).toBeUndefined();
  });

  it("después de un menor, el siguiente dato no se toma como captura", () => {
    const { estado } = correr(["soy niña, quiero que me llamen"]);
    expect(avanzarCaptura(estado, "Ana Gómez")).toBeNull();
  });

  it("detecta solo la primera persona: un padre con un hijo menor sigue adelante", () => {
    expect(esMenorDeEdad("Mi hijo es menor de edad")).toBe(false);
    expect(esMenorDeEdad("Soy padre de un niño de 8 años")).toBe(false);
    expect(esMenorDeEdad("tengo 8 años de experiencia")).toBe(false);
    expect(esMenorDeEdad("tengo 35 años")).toBe(false);
    expect(esMenorDeEdad("tengo 12 años")).toBe(true);
    expect(esMenorDeEdad("soy menor de edad")).toBe(true);
  });
});

describe("Nico captura de datos: datos incompletos no se envían", () => {
  beforeEach(() => {
    vi.mocked(submitLead).mockReset();
  });

  it("un contacto sin correo ni número válido pide de nuevo y no avanza", () => {
    const { estado, ultimo } = correr([
      "quiero que me contacten",
      "Acepto",
      "sí",
      "Ana Gómez",
      "no tengo",
    ]);
    expect(estado.paso).toBe("contacto");
    expect(ultimo.respuesta).toBe(RESP.reContacto);
    expect(ultimo.enviar).toBeUndefined();
    expect(submitLead).not.toHaveBeenCalled();
  });

  it("sin horario (franja o día) la solicitud no se envía", () => {
    const sinDia = correr([...CONVERSACION_COMPLETA.slice(0, 8)]);
    expect(sinDia.ultimo.enviar).toBeUndefined();
    expect(sinDia.estado.paso).toBe("dia");
    const sinFranja = correr(CONVERSACION_COMPLETA.slice(0, 7));
    expect(sinFranja.estado.paso).toBe("franja");
    expect(submitLead).not.toHaveBeenCalled();
  });

  it("completarEnvio rechaza datos incompletos sin llamar al servicio", async () => {
    const r = await completarEnvio({
      consentimiento: true,
      nombre: "Ana Gómez",
      perfil: "padre",
      franja: "tarde",
      dia: "lunes",
    });
    expect(r.ok).toBe(false);
    expect(r.codigo).toBe("incompleto");
    expect(submitLead).not.toHaveBeenCalled();
  });

  it("completarEnvio sin consentimiento no guarda aunque los demás datos estén", async () => {
    const r = await completarEnvio({
      nombre: "Ana Gómez",
      telefono: "3001234567",
      perfil: "padre",
      franja: "tarde",
      dia: "lunes",
    });
    expect(r.ok).toBe(false);
    expect(submitLead).not.toHaveBeenCalled();
  });
});

describe("Nico captura de datos: envío exitoso", () => {
  beforeEach(() => {
    vi.mocked(submitLead).mockReset();
    vi.mocked(submitLead).mockResolvedValue(true);
  });

  it("guarda con fuente nico, autorización y horario en el mensaje", async () => {
    const { estado, ultimo } = correr(CONVERSACION_COMPLETA);
    expect(ultimo.enviar).toBe(true);

    const r = await completarEnvio(estado.datos);

    expect(r.ok).toBe(true);
    expect(submitLead).toHaveBeenCalledTimes(1);
    expect(submitLead).toHaveBeenCalledWith({
      nombre: "Ana Gómez",
      email: null,
      telefono: "300 123 4567",
      ciudad: null,
      perfil: "padre",
      mensaje: "Horario preferido: tarde · lunes",
      fuente: "nico",
      autorizacion_datos: true,
    });
    expect(r.respuesta).toContain("Listo, Ana");
    expect(r.respuesta).toContain("Quedó guardada");
    expect(r.estado.paso).toBe("inactiva");
  });

  it("acepta correo en lugar de WhatsApp y guarda la ciudad", async () => {
    const { estado } = correr([
      "quiero que me contacten",
      "Acepto",
      "sí",
      "Ana Gómez",
      "Ana.Gomez@Correo.com.",
      "docente",
      "Manizales",
      "noche",
      "hoy",
    ]);
    const r = await completarEnvio(estado.datos);
    expect(r.ok).toBe(true);
    const enviado = vi.mocked(submitLead).mock.calls[0][0];
    expect(enviado.email).toBe("ana.gomez@correo.com");
    expect(enviado.telefono).toBeNull();
    expect(enviado.ciudad).toBe("Manizales");
    expect(enviado.perfil).toBe("docente");
    expect(enviado.mensaje).toBe("Horario preferido: noche · hoy");
  });

  it("para un colegio deriva a una persona del equipo", async () => {
    const { estado } = correr([
      "quiero que me contacten",
      "Acepto",
      "sí",
      "Rectora Lucía Ruiz",
      "3001234567",
      "colegio",
      "omitir",
      "mañana",
      "miércoles",
    ]);
    const r = await completarEnvio(estado.datos);
    expect(r.ok).toBe(true);
    expect(r.respuesta).toContain("una persona de nuestro equipo");
  });
});

describe("Nico captura de datos: fallo muestra el error real", () => {
  beforeEach(() => {
    vi.mocked(submitLead).mockReset();
  });

  it("si la red falla, dice que no se guardó y ofrece WhatsApp", async () => {
    vi.mocked(submitLead).mockRejectedValue(new LeadSubmitError("red"));
    const { estado } = correr(CONVERSACION_COMPLETA);

    const r = await completarEnvio(estado.datos);

    expect(r.ok).toBe(false);
    expect(r.codigo).toBe("red");
    expect(r.respuesta).toContain("no hubo conexión");
    expect(r.respuesta).toContain(WHATSAPP);
    expect(r.respuesta).not.toContain("Quedó guardada");
    expect(r.estado.paso).toBe("reintentar");
    expect(r.estado.datos.nombre).toBe("Ana Gómez");
  });

  it("un error del servidor se informa como tal, no como éxito", async () => {
    vi.mocked(submitLead).mockRejectedValue(new LeadSubmitError("servidor"));
    const { estado } = correr(CONVERSACION_COMPLETA);
    const r = await completarEnvio(estado.datos);
    expect(r.ok).toBe(false);
    expect(r.respuesta).toContain("error en nuestro sistema");
    expect(r.respuesta).not.toContain("Listo");
  });

  it("tras un fallo, «reintentar» vuelve a enviar los mismos datos", async () => {
    vi.mocked(submitLead).mockRejectedValueOnce(new LeadSubmitError("red"));
    const { estado } = correr(CONVERSACION_COMPLETA);
    const fallo = await completarEnvio(estado.datos);

    const reintento = avanzarCaptura(fallo.estado, "reintentar");
    expect(reintento.enviar).toBe(true);

    vi.mocked(submitLead).mockResolvedValueOnce(true);
    const ok = await completarEnvio(reintento.estado.datos);
    expect(ok.ok).toBe(true);
    expect(submitLead).toHaveBeenCalledTimes(2);
  });
});

describe("Nico captura de datos: el flujo normal no cambia", () => {
  it("las preguntas habituales no disparan la captura", () => {
    const normales = [
      "¿Qué es IALab?",
      "¿Cuánto cuesta IngenIA?",
      "hola",
      "¿cómo los contacto?",
      "¿dónde están ubicados?",
      "quiero información de IngenIA",
      "me llamo Ana",
      "quiero agendar una llamada",
      "¿qué es el diagnóstico VAK?",
      "¿me pueden enviar el temario?",
    ];
    for (const texto of normales) {
      expect(esDisparador(texto)).toBe(false);
      expect(avanzarCaptura(capturaInicial(), texto)).toBeNull();
    }
  });

  it("los disparadores sí activan la captura", () => {
    const disparan = [
      "quiero que me contacten",
      "quiero que me llamen por favor",
      "me pueden llamar",
      "llámenme",
      "quiero dejar mis datos",
      "déjame mis datos",
    ];
    for (const texto of disparan) {
      expect(esDisparador(texto)).toBe(true);
    }
  });

  it("ningún mensaje de la captura incluye precios", async () => {
    vi.mocked(submitLead).mockResolvedValue(true);
    const textos = Object.values(RESP).filter((v) => typeof v === "string");
    const { estado } = correr(CONVERSACION_COMPLETA);
    const guardado = await completarEnvio(estado.datos);
    textos.push(guardado.respuesta);
    for (const t of textos) {
      expect(t).not.toMatch(/\$/);
    }
  });
});
