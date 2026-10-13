import { test, expect } from './helpers/test';

test.describe('Páginas públicas: se ven completas, no en blanco ni en 404', () => {
  const PAGES = [
    { path: '/', name: 'inicio' },
    { path: '/planes', name: 'planes' },
    { path: '/ialab-academic', name: 'catálogo de IALab' },
    { path: '/conoce-ingenia', name: 'qué es IngenIA' },
  ] as const;

  for (const { path, name } of PAGES) {
    test(`${name} (${path}) muestra contenido`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('heading').first()).toBeVisible();
      const text = await page.locator('body').innerText();
      expect(text.length).toBeGreaterThan(100);
      expect(text).not.toMatch(/página no encontrada/i);
    });
  }

  test('la portada, por encima del pliegue, no sale en blanco', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
    const screenshot = await page.screenshot({ fullPage: false });
    expect(screenshot.length).toBeGreaterThan(10_000);
  });

  test('la portada termina con su pie de página', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.locator('footer').first()).toBeVisible();
  });
});
