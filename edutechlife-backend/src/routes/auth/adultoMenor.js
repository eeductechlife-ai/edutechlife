const { Router } = require('express');
const { requireAuth } = require('../../middleware/auth');
const adultoObligatorio = require('../../services/adultoObligatorio');

const router = Router();

/**
 * POST /api/auth/adulto-menor/confirmar
 * El adulto (sesión iniciada con el correo invitado) confirma su vínculo con
 * el menor. Body: { token }.
 */
router.post('/adulto-menor/confirmar', requireAuth, async (req, res) => {
  if (!adultoObligatorio.estaActivo()) {
    return res.status(404).json({ error: 'No disponible' });
  }

  const { token } = req.body || {};
  try {
    const resultado = await adultoObligatorio.confirmarInvitacion({
      token,
      adultoId: req.userId,
      adultoEmail: req.userEmail,
    });
    if (!resultado.valida) {
      const mensajes = {
        invalido: 'El enlace no es válido',
        vencida: 'El enlace venció. Pide al menor que registre de nuevo su cuenta',
        usada: 'Este enlace ya fue usado',
        correo_no_coincide: 'Inicia sesión con el correo al que llegó la invitación',
      };
      return res.status(400).json({
        error: mensajes[resultado.motivo] || 'El enlace no es válido',
        motivo: resultado.motivo,
      });
    }
    return res.json({ vinculado: true });
  } catch (e) {
    console.error('[adulto-obligatorio] confirmar error:', e.message);
    return res.status(500).json({ error: 'No se pudo confirmar el vínculo' });
  }
});

module.exports = router;
