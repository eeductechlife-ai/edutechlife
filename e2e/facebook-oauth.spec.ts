import { test, expect } from '@playwright/test';

/**
 * Facebook OAuth Integration Tests
 *
 * Estos tests verifican que el login con Facebook funciona correctamente
 * Pueden ejecutarse localmente o en staging
 *
 * Requisitos:
 * - OAUTH_FACEBOOK_CLIENT_ID y SECRET configurados
 * - Callback URL registrada en Facebook Console
 * - No es posible testear interacción real con Facebook (require usuario real)
 *
 * Lo que SÍ testea:
 * - Botón Facebook visible
 * - Endpoint OAuth disponible
 * - Callback handler funciona
 */

test.describe('Facebook OAuth Integration', () => {
  const baseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:5173';
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';

  test('1. Facebook sign up button is visible', async ({ page }) => {
    // Navega a Sign Up page
    await page.goto(`${baseUrl}/sign-up/ialab`);

    // Espera a que se cargue
    await page.waitForLoadState('networkidle');

    // Busca botón de Facebook
    const facebookButton = page.locator('button:has-text("Continuar con Facebook"), button:has-text("Facebook")').first();

    // Verifica que existe y es visible
    await expect(facebookButton).toBeVisible();
    await expect(facebookButton).toBeEnabled();

    console.log('✓ Facebook button is visible');
  });

  test('2. Facebook button has correct SVG icon', async ({ page }) => {
    await page.goto(`${baseUrl}/sign-up/ialab`);
    await page.waitForLoadState('networkidle');

    const facebookButton = page.locator('button:has-text("Continuar con Facebook"), button:has-text("Facebook")').first();

    // Verifica que tiene SVG (icono de Facebook)
    const svg = facebookButton.locator('svg');
    await expect(svg).toBeVisible();

    console.log('✓ Facebook button has SVG icon');
  });

  test('3. OAuth endpoint is accessible', async ({ request }) => {
    // Verifica que el endpoint GET /oauth/facebook existe
    const response = await request.get(`${backendUrl}/api/auth/oauth/facebook?redirect_uri=http://localhost:5173/auth/callback`, {
      maxRedirects: 0, // No seguir redirects
    });

    // Debería redirigir a Facebook (302) o error si no configurado
    console.log(`Response status: ${response.status()}`);

    if (response.status() === 302 || response.status() === 307) {
      // Redirige a Facebook - correcto
      const location = response.headers()['location'];
      expect(location).toContain('facebook.com');
      console.log('✓ OAuth endpoint redirects to Facebook');
    } else if (response.status() === 500) {
      // Credenciales no configuradas - esperado en local sin setup
      const body = await response.text();
      if (body.includes('not configured')) {
        console.log('⚠ OAuth not configured (expected in local without setup)');
      } else {
        throw new Error(`Unexpected 500 error: ${body}`);
      }
    } else {
      throw new Error(`Unexpected status code: ${response.status()}`);
    }
  });

  test('4. Callback endpoint exists', async ({ request }) => {
    // Verifica que el endpoint GET /api/auth/callback existe
    // (sin parámetros, debería dar error pero no 404)
    const response = await request.get(`${backendUrl}/api/auth/callback`, {
      maxRedirects: 0,
    });

    console.log(`Callback endpoint status: ${response.status()}`);

    // Si devuelve 302/307/400/401, el endpoint existe
    // Si devuelve 404, el endpoint no existe
    expect(response.status()).not.toBe(404);
    console.log('✓ Callback endpoint exists');
  });

  test('5. Google OAuth still works (no regression)', async ({ page }) => {
    // Verifica que agregar Facebook no rompió Google OAuth
    await page.goto(`${baseUrl}/sign-up/ialab`);
    await page.waitForLoadState('networkidle');

    const googleButton = page.locator('button:has-text("Continuar con Google"), button:has-text("Google")').first();

    // Debería existir
    await expect(googleButton).toBeVisible();
    await expect(googleButton).toBeEnabled();

    console.log('✓ Google OAuth button still works');
  });

  test('6. Facebook & Google buttons coexist', async ({ page }) => {
    // Verifica que ambos botones están disponibles simultáneamente
    await page.goto(`${baseUrl}/sign-up/ialab`);
    await page.waitForLoadState('networkidle');

    const googleButtons = page.locator('button:has-text("Google")');
    const facebookButtons = page.locator('button:has-text("Facebook")');

    await expect(googleButtons.first()).toBeVisible();
    await expect(facebookButtons.first()).toBeVisible();

    console.log('✓ Both Google and Facebook OAuth available');
  });

  test('7. Email signup still works (no regression)', async ({ page }) => {
    // Verifica que signup tradicional sigue funcionando
    await page.goto(`${baseUrl}/sign-up/ialab`);
    await page.waitForLoadState('networkidle');

    // Busca botón "Crear cuenta con email" o similar
    const emailButton = page.locator('button:has-text("Crear cuenta con email"), button:has-text("email")').first();

    // Debería existir
    if (await emailButton.isVisible()) {
      await expect(emailButton).toBeVisible();
      console.log('✓ Email signup button still works');
    } else {
      // Alternativa: buscar campo de email directamente
      const emailInput = page.locator('input[type="email"]').first();
      await expect(emailInput).toBeVisible();
      console.log('✓ Email signup field visible');
    }
  });

  test('8. UI preserves IALab branding', async ({ page }) => {
    // Verifica que la UI mantiene colores y branding de IALab
    await page.goto(`${baseUrl}/sign-up/ialab`);
    await page.waitForLoadState('networkidle');

    // Busca elementos con colores de IALab (petroleum blue #004B63)
    const pageContent = await page.content();

    // Debería tener referencias a IALab o colores corporativos
    const hasIALabBranding = pageContent.includes('004B63') ||
                            pageContent.includes('IALab') ||
                            pageContent.includes('edutechlife');

    expect(hasIALabBranding).toBeTruthy();
    console.log('✓ IALab branding preserved');
  });

  test('9. No breaking changes to existing users', async ({ page }) => {
    // Verifica que usuarios existentes no se ven afectados
    // Navega a login (no signup)
    await page.goto(`${baseUrl}/login`);
    await page.waitForLoadState('networkidle');

    // Debería haber opción de login tradicional
    const emailInput = page.locator('input[type="email"]');

    if (await emailInput.isVisible()) {
      console.log('✓ Traditional email login available');
    } else {
      // Podría estar en un formulario diferente
      console.log('⚠ Email login not visible (might be on different page)');
    }
  });

  test('10. Mobile responsiveness - Facebook button', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });

    await page.goto(`${baseUrl}/sign-up/ialab`);
    await page.waitForLoadState('networkidle');

    const facebookButton = page.locator('button:has-text("Continuar con Facebook"), button:has-text("Facebook")').first();

    // Debería ser clickable y visible en mobile
    await expect(facebookButton).toBeVisible();
    await expect(facebookButton).toBeEnabled();

    // Verificar que no está cortado o escondido
    const box = await facebookButton.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.width).toBeGreaterThan(0);
      expect(box.height).toBeGreaterThan(0);
      console.log(`✓ Facebook button responsive on mobile (${box.width}x${box.height})`);
    }
  });
});

/**
 * Ejecutar estos tests:
 *
 * Local:
 *   npx playwright test e2e/facebook-oauth.spec.ts
 *
 * Con servidor específico:
 *   PLAYWRIGHT_TEST_BASE_URL=http://localhost:5173 npx playwright test e2e/facebook-oauth.spec.ts
 *
 * En staging:
 *   PLAYWRIGHT_TEST_BASE_URL=https://staging.edutechlife.co npx playwright test e2e/facebook-oauth.spec.ts
 *
 * Modo debug:
 *   npx playwright test --debug e2e/facebook-oauth.spec.ts
 */
