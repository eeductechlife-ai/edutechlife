/**
 * Captura de datos de contacto dentro de Nico (etapa 1, sin calendario).
 * Orden: aviso de tratamiento de datos (Ley 1581) → aceptación explícita →
 * edad → nombre → correo o WhatsApp → perfil → ciudad (opcional) →
 * franja horaria → día → envío a POST /api/leads con fuente "nico".
 *
 * Lógica pura: useNicoSendMessage solo la conecta con el chat. Nada de lo
 * que el usuario escribe aquí pasa por el modelo ni por la memoria de Nico.
 */
import { submitLead, LeadSubmitError } from "../../services/leads";

export const POLITICA_DATOS = {
  texto: "Política de tratamiento de datos",
  url: "/privacy",
};
export const WHATSAPP = "+57 323 836 5517";

const normalizar = (texto) =>
  String(texto ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const limpiar = (texto) =>
  String(texto ?? "")
    .trim()
    .replace(/\s+/g, " ");

// Frases que piden ser contactado o dejar datos. Son estrictas a propósito:
// preguntas como "¿cómo los contacto?" siguen en el flujo normal de Nico.
const DISPARADORES = [
  /\bque me (contacten|contacte|llamen|llame|escriban|escriba|busquen)\b/,
  /\bme (pueden|puedan|puedes|puede) (contactar|llamar|escribir)\b/,
  /\b(contactenme|llamenme|contactame|llamame|escribeme)\b/,
  /\bdej\w* (mis|mi) (datos|contacto|numero|correo)\b/,
  /\bque (un |una )?(asesor|asesora|persona del equipo|alguien del equipo) (me )?(contacte|llame|escriba)\b/,
];

// Un menor no deja datos. Solo se detecta en primera persona: "soy niño",
// "tengo 12 años". "Mi hijo es menor" no cuenta.
const MENOR_RE =
  /\bsoy (un |una )?(nino|nina|menor|adolescente)\b|\bsoy menor\b/;

const ACEPTA = /^(si[ ,.]*)?(acepto|autorizo)\b|^si[.!]?$/;
const RECHAZA = /^no\b/;
const CANCELA = /^(cancelar|cancela|olvidalo|salir|no quiero)\b/;

const PERFILES = [
  ["padre", /\b(padre|madre|papa|mama|acudiente|representante)\b|^1$/],
  ["docente", /\b(docente|profe|profesor|profesora|maestro|maestra)\b|^2$/],
  ["colegio", /\b(colegio|institucion|rector|rectora)\b|^3$/],
  ["empresa", /\b(empresa|compania|negocio|corporativo)\b|^4$/],
  ["otro", /\b(otro|otra)\b|^5$/],
];

export const RESP = {
  aviso:
    "Para dejar tus datos de contacto necesito tu autorización. Tratamos tu nombre, correo o WhatsApp, perfil, ciudad y horario para contactarte sobre nuestros servicios, según la Ley 1581 de 2012. Puedes leer la política aquí. ¿Aceptas el tratamiento de tus datos? Responde «Acepto» o «No acepto».",
  reaviso:
    "Para seguir necesito tu aceptación: responde «Acepto» o «No acepto». Puedes leer la política aquí.",
  noAcepto:
    "Entendido. Sin tu aceptación no pedimos ni guardamos tus datos. Si cambias de opinión, escribe «quiero que me contacten».",
  menor:
    "Gracias por escribirnos. Para dejar datos de contacto, pídele a un adulto (tu papá, tu mamá o un profesor) que escriba aquí. Nico no pide datos a menores de edad.",
  cancelada: "Listo, cancelé la solicitud y no guardamos tus datos.",
  noEnviada: "De acuerdo, no enviamos la solicitud.",
  incompleto:
    "Faltan datos para enviar tu solicitud. Empieza de nuevo escribiendo «quiero que me contacten».",
  pideEdad: "Antes de continuar, ¿eres mayor de 18 años? Responde sí o no.",
  pideNombre: "Perfecto. ¿Cuál es tu nombre completo?",
  reNombre: "Escribe tu nombre completo (nombre y apellido), por favor.",
  pideContacto:
    "¿Cuál es tu correo electrónico o tu número de WhatsApp? Basta uno; si puedes, déjanos los dos.",
  reContacto:
    "No reconocí un correo ni un número válido. Escríbelo así: nombre@correo.com o 300 123 4567.",
  pidePerfil:
    "¿Cuál de estas opciones te describe mejor? Padre o madre, docente, colegio, empresa u otro.",
  rePerfil:
    "Elige una opción: padre o madre, docente, colegio, empresa u otro.",
  pideCiudad:
    "¿En qué ciudad estás? Si prefieres no decirlo, escribe «omitir».",
  reCiudad: "Escribe el nombre de tu ciudad, o «omitir».",
  pideFranja:
    "¿En qué momento del día prefieres que te contactemos: mañana, tarde o noche?",
  reFranja: "Elige mañana, tarde o noche.",
  pideDia: "¿Qué día te queda mejor? Por ejemplo: lunes, jueves o hoy.",
  reDia: "Escribe el día que prefieres, por ejemplo: lunes o hoy.",
  guardado: (d) =>
    `Listo, ${d.nombre.split(" ")[0]}. Quedó guardada tu solicitud para contactarte en la ${d.franja}, ${d.dia}.` +
    (d.perfil === "colegio"
      ? " Como representas a un colegio, una persona de nuestro equipo te atenderá directamente."
      : ""),
  error: {
    red: "No pudimos guardar tus datos: no hubo conexión con nuestro servidor.",
    limite:
      "No pudimos guardar tus datos: hiciste demasiados intentos. Espera unos minutos.",
    invalido: "No pudimos guardar tus datos: algún dato no es válido.",
    servidor: "No pudimos guardar tus datos por un error en nuestro sistema.",
  },
  reintento: `Escribe «reintentar» para volver a intentarlo o escríbenos por WhatsApp al ${WHATSAPP}.`,
};

export function capturaInicial() {
  return { paso: "inactiva", datos: {} };
}

/** true si el mensaje pide que Nico tome datos de contacto. */
export function esDisparador(texto) {
  const n = normalizar(texto);
  return DISPARADORES.some((re) => re.test(n));
}

// Edad declarada en "tengo 12 años" o "edad 12". Ignora "8 años de experiencia".
function edadDeclarada(n) {
  const m = n.match(/\b(?:tengo|edad)\s*:?\s*(\d{1,3})\s*anos\b/);
  if (!m) return null;
  const resto = n.slice(m.index + m[0].length);
  if (/^\s+de\s+(?!edad\b)/.test(resto)) return null;
  return Number(m[1]);
}

/** true si el usuario se declara niño, adolescente o menor de edad. */
export function esMenorDeEdad(texto) {
  const n = normalizar(texto);
  if (MENOR_RE.test(n)) return true;
  const edad = edadDeclarada(n);
  return edad !== null && edad < 18;
}

function leerEdad(texto) {
  const n = normalizar(texto);
  if (esMenorDeEdad(n)) return "menor";
  const num = n.match(/\b(\d{1,3})\b/);
  if (num) {
    const v = Number(num[1]);
    if (v < 18) return "menor";
    return v <= 110 ? "adulto" : null;
  }
  if (/^no\b|\bno soy\b|\bmenor\b|\bnino\b|\bnina\b/.test(n)) return "menor";
  if (/\b(si|mayor|adulto|claro)\b/.test(n)) return "adulto";
  return null;
}

function leerNombre(texto) {
  const n = limpiar(texto);
  if (n.length < 2 || n.length > 120) return null;
  if (!/^[\p{L}][\p{L}\s.'-]*$/u.test(n)) return null;
  return /\p{L}{2}/u.test(n) ? n : null;
}

function leerContacto(texto) {
  const original = limpiar(texto);
  const email = original.match(/[^\s@]+@[^\s@]+\.[^\s@]{2,}/);
  const tel = original.match(/\+?\d[\d\s().-]{5,28}\d/);
  const digitos = tel ? tel[0].replace(/\D/g, "").length : 0;
  const correo = email ? email[0].replace(/[.,;:)]+$/, "").toLowerCase() : null;
  const telefono = tel && digitos >= 7 && digitos <= 15 ? tel[0].trim() : null;
  if (!correo && !telefono) return null;
  return { email: correo, telefono };
}

function leerPerfil(texto) {
  const n = normalizar(texto);
  const hit = PERFILES.find(([, re]) => re.test(n));
  return hit ? hit[0] : null;
}

// Devuelve "" si el usuario omite la ciudad, null si no se entiende.
function leerCiudad(texto) {
  const n = normalizar(texto);
  if (/^(omitir|no|ninguna|prefiero no|no aplica|skip)\b/.test(n)) return "";
  const c = limpiar(texto).slice(0, 80);
  return /\p{L}{2}/u.test(c) ? c : null;
}

function leerFranja(texto) {
  const n = normalizar(texto);
  if (/\b(manana|en la manana)\b/.test(n)) return "mañana";
  if (/\btarde\b/.test(n)) return "tarde";
  if (/\bnoche\b/.test(n)) return "noche";
  return null;
}

function leerDia(texto) {
  const c = limpiar(texto).slice(0, 60);
  if (!/\p{L}{2}/u.test(c)) return null;
  // En el paso del día, "mañana" significa el día siguiente, no la franja.
  return normalizar(c) === "manana" ? "día siguiente" : c;
}

const fin = (respuesta) => ({ estado: capturaInicial(), respuesta });
const siguiente = (paso, datos, respuesta) => ({
  estado: { paso, datos },
  respuesta,
});
const repite = (estado, respuesta) => ({ estado, respuesta });
const enviar = (datos) => ({
  estado: { paso: "enviando", datos },
  respuesta: null,
  enviar: true,
});

/**
 * Avanza la captura con el mensaje del usuario.
 * Devuelve null si el mensaje no pertenece a la captura (el flujo normal sigue).
 * Si devuelve `enviar: true`, el llamador debe ejecutar completarEnvio(estado.datos).
 */
export function avanzarCaptura(estado, texto) {
  const actual = estado ?? capturaInicial();
  if (actual.paso === "inactiva") {
    if (!esDisparador(texto)) return null;
    if (esMenorDeEdad(texto)) return fin(RESP.menor);
    return {
      estado: { paso: "consentimiento", datos: {} },
      respuesta: RESP.aviso,
      enlace: POLITICA_DATOS,
    };
  }

  if (esMenorDeEdad(texto)) return fin(RESP.menor);
  const n = normalizar(texto);
  const { datos } = actual;

  if (actual.paso === "consentimiento") {
    if (ACEPTA.test(n)) {
      return siguiente(
        "edad",
        { ...datos, consentimiento: true },
        RESP.pideEdad,
      );
    }
    if (RECHAZA.test(n) || CANCELA.test(n)) return fin(RESP.noAcepto);
    return repite(actual, RESP.reaviso);
  }

  if (CANCELA.test(n)) return fin(RESP.cancelada);

  switch (actual.paso) {
    case "edad": {
      const edad = leerEdad(texto);
      if (edad === "menor") return fin(RESP.menor);
      if (edad === "adulto") {
        return siguiente("nombre", datos, RESP.pideNombre);
      }
      return repite(actual, RESP.pideEdad);
    }
    case "nombre": {
      const nombre = leerNombre(texto);
      return nombre
        ? siguiente("contacto", { ...datos, nombre }, RESP.pideContacto)
        : repite(actual, RESP.reNombre);
    }
    case "contacto": {
      const c = leerContacto(texto);
      return c
        ? siguiente("perfil", { ...datos, ...c }, RESP.pidePerfil)
        : repite(actual, RESP.reContacto);
    }
    case "perfil": {
      const perfil = leerPerfil(texto);
      return perfil
        ? siguiente("ciudad", { ...datos, perfil }, RESP.pideCiudad)
        : repite(actual, RESP.rePerfil);
    }
    case "ciudad": {
      const ciudad = leerCiudad(texto);
      return ciudad === null
        ? repite(actual, RESP.reCiudad)
        : siguiente(
            "franja",
            { ...datos, ciudad: ciudad || null },
            RESP.pideFranja,
          );
    }
    case "franja": {
      const franja = leerFranja(texto);
      return franja
        ? siguiente("dia", { ...datos, franja }, RESP.pideDia)
        : repite(actual, RESP.reFranja);
    }
    case "dia": {
      const dia = leerDia(texto);
      return dia ? enviar({ ...datos, dia }) : repite(actual, RESP.reDia);
    }
    case "reintentar":
      return /reintent|intenta|enviar|^si\b/.test(n)
        ? enviar(datos)
        : fin(RESP.noEnviada);
    default:
      return fin(RESP.incompleto);
  }
}

/** Todo lo obligatorio está presente y hay autorización. */
export function datosCompletos(d) {
  return Boolean(
    d &&
    d.consentimiento === true &&
    d.nombre &&
    (d.email || d.telefono) &&
    d.perfil &&
    d.franja &&
    d.dia,
  );
}

/** Cuerpo de POST /api/leads: fuente "nico" y horario en el mensaje. */
export function construirLead(d) {
  return {
    nombre: d.nombre,
    email: d.email || null,
    telefono: d.telefono || null,
    ciudad: d.ciudad || null,
    perfil: d.perfil,
    mensaje: `Horario preferido: ${d.franja} · ${d.dia}`,
    fuente: "nico",
    autorizacion_datos: true,
  };
}

/**
 * Envía la solicitud. Confirma solo si el backend la guardó; si falla,
 * muestra el motivo real y deja la captura en "reintentar".
 */
export async function completarEnvio(datos, enviarLead = submitLead) {
  if (!datosCompletos(datos)) {
    return {
      ok: false,
      codigo: "incompleto",
      estado: capturaInicial(),
      respuesta: RESP.incompleto,
    };
  }
  try {
    await enviarLead(construirLead(datos));
  } catch (err) {
    const codigo =
      err instanceof LeadSubmitError || err?.code ? err.code : "servidor";
    const motivo = RESP.error[codigo] || RESP.error.servidor;
    return {
      ok: false,
      codigo,
      estado: { paso: "reintentar", datos },
      respuesta: `${motivo} ${RESP.reintento}`,
    };
  }
  return {
    ok: true,
    codigo: null,
    estado: capturaInicial(),
    respuesta: RESP.guardado(datos),
  };
}
