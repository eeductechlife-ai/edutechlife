import { test, expect } from '@playwright/test';

test.describe('iLAB Mobile Responsive', () => {
  test('no horizontal scroll on iPhone 12/13 (390x844)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/ialab');
    await page.waitForLoadState('networkidle');
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });

  test('touch targets respect 44px minimum', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/ialab');
    await page.waitForLoadState('networkidle');
    const smallButtons = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button, a[href], [role="button"]');
      const violations = [];
      buttons.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.width < 44 && rect.height < 44 && rect.width > 0 && rect.height > 0) {
          violations.push({
            tag: el.tagName,
            text: (el.textContent || '').trim().substring(0, 30),
            w: Math.round(rect.width),
            h: Math.round(rect.height),
          });
        }
      });
      return violations;
    });
    expect(smallButtons.length).toBe(0);
  });

  test('PWA manifest loads correctly', async ({ page }) => {
    await page.goto('/ialab');
    const link = await page.evaluate(() => {
      const l = document.querySelector('link[rel="manifest"]');
      return l ? l.getAttribute('href') : null;
    });
    expect(link).toBeTruthy();
  });

  test('tablet layout shows sidebar on iPad Mini (768x1024)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/ialab');
    await page.waitForLoadState('networkidle');
    const sidebar = page.locator('[data-tour="tour-sidebar"]');
    await expect(sidebar).toBeVisible();
  });
});
