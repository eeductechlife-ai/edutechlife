/**
 * Plantillas del recordatorio de vencimiento de plan (es / en / pt).
 * Contenido: nombre del plan, fecha de vencimiento y enlace a /planes.
 * Sin datos del niño más allá del nombre de pila, y nunca en el asunto.
 */

const PLANES_URL = 'https://edutechlife.co/planes';
const PRIVACIDAD_URL = 'https://edutechlife.co/privacy';
const ZONA_HORARIA = 'America/Bogota';
const IDIOMAS = ['es', 'en', 'pt'];
const LOCALES = { es: 'es-CO', en: 'en-US', pt: 'pt-BR' };

const TEXTOS = {
  es: {
    asunto: { '7d': 'Tu plan {plan} vence en 7 días', '1d': 'Tu plan {plan} vence mañana' },
    cuerpo: {
      '7d': 'El plan {plan}{para} está pagado hasta el {fecha} (hora de Colombia). Faltan 7 días para que venza.',
      '1d': 'El plan {plan}{para} está pagado hasta el {fecha} (hora de Colombia). Vence mañana.',
    },
    para: ' de {pila}',
    saludo: 'Hola.',
    renueva: 'Para seguir sin interrupciones, renueva antes de esa fecha:',
    pie: 'Este es un aviso automático sobre la fecha de tu plan.',
    privacidad: 'Política de privacidad',
  },
  en: {
    asunto: { '7d': 'Your {plan} plan expires in 7 days', '1d': 'Your {plan} plan expires tomorrow' },
    cuerpo: {
      '7d': 'The {plan} plan{para} is paid until {fecha} (Colombia time). It expires in 7 days.',
      '1d': 'The {plan} plan{para} is paid until {fecha} (Colombia time). It expires tomorrow.',
    },
    para: ' for {pila}',
    saludo: 'Hello.',
    renueva: 'To keep access without interruption, renew before that date:',
    pie: 'This is an automatic notice about your plan date.',
    privacidad: 'Privacy policy',
  },
  pt: {
    asunto: { '7d': 'Seu plano {plan} vence em 7 dias', '1d': 'Seu plano {plan} vence amanhã' },
    cuerpo: {
      '7d': 'O plano {plan}{para} está pago até {fecha} (horário da Colômbia). Vence em 7 dias.',
      '1d': 'O plano {plan}{para} está pago até {fecha} (horário da Colômbia). Vence amanhã.',
    },
    para: ' de {pila}',
    saludo: 'Olá.',
    renueva: 'Para continuar sem interrupções, renove antes dessa data:',
    pie: 'Este é um aviso automático sobre a data do seu plano.',
    privacidad: 'Política de privacidade',
  },
};

const escapar = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/** Primera palabra del nombre, solo letras (sin HTML ni números). */
function nombrePila(valor) {
  const primera = String(valor ?? '').trim().split(/\s+/)[0] || '';
  return primera.replace(/[^\p{L}'-]/gu, '').slice(0, 30);
}

/** Sustituye {clave} por su valor. */
function llenar(texto, valores) {
  return texto.replace(/\{(\w+)\}/g, (_, clave) => valores[clave] ?? '');
}

function formatearFecha(fecha, idioma) {
  return new Intl.DateTimeFormat(LOCALES[idioma], {
    timeZone: ZONA_HORARIA,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(fecha);
}

/**
 * @param {Object} o
 * @param {'7d'|'1d'} o.tipo
 * @param {string} [o.idioma='es'] - 'es' | 'en' | 'pt'; otro valor usa español.
 * @param {string} o.plan - Nombre visible del plan, p. ej. "IALab Pro".
 * @param {string} o.paidUntil - ISO 8601 de vencimiento.
 * @param {string} [o.pila] - Nombre de pila del menor (solo cuando el correo va al padre).
 * @returns {{subject: string, html: string, text: string}}
 */
function construirRecordatorio({ tipo, idioma = 'es', plan, paidUntil, pila = '' }) {
  const lang = IDIOMAS.includes(idioma) ? idioma : 'es';
  const clave = tipo === '1d' ? '1d' : '7d';
  const t = TEXTOS[lang];
  const nombre = nombrePila(pila);
  const fecha = formatearFecha(new Date(paidUntil), lang);
  const para = nombre ? llenar(t.para, { pila: nombre }) : '';
  const frase = llenar(t.cuerpo[clave], { plan, para, fecha });
  const subject = llenar(t.asunto[clave], { plan });

  return {
    subject,
    html:
      '<div style="font-family:Arial,sans-serif;font-size:15px;color:#004B63">' +
      `<p>${escapar(t.saludo)}</p>` +
      `<p>${escapar(frase)}</p>` +
      `<p>${escapar(t.renueva)} <a href="${PLANES_URL}">${PLANES_URL}</a></p>` +
      `<p style="color:#6B7280;font-size:12px">${escapar(t.pie)} ` +
      `<a href="${PRIVACIDAD_URL}">${escapar(t.privacidad)}</a>.</p>` +
      '</div>',
    text: `${t.saludo}\n\n${frase}\n\n${t.renueva} ${PLANES_URL}\n\n${t.pie}\n${t.privacidad}: ${PRIVACIDAD_URL}`,
  };
}

module.exports = { construirRecordatorio, nombrePila, PLANES_URL };
