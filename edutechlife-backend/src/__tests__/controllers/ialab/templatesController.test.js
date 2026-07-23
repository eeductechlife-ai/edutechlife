const path = require('path');

const SUPABASE_PATH = path.resolve(__dirname, '../../../db/supabase.js');
const CONTROLLER_PATH = path.resolve(__dirname, '../../../controllers/ialab/templatesController.js');

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

describe('templatesController with Supabase', () => {
  it('createTemplate inserts via supabase', async () => {
    installMockSupabase();
    const { createTemplate } = require(CONTROLLER_PATH);
    const req = mockReq({ userId: 'u1', templateName: 'My Template', templateData: { blocks: [] } });
    const res = mockRes();
    await createTemplate(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  it('createTemplate returns 400 when required fields missing', async () => {
    installMockSupabase();
    const { createTemplate } = require(CONTROLLER_PATH);
    const req = mockReq({ userId: 'u1' });
    const res = mockRes();
    await createTemplate(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringContaining('Missing') }));
  });

  it('getTemplates returns empty list via supabase', async () => {
    installMockSupabase();
    const { getTemplates } = require(CONTROLLER_PATH);
    const req = mockReq({}, { userId: 'u1' });
    const res = mockRes();
    await getTemplates(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, templates: [], total: 0 }));
  });

  it('getTemplates returns 400 when userId missing', async () => {
    installMockSupabase();
    const { getTemplates } = require(CONTROLLER_PATH);
    const req = mockReq({}, {});
    const res = mockRes();
    await getTemplates(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringContaining('User ID') }));
  });

  it('updateTemplate updates via supabase', async () => {
    installMockSupabase();
    const { updateTemplate } = require(CONTROLLER_PATH);
    const req = mockReq({ templateName: 'Updated' }, { templateId: 'tpl_1' });
    const res = mockRes();
    await updateTemplate(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  it('updateTemplate returns 400 when templateId missing', async () => {
    installMockSupabase();
    const { updateTemplate } = require(CONTROLLER_PATH);
    const req = mockReq({ templateName: 'Updated' }, {});
    const res = mockRes();
    await updateTemplate(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringContaining('Template ID') }));
  });

  it('deleteTemplate deletes via supabase', async () => {
    installMockSupabase();
    const { deleteTemplate } = require(CONTROLLER_PATH);
    const req = mockReq({}, { templateId: 'tpl_1' });
    const res = mockRes();
    await deleteTemplate(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  it('deleteTemplate returns 400 when templateId missing', async () => {
    installMockSupabase();
    const { deleteTemplate } = require(CONTROLLER_PATH);
    const req = mockReq({}, {});
    const res = mockRes();
    await deleteTemplate(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringContaining('Template ID') }));
  });
});
