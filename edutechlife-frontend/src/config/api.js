/**
 * API Configuration — single source of truth for API base URL.
 *
 * Resolution priority:
 *   1. VITE_API_BASE_URL (primary)
 *   2. VITE_API_URL (fallback)
 *   3. 'http://localhost:3001' (development default)
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:3001';
