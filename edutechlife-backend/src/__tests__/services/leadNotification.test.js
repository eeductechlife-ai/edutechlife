/**
 * Aviso por correo de un lead nuevo (services/leadNotification.js).
 */

const emailPath = require.resolve('../../services/emailService');
const mockEmail = { sendEmail: vi.fn() };
delete require.cache[emailPath];
require.cache[emailPath] = { id: emailPath, filename: emailPath, loaded: true, exports: mockEmail };

const { notifyNewLead, construirAvisoLead } = require('../../services/leadNotification');

const lead = {
  nombre: 'Ana <b>Gómez</b>',
  email: 'ana@ejemplo.co',
  telefono: '+57 300 123 4567',
  perfil: 'padre',
  fuente: 'contacto_header',
  mensaje: '<script>alert(1)</script>',
  autorizacion_fecha: '2026-10-13T15:00:00.000Z',
};

describe('leadNotification', () => {
  const prev = { to: process.env.LEADS_NOTIFY_EMAIL, key: process.env.RESEND_API_KEY };

  beforeEach(() => {
    vi.clearAllMocks();
    mockEmail.sendEmail.mockResolvedValue({ success: true });
    process.env.LEADS_NOTIFY_EMAIL = 'ceo@edutechlife.co, ventas@edutechlife.co';
    process.env.RESEND_API_KEY = 're_test';
  });

  afterAll(() => {
    process.env.LEADS_NOTIFY_EMAIL = prev.to;
    process.env.RESEND_API_KEY = prev.key;
    if (prev.to === undefined) delete process.env.LEADS_NOTIFY_EMAIL;
    if (prev.key === undefined) delete process.env.RESEND_API_KEY;
  });

  test('escapa el HTML del lead y deja los datos personales fuera del asunto', () => {
    const { subject, html, text } = construirAvisoLead(lead);
    expect(subject).toBe('Nuevo lead (padre) desde contacto_header');
    expect(subject).not.toMatch(/Ana|ana@/);
    expect(html).toContain('Ana &lt;b&gt;Gómez&lt;/b&gt;');
    expect(html).not.toContain('<script>');
    expect(text).toContain('ana@ejemplo.co');
  });

  test('envía el aviso a cada correo de LEADS_NOTIFY_EMAIL', async () => {
    await notifyNewLead(lead);
    expect(mockEmail.sendEmail).toHaveBeenCalledTimes(1);
    const [to, subject] = mockEmail.sendEmail.mock.calls[0];
    expect(to).toEqual(['ceo@edutechlife.co', 'ventas@edutechlife.co']);
    expect(subject).toMatch(/Nuevo lead/);
  });

  test('sin destinatario o sin Resend no envía (ni imprime el lead en consola)', async () => {
    delete process.env.LEADS_NOTIFY_EMAIL;
    expect((await notifyNewLead(lead)).success).toBe(false);
    process.env.LEADS_NOTIFY_EMAIL = 'ceo@edutechlife.co';
    delete process.env.RESEND_API_KEY;
    expect((await notifyNewLead(lead)).success).toBe(false);
    expect(mockEmail.sendEmail).not.toHaveBeenCalled();
  });
});
