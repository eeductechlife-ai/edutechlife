import { test, expect } from '@playwright/test';
import { seedAuthedPage } from './helpers/auth';

/**
 * Flujo de registro (público, sin backend) + acceso al dashboard IALab.
 *
 * Cubre el embudo de conversión que un estudiante nuevo recorre:
 * catálogo → Inscríbete → login → registro en 2 pasos. El paso 2 no se envía
 * (requiere backend), pero se valida que el formulario esté completo y que la
 * UI avance correctamente.
 */
test.describe('Registration flow', () => {
  test('catálogo IALab muestra el curso destacado', async ({ page }) => {
    await page.goto('/ialab-academic', { waitUntil: 'domcontentloaded' });
    await expect(
      page.getByText('Introducción a la IA Generativa').first(),
    ).toBeVisible({ timeout: 15000 });
    await expect(
      page.getByRole('button', { name: /inscríbete/i }).first(),
    ).toBeVisible();
  });

  test('Inscríbete lleva al login con returnTo=/ialab', async ({ page }) => {
    await page.goto('/ialab-academic', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: /inscríbete/i }).first().click();
    await expect(page).toHaveURL(/\/login\?returnTo=\/ialab/, {
      timeout: 15000,
    });
  });

  test('registro muestra paso 1 y 2 con validación básica', async ({ page }) => {
    await page.goto('/login?returnTo=/ialab', { waitUntil: 'domcontentloaded' });

    await page.getByRole('button', { name: /regístrate aquí/i }).click();
    await page.getByRole('button', { name: /crear cuenta con email/i }).click();

    // Paso 1/2 — información personal
    await expect(page.getByText(/paso 1\/2/i)).toBeVisible({ timeout: 10000 });
    const name = page.getByRole('textbox', { name: /ingresa tu nombre/i });
    const last = page.getByRole('textbox', { name: /ingresa tu apellido/i });
    const email = page.getByRole('textbox', { name: /ingresa tu correo/i });
    await expect(name).toBeVisible();
    await expect(email).toBeVisible();

    await name.fill('Prueba');
    await last.fill('E2E');
    await email.fill('prueba.e2e@example.com');

    await page.getByRole('button', { name: /continuar/i }).click();

    // Paso 2/2 — seguridad y acceso
    await expect(page.getByText(/paso 2\/2/i)).toBeVisible({ timeout: 10000 });
    await expect(
      page.getByRole('textbox', { name: /nombre de usuario/i }),
    ).toBeVisible();
    await expect(
      page.getByRole('textbox', { name: /crea una contraseña/i }),
    ).toBeVisible();
  });

  test('estudiante con sesión ve el dashboard IALab', async ({ page }) => {
    await seedAuthedPage(page);
    await page.goto('/ialab', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toContainText(/IALab/i, {
      timeout: 15000,
    });
    await expect(
      page.getByRole('button', { name: /comenzar/i }).first(),
    ).toBeVisible({ timeout: 15000 });
  });
});
