describe('supabase client', () => {
  let originalUrl;
  let originalKey;

  beforeAll(() => {
    originalUrl = process.env.SUPABASE_URL;
    originalKey = process.env.SUPABASE_SERVICE_KEY;
  });

  afterEach(() => {
    process.env.SUPABASE_URL = originalUrl;
    process.env.SUPABASE_SERVICE_KEY = originalKey;
  });

  it('exports an object', () => {
    const supabase = require('../../db/supabase');
    expect(supabase).toEqual(expect.any(Object));
  });

  it('has a from method', () => {
    const supabase = require('../../db/supabase');
    expect(typeof supabase.from).toBe('function');
  });

  it('creates a client with placeholder URL when env vars missing', () => {
    const supabasePath = require.resolve('../../db/supabase');
    delete require.cache[supabasePath];

    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_KEY;

    const supabase = require('../../db/supabase');
    expect(supabase.from).toBeDefined();
  });
});
