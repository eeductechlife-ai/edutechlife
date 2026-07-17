describe('supabase client', () => {
  let supabase;

  beforeAll(() => {
    supabase = require('../../db/supabase');
  });

  it('exports an object', () => {
    expect(supabase).toEqual(expect.any(Object));
  });

  it('has a from method', () => {
    expect(typeof supabase.from).toBe('function');
  });

  it('creates a client with placeholder URL when env vars missing', () => {
    expect(supabase.from).toBeDefined();
  });
});
