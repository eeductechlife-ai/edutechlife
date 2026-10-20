// Vitest globals (describe/it/expect/vi/beforeEach) — vitest.config usa globals: true
// Base en memoria con la forma de cadena de Supabase que usa el servicio.

const request = require('supertest');
const express = require('express');

const supabasePath = require.resolve('../../db/supabase');
const emailPath = require.resolve('../../services/emailService');
const authServicePath = require.resolve('../../services/authService');
const avisoPath = require.resolve('../../services/avisoPadreLogin');

const tablas = {};
let secuencia = 1;
const sendMock = vi.fn().mockResolvedValue({ success: true });
const signUpMock = vi.fn();

function filasDe(nombre) {
  if (!tablas[nombre]) tablas[nombre] = [];
  return tablas[nombre];
}

function constructorConsulta(nombre) {
  const estado = { filtros: [], limite: null, single: false, op: 'select', valores: null, cambios: null, conflicto: null };

  function ejecutar() {
    const filas = filasDe(nombre);
    if (estado.op === 'insert') {
      const nuevas = estado.valores.map((v) => ({ id: secuencia++, created_at: new Date().toISOString(), ...v }));
      filas.push(...nuevas);
      return { data: estado.single ? nuevas[0] : nuevas, error: null };
    }
    if (estado.op === 'upsert') {
      const claves = estado.conflicto.split(',');
      const existente = filas.find((r) => claves.every((c) => r[c] === estado.valores[c]));
      if (existente) { if (!estado.ignorarDuplicados) Object.assign(existente, estado.valores); }
      else filas.push({ id: secuencia++, ...estado.valores });
      return { data: estado.valores, error: null };
    }
    const coincidentes = filas.filter((r) => estado.filtros.every((f) => f(r)));
    if (estado.op === 'update') {
      coincidentes.forEach((r) => Object.assign(r, estado.cambios));
      return { data: estado.single ? (coincidentes[0] ?? null) : coincidentes, error: null };
    }
    const salida = estado.limite != null ? coincidentes.slice(0, estado.limite) : coincidentes;
    return { data: estado.single ? (salida[0] ?? null) : salida, error: null };
  }

  const consulta = {
    select() { return consulta; },
    eq(columna, valor) { estado.filtros.push((r) => r[columna] === valor); return consulta; },
    gt(columna, valor) { estado.filtros.push((r) => r[columna] > valor); return consulta; },
    limit(n) { estado.limite = n; return consulta; },
    maybeSingle() { estado.single = true; return consulta; },
    insert(valores) { estado.op = 'insert'; estado.valores = valores; return consulta; },
    update(cambios) { estado.op = 'update'; estado.cambios = cambios; return consulta; },
    upsert(valores, { onConflict, ignoreDuplicates }) { estado.op = 'upsert'; estado.valores = valores; estado.conflicto = onConflict; estado.ignorarDuplicados = ignoreDuplicates; return consulta; },
    then(resolver, rechazar) { return Promise.resolve(ejecutar()).then(resolver, rechazar); },
  };
  return consulta;
}

const updateUserByIdMock = vi.fn().mockResolvedValue({ data: {}, error: null });
const mockSupabase = {
  from: vi.fn((nombre) => constructorConsulta(nombre)),
  auth: { getUser: vi.fn(), admin: { updateUserById: updateUserByIdMock } },
};

delete require.cache[supabasePath];
require.cache[supabasePath] = { id: supabasePath, filename: supabasePath, loaded: true, exports: mockSupabase };
delete require.cache[emailPath];
require.cache[emailPath] = { id: emailPath, filename: emailPath, loaded: true, exports: { sendEmail: sendMock } };
delete require.cache[authServicePath];
require.cache[authServicePath] = {
  id: authServicePath, filename: authServicePath, loaded: true,
  exports: { signUp: signUpMock, signIn: vi.fn(), refreshSession: vi.fn(), signOut: vi.fn(), signUpParent: vi.fn(), signInParent: vi.fn() },
};
delete require.cache[avisoPath];
require.cache[avisoPath] = { id: avisoPath, filename: avisoPath, loaded: true, exports: { avisarInicioSesionMenor: vi.fn() } };

const middlewarePath = require.resolve('../../middleware/auth');
let usuarioActual = null;
delete require.cache[middlewarePath];
require.cache[middlewarePath] = {
  id: middlewarePath, filename: middlewarePath, loaded: true,
  exports: {
    requireAuth: (req, res, next) => {
      if (!usuarioActual) return res.status(401).json({ error: 'no autenticado' });
      req.userId = usuarioActual.id;
      req.userEmail = usuarioActual.email;
      return next();
    },
  },
};

const servicio = require('../../services/adultoObligatorio');
const sessionRouter = require('../../routes/auth/session');
const adultoMenorRouter = require('../../routes/auth/adultoMenor');

const ESTUDIANTE = 'a0000000-0000-4000-8000-000000000001';
const ADULTO = 'b0000000-0000-4000-8000-000000000002';
const CORREO_MENOR = 'hijo@ejemplo.com';
const CORREO_ADULTO = 'padre@ejemplo.com';

const adultoValido = { email: CORREO_ADULTO, nombre: 'Marta Pérez', confirmaMayorDeEdad: true };

function app() {
  const a = express();
  a.use(express.json());
  a.use('/api/auth', sessionRouter);
  return a;
}

function extraerToken() {
  const url = sendMock.mock.calls.at(-1)?.[2]?.match(/confirmar\?token=([A-Za-z0-9_-]+)/);
  return url?.[1];
}

beforeEach(() => {
  for (const k of Object.keys(tablas)) delete tablas[k];
  sendMock.mockClear();
  signUpMock.mockReset();
  signUpMock.mockResolvedValue({ user: { id: ESTUDIANTE, email: CORREO_MENOR }, token: 't', refreshToken: 'r' });
  mockSupabase.from.mockClear();
  updateUserByIdMock.mockClear();
  filasDe('users').push({ id: ESTUDIANTE, email: CORREO_MENOR, adulto_obligatorio: false });
  filasDe('users').push({ id: ADULTO, email: CORREO_ADULTO });
  process.env.ADULTO_OBLIGATORIO = 'true';
});

afterAll(() => {
  delete process.env.ADULTO_OBLIGATORIO;
});

describe('esMenor', () => {
  it('usa el rango de IALab si viene', () => {
    expect(servicio.esMenor({ rangoEdad: 'menor_18' })).toBe(true);
    expect(servicio.esMenor({ rangoEdad: '18+' })).toBe(false);
  });
  it('usa la edad en años si no hay rango', () => {
    expect(servicio.esMenor({ edad: 15 })).toBe(true);
    expect(servicio.esMenor({ edad: 18 })).toBe(false);
    expect(servicio.esMenor({ edad: '17' })).toBe(true);
  });
  it('devuelve null si no hay edad utilizable', () => {
    expect(servicio.esMenor({})).toBeNull();
    expect(servicio.esMenor({ edad: 'abc' })).toBeNull();
  });
});

describe('validarAdulto', () => {
  it('rechaza un menor sin correo de adulto válido', () => {
    expect(() => servicio.validarAdulto({ menor: true, correoEstudiante: CORREO_MENOR, adulto: undefined }))
      .toThrow(/correo válido/);
  });
  it('rechaza un correo de adulto igual al del menor', () => {
    expect(() => servicio.validarAdulto({
      menor: true, correoEstudiante: CORREO_MENOR, adulto: { ...adultoValido, email: CORREO_MENOR },
    })).toThrow(/distinto al del menor/);
  });
  it('exige la casilla de mayoría de edad', () => {
    expect(() => servicio.validarAdulto({
      menor: true, correoEstudiante: CORREO_MENOR, adulto: { ...adultoValido, confirmaMayorDeEdad: false },
    })).toThrow(/mayor de 18/);
  });
  it('no pide datos de adulto a un mayor', () => {
    expect(servicio.validarAdulto({ menor: false, correoEstudiante: CORREO_MENOR, adulto: undefined })).toBeNull();
  });
});

describe('POST /api/auth/signup con ADULTO_OBLIGATORIO', () => {
  it('menor sin adulto → rechazado y sin cuenta ni correo', async () => {
    const res = await request(app()).post('/api/auth/signup').send({
      email: CORREO_MENOR, password: 'contraseña-larga-1', accountType: 'smartboard', edad: 14,
    });
    expect(res.status).toBe(400);
    expect(signUpMock).not.toHaveBeenCalled();
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('menor con adulto válido → se crea la cuenta, se marca y se envía la invitación', async () => {
    const res = await request(app()).post('/api/auth/signup').send({
      email: CORREO_MENOR, password: 'contraseña-larga-1', accountType: 'smartboard', edad: 14, adulto: adultoValido,
    });
    expect(res.status).toBe(201);
    expect(res.body.adultoInvitado).toBe(true);
    expect(signUpMock).toHaveBeenCalledOnce();
    expect(filasDe('users').find((u) => u.id === ESTUDIANTE).adulto_obligatorio).toBe(true);
    expect(sendMock).toHaveBeenCalledOnce();
    expect(sendMock.mock.calls[0][0]).toBe(CORREO_ADULTO);
    expect(extraerToken()).toBeTruthy();
    expect(filasDe('invitaciones_adulto_menor')[0].token_hash).not.toBe(extraerToken());
  });

  it('IALab: menor por rango sin edad → exige adulto', async () => {
    const res = await request(app()).post('/api/auth/signup').send({
      email: CORREO_MENOR, password: 'contraseña-larga-1', accountType: 'ialab', rangoEdad: 'menor_18',
    });
    expect(res.status).toBe(400);
    expect(signUpMock).not.toHaveBeenCalled();
  });

  it('mayor de 18 sin datos de adulto → se crea normal', async () => {
    const res = await request(app()).post('/api/auth/signup').send({
      email: CORREO_MENOR, password: 'contraseña-larga-1', accountType: 'ialab', rangoEdad: '18+',
    });
    expect(res.status).toBe(201);
    expect(signUpMock).toHaveBeenCalledOnce();
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('sin edad con la bandera encendida → pide la edad', async () => {
    const res = await request(app()).post('/api/auth/signup').send({
      email: CORREO_MENOR, password: 'contraseña-larga-1', accountType: 'smartboard',
    });
    expect(res.status).toBe(400);
    expect(signUpMock).not.toHaveBeenCalled();
  });

  it('IngenIA sin edad válida (fuera de 6 a 16) → rechazado, con la bandera apagada también', async () => {
    process.env.ADULTO_OBLIGATORIO = 'false';
    const res = await request(app()).post('/api/auth/signup').send({
      email: CORREO_MENOR, password: 'contraseña-larga-1', accountType: 'smartboard', edad: 17,
    });
    expect(res.status).toBe(400);
    expect(signUpMock).not.toHaveBeenCalled();
  });

  it('IngenIA guarda la edad real del formulario, no un 12 fijo', async () => {
    process.env.ADULTO_OBLIGATORIO = 'false';
    const res = await request(app()).post('/api/auth/signup').send({
      email: CORREO_MENOR, password: 'contraseña-larga-1', accountType: 'smartboard', edad: 9,
    });
    expect(res.status).toBe(201);
    const fila = filasDe('students').find((s) => s.auth_id === ESTUDIANTE);
    expect(fila?.age).toBe(9);
    expect(sendMock).not.toHaveBeenCalled();
    expect(filasDe('invitaciones_adulto_menor')).toHaveLength(0);
  });
});

describe('validarEdadIngenia', () => {
  it('acepta de 6 a 16 años', () => {
    expect(servicio.validarEdadIngenia(6)).toBe(6);
    expect(servicio.validarEdadIngenia('16')).toBe(16);
  });
  it('rechaza fuera de rango, vacío o no numérico', () => {
    for (const malo of [5, 17, '', null, undefined, 'doce', 9.5]) {
      expect(() => servicio.validarEdadIngenia(malo)).toThrow(/6 a 16/);
    }
  });
});

describe('confirmarInvitacion', () => {
  async function invitar() {
    await request(app()).post('/api/auth/signup').send({
      email: CORREO_MENOR, password: 'contraseña-larga-1', accountType: 'smartboard', edad: 14, adulto: adultoValido,
    });
    return extraerToken();
  }

  it('adulto que confirma con el correo invitado → vínculo activo', async () => {
    const token = await invitar();
    const r = await servicio.confirmarInvitacion({ token, adultoId: ADULTO, adultoEmail: CORREO_ADULTO });
    expect(r.valida).toBe(true);
    const vinculo = filasDe('parent_student_links').find((l) => l.parent_user_id === ADULTO);
    expect(vinculo).toMatchObject({ student_user_id: ESTUDIANTE, is_active: true });
  });

  it('un segundo uso del mismo enlace se rechaza', async () => {
    const token = await invitar();
    await servicio.confirmarInvitacion({ token, adultoId: ADULTO, adultoEmail: CORREO_ADULTO });
    const r = await servicio.confirmarInvitacion({ token, adultoId: ADULTO, adultoEmail: CORREO_ADULTO });
    expect(r).toEqual({ valida: false, motivo: 'usada' });
  });

  it('con otro correo no crea el vínculo', async () => {
    const token = await invitar();
    const r = await servicio.confirmarInvitacion({ token, adultoId: ADULTO, adultoEmail: 'otro@ejemplo.com' });
    expect(r).toEqual({ valida: false, motivo: 'correo_no_coincide' });
    expect(filasDe('parent_student_links')).toHaveLength(0);
  });

  it('un enlace caducado (más de 72 h) se rechaza', async () => {
    const token = await invitar();
    filasDe('invitaciones_adulto_menor')[0].expira_at = new Date(Date.now() - 1000).toISOString();
    const r = await servicio.confirmarInvitacion({ token, adultoId: ADULTO, adultoEmail: CORREO_ADULTO });
    expect(r).toEqual({ valida: false, motivo: 'vencida' });
  });

  it('un token inventado se rechaza', async () => {
    const r = await servicio.confirmarInvitacion({ token: 'x'.repeat(40), adultoId: ADULTO, adultoEmail: CORREO_ADULTO });
    expect(r).toEqual({ valida: false, motivo: 'invalido' });
  });
});

function appAdulto() {
  const a = express();
  a.use(express.json());
  a.use('/api/auth', adultoMenorRouter);
  return a;
}

describe('banner y registro de adulto para estudiantes existentes', () => {
  beforeEach(() => {
    filasDe('students').push({ auth_id: ESTUDIANTE, age: 13 });
    usuarioActual = { id: ESTUDIANTE, email: CORREO_MENOR };
  });
  afterEach(() => {
    usuarioActual = null;
  });

  it('estado: menor existente sin adulto ve el aviso', async () => {
    const res = await request(appAdulto()).get('/api/auth/adulto-menor/estado');
    expect(res.body).toEqual({ mostrarAviso: true });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('estado: menor con adulto vinculado no ve el aviso', async () => {
    filasDe('parent_student_links').push({ parent_user_id: ADULTO, student_user_id: ESTUDIANTE, is_active: true });
    const res = await request(appAdulto()).get('/api/auth/adulto-menor/estado');
    expect(res.body).toEqual({ mostrarAviso: false });
  });

  it('estado: mayor de edad no ve el aviso', async () => {
    filasDe('students').find((s) => s.auth_id === ESTUDIANTE).age = 20;
    const res = await request(appAdulto()).get('/api/auth/adulto-menor/estado');
    expect(res.body).toEqual({ mostrarAviso: false });
  });

  it('invitar: el menor existente confirma su edad real, registra a su adulto y se envía la invitación', async () => {
    const res = await request(appAdulto()).post('/api/auth/adulto-menor/invitar').send({ edad: 9, adulto: adultoValido });
    expect(res.status).toBe(201);
    expect(filasDe('students').find((s) => s.auth_id === ESTUDIANTE).age).toBe(9);
    expect(sendMock).toHaveBeenCalledOnce();
    expect(sendMock.mock.calls[0][0]).toBe(CORREO_ADULTO);
    expect(filasDe('invitaciones_adulto_menor')[0].estado).toBe('pendiente');
  });

  it('invitar: sin edad válida (fuera de 6 a 16) no cambia nada ni envía', async () => {
    const res = await request(appAdulto()).post('/api/auth/adulto-menor/invitar').send({ edad: 17, adulto: adultoValido });
    expect(res.status).toBe(400);
    expect(filasDe('students').find((s) => s.auth_id === ESTUDIANTE).age).toBe(13);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('invitar: sin datos válidos del adulto no envía nada', async () => {
    const res = await request(appAdulto()).post('/api/auth/adulto-menor/invitar').send({ edad: 11, adulto: { ...adultoValido, confirmaMayorDeEdad: false } });
    expect(res.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('invitar: un mayor no necesita adulto (409)', async () => {
    filasDe('students').find((s) => s.auth_id === ESTUDIANTE).age = 20;
    const res = await request(appAdulto()).post('/api/auth/adulto-menor/invitar').send({ edad: 11, adulto: adultoValido });
    expect(res.status).toBe(409);
    expect(sendMock).not.toHaveBeenCalled();
  });

  const autorizacion = { aceptaAutorizacion: true, versionAutorizacion: 'adulto-menor-v1-2026-10-20' };

  it('confirmar: adulto con sesión y correo invitado vincula al menor', async () => {
    await request(appAdulto()).post('/api/auth/adulto-menor/invitar').send({ edad: 11, adulto: adultoValido });
    const token = extraerToken();
    usuarioActual = { id: ADULTO, email: CORREO_ADULTO };
    const res = await request(appAdulto()).post('/api/auth/adulto-menor/confirmar').send({ token, ...autorizacion });
    expect(res.status).toBe(200);
    expect(filasDe('parent_student_links').find((l) => l.parent_user_id === ADULTO)?.is_active).toBe(true);
  });

  it('confirmar: la primera confirmación activa la cuenta del niño una sola vez, con evidencia', async () => {
    await request(appAdulto()).post('/api/auth/adulto-menor/invitar').send({ edad: 11, adulto: adultoValido });
    const token = extraerToken();
    usuarioActual = { id: ADULTO, email: CORREO_ADULTO };
    const res = await request(appAdulto()).post('/api/auth/adulto-menor/confirmar').send({ token, ...autorizacion });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ vinculado: true, activado: true });

    const activaciones = filasDe('activaciones_adulto_menor');
    expect(activaciones).toHaveLength(1);
    expect(activaciones[0]).toMatchObject({
      estudiante_id: ESTUDIANTE,
      adulto_id: ADULTO,
      adulto_email: CORREO_ADULTO,
      metodo: 'invitacion',
      version_autorizacion: 'adulto-menor-v1-2026-10-20',
      invitacion_id: filasDe('invitaciones_adulto_menor')[0].id,
    });
    expect(activaciones[0].activada_at).toBeTruthy();
    expect(updateUserByIdMock).toHaveBeenCalledWith(ESTUDIANTE, {
      app_metadata: { ingenia_adulto_activado_at: activaciones[0].activada_at },
    });
  });

  it('confirmar: una segunda confirmación (otro adulto) no reemplaza la activación original', async () => {
    await request(appAdulto()).post('/api/auth/adulto-menor/invitar').send({ edad: 11, adulto: adultoValido });
    usuarioActual = { id: ADULTO, email: CORREO_ADULTO };
    await request(appAdulto()).post('/api/auth/adulto-menor/confirmar').send({ token: extraerToken(), ...autorizacion });
    const original = { ...filasDe('activaciones_adulto_menor')[0] };

    const OTRO = 'c0000000-0000-4000-8000-000000000003';
    filasDe('invitaciones_adulto_menor').push({
      id: 999, estudiante_id: ESTUDIANTE, adulto_email: 'tia@ejemplo.com', estado: 'pendiente',
      token_hash: servicio.hashToken('t'.repeat(40)), expira_at: new Date(Date.now() + 60000).toISOString(),
    });
    usuarioActual = { id: OTRO, email: 'tia@ejemplo.com' };
    const res = await request(appAdulto()).post('/api/auth/adulto-menor/confirmar').send({ token: 't'.repeat(40), ...autorizacion });
    expect(res.status).toBe(200);
    expect(filasDe('activaciones_adulto_menor')).toHaveLength(1);
    expect(filasDe('activaciones_adulto_menor')[0]).toEqual(original);
  });

  it('confirmar: sin aceptar el texto de autorización no vincula ni activa', async () => {
    await request(appAdulto()).post('/api/auth/adulto-menor/invitar').send({ edad: 11, adulto: adultoValido });
    const token = extraerToken();
    usuarioActual = { id: ADULTO, email: CORREO_ADULTO };
    for (const cuerpo of [{ token }, { token, aceptaAutorizacion: true, versionAutorizacion: 'inventada' }]) {
      const res = await request(appAdulto()).post('/api/auth/adulto-menor/confirmar').send(cuerpo);
      expect(res.status).toBe(400);
      expect(res.body.motivo).toBe('falta_autorizacion');
    }
    expect(filasDe('parent_student_links')).toHaveLength(0);
    expect(filasDe('activaciones_adulto_menor')).toHaveLength(0);
    expect(filasDe('invitaciones_adulto_menor')[0].estado).toBe('pendiente');
  });

  it('confirmar: sin sesión → 401 y no vincula', async () => {
    usuarioActual = null;
    const res = await request(appAdulto()).post('/api/auth/adulto-menor/confirmar').send({ token: 'x'.repeat(40) });
    expect(res.status).toBe(401);
  });
});

describe('estado del aviso con la activación única', () => {
  beforeEach(() => {
    filasDe('students').push({ auth_id: ESTUDIANTE, age: 10 });
    usuarioActual = { id: ESTUDIANTE, email: CORREO_MENOR };
  });
  afterEach(() => {
    usuarioActual = null;
  });

  it('un niño ya activado no ve el aviso aunque su invitación haya vencido', async () => {
    filasDe('activaciones_adulto_menor').push({ estudiante_id: ESTUDIANTE, metodo: 'invitacion' });
    filasDe('invitaciones_adulto_menor').push({
      estudiante_id: ESTUDIANTE, estado: 'vencida', expira_at: new Date(Date.now() - 1000).toISOString(),
    });
    const res = await request(appAdulto()).get('/api/auth/adulto-menor/estado');
    expect(res.body).toEqual({ mostrarAviso: false });
  });

  it('un niño ya activado no puede volver a pedir invitación (409)', async () => {
    filasDe('activaciones_adulto_menor').push({ estudiante_id: ESTUDIANTE, metodo: 'invitacion' });
    const res = await request(appAdulto()).post('/api/auth/adulto-menor/invitar').send({ edad: 10, adulto: adultoValido });
    expect(res.status).toBe(409);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('un niño sin edad registrada ve el aviso', async () => {
    tablas.students = [];
    filasDe('users').find((u) => u.id === ESTUDIANTE).account_type = 'smartboard';
    const res = await request(appAdulto()).get('/api/auth/adulto-menor/estado');
    expect(res.body).toEqual({ mostrarAviso: true });
  });

  it('con la bandera apagada nunca hay aviso', async () => {
    process.env.ADULTO_OBLIGATORIO = 'false';
    const res = await request(appAdulto()).get('/api/auth/adulto-menor/estado');
    expect(res.body).toEqual({ mostrarAviso: false });
  });
});
