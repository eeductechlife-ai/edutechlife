/**
 * POST /api/vak/informe
 * Recibe el PDF que genera el navegador y lo envía como adjunto al adulto.
 * Mockea db/supabase y el correo (sin red real).
 */

const request = require('supertest');
const express = require('express');

const supabasePath = require.resolve('../../db/supabase');
const insert = vi.fn();
const countChain = { eq: vi.fn(), gte: vi.fn() };
countChain.eq.mockReturnValue(countChain);
const select = vi.fn(() => countChain);
const mockSupabase = {
  from: vi.fn(() => ({ insert, select })),
  auth: { getUser: vi.fn() },
};
delete require.cache[supabasePath];
require.cache[supabasePath] = { id: supabasePath, filename: supabasePath, loaded: true, exports: mockSupabase };

const emailPath = require.resolve('../../services/emailService');
const mockEmail = { sendEmail: vi.fn() };
delete require.cache[emailPath];
require.cache[emailPath] = { id: emailPath, filename: emailPath, loaded: true, exports: mockEmail };

const vakInformeRoutes = require('../vakInforme');

const MAX = 2 * 1024 * 1024;
// PDF mínimo válido: cabecera %PDF- y relleno hasta `extra` bytes.
const pdfBase64 = (extra = 0) =>
  Buffer.concat([Buffer.from('%PDF-1.4\n'), Buffer.alloc(extra)]).toString('base64');

const informeValido = (extra = {}) => ({
  nombre: 'Laura Ortiz',
  email: '  Laura@Ejemplo.CO ',
  perfil: 'padre',
  autorizacion_datos: true,
  pdf_base64: pdfBase64(1000),
  sitio_web: '',
  ...extra,
});

describe('POST /api/vak/informe', () => {
  let app;

  beforeEach(() => {
    vi.clearAllMocks();
    insert.mockResolvedValue({ error: null });
    countChain.gte.mockResolvedValue({ count: 0, error: null });
    mockEmail.sendEmail.mockResolvedValue({ success: true, messageId: 'm1' });
    app = express();
    app.use(express.json({ limit: '8mb' }));
    app.use('/api/vak/informe', vakInformeRoutes);
  });

  test('PDF válido: guarda lead con fuente vak_informe y envía el PDF como adjunto → 201', async () => {
    const payload = informeValido();
    await request(app).post('/api/vak/informe').send(payload).expect(201);

    expect(mockSupabase.from).toHaveBeenCalledWith('leads');
    expect(insert.mock.calls[0][0]).toMatchObject({
      nombre: 'Laura Ortiz',
      email: 'laura@ejemplo.co',
      perfil: 'padre',
      fuente: 'vak_informe',
      autorizacion_datos: true,
    });
    const [to, asunto, html, texto, adjuntos] = mockEmail.sendEmail.mock.calls[0];
    expect(to).toBe('laura@ejemplo.co');
    expect(adjuntos).toEqual([
      expect.objectContaining({ filename: 'informe-diagnostico.pdf', content: payload.pdf_base64 }),
    ]);
    // Asunto genérico y cuerpo sin datos más allá del adjunto.
    expect(asunto).toBe('Informe de diagnóstico de aprendizaje de Edutechlife');
    expect(`${html} ${texto}`).not.toMatch(/Laura|Ortiz/);
  });

  test('el correo no lleva nombre del niño ni campos extra', async () => {
    await request(app)
      .post('/api/vak/informe')
      .send(informeValido({ nombre_nino: 'Juanito Pérez', nombre_estudiante: 'Juanito Pérez' }))
      .expect(201);

    const [, asunto, html, texto] = mockEmail.sendEmail.mock.calls[0];
    expect(`${asunto} ${html} ${texto}`).not.toMatch(/Juanito|Pérez/);
    expect(JSON.stringify(insert.mock.calls[0][0])).not.toMatch(/Juanito|nombre_nino|nombre_estudiante/);
  });

  test('un archivo que no es PDF → 400 sin guardar ni enviar', async () => {
    const noPdf = Buffer.from('<html>hola</html>').toString('base64');
    const res = await request(app).post('/api/vak/informe').send(informeValido({ pdf_base64: noPdf })).expect(400);
    expect(res.body.error).toMatch(/PDF/);
    expect(insert).not.toHaveBeenCalled();
    expect(mockEmail.sendEmail).not.toHaveBeenCalled();
  });

  test('PDF mayor de 2 MB → 413 sin guardar ni enviar', async () => {
    const grande = pdfBase64(MAX + 10);
    const res = await request(app).post('/api/vak/informe').send(informeValido({ pdf_base64: grande })).expect(413);
    expect(res.body.error).toMatch(/2 MB/);
    expect(insert).not.toHaveBeenCalled();
    expect(mockEmail.sendEmail).not.toHaveBeenCalled();
  });

  test('sin autorización de datos → 400', async () => {
    await request(app).post('/api/vak/informe').send(informeValido({ autorizacion_datos: false })).expect(400);
    expect(insert).not.toHaveBeenCalled();
    expect(mockEmail.sendEmail).not.toHaveBeenCalled();
  });

  test('perfil que no es adulto (estudiante) o correo inválido → 400', async () => {
    await request(app).post('/api/vak/informe').send(informeValido({ perfil: 'estudiante' })).expect(400);
    await request(app).post('/api/vak/informe').send(informeValido({ email: 'no-es-correo' })).expect(400);
    expect(insert).not.toHaveBeenCalled();
  });

  test('máximo 3 envíos por correo al día: el cuarto → 429 sin enviar', async () => {
    countChain.gte.mockResolvedValue({ count: 3, error: null });
    const res = await request(app).post('/api/vak/informe').send(informeValido()).expect(429);
    expect(res.body.error).toMatch(/3 veces/);
    expect(insert).not.toHaveBeenCalled();
    expect(mockEmail.sendEmail).not.toHaveBeenCalled();
  });

  test('cuenta los envíos del mismo correo con fuente vak_informe en 24 horas', async () => {
    await request(app).post('/api/vak/informe').send(informeValido()).expect(201);
    expect(select).toHaveBeenCalledWith('id', { count: 'exact', head: true });
    expect(countChain.eq).toHaveBeenCalledWith('email', 'laura@ejemplo.co');
    expect(countChain.eq).toHaveBeenCalledWith('fuente', 'vak_informe');
    expect(countChain.gte).toHaveBeenCalledWith('created_at', expect.any(String));
  });

  test('si el correo falla responde 502 con el error real (no 201)', async () => {
    mockEmail.sendEmail.mockResolvedValue({ success: false, error: 'Resend API error: 422' });
    const res = await request(app).post('/api/vak/informe').send(informeValido()).expect(502);
    expect(res.body.error).toMatch(/No pudimos enviar el correo/);
  });

  test('campo trampa lleno → 201 sin guardar ni enviar', async () => {
    await request(app).post('/api/vak/informe').send(informeValido({ sitio_web: 'spam' })).expect(201);
    expect(insert).not.toHaveBeenCalled();
    expect(mockEmail.sendEmail).not.toHaveBeenCalled();
  });

  test('límite por IP: el cuarto envío del día desde la misma IP → 429', async () => {
    const previo = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    try {
      const codigos = [];
      for (let i = 0; i < 4; i += 1) {
        const res = await request(app)
          .post('/api/vak/informe')
          .send(informeValido({ email: `familia${i}@ejemplo.co` }));
        codigos.push(res.status);
      }
      expect(codigos).toEqual([201, 201, 201, 429]);
    } finally {
      process.env.NODE_ENV = previo;
    }
  });
});
