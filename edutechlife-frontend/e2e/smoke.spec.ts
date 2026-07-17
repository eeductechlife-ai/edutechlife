import { test, expect } from '@playwright/test';

test.describe('Public pages smoke test', () => {
  const publicRoutes = [
    { path: '/', title: /Edutechlife|IA|educación/i },
    { path: '/nosotros', title: /nosotros|equipo/i },
    { path: '/contacto', title: /contacto/i },
    { path: '/terminos', title: /términos|condiciones/i },
    { path: '/privacidad', title: /privacidad/i },
  ] as const;

  for (const route of publicRoutes) {
    test(`${route.path} loads without crashing`, async ({ page }) => {
      const res = await page.goto(route.path, { waitUntil: 'domcontentloaded' });
      expect(res?.status()).toBe(200);
      await expect(page.locator('body')).toBeAttached({ timeout: 10000 });
    });
  }

  test('SEO meta tags are present on landing page', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    const metaDesc = page.locator('meta[name="description"]');
    await expect(metaDesc).toHaveAttribute('content', /.+/);
  });
});
