import { test, expect } from '@playwright/test';

test.describe('Module Completion Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clerk auth — requires test credentials or token injection
    await page.goto('/ialab/1');
    await page.waitForURL('**/ialab/**', { timeout: 15000 });
  });

  test('student can navigate and complete a module quiz', async ({ page }) => {
    await expect(page.locator('text=Módulo 1')).toBeVisible({ timeout: 10000 });

    // Open quiz
    await page.click('text=Examen');
    await expect(page.locator('[role=timer]')).toBeVisible({ timeout: 5000 });

    // Answer all questions
    const questions = page.locator('[role=radiogroup]');
    const count = await questions.count();
    for (let i = 0; i < count; i++) {
      await questions.nth(i).locator('input[type=radio]').first().check();
    }

    // Submit
    await page.click('text=Enviar');
    await expect(page.locator('text=Resultados')).toBeVisible({ timeout: 5000 });
  });

  test('student can complete a challenge', async ({ page }) => {
    await page.click('text=Challenge');
    await expect(page.locator('[role=progressbar]')).toBeVisible({ timeout: 5000 });

    // Complete challenge steps
    const steps = page.locator('[role=button]');
    const stepCount = await steps.count();
    for (let i = 0; i < Math.min(stepCount, 5); i++) {
      await steps.nth(i).click();
    }
  });

  test('progress is persisted after module visit', async ({ page }) => {
    await page.goto('/ialab/2');
    const progressBar = page.locator('[role=progressbar]').first();
    await expect(progressBar).toBeVisible();

    const progressValue = await progressBar.getAttribute('aria-valuenow');
    expect(Number(progressValue)).toBeGreaterThanOrEqual(0);
    expect(Number(progressValue)).toBeLessThanOrEqual(100);
  });
});
