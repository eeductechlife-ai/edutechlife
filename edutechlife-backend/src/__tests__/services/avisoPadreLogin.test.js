/**
 * Aviso al padre/acudiente cuando un menor inicia sesión en IngenIA
 * (services/avisoPadreLogin.js). Decisión del CEO 2026-10-13: no se bloquea
 * el acceso del niño; solo se avisa al padre, máximo un correo cada 24 h.
 *
 * La base se simula con un almacén en memoria que respeta los filtros usados
 * por el servicio (eq, lt, limit, maybeSingle, insert con clave única,
 * update condicional y delete), para probar también la reserva anti-spam.
 */

const supabasePath = require.resolve('../../db/supabase');
const emailPath = require.resolve('../../services/emailService');
const loggerPath = require.resolve('../../utils/logger');

const mockEmail = { sendEmail: vi.fn() };
const mockLogger = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() };

let tablas;

function crearSupabaseFalso() {
  return {
    from(nombre) {
      const q = { op: 'select', filtros: [], set: null, limite: null, maybe: false };
      const ejecutar = async () => {
        if (tablas.__error === nombre) {
          return { data: null, error: { message: 'boom', code: 'XX000' } };
        }
        const filas = (tablas[nombre] = tablas[nombre] || []);
        const coincide = (f) =>
          q.filtros.every(([col, cmp, val]) =>
            cmp === 'eq' ? f[col] === val : Date.parse(f[col]) < Date.parse(val),
          );
        if (q.op === 'insert') {
          const clave = filas.find((f) => f.student_id === q.set.student_id);
          if (clave) return { data: null, error: { message: 'duplicate', code: '23505' } };
          filas.push({ ...q.set });
          return { data: [{ ...q.set }], error: null };
        }
        const objetivo = filas.filter(coincide);
        if (q.op === 'update') {
          objetivo.forEach((f) => Object.assign(f, q.set));
          return { data: objetivo.map((f) => ({ ...f })), error: null };
        }
        if (q.op === 'delete') {
          tablas[nombre] = filas.filter((f) => !coincide(f));
          return { data: objetivo, error: null };
        }
        let data = objetivo.map((f) => ({ ...f }));
        if (q.limite) data = data.slice(0, q.limite);
        if (q.maybe) return { data: data[0] ?? null, error: null };
        return { data, error: null };
      };
      const b = {
        select: () => b,
        eq: (col, val) => (q.filtros.push([col, 'eq', val]), b),
        lt: (col, val) => (q.filtros.push([col, 'lt', val]), b),
        limit: (n) => ((q.limite = n), b),
        maybeSingle: () => ((q.maybe = true), b),
        insert: (fila) => ((q.op = 'insert'), (q.set = fila), b),
        update: (v) => ((q.op = 'update'), (q.set = v), b),
        delete: () => ((q.op = 'delete'), b),
        then: (res, rej) => ejecutar().then(res, rej),
      };
      return b;
    },
  };
}

const supabaseFalso = crearSupabaseFalso();
require.cache[supabasePath] = { id: supabasePath, filename: supabasePath, loaded: true, exports: supabaseFalso };
require.cache[emailPath] = { id: emailPath, filename: emailPath, loaded: true, exports: mockEmail };
require.cache[loggerPath] = { id: loggerPath, filename: loggerPath, loaded: true, exports: mockLogger };

const { avisarInicioSesionMenor, construirAviso } = require('../../services/avisoPadreLogin');

const NIÑO = '11111111-1111-4111-8111-111111111111';
const PADRE = '22222222-2222-4222-8222-222222222222';
const PADRE_2 = '33333333-3333-4333-8333-333333333333';
const AHORA = new Date('2026-10-13T20:04:00.000Z'); // 15:04 en Bogotá

function sembrar({ edad = 10, vinculos = [{ parent: PADRE }], nombre = 'Mateo Pérez' } = {}) {
  tablas = {
    students: [{ auth_id: NIÑO, name: nombre, age: edad }],
    users: [
      { id: NIÑO, first_name: 'Mateo', email: 'nino@ejemplo.co' },
      { id: PADRE, email: 'padre@ejemplo.co' },
      { id: PADRE_2, email: 'madre@ejemplo.co' },
    ],
    parent_student_links: vinculos.map((v) => ({
      parent_user_id: v.parent,
      student_user_id: NIÑO,
      is_active: v.activo ?? true,
    })),
    aviso_padre_login: [],
  };
}

describe('avisarInicioSesionMenor', () => {
  const prev = process.env.RESEND_API_KEY;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RESEND_API_KEY = 're_test';
    mockEmail.sendEmail.mockResolvedValue({ success: true, messageId: 'm1' });
    sembrar();
  });

  afterAll(() => {
    if (prev === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = prev;
  });

  test('menor con padre vinculado: envía un correo al padre', async () => {
    const r = await avisarInicioSesionMenor(NIÑO, { ahora: AHORA });

    expect(r).toEqual({ enviado: true, motivo: 'enviado' });
    expect(mockEmail.sendEmail).toHaveBeenCalledTimes(1);
    const [to, subject, html, text] = mockEmail.sendEmail.mock.calls[0];
    expect(to).toBe('padre@ejemplo.co');
    expect(subject).not.toMatch(/Mateo|Pérez/);
    expect(text).toContain('Tu hijo/a Mateo inició sesión en IngenIA el 13 de octubre de 2026 a las 15:04 (hora de Colombia).');
    expect(text).toContain('https://edutechlife.co/ingenia/padres');
    expect(text).toContain('https://edutechlife.co/privacy');
    expect(html).toContain('https://edutechlife.co/privacy');
  });

  test('el aviso no incluye contenido de conversaciones, notas, emociones ni datos extra', () => {
    const { html, text } = construirAviso({ nombre: 'Mateo', ahora: AHORA });
    const sinTildes = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    const todo = sinTildes(`${html} ${text}`);
    for (const prohibido of ['conversacion', 'mensaje', 'nota', 'emocion', 'calificacion', 'edad', 'correo del nino', 'dani']) {
      expect(todo).not.toContain(prohibido);
    }
  });

  test('nombre inyectado en HTML se escapa y solo se usa la primera palabra', () => {
    const { html } = construirAviso({ nombre: '<img src=x> Ana', ahora: AHORA });
    expect(html).not.toContain('<img');
    expect(html).toContain('Tu hijo/a');
  });

  test('sin nombre de pila usa la forma genérica', () => {
    const { text } = construirAviso({ nombre: '', ahora: AHORA });
    expect(text.startsWith('Tu hijo/a inició sesión')).toBe(true);
  });

  test('con dos padres vinculados envía un correo separado a cada uno', async () => {
    sembrar({ vinculos: [{ parent: PADRE }, { parent: PADRE_2 }] });
    const r = await avisarInicioSesionMenor(NIÑO, { ahora: AHORA });
    expect(r.enviado).toBe(true);
    const destinos = mockEmail.sendEmail.mock.calls.map((c) => c[0]).sort();
    expect(destinos).toEqual(['madre@ejemplo.co', 'padre@ejemplo.co']);
  });

  test('menor sin padre vinculado: no envía nada y deja un aviso en logs', async () => {
    sembrar({ vinculos: [] });
    const r = await avisarInicioSesionMenor(NIÑO, { ahora: AHORA });

    expect(r).toEqual({ enviado: false, motivo: 'sin_padre' });
    expect(mockEmail.sendEmail).not.toHaveBeenCalled();
    expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining('sin padre'), expect.any(Object));
  });

  test('vínculo inactivo cuenta como sin padre', async () => {
    sembrar({ vinculos: [{ parent: PADRE, activo: false }] });
    const r = await avisarInicioSesionMenor(NIÑO, { ahora: AHORA });
    expect(r.motivo).toBe('sin_padre');
    expect(mockEmail.sendEmail).not.toHaveBeenCalled();
  });

  test('una cuenta de 18 años o más no dispara el aviso', async () => {
    sembrar({ edad: 18 });
    const r = await avisarInicioSesionMenor(NIÑO, { ahora: AHORA });
    expect(r.motivo).toBe('no_menor');
    expect(mockEmail.sendEmail).not.toHaveBeenCalled();
  });

  test('segunda sesión dentro de 24 h no envía, y tras 24 h vuelve a enviar', async () => {
    const primera = await avisarInicioSesionMenor(NIÑO, { ahora: AHORA });
    const mismoDia = await avisarInicioSesionMenor(NIÑO, {
      ahora: new Date(AHORA.getTime() + 3 * 60 * 60 * 1000),
    });
    const diaSiguiente = await avisarInicioSesionMenor(NIÑO, {
      ahora: new Date(AHORA.getTime() + 25 * 60 * 60 * 1000),
    });

    expect(primera.enviado).toBe(true);
    expect(mismoDia).toEqual({ enviado: false, motivo: 'ventana_24h' });
    expect(diaSiguiente.enviado).toBe(true);
    expect(mockEmail.sendEmail).toHaveBeenCalledTimes(2);
  });

  test('dos inicios simultáneos no producen dos correos', async () => {
    const [a, b] = await Promise.all([
      avisarInicioSesionMenor(NIÑO, { ahora: AHORA }),
      avisarInicioSesionMenor(NIÑO, { ahora: AHORA }),
    ]);
    expect([a.enviado, b.enviado].filter(Boolean)).toHaveLength(1);
    expect(mockEmail.sendEmail).toHaveBeenCalledTimes(1);
  });

  test('si el correo falla (rechazo) no lanza error, libera la reserva y el siguiente intento sí envía', async () => {
    mockEmail.sendEmail.mockRejectedValueOnce(new Error('Resend caído'));
    const fallido = await avisarInicioSesionMenor(NIÑO, { ahora: AHORA });
    expect(fallido).toEqual({ enviado: false, motivo: 'fallo_envio' });

    const reintento = await avisarInicioSesionMenor(NIÑO, {
      ahora: new Date(AHORA.getTime() + 60 * 1000),
    });
    expect(reintento.enviado).toBe(true);
  });

  test('si Resend responde success:false tampoco lanza error', async () => {
    mockEmail.sendEmail.mockResolvedValueOnce({ success: false, error: 'rate limit' });
    const r = await avisarInicioSesionMenor(NIÑO, { ahora: AHORA });
    expect(r.motivo).toBe('fallo_envio');
    expect(mockLogger.warn).toHaveBeenCalled();
  });

  test('sin RESEND_API_KEY no envía ni reserva el envío', async () => {
    delete process.env.RESEND_API_KEY;
    const r = await avisarInicioSesionMenor(NIÑO, { ahora: AHORA });
    expect(r.motivo).toBe('sin_resend');
    expect(mockEmail.sendEmail).not.toHaveBeenCalled();
    expect(tablas.aviso_padre_login).toHaveLength(0);
  });

  test('un error inesperado de base de datos no lanza excepción (el login no se afecta)', async () => {
    tablas.__error = 'parent_student_links';
    await expect(avisarInicioSesionMenor(NIÑO, { ahora: AHORA })).resolves.toEqual({
      enviado: false,
      motivo: 'error_inesperado',
    });
    expect(mockEmail.sendEmail).not.toHaveBeenCalled();
  });
});
