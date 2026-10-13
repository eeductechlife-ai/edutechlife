import { test, expect } from './helpers/test';
import { expectNoErrorScreen, settle, watchPage } from './helpers/watch';

/**
 * Páginas públicas de edutechlife.co (sin sesión): cada una debe cargar sin
 * errores y presentarse bien a buscadores y a quien comparte el enlace.
 */
const PUBLIC_ROUTES = [
  { path: '/', name: 'inicio', title: /Educaci[oó]n.*IA/i },
  { path: '/ialab-academic', name: 'catálogo de IALab', title: /IALab Academic/i },
  { path: '/conoce-ingenia', name: 'qué es IngenIA', title: /IngenIA/i },
  { path: '/planes', name: 'planes', title: /planes/i },
  { path: '/neuroentorno', name: 'NeuroEntorno', title: /NeuroEntorno/i },
  { path: '/proyectos', name: 'proyectos nacionales', title: /Proyectos/i },
  { path: '/consultoria', name: 'consultoría educativa', title: /Consultor[ií]a/i },
  { path: '/consultoria-b2b', name: 'consultoría B2B', title: /B2B/i },
  { path: '/automation', name: 'automatización', title: /Automatizaci[oó]n/i },
  { path: '/vak', name: 'ADN de Aprendizaje', title: /ADN de Aprendizaje/i },
  { path: '/login', name: 'iniciar sesión', title: /Iniciar Sesi[oó]n/i },
  { path: '/sign-up/ingenia', name: 'registro de IngenIA', title: /Registro IngenIA/i },
] as const;

test.describe('Páginas públicas', () => {
  for (const route of PUBLIC_ROUTES) {
    test.describe(`${route.path} (${route.name})`, () => {
      test('carga sin errores de JavaScript ni peticiones caídas', async ({ page }) => {
        const watch = watchPage(page);
        const res = await page.goto(route.path, { waitUntil: 'domcontentloaded' });
        expect(res?.status()).toBe(200);
        await expect(page.getByRole('main').or(page.locator('main, [role="main"], #root > *').first()).first()).toBeVisible();
        await settle(page);
        await expectNoErrorScreen(page);
        expect(watch.problems).toEqual([]);
      });

      test('se presenta bien a buscadores y al compartir el enlace', async ({ page }) => {
        await page.goto(route.path, { waitUntil: 'domcontentloaded' });

        // Título propio de la página, no uno genérico ni vacío.
        await expect(page).toHaveTitle(route.title);
        await expect(page).toHaveTitle(/Edutechlife/);

        // Una sola etiqueta de cada tipo: duplicadas, el buscador o WhatsApp
        // pueden quedarse con la equivocada.
        await expect(page.locator('meta[name="description"]')).toHaveCount(1);
        await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{40,}/);
        await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
        await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
        await expect(page.locator('meta[property="og:description"]')).toHaveCount(1);
        await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);

        // La imagen para compartir debe ser una URL completa y de un formato que
        // WhatsApp, Facebook y LinkedIn muestren (no SVG).
        const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
        expect(ogImage).toMatch(/^https:\/\/.+\.(png|jpe?g|webp)$/i);

        await expect(page.locator('html')).toHaveAttribute('lang', /^(es|en|pt)$/);
      });
    });
  }

  test('la portada termina con su pie de página', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.locator('footer').first()).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.locator('footer').first()).toContainText(/Edutechlife/i);
  });

  test('la portada presenta los dos productos: IALab e IngenIA', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const body = page.locator('body');
    // La portada los llama «AI Lab» (y «AI Lab Academic») e «IngenIA».
    await expect(body).toContainText(/AI ?Lab/i);
    await expect(body).toContainText(/IngenIA/);
  });

  test('una ruta que no existe muestra la página 404 de la marca', async ({ page }) => {
    await page.goto('/esta-ruta-no-existe', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toContainText(/404|no encontr|no existe/i);
  });
});
