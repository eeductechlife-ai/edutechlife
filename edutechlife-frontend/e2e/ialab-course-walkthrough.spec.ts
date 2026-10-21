import { test, expect } from './helpers/test';
import { signIn } from './helpers/session';
import { expectNoErrorScreen, settle, watchPage } from './helpers/watch';
import { CONTENT_ES } from '../src/components/IALab/constants/moduleContent/contentEs.js';
import { RESOURCES_ES } from '../src/components/IALab/constants/moduleResources/resourcesEs.js';
import { modules } from '../src/data/ialab.js';

/**
 * Recorre el curso completo como lo haría un estudiante: los 5 módulos, cada tema
 * y cada recurso (video, guía PDF, imagen y OVA). Los temas y recursos salen de
 * los mismos archivos de contenido que usa la app, así que un recurso nuevo entra
 * solo en la prueba.
 *
 * Para poder abrir todo sin completar la secuencia, se marcan todos los recursos
 * como vistos antes de cargar la página (la secuencia ya la cubren las pruebas
 * unitarias de useContentSequence).
 */

const EMAIL = 'e2e-tester@example.com';

type Topic = { title: string; resources: { id: string; type: string; title: string }[] };

function topicsOf(moduleId: number): Topic[] {
  const topics = CONTENT_ES[moduleId]?.overviewData?.topics || [];
  return topics.map((t: { title: string }) => ({
    title: t.title,
    resources: RESOURCES_ES[t.title]?.resources || [],
  }));
}

const ALL_IDS = modules.flatMap((m: { id: number }) =>
  topicsOf(m.id).flatMap((t) => t.resources.map((r) => r.id)),
);

test.describe('IALab — recorrido completo del curso', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page, 'ialab');
    await page.addInitScript(
      ({ key, ids }) => {
        try {
          localStorage.setItem(key, JSON.stringify(ids));
        } catch {
          /* sin storage */
        }
      },
      { key: `ialab_viewed_resources::${EMAIL}`, ids: ALL_IDS },
    );
  });

  for (const mod of modules as { id: number; title: string }[]) {
    test(`Módulo ${mod.id} (${mod.title}): cada tema y cada recurso abren sin errores`, async ({ page }) => {
      test.setTimeout(240_000);
      const watch = watchPage(page);
      await page.goto(`/ialab/${mod.id}`, { waitUntil: 'domcontentloaded' });
      // Con todo visto, el módulo abre en «¡Contenido completado!» y la lista de temas.
      await expect(page.getByText('Temas del módulo', { exact: true })).toBeVisible();

      for (const topic of topicsOf(mod.id)) {
        expect(topic.resources.length, `el tema «${topic.title}» no tiene recursos`).toBeGreaterThan(0);
        await page.getByRole('button', { name: new RegExp(escapeRegExp(topic.title)) }).first().click();

        for (const resource of topic.resources) {
          const button = page.getByTestId(`resource-btn-${resource.id}`).first();
          await expect(button, `falta el botón de ${resource.id}`).toBeVisible();
          await expect(button, `${resource.id} sigue bloqueado`).toBeEnabled();
          await button.click();
          const viewer = page.getByRole('dialog').last();
          await expect(viewer, `${resource.id} no abrió el visor`).toBeVisible();
          await page.waitForTimeout(1_500);
          await expectNoErrorScreen(page);
          // Se cierra con el botón del visor: Escape a veces no llega cuando el foco
          // queda dentro del PDF incrustado (hallazgo anotado aparte).
          await viewer.getByRole('button', { name: /Cerrar visor/ }).first().click();
          await expect(page.getByRole('dialog'), `${resource.id} no se cerró`).toHaveCount(0, { timeout: 10_000 });
        }
      }

      await settle(page, 1_000);
      await expectNoErrorScreen(page);
      expect(watch.problems).toEqual([]);
    });
  }
});

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
