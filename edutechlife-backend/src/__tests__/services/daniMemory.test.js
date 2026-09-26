const {
  createMemoriaFilter,
  parseMemoria,
  mergeList,
  buildMemoryRow,
} = require('../../services/daniMemory');

const run = (chunks) => {
  const f = createMemoriaFilter();
  const visible = chunks.map((c) => f.push(c)).join('') + f.flush();
  return { visible, memoria: f.memoria() };
};

describe('createMemoriaFilter', () => {
  it('passes plain text through unchanged', () => {
    expect(run(['Hola, ', 'vamos a sumar.']).visible).toBe('Hola, vamos a sumar.');
  });

  it('hides the tag and captures its content', () => {
    const r = run(['Bien hecho. <memoria>{"intereses":["fútbol"]}</memoria>']);
    expect(r.visible).toBe('Bien hecho. ');
    expect(r.memoria).toBe('{"intereses":["fútbol"]}');
  });

  it('hides a tag split across chunks', () => {
    const r = run(['¿Cuántos cuartos? <me', 'mor', 'ia>{"errores":', '["signos"]}</memoria>']);
    expect(r.visible).toBe('¿Cuántos cuartos? ');
    expect(r.memoria).toBe('{"errores":["signos"]}');
  });

  it('releases a held "<" that was not the tag', () => {
    expect(run(['3 <', ' 5 es verdad']).visible).toBe('3 < 5 es verdad');
    expect(run(['x <m']).visible).toBe('x <m');
  });
});

describe('parseMemoria', () => {
  it('maps Spanish keys to columns and validates style', () => {
    const u = parseMemoria('{"intereses":["dinosaurios"],"dificultades":["fracciones"],"estilo":"curious"}');
    expect(u.interests).toEqual(['dinosaurios']);
    expect(u.weaknesses).toEqual(['fracciones']);
    expect(u.communication_style).toBe('curious');
  });

  it('rejects invalid style, garbage and empty updates', () => {
    expect(parseMemoria('{"estilo":"loud"}')).toBeNull();
    expect(parseMemoria('no es json')).toBeNull();
    expect(parseMemoria('')).toBeNull();
  });
});

describe('mergeList', () => {
  it('puts new items first, dedupes case-insensitively and caps at 8', () => {
    expect(mergeList(['Fútbol', 'arte'], ['fútbol', 'música'])).toEqual(['fútbol', 'música', 'arte']);
    const many = Array.from({ length: 12 }, (_, i) => `t${i}`);
    expect(mergeList([], many)).toHaveLength(8);
  });
});

describe('buildMemoryRow', () => {
  const memory = { interests: ['arte'], lastMood: 'confused', communicationStyle: 'shy' };

  it('returns null when nothing changed', () => {
    expect(buildMemoryRow('s1', memory, null, 'neutral')).toBeNull();
    expect(buildMemoryRow('s1', memory, null, 'confused')).toBeNull();
  });

  it('saves a mood change alone', () => {
    const row = buildMemoryRow('s1', memory, null, 'frustrated');
    expect(row.last_mood).toBe('frustrated');
    expect(row.interests).toEqual(['arte']);
    expect(row.communication_style).toBe('shy');
  });

  it('merges model facts into existing memory', () => {
    const row = buildMemoryRow('s1', memory, parseMemoria('{"intereses":["robots"]}'), 'neutral');
    expect(row.student_id).toBe('s1');
    expect(row.interests).toEqual(['robots', 'arte']);
    expect(row.last_mood).toBe('confused');
  });
});
