const { Router } = require('express');
const { requireAuth } = require('../../middleware/auth');
const adultoObligatorio = require('../../services/adultoObligatorio');
const activacion = require('../../services/activacionAdulto');
const registroAdulto = require('../../services/registroAdulto');
const { authLimiter } = require('../../middleware/rateLimiter');
const logger = require('../../utils/logger');

const router = Router();

/**
 * POST /api/auth/adulto-menor/confirmar
 * El adulto (sesión iniciada con el correo invitado) confirma su vínculo con
 * el menor y acepta el texto de autorización (Ley 1581). La primera
 * confirmación activa la cuenta del niño para siempre.
 * Body: { token, aceptaAutorizacion: true, versionAutorizacion }.
 */
router.post('/adulto-menor/confirmar', requireAuth, async (req, res) => {
  if (!adultoObligatorio.estaActivo()) {
    return res.status(404).json({ error: 'No disponible' });
  }

  const { token, aceptaAutorizacion, versionAutorizacion } = req.body || {};
  if (aceptaAutorizacion !== true || !activacion.versionValida(versionAutorizacion)) {
    return res.status(400).json({
      error: 'Para activar la cuenta debes aceptar la autorización de tratamiento de datos del menor',
      motivo: 'falta_autorizacion',
    });
  }
  try {
    const resultado = await adultoObligatorio.confirmarInvitacion({
      token,
      adultoId: req.userId,
      adultoEmail: req.userEmail,
    });
    if (!resultado.valida) {
      const mensajes = {
        invalido: 'El enlace no es válido',
        vencida: 'El enlace venció. Pide al menor que te reenvíe la invitación desde su cuenta',
        usada: 'Este enlace ya fue usado',
        correo_no_coincide: 'Inicia sesión con el correo al que llegó la invitación',
      };
      return res.status(400).json({
        error: mensajes[resultado.motivo] || 'El enlace no es válido',
        motivo: resultado.motivo,
      });
    }
    // Si la fila de evidencia falla, el vínculo activo ya creado hace que el
    // middleware cuente al niño como activado y vuelva a registrarlo.
    let activado = true;
    try {
      await activacion.registrarActivacion({
        estudianteId: resultado.estudianteId,
        adultoId: req.userId,
        adultoEmail: resultado.adultoEmail,
        metodo: 'invitacion',
        versionAutorizacion,
        invitacionId: resultado.invitacionId,
      });
    } catch (e) {
      activado = false;
      logger.error('[adulto-obligatorio] no se pudo registrar la activación:', e.message);
    }
    return res.json({ vinculado: true, activado });
  } catch (e) {
    logger.error('[adulto-obligatorio] confirmar error:', e.message);
    return res.status(500).json({ error: 'No se pudo confirmar el vínculo' });
  }
});

/** true si el estudiante aún necesita que un adulto active su cuenta. */
async function requiereAdulto(req) {
  if (!adultoObligatorio.estaActivo()) return false;
  if (activacion.activadoEnSesion(req.userAppMetadata)) return false;
  const estado = await activacion.estadoActivacion(req.userId);
  return estado.requiereAdulto;
}

/**
 * GET /api/auth/adulto-menor/estado
 * ¿Mostrar el aviso de modo restringido? Mismo criterio que el middleware
 * requireAdultoActivado (mostrarAviso = las herramientas de IA responden 403).
 */
router.get('/adulto-menor/estado', requireAuth, async (req, res) => {
  try {
    const mostrarAviso = await requiereAdulto(req);
    if (!mostrarAviso) return res.json({ mostrarAviso });
    // Si el resumen falla se muestra igual el aviso (con el formulario).
    const resumen = await registroAdulto
      .resumenInvitacion(req.userId)
      .catch(() => ({ invitacionPendiente: false, correoAdulto: null }));
    return res.json({ mostrarAviso, ...resumen });
  } catch (e) {
    logger.error('[adulto-obligatorio] estado error:', e.message);
    return res.json({ mostrarAviso: false });
  }
});

/**
 * POST /api/auth/adulto-menor/invitar
 * El estudiante menor sin adulto registra a su padre, madre o acudiente.
 * Body: { edad, adulto: { email, nombre, confirmaMayorDeEdad } }. La edad es la
 * real del estudiante (6 a 16); reemplaza el valor antiguo de students.age.
 * Solo se envía correo al adulto que el propio estudiante registra; nunca a menores.
 */
router.post('/adulto-menor/invitar', requireAuth, async (req, res) => {
  if (!adultoObligatorio.estaActivo()) {
    return res.status(404).json({ error: 'No disponible' });
  }
  const { adulto, edad } = req.body || {};
  try {
    if (!(await requiereAdulto(req))) {
      return res.status(409).json({ error: 'Tu cuenta no necesita registrar un adulto' });
    }
    const edadReal = adultoObligatorio.validarEdadIngenia(edad);
    const datos = adultoObligatorio.validarAdulto({
      menor: true,
      correoEstudiante: req.userEmail,
      adulto,
    });
    await adultoObligatorio.actualizarEdadEstudiante(req.userId, edadReal);
    await adultoObligatorio.marcarMenorConAdulto(req.userId);
    await adultoObligatorio.crearInvitacion({
      estudianteId: req.userId,
      correo: datos.correo,
      nombre: datos.nombre,
    });
    return res.status(201).json({ enviado: true });
  } catch (e) {
    if (e.status === 400) return res.status(400).json({ error: e.message });
    logger.error('[adulto-obligatorio] invitar error:', e.message);
    return res.status(500).json({ error: 'No se pudo enviar la invitación' });
  }
});

/** Respuesta para errores con código de registroAdulto. */
function responderError(res, e, mensaje500) {
  if (e.status && e.status < 500) {
    const cuerpo = { error: e.message, code: e.code };
    if (e.motivo) cuerpo.motivo = e.motivo;
    return res.status(e.status).json(cuerpo);
  }
  logger.error(`[adulto-obligatorio] ${mensaje500}:`, e.message);
  return res.status(500).json({ error: mensaje500 });
}

/**
 * POST /api/auth/adulto-menor/reenviar
 * El niño en modo restringido reenvía la invitación al mismo adulto de antes
 * (nuevo enlace de 72 h; el anterior deja de servir). Máximo uno cada 2 min.
 */
router.post('/adulto-menor/reenviar', requireAuth, async (req, res) => {
  if (!adultoObligatorio.estaActivo()) {
    return res.status(404).json({ error: 'No disponible' });
  }
  try {
    if (!(await requiereAdulto(req))) {
      return res.status(409).json({ error: 'Tu cuenta ya está activada' });
    }
    const resultado = await registroAdulto.reenviarInvitacion(req.userId);
    return res.status(201).json({ enviado: true, ...resultado });
  } catch (e) {
    return responderError(res, e, 'No se pudo reenviar la invitación');
  }
});

/**
 * GET /api/auth/adulto-menor/invitacion?token=
 * Datos para la página del adulto (sin consumir el enlace).
 */
router.get('/adulto-menor/invitacion', async (req, res) => {
  if (!adultoObligatorio.estaActivo()) {
    return res.status(404).json({ error: 'No disponible' });
  }
  try {
    const lectura = await registroAdulto.leerInvitacion(req.query.token);
    if (!lectura.valida) return res.json({ valida: false, motivo: lectura.motivo });
    return res.json({
      valida: true,
      correoAdulto: registroAdulto.enmascararCorreo(lectura.invitacion.adulto_email),
      nombreAdulto: lectura.invitacion.adulto_nombre,
    });
  } catch (e) {
    return responderError(res, e, 'No se pudo leer la invitación');
  }
});

/**
 * POST /api/auth/adulto-menor/registrar
 * El adulto SIN cuenta crea su cuenta de padre con el correo invitado, acepta
 * la autorización y activa la cuenta del niño. Devuelve la sesión del padre.
 * Body: { token, nombre, password, aceptaAutorizacion, versionAutorizacion }.
 */
router.post('/adulto-menor/registrar', authLimiter, async (req, res) => {
  if (!adultoObligatorio.estaActivo()) {
    return res.status(404).json({ error: 'No disponible' });
  }
  try {
    const resultado = await registroAdulto.registrarPadreDesdeInvitacion(req.body || {});
    return res.status(201).json(resultado);
  } catch (e) {
    return responderError(res, e, 'No se pudo crear la cuenta');
  }
});

module.exports = router;
