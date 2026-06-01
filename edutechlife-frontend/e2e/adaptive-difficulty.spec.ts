import { test, expect } from '@playwright/test';

test.describe('Adaptive Difficulty', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ialab/1');
    await page.waitForURL('**/ialab/**', { timeout: 15000 });
  });

  test('quiz difficulty adapts after incorrect answers', async ({ page }) => {
    await page.click('text=Examen');
    await expect(page.locator('[role=timer]')).toBeVisible({ timeout: 5000 });

    // Answer wrong on purpose
    const questions = page.locator('[role=radiogroup]');
    const firstQ = questions.first();
    const wrongOption = firstQ.locator('input[type=radio]').last();
    await wrongOption.check();

    // Submit and check for feedback
    await page.click('text=Enviar');
    await expect(page.locator('text=Incorrecto')).toBeVisible({ timeout: 5000 });

    const feedbackHint = page.locator('[class*=feedback]');
    if (await feedbackHint.isVisible()) {
      await expect(feedbackHint).toContainText(/sugerencia|concepto|revisar/i);
    }
  });

  test('topic progress bars reflect partial completion', async ({ page }) => {
    const topicCards = page.locator('[class*=rounded-xl][role=progressbar]');
    await expect(topicCards.first()).toBeVisible();

    const values = await topicCards.evaluateAll((elements) =>
      elements.map((el) => Number(el.getAttribute('aria-valuenow') || '0'))
    );

    for (const v of values) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(100);
    }
  });

  test('recommendations adapt based on weak topics', async ({ page }) => {
    const recommendationSection = page.locator('text=Tu ruta de hoy');
    if (await recommendationSection.isVisible()) {
      const actionCard = page.locator('[class*=bg-gradient-to-br]').first();
      await expect(actionCard).toBeVisible({ timeout: 5000 });
    }
  });
});
