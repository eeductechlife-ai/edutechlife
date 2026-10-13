/**
 * POST /api/leads
 * Recibe los leads de los formularios públicos del sitio, los guarda en la
 * tabla `leads` (migración 100, con la service role) y avisa por correo.
 * Público: sin sesión. Protegido con rate limit por IP y un campo trampa.
 */

const { Router } = require('express');
const supabase = require('../db/supabase');
const { leadLimiter } = require('../middleware/rateLimiter');
const { notifyNewLead } = require('../services/leadNotification');
const logger = require('../utils/logger');

const router = Router();

const FUENTES = ['contacto_header', 'contacto_footer', 'metodo', 'automatizacion', 'demo_movil', 'nico'];
const PERFILES = ['padre', 'docente', 'colegio', 'empresa', 'estudiante', 'otro'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[0-9+()\-.\s]{7,30}$/;
const texto = (v, max) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null);

function validarLead(body) {
  const b = body && typeof body === 'object' ? body : {};
  if (b.autorizacion_datos !== true) {
    return { error: 'Debes autorizar el tratamiento de tus datos personales para que podamos contactarte.' };
  }
  const nombre = texto(b.nombre, 200);
  if (!nombre || nombre.length < 2 || nombre.length > 120) {
    return { error: 'Escribe tu nombre (entre 2 y 120 caracteres).' };
  }
  const email = texto(b.email, 300)?.toLowerCase();
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return { error: 'Escribe un correo electrónico válido.' };
  }
  const telefono = texto(b.telefono, 60);
  if (telefono && !PHONE_RE.test(telefono)) {
    return { error: 'Escribe un teléfono válido: solo números, espacios y +.' };
  }
  if (!FUENTES.includes(b.fuente)) {
    return { error: 'Formulario de origen no reconocido.' };
  }
  return {
    lead: {
      nombre,
      email,
      telefono,
      ciudad: texto(b.ciudad, 80),
      perfil: PERFILES.includes(b.perfil) ? b.perfil : 'otro',
      producto_interes: texto(b.producto_interes, 80),
      mensaje: texto(b.mensaje, 2000),
      fuente: b.fuente,
      pagina: texto(b.pagina, 500),
      utm_source: texto(b.utm_source, 150),
      utm_medium: texto(b.utm_medium, 150),
      utm_campaign: texto(b.utm_campaign, 150),
      referrer: texto(b.referrer, 500),
      autorizacion_datos: true,
      autorizacion_fecha: new Date().toISOString(),
    },
  };
}

router.post('/', leadLimiter, async (req, res) => {
  // Campo trampa: oculto para las personas; los bots lo llenan.
  if (texto(req.body?.sitio_web, 200)) {
    logger.warn('[leads] campo trampa lleno: envío descartado');
    return res.status(201).json({ ok: true });
  }

  const { lead, error } = validarLead(req.body);
  if (error) return res.status(400).json({ error });

  const { error: dbError } = await supabase.from('leads').insert(lead);
  if (dbError) {
    logger.error('[leads] no se pudo guardar el lead', { code: dbError.code, fuente: lead.fuente });
    return res
      .status(500)
      .json({ error: 'No pudimos guardar tus datos. Intenta de nuevo en unos minutos.' });
  }

  // El lead ya quedó guardado: si el correo falla, solo se registra.
  notifyNewLead(lead).catch((err) =>
    logger.error('[leads] falló el aviso por correo', { message: err.message })
  );
  return res.status(201).json({ ok: true });
});

module.exports = router;
