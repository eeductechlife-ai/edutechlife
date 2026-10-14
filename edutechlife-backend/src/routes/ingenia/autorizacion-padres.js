const { Router } = require('express');
const { requireAuth } = require('../../middleware/auth');
const { parentalInviteLimiter } = require('../../middleware/rateLimiter');
const autorizacion = require('../../services/autorizacionPadres');

const router = Router();

// Estado del estudiante conectado (lo usa el frontend para mostrar la pantalla de espera).
router.get('/authorization/status', requireAuth, async (req, res) => {
  try {
    const estado = await autorizacion.estadoAutorizacion(req.userId);
    res.json({
      activo: estado.activo,
      requerida: estado.requerida,
      restringido: estado.restringido,
      estado: estado.estado,
    });
  } catch (e) {
    console.error('Error consultando autorización de padres:', e.message);
    res.status(500).json({ error: 'Error al consultar la autorización' });
  }
});

// El estudiante pide que su padre/madre autorice (envía el correo).
router.post('/authorization/request', requireAuth, parentalInviteLimiter, async (req, res) => {
  try {
    res.json(await autorizacion.solicitarAutorizacion(req.userId));
  } catch (e) {
    console.error('Error solicitando autorización de padres:', e.message);
    res.status(500).json({ error: 'No pudimos enviar la solicitud. Intenta de nuevo.' });
  }
});

// Página del enlace del correo: valida el token sin consumirlo.
router.get('/authorization/preview', async (req, res) => {
  try {
    const { valida, motivo } = await autorizacion.buscarSolicitud(req.query?.token);
    res.json({
      valida,
      motivo: motivo || null,
      versionPolitica: autorizacion.POLITICA_VERSION,
    });
  } catch (e) {
    console.error('Error validando enlace de autorización:', e.message);
    res.status(500).json({ error: 'Error al validar el enlace' });
  }
});

// El adulto confirma: lee política y términos, acepta el tratamiento de datos del menor.
router.post('/authorization/confirm', parentalInviteLimiter, async (req, res) => {
  const { token, versionPolitica, aceptaPolitica, aceptaTerminos, autorizaTratamiento } = req.body || {};

  if (aceptaPolitica !== true || aceptaTerminos !== true || autorizaTratamiento !== true) {
    return res.status(400).json({
      error: 'Debes leer y aceptar la política de datos, los términos y la autorización de tratamiento de datos del menor.',
    });
  }

  try {
    const resultado = await autorizacion.confirmarAutorizacion({
      token,
      versionPolitica,
      ip: req.ip,
    });
    if (!resultado.valida) {
      return res.status(409).json({
        error: 'Este enlace ya no es válido. Pide a tu hijo o hija que envíe una nueva solicitud.',
        motivo: resultado.motivo,
      });
    }
    res.json({ estado: resultado.estado, versionPolitica: autorizacion.POLITICA_VERSION });
  } catch (e) {
    console.error('Error confirmando autorización de padres:', e.message);
    res.status(500).json({ error: 'No pudimos registrar la autorización. Intenta de nuevo.' });
  }
});

// El padre/madre revoca desde su panel. El estudiante vuelve a quedar limitado.
router.post('/authorization/revoke', requireAuth, async (req, res) => {
  const { estudianteId } = req.body || {};
  if (typeof estudianteId !== 'string' || estudianteId.length === 0) {
    return res.status(400).json({ error: 'estudianteId es requerido' });
  }

  try {
    const { revocadas } = await autorizacion.revocarAutorizacion({
      adultoId: req.userId,
      estudianteId,
    });
    if (revocadas === 0) {
      return res.status(404).json({ error: 'No hay una autorización activa para ese estudiante' });
    }
    res.json({ estado: 'revocada' });
  } catch (e) {
    console.error('Error revocando autorización de padres:', e.message);
    res.status(500).json({ error: 'No pudimos revocar la autorización' });
  }
});

module.exports = router;
