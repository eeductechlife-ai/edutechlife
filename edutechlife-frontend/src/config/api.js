/**
 * API Configuration — single source of truth for API base URL.
 *
 * Resolution priority:
 *   1. VITE_API_BASE_URL (primary)
 *   2. VITE_API_URL (fallback)
 *   3. Development default ('http://localhost:3001') or production backend
 *      ('https://edutechlife-backend.onrender.com')
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://localhost:3001"
    : "https://edutechlife-backend.onrender.com");
