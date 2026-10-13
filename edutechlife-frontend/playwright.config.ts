import { defineConfig } from '@playwright/test';

/**
 * E2E contra el BUILD de producción servido con `vite preview` (no contra el
 * servidor de desarrollo: transformar cada ruta en frío tardaba 10-30 s y el job
 * de CI se cancelaba por tiempo).
 *
 *   npm run build:e2e      # compila con un Supabase ficticio (e2e.supabase.co)
 *   npm run test:e2e       # sirve `dist` y corre las pruebas
 *
 * Las pruebas que necesitan sesión usan `helpers/session.ts`: simulan Supabase y
 * la API del backend con `page.route`, así que no hacen falta credenciales.
 *
 * Las capturas de pantalla (`@visual`) dependen del sistema operativo y de las
 * fuentes, por eso no corren por defecto: `npm run test:e2e:visual`.
 */
const PORT = Number(process.env.E2E_PORT || 4173);
const baseURL = process.env.E2E_BASE_URL || `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  // La app se sirve compilada pero parte en ~200 archivos: con varias pruebas a la
  // vez la primera carga puede pasar de 8 s, por eso los márgenes son holgados.
  timeout: 45_000,
  expect: { timeout: 15_000 },
  reporter: process.env.CI
    ? [['list'], ['html', { open: 'never' }]]
    : [['list']],
  grepInvert: process.env.E2E_VISUAL ? undefined : /@visual/,
  use: {
    baseURL,
    // La app respeta «reducir movimiento»: sin animaciones ni partículas las
    // pruebas son más rápidas y deterministas (y aguantan un equipo cargado).
    contextOptions: { reducedMotion: 'reduce' },
    trace: 'on-first-retry',
    screenshot: process.env.CI ? 'only-on-failure' : 'off',
  },
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: `npx vite preview --port ${PORT} --strictPort`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
      },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'mobile',
      use: { browserName: 'chromium', viewport: { width: 375, height: 812 } },
    },
  ],
});
