import type { BrowserContext, Page } from '@playwright/test';

/**
 * E2E auth helper.
 *
 * The app gates protected routes (RoleProtectedRoute) purely on a Supabase
 * `auth_token` in localStorage — Clerk is only used for signOut, and the
 * role check is currently a no-op. So to drive an "authenticated" session in
 * tests we just seed localStorage before the app boots. No real credentials,
 * no network login, no secrets in the repo.
 *
 * NOTE: this only satisfies the *client-side* route guard. Any request the UI
 * makes to the backend with this token will 401 (the server validates the
 * real Supabase JWT). That's fine for UI/navigation flows and local-first
 * features (VAK, flashcards, points) — but flows that need a live backend
 * response (e.g. Dani's streamed reply) will show their error state, not real
 * data. Those need a real test session and are out of scope here.
 */

// Clearly-fake, well-formed-ish placeholder. Never a real token.
const FAKE_TOKEN = 'e2e.fake.token';
const TEST_EMAIL = 'e2e-tester@example.com';

/**
 * Seed an authenticated session on a browser context. Because it uses
 * addInitScript, every page/navigation in the context starts logged-in.
 */
export async function seedAuthedSession(
  context: BrowserContext,
  { token = FAKE_TOKEN, email = TEST_EMAIL } = {},
): Promise<void> {
  await context.addInitScript(
    ([t, e]) => {
      try {
        localStorage.setItem('auth_token', t);
        localStorage.setItem('user_email', e);
      } catch {
        /* localStorage may be unavailable on about:blank — ignore */
      }
    },
    [token, email],
  );
}

/** Same as above but for a single page's context (convenience). */
export async function seedAuthedPage(page: Page): Promise<void> {
  await seedAuthedSession(page.context());
}
