/**
 * Revisión del CEO antes de enviar una alerta de crisis al padre.
 * Se parchea supabase.from y los envíos de emailService (mismo patrón que auth.test.js).
 */

const emailService = require('../../services/emailService');
const supabase = require('../../db/supabase');

const enviarCorreo = vi.spyOn(emailService, 'sendEmail');
const enviarAlertaPadre = vi.spyOn(emailService, 'sendCrisisAlert');
const registrarIncidente = vi.spyOn(emailService, 'logCrisisIncident');

const { retenerAlertaCrisis, decidirAlertaCrisis, hashToken } = require('../../services/crisisReviewService');

const TOKEN = 'a'.repeat(64);
const FUTURO = new Date(Date.now() + 60 * 60 * 1000).toISOString();
const PASADO = new Date(Date.now() - 60 * 60 * 1000).toISOString();

const revision = (extra = {}) => ({
  id: 'rev-1',
  student_id: 'student-1',
  parent_email: 'padre@example.com',
  student_age: 12,
  detected_content: 'quiero morir',
  crisis_level: 'high',
  token_hash: hashToken(TOKEN),
  status: 'pending',
  expires_at: FUTURO,
  ...extra,
});

// Cada operación de Supabase consume la siguiente respuesta de la cola.
let respuestas;
let operaciones;
const stubSupabase = () => {
  supabase.from = (tabla) => {
    const obj = {
      insert: (datos) => { operaciones.push({ tabla, op: 'insert', datos }); return obj; },
      update: (datos) => { operaciones.push({ tabla, op: 'update', datos }); return obj; },
      select: () => obj,
      eq: () => obj,
      single: async () => respuestas.shift(),
      maybeSingle: async () => respuestas.shift(),
    };
    return obj;
  };
};

describe('crisisReviewService: revisión del CEO', () => {
  const fromOriginal = supabase.from;

  beforeEach(() => {
    respuestas = [];
    operaciones = [];
    stubSupabase();
    enviarCorreo.mockReset().mockResolvedValue({ success: true });
    enviarAlertaPadre.mockReset().mockResolvedValue({ success: true });
    registrarIncidente.mockReset().mockResolvedValue({ success: true });
    process.env.CEO_REVIEW_EMAIL = 'ceo@example.com';
  });

  afterEach(() => {
    supabase.from = fromOriginal;
    delete process.env.CEO_REVIEW_EMAIL;
  });

  describe('retenerAlertaCrisis', () => {
    it('guarda la alerta como pendiente y avisa solo al CEO, nunca al padre', async () => {
      respuestas.push({ data: { id: 'rev-1' }, error: null });

      const r = await retenerAlertaCrisis({
        studentId: 'student-1',
        parentEmail: 'padre@example.com',
        studentAge: 12,
        detectedContent: 'quiero morir',
        crisisLevel: 'high',
      });

      expect(r).toEqual({ success: true, id: 'rev-1', notificadoCEO: true });
      expect(operaciones[0]).toMatchObject({ tabla: 'crisis_alert_reviews', op: 'insert' });
      expect(operaciones[0].datos[0].status).toBe('pending');
      expect(enviarAlertaPadre).not.toHaveBeenCalled();
      expect(enviarCorreo).toHaveBeenCalledTimes(1);
      const [para, , html] = enviarCorreo.mock.calls[0];
      expect(para).toBe('ceo@example.com');
      expect(html).toContain('/api/crisis-reviews/decidir?token=');
      expect(html).toContain('accion=aprobar');
      expect(html).toContain('accion=rechazar');
    });

    it('sin CEO_REVIEW_EMAIL deja la alerta retenida y no envía nada', async () => {
      delete process.env.CEO_REVIEW_EMAIL;
      respuestas.push({ data: { id: 'rev-2' }, error: null });

      const r = await retenerAlertaCrisis({
        studentId: 'student-1',
        parentEmail: 'padre@example.com',
        studentAge: 12,
        detectedContent: 'quiero morir',
        crisisLevel: 'high',
      });

      expect(r.notificadoCEO).toBe(false);
      expect(enviarCorreo).not.toHaveBeenCalled();
      expect(enviarAlertaPadre).not.toHaveBeenCalled();
    });
  });

  describe('decidirAlertaCrisis', () => {
    it('rechazar no envía nada al padre', async () => {
      respuestas.push({ data: revision(), error: null }, { data: { id: 'rev-1' }, error: null });

      const r = await decidirAlertaCrisis(TOKEN, 'rechazar');

      expect(r).toEqual({ ok: true, estado: 'rejected' });
      expect(enviarAlertaPadre).not.toHaveBeenCalled();
      expect(registrarIncidente).not.toHaveBeenCalled();
    });

    it('aprobar envía la alerta al padre y registra el incidente', async () => {
      respuestas.push({ data: revision(), error: null }, { data: { id: 'rev-1' }, error: null });

      const r = await decidirAlertaCrisis(TOKEN, 'aprobar');

      expect(r).toEqual({ ok: true, estado: 'approved' });
      expect(enviarAlertaPadre).toHaveBeenCalledWith('padre@example.com', 'Estudiante', 12, 'quiero morir', 'high');
      expect(registrarIncidente).toHaveBeenCalledTimes(1);
    });

    it('aprobar con envío fallido lo informa sin ocultarlo', async () => {
      enviarAlertaPadre.mockResolvedValue({ success: false, error: 'boom' });
      respuestas.push({ data: revision(), error: null }, { data: { id: 'rev-1' }, error: null });

      const r = await decidirAlertaCrisis(TOKEN, 'aprobar');

      expect(r).toEqual({ ok: false, motivo: 'envio_fallido', estado: 'approved' });
    });

    it('un enlace ya usado no vuelve a enviar', async () => {
      respuestas.push({ data: revision({ status: 'approved' }), error: null });

      const r = await decidirAlertaCrisis(TOKEN, 'aprobar');

      expect(r).toEqual({ ok: false, motivo: 'ya_decidida' });
      expect(enviarAlertaPadre).not.toHaveBeenCalled();
    });

    it('si otra decisión llega primero (la actualización no reclama nada) no envía', async () => {
      respuestas.push({ data: revision(), error: null }, { data: null, error: null });

      const r = await decidirAlertaCrisis(TOKEN, 'aprobar');

      expect(r).toEqual({ ok: false, motivo: 'ya_decidida' });
      expect(enviarAlertaPadre).not.toHaveBeenCalled();
    });

    it('un enlace vencido no envía nada', async () => {
      respuestas.push({ data: revision({ expires_at: PASADO }), error: null });

      const r = await decidirAlertaCrisis(TOKEN, 'aprobar');

      expect(r).toEqual({ ok: false, motivo: 'vencida' });
      expect(enviarAlertaPadre).not.toHaveBeenCalled();
    });

    it('un token o una acción inválidos no consultan la base', async () => {
      expect(await decidirAlertaCrisis('', 'aprobar')).toEqual({ ok: false, motivo: 'invalido' });
      expect(await decidirAlertaCrisis(TOKEN, 'borrar')).toEqual({ ok: false, motivo: 'invalido' });
      expect(operaciones).toHaveLength(0);
    });
  });
});
