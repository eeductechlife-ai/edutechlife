import type { Page } from '@playwright/test';
import { test, expect } from './helpers/test';
import { signIn, skipIngeniaWelcome } from './helpers/session';
import { expectNoErrorScreen, watchPage } from './helpers/watch';

/** Pulsa una sección de la navegación principal (la que esté visible: escritorio o móvil). */
async function goTo(page: Page, section: 'Inicio' | 'Aprender' | 'Practicar' | 'Explorar' | 'Yo') {
  await page.locator('nav:visible').first().getByText(section, { exact: true }).click();
}

test.describe('IngenIA: páginas públicas', () => {
  test('/conoce-ingenia presenta el producto', async ({ page }) => {
    const res = await page.goto('/conoce-ingenia', { waitUntil: 'domcontentloaded' });
    expect(res?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/acompañamiento/i);
    await expect(page).toHaveTitle(/IngenIA/);
  });

  test('sin sesión, /ingenia lleva al registro de IngenIA', async ({ page }) => {
    await page.goto('/ingenia', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/sign-up\/ingenia/);
    await expect(page).toHaveTitle(/Registro IngenIA/);
  });

  test('el registro tiene el botón para ver la contraseña con nombre accesible', async ({ page }) => {
    await page.goto('/sign-up/ingenia', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('button', { name: 'Mostrar u ocultar la contraseña' }).first()).toBeVisible();
  });

  test('las rutas del nombre anterior (SmartBoard) siguen funcionando', async ({ page }) => {
    await page.goto('/conoce-smartboard', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/conoce-ingenia$/);
    await page.goto('/sign-up/smartboard', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/sign-up\/ingenia$/);
  });
});

test.describe('IngenIA: estudiante con sesión', () => {
  test('la primera vez recibe la bienvenida y puede explorar por su cuenta', async ({ page }) => {
    await signIn(page, 'ingenia');
    await page.goto('/ingenia', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('¡Bienvenido/a a IngenIA!')).toBeVisible();
    await expect(page.getByRole('button', { name: /Descubrir mi estilo de aprendizaje/ })).toBeVisible();
    await skipIngeniaWelcome(page);
    await expect(page.getByText('¡Hola, Sofía!')).toBeVisible();
  });

  test.describe('con la bienvenida cerrada', () => {
    test.beforeEach(async ({ page }) => {
      await signIn(page, 'ingenia');
      await page.goto('/ingenia', { waitUntil: 'domcontentloaded' });
      await skipIngeniaWelcome(page);
    });

    test('el inicio saluda por su nombre y propone el día', async ({ page }) => {
      await expect(page.getByText('¡Hola, Sofía!')).toBeVisible();
      await expect(page.getByText('Tu día en 3 pasos')).toBeVisible();
      await expect(page.getByText(/tu siguiente actividad/i)).toBeVisible();
    });

    test('muestra las cinco secciones de la navegación', async ({ page }) => {
      const nav = page.locator('nav:visible').first();
      for (const name of ['Inicio', 'Aprender', 'Practicar', 'Explorar', 'Yo']) {
        await expect(nav.getByText(name, { exact: true })).toBeVisible();
      }
    });

    test('Aprender lista las materias', async ({ page }) => {
      await goTo(page, 'Aprender');
      await expect(page.getByText('Mis Materias')).toBeVisible();
      await expect(page.getByText('Matemáticas').first()).toBeVisible();
    });

    test('Practicar pide elegir materia y muestra la semana', async ({ page }) => {
      await goTo(page, 'Practicar');
      await expect(page.getByText(/Practica un poquito cada día/)).toBeVisible();
      await expect(page.getByText(/Meta: 0\/4 días/)).toBeVisible();
    });

    test('Explorar muestra las misiones', async ({ page }) => {
      await goTo(page, 'Explorar');
      await expect(page.getByText('Mis Misiones').first()).toBeVisible();
      await expect(page.getByText(/Misiones de la semana/)).toBeVisible();
    });

    test('Yo muestra el perfil del estudiante', async ({ page }) => {
      await goTo(page, 'Yo');
      await expect(page.getByText('Grado 5')).toBeVisible();
      await expect(page.getByText(/11 años/)).toBeVisible();
    });

    test('recorrer las secciones no produce errores', async ({ page }) => {
      test.setTimeout(90_000);
      const watch = watchPage(page);
      const recorrido = [
        ['Aprender', 'Mis Materias'],
        ['Practicar', /Practica un poquito cada día/],
        ['Explorar', 'Mis Misiones'],
        ['Yo', 'Grado 5'],
        ['Inicio', '¡Hola, Sofía!'],
      ] as const;
      for (const [section, contenido] of recorrido) {
        await goTo(page, section);
        // Esperar al contenido de la sección (no a «red inactiva»: la app mantiene
        // conexiones abiertas y nunca llega a estarlo).
        await expect(page.getByText(contenido).first()).toBeVisible();
        await expectNoErrorScreen(page);
      }
      expect(watch.problems).toEqual([]);
    });
  });

  test('en un teléfono (390×844) no se desborda y usa la navegación inferior', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await signIn(page, 'ingenia');
    await page.goto('/ingenia', { waitUntil: 'domcontentloaded' });
    await skipIngeniaWelcome(page);
    await expect(page.getByText('¡Hola, Sofía!')).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await expect(page.locator('nav:visible').first().getByText('Practicar', { exact: true })).toBeVisible();
  });
});
