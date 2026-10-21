// Nombre y avatar de otros usuarios (ranking, racha, foro).
// Lee vía la función perfiles_publicos (migración 113), que nunca devuelve
// correo ni teléfono. Leer la tabla profiles directamente dejaría de funcionar
// cuando la migración 114 cierre la tabla a su propio dueño.
const LOTE = 200;

export async function fetchPerfilesPublicos(supabase, ids) {
  const unicos = [...new Set((ids || []).filter(Boolean))];
  const perfiles = {};
  for (let i = 0; i < unicos.length; i += LOTE) {
    const { data, error } = await supabase.rpc("perfiles_publicos", {
      p_ids: unicos.slice(i, i + LOTE),
    });
    if (error) {
      console.warn("[perfilesPublicos]", error.message);
      continue;
    }
    (data || []).forEach((p) => {
      perfiles[p.id] = p;
    });
  }
  return perfiles;
}
