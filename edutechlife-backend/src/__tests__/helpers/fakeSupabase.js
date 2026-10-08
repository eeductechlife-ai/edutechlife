/**
 * Cliente de Supabase falso para pruebas de servicios y rutas.
 *
 * Cada tabla se responde con un valor `{ data, error }` fijo o con una función
 * que recibe el estado de la consulta (`{ table, ops }`, donde `ops` es la lista
 * de llamadas encadenadas: ['eq', 'student_id', 'x'], ['insert', {...}], …) y
 * devuelve el resultado. Devolver un `Error` hace que la consulta se rechace.
 * Las escrituras (insert/update/upsert/delete) quedan en `calls` para verificarlas.
 */
const READ_OPS = [
  'select', 'eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'in', 'is', 'not', 'or',
  'order', 'limit', 'range', 'ilike', 'like', 'filter', 'match', 'contains',
];
const WRITE_OPS = ['insert', 'update', 'upsert', 'delete'];

function createFakeSupabase(handlers = {}, rpcHandlers = {}) {
  const calls = [];

  function from(table) {
    const state = { table, ops: [] };
    const result = () => {
      const handler = handlers[table];
      const value = typeof handler === 'function' ? handler(state) : handler;
      return value === undefined ? { data: null, error: null } : value;
    };
    const settle = () => {
      const value = result();
      return value instanceof Error ? Promise.reject(value) : Promise.resolve(value);
    };
    const q = {};
    for (const op of READ_OPS) {
      q[op] = (...args) => {
        state.ops.push([op, ...args]);
        return q;
      };
    }
    for (const op of WRITE_OPS) {
      q[op] = (...args) => {
        state.ops.push([op, ...args]);
        calls.push({ table, op, args });
        return q;
      };
    }
    q.single = () => settle();
    q.maybeSingle = () => settle();
    q.then = (resolve, reject) => settle().then(resolve, reject);
    return q;
  }

  function rpc(name, args) {
    calls.push({ table: null, op: 'rpc', name, args });
    const handler = rpcHandlers[name];
    const value = typeof handler === 'function' ? handler(args) : handler;
    const out = value === undefined ? { data: null, error: null } : value;
    return out instanceof Error ? Promise.reject(out) : Promise.resolve(out);
  }

  return { from, rpc, calls, auth: {} };
}

/** ¿La consulta tiene esta operación con estos argumentos? (para elegir respuesta) */
function hasOp(state, name, ...args) {
  return state.ops.some(
    (op) => op[0] === name && args.every((a, i) => op[i + 1] === a)
  );
}

/**
 * Sustituye `require('@supabase/supabase-js')` por un cliente intercambiable:
 * los servicios crean su cliente al importarse, así que se entrega un proxy
 * estable y cada prueba fija con `use()` el cliente falso que quiere.
 */
function installSupabaseSdkStub() {
  const sdkPath = require.resolve('@supabase/supabase-js');
  let current = createFakeSupabase();
  const client = {
    from: (...a) => current.from(...a),
    rpc: (...a) => current.rpc(...a),
    auth: new Proxy({}, { get: (_, k) => current.auth?.[k] }),
  };
  require.cache[sdkPath] = {
    id: sdkPath,
    filename: sdkPath,
    loaded: true,
    exports: { createClient: () => client },
  };
  return { use: (fake) => { current = fake; return fake; } };
}

function freshRequire(modulePath) {
  const resolved = require.resolve(modulePath);
  delete require.cache[resolved];
  return require(modulePath);
}

module.exports = { createFakeSupabase, hasOp, installSupabaseSdkStub, freshRequire };
