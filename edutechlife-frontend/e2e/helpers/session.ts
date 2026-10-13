import { expect, type Page, type Route } from '@playwright/test';

/**
 * Sesión simulada para probar los paneles de IALab e IngenIA sin credenciales
 * reales ni red.
 *
 * El build de E2E se compila con `VITE_SUPABASE_URL=https://e2e.supabase.co`
 * (ver `npm run build:e2e`). Así la app usa un proyecto Supabase ficticio y todo
 * lo que le pida a ese host, o a la API del backend, lo respondemos aquí con
 * `page.route`. Resultado: pruebas deterministas, rápidas y sin secretos.
 *
 * Qué simula:
 *  - La sesión de supabase-js en localStorage (`sb-e2e-auth-token`) y el token de
 *    `sessionStorage`, que es lo que mira `RoleProtectedRoute`.
 *  - `auth/v1/*` (usuario y renovación de token) y `rest/v1/*` (tablas vacías, y
 *    el perfil con el `account_type` del producto).
 *  - La API del backend (`/api/**`): `{}` por defecto y `user-role` con el rol.
 */

export const E2E_SUPABASE_HOST = 'e2e.supabase.co';
export const SUPABASE_STORAGE_KEY = 'sb-e2e-auth-token';

export type Product = 'ialab' | 'ingenia';

const TEST_USER = {
  id: '00000000-0000-4000-8000-0000000000e2',
  email: 'e2e-tester@example.com',
  name: 'Estudiante E2E',
};

const b64url = (value: object) =>
  Buffer.from(JSON.stringify(value)).toString('base64url');

/** JWT con forma válida y caducidad lejana. No está firmado: nadie lo verifica. */
function fakeJwt(): string {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24;
  return [
    b64url({ alg: 'HS256', typ: 'JWT' }),
    b64url({
      sub: TEST_USER.id,
      email: TEST_USER.email,
      role: 'authenticated',
      aud: 'authenticated',
      exp,
    }),
    'e2e-signature',
  ].join('.');
}

const json = (route: Route, body: unknown, status = 200) =>
  route.fulfill({
    status,
    contentType: 'application/json',
    headers: { 'access-control-allow-origin': '*' },
    body: JSON.stringify(body),
  });

function userRow(product: Product) {
  return {
    id: TEST_USER.id,
    email: TEST_USER.email,
    full_name: TEST_USER.name,
    first_name: 'Estudiante',
    last_name: 'E2E',
    account_type: product === 'ingenia' ? 'smartboard' : 'ialab',
    user_role: 'student',
    platform: product === 'ingenia' ? 'smartboard' : 'ialab',
  };
}

const STUDENT = {
  name: 'Sofía',
  age: 11,
  grade: '5',
  grade_level: '5',
  country_code: 'CO',
  school_name: 'Colegio E2E',
};

function studentRow() {
  return {
    id: 'student-e2e',
    auth_id: TEST_USER.id,
    user_id: TEST_USER.id,
    email: TEST_USER.email,
    subscription_tier: 'free',
    ...STUDENT,
  };
}

/** Responde a Supabase (auth y REST) y a la API del backend. */
async function mockNetwork(page: Page, product: Product, token: string) {
  const authUser = {
    id: TEST_USER.id,
    email: TEST_USER.email,
    aud: 'authenticated',
    role: 'authenticated',
    app_metadata: { provider: 'email' },
    user_metadata: { full_name: TEST_USER.name },
    created_at: '2026-01-01T00:00:00Z',
  };

  await page.route(`**://${E2E_SUPABASE_HOST}/**`, async (route) => {
    const url = new URL(route.request().url());
    const method = route.request().method();
    if (method === 'OPTIONS') return json(route, {}, 204);
    if (url.pathname.startsWith('/auth/v1/user')) return json(route, authUser);
    if (url.pathname.startsWith('/auth/v1/token')) {
      return json(route, {
        access_token: token,
        refresh_token: 'e2e-refresh',
        token_type: 'bearer',
        expires_in: 86400,
        user: authUser,
      });
    }
    if (url.pathname.startsWith('/rest/v1/')) {
      if (method !== 'GET' && method !== 'HEAD') return json(route, [], 201);
      const wantsObject = (route.request().headers()['accept'] || '').includes('pgrst.object');
      const table = url.pathname.replace('/rest/v1/', '').split('/')[0];
      if (table === 'users') return json(route, wantsObject ? userRow(product) : [userRow(product)]);
      if (table === 'students') return json(route, wantsObject ? studentRow() : [studentRow()]);
      return wantsObject ? json(route, {}) : json(route, []);
    }
    return json(route, {});
  });

  // Realtime de Supabase: aceptar la conexión y no decir nada.
  await page.routeWebSocket(`wss://${E2E_SUPABASE_HOST}/**`, () => {});

  await page.route('**/api/**', async (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('/user-role')) {
      return json(route, { role: product === 'ingenia' ? 'smartboard' : 'ialab' });
    }
    if (path.endsWith('/parental-consent/status')) {
      return json(route, { verification_status: 'verified' });
    }
    if (path.endsWith('/student-profile') && route.request().method() === 'GET') {
      return json(route, { id: 'student-e2e', ...STUDENT });
    }
    return json(route, {});
  });
}

/**
 * Deja la página con sesión iniciada en el producto indicado. Llamar ANTES de
 * `page.goto`. Con `{ tour: true }` se conserva el recorrido guiado de IALab, y
 * con `{ welcomed: false }` la bienvenida de IngenIA (primera visita), para
 * probarlos; por defecto se omiten porque tapan la página.
 */
export async function signIn(
  page: Page,
  product: Product = 'ialab',
  { tour = false, welcomed = true }: { tour?: boolean; welcomed?: boolean } = {},
): Promise<void> {
  const token = fakeJwt();
  const session = {
    access_token: token,
    refresh_token: 'e2e-refresh',
    token_type: 'bearer',
    expires_in: 86400,
    expires_at: Math.floor(Date.now() / 1000) + 86400,
    user: {
      id: TEST_USER.id,
      email: TEST_USER.email,
      aud: 'authenticated',
      role: 'authenticated',
      app_metadata: { provider: 'email' },
      user_metadata: { full_name: TEST_USER.name },
    },
  };

  await page.addInitScript(
    (init) => {
      try {
        localStorage.setItem(init.key, init.sessionJson);
        localStorage.setItem('user_email', init.email);
        sessionStorage.setItem('auth_token', init.accessToken);
        if (init.welcomed) {
          // Estudiante que ya vio la bienvenida de IngenIA (lo normal tras la primera
          // visita). La app restaura estos indicadores desde localStorage cada vez
          // que reinicia su estado al cargar, así que la bienvenida no vuelve a tapar
          // la pantalla. Las claves llevan el id del usuario y el prefijo de la app.
          for (const name of ['complete', 'welcomed']) {
            localStorage.setItem(`edutechlife_onboarding_${name}_${init.userId}`, 'true');
          }
        }
        if (!init.showTour) {
          // Sin esto el recorrido guiado de IALab y la burbuja de MAX tapan la
          // página con una capa a pantalla completa y los clics no llegan.
          sessionStorage.setItem('ialab_welcome_tour_shown', '1');
          localStorage.setItem('ialab_valerio_seen', '1');
        }
      } catch {
        /* about:blank no tiene storage: se ignora */
      }
    },
    {
      key: SUPABASE_STORAGE_KEY,
      sessionJson: JSON.stringify(session),
      accessToken: token,
      email: TEST_USER.email,
      showTour: tour,
      welcomed,
      userId: TEST_USER.id,
    },
  );

  await mockNetwork(page, product, token);
}

/**
 * IngenIA da la bienvenida a cada estudiante nuevo con un modal que tapa la
 * pantalla. Esta función lo cierra con «Explorar primero», como haría el niño.
 *
 * Primero espera a que la app termine de identificar al estudiante (en ese
 * momento escribe sus indicadores de bienvenida en localStorage). Si se cierra
 * antes, la app reinicia su estado al identificarlo (~5 s tras cargar) y vuelve
 * a mostrar la bienvenida, con lo que las pruebas siguientes encontrarían la
 * pantalla tapada. Se anota como observación del producto, no se «arregla» aquí.
 */
export async function skipIngeniaWelcome(page: Page): Promise<void> {
  await page.waitForFunction(
    () => Object.keys(localStorage).some((k) => k.startsWith('edutechlife_onboarding_step_')),
    undefined,
    { timeout: 60_000 },
  );
  const explore = page.getByRole('button', { name: 'Explorar primero' });
  // En un equipo lento la página puede tardar en responder al primer clic: se
  // reintenta hasta que el modal desaparece, en vez de fallar por una espera fija.
  await expect(async () => {
    if (await explore.count()) await explore.click({ timeout: 5_000 });
    await expect(explore).toHaveCount(0, { timeout: 3_000 });
  }).toPass({ timeout: 60_000, intervals: [500, 1_000, 2_000] });
}
