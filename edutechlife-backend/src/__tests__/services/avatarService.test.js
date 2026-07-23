const EventEmitter = require('events');

const mockReplicateRun = vi.fn();

beforeAll(() => {
  const replicatePath = require.resolve('replicate');
  delete require.cache[replicatePath];
  require.cache[replicatePath] = {
    id: replicatePath,
    filename: replicatePath,
    loaded: true,
    exports: vi.fn(function () { return { run: mockReplicateRun }; }),
  };

  const httpsPath = require.resolve('https');
  delete require.cache[httpsPath];
  require.cache[httpsPath] = {
    id: httpsPath,
    filename: httpsPath,
    loaded: true,
    exports: {
      get: vi.fn(),
      request: vi.fn(),
    },
  };
});

describe('avatarService', () => {
  let https;

  beforeAll(() => {
    https = require('https');
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('has generateAvatar function', () => {
    const { generateAvatar } = require('../../services/avatarService');
    expect(typeof generateAvatar).toBe('function');
  });

  it('throws when replicate run fails', async () => {
    const { generateAvatar } = require('../../services/avatarService');

    mockReplicateRun.mockRejectedValue(new Error('API error'));

    await expect(generateAvatar('Fail Tutor')).rejects.toThrow('API error');
  });

  it('handles https download error', async () => {
    const { generateAvatar } = require('../../services/avatarService');

    mockReplicateRun.mockResolvedValue(['https://example.com/generated.png']);

    https.get.mockImplementation((url, callback) => {
      const mockReq = { on: vi.fn((event, handler) => { if (event === 'error') handler(new Error('Download failed')); }) };
      return mockReq;
    });

    await expect(generateAvatar('Download Fail')).rejects.toThrow('Download failed');
  });
});
