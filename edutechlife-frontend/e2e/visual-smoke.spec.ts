import { test, expect } from '@playwright/test';

test.describe('Visual smoke — public pages render without blank content', () => {
  test('landing page has visible content above fold', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    const screenshot = await page.screenshot({ fullPage: false });
    expect(screenshot.length).toBeGreaterThan(1000);
  });

  test('nosotros page renders', async ({ page }) => {
    await page.goto('/nosotros', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(50);
  });

  test('contacto page renders', async ({ page }) => {
    await page.goto('/contacto', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(50);
  });

  test('landing page footer is visible', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    const footer = page.locator('footer');
    await expect(footer).toBeVisible({ timeout: 5000 });
  });
});
