/**
 * Sin RESEND_API_KEY, sendEmail funciona en modo consola. Ese modo no debe
 * imprimir el HTML: los correos de cobro llevan el enlace de pago de Wompi.
 */

const emailPath = require.resolve('../../services/emailService');

describe('emailService: modo consola sin volcar el HTML', () => {
  const previa = process.env.RESEND_API_KEY;

  beforeEach(() => {
    delete process.env.RESEND_API_KEY;
    delete require.cache[emailPath];
  });

  afterEach(() => {
    if (previa === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = previa;
    delete require.cache[emailPath];
    vi.restoreAllMocks();
  });

  it('no escribe el cuerpo del correo (ni su enlace) en los logs', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { sendEmail } = require('../../services/emailService');
    const html = '<a href="https://checkout.wompi.co/p/?signature:integrity=abc123">Pagar aquí</a>';

    const resultado = await sendEmail('familia@ejemplo.co', 'Tu valoración terminó', html, 'texto');

    expect(resultado.success).toBe(true);
    const salida = log.mock.calls.flat().map(String).join('\n');
    expect(salida).not.toContain('checkout.wompi.co');
    expect(salida).not.toContain('signature:integrity');
  });
});
