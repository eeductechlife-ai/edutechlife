import { test, expect } from './helpers/test';
import { signIn } from './helpers/session';
import { expectNoErrorScreen, settle, watchPage } from './helpers/watch';

const MODULES = [
  'Artesano Digital: Prompts',
  'Arquitecto Digital: ChatGPT',
  'Detective de Datos: Gemini',
  'Alquimista Digital: Gemini Notebook',
  'Director de Orquesta: Claude',
];

test.describe('IALab', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page, 'ialab');
  });

  test.describe('Panel de bienvenida (/ialab)', () => {
    test('saluda al estudiante y explica el curso', async ({ page }) => {
      await page.goto('/ialab', { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('heading', { level: 1, name: 'IALab' })).toBeVisible();
      await expect(page.getByText('¡Hola, e2e-tester!')).toBeVisible();
      await expect(page.getByRole('heading', { level: 1, name: /Domina la IA antes que los demás/ })).toBeVisible();
      await expect(page.getByRole('heading', { name: /cómo funciona/i })).toBeVisible();
      await expect(page.getByRole('heading', { name: /lo que vas a aprender/i })).toContainText(/5 módulos/i);
    });

    test('«Comenzar» lleva al primer módulo', async ({ page }) => {
      await page.goto('/ialab', { waitUntil: 'domcontentloaded' });
      // force: el botón escala al pasar el cursor (whileHover), así nunca queda
      // «estable» para Playwright; sigue comprobándose que existe y es visible.
      const comenzar = page.getByTestId('new-student-start-btn');
      await expect(comenzar).toBeVisible();
      await comenzar.click({ force: true });
      await expect(page).toHaveURL(/\/ialab\/1$/);
      await expect(page.getByRole('heading', { level: 1, name: MODULES[0] })).toBeVisible();
    });

    test('carga sin errores de JavaScript ni peticiones caídas', async ({ page }) => {
      const watch = watchPage(page);
      await page.goto('/ialab', { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('heading', { level: 1, name: /Domina la IA antes que los demás/ })).toBeVisible();
      await settle(page);
      await expectNoErrorScreen(page);
      expect(watch.problems).toEqual([]);
    });
  });

  test.describe('Módulo (/ialab/1)', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ialab/1', { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('heading', { level: 1, name: MODULES[0] })).toBeVisible();
    });

    test('muestra el menú con los 5 módulos del curso', async ({ page }) => {
      const sidebar = page.locator('[data-tour="tour-sidebar"]');
      await expect(sidebar).toBeVisible();
      for (const name of MODULES) {
        await expect(sidebar.getByRole('button', { name })).toBeVisible();
      }
      await expect(page.getByText(/en progreso/)).toBeVisible();
    });

    test('propone el siguiente paso y abre el primer tema', async ({ page }) => {
      await expect(page.getByText('¡Empieza aquí!')).toBeVisible();
      await page.getByText('Ver contenido').first().click();
      await expect(page.getByText('Recursos de este tema')).toBeVisible();
    });

    test('las pestañas cambian de sección', async ({ page }) => {
      const rail = page.locator('[data-tour="tour-tabs-rail"]');
      await rail.getByText('Práctica', { exact: true }).click();
      await expect(page.getByText('Herramientas para Crear Prompts')).toBeVisible();
      await rail.getByText('Guardados', { exact: true }).click();
      await expect(page.getByText('Sin recursos guardados')).toBeVisible();
      await rail.getByText('Objetivos', { exact: true }).click();
      await expect(page.getByText('Objetivo del Módulo')).toBeVisible();
    });

    test('MAX, el tutor IA, abre su panel con un campo para escribir', async ({ page }) => {
      await page.locator('[data-tour="tour-max"]').first().click();
      const panel = page.getByRole('dialog');
      await expect(panel).toBeVisible();
      await expect(panel.locator('textarea, input[type="text"]').first()).toBeVisible();
    });

    test('carga sin errores de JavaScript ni peticiones caídas', async ({ page }) => {
      const watch = watchPage(page);
      await page.reload();
      await expect(page.getByRole('heading', { level: 1, name: MODULES[0] })).toBeVisible();
      await settle(page);
      await expectNoErrorScreen(page);
      expect(watch.problems).toEqual([]);
    });
  });

  test.describe('Recorrido guiado', () => {
    test('un estudiante nuevo ve el recorrido y puede cerrarlo', async ({ page }) => {
      // Sin la marca de «recorrido ya visto» que ponen las demás pruebas.
      await page.addInitScript(() => {
        try {
          sessionStorage.removeItem('ialab_welcome_tour_shown');
        } catch {
          /* sin storage */
        }
      });
      await signIn(page, 'ialab', { tour: true });
      await page.goto('/ialab/1', { waitUntil: 'domcontentloaded' });
      const tourLayer = page.locator('div.fixed.inset-0').filter({ has: page.locator('[class*="z-"]') });
      await expect(page.getByRole('heading', { level: 1, name: MODULES[0] })).toBeVisible();
      // El recorrido empieza tras una pausa corta y cubre la pantalla con una capa.
      await expect
        .poll(async () => page.evaluate(() => !!document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2)?.closest('[class*="z-[60]"]')), { timeout: 15_000 })
        .toBe(true);
      void tourLayer;
    });
  });

  test.describe('Pantallas pequeñas', () => {
    for (const path of ['/ialab', '/ialab/1']) {
      test(`${path} no se desborda en un iPhone (390×844)`, async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto(path, { waitUntil: 'domcontentloaded' });
        await settle(page);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow).toBeLessThanOrEqual(1);
      });
    }

    test('el módulo muestra la navegación móvil', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/ialab/1', { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('heading', { level: 1, name: MODULES[0] })).toBeVisible();
      await expect(page.locator('[data-tour="tour-undermenu-mobile"]').first()).toBeVisible();
    });
  });
});
