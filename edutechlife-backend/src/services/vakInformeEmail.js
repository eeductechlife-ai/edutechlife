/**
 * Correo con el informe VAK en PDF (adjunto).
 * Asunto y cuerpo genéricos: sin nombre del niño ni del adulto, ni resultados en el texto.
 * El informe completo viaja solo como adjunto.
 */

const NOMBRE_ADJUNTO = 'informe-diagnostico.pdf';

// Logo en PNG: los clientes de correo no siempre muestran WebP.
const LOGO_URL = 'https://www.edutechlife.co/images/logo-edutechlife-email.png';

// Datos públicos verificados en el sitio (ContactModal, Footer).
const CONTACTO = {
  email: 'contacto@edutechlife.co',
  whatsapp: '+57 323 836 5517',
  whatsappUrl: 'https://wa.me/573238365517',
  sitio: 'https://edutechlife.co',
  redes: [
    { nombre: 'Facebook', url: 'https://web.facebook.com/eductechlife/' },
    { nombre: 'Instagram', url: 'https://www.instagram.com/edu_techlife/' },
    { nombre: 'LinkedIn', url: 'https://www.linkedin.com/company/edutechlife' },
    { nombre: 'YouTube', url: 'https://www.youtube.com/@edutechlife' },
  ],
};

// Texto en la voz de Valeria, la guía de aprendizaje. Tono cálido y cercano.
const SALUDO = 'Hola, qué alegría que hayas hecho este recorrido con tu hijo o hija.';

const ENTIDADES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '`': '&#96;' };
const escapar = (t) => t.replace(/[&<>"'`]/g, (c) => ENTIDADES[c]);

function saludoPara(nombreEstudiante, escaparHtml) {
  if (!nombreEstudiante) return SALUDO;
  const nombre = escaparHtml ? escapar(nombreEstudiante) : nombreEstudiante;
  return `Hola, qué alegría que ${nombre} haya hecho este recorrido.`;
}

const PRESENTACION =
  'Soy Valeria, la guía de aprendizaje de Edutechlife. Ya preparé el informe de hoy y lo encuentras en el PDF adjunto.';

const QUE_ENCONTRARAS = [
  'La mezcla con la que hoy aprende mejor, y cómo se combina con las otras formas.',
  'Trucos sencillos para estudiar que puede practicar en casa.',
  'Ideas para acompañarlo sin presionarlo, con cosas que puedes hacer hoy mismo.',
];

const LECTURA =
  'Te pido que lo leas con calma: es una fotografía de cómo aprende hoy, no una etiqueta. ' +
  'Puede cambiar con los meses y según la materia. No reemplaza la mirada de su docente ni la de un especialista.';

const AYUDA =
  'Si algo no se ve bien o tienes una pregunta, escríbenos a contacto@edutechlife.co o por WhatsApp. Con gusto te ayudamos.';

const PRIVACIDAD =
  'Tu correo se usa solo para enviarte este informe y responder tus preguntas. ' +
  'Si no quieres recibir más comunicaciones, escríbenos y te retiramos de nuestra lista.';

const FIRMA = ['Con cariño,', 'Valeria', 'Guía de aprendizaje · Edutechlife'];

const ESTILO = {
  fuente: "font-family:Inter,Arial,Helvetica,sans-serif",
  texto: 'font-size:15px;line-height:1.7;color:#1E293B;margin:0 0 14px;font-family:Inter,Arial,Helvetica,sans-serif',
  pequeno: 'font-size:12px;line-height:1.6;color:#64748B;margin:0',
  boton:
    'display:inline-block;padding:12px 22px;border-radius:999px;background:#199DB9;color:#FFFFFF;' +
    'font-weight:700;font-size:14px;text-decoration:none;font-family:Montserrat,Arial,sans-serif',
};

function listaHtml(items) {
  const lis = items
    .map(
      (i) =>
        `<tr><td style="vertical-align:top;padding:0 10px 10px 0;color:#199DB9;font-size:16px">&#10022;</td>` +
        `<td style="${ESTILO.texto};padding:0 0 10px">${i}</td></tr>`,
    )
    .join('');
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:6px 0 10px">${lis}</table>`;
}

function redesHtml() {
  return CONTACTO.redes
    .map((r) => `<a href="${r.url}" style="color:#072F46;text-decoration:none">${r.nombre}</a>`)
    .join('&nbsp;&nbsp;·&nbsp;&nbsp;');
}

function construirHtml(saludo) {
  return (
    // Fuentes de marca; los clientes que no las cargan usan Arial.
    '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Montserrat:wght@600;700&display=swap" rel="stylesheet">' +
    `<div style="${ESTILO.fuente};background:#F1F7F9;padding:24px 12px">` +
    '<div style="max-width:560px;margin:0 auto;background:#FFFFFF;border-radius:18px;overflow:hidden;' +
    'box-shadow:0 2px 12px rgba(0,75,99,0.08)">' +
    // Cabecera con logo
    '<div style="background:#072F46;padding:26px 28px;text-align:center">' +
    `<img src="${LOGO_URL}" alt="Edutechlife" width="220" style="display:block;margin:0 auto;width:220px;height:auto;border:0">` +
    '<p style="margin:12px 0 0;color:#199DB9;font-size:12px;font-family:Montserrat,Arial,sans-serif;font-weight:600;letter-spacing:2px;text-transform:uppercase">ADN de Aprendizaje</p>' +
    '</div>' +
    // Cuerpo
    '<div style="padding:30px 30px 8px">' +
    `<p style="${ESTILO.texto};font-size:18px;font-weight:700;color:#072F46;font-family:Montserrat,Arial,sans-serif">${saludo}</p>` +
    `<p style="${ESTILO.texto}">${PRESENTACION}</p>` +
    `<p style="${ESTILO.texto};margin-bottom:4px">En el informe vas a encontrar:</p>` +
    listaHtml(QUE_ENCONTRARAS) +
    `<p style="${ESTILO.texto}">${LECTURA}</p>` +
    `<p style="${ESTILO.texto}">${AYUDA}</p>` +
    `<p style="margin:22px 0 26px;text-align:center"><a href="${CONTACTO.whatsappUrl}" style="${ESTILO.boton}">Escribirme por WhatsApp</a></p>` +
    `<p style="${ESTILO.texto};margin-bottom:2px">${FIRMA[0]}</p>` +
    `<p style="${ESTILO.texto};margin:0;font-weight:700;color:#072F46;font-family:Montserrat,Arial,sans-serif">${FIRMA[1]}</p>` +
    `<p style="${ESTILO.pequeno};margin-bottom:24px">${FIRMA[2]}</p>` +
    '</div>' +
    // Pie de contacto
    '<div style="background:#F0F9FC;border-top:1px solid #DDEEF4;padding:20px 28px;text-align:center">' +
    `<p style="${ESTILO.pequeno};color:#072F46;margin-bottom:8px;font-weight:700;font-family:Montserrat,Arial,sans-serif">Estamos para acompañarte</p>` +
    `<p style="${ESTILO.pequeno};margin-bottom:6px">WhatsApp: <a href="${CONTACTO.whatsappUrl}" style="color:#072F46">${CONTACTO.whatsapp}</a>` +
    ` &nbsp;·&nbsp; <a href="mailto:${CONTACTO.email}" style="color:#072F46">${CONTACTO.email}</a></p>` +
    `<p style="${ESTILO.pequeno};margin-bottom:12px"><a href="${CONTACTO.sitio}" style="color:#072F46">edutechlife.co</a></p>` +
    `<p style="${ESTILO.pequeno};margin-bottom:14px">${redesHtml()}</p>` +
    `<p style="${ESTILO.pequeno};font-size:11px">${PRIVACIDAD}</p>` +
    `<p style="${ESTILO.pequeno};font-size:11px;margin-top:8px">Ley 1581 de 2012 · Habeas Data · edutechlife.co</p>` +
    '</div>' +
    '</div>' +
    '</div>'
  );
}

function construirTexto(saludo) {
  return [
    saludo,
    '',
    PRESENTACION,
    '',
    'En el informe vas a encontrar:',
    ...QUE_ENCONTRARAS.map((i) => `  - ${i}`),
    '',
    LECTURA,
    '',
    AYUDA,
    '',
    `Escribirme por WhatsApp: ${CONTACTO.whatsappUrl}`,
    '',
    ...FIRMA,
    '',
    '--',
    'Estamos para acompañarte',
    `WhatsApp: ${CONTACTO.whatsapp}`,
    `Correo: ${CONTACTO.email}`,
    `Web: ${CONTACTO.sitio}`,
    `Redes: ${CONTACTO.redes.map((r) => `${r.nombre} ${r.url}`).join(' | ')}`,
    '',
    PRIVACIDAD,
    'Ley 1581 de 2012 · Habeas Data · edutechlife.co',
  ].join('\n');
}

function construirCorreoInforme({ nombreEstudiante = "" } = {}) {
  return {
    subject: 'Informe de diagnóstico de aprendizaje de Edutechlife',
    html: construirHtml(saludoPara(nombreEstudiante, true)),
    text: construirTexto(saludoPara(nombreEstudiante, false)),
    attachments: [{ filename: NOMBRE_ADJUNTO }],
  };
}

module.exports = { construirCorreoInforme, NOMBRE_ADJUNTO };
