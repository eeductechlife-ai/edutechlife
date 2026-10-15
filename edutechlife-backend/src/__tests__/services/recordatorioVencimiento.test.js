/**
 * Recordatorios de vencimiento de planes pagados (services/recordatorioVencimiento.js).
 * Un correo a 7 días y otro a 1 día antes de paidUntil, una sola vez por tipo y
 * por periodo. La base se simula con un almacén en memoria que respeta los
 * filtros usados por el servicio (eq, neq, gt, lte, insert con clave única,
 * delete, maybeSingle), para probar también la reserva anti-spam.
 */

const supabasePath = require.resolve('../../db/supabase');
const emailPath = require.resolve('../../services/emailService');
const loggerPath = require.resolve('../../utils/logger');

const mockEmail = { sendEmail: vi.fn() };
const mockLogger = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() };

let tablas;

const comparar = {
  eq: (a, b) => a === b,
  neq: (a, b) => a !== b,
  gt: (a, b) => Date.parse(a) > Date.parse(b),
  lte: (a, b) => Date.parse(a) <= Date.parse(b),
};

function crearSupabaseFalso() {
  return {
    from(nombre) {
      const q = { op: 'select', filtros: [], set: null, maybe: false };
      const filas = () => (tablas[nombre] = tablas[nombre] || []);
      const coincide = (f) => q.filtros.every(([col, op, val]) => comparar[op](f[col], val));
      const ejecutar = async () => {
        if (tablas.__error === nombre) {
          return { data: null, error: { message: 'relation does not exist', code: '42P01' } };
        }
        if (q.op === 'insert') {
          const tabla = filas();
          const repetida = tabla.some(
            (f) =>
              f.titular_id === q.set.titular_id &&
              f.producto === q.set.producto &&
              f.tipo === q.set.tipo &&
              f.periodo_hasta === q.set.periodo_hasta,
          );
          if (repetida) return { data: null, error: { message: 'duplicate', code: '23505' } };
          tabla.push({ ...q.set });
          return { data: [{ ...q.set }], error: null };
        }
        if (q.op === 'delete') {
          tablas[nombre] = filas().filter((f) => !coincide(f));
          return { data: null, error: null };
        }
        const data = filas().filter(coincide).map((f) => ({ ...f }));
        if (q.maybe) return { data: data[0] ?? null, error: null };
        return { data, error: null };
      };
      const b = {
        select: () => b,
        eq: (col, val) => (q.filtros.push([col, 'eq', val]), b),
        neq: (col, val) => (q.filtros.push([col, 'neq', val]), b),
        gt: (col, val) => (q.filtros.push([col, 'gt', val]), b),
        lte: (col, val) => (q.filtros.push([col, 'lte', val]), b),
        maybeSingle: () => ((q.maybe = true), b),
        insert: (fila) => ((q.op = 'insert'), (q.set = fila), b),
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

const {
  enviarRecordatoriosVencimiento,
  startRecordatoriosVencimiento,
  tipoRecordatorio,
} = require('../../services/recordatorioVencimiento');
const { construirRecordatorio } = require('../../services/recordatorioVencimientoEmail');

const DIA = 24 * 60 * 60 * 1000;
const HORA = 60 * 60 * 1000;
const AHORA = new Date('2026-10-14T12:00:00.000Z');
const en = (ms) => new Date(AHORA.getTime() + ms).toISOString();

const CUENTA = '6f1c2a3b-1111-4222-8333-944455556666'; // titular IALab adulto
const NIÑO = '11111111-1111-4111-8111-111111111111'; // titular IngenIA menor
const PADRE = '22222222-2222-4222-8222-222222222222';

function sembrar({ cuentas = [], alumnos = [], vinculos = [] } = {}) {
  tablas = {
    users: cuentas.map((c) => ({ plan: 'pro', ...c })),
    students: alumnos,
    parent_student_links: vinculos,
    recordatorios_plan: [],
  };
}

const cuentaIALab = (restanteMs, id = CUENTA, email = 'adulto@ejemplo.co') => ({
  id,
  email,
  plan: 'pro',
  plan_paid_until: en(restanteMs),
});

describe('tipoRecordatorio', () => {
  it('7 días antes es el aviso de 7d; 1 día o menos es el de 1d; fuera de ventana no hay aviso', () => {
    expect(tipoRecordatorio(30 * DIA)).toBeNull();
    expect(tipoRecordatorio(7 * DIA)).toBe('7d');
    expect(tipoRecordatorio(5 * DIA)).toBe('7d');
    expect(tipoRecordatorio(DIA + 1)).toBe('7d');
    expect(tipoRecordatorio(DIA)).toBe('1d');
    expect(tipoRecordatorio(12 * HORA)).toBe('1d');
    expect(tipoRecordatorio(0)).toBeNull();
    expect(tipoRecordatorio(-HORA)).toBeNull();
  });
});

describe('enviarRecordatoriosVencimiento', () => {
  const prevKey = process.env.RESEND_API_KEY;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RESEND_API_KEY = 're_test';
    mockEmail.sendEmail.mockResolvedValue({ success: true, messageId: 'm1' });
    sembrar({ cuentas: [cuentaIALab(5 * DIA)] });
  });

  afterAll(() => {
    if (prevKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = prevKey;
  });

  it('recordatorio a 7 días se envía una sola vez aunque el job corra de nuevo dentro de la ventana', async () => {
    const primera = await enviarRecordatoriosVencimiento({ ahora: AHORA });
    const seisHoras = await enviarRecordatoriosVencimiento({ ahora: new Date(AHORA.getTime() + 6 * HORA) });
    const dia = await enviarRecordatoriosVencimiento({ ahora: new Date(AHORA.getTime() + 2 * DIA) });

    expect(primera.enviados).toBe(1);
    expect(seisHoras.enviados).toBe(0);
    expect(dia.enviados).toBe(0);
    expect(mockEmail.sendEmail).toHaveBeenCalledTimes(1);
    const [to, subject] = mockEmail.sendEmail.mock.calls[0];
    expect(to).toBe('adulto@ejemplo.co');
    expect(subject).toContain('7 días');
  });

  it('recordatorio a 1 día se envía una sola vez', async () => {
    sembrar({ cuentas: [cuentaIALab(12 * HORA)] });
    const primera = await enviarRecordatoriosVencimiento({ ahora: AHORA });
    const otraVez = await enviarRecordatoriosVencimiento({ ahora: new Date(AHORA.getTime() + HORA) });

    expect(primera.enviados).toBe(1);
    expect(otraVez.enviados).toBe(0);
    expect(mockEmail.sendEmail).toHaveBeenCalledTimes(1);
    expect(mockEmail.sendEmail.mock.calls[0][1]).toContain('mañana');
  });

  it('cada periodo recibe su aviso de 7d y luego su aviso de 1d, una vez cada uno', async () => {
    const cuenta = cuentaIALab(5 * DIA);
    sembrar({ cuentas: [cuenta] });
    await enviarRecordatoriosVencimiento({ ahora: AHORA });
    // Cuatro días y medio después quedan 12 h: toca el aviso de 1d.
    const cuatroDiasMedio = new Date(AHORA.getTime() + 4.5 * DIA);
    await enviarRecordatoriosVencimiento({ ahora: cuatroDiasMedio });
    await enviarRecordatoriosVencimiento({ ahora: new Date(cuatroDiasMedio.getTime() + 2 * HORA) });

    expect(mockEmail.sendEmail).toHaveBeenCalledTimes(2);
    expect(mockEmail.sendEmail.mock.calls[0][1]).toContain('7 días');
    expect(mockEmail.sendEmail.mock.calls[1][1]).toContain('mañana');
  });

  it('plan sin vencimiento próximo no envía nada', async () => {
    sembrar({ cuentas: [cuentaIALab(30 * DIA)] });
    const r = await enviarRecordatoriosVencimiento({ ahora: AHORA });
    expect(r).toEqual({ candidatos: 0, enviados: 0, omitidos: 0, fallos: 0 });
    expect(mockEmail.sendEmail).not.toHaveBeenCalled();
  });

  it('un periodo renovado tiene sus propios avisos', async () => {
    sembrar({ cuentas: [cuentaIALab(5 * DIA)] });
    await enviarRecordatoriosVencimiento({ ahora: AHORA });
    // El titular paga otro mes: el nuevo periodo vuelve a recibir el aviso de 7d.
    tablas.users[0].plan_paid_until = en(20 * DIA);
    await enviarRecordatoriosVencimiento({ ahora: new Date(AHORA.getTime() + 13 * DIA) });
    expect(mockEmail.sendEmail).toHaveBeenCalledTimes(2);
  });

  it('menor con padre vinculado: el correo va al padre, con solo el nombre de pila', async () => {
    sembrar({
      cuentas: [
        { id: NIÑO, email: 'nino@ejemplo.co', plan: 'free' },
        { id: PADRE, email: 'padre@ejemplo.co', plan: 'free' },
      ],
      alumnos: [{ auth_id: NIÑO, name: 'Mateo Pérez', age: 10, subscription_tier: 'premium', premium_until: en(5 * DIA) }],
      vinculos: [{ parent_user_id: PADRE, student_user_id: NIÑO, is_active: true }],
    });
    const r = await enviarRecordatoriosVencimiento({ ahora: AHORA });

    expect(r.enviados).toBe(1);
    const [to, subject, html, text] = mockEmail.sendEmail.mock.calls[0];
    expect(to).toBe('padre@ejemplo.co');
    expect(subject).not.toMatch(/Mateo|Pérez/);
    expect(text).toContain('Mateo');
    expect(text).not.toContain('Pérez');
    expect(html).toContain('https://edutechlife.co/planes');
  });

  it('menor sin padre vinculado: el correo va al titular', async () => {
    sembrar({
      cuentas: [{ id: NIÑO, email: 'nino@ejemplo.co', plan: 'free' }],
      alumnos: [{ auth_id: NIÑO, name: 'Mateo', age: 10, subscription_tier: 'premium', premium_until: en(5 * DIA) }],
      vinculos: [],
    });
    const r = await enviarRecordatoriosVencimiento({ ahora: AHORA });

    expect(r.enviados).toBe(1);
    expect(mockEmail.sendEmail.mock.calls[0][0]).toBe('nino@ejemplo.co');
  });

  it('un fallo de correo no detiene el job ni a los demás titulares, y el aviso se reintenta', async () => {
    const OTRO = '33333333-3333-4333-8333-333333333333';
    sembrar({ cuentas: [cuentaIALab(5 * DIA), cuentaIALab(5 * DIA, OTRO, 'otro@ejemplo.co')] });
    mockEmail.sendEmail.mockRejectedValueOnce(new Error('red caída'));

    const primera = await enviarRecordatoriosVencimiento({ ahora: AHORA });
    expect(primera.fallos).toBe(1);
    expect(primera.enviados).toBe(1);
    expect(mockEmail.sendEmail).toHaveBeenCalledTimes(2);

    // El titular cuyo correo falló no quedó marcado: el siguiente pase lo intenta otra vez.
    const segunda = await enviarRecordatoriosVencimiento({ ahora: new Date(AHORA.getTime() + HORA) });
    expect(segunda.enviados).toBe(1);
    expect(mockEmail.sendEmail).toHaveBeenCalledTimes(3);
  });

  it('si la tabla de recordatorios falta, no envía nada (sin registro no hay anti-spam)', async () => {
    tablas.__error = 'recordatorios_plan';
    const r = await enviarRecordatoriosVencimiento({ ahora: AHORA });
    expect(r.enviados).toBe(0);
    expect(mockEmail.sendEmail).not.toHaveBeenCalled();
  });

  it('sin RESEND_API_KEY no envía ni reserva nada', async () => {
    delete process.env.RESEND_API_KEY;
    const r = await enviarRecordatoriosVencimiento({ ahora: AHORA });
    expect(r.enviados).toBe(0);
    expect(mockEmail.sendEmail).not.toHaveBeenCalled();
    expect(tablas.recordatorios_plan).toHaveLength(0);
  });
});

describe('startRecordatoriosVencimiento', () => {
  it('RECORDATORIOS_PLAN=false lo deja apagado', () => {
    const prev = process.env.RECORDATORIOS_PLAN;
    process.env.RECORDATORIOS_PLAN = 'false';
    try {
      expect(startRecordatoriosVencimiento()).toBeNull();
    } finally {
      if (prev === undefined) delete process.env.RECORDATORIOS_PLAN;
      else process.env.RECORDATORIOS_PLAN = prev;
    }
  });
});

describe('construirRecordatorio', () => {
  it('en inglés y portugués usa su plantilla y la misma fecha en hora de Colombia', () => {
    const en7 = construirRecordatorio({ tipo: '7d', idioma: 'en', plan: 'IALab Pro', paidUntil: en(5 * DIA), pila: '' });
    const pt1 = construirRecordatorio({ tipo: '1d', idioma: 'pt', plan: 'IALab Pro', paidUntil: en(12 * HORA), pila: '' });
    expect(en7.subject).toBe('Your IALab Pro plan expires in 7 days');
    expect(pt1.subject).toBe('Seu plano IALab Pro vence amanhã');
    expect(en7.text).toContain('https://edutechlife.co/planes');
    expect(pt1.html).toContain('https://edutechlife.co/planes');
  });

  it('escapa el HTML del nombre de pila y usa español si el idioma no existe', () => {
    const r = construirRecordatorio({ tipo: '7d', idioma: 'fr', plan: 'IngenIA Premium', paidUntil: en(5 * DIA), pila: '<img src=x>Ana' });
    expect(r.html).not.toContain('<img');
    expect(r.subject).toContain('Tu plan');
  });
});
