/**
 * El servicio de correo no escribe el destinatario en los logs (re-auditoría
 * S11). En modo de respaldo (sin RESEND_API_KEY) el envío se simula y solo se
 * registra que se enviaría, con el correo ya oculto.
 */
describe('emailService: logs sin datos personales', () => {
  let sendEmail;
  let lineas;
  let espias;

  beforeEach(() => {
    delete process.env.RESEND_API_KEY;
    vi.resetModules();
    lineas = [];
    espias = ['log', 'warn', 'error'].map((m) =>
      vi.spyOn(console, m).mockImplementation((...a) => lineas.push(a.map(String).join(' '))),
    );
    ({ sendEmail } = require('../../services/emailService'));
  });

  afterEach(() => espias.forEach((e) => e.mockRestore()));

  it('no escribe el correo del destinatario', async () => {
    const r = await sendEmail('padre.secreto@example.com', 'Aviso de IngenIA', '<p>hola</p>', 'hola');
    expect(r.success).toBe(true);
    const salida = lineas.join('\n');
    expect(salida).not.toContain('padre.secreto@example.com');
    expect(salida).toContain('[Email Fallback]');
  });

  it('no escribe el contenido del correo', async () => {
    await sendEmail('a@example.com', 'Asunto', '<p>enlace de pago privado</p>', 'x');
    expect(lineas.join('\n')).not.toContain('enlace de pago privado');
  });

  it('sin destinatario devuelve error y no registra nada', async () => {
    const r = await sendEmail('', 'Asunto', '<p>x</p>', 'x');
    expect(r.success).toBe(false);
    expect(lineas).toEqual([]);
  });
});
