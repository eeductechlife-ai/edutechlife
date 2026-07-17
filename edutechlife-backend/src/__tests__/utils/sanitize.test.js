const { sanitizeString, sanitizeBody } = require('../../utils/sanitize');

describe('sanitizeString', () => {
  it('removes script tags', () => {
    expect(sanitizeString('<script>alert("xss")</script>')).toBe('');
  });

  it('removes script tags with content', () => {
    expect(sanitizeString('Hello <script>doBad()</script> World')).toBe('Hello  World');
  });

  it('removes inline event handlers', () => {
    expect(sanitizeString('<div onclick="evil()">click</div>')).toBe('<div >click</div>');
  });

  it('removes single-quoted event handlers', () => {
    expect(sanitizeString("<div onload='evil()'>load</div>")).toBe('<div >load</div>');
  });

  it('returns non-string values as-is', () => {
    expect(sanitizeString(42)).toBe(42);
    expect(sanitizeString(null)).toBe(null);
    expect(sanitizeString(undefined)).toBe(undefined);
  });

  it('preserves safe HTML', () => {
    const safe = '<p>Hello world</p>';
    expect(sanitizeString(safe)).toBe(safe);
  });
});

describe('sanitizeBody', () => {
  it('sanitizes all string values in an object', () => {
    const input = {
      name: 'Test <script>alert(1)</script>',
      desc: 'Safe text',
    };
    const result = sanitizeBody(input);
    expect(result.name).toBe('Test ');
    expect(result.desc).toBe('Safe text');
  });

  it('sanitizes nested objects', () => {
    const input = { meta: { title: '<script>bad()</script>' } };
    const result = sanitizeBody(input);
    expect(result.meta.title).toBe('');
  });

  it('sanitizes arrays', () => {
    const input = ['<script>a()</script>', 'safe'];
    const result = sanitizeBody(input);
    expect(result[0]).toBe('');
    expect(result[1]).toBe('safe');
  });

  it('returns non-object values as-is', () => {
    expect(sanitizeBody('string')).toBe('string');
    expect(sanitizeBody(42)).toBe(42);
    expect(sanitizeBody(null)).toBe(null);
  });
});
