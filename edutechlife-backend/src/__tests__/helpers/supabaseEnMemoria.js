/**
 * Base de datos en memoria con la forma de cadena de Supabase (select, eq,
 * gt, order, limit, maybeSingle, insert, update, upsert). Pensada para probar
 * flujos de varias tablas sin escribir respuestas a mano.
 */
function crearBaseEnMemoria() {
  const tablas = {};
  let secuencia = 1;

  function filasDe(nombre) {
    if (!tablas[nombre]) tablas[nombre] = [];
    return tablas[nombre];
  }

  function from(nombre) {
    const e = { filtros: [], orden: null, limite: null, single: false, op: 'select', valores: null, cambios: null, conflicto: null, ignorar: false };

    function ejecutar() {
      const filas = filasDe(nombre);
      if (e.op === 'insert') {
        const lista = Array.isArray(e.valores) ? e.valores : [e.valores];
        const nuevas = lista.map((v) => ({ id: secuencia++, created_at: new Date().toISOString(), ...v }));
        filas.push(...nuevas);
        return { data: e.single ? nuevas[0] : nuevas, error: null };
      }
      if (e.op === 'upsert') {
        const claves = e.conflicto.split(',');
        const existente = filas.find((r) => claves.every((c) => r[c] === e.valores[c]));
        if (existente) {
          if (!e.ignorar) Object.assign(existente, e.valores);
        } else {
          filas.push({ id: secuencia++, ...e.valores });
        }
        return { data: e.valores, error: null };
      }
      let coincidentes = filas.filter((r) => e.filtros.every((f) => f(r)));
      if (e.op === 'update') {
        coincidentes.forEach((r) => Object.assign(r, e.cambios));
        return { data: e.single ? (coincidentes[0] ?? null) : coincidentes, error: null };
      }
      if (e.orden) {
        const { col, asc } = e.orden;
        coincidentes = [...coincidentes].sort((a, b) => (a[col] > b[col] ? 1 : -1) * (asc ? 1 : -1));
      }
      const salida = e.limite != null ? coincidentes.slice(0, e.limite) : coincidentes;
      return { data: e.single ? (salida[0] ?? null) : salida, error: null };
    }

    const q = {
      select() { return q; },
      eq(c, v) { e.filtros.push((r) => r[c] === v); return q; },
      neq(c, v) { e.filtros.push((r) => r[c] !== v); return q; },
      gt(c, v) { e.filtros.push((r) => r[c] > v); return q; },
      order(col, { ascending = true } = {}) { e.orden = { col, asc: ascending }; return q; },
      limit(n) { e.limite = n; return q; },
      maybeSingle() { e.single = true; return q; },
      single() { e.single = true; return q; },
      insert(v) { e.op = 'insert'; e.valores = v; return q; },
      update(c) { e.op = 'update'; e.cambios = c; return q; },
      upsert(v, { onConflict, ignoreDuplicates } = {}) { e.op = 'upsert'; e.valores = v; e.conflicto = onConflict; e.ignorar = Boolean(ignoreDuplicates); return q; },
      then(ok, ko) { return Promise.resolve(ejecutar()).then(ok, ko); },
    };
    return q;
  }

  function limpiar() {
    for (const k of Object.keys(tablas)) delete tablas[k];
  }

  return { from, filasDe, limpiar, tablas };
}

module.exports = { crearBaseEnMemoria };
