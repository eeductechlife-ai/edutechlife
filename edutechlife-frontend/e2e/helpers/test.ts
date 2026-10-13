import { test as base, expect, type Page } from '@playwright/test';

/**
 * `test` de las pruebas E2E: igual que el de Playwright, pero con la API del
 * backend simulada en TODAS las pruebas. Así ninguna llama al backend real de
 * producción (ni depende de él, ni de su CORS), y las páginas reciben respuestas
 * con la forma correcta.
 *
 * `signIn` (helpers/session.ts) añade después sus propias respuestas, que
 * prevalecen sobre estas porque Playwright prueba primero las rutas más nuevas.
 */
const PLANS = [
  { id: 'free', name: 'Gratis', price: 0, features: ['Diagnóstico de aprendizaje', 'Acceso a la comunidad'] },
  { id: 'pro', name: 'Pro', price: 4990000, features: ['Todo lo gratuito', 'Tutor IA sin límites', 'Reportes para padres'] },
  { id: 'enterprise', name: 'Empresas', price: 0, isCustom: true, features: ['Formación a medida', 'Acompañamiento dedicado'] },
];

export async function mockPublicApi(page: Page): Promise<void> {
  await page.route('**/api/**', async (route) => {
    const path = new URL(route.request().url()).pathname;
    const body = path.endsWith('/health')
      ? { status: 'ok' }
      : path.endsWith('/stripe/plans')
        ? { plans: PLANS }
        : {};
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'access-control-allow-origin': '*' },
      body: JSON.stringify(body),
    });
  });
}

export const test = base.extend({
  page: async ({ page }, use) => {
    await mockPublicApi(page);
    await use(page);
  },
});

export { expect };
