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

/**
 * GET /api/auth/adulto-menor/estado
 * Banner para estudiantes existentes sin adulto. Solo informa: no bloquea.
 */
router.get('/adulto-menor/estado', requireAuth, async (req, res) => {
  try {
    const mostrarAviso = await adultoObligatorio.avisoPendiente(req.userId);
    return res.json({ mostrarAviso });
  } catch (e) {
    console.error('[adulto-obligatorio] estado error:', e.message);
    return res.json({ mostrarAviso: false });
  }
});

/**
 * POST /api/auth/adulto-menor/invitar
 * El estudiante menor sin adulto registra a su padre, madre o acudiente.
 * Body: { adulto: { email, nombre, confirmaMayorDeEdad } }. Solo se envía
 * correo al adulto que el propio estudiante registra; nunca a menores.
 */
router.post('/adulto-menor/invitar', requireAuth, async (req, res) => {
  if (!adultoObligatorio.estaActivo()) {
    return res.status(404).json({ error: 'No disponible' });
  }
  const { adulto } = req.body || {};
  try {
    if (!(await adultoObligatorio.avisoPendiente(req.userId))) {
      return res.status(409).json({ error: 'Tu cuenta no necesita registrar un adulto' });
    }
    const datos = adultoObligatorio.validarAdulto({
      menor: true,
      correoEstudiante: req.userEmail,
      adulto,
    });
    await adultoObligatorio.marcarMenorConAdulto(req.userId);
    await adultoObligatorio.crearInvitacion({
      estudianteId: req.userId,
      correo: datos.correo,
      nombre: datos.nombre,
    });
    return res.status(201).json({ enviado: true });
  } catch (e) {
    if (e.status === 400) return res.status(400).json({ error: e.message });
    console.error('[adulto-obligatorio] invitar error:', e.message);
    return res.status(500).json({ error: 'No se pudo enviar la invitación' });
  }
});

module.exports = router;
