const {
  pseudonimoActivo,
  prepararPseudonimo,
  pseudonimoFallido,
  redactarContenido,
  redactarProfundo,
  codigoPara,
} = require('../../services/daniPseudonimo');

const CODIGO_RE = /^Estudiante [0-9A-F]{4}$/;

describe('daniPseudonimo — activación', () => {
  afterEach(() => { delete process.env.DANI_PSEUDONIMO; });

  it('solo se activa con el valor exacto "true"', () => {
    delete process.env.DANI_PSEUDONIMO;
    expect(pseudonimoActivo()).toBe(false);
    for (const v of ['false', '1', 'TRUE', 'yes', '']) {
      process.env.DANI_PSEUDONIMO = v;
      expect(pseudonimoActivo()).toBe(false);
    }
    process.env.DANI_PSEUDONIMO = 'true';
    expect(pseudonimoActivo()).toBe(true);
  });
});

describe('daniPseudonimo — código', () => {
  it('genera un código neutro, estable para el mismo id y distinto entre ids', () => {
    const a = codigoPara('student-1');
    expect(a).toMatch(CODIGO_RE);
    expect(codigoPara('student-1')).toBe(a);
    expect(codigoPara('student-2')).not.toBe(a);
  });
});

describe('daniPseudonimo — redacción', () => {
  const p = prepararPseudonimo({ studentId: 'student-1', name: 'Sol' });
  const c = codigoPara('student-1');

  it('no hay nada que ocultar sin nombre o con nombre genérico', () => {
    expect(prepararPseudonimo({ studentId: 'x', name: null })).toBeNull();
    expect(prepararPseudonimo({ studentId: 'x', name: undefined })).toBeNull();
    expect(prepararPseudonimo({ studentId: 'x', name: '' })).toBeNull();
    expect(prepararPseudonimo({ studentId: 'x', name: 'Estudiante' })).toBeNull();
  });

  it('reemplaza el nombre de pila como palabra completa', () => {
    expect(p.redact('Hola Sol!')).toBe(`Hola ${c}!`);
    expect(p.redact('SOL, ven')).toBe(`${c}, ven`);
  });

  it('no toca la minúscula ni palabras que contienen el nombre', () => {
    expect(p.redact('el sol y Soledad y Solecito')).toBe('el sol y Soledad y Solecito');
  });

  it('reemplaza el nombre completo antes que la pila y no deja apellidos', () => {
    const q = prepararPseudonimo({ studentId: 'student-1', name: 'Sol Ramírez' });
    expect(q.redact('Soy Sol Ramírez')).toBe(`Soy ${c}`);
    expect(q.redact('Soy Sol')).toBe(`Soy ${c}`);
  });

  it('acentos y caracteres especiales del nombre', () => {
    const q = prepararPseudonimo({ studentId: 'student-1', name: 'María $ol' });
    expect(q.redact('Hola María')).toBe(`Hola ${c}`);
    expect(q.redact('hola maría')).toBe('hola maría');
  });

  it('no cambia textos sin nombre', () => {
    expect(p.redact('no entiendo las fracciones')).toBe('no entiendo las fracciones');
  });
});

describe('daniPseudonimo — restauración', () => {
  const p = prepararPseudonimo({ studentId: 'student-1', name: 'Sol Ramírez' });
  const c = codigoPara('student-1');

  it('devuelve el primer nombre donde aparece el código, sin distinguir mayúsculas', () => {
    expect(p.restore(`¡Hola, ${c}! y ${c.toLowerCase()}`)).toBe('¡Hola, Sol! y Sol');
  });

  it('restaura aunque el código llegue partido en trozos del stream', () => {
    const texto = `Hola ${c}, ¿listo?`;
    for (let corte = 1; corte < texto.length; corte++) {
      const r = p.restorer();
      const salida = r.push(texto.slice(0, corte)) + r.push(texto.slice(corte)) + r.flush();
      expect(salida).toBe('Hola Sol, ¿listo?');
    }
  });

  it('un trozo que parece el inicio del código y no lo es se devuelve tal cual', () => {
    const r = p.restorer();
    const salida = r.push('Estu') + r.push('dy de 5') + r.flush();
    expect(salida).toBe('Estudy de 5');
  });
});

describe('daniPseudonimo — fallo', () => {
  it('si el patrón no se puede preparar, el seudónimo es fallido: no envía el nombre y usa "tú"', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const p = prepararPseudonimo(
      { studentId: 'student-1', name: 'Sol' },
      { compilar: () => { throw new Error('boom'); } },
    );
    expect(p.fallo).toBe(true);
    expect(p.nombreEnPrompt).toBeNull();
    expect(p.redact('Hola Sol, ¿qué tal?')).toBe('Hola tú, ¿qué tal?');
    expect(p.restore('texto')).toBe('texto');
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('[DaniPseudonimo] ')); expect(warn).toHaveBeenCalledWith(expect.stringContaining('boom'));
    warn.mockRestore();
  });

  it('un nombre que no es texto también cuenta como fallo', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(prepararPseudonimo({ studentId: 'x', name: 12345 }).fallo).toBe(true);
    warn.mockRestore();
  });

  it('pseudonimoFallido no altera textos que no son cadenas', () => {
    expect(pseudonimoFallido(['Sol']).redact(null)).toBeNull();
  });
});

describe('daniPseudonimo — contenido estructurado', () => {
  const p = prepararPseudonimo({ studentId: 'student-1', name: 'Sol' });
  const c = codigoPara('student-1');

  it('redacta partes de texto de mensajes multimodales y respeta las imágenes', () => {
    const contenido = [
      { type: 'text', text: 'Mira esto, Sol' },
      { type: 'image_url', image_url: { url: 'https://x/y.png' } },
    ];
    expect(redactarContenido(contenido, p)).toEqual([
      { type: 'text', text: `Mira esto, ${c}` },
      { type: 'image_url', image_url: { url: 'https://x/y.png' } },
    ]);
  });

  it('redacta recursivamente objetos y listas', () => {
    expect(redactarProfundo({ titulo: 'Sol', lista: ['Sol bien'], n: 3 }, p)).toEqual({
      titulo: c, lista: [`${c} bien`], n: 3,
    });
  });

  it('sin seudónimo devuelve el valor original', () => {
    const v = { titulo: 'Sol' };
    expect(redactarProfundo(v, null)).toBe(v);
    expect(redactarContenido('Sol', null)).toBe('Sol');
  });
});
