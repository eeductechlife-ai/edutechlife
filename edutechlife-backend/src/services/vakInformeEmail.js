/**
 * Correo con el informe VAK en PDF (adjunto).
 * Asunto y cuerpo genéricos: sin nombre del niño ni del adulto, ni resultados en el texto.
 * El informe completo viaja solo como adjunto.
 */

const NOMBRE_ADJUNTO = 'informe-diagnostico.pdf';

const INTRO =
  'Gracias por hacer el diagnóstico de aprendizaje con tu hijo o hija. ' +
  'Te enviamos el informe en PDF adjunto. Ahí encontrarás el estilo de aprendizaje que más usa ' +
  'y el que le sigue, con ideas prácticas para acompañarlo en casa y en el estudio.';

const CONFIANZA =
  'Tu correo se usa solo para enviarte este informe y responder tus preguntas. ' +
  'Si no quieres recibir más comunicaciones, escríbenos y lo retiramos de nuestra lista.';

const NOTA =
  'Es un punto de partida para conocer cómo aprende, no un examen ni un diagnóstico clínico. ' +
  'Los estilos cambian con la edad y la práctica, así que combinar varias formas de aprender suele dar mejores resultados.';

const AYUDA =
  'Si el PDF no se abre en tu teléfono o computador, responde a este correo y te lo enviamos de nuevo.';

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

function bloqueContactoHtml() {
  const redes = CONTACTO.redes
    .map((r) => `<a href="${r.url}" style="color:#004B63">${r.nombre}</a>`)
    .join(' · ');
  return (
    '<div style="margin-top:20px;padding:14px 16px;border-radius:12px;background:#F0F9FC;border:1px solid #B2D8E5">' +
    '<p style="margin:0 0 6px;font-weight:bold;color:#004B63">Estamos para acompañarte</p>' +
    `<p style="margin:0 0 4px">WhatsApp: <a href="${CONTACTO.whatsappUrl}" style="color:#004B63">${CONTACTO.whatsapp}</a></p>` +
    `<p style="margin:0 0 4px">Correo: <a href="mailto:${CONTACTO.email}" style="color:#004B63">${CONTACTO.email}</a></p>` +
    `<p style="margin:0 0 4px">Web: <a href="${CONTACTO.sitio}" style="color:#004B63">edutechlife.co</a></p>` +
    `<p style="margin:0">Redes: ${redes}</p>` +
    '</div>'
  );
}

function bloqueContactoTexto() {
  const redes = CONTACTO.redes.map((r) => `${r.nombre}: ${r.url}`).join('\n');
  return [
    'Estamos para acompañarte',
    `WhatsApp: ${CONTACTO.whatsapp} (${CONTACTO.whatsappUrl})`,
    `Correo: ${CONTACTO.email}`,
    `Web: ${CONTACTO.sitio}`,
    'Redes:',
    redes,
  ].join('\n');
}

function construirCorreoInforme() {
  return {
    subject: 'Informe de diagnóstico de aprendizaje de Edutechlife',
    html:
      '<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#1E293B">' +
      '<p>Hola,</p>' +
      `<p>${INTRO}</p>` +
      `<p>${CONFIANZA}</p>` +
      `<p style="color:#6B7280;font-size:12px">${NOTA}</p>` +
      `<p>${AYUDA}</p>` +
      '<p style="margin-top:24px">Un abrazo,<br>El equipo de Edutechlife</p>' +
      bloqueContactoHtml() +
      '</div>',
    text: [
      'Hola,',
      '',
      INTRO,
      '',
      CONFIANZA,
      '',
      NOTA,
      '',
      AYUDA,
      '',
      'Un abrazo,',
      'El equipo de Edutechlife',
      '',
      bloqueContactoTexto(),
    ].join('\n'),
    attachments: [{ filename: NOMBRE_ADJUNTO }],
  };
}

module.exports = { construirCorreoInforme, NOMBRE_ADJUNTO };
