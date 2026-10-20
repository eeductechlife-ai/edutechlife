/**
 * /api/ingenia/dani/chat con studentId en el cuerpo enviado por un padre.
 *
 * El padre solo puede usar el chat de un estudiante con el que tiene un vínculo
 * activo en parent_student_links. La tabla (migración 023) tiene las columnas
 * parent_user_id, student_user_id (auth uid del estudiante), is_active y
 * created_at: una consulta por otras columnas falla como en PostgREST.
 */
const request = require('supertest');

const { h, crearApp } = require('../helpers/daniHarness');
const supabase = require('../../db/supabase');

const COLUMNAS_VINCULO = ['parent_user_id', 'student_user_id', 'is_active', 'created_at'];
let vinculos = [];

/** parent_student_links que respeta columnas y filtros eq, como la tabla real. */
function tablaVinculos() {
  const filtros = [];
  let columnas = [];
  const resolver = async () => {
    const desconocida = [...columnas, ...filtros.map(([c]) => c)].find((c) => !COLUMNAS_VINCULO.includes(c));
    if (desconocida) {
      return { data: null, error: { code: '42703', message: `column parent_student_links.${desconocida} does not exist` } };
    }
    const fila = vinculos.find((v) => filtros.every(([c, val]) => v[c] === val));
    return { data: fila ?? null, error: null };
  };
  const q = {
    select: (cols = '*') => {
      columnas = cols === '*' ? [] : cols.split(',').map((c) => c.trim());
      return q;
    },
    eq: (col, val) => {
      filtros.push([col, val]);
      return q;
    },
    limit: () => q,
    maybeSingle: resolver,
    single: resolver,
  };
  return q;
}

const fromHarness = supabase.from;
supabase.from = (tabla) => (tabla === 'parent_student_links' ? tablaVinculos() : fromHarness(tabla));

const app = crearApp();

// En el arnés, students devuelve { id: 'student-1', auth_id: 'test-user-id' }.
const enviarComoPadre = () =>
  request(app)
    .post('/api/ingenia/dani/chat')
    .set('Authorization', 'Bearer test-token')
    .set('x-test-user-id', 'padre-1')
    .send({ message: 'Hola Dani, ¿cómo va mi hijo con fracciones?', studentId: 'student-1' });

describe('Dani chat: padre con studentId en el cuerpo', () => {
  beforeEach(() => {
    h.reset();
    vinculos = [];
  });

  it('padre con vínculo activo recibe respuesta (200)', async () => {
    vinculos = [{ parent_user_id: 'padre-1', student_user_id: 'test-user-id', is_active: true, created_at: '2026-10-01T00:00:00Z' }];
    const r = await enviarComoPadre();
    expect(r.status).toBe(200);
    expect(h.llamadas.length).toBe(1);
  });

  it('padre con vínculo inactivo recibe 403', async () => {
    vinculos = [{ parent_user_id: 'padre-1', student_user_id: 'test-user-id', is_active: false, created_at: '2026-10-01T00:00:00Z' }];
    const r = await enviarComoPadre();
    expect(r.status).toBe(403);
    expect(h.llamadas.length).toBe(0);
  });

  it('adulto vinculado a otro estudiante recibe 403', async () => {
    vinculos = [{ parent_user_id: 'padre-1', student_user_id: 'otro-estudiante', is_active: true, created_at: '2026-10-01T00:00:00Z' }];
    const r = await enviarComoPadre();
    expect(r.status).toBe(403);
    expect(h.llamadas.length).toBe(0);
  });
});
