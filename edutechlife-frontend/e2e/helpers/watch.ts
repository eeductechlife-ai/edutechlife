import { expect, type Page } from '@playwright/test';

/**
 * Vigila lo que la gente vería como «algo falló» en una página: errores de
 * JavaScript, errores de consola y respuestas HTTP >= 400 o peticiones caídas
 * de NUESTRO sitio (mismo origen) y del Supabase simulado.
 *
 * Se ignoran a propósito los servicios de terceros (fuentes, YouTube, analítica,
 * CDN) y los abortos que hace el navegador solo (vídeo por rangos, navegación):
 * no dependen de nosotros y harían las pruebas inestables.
 */
export interface PageWatch {
  problems: string[];
}

const SUPABASE_E2E = 'e2e.supabase.co';

export function watchPage(page: Page): PageWatch {
  const problems: string[] = [];
  const origin = () => new URL(page.url() === 'about:blank' ? 'http://localhost' : page.url()).origin;
  const isOurs = (url: string) => {
    try {
      const u = new URL(url);
      return u.origin === origin() || u.host === SUPABASE_E2E;
    } catch {
      return false;
    }
  };

  page.on('pageerror', (err) => problems.push(`pageerror: ${err.message.slice(0, 200)}`));
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const text = msg.text();
    // «Failed to load resource» ya lo cubren response/requestfailed, con la URL.
    if (text.startsWith('Failed to load resource')) return;
    problems.push(`console.error: ${text.slice(0, 200)}`);
  });
  page.on('response', (res) => {
    if (res.status() >= 400 && isOurs(res.url())) {
      problems.push(`HTTP ${res.status()} ${res.url().slice(0, 120)}`);
    }
  });
  page.on('requestfailed', (req) => {
    const reason = req.failure()?.errorText || '';
    if (reason.includes('ERR_ABORTED')) return;
    if (isOurs(req.url())) problems.push(`request failed (${reason}) ${req.url().slice(0, 120)}`);
  });

  return { problems };
}

/**
 * Deja que la página cargue y la observa unos segundos antes de dar nada por
 * bueno. Sustituye a `waitForLoadState('networkidle')`: hay páginas que nunca
 * llegan a «red inactiva» (conexiones abiertas, vídeo, analítica), y un fallo
 * al renderizar un componente cargado de forma diferida (p. ej. /neuroentorno)
 * ocurre 1-2 s DESPUÉS de la carga, cuando «red inactiva» ya pasó.
 */
export async function settle(page: Page, ms = 3_000): Promise<void> {
  await page.waitForLoadState('load');
  await page.waitForTimeout(ms);
}

/**
 * ¿Se ve la pantalla de error de la app («Algo salió mal»)? Un componente que
 * revienta al renderizar no siempre deja un error de consola visible (el build de
 * producción elimina los `console`), pero sí esta pantalla.
 */
export async function expectNoErrorScreen(page: Page): Promise<void> {
  await expect(page.getByRole('alert').filter({ hasText: 'Algo salió mal' })).toHaveCount(0);
}
