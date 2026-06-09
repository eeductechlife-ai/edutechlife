import { test, expect } from '@playwright/test';

test.describe('IALab Flow', () => {
  test.describe('Dashboard (/ialab)', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ialab');
      await page.waitForLoadState('networkidle');
    });

    test('renders the main dashboard sections', async ({ page }) => {
      await expect(page.locator('text=IALab')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('text=Progreso General')).toBeVisible();
      await expect(page.locator('text=Tu Progreso')).toBeVisible();
    });

    test('shows stats cards with XP, streak, score, and modules', async ({ page }) => {
      await expect(page.locator('text=XP').first()).toBeVisible();
      await expect(page.locator('text=Días').first().or(page.locator('text=Streak').first())).toBeVisible();
      await expect(page.locator('text=Score Promedio')).toBeVisible();
      await expect(page.locator('text=Módulos')).toBeVisible();
    });

    test('shows module timeline with 5 modules', async ({ page }) => {
      const moduleItems = page.locator('text=/Módulo [1-5]/');
      const count = await moduleItems.count();
      expect(count).toBe(5);
    });

    test('shows start or continue call-to-action', async ({ page }) => {
      const cta = page.locator('text=¡Bienvenido a IALab!').or(page.locator('text=Continuar Módulo'));
      await expect(cta.first()).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Module Page (/ialab/:moduleId)', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ialab/1');
      await page.waitForURL('**/ialab/**', { timeout: 15000 });
      await page.waitForLoadState('networkidle');
    });

    test('sidebar is visible on desktop', async ({ page }) => {
      const sidebar = page.locator('[data-tour="tour-sidebar"]');
      await expect(sidebar).toBeVisible({ timeout: 10000 });
    });

    test('shows module title', async ({ page }) => {
      await expect(page.locator('text=Módulo 1').first()).toBeVisible({ timeout: 10000 });
    });

    test('renders action cards (Exam, Challenge, Community)', async ({ page }) => {
      await expect(page.locator('text=Examen').first().or(page.locator('text=Evaluación').first())).toBeVisible({ timeout: 10000 });
      await page.waitForTimeout(500);
      await expect(page.locator('text=Challenge').or(page.locator('text=Desafío'))).toBeVisible();
    });

    test('tab pills are present', async ({ page }) => {
      const tablist = page.locator('[role=tablist]');
      await expect(tablist).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Dashboard Module Navigation', () => {
    test('clicks a module from the timeline and navigates', async ({ page }) => {
      await page.goto('/ialab');
      await page.waitForLoadState('networkidle');

      const continueBtn = page.locator('button:has-text("Continuar")').first();
      if (await continueBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await continueBtn.click();
        await page.waitForURL('**/ialab/**', { timeout: 10000 });
        expect(page.url()).toMatch(/\/ialab\/[1-5]/);
      }
    });
  });

  test.describe('Valerio Coach Panel', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ialab/1');
      await page.waitForURL('**/ialab/**', { timeout: 15000 });
      await page.waitForLoadState('networkidle');
    });

    test('Valerio floating button is visible', async ({ page }) => {
      const fab = page.locator('[data-tour="tour-valerio"]');
      await expect(fab).toBeVisible({ timeout: 10000 });
    });

    test('opens Valerio panel on FAB click', async ({ page }) => {
      const fab = page.locator('[data-tour="tour-valerio"]');
      await fab.click();
      await expect(page.locator('text=Valerio').first()).toBeVisible({ timeout: 5000 });
    });

    test('Valerio panel has chat input area', async ({ page }) => {
      const fab = page.locator('[data-tour="tour-valerio"]');
      await fab.click();
      await page.waitForTimeout(500);
      const textarea = page.locator('textarea').first();
      await expect(textarea).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Responsive', () => {
    test('mobile dashboard has no horizontal scroll', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/ialab');
      await page.waitForLoadState('networkidle');
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);
      expect(scrollWidth).toBeLessThanOrEqual(viewportWidth + 1);
    });

    test('module page shows mobile header on small screens', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/ialab/1');
      await page.waitForURL('**/ialab/**', { timeout: 15000 });
      await page.waitForLoadState('networkidle');
      const sidebar = page.locator('[data-tour="tour-sidebar"]');
      const visible = await sidebar.isVisible();
      expect(visible).toBe(false);
    });
  });
});
