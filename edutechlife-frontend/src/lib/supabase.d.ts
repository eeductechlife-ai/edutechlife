import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Declaración de tipos para lib/supabase.js (JS puro).
 * El Proxy transparente `supabase` es un SupabaseClient delegado, así que
 * TS debe verlo con la API completa (from, channel, auth, ...).
 */

export declare function createSupabaseClient(
  accessToken?: string | null,
): SupabaseClient;

export declare function initSupabaseClient(clerkToken?: string | null): void;

export declare const supabase: SupabaseClient;

export declare function getCurrentClient(): SupabaseClient | null;

export default supabase;
