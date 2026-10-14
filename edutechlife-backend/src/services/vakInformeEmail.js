/**
 * Correo con el informe VAK en PDF (adjunto).
 * Asunto y cuerpo genéricos: sin nombre del niño ni del adulto, ni resultados en el texto.
 * El informe completo viaja solo como adjunto.
 */

const NOMBRE_ADJUNTO = 'informe-diagnostico.pdf';

function construirCorreoInforme() {
  return {
    subject: 'Informe de diagnóstico de aprendizaje de Edutechlife',
    html:
      '<div style="font-family:Arial,sans-serif;font-size:14px;color:#1E293B">' +
      '<p>Adjuntamos el informe en PDF que pediste desde edutechlife.co.</p>' +
      '<p style="color:#6B7280;font-size:12px">Es un documento personal: guárdalo con cuidado. ' +
      'Es un punto de partida para conocer el estilo de aprendizaje, no un examen ni un diagnóstico clínico.</p>' +
      '</div>',
    text:
      'Adjuntamos el informe en PDF que pediste desde edutechlife.co.\n\n' +
      'Es un documento personal: guárdalo con cuidado. ' +
      'Es un punto de partida para conocer el estilo de aprendizaje, no un examen ni un diagnóstico clínico.',
    attachments: [{ filename: NOMBRE_ADJUNTO }],
  };
}

module.exports = { construirCorreoInforme, NOMBRE_ADJUNTO };
