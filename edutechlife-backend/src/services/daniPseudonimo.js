/**
 * Seudónimo del nombre del estudiante en las llamadas a DeepSeek.
 *
 * Con DANI_PSEUDONIMO=true, el nombre de pila y el nombre completo del niño que
 * chatea se cambian por un código neutro ("Estudiante 4F3A") antes de salir del
 * servidor. La respuesta que vuelve de DeepSeek se devuelve al niño con su nombre.
 * La correspondencia vive solo en memoria, dentro de cada petición.
 *
 * Con la variable en cualquier otro valor, este módulo no se usa y el chat
 * sigue exactamente igual que antes.
 */
const crypto = require('crypto');

const CARACTER_PALABRA = /[\p{L}\p{N}_]/u;
const CLASE_PALABRA = '\\p{L}\\p{N}_';
const GENERICOS = new Set(['estudiante', 'alumno', 'alumna', 'niño', 'niña']);
const SIN_NOMBRE = 'tú';

function pseudonimoActivo() {
  return process.env.DANI_PSEUDONIMO === 'true';
}

function codigoPara(studentId) {
  const hash = crypto.createHash('sha256').update(String(studentId)).digest('hex');
  return `Estudiante ${hash.slice(0, 4).toUpperCase()}`;
}

const escapar = (texto) => texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Formas con las que el niño puede escribir su nombre: tal cual, capitalizada y
// en mayúsculas. La minúscula no se toca: "sol" casi siempre es el astro.
function formasDelNombre(nombre) {
  const completo = nombre.trim().replace(/\s+/g, ' ');
  const pila = completo.split(' ')[0];
  if (!pila || GENERICOS.has(pila.toLowerCase())) return { pila: null, formas: [] };
  const variantes = (s) => [s, s.charAt(0).toUpperCase() + s.slice(1).toLowerCase(), s.toUpperCase()];
  const formas = new Set(variantes(pila));
  if (completo !== pila) variantes(completo).forEach((f) => formas.add(f));
  // La forma más larga primero: "Ana María" gana a "Ana".
  return { pila, formas: [...formas].sort((a, b) => b.length - a.length) };
}

function compilarPatrones(formas, codigo) {
  const alternativas = formas.map(escapar).join('|');
  // Entradas escapadas con escapar(): el nombre del niño no puede inyectar regex.
  /* eslint-disable security/detect-non-literal-regexp */
  return {
    redactar: new RegExp(`(?<![${CLASE_PALABRA}])(?:${alternativas})(?![${CLASE_PALABRA}])`, 'gu'),
    restaurar: new RegExp(escapar(codigo), 'giu'),
  };
  /* eslint-enable security/detect-non-literal-regexp */
}

// Plan B sin expresiones regulares: solo cambia coincidencias de palabra completa.
function neutralizar(texto, formas) {
  let salida = texto;
  for (const forma of formas) {
    let out = '';
    let desde = 0;
    let i = salida.indexOf(forma);
    while (i !== -1) {
      const antes = salida[i - 1] || '';
      const despues = salida[i + forma.length] || '';
      const esPalabra = CARACTER_PALABRA.test(antes) || CARACTER_PALABRA.test(despues);
      out += salida.slice(desde, i) + (esPalabra ? forma : SIN_NOMBRE);
      desde = i + forma.length;
      i = salida.indexOf(forma, desde);
    }
    salida = out + salida.slice(desde);
  }
  return salida;
}

// Restaura el código en el flujo: retiene el final del trozo si podría ser el
// principio del código, porque DeepSeek lo entrega partido entre fragmentos.
function crearRestaurador(restaurar, codigo) {
  const minusculas = codigo.toLowerCase();
  let pendiente = '';
  const retenido = (texto) => {
    for (let k = Math.min(codigo.length - 1, texto.length); k > 0; k--) {
      if (minusculas.startsWith(texto.slice(-k).toLowerCase())) return k;
    }
    return 0;
  };
  return {
    push(trozo) {
      const texto = pendiente + (trozo || '');
      const k = retenido(texto);
      pendiente = texto.slice(texto.length - k);
      return restaurar(texto.slice(0, texto.length - k));
    },
    flush() {
      const salida = restaurar(pendiente);
      pendiente = '';
      return salida;
    },
  };
}

function avisar(etapa, err) {
  console.warn(`[DaniPseudonimo] ${etapa} falló; el nombre no se envía:`, err.message);
}

/**
 * Seudónimo para una petición. Devuelve null si no hay nombre que ocultar.
 * Si la preparación falla, devuelve un seudónimo "fallido": el nombre no se envía
 * y el tutor trata al niño de tú.
 * @param {{studentId: string, name: string|null}} datos
 * @param {{compilar?: Function}} [deps] inyección para pruebas
 */
function prepararPseudonimo({ studentId, name }, deps = {}) {
  if (name === null || name === undefined) return null;
  let formas = [];
  try {
    const { pila, formas: f } = formasDelNombre(name);
    formas = f;
    if (!pila) return null;
    const codigo = codigoPara(studentId);
    const { redactar, restaurar } = (deps.compilar || compilarPatrones)(formas, codigo);
    const restore = (texto) => (typeof texto === 'string' ? texto.replace(restaurar, () => pila) : texto);
    return {
      fallo: false,
      codigo,
      nombreEnPrompt: codigo,
      instruccion: `Para nombrar al estudiante escribe exactamente "${codigo}"; nunca inventes otro nombre.`,
      redact(texto) {
        if (typeof texto !== 'string') return texto;
        try {
          return texto.replace(redactar, () => codigo);
        } catch (err) {
          avisar('redacción', err);
          return neutralizar(texto, formas);
        }
      },
      restore,
      restorer: () => crearRestaurador(restore, codigo),
    };
  } catch (err) {
    avisar('preparación', err);
    return pseudonimoFallido(formas);
  }
}

/** Seudónimo que no oculta nada con regex, pero sí quita el nombre y usa "tú". */
function pseudonimoFallido(formas = []) {
  return {
    fallo: true,
    codigo: null,
    nombreEnPrompt: null,
    instruccion: 'Dirígete al estudiante de tú y no uses su nombre.',
    redact: (texto) => (typeof texto === 'string' ? neutralizar(texto, formas) : texto),
    restore: (texto) => texto,
    restorer: () => ({ push: (trozo) => trozo, flush: () => '' }),
  };
}

/** Aplica el seudónimo al contenido de un mensaje (texto o partes multimodales). */
function redactarContenido(contenido, pseudonimo) {
  if (!pseudonimo) return contenido;
  if (typeof contenido === 'string') return pseudonimo.redact(contenido);
  if (Array.isArray(contenido)) {
    return contenido.map((parte) =>
      parte && parte.type === 'text' && typeof parte.text === 'string'
        ? { ...parte, text: pseudonimo.redact(parte.text) }
        : parte,
    );
  }
  return contenido;
}

/** Aplica el seudónimo a todos los textos de un objeto (memoria, plan, documento). */
function redactarProfundo(valor, pseudonimo) {
  if (!pseudonimo || valor === null || valor === undefined) return valor;
  if (typeof valor === 'string') return pseudonimo.redact(valor);
  if (Array.isArray(valor)) return valor.map((v) => redactarProfundo(v, pseudonimo));
  if (typeof valor === 'object') {
    return Object.fromEntries(Object.entries(valor).map(([k, v]) => [k, redactarProfundo(v, pseudonimo)]));
  }
  return valor;
}

module.exports = {
  pseudonimoActivo,
  prepararPseudonimo,
  pseudonimoFallido,
  redactarContenido,
  redactarProfundo,
  codigoPara,
};
