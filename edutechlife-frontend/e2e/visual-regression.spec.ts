import { test, expect } from '@playwright/test';

test.describe('Visual regression', () => {
  test('landing page full page', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(6000);
    await page.addStyleTag({ content: '*, *::before, *::after { animation: none !important; transition: none !important; animation-delay: 0s !important; }' });
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('landing-full.png', {
      fullPage: true,
      maxDiffPixels: 1000,
      animations: 'disabled',
      timeout: 30000,
    });
  });

  test('landing page viewport', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(6000);
    await page.addStyleTag({ content: '*, *::before, *::after { animation: none !important; transition: none !important; animation-delay: 0s !important; }' });
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('landing-viewport.png', {
      maxDiffPixels: 500,
      animations: 'disabled',
      timeout: 30000,
    });
  });

  test('ai tools section', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(6000);
    await page.addStyleTag({ content: '*, *::before, *::after { animation: none !important; transition: none !important; animation-delay: 0s !important; }' });
    await page.evaluate(() => {
      document.querySelector('#herramientas')?.scrollIntoView({ behavior: 'instant' });
    });
    await page.waitForTimeout(1000);
    const tools = page.locator('#herramientas');
    await expect(tools).toHaveScreenshot('ai-tools.png', {
      maxDiffPixels: 500,
      animations: 'disabled',
      timeout: 30000,
    });
  });

  test('nosotros page renders', async ({ page }) => {
    await page.goto('/nosotros', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);
    await page.addStyleTag({ content: '*, *::before, *::after { animation: none !important; transition: none !important; }' });
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot('nosotros-full.png', {
      fullPage: true,
      maxDiffPixels: 500,
      animations: 'disabled',
      timeout: 30000,
    });
  });

  test('privacidad page renders', async ({ page }) => {
    await page.goto('/privacidad', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await page.addStyleTag({ content: '*, *::before, *::after { animation: none !important; transition: none !important; }' });
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot('privacidad-full.png', {
      fullPage: true,
      maxDiffPixels: 200,
      animations: 'disabled',
      timeout: 30000,
    });
  });
});
