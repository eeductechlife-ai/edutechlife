import { test, expect } from '@playwright/test';

test.describe('Visual regression', () => {
  test('landing page hero section', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    const hero = page.locator('section').first();
    await expect(hero).toHaveScreenshot('landing-hero.png', {
      maxDiffPixels: 100,
    });
  });

  test('nosotros page full page', async ({ page }) => {
    await page.goto('/nosotros', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await expect(page).toHaveScreenshot('nosotros-full.png', {
      fullPage: true,
      maxDiffPixels: 200,
    });
  });

  test('contacto page form section', async ({ page }) => {
    await page.goto('/contacto', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    const form = page.locator('form').first();
    await expect(form).toHaveScreenshot('contacto-form.png', {
      maxDiffPixels: 100,
    });
  });

  test('footer on landing page', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    const footer = page.locator('footer');
    await expect(footer).toHaveScreenshot('landing-footer.png', {
      maxDiffPixels: 100,
    });
  });

  test('privacy page renders', async ({ page }) => {
    await page.goto('/privacy', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await expect(page).toHaveScreenshot('privacy-full.png', {
      fullPage: true,
      maxDiffPixels: 200,
    });
  });
});
