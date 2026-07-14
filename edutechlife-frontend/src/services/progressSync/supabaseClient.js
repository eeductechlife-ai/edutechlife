/**
 * Servicio de sincronización de progreso entre localStorage y Supabase
 *
 * Funciona con:
 * - Cliente JWT (cuando Supabase verifica Clerk JWT)
 * - Cliente anon key (fallback cuando JWT no se verifica)
 *
 * En ambos modos, el user_id se filtra en las queries de la app.
 */

export {
  supabase,
  createClerkSupabaseClient,
  initSupabaseClient,
} from "../../lib/supabase.js";
