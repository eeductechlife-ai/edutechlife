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
    ].join('\n'),
    attachments: [{ filename: NOMBRE_ADJUNTO }],
  };
}

module.exports = { construirCorreoInforme, NOMBRE_ADJUNTO };
