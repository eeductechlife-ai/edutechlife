// Servicio de instituciones (tenants B2B) para el panel de Valeria (admin interno).
// Lee/escribe las tablas de instituciones y membresías en Supabase.
// Tablas: public.institutions, public.institution_members
// (ver supabase_institutions_schema.sql).

const VALID_PLANS = ["basico", "premium", "enterprise"];

/**
 * Trae las instituciones registradas (admin: todas; usuario: las suyas, por RLS).
 * @param {object} client - Cliente Supabase (con JWT de Clerk)
 * @param {object} opts - { limit }
 * @returns {Promise<Array>} filas de institutions
 */
export async function fetchInstitutions(client, opts = {}) {
  if (!client) return [];
  const { limit = 200 } = opts;
  const { data, error } = await client
    .from("institutions")
    .select("*")
    .order("name", { ascending: true })
    .limit(limit);
  if (error) throw new Error(error.message);
  return data || [];
}

/**
 * Trae los miembros de una institución (por RLS, solo si el usuario pertenece
 * a esa institución o es admin interno).
 * @param {object} client - Cliente Supabase
 * @param {string} institutionId - uuid de la institución
 * @returns {Promise<Array>} filas de institution_members
 */
export async function fetchInstitutionMembers(client, institutionId) {
  if (!client || !institutionId) return [];
  const { data, error } = await client
    .from("institution_members")
    .select("*")
    .eq("institution_id", institutionId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

/**
 * Crea una nueva institución (solo admin interno, por RLS).
 * Silencioso ante fallos de argumentos; propaga errores de Supabase.
 * @param {object} client - Cliente Supabase
 * @param {object} params - { name, slug, city, contactEmail, plan }
 * @returns {Promise<{ok: boolean, data?: object, error?: string}>}
 */
export async function createInstitution(
  client,
  { name, slug, city, contactEmail, plan = "basico" } = {},
) {
  if (!client || !name || !slug) return { ok: false, error: "missing args" };
  if (!VALID_PLANS.includes(plan)) return { ok: false, error: "invalid plan" };

  try {
    const { data, error } = await client
      .from("institutions")
      .insert({
        name,
        slug,
        city: city || null,
        contact_email: contactEmail || null,
        plan,
      })
      .select()
      .single();
    if (error) return { ok: false, error: error.message };
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}
