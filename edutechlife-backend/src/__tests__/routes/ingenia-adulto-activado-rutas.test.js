// Vitest globals — qué rutas de IngenIA quedan en modo restringido antes de que
// el adulto active la cuenta del niño. Se inspecciona la pila de Express.

const supabasePath = require.resolve('../../db/supabase');
delete require.cache[supabasePath];
require.cache[supabasePath] = {
  id: supabasePath, filename: supabasePath, loaded: true,
  exports: { from: vi.fn(), rpc: vi.fn(), auth: { getUser: vi.fn(), admin: {} } },
};

const { requireAdultoActivado } = require('../../middleware/parentalConsent');

function usaMiddleware(router, metodo, ruta) {
  const capa = router.stack.find((l) => l.route?.path === ruta && l.route.methods[metodo]);
  if (!capa) throw new Error(`ruta no encontrada: ${metodo.toUpperCase()} ${ruta}`);
  return capa.route.stack.some((s) => s.handle === requireAdultoActivado);
}

const chat = require('../../routes/ingenia/chat');
const scan = require('../../routes/ingenia/scan');
const daniPhoto = require('../../routes/ingenia/daniPhoto');
const core = require('../../routes/ingenia/core');
const parentInsights = require('../../routes/ingenia/parent-insights');
const adaptive = require('../../routes/ingenia/adaptive');
const studentProfile = require('../../routes/ingenia/student-profile');

describe('modo restringido: rutas bloqueadas hasta la activación', () => {
  it.each([
    [chat, 'post', '/chat'],
    [chat, 'post', '/chat/stream'],
    [chat, 'post', '/ai'],
    [chat, 'post', '/dani/chat'],
    [chat, 'get', '/dani/history'],
    [daniPhoto, 'post', '/dani/photo'],
    [scan, 'post', '/scan'],
  ])('%#: %s %s usa requireAdultoActivado', (router, metodo, ruta) => {
    expect(usaMiddleware(router, metodo, ruta)).toBe(true);
  });
});

describe('rutas que nunca se bloquean por la activación', () => {
  it.each([
    [studentProfile, 'delete', '/delete-user-data'],
    [parentInsights, 'get', '/parent/insights'],
    [parentInsights, 'get', '/parent/learning-graph'],
    [core, 'get', '/data/:userId'],
    [core, 'get', '/progress/:userId'],
    [core, 'post', '/weekly-report'],
    [core, 'get', '/wellbeing-status'],
    [adaptive, 'post', '/adaptive/mastery'],
    [adaptive, 'get', '/adaptive/warnings'],
  ])('%#: %s %s no usa requireAdultoActivado', (router, metodo, ruta) => {
    expect(usaMiddleware(router, metodo, ruta)).toBe(false);
  });
});
