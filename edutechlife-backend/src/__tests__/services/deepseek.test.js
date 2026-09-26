const {
  buildPayload,
  validateMessages,
} = require('../../services/deepseek');

describe('buildPayload', () => {
  it('builds payload from prompt and systemPrompt', () => {
    const result = buildPayload({
      prompt: 'Hello',
      systemPrompt: 'Be helpful',
    });
    expect(result.messages).toEqual([
      { role: 'system', content: 'Be helpful' },
      { role: 'user', content: 'Hello' },
    ]);
    expect(result.model).toBe('deepseek-flash');
    expect(result.temperature).toBe(0.7);
    expect(result.max_tokens).toBe(800);
    expect(result.stream).toBe(false);
  });

  it('uses provided messages array over prompt', () => {
    const messages = [{ role: 'user', content: 'Hi' }];
    const result = buildPayload({ messages, prompt: 'ignored' });
    expect(result.messages).toBe(messages);
  });

  it('sets response_format for JSON mode', () => {
    const result = buildPayload({ prompt: 'test', isJson: true });
    expect(result.response_format).toEqual({ type: 'json_object' });
  });

  it('uses custom temperature and tokens', () => {
    const result = buildPayload({ prompt: 'test', temperature: 0.1, maxTokens: 2000 });
    expect(result.temperature).toBe(0.1);
    expect(result.max_tokens).toBe(2000);
  });

  it('ignores models that are not server-approved', () => {
    expect(buildPayload({ prompt: 't', model: 'deepseek-v4-pro' }).model).toBe('deepseek-flash');
    expect(buildPayload({ prompt: 't', model: 'deepseek-chat' }).model).toBe('deepseek-flash');
  });

  it('honours DEEPSEEK_MODEL and DEEPSEEK_VISION_MODEL', () => {
    const prev = { ...process.env };
    process.env.DEEPSEEK_MODEL = 'deepseek-chat';
    process.env.DEEPSEEK_VISION_MODEL = 'deepseek-flash';
    try {
      expect(buildPayload({ prompt: 't' }).model).toBe('deepseek-chat');
      expect(buildPayload({ prompt: 't', model: 'deepseek-flash' }).model).toBe('deepseek-flash');
    } finally {
      process.env.DEEPSEEK_MODEL = prev.DEEPSEEK_MODEL;
      process.env.DEEPSEEK_VISION_MODEL = prev.DEEPSEEK_VISION_MODEL;
      if (prev.DEEPSEEK_MODEL === undefined) delete process.env.DEEPSEEK_MODEL;
      if (prev.DEEPSEEK_VISION_MODEL === undefined) delete process.env.DEEPSEEK_VISION_MODEL;
    }
  });

  it('respects stream option', () => {
    const result = buildPayload({ prompt: 'test', stream: true });
    expect(result.stream).toBe(true);
  });
});

describe('validateMessages', () => {
  it('returns error for null messages', () => {
    expect(validateMessages(null)).toBe('Messages array is required and must be non-empty');
  });

  it('returns error for empty array', () => {
    expect(validateMessages([])).toBe('Messages array is required and must be non-empty');
  });

  it('returns error when message lacks role', () => {
    expect(validateMessages([{ content: 'test' }])).toBe(
      'Each message must have role and content (string)'
    );
  });

  it('returns error when content is not string', () => {
    expect(validateMessages([{ role: 'user', content: 123 }])).toBe(
      'Each message must have role and content (string)'
    );
  });

  it('returns null for valid messages', () => {
    expect(
      validateMessages([{ role: 'user', content: 'hello' }])
    ).toBeNull();
  });
});
