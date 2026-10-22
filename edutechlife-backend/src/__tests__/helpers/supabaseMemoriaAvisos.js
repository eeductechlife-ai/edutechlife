/**
 * Supabase simulado en memoria para probar los avisos a padres. Respeta las
 * claves únicas (error 23505), porque el comportamiento anti-duplicado de los
 * avisos depende de ellas. Soporta lo que usan los servicios: select, insert,
 * upsert, update, delete, eq, in, gte, lt, limit, maybeSingle.
 *
 * estado = { tablas: { nombre: [filas] }, unicas: { nombre: ['col', ...] }, fallos: { nombre: true } }
 */
function crearSupabaseFalso(estado) {
  const clave = (fila, cols) => cols.map((c) => String(fila[c])).join('|');

  return {
    from(nombre) {
      const q = { op: 'select', filtros: [], valores: null, limite: null, onConflict: null };
      const filas = () => (estado.tablas[nombre] = estado.tablas[nombre] || []);

      const coincide = (f) =>
        q.filtros.every(([col, cmp, val]) => {
          if (cmp === 'eq') return f[col] === val;
          if (cmp === 'in') return val.includes(f[col]);
          if (cmp === 'gte') return Date.parse(f[col]) >= Date.parse(val);
          return Date.parse(f[col]) < Date.parse(val);
        });

      const insertar = (fila) => {
        const cols = estado.unicas?.[nombre];
        if (cols && filas().some((f) => clave(f, cols) === clave(fila, cols))) {
          return { error: { code: '23505', message: 'duplicate key' } };
        }
        filas().push({ ...fila });
        return { error: null };
      };

      const ejecutar = async () => {
        if (estado.fallos?.[nombre]) return { data: null, error: { code: 'XX000', message: 'boom' } };

        if (q.op === 'insert') {
          for (const fila of [].concat(q.valores)) {
            const r = insertar(fila);
            if (r.error) return { data: null, error: r.error };
          }
          return { data: null, error: null };
        }
        if (q.op === 'upsert') {
          const cols = q.onConflict.split(',');
          const existente = filas().find((f) => clave(f, cols) === clave(q.valores, cols));
          if (existente) Object.assign(existente, q.valores);
          else filas().push({ ...q.valores });
          return { data: null, error: null };
        }
        const objetivo = filas().filter(coincide);
        if (q.op === 'update') {
          objetivo.forEach((f) => Object.assign(f, q.valores));
          return { data: objetivo.map((f) => ({ ...f })), error: null };
        }
        if (q.op === 'delete') {
          estado.tablas[nombre] = filas().filter((f) => !coincide(f));
          return { data: null, error: null };
        }
        let data = objetivo.map((f) => ({ ...f }));
        if (q.limite) data = data.slice(0, q.limite);
        return { data, error: null };
      };

      const b = {
        select: () => b,
        eq: (col, val) => (q.filtros.push([col, 'eq', val]), b),
        in: (col, val) => (q.filtros.push([col, 'in', val]), b),
        gte: (col, val) => (q.filtros.push([col, 'gte', val]), b),
        lt: (col, val) => (q.filtros.push([col, 'lt', val]), b),
        limit: (n) => ((q.limite = n), b),
        maybeSingle: () => ({
          then: (res, rej) =>
            ejecutar()
              .then((r) => ({ data: Array.isArray(r.data) ? (r.data[0] ?? null) : r.data, error: r.error }))
              .then(res, rej),
        }),
        insert: (v) => ((q.op = 'insert'), (q.valores = v), b),
        upsert: (v, o) => ((q.op = 'upsert'), (q.valores = v), (q.onConflict = o?.onConflict), b),
        update: (v) => ((q.op = 'update'), (q.valores = v), b),
        delete: () => ((q.op = 'delete'), b),
        then: (res, rej) => ejecutar().then(res, rej),
      };
      return b;
    },
  };
}

/** Instala el simulado en la caché de módulos antes de cargar el servicio a probar. */
function instalarSupabaseFalso(rutaModulo, estado) {
  const falso = crearSupabaseFalso(estado);
  require.cache[rutaModulo] = { id: rutaModulo, filename: rutaModulo, loaded: true, exports: falso };
  return falso;
}

module.exports = { crearSupabaseFalso, instalarSupabaseFalso };
