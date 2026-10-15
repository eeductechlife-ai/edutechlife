// Correo que lleva el enlace de cobro de Wompi después de la valoración gratuita.
// Tres idiomas en el mismo correo: español, inglés y portugués.

const IDIOMAS = [
  {
    texto: 'Tu valoración terminó. Para activar tu plan, paga aquí:',
    boton: 'Pagar aquí',
  },
  {
    texto: 'Your assessment is complete. To activate your plan, pay here:',
    boton: 'Pay here',
  },
  {
    texto: 'Sua avaliação terminou. Para ativar seu plano, pague aqui:',
    boton: 'Pague aqui',
  },
];

const ASUNTO = 'Tu valoración terminó · Your assessment is complete · Sua avaliação terminou';

function escapeHtml(valor) {
  return String(valor)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * @param {string} url enlace de Web Checkout de Wompi
 * @returns {{ subject: string, html: string, text: string }}
 */
function buildCobroEmail(url) {
  const enlace = escapeHtml(url);

  const bloquesHtml = IDIOMAS.map(
    ({ texto, boton }) =>
      `<p style="margin:0 0 8px">${escapeHtml(texto)}</p>` +
      `<p style="margin:0 0 24px"><a href="${enlace}" style="display:inline-block;padding:12px 20px;background:#199DB9;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:bold">${escapeHtml(boton)}</a></p>`,
  ).join('');

  const html =
    '<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#072F46">' +
    bloquesHtml +
    '</div>';

  const text = IDIOMAS.map(({ texto }) => `${texto} ${url}`).join('\n\n');

  return { subject: ASUNTO, html, text };
}

module.exports = { buildCobroEmail };
