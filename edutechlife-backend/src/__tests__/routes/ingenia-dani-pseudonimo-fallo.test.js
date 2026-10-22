/**
 * Si el reemplazo del nombre falla, el nombre NO sale del servidor, el chat
 * responde igual (tratamiento neutro "tú") y queda un aviso en los logs.
 */
const request = require('supertest');

const SVC = require.resolve('../../services/daniPseudonimo');
process.env.DANI_PSEUDONIMO = 'true';
const real = require(SVC);
// Simula un fallo real del reemplazo: el patrón no se puede compilar.
require.cache[SVC] = {
  id: SVC, filename: SVC, loaded: true,
  exports: {
    ...real,
    prepararPseudonimo: (opts) =>
      real.prepararPseudonimo(opts, { compilar: () => { throw new Error('patrón roto (prueba)'); } }),
  },
};

const { h, crearApp, eventosSSE } = require('../helpers/daniHarness');
const app = crearApp();

describe('DANI_PSEUDONIMO encendido con fallo del reemplazo', () => {
  beforeEach(() => {
    h.reset();
    h.llamadas.length = 0;
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('no envía el nombre, usa "tú", registra un aviso y responde 200', async () => {
    const r = await request(app)
      .post('/api/ingenia/dani/chat')
      .set('Authorization', 'Bearer test-token')
      .send({ message: 'Hola, Sol. ¿Me ayudas con fracciones?', studentId: 'student-1' });

    expect(r.status).toBe(200);
    const enviado = JSON.stringify(h.llamadas[0].messages);
    expect(/(?<![\p{L}\p{N}_])Sol(?![\p{L}\p{N}_])/u.test(enviado)).toBe(false);
    expect(enviado).toContain('Dirígete al estudiante de tú');
    expect(h.llamadas[0].messages.at(-1).content).toBe('Hola, tú. ¿Me ayudas con fracciones?');
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('[DaniPseudonimo] '));
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('patrón roto'));
    const chunks = eventosSSE(r.text).filter((e) => e.chunk);
    expect(chunks.length).toBeGreaterThan(0);
  });
});
