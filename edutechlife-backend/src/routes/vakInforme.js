/**
 * POST /api/vak/informe
 * Recibe el informe VAK en PDF (generado en el navegador) y lo envía como adjunto
 * al correo del adulto que lo pidió. Público: sin sesión.
 *
 * Límites: PDF de máximo 2 MB con cabecera %PDF-; 3 envíos por IP al día
 * (vakInformeIpLimiter) y 3 envíos por correo en 24 horas (cuenta en `leads`).
 * Cada envío queda como fila en `leads` con fuente `vak_informe`.
 *
 * Riesgo conocido: el servidor confía en el archivo subido. Solo se valida tamaño,
 * base64 y cabecera %PDF-; el contenido no se revisa a fondo. Ver nota en el PR.
 */

const { Router } = require('express');
const supabase = require('../db/supabase');
const { vakInformeIpLimiter } = require('../middleware/rateLimiter');
const { sendEmail } = require('../services/emailService');
const { construirCorreoInforme, NOMBRE_ADJUNTO } = require('../services/vakInformeEmail');
const logger = require('../utils/logger');

const router = Router();

const PERFILES_ADULTOS = ['padre', 'docente', 'colegio', 'empresa', 'otro'];
const MAX_PDF_BYTES = 2 * 1024 * 1024;
const MIN_PDF_BYTES = 2048;
const MAX_ENVIOS_POR_CORREO_DIA = 3;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const BASE64_RE = /^[A-Za-z0-9+/]+={0,2}$/;
const texto = (v, max) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null);

function validarInforme(body) {
  const b = body && typeof body === 'object' ? body : {};
  if (b.autorizacion_datos !== true) {
    return { status: 400, error: 'Debes autorizar el tratamiento de tus datos personales para enviarte el informe.' };
  }
  const nombre = texto(b.nombre, 120);
  if (!nombre || nombre.length < 2) {
    return { status: 400, error: 'Escribe tu nombre (entre 2 y 120 caracteres).' };
  }
  const email = texto(b.email, 254)?.toLowerCase() || null;
  if (!email || !EMAIL_RE.test(email)) {
    return { status: 400, error: 'Escribe un correo electrónico válido.' };
  }
  if (!PERFILES_ADULTOS.includes(b.perfil)) {
    return { status: 400, error: 'El informe se envía a una persona adulta: elige tu perfil.' };
  }

  // Tamaño antes de decodificar: base64 ocupa 4/3 del tamaño real.
  const pdfB64 = typeof b.pdf_base64 === 'string' ? b.pdf_base64 : '';
  if (!pdfB64) {
    return { status: 400, error: 'Falta el informe en PDF.' };
  }
  if (pdfB64.length > Math.ceil(MAX_PDF_BYTES / 3) * 4) {
    return { status: 413, error: 'El informe pesa más de 2 MB. Intenta de nuevo o escríbenos por WhatsApp.' };
  }
  if (!BASE64_RE.test(pdfB64) || pdfB64.length % 4 !== 0) {
    return { status: 400, error: 'El archivo no es un PDF válido.' };
  }
  const pdf = Buffer.from(pdfB64, 'base64');
  if (pdf.length > MAX_PDF_BYTES) {
    return { status: 413, error: 'El informe pesa más de 2 MB. Intenta de nuevo o escríbenos por WhatsApp.' };
  }
  if (pdf.subarray(0, 5).toString('latin1') !== '%PDF-') {
    return { status: 400, error: 'El archivo no es un PDF válido.' };
  }
  // Una hoja sin contenido pesa unos pocos bytes: no se envía un informe vacío.
  if (pdf.length < MIN_PDF_BYTES) {
    return { status: 400, error: 'El informe llegó vacío. Abre la vista previa y vuelve a intentarlo.' };
  }

  // Nombre del estudiante: opcional, solo para el texto del correo (no se guarda).
  const nombreEstudiante = texto(b.nombre_estudiante, 60);
  return { datos: { nombre, email, perfil: b.perfil, pdfB64, nombreEstudiante } };
}

router.post('/', vakInformeIpLimiter, async (req, res) => {
  // Campo trampa: oculto para las personas; los bots lo llenan.
  if (texto(req.body?.sitio_web, 200)) {
    logger.warn('[vak-informe] campo trampa lleno: envío descartado');
    return res.status(201).json({ ok: true });
  }

  const { datos, status, error } = validarInforme(req.body);
  if (error) return res.status(status).json({ error });

  const desde = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count, error: countError } = await supabase
    .from('leads')
    .select('id', { count: 'exact', head: true })
    .eq('email', datos.email)
    .eq('fuente', 'vak_informe')
    .gte('created_at', desde);
  if (countError) {
    logger.error('[vak-informe] no se pudo contar los envíos', { code: countError.code });
    return res.status(500).json({ error: 'No pudimos enviar el informe. Intenta de nuevo en unos minutos.' });
  }
  if ((count || 0) >= MAX_ENVIOS_POR_CORREO_DIA) {
    return res.status(429).json({
      error: 'Ya enviamos el informe a este correo 3 veces hoy. Intenta mañana o escríbenos por WhatsApp.',
    });
  }

  const { error: dbError } = await supabase.from('leads').insert({
    nombre: datos.nombre,
    email: datos.email,
    perfil: datos.perfil,
    producto_interes: 'diagnostico-vak',
    mensaje: 'Informe VAK en PDF enviado por correo',
    fuente: 'vak_informe',
    pagina: '/vak',
    autorizacion_datos: true,
    autorizacion_fecha: new Date().toISOString(),
  });
  if (dbError) {
    logger.error('[vak-informe] no se pudo guardar el envío', { code: dbError.code });
    return res.status(500).json({ error: 'No pudimos enviar el informe. Intenta de nuevo en unos minutos.' });
  }

  const correo = construirCorreoInforme({ nombreEstudiante: datos.nombreEstudiante });
  const envio = await sendEmail(
    datos.email,
    correo.subject,
    correo.html,
    correo.text,
    [{ filename: NOMBRE_ADJUNTO, content: datos.pdfB64 }],
  );
  if (!envio.success) {
    logger.error('[vak-informe] falló el correo', { motivo: envio.error });
    return res.status(502).json({
      error: 'No pudimos enviar el correo con el informe. Revisa la dirección e intenta de nuevo en unos minutos.',
    });
  }
  return res.status(201).json({ ok: true });
});

module.exports = router;
