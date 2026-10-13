/**
 * Remitente por defecto del servicio de correo (C-014).
 * La variable FROM_EMAIL ya está configurada en Render; este test fija el valor
 * de respaldo del código: alerts@edutechlife.co (dominio oficial).
 */

const emailPath = require.resolve('../../services/emailService');

describe('emailService: remitente por defecto', () => {
  const prev = { from: process.env.FROM_EMAIL, key: process.env.RESEND_API_KEY };
  let fetchOriginal;

  beforeEach(() => {
    delete process.env.FROM_EMAIL;
    process.env.RESEND_API_KEY = 're_test';
    fetchOriginal = global.fetch;
    global.fetch = vi.fn(async () => ({
      ok: true,
      json: async () => ({ id: 'msg_test' }),
    }));
    delete require.cache[emailPath];
  });

  afterEach(() => {
    global.fetch = fetchOriginal;
    if (prev.from === undefined) delete process.env.FROM_EMAIL;
    else process.env.FROM_EMAIL = prev.from;
    if (prev.key === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = prev.key;
    delete require.cache[emailPath];
  });

  it('usa alerts@edutechlife.co cuando FROM_EMAIL no está definido', async () => {
    const { sendEmail } = require('../../services/emailService');

    const result = await sendEmail('familia@ejemplo.co', 'Aviso', '<p>Hola</p>', 'Hola');

    expect(result.success).toBe(true);
    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body.from).toBe('alerts@edutechlife.co');
  });
});
