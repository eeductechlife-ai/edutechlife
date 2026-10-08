// El producto se llamaba SmartBoard y ahora es IngenIA. Las apps ya instaladas y
// los correos ya enviados siguen llamando a /api/smartboard/*; el frontend nuevo
// llama a /api/ingenia/*. Las dos rutas deben comportarse igual (mismos guards),
// o cambiar el nombre quitaría una protección sin que nada lo avise.
const request = require('supertest');
const app = require('../../app');

const PATHS = [
  ['GET', '/data/some-user'],
  ['GET', '/progress/some-user'],
  ['GET', '/student-profile'],
  ['GET', '/recommendations'],
  ['GET', '/adaptive/state'],
  ['POST', '/chat'],
  ['POST', '/dani/chat'],
  ['POST', '/ai'],
  ['GET', '/videos/search'],
];

const call = (method, url) => request(app)[method.toLowerCase()](url).send({});

describe('/api/ingenia y /api/smartboard comparten guards', () => {
  it.each(PATHS)('%s %s responde igual en ambos nombres sin sesión', async (method, path) => {
    const legacy = await call(method, `/api/smartboard${path}`);
    const current = await call(method, `/api/ingenia${path}`);
    expect(current.status).toBe(legacy.status);
    expect([401, 403]).toContain(current.status);
  });

  it('la verificación de consentimiento de los correos responde igual en ambos nombres', async () => {
    const legacy = await request(app).get('/api/smartboard/parental-consent/verify?token=invalido');
    const current = await request(app).get('/api/ingenia/parental-consent/verify?token=invalido');
    expect(current.status).toBe(legacy.status);
    expect(current.status).not.toBe(404);
  });
});
