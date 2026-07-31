import { test, expect } from '@playwright/test';
import { seedAuthedSession } from './helpers/auth';

/**
 * SmartBoard E2E — authenticated protected route.
 *
 * Runs with a seeded Supabase auth_token (see helpers/auth.ts) so the
 * RoleProtectedRoute guard lets us into /smartboard/app. We assert the
 * dashboard that route actually serves mounts and behaves.
 *
 * NOTE ON WHICH DASHBOARD: /smartboard/app currently renders the classic
 * SmartBoard dashboard (Valeria coach, course progress, report export). The
 * newer Dani 2.0 kids-dashboard lives at the public /smartboard route and is
 * covered in smartboard.spec.ts. If /smartboard/app is later repointed to the
 * 2.0 dashboard, update these assertions.
 *
 * Out of scope (needs a live backend session): Valeria/Dani streamed replies.
 */

test.describe('SmartBoard authed @smoke', () => {
  test.beforeEach(async ({ context }) => {
    await seedAuthedSession(context);
  });

  test('/smartboard/app lets an authed user in (no login redirect)', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    const res = await page.goto('/smartboard/app', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    expect(res?.status()).toBeLessThan(500);

    // The guard saw our token — we must NOT be bounced to /login
    await page.waitForTimeout(1500);
    expect(page.url()).not.toContain('/login');
    expect(pageErrors, `pageerror(s): ${pageErrors.join(' | ')}`).toEqual([]);
  });

  test('dashboard mounts its welcome + core actions', async ({ page }) => {
    await page.goto('/smartboard/app', {
      waitUntil: 'networkidle',
      timeout: 60000,
    });

    // Welcome hero
    await expect(page.getByText(/Bienvenido/i).first()).toBeVisible({
      timeout: 20000,
    });

    // Core action buttons the classic dashboard always renders
    await expect(
      page.getByRole('button', { name: /Diagnóstico VAK/i }).first(),
    ).toBeVisible({ timeout: 20000 });
    await expect(
      page.getByRole('button', { name: /Cerrar Sesión/i }).first(),
    ).toBeVisible({ timeout: 20000 });
  });

  test('sidebar navigation switches views without crashing', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.goto('/smartboard/app', {
      waitUntil: 'networkidle',
      timeout: 60000,
    });

    const progreso = page
      .getByRole('button', { name: /Progreso/i })
      .first();
    await expect(progreso).toBeVisible({ timeout: 20000 });
    await progreso.click();

    // Still on the app, not redirected, no runtime error
    await page.waitForTimeout(800);
    expect(page.url()).toContain('/smartboard');
    expect(pageErrors, `pageerror(s): ${pageErrors.join(' | ')}`).toEqual([]);
  });
});
