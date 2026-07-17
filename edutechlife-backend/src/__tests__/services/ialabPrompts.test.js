
const { IALAB_SYSTEM_PROMPT, generateFallbackResult } = require('../../services/ialabPrompts');

describe('IALAB_SYSTEM_PROMPT', () => {
  it('contains expected template types', () => {
    expect(IALAB_SYSTEM_PROMPT).toContain('marketing');
    expect(IALAB_SYSTEM_PROMPT).toContain('code');
    expect(IALAB_SYSTEM_PROMPT).toContain('analysis');
    expect(IALAB_SYSTEM_PROMPT).toContain('creative');
    expect(IALAB_SYSTEM_PROMPT).toContain('education');
    expect(IALAB_SYSTEM_PROMPT).toContain('general');
  });

  it('contains JSON structure definition', () => {
    expect(IALAB_SYSTEM_PROMPT).toContain('masterPrompt');
    expect(IALAB_SYSTEM_PROMPT).toContain('feedback');
    expect(IALAB_SYSTEM_PROMPT).toContain('difficulty');
    expect(IALAB_SYSTEM_PROMPT).toContain('estimatedTokens');
    expect(IALAB_SYSTEM_PROMPT).toContain('optimizationTips');
  });

  it('specifies JSON-only output', () => {
    expect(IALAB_SYSTEM_PROMPT).toContain('SOLO un objeto JSON válido');
  });
});

describe('generateFallbackResult', () => {
  it('returns fallback with correct structure', () => {
    const startTime = Date.now();
    const result = generateFallbackResult('Write a marketing email', 'marketing', startTime);

    expect(result).toMatchObject({
      masterPrompt: expect.stringContaining('marketing'),
      feedback: expect.any(String),
      difficulty: 'intermediate',
      estimatedTokens: 150,
      templateType: 'marketing',
      originalPrompt: 'Write a marketing email',
      note: 'Fallback response due to parsing error',
    });

    expect(result.optimizationTips).toHaveLength(3);
    expect(result.responseTime).toBeGreaterThanOrEqual(0);
    expect(result.timestamp).toBeDefined();
  });

  it('adjusts masterPrompt based on templateType', () => {
    const result = generateFallbackResult('Analyze data', 'analysis', Date.now());
    expect(result.masterPrompt).toContain('analysis');
    expect(result.masterPrompt).toContain('Analyze data');
  });
});
