/**
 * Alerta de crisis de Dani: a quién se avisa.
 *
 * Los menores registrados con la regla de adulto obligatorio (PRs #120–#122)
 * guardan su adulto en parent_student_links (vínculo confirmado) o en
 * invitaciones_adulto_menor (invitación pendiente), no en parent_consents.
 * La alerta debe llegar a ese adulto; parent_consents queda como respaldo.
 *
 * Datos de prueba ficticios (example.com); nunca datos reales de estudiantes.
 */
const request = require('supertest');
const { h, crearApp } = require('../helpers/daniHarness');

// Base en memoria que respeta los filtros (el doble del arnés los ignora).
const SUPA = require.resolve('../../db/supabase');
const db = { tablas: {}, fallan: new Set() };

function consulta(tabla) {
  const filtros = [];
  let orden = null;
  let tope = null;
  const filas = () => {
    let rows = (db.tablas[tabla] || []).filter((r) => filtros.every(([c, v]) => r[c] === v));
    if (orden) {
      const [c, asc] = orden;
      rows = [...rows].sort((a, b) => (a[c] > b[c] ? 1 : a[c] < b[c] ? -1 : 0) * (asc ? 1 : -1));
    }
    return tope === null ? rows : rows.slice(0, tope);
  };
  const error = () => (db.fallan.has(tabla) ? { code: '42P01', message: 'relation does not exist' } : null);
  const q = {
    select: () => q,
    eq: (c, v) => { filtros.push([c, v]); return q; },
    order: (c, o = {}) => { orden = [c, o.ascending !== false]; return q; },
    limit: (n) => { tope = n; return q; },
    maybeSingle: async () => (error() ? { data: null, error: error() } : { data: filas()[0] ?? null, error: null }),
    single: async () => {
      if (error()) return { data: null, error: error() };
      const r = filas()[0];
      return r ? { data: r, error: null } : { data: null, error: { code: 'PGRST116' } };
    },
    insert: async () => ({ error: null }),
    upsert: async () => ({ error: null }),
    update: () => q,
    then: (ok, ko) =>
      Promise.resolve(error() ? { data: null, error: error() } : { data: filas(), error: null }).then(ok, ko),
  };
  return q;
}
require.cache[SUPA].exports.from = (tabla) => consulta(tabla);

// Correo: se observa a quién se enviaría la alerta, sin enviar nada.
const EMAIL = require.resolve('../../services/emailService');
const emailReal = require(EMAIL);
const sendCrisisAlert = vi.fn(async () => ({ success: true, messageId: 'test' }));
const logCrisisIncident = vi.fn(async () => ({ success: true }));
require.cache[EMAIL] = {
  id: EMAIL, filename: EMAIL, loaded: true,
  exports: { ...emailReal, sendCrisisAlert, logCrisisIncident },
};

const app = crearApp();
const ESTUDIANTE = 'test-user-id';
const ADULTO = 'adulto-1';
const CORREO_ADULTO = 'acudiente.prueba@example.com';
const MENSAJE_CRISIS = 'ya no aguanto, quiero acabar con mi vida';

function base({ vinculo = false, invitacion = null, consentimiento = null } = {}) {
  db.fallan.clear();
  db.tablas = {
    students: [{ id: 'student-1', auth_id: ESTUDIANTE, name: 'Sol', age: 11 }],
    users: [
      { id: ESTUDIANTE, email: 'sol.prueba@example.com' },
      { id: ADULTO, email: CORREO_ADULTO },
    ],
    parent_student_links: vinculo
      ? [{ parent_user_id: ADULTO, student_user_id: ESTUDIANTE, is_active: true }]
      : [],
    invitaciones_adulto_menor: invitacion ? [invitacion] : [],
    parent_consents: consentimiento ? [consentimiento] : [],
  };
}

const pedirDani = () =>
  request(app)
    .post('/api/ingenia/dani/chat')
    .set({ Authorization: 'Bearer test-token' })
    .send({ message: MENSAJE_CRISIS, studentId: 'student-1' });

const pedirStream = () =>
  request(app)
    .post('/api/ingenia/chat/stream')
    .set({ Authorization: 'Bearer test-token' })
    .send({ messages: [{ role: 'user', content: MENSAJE_CRISIS }] });

beforeEach(() => {
  h.reset();
  sendCrisisAlert.mockClear();
  logCrisisIncident.mockClear();
});

describe.each([
  ['POST /dani/chat', pedirDani],
  ['POST /chat/stream', pedirStream],
])('Alerta de crisis — %s', (_ruta, pedir) => {
  it('avisa al adulto con vínculo activo aunque no exista parent_consents', async () => {
    base({ vinculo: true });
    const r = await pedir();
    expect(r.status).toBe(200);
    expect(sendCrisisAlert).toHaveBeenCalledTimes(1);
    expect(sendCrisisAlert.mock.calls[0][0]).toBe(CORREO_ADULTO);
    expect(sendCrisisAlert.mock.calls[0][2]).toBe(11);
    expect(logCrisisIncident).toHaveBeenCalledWith(
      expect.anything(), ESTUDIANTE, 11, expect.any(String), 'high', CORREO_ADULTO,
    );
  });

  it('sin vínculo, avisa al adulto de la invitación pendiente (aún sin cuenta)', async () => {
    base({
      invitacion: {
        id: 7, estudiante_id: ESTUDIANTE, adulto_email: 'invitado.prueba@example.com', estado: 'pendiente',
      },
    });
    await pedir();
    expect(sendCrisisAlert).toHaveBeenCalledTimes(1);
    expect(sendCrisisAlert.mock.calls[0][0]).toBe('invitado.prueba@example.com');
  });

  it('no usa invitaciones revocadas', async () => {
    base({
      invitacion: {
        id: 3, estudiante_id: ESTUDIANTE, adulto_email: 'revocado.prueba@example.com', estado: 'revocada',
      },
    });
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    await pedir();
    error.mockRestore();
    expect(sendCrisisAlert).not.toHaveBeenCalled();
  });

  it('respaldo: sin modelo nuevo, usa parent_consents como antes', async () => {
    base({
      consentimiento: {
        student_id: ESTUDIANTE, parent_email: 'padre.antiguo@example.com', student_age: 12,
        created_at: '2026-09-01T00:00:00Z',
      },
    });
    db.tablas.students[0].age = null;
    await pedir();
    expect(sendCrisisAlert).toHaveBeenCalledTimes(1);
    expect(sendCrisisAlert.mock.calls[0][0]).toBe('padre.antiguo@example.com');
    expect(sendCrisisAlert.mock.calls[0][2]).toBe(12);
  });

  it('respaldo: si la tabla de invitaciones no existe, sigue con parent_consents', async () => {
    base({
      consentimiento: {
        student_id: ESTUDIANTE, parent_email: 'padre.antiguo@example.com', student_age: 12,
        created_at: '2026-09-01T00:00:00Z',
      },
    });
    db.fallan.add('invitaciones_adulto_menor');
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    await pedir();
    error.mockRestore();
    expect(sendCrisisAlert.mock.calls[0]?.[0]).toBe('padre.antiguo@example.com');
  });

  it('sin ningún adulto: deja un log de error solo con el id del estudiante', async () => {
    base();
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const r = await pedir();
    const lineas = error.mock.calls.map((args) => args.map((a) => JSON.stringify(a)).join(' '));
    error.mockRestore();

    expect(r.status).toBe(200);
    expect(sendCrisisAlert).not.toHaveBeenCalled();
    const aviso = lineas.find((l) => l.includes('sin adulto'));
    expect(aviso).toBeDefined();
    expect(aviso).toContain(ESTUDIANTE);
    expect(aviso).not.toMatch(/@|aguanto|Sol/);
  });
});
