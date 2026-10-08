import { test, expect } from '@playwright/test';

/**
 * IngenIA E2E — rutas y meta públicas.
 *
 * /ingenia sirve un HTML 200 OK aunque el dashboard solo se hidrata cuando hay
 * sesión. Sin login, la app monta un <main> vacío / skeleton.
 * Estos tests cubren lo que se puede verificar sin credenciales:
 *  - las rutas responden 200 y no crashean
 *  - los meta tags de SEO están presentes
 *  - la landing pública `/conoce-ingenia` sirve como fallback informativo
 *  - los deep links no devuelven 404
 *
 * Los flujos autenticados (VAK, Dani chat, flashcards, mobile nav real) no se
 * cubren aquí: necesitan una sesión real de Supabase (el helper `helpers/auth.ts`
 * solo siembra un token falso que satisface la guarda de rutas del cliente).
 */

test.describe('IngenIA @smoke', () => {
  test('/ingenia responds 200 without runtime errors', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    const res = await page.goto('/ingenia', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    expect(res?.status()).toBe(200);
    await expect(page.locator('body')).toBeAttached({ timeout: 10000 });
    expect(pageErrors, `pageerror(s): ${pageErrors.join(' | ')}`).toEqual([]);
  });

  test('/ingenia has SEO meta tags', async ({ page }) => {
    await page.goto('/ingenia', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /.+/,
    );
  });

  test('/conoce-ingenia is a working public info page', async ({ page }) => {
    const res = await page.goto('/conoce-ingenia', {
      waitUntil: 'domcontentloaded',
    });
    expect(res?.status()).toBe(200);
    await expect(page.locator('body')).toBeAttached({ timeout: 10000 });
  });

  test('deep link /smartboard?tab=materias still returns 200', async ({ page }) => {
    const res = await page.goto('/ingenia?tab=materias', {
      waitUntil: 'domcontentloaded',
    });
    expect(res?.status()).toBe(200);
  });

  test('/smartboard/app requires auth — should NOT return a 5xx', async ({ page }) => {
    // Whatever the auth handling does (redirect / render sign-in), it must not
    // 500. This catches regressions in the ProtectedRoute wrapper.
    const res = await page.goto('/smartboard/app', {
      waitUntil: 'domcontentloaded',
    });
    expect(res?.status()).toBeLessThan(500);
  });
});

test.describe('IngenIA mobile @smoke', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('mobile /smartboard responds 200 without runtime errors', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    const res = await page.goto('/ingenia', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    expect(res?.status()).toBe(200);
    expect(pageErrors, `pageerror(s): ${pageErrors.join(' | ')}`).toEqual([]);
  });
});
