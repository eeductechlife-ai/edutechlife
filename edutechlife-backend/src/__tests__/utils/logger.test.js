/**
 * El logger oculta datos personales tanto en los metadatos como en el mensaje
 * (re-auditoría S11). Antes solo ocultaba los metadatos: un correo escrito en
 * el texto del mensaje salía completo a los logs.
 */
const logger = require('../../utils/logger');

function capturar(fn) {
  const lineas = [];
  const espiar = (m) => vi.spyOn(console, m).mockImplementation((l) => lineas.push(String(l)));
  const espias = [espiar('log'), espiar('warn'), espiar('error')];
  try {
    fn();
  } finally {
    espias.forEach((e) => e.mockRestore());
  }
  return lineas.join('\n');
}

describe('logger: datos personales', () => {
  it('oculta un correo escrito en el mensaje', () => {
    const salida = capturar(() => logger.info('Enviando a padre@example.com ahora'));
    expect(salida).not.toContain('padre@example.com');
    expect(salida).toContain('***@***.***');
  });

  it('oculta un correo en los metadatos', () => {
    const salida = capturar(() => logger.info('Aviso', { to: 'madre@example.com' }));
    expect(salida).not.toContain('madre@example.com');
  });

  it('acorta los UUID a 8 caracteres', () => {
    const id = '123e4567-e89b-12d3-a456-426614174000';
    const salida = capturar(() => logger.warn('Usuario', { userId: id }));
    expect(salida).not.toContain(id);
    expect(salida).toContain('123e4567****');
  });

  it('oculta tokens largos en el mensaje', () => {
    const token = 'a'.repeat(48);
    const salida = capturar(() => logger.error(`token ${token}`));
    expect(salida).not.toContain(token);
    expect(salida).toContain('[REDACTED]');
  });

  it('un mensaje que no es texto no rompe el registro', () => {
    expect(() => capturar(() => logger.info(undefined))).not.toThrow();
  });
});
