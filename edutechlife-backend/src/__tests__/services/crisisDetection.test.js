const { detectCrisis } = require('../../services/crisisDetection');

// Frases que deben disparar nivel alto (ideación suicida y abuso infantil).
// Sin texto de estudiantes reales: son frases genéricas de ejemplo.
const HIGH_RISK_ES = [
  'quiero morir',
  'no quiero vivir',
  'quiero desaparecer',
  'me quiero morir',
  'ya no quiero vivir',
  'me tocan',
  'me pegan',
  'no le digas a mi mamá',
  'no le digas a mi papá',
  'no le digas a mi mama',
  'no le digas a mi papa',
];

describe('detectCrisis - frases de ideación suicida y abuso (es)', () => {
  it.each(HIGH_RISK_ES)('detecta nivel alto con la frase "%s"', (frase) => {
    const result = detectCrisis(frase, 'es');
    expect(result.level).toBe('high');
    expect(result.keywords.some((k) => k.severity === 'high')).toBe(true);
  });

  it('detecta la frase dentro de una oración más larga', () => {
    const result = detectCrisis('Profe, a veces siento que quiero morir y nadie se entera', 'es');
    expect(result.level).toBe('high');
  });

  it('una frase ambigua de uso cotidiano no dispara nivel alto', () => {
    expect(detectCrisis('me toca hacer la tarea de matemáticas', 'es').level).not.toBe('high');
    expect(detectCrisis('me pega el calor en el salón', 'es').level).not.toBe('high');
  });

  it('no marca como nivel alto un mensaje sin señales', () => {
    const result = detectCrisis('Hoy aprendí a usar un prompt para resumir un texto', 'es');
    expect(result.level).toBe('none');
  });
});
