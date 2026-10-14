// Vitest globals (describe/it/expect/vi/beforeEach) — vitest.config usa globals: true
// Base en memoria con la misma forma de cadena de Supabase que usa el servicio.

const supabasePath = require.resolve('../../db/supabase');
const emailPath = require.resolve('../../services/emailService');

const tablas = {};
let secuencia = 1;
const sendMock = vi.fn().mockResolvedValue({ success: true });

function filasDe(nombre) {
  if (!tablas[nombre]) tablas[nombre] = [];
  return tablas[nombre];
}

function constructorConsulta(nombre) {
  const estado = { filtros: [], orden: null, limite: null, single: false, op: 'select', valores: null, cambios: null };

  function ejecutar() {
    const filas = filasDe(nombre);
    if (estado.op === 'insert') {
      const nuevas = estado.valores.map((v) => ({ id: secuencia++, created_at: new Date().toISOString(), ...v }));
      filas.push(...nuevas);
      return { data: estado.single ? nuevas[0] : nuevas, error: null };
    }
    let coincidentes = filas.filter((r) => estado.filtros.every((f) => f(r)));
    if (estado.op === 'update') {
      coincidentes.forEach((r) => Object.assign(r, estado.cambios));
      return { data: estado.single ? (coincidentes[0] ?? null) : coincidentes, error: null };
    }
    if (estado.orden) {
      const { columna, asc } = estado.orden;
      coincidentes = [...coincidentes].sort((a, b) => (a[columna] > b[columna] ? 1 : -1) * (asc ? 1 : -1));
    }
    if (estado.limite != null) coincidentes = coincidentes.slice(0, estado.limite);
    return { data: estado.single ? (coincidentes[0] ?? null) : coincidentes, error: null };
  }

  const consulta = {
    select() { return consulta; },
    eq(columna, valor) { estado.filtros.push((r) => r[columna] === valor); return consulta; },
    gt(columna, valor) { estado.filtros.push((r) => r[columna] > valor); return consulta; },
    order(columna, { ascending = true } = {}) { estado.orden = { columna, asc: ascending }; return consulta; },
    limit(n) { estado.limite = n; return consulta; },
    maybeSingle() { estado.single = true; return consulta; },
    insert(valores) { estado.op = 'insert'; estado.valores = valores; return consulta; },
    update(cambios) { estado.op = 'update'; estado.cambios = cambios; return consulta; },
    then(resolver, rechazar) { return Promise.resolve(ejecutar()).then(resolver, rechazar); },
  };
  return consulta;
}

const mockSupabase = {
  from: vi.fn((nombre) => constructorConsulta(nombre)),
  auth: { getUser: vi.fn() },
};

delete require.cache[supabasePath];
require.cache[supabasePath] = { id: supabasePath, filename: supabasePath, loaded: true, exports: mockSupabase };
delete require.cache[emailPath];
require.cache[emailPath] = {
  id: emailPath, filename: emailPath, loaded: true,
  exports: { sendParentAuthorizationEmail: sendMock },
};

const servicio = require('../../services/autorizacionPadres');
const { requireAutorizacionPadres } = require('../../middleware/autorizacionPadres');

const ESTUDIANTE = 'a0000000-0000-4000-8000-000000000001';
const PADRE = 'b0000000-0000-4000-8000-000000000002';
const OTRO_PADRE = 'c0000000-0000-4000-8000-000000000003';
const CUENTA_EXISTENTE = 'd0000000-0000-4000-8000-000000000004';

function sembrar({ conVinculo = true, requerida = true } = {}) {
  filasDe('users').push(
    { id: ESTUDIANTE, email: 'hijo@ejemplo.com', autorizacion_padres_requerida: requerida },
    { id: PADRE, email: 'padre@ejemplo.com', autorizacion_padres_requerida: false },
    { id: OTRO_PADRE, email: 'otro@ejemplo.com', autorizacion_padres_requerida: false },
    { id: CUENTA_EXISTENTE, email: 'antigua@ejemplo.com', autorizacion_padres_requerida: false },
  );
  if (conVinculo) {
    filasDe('parent_student_links').push({ parent_user_id: PADRE, student_user_id: ESTUDIANTE, is_active: true });
  }
}

/** Extrae el token en claro del enlace enviado por correo. */
function tokenDelUltimoCorreo() {
  const url = sendMock.mock.calls.at(-1)[0].url;
  return new URL(url).searchParams.get('token');
}

function respuestaMock() {
  return { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
}

function correrMiddleware(path, userId = ESTUDIANTE) {
  mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: userId } }, error: null });
  const req = { path, headers: { authorization: 'Bearer token-de-prueba' } };
  const res = respuestaMock();
  const next = vi.fn();
  return requireAutorizacionPadres()(req, res, next).then(() => ({ res, next }));
}

beforeEach(() => {
  vi.clearAllMocks();
  for (const k of Object.keys(tablas)) delete tablas[k];
  secuencia = 1;
  process.env.CONSENTIMIENTO_PADRES = 'true';
});

afterEach(() => {
  delete process.env.CONSENTIMIENTO_PADRES;
});

describe('con CONSENTIMIENTO_PADRES apagada el comportamiento no cambia', () => {
  it('no consulta la base ni verifica sesión, y deja pasar a cualquier estudiante', async () => {
    delete process.env.CONSENTIMIENTO_PADRES;
    sembrar({ requerida: true });

    const { res, next } = await correrMiddleware('/student-profile');
    const { res: res2, next: next2 } = await correrMiddleware('/vak-cualquiera');

    expect(next).toHaveBeenCalledOnce();
    expect(next2).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
    expect(res2.status).not.toHaveBeenCalled();
    expect(mockSupabase.from).not.toHaveBeenCalled();
    expect(mockSupabase.auth.getUser).not.toHaveBeenCalled();
  });

  it('el estado devuelve no restringido y no requerido', async () => {
    delete process.env.CONSENTIMIENTO_PADRES;
    sembrar({ requerida: true });
    const estado = await servicio.estadoAutorizacion(ESTUDIANTE);
    expect(estado).toMatchObject({ activo: false, restringido: false });
  });
});

describe('estudiante nuevo sin autorización', () => {
  it('queda limitado: las rutas generales responden 403 con código', async () => {
    sembrar({ requerida: true });
    const { res, next } = await correrMiddleware('/progress/resumen');
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ code: 'AUTORIZACION_PADRES_REQUERIDA' }));
  });

  it('puede seguir usando las rutas permitidas (perfil VAK y estado de autorización)', async () => {
    sembrar({ requerida: true });
    const perfil = await correrMiddleware('/student-profile');
    const estado = await correrMiddleware('/authorization/status');
    expect(perfil.next).toHaveBeenCalledOnce();
    expect(estado.next).toHaveBeenCalledOnce();
  });

  it('sin vínculo de padre no crea nada, devuelve sin_vinculo y lo registra', async () => {
    sembrar({ requerida: true, conVinculo: false });
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const resultado = await servicio.solicitarAutorizacion(ESTUDIANTE);
    expect(resultado).toEqual({ estado: 'sin_vinculo' });
    expect(filasDe('autorizaciones_padres')).toHaveLength(0);
    expect(sendMock).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('con vínculo activo envía el enlace y guarda solo el hash del token', async () => {
    sembrar({ requerida: true });
    const resultado = await servicio.solicitarAutorizacion(ESTUDIANTE);
    expect(resultado).toEqual({ estado: 'pendiente' });
    expect(sendMock).toHaveBeenCalledOnce();
    expect(sendMock.mock.calls[0][0].parentEmail).toBe('padre@ejemplo.com');

    const token = tokenDelUltimoCorreo();
    const fila = filasDe('autorizaciones_padres')[0];
    expect(token.length).toBeGreaterThanOrEqual(40);
    expect(fila.token_hash).toBe(servicio.hashToken(token));
    expect(Object.values(fila)).not.toContain(token);
  });
});

describe('cuenta existente (grandfathered)', () => {
  it('no se bloquea aunque no tenga autorización', async () => {
    sembrar({ requerida: false });
    const { res, next } = await correrMiddleware('/progress/resumen', CUENTA_EXISTENTE);
    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('su estado es no requerida', async () => {
    sembrar({ requerida: false });
    const estado = await servicio.estadoAutorizacion(CUENTA_EXISTENTE);
    expect(estado).toMatchObject({ requerida: false, restringido: false });
  });
});

describe('enlace de autorización', () => {
  async function solicitudValida() {
    sembrar({ requerida: true });
    await servicio.solicitarAutorizacion(ESTUDIANTE);
    return tokenDelUltimoCorreo();
  }

  const aceptada = { versionPolitica: servicio.POLITICA_VERSION };

  it('confirmar autoriza y el estudiante deja de estar restringido', async () => {
    const token = await solicitudValida();
    const confirmacion = await servicio.confirmarAutorizacion({ token, ip: '10.0.0.1', ...aceptada });
    expect(confirmacion).toEqual({ valida: true, estado: 'autorizada' });

    const estado = await servicio.estadoAutorizacion(ESTUDIANTE);
    expect(estado.restringido).toBe(false);
    expect(filasDe('autorizaciones_padres')[0]).toMatchObject({ estado: 'autorizada', ip: '10.0.0.1' });
  });

  it('un enlace usado no sirve de nuevo', async () => {
    const token = await solicitudValida();
    await servicio.confirmarAutorizacion({ token, ...aceptada });
    const segunda = await servicio.confirmarAutorizacion({ token, ...aceptada });
    expect(segunda).toEqual({ valida: false, motivo: 'usado' });
  });

  it('un enlace caducado no sirve', async () => {
    const token = await solicitudValida();
    filasDe('autorizaciones_padres')[0].token_expira_at = new Date(Date.now() - 1000).toISOString();
    const r = await servicio.confirmarAutorizacion({ token, ...aceptada });
    expect(r).toEqual({ valida: false, motivo: 'vencido' });
    expect((await servicio.estadoAutorizacion(ESTUDIANTE)).restringido).toBe(true);
  });

  it('un token inventado o demasiado corto no sirve', async () => {
    await solicitudValida();
    expect(await servicio.buscarSolicitud('corto')).toEqual({ valida: false, motivo: 'invalido' });
    expect(await servicio.buscarSolicitud('x'.repeat(43))).toEqual({ valida: false, motivo: 'invalido' });
  });

  it('una versión de política distinta a la mostrada se rechaza', async () => {
    const token = await solicitudValida();
    const r = await servicio.confirmarAutorizacion({ token, versionPolitica: 'version-vieja' });
    expect(r).toEqual({ valida: false, motivo: 'version' });
  });

  it('pedir un enlace nuevo invalida el anterior', async () => {
    const primero = await solicitudValida();
    await servicio.solicitarAutorizacion(ESTUDIANTE);
    const segundo = tokenDelUltimoCorreo();
    expect((await servicio.buscarSolicitud(primero)).valida).toBe(false);
    expect((await servicio.buscarSolicitud(segundo)).valida).toBe(true);
  });
});

describe('revocación', () => {
  it('el padre revoca y el estudiante vuelve a quedar limitado', async () => {
    sembrar({ requerida: true });
    await servicio.solicitarAutorizacion(ESTUDIANTE);
    await servicio.confirmarAutorizacion({ token: tokenDelUltimoCorreo(), versionPolitica: servicio.POLITICA_VERSION });
    expect((await servicio.estadoAutorizacion(ESTUDIANTE)).restringido).toBe(false);

    const revocado = await servicio.revocarAutorizacion({ adultoId: PADRE, estudianteId: ESTUDIANTE });
    expect(revocado.revocadas).toBe(1);

    const estado = await servicio.estadoAutorizacion(ESTUDIANTE);
    expect(estado.restringido).toBe(true);
    const { res } = await correrMiddleware('/progress/resumen');
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('otro adulto no puede revocar la autorización', async () => {
    sembrar({ requerida: true });
    await servicio.solicitarAutorizacion(ESTUDIANTE);
    await servicio.confirmarAutorizacion({ token: tokenDelUltimoCorreo(), versionPolitica: servicio.POLITICA_VERSION });

    const r = await servicio.revocarAutorizacion({ adultoId: OTRO_PADRE, estudianteId: ESTUDIANTE });
    expect(r.revocadas).toBe(0);
    expect((await servicio.estadoAutorizacion(ESTUDIANTE)).restringido).toBe(false);
  });
});
