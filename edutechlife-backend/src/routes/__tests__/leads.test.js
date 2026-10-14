/**
 * POST /api/leads
 * Mockea db/supabase y el aviso por correo (sin red real), como admin.test.js.
 */

const request = require('supertest');
const express = require('express');

const supabasePath = require.resolve('../../db/supabase');
const insert = vi.fn();
const listQuery = { select: vi.fn(), order: vi.fn(), limit: vi.fn() };
listQuery.select.mockReturnValue(listQuery);
listQuery.order.mockReturnValue(listQuery);
const mockSupabase = {
  from: vi.fn(() => ({ insert, select: listQuery.select })),
  auth: { getUser: vi.fn() },
};
delete require.cache[supabasePath];
require.cache[supabasePath] = { id: supabasePath, filename: supabasePath, loaded: true, exports: mockSupabase };

const notifyPath = require.resolve('../../services/leadNotification');
const mockNotify = { notifyNewLead: vi.fn() };
delete require.cache[notifyPath];
require.cache[notifyPath] = { id: notifyPath, filename: notifyPath, loaded: true, exports: mockNotify };

const leadRoutes = require('../leads');

const leadValido = (extra = {}) => ({
  nombre: 'Ana Gómez',
  email: '  Ana@Ejemplo.CO ',
  telefono: '+57 300 123 4567',
  perfil: 'padre',
  producto_interes: 'diagnostico',
  fuente: 'contacto_header',
  pagina: '/conoce-ingenia',
  referrer: 'https://www.instagram.com/',
  utm_source: 'instagram',
  utm_medium: 'bio',
  utm_campaign: '2026-10_padres-manizales_vak-gratis',
  autorizacion_datos: true,
  ...extra,
});

describe('POST /api/leads', () => {
  let app;

  beforeEach(() => {
    vi.clearAllMocks();
    insert.mockResolvedValue({ error: null });
    mockNotify.notifyNewLead.mockResolvedValue({ success: true });
    app = express();
    app.use(express.json());
    app.use('/api/leads', leadRoutes);
  });

  test('guarda el lead con atribución y avisa por correo → 201', async () => {
    const res = await request(app).post('/api/leads').send(leadValido()).expect(201);
    expect(res.body).toEqual({ ok: true });
    expect(mockSupabase.from).toHaveBeenCalledWith('leads');
    const fila = insert.mock.calls[0][0];
    expect(fila).toMatchObject({
      nombre: 'Ana Gómez',
      email: 'ana@ejemplo.co',
      perfil: 'padre',
      fuente: 'contacto_header',
      pagina: '/conoce-ingenia',
      utm_source: 'instagram',
      utm_campaign: '2026-10_padres-manizales_vak-gratis',
      autorizacion_datos: true,
    });
    expect(fila.autorizacion_fecha).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(mockNotify.notifyNewLead).toHaveBeenCalledWith(fila);
  });

  test('sin autorización de datos (Ley 1581) → 400 y no guarda', async () => {
    const res = await request(app)
      .post('/api/leads')
      .send(leadValido({ autorizacion_datos: false }))
      .expect(400);
    expect(res.body.error).toMatch(/autorizar/i);
    expect(insert).not.toHaveBeenCalled();
  });

  test('correo inválido → 400', async () => {
    await request(app).post('/api/leads').send(leadValido({ email: 'ana@' })).expect(400);
    expect(insert).not.toHaveBeenCalled();
  });

  test('nombre vacío o teléfono con letras → 400', async () => {
    await request(app).post('/api/leads').send(leadValido({ nombre: ' ' })).expect(400);
    await request(app).post('/api/leads').send(leadValido({ telefono: 'llámame' })).expect(400);
    expect(insert).not.toHaveBeenCalled();
  });

  test('formulario de origen desconocido → 400', async () => {
    await request(app).post('/api/leads').send(leadValido({ fuente: 'otro_sitio' })).expect(400);
    expect(insert).not.toHaveBeenCalled();
  });

  test('formulario del hero de IngenIA (ingenia_hero) se acepta y guarda esa fuente → 201', async () => {
    await request(app).post('/api/leads').send(leadValido({ fuente: 'ingenia_hero' })).expect(201);
    expect(insert.mock.calls[0][0]).toMatchObject({ fuente: 'ingenia_hero', perfil: 'padre' });
  });

  test('perfil desconocido se guarda como "otro"', async () => {
    await request(app).post('/api/leads').send(leadValido({ perfil: 'admin' })).expect(201);
    expect(insert.mock.calls[0][0].perfil).toBe('otro');
  });

  test('honeypot lleno → 201 silencioso, sin guardar ni avisar', async () => {
    await request(app).post('/api/leads').send(leadValido({ sitio_web: 'http://spam.example' })).expect(201);
    expect(insert).not.toHaveBeenCalled();
    expect(mockNotify.notifyNewLead).not.toHaveBeenCalled();
  });

  test('si la base falla → 500 con mensaje real y sin aviso', async () => {
    insert.mockResolvedValue({ error: { code: '42P01', message: 'relation "leads" does not exist' } });
    const res = await request(app).post('/api/leads').send(leadValido()).expect(500);
    expect(res.body.error).toMatch(/no pudimos guardar/i);
    expect(mockNotify.notifyNewLead).not.toHaveBeenCalled();
  });

  test('si el correo de aviso falla, el lead igual queda guardado → 201', async () => {
    mockNotify.notifyNewLead.mockRejectedValue(new Error('Resend caído'));
    await request(app).post('/api/leads').send(leadValido()).expect(201);
    expect(insert).toHaveBeenCalledTimes(1);
  });

  test('rate limit en producción: el envío 11 de la misma IP en una hora → 429', async () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    try {
      for (let i = 0; i < 10; i++) {
        await request(app).post('/api/leads').send(leadValido()).expect(201);
      }
      await request(app).post('/api/leads').send(leadValido()).expect(429);
    } finally {
      process.env.NODE_ENV = prev;
    }
  });

  test('Nico: solo teléfono (sin correo) → 201', async () => {
    await request(app)
      .post('/api/leads')
      .send(leadValido({ email: '', fuente: 'nico', telefono: '3001234567' }))
      .expect(201);
    expect(insert.mock.calls[0][0].email).toBeNull();
  });

  test('sin correo ni teléfono → 400', async () => {
    await request(app).post('/api/leads').send(leadValido({ email: '', telefono: '' })).expect(400);
    expect(insert).not.toHaveBeenCalled();
  });

  test('boletín: solo correo y perfil, sin nombre → 201', async () => {
    await request(app)
      .post('/api/leads')
      .send({ email: 'ana@ejemplo.co', perfil: 'docente', fuente: 'boletin', autorizacion_datos: true })
      .expect(201);
    expect(insert.mock.calls[0][0]).toMatchObject({ nombre: null, fuente: 'boletin', perfil: 'docente' });
  });

  test('boletín sin correo → 400', async () => {
    await request(app)
      .post('/api/leads')
      .send({ telefono: '3001234567', fuente: 'boletin', autorizacion_datos: true })
      .expect(400);
  });
});

describe('GET /api/leads (panel admin)', () => {
  let app;
  const admin = (role) =>
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'u1', email: 'a@test', app_metadata: { role } } },
      error: null,
    });

  beforeEach(() => {
    vi.clearAllMocks();
    listQuery.select.mockReturnValue(listQuery);
    listQuery.order.mockReturnValue(listQuery);
    listQuery.limit.mockResolvedValue({ data: [{ id: 'l1', nombre: 'Ana' }], error: null });
    app = express();
    app.use(express.json());
    app.use('/api/leads', leadRoutes);
  });

  test('sin token → 401', async () => {
    await request(app).get('/api/leads').expect(401);
  });

  test('content_creator no ve datos personales → 403', async () => {
    admin('content_creator');
    await request(app).get('/api/leads').set('Authorization', 'Bearer t').expect(403);
    expect(listQuery.select).not.toHaveBeenCalled();
  });

  test('admin → 200 con los leads más recientes', async () => {
    admin('admin');
    const res = await request(app).get('/api/leads').set('Authorization', 'Bearer t').expect(200);
    expect(res.body.leads).toEqual([{ id: 'l1', nombre: 'Ana' }]);
    expect(listQuery.order).toHaveBeenCalledWith('created_at', { ascending: false });
  });
});
