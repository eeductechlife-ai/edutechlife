/**
 * Seudónimo del nombre del niño en las llamadas a DeepSeek (DANI_PSEUDONIMO).
 *
 * - Apagado (valor distinto de "true"): las llamadas y la respuesta son idénticas
 *   a la línea base guardada en fixtures/dani-apagado.json.
 * - Encendido: el modelo no ve el nombre ni los apellidos ni el colegio, y el niño
 *   recibe su nombre real en la respuesta y en el historial guardado.
 */
const request = require('supertest');
const { h, crearApp, eventosSSE } = require('../helpers/daniHarness');
const BASELINE = require('../fixtures/dani-apagado.json');

const app = crearApp();
const CABECERAS = { Authorization: 'Bearer test-token' };
const MENSAJE = 'Hola, Sol. ¿Me ayudas con fracciones?';
const HISTORIAL = [
  { role: 'user', content: 'Hola' },
  { role: 'assistant', content: '¡Hola Sol!' },
];

const codigoEn = (texto) => {
  const m = texto.match(/Estudiante [0-9A-F]{4}/);
  return m ? m[0] : null;
};
const textoDeChunks = (r) =>
  eventosSSE(r.text).filter((e) => e.chunk).map((e) => e.chunk).join('');
const aparecePalabra = (texto, palabra) =>
  new RegExp(`(?<![\\p{L}\\p{N}_])${palabra}(?![\\p{L}\\p{N}_])`, 'u').test(texto);

function limpiar() {
  h.llamadas.length = 0;
  h.inserts.length = 0;
  h.upserts.length = 0;
}

function pedirDani(cuerpo = {}) {
  return request(app)
    .post('/api/ingenia/dani/chat')
    .set(CABECERAS)
    .send({ message: MENSAJE, studentId: 'student-1', history: HISTORIAL, ...cuerpo });
}

function pedirStream(cuerpo = {}) {
  return request(app)
    .post('/api/ingenia/chat/stream')
    .set(CABECERAS)
    .send({ messages: [{ role: 'user', content: 'Hola, soy Sol' }], context: 'Nombre: Sol', ...cuerpo });
}

describe('DANI_PSEUDONIMO apagado: mismo comportamiento que hoy', () => {
  beforeEach(() => {
    delete process.env.DANI_PSEUDONIMO;
    h.reset();
    limpiar();
  });

  it('/dani/chat envía a DeepSeek, guarda y responde exactamente igual que la línea base', async () => {
    const r = await pedirDani();
    expect(r.status).toBe(200);
    expect(r.text).toBe(BASELINE.dani.body);
    expect(JSON.parse(JSON.stringify(h.llamadas))).toEqual(BASELINE.dani.llamadas);
    expect(JSON.parse(JSON.stringify(h.inserts))).toEqual(BASELINE.dani.inserts);
  });

  it('/chat/stream envía a DeepSeek y responde exactamente igual que la línea base', async () => {
    const r = await pedirStream();
    expect(r.status).toBe(200);
    expect(r.text).toBe(BASELINE.stream.body);
    expect(JSON.parse(JSON.stringify(h.llamadas))).toEqual(BASELINE.stream.llamadas);
  });

  it.each(['false', '1', 'TRUE', ''])('DANI_PSEUDONIMO=%j cuenta como apagado', async (valor) => {
    process.env.DANI_PSEUDONIMO = valor;
    const r = await pedirDani();
    expect(r.text).toBe(BASELINE.dani.body);
    expect(JSON.parse(JSON.stringify(h.llamadas))).toEqual(BASELINE.dani.llamadas);
  });
});

describe('DANI_PSEUDONIMO encendido', () => {
  beforeEach(() => {
    process.env.DANI_PSEUDONIMO = 'true';
    h.reset();
    limpiar();
  });
  afterEach(() => {
    delete process.env.DANI_PSEUDONIMO;
  });

  it('el payload no contiene nombre, apellidos ni colegio, pero sí el código', async () => {
    h.ctx.profile.name = 'Sol Ramírez';
    h.tablas.students = { id: 'student-1', auth_id: 'test-user-id', name: 'Sol Ramírez' };
    await pedirDani({ message: 'Hola, soy Sol Ramírez y no entiendo las fracciones' });
    const enviado = JSON.stringify(h.llamadas[0].messages);
    expect(aparecePalabra(enviado, 'Sol')).toBe(false);
    expect(enviado).not.toContain('Ramírez');
    expect(enviado).not.toContain('Colegio San José');
    expect(codigoEn(enviado)).not.toBeNull();
  });

  it('la respuesta que llega al niño tiene su nombre aunque el código llegue partido en trozos', async () => {
    h.respuesta = (msgs) => {
      const c = codigoEn(JSON.stringify(msgs));
      const texto = `¡Hola, ${c}! ¿Listo para las fracciones?`;
      const i = texto.indexOf(c);
      return [texto.slice(0, i + 3), texto.slice(i + 3, i + 9), texto.slice(i + 9)];
    };
    const r = await pedirDani();
    expect(textoDeChunks(r)).toBe('¡Hola, Sol! ¿Listo para las fracciones?');
  });

  it('el historial enviado usa el código y el historial guardado usa el nombre real', async () => {
    h.respuesta = (msgs) => [`¡Bien, ${codigoEn(JSON.stringify(msgs))}!`];
    await pedirDani();
    const enviados = h.llamadas[0].messages;
    const codigo = codigoEn(JSON.stringify(enviados));
    expect(enviados[2].content).toBe(`¡Hola ${codigo}!`);
    expect(enviados.at(-1).content).toBe(`Hola, ${codigo}. ¿Me ayudas con fracciones?`);
    expect(h.inserts[0].row.user_message).toBe(MENSAJE);
    expect(h.inserts[0].row.ai_response).toBe('¡Bien, Sol!');
  });

  it('el nombre que el niño escribe en el chat también se oculta', async () => {
    await pedirDani({ message: 'Sol, hoy brilla el sol y la luz' });
    const enviado = h.llamadas[0].messages.at(-1).content;
    expect(enviado).toMatch(/^Estudiante [0-9A-F]{4}, hoy brilla el sol y la luz$/);
  });

  it('no toca palabras comunes parecidas al nombre (sol, Soledad, Solecito)', async () => {
    await pedirDani({ message: 'Soledad vio el sol y un Solecito en el cielo' });
    const enviado = h.llamadas[0].messages.at(-1).content;
    expect(enviado).toContain('Soledad vio el sol y un Solecito en el cielo');
  });

  it('oculta el nombre también dentro del contexto del documento que sube el niño', async () => {
    await pedirDani({
      documentContext: { title: 'Ensayo de Sol', summary: 'Sol escribió bien', strengths: ['claridad'], improvements: [], score: 80, subject: 'Lengua' },
    });
    const enviado = JSON.stringify(h.llamadas[0].messages);
    expect(aparecePalabra(enviado, 'Sol')).toBe(false);
    expect(enviado).toContain('Ensayo de Estudiante');
  });

  it('la memoria que Dani guarda queda con el nombre real', async () => {
    h.respuesta = (msgs) => [
      `¡Listo! <memoria>{"intereses":["${codigoEn(JSON.stringify(msgs))} disfruta el fútbol"]}</memoria>`,
    ];
    await pedirDani();
    const fila = h.upserts.find((u) => u.tabla === 'dani_memory');
    expect(fila.row.interests).toContain('Sol disfruta el fútbol');
  });

  it('/chat/stream: el prompt y el contexto no llevan el nombre completo; el niño ve su nombre', async () => {
    h.tablas.students = { id: 'student-1', auth_id: 'test-user-id', name: 'Sol Ramírez' };
    h.respuesta = (msgs) => [`¡Qué bien, ${codigoEn(JSON.stringify(msgs))}!`];
    const r = await pedirStream({ context: 'Nombre: Sol Ramírez' });
    const enviado = JSON.stringify(h.llamadas[0].messages);
    expect(aparecePalabra(enviado, 'Sol')).toBe(false);
    expect(enviado).not.toContain('Ramírez');
    expect(textoDeChunks(r)).toBe('¡Qué bien, Sol!');
  });

  it('/chat/stream sin perfil de estudiante no inventa nombre y responde igual', async () => {
    h.tablas.students = null;
    h.respuesta = () => ['Hola, ', 'vamos'];
    const r = await pedirStream({ context: 'Contexto del cliente' });
    expect(r.status).toBe(200);
    expect(textoDeChunks(r)).toBe('Hola, vamos');
    expect(JSON.stringify(h.llamadas[0].messages)).toContain('Contexto del cliente');
  });
});
