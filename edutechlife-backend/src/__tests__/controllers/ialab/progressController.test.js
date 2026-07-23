const path = require('path');

const SUPABASE_PATH = path.resolve(__dirname, '../../../db/supabase.js');
const CONTROLLER_PATH = path.resolve(__dirname, '../../../controllers/ialab/progressController.js');

function buildChain() {
  return {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    in: vi.fn().mockReturnThis(),
    rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
  };
}

function buildSupabase(chain) {
  return {
    from: vi.fn(() => chain),
    storage: { from: vi.fn(() => ({
      upload: vi.fn().mockResolvedValue({ error: null }),
      getPublicUrl: vi.fn(() => ({ data: { publicUrl: 'https://example.com/avatar.png' } })),
    })) },
    auth: { getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
           getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }) },
  };
}

function installMockSupabase() {
  delete require.cache[SUPABASE_PATH];
  delete require.cache[CONTROLLER_PATH];
  const chain = buildChain();
  require.cache[SUPABASE_PATH] = {
    id: SUPABASE_PATH, filename: SUPABASE_PATH, loaded: true,
    exports: buildSupabase(chain),
  };
  return chain;
}

function mockReq(body, params = {}, query = {}) {
  return { body, params, query };
}

function mockRes() {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

describe('progressController with Supabase', () => {
  it('saveProgress calls supabase insert path', async () => {
    installMockSupabase();
    const { saveProgress } = require(CONTROLLER_PATH);
    const req = mockReq({ userId: 'supa-user', moduleId: 1, completed: true, score: 4 });
    const res = mockRes();
    await saveProgress(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    const jsonArg = res.json.mock.calls[0][0];
    expect(jsonArg.progress.achievements).toContain('module_1_complete');
    expect(jsonArg.progress.achievements).toContain('module_1_excellent');
  });

  it('saveProgress returns 400 for non-string userId', async () => {
    installMockSupabase();
    const { saveProgress } = require(CONTROLLER_PATH);
    const req = mockReq({ userId: 123, moduleId: 1 });
    const res = mockRes();
    await saveProgress(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringContaining('userId') }));
  });

  it('saveProgress returns 400 for out-of-range moduleId', async () => {
    installMockSupabase();
    const { saveProgress } = require(CONTROLLER_PATH);
    const req = mockReq({ userId: 'u1', moduleId: 99 });
    const res = mockRes();
    await saveProgress(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringContaining('moduleId') }));
  });

  it('getProgress returns empty for unknown user', async () => {
    installMockSupabase();
    const { getProgress } = require(CONTROLLER_PATH);
    const req = mockReq({}, { userId: 'nonexistent' });
    const res = mockRes();
    await getProgress(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ completedModules: 0, overallProgress: 0 }));
  });

  it('getProgress returns 400 when userId missing', async () => {
    installMockSupabase();
    const { getProgress } = require(CONTROLLER_PATH);
    const req = mockReq({}, {});
    const res = mockRes();
    await getProgress(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringContaining('userId') }));
  });

  it('saveProgress catches supabase error', async () => {
    const chain = installMockSupabase();
    chain.maybeSingle = vi.fn().mockRejectedValue(new Error('DB error'));
    const { saveProgress } = require(CONTROLLER_PATH);
    const req = mockReq({ userId: 'u1', moduleId: 1 });
    const res = mockRes();
    await saveProgress(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
