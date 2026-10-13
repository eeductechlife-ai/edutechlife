import { test, expect } from './helpers/test';

// @visual: las capturas dependen del sistema operativo y de las fuentes, por eso no
// corren en el CI por defecto. Se ejecutan con `npm run test:e2e:visual`.
test.describe('Visual regression @visual', () => {
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


});
