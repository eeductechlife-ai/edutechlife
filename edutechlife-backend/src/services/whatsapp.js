/**
 * Cliente de la API de WhatsApp Business (Meta Cloud API) para avisos a padres.
 *
 * Los mensajes que una empresa inicia solo pueden ser plantillas aprobadas por
 * Meta, así que aquí solo se envían plantillas con parámetros de texto. Nada se
 * envía si no están configurados el token y el número emisor (variables de
 * entorno) y la bandera WHATSAPP_ACTIVO=true: sin eso, este módulo no hace
 * ninguna llamada.
 *
 *   WHATSAPP_ACTIVO=true
 *   WHATSAPP_TOKEN=<token permanente del usuario del sistema>
 *   WHATSAPP_PHONE_NUMBER_ID=<id del número emisor>
 *   WHATSAPP_API_VERSION=v21.0            (opcional)
 *   WHATSAPP_TEMPLATE_CONEXION=aviso_conexion_hijo   (opcional)
 *   WHATSAPP_TEMPLATE_SEMANAL=informe_semanal_hijo   (opcional)
 *   WHATSAPP_TEMPLATE_VERIFICACION=verificacion_padre (opcional; categoría
 *     «autenticación»: Meta exige esa categoría para códigos y la plantilla
 *     lleva un botón «copiar código»)
 *
 * Nunca lanza excepciones y nunca escribe el número completo en los logs.
 */
const logger = require('../utils/logger');

const API_BASE = 'https://graph.facebook.com';
const TIEMPO_MAXIMO_MS = 10_000;
const LARGO_MAXIMO_PARAMETRO = 60;

function configuracion() {
  if (process.env.WHATSAPP_ACTIVO !== 'true') return null;
  const token = process.env.WHATSAPP_TOKEN;
  const numeroId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !numeroId) return null;
  return {
    token,
    numeroId,
    version: process.env.WHATSAPP_API_VERSION || 'v21.0',
  };
}

function whatsappConfigurado() {
  return configuracion() !== null;
}

function plantillas() {
  return {
    conexion: process.env.WHATSAPP_TEMPLATE_CONEXION || 'aviso_conexion_hijo',
    semanal: process.env.WHATSAPP_TEMPLATE_SEMANAL || 'informe_semanal_hijo',
    verificacion: process.env.WHATSAPP_TEMPLATE_VERIFICACION || 'verificacion_padre',
  };
}

/**
 * Meta rechaza parámetros con saltos de línea, tabuladores o más de cuatro
 * espacios seguidos, y no pueden ir vacíos.
 */
function limpiarParametro(valor) {
  const texto = String(valor ?? '')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/ {2,}/g, ' ')
    .trim()
    .slice(0, LARGO_MAXIMO_PARAMETRO);
  return texto || '-';
}

/** Solo los últimos 4 dígitos, para los logs. */
function numeroParaLog(telefono) {
  const digitos = String(telefono || '').replace(/\D/g, '');
  return digitos ? `***${digitos.slice(-4)}` : '***';
}

/**
 * Envía una plantilla de texto.
 * @param {{ para: string, plantilla: string, parametros: Array<string|number>, idioma?: string, parametroBoton?: string }} datos
 *   `para` en formato internacional con «+» (E.164). `parametroBoton` es el
 *   valor del botón de las plantillas de autenticación (el mismo código).
 * @returns {Promise<{ ok: boolean, id?: string, error?: string }>}
 */
async function enviarPlantilla({ para, plantilla, parametros = [], idioma = 'es', parametroBoton }) {
  const cfg = configuracion();
  if (!cfg) return { ok: false, error: 'no_configurado' };
  if (!/^\+[1-9]\d{7,14}$/.test(String(para || ''))) return { ok: false, error: 'telefono_invalido' };

  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), TIEMPO_MAXIMO_MS);
  try {
    const respuesta = await fetch(`${API_BASE}/${cfg.version}/${cfg.numeroId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cfg.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: para.slice(1),
        type: 'template',
        template: {
          name: plantilla,
          language: { code: idioma },
          components: [
            {
              type: 'body',
              parameters: parametros.map((p) => ({ type: 'text', text: limpiarParametro(p) })),
            },
            ...(parametroBoton != null
              ? [
                  {
                    type: 'button',
                    sub_type: 'url',
                    index: '0',
                    parameters: [{ type: 'text', text: limpiarParametro(parametroBoton) }],
                  },
                ]
              : []),
          ],
        },
      }),
      signal: controlador.signal,
    });

    const cuerpo = await respuesta.json().catch(() => ({}));
    if (!respuesta.ok) {
      const codigo = cuerpo?.error?.code;
      logger.warn('[whatsapp] Meta rechazó el mensaje', {
        estado: respuesta.status,
        codigo,
        para: numeroParaLog(para),
      });
      return { ok: false, error: `http_${respuesta.status}${codigo ? `_${codigo}` : ''}` };
    }
    return { ok: true, id: cuerpo?.messages?.[0]?.id };
  } catch (e) {
    const motivo = e?.name === 'AbortError' ? 'tiempo_agotado' : 'red';
    logger.warn('[whatsapp] no se pudo enviar', { motivo, para: numeroParaLog(para) });
    return { ok: false, error: motivo };
  } finally {
    clearTimeout(temporizador);
  }
}

module.exports = {
  whatsappConfigurado,
  enviarPlantilla,
  plantillas,
  limpiarParametro,
  numeroParaLog,
};
