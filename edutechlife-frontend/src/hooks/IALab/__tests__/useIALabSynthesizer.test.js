import { renderHook, act } from '@testing-library/react';
import { useIALabSynthesizer } from '../useIALabSynthesizer';

const mockState = {
  context: {
    activeMod: 1,
    modules: [
      { id: 1, title: 'Module 1', topics: ['Topic 1'], challenge: 'Challenge 1' },
    ],
    completedModules: [],
  },
};

let mockAnalyzePromptQuality;
let mockSelectAppropriateTechnique;
let mockApplyTechnique;
let mockGetAvailableTechniques;
let mockExplainTechniqueSelection;
let mockGenerateEducationalFeedback;
let mockGenerateComparisonMetrics;
let mockGenerateExecutiveSummary;
let mockIdentifyPromptType;
let mockExtractKeywords;
let mockGetQualityLevel;

vi.mock('../../../context/IALabContext', () => ({
  useIALabContext: () => mockState.context,
  useIALabProgressContext: () => mockState.context,
}));

vi.mock('../../../utils/promptAnalyzer.js', () => ({
  analyzePromptQuality: (...args) => mockAnalyzePromptQuality(...args),
  getQualityLevel: (...args) => mockGetQualityLevel(...args),
  identifyPromptType: (...args) => mockIdentifyPromptType(...args),
  extractKeywords: (...args) => mockExtractKeywords(...args),
}));

vi.mock('../../../utils/promptOptimizer.js', () => ({
  selectAppropriateTechnique: (...args) => mockSelectAppropriateTechnique(...args),
  applyTechnique: (...args) => mockApplyTechnique(...args),
  getAvailableTechniques: (...args) => mockGetAvailableTechniques(...args),
  explainTechniqueSelection: (...args) => mockExplainTechniqueSelection(...args),
}));

vi.mock('../../../utils/promptEvaluator.js', () => ({
  generateEducationalFeedback: (...args) => mockGenerateEducationalFeedback(...args),
  generateComparisonMetrics: (...args) => mockGenerateComparisonMetrics(...args),
  generateExecutiveSummary: (...args) => mockGenerateExecutiveSummary(...args),
}));

const originalFetch = globalThis.fetch;
const DEEPSEEK_OK = (content) => ({
  ok: true,
  json: vi.fn().mockResolvedValue({
    choices: [{ message: { content } }],
  }),
});

function setupMocks() {
  mockAnalyzePromptQuality = vi.fn().mockReturnValue({
    score: 45, clarity: 3, specificity: 2, context: 2, structure: 1,
    commonProblems: ['too vague'], suggestions: ['add role'],
    wordCount: 5, charCount: 30,
  });

  mockGetQualityLevel = vi.fn().mockReturnValue({
    level: 'Básico', color: '#f59e0b', emoji: '📝',
  });

  mockIdentifyPromptType = vi.fn().mockReturnValue({
    type: 'General', technique: 'RTF', icon: 'fa-pen',
  });

  mockExtractKeywords = vi.fn().mockReturnValue(['test', 'prompt']);

  mockSelectAppropriateTechnique = vi.fn().mockReturnValue({
    name: 'RTF', description: 'Rol Tarea Formato',
    icon: 'fa-robot', color: '#06B6D4',
  });

  mockApplyTechnique = vi.fn().mockReturnValue('Optimized prompt text');

  mockGetAvailableTechniques = vi.fn().mockReturnValue([
    { name: 'RTF', description: 'Rol Tarea Formato' },
    { name: 'COT', description: 'Chain of Thought' },
  ]);

  mockExplainTechniqueSelection = vi.fn().mockReturnValue('Explanation text');

  mockGenerateEducationalFeedback = vi.fn().mockReturnValue({
    summary: 'Good start', improvements: ['Add role'],
    educationalInsights: 'Insight',
  });

  mockGenerateComparisonMetrics = vi.fn().mockReturnValue({
    before: { score: 40 }, after: { score: 85 }, improvement: 112.5,
  });

  mockGenerateExecutiveSummary = vi.fn().mockReturnValue('Executive summary');
}

beforeEach(() => {
  setupMocks();
  globalThis.fetch = vi.fn();
  mockState.context.activeMod = 1;
  mockState.context.modules = [
    { id: 1, title: 'Module 1', topics: ['Topic 1'], challenge: 'Challenge 1' },
  ];
  mockState.context.completedModules = [];
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.clearAllMocks();
});

describe('useIALabSynthesizer', () => {
  test('returns initial state', () => {
    const { result } = renderHook(() => useIALabSynthesizer());

    expect(result.current.input).toBe('');
    expect(result.current.loading).toBe(false);
    expect(result.current.genData).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.history).toEqual([]);
    expect(result.current.isGenerating).toBe(false);
    expect(result.current.apiError).toBeNull();
    expect(result.current.deepSeekResult).toBeNull();
  });

  test('has all expected functions', () => {
    const { result } = renderHook(() => useIALabSynthesizer());

    expect(result.current.optimizePrompt).toBeInstanceOf(Function);
    expect(result.current.copyToClipboard).toBeInstanceOf(Function);
    expect(result.current.clearHistory).toBeInstanceOf(Function);
    expect(result.current.loadFromHistory).toBeInstanceOf(Function);
    expect(result.current.getUsageStats).toBeInstanceOf(Function);
    expect(result.current.getDynamicContext).toBeInstanceOf(Function);
    expect(result.current.getSuggestions).toBeInstanceOf(Function);
    expect(result.current.getTechniquesForDisplay).toBeInstanceOf(Function);
    expect(result.current.getQuickAnalysis).toBeInstanceOf(Function);
    expect(result.current.isValidInput).toBeInstanceOf(Function);
    expect(result.current.generateWithDeepSeek).toBeInstanceOf(Function);
  });

  test('setInput updates input', () => {
    const { result } = renderHook(() => useIALabSynthesizer());

    act(() => result.current.setInput('test prompt'));
    expect(result.current.input).toBe('test prompt');
  });

  describe('isValidInput', () => {
    test('validates input length', () => {
      const { result } = renderHook(() => useIALabSynthesizer());

      expect(result.current.isValidInput('')).toBe(false);
      expect(result.current.isValidInput('ab')).toBe(false);
      expect(result.current.isValidInput('abc')).toBe(true);
      expect(result.current.isValidInput('a'.repeat(500))).toBe(true);
      expect(result.current.isValidInput('a'.repeat(501))).toBe(false);
    });
  });

  describe('getDynamicContext', () => {
    test('returns context for current module', () => {
      const { result } = renderHook(() => useIALabSynthesizer());

      const ctx = result.current.getDynamicContext();

      expect(ctx.module).toBe('Module 1');
      expect(ctx.userLevel).toBe('Principiante');
      expect(ctx.topics).toContain('Topic 1');
    });

    test('returns advanced level when many modules completed', () => {
      mockState.context.completedModules = [1, 2, 3, 4, 5, 6];

      const { result } = renderHook(() => useIALabSynthesizer());

      const ctx = result.current.getDynamicContext();
      expect(ctx.userLevel).toBe('Avanzado');
    });
  });

  describe('getSuggestions', () => {
    test('returns suggestions based on input when input non-empty', () => {
      const { result } = renderHook(() => useIALabSynthesizer());

      act(() => result.current.setInput('test prompt'));
      const suggestions = result.current.getSuggestions();

      expect(suggestions.length).toBe(4);
      suggestions.forEach(s => expect(typeof s).toBe('string'));
    });

    test('returns general suggestions when input is empty', () => {
      const { result } = renderHook(() => useIALabSynthesizer());

      const suggestions = result.current.getSuggestions();

      expect(suggestions.length).toBe(4);
    });
  });

  describe('getQuickAnalysis', () => {
    test('returns null for empty/invalid input', () => {
      const { result } = renderHook(() => useIALabSynthesizer());

      expect(result.current.getQuickAnalysis('')).toBeNull();
      expect(result.current.getQuickAnalysis('ab')).toBeNull();
    });

    test('returns analysis for valid input', () => {
      const { result } = renderHook(() => useIALabSynthesizer());

      const analysis = result.current.getQuickAnalysis('test prompt');

      expect(analysis).not.toBeNull();
      expect(analysis.score).toBe(45);
      expect(analysis.level).toBe('Básico');
      expect(analysis.type).toBe('General');
    });

    test('handles analyzer error gracefully', () => {
      mockAnalyzePromptQuality.mockImplementation(() => { throw new Error('Analysis error'); });

      const { result } = renderHook(() => useIALabSynthesizer());

      const analysis = result.current.getQuickAnalysis('test prompt');
      expect(analysis).toBeNull();
    });
  });

  describe('getUsageStats', () => {
    test('returns empty stats when no history', () => {
      const { result } = renderHook(() => useIALabSynthesizer());

      const stats = result.current.getUsageStats();
      expect(stats.totalOptimizations).toBe(0);
      expect(stats.lastOptimization).toBeNull();
    });

    test('returns stats based on history', async () => {
      globalThis.fetch.mockResolvedValue(
        DEEPSEEK_OK(JSON.stringify({
          rol: 'expert', tarea: 'analyze', formato: 'json',
          prompt_maestro: 'optimized prompt text',
          analisis_tecnico: 'good feedback',
        }))
      );

      const { result } = renderHook(() => useIALabSynthesizer());

      await act(async () => {
        await result.current.optimizePrompt('test idea');
      });

      const stats = result.current.getUsageStats();
      expect(stats.totalOptimizations).toBe(1);
      expect(stats.averageScore).toBe(95);
    });
  });

  describe('getTechniquesForDisplay', () => {
    test('returns available techniques', () => {
      const { result } = renderHook(() => useIALabSynthesizer());

      const techniques = result.current.getTechniquesForDisplay();
      expect(techniques).toHaveLength(2);
      expect(techniques[0].name).toBe('RTF');
    });
  });

  describe('optimizePrompt', () => {
    test('returns null for empty input', async () => {
      const { result } = renderHook(() => useIALabSynthesizer());

      let res;
      await act(async () => { res = await result.current.optimizePrompt(''); });
      expect(res).toBeNull();
      expect(result.current.error).toBeTruthy();
    });

    test('returns null for too-short input', async () => {
      const { result } = renderHook(() => useIALabSynthesizer());

      let res;
      await act(async () => { res = await result.current.optimizePrompt('ab'); });
      expect(res).toBeNull();
      expect(result.current.error).toBeTruthy();
    });

    test('returns null for too-long input', async () => {
      const { result } = renderHook(() => useIALabSynthesizer());

      let res;
      await act(async () => { res = await result.current.optimizePrompt('a'.repeat(501)); });
      expect(res).toBeNull();
      expect(result.current.error).toBeTruthy();
    });

    test('uses DeepSeek API when available', async () => {
      globalThis.fetch.mockResolvedValue(
        DEEPSEEK_OK(JSON.stringify({
          rol: 'expert', tarea: 'analyze', formato: 'json',
          prompt_maestro: 'optimized prompt text',
          analisis_tecnico: 'good feedback',
        }))
      );

      const { result } = renderHook(() => useIALabSynthesizer());

      await act(async () => {
        await result.current.optimizePrompt('test idea');
      });

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.deepseek.com/chat/completions',
        expect.any(Object)
      );
      expect(result.current.genData).not.toBeNull();
      expect(result.current.genData.optimizedPrompt).toBe('optimized prompt text');
    });

    test('falls back to local system on API error', async () => {
      globalThis.fetch.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useIALabSynthesizer());

      await act(async () => {
        await result.current.optimizePrompt('test idea');
      });

      expect(mockAnalyzePromptQuality).toHaveBeenCalledWith('test idea');
      expect(mockSelectAppropriateTechnique).toHaveBeenCalled();
      expect(result.current.genData).not.toBeNull();
      expect(result.current.error).toBeNull();
    });

    test('adds result to history on success', async () => {
      globalThis.fetch.mockRejectedValue(new Error('fallback'));

      const { result } = renderHook(() => useIALabSynthesizer());

      await act(async () => {
        await result.current.optimizePrompt('test idea');
      });

      expect(result.current.history.length).toBe(1);
    });

    test('limits history to 10 items', async () => {
      globalThis.fetch.mockRejectedValue(new Error('fallback'));

      const { result } = renderHook(() => useIALabSynthesizer());

      for (let i = 0; i < 15; i++) {
        await act(async () => {
          await result.current.optimizePrompt(`idea ${i}`);
        });
      }

      expect(result.current.history.length).toBe(10);
    });
  });

  describe('clearHistory', () => {
    test('resets history, genData, and input', async () => {
      globalThis.fetch.mockRejectedValue(new Error('fallback'));

      const { result } = renderHook(() => useIALabSynthesizer());

      await act(async () => { await result.current.optimizePrompt('test'); });
      act(() => result.current.setInput('something'));

      act(() => result.current.clearHistory());

      expect(result.current.history).toEqual([]);
      expect(result.current.genData).toBeNull();
      expect(result.current.input).toBe('');
    });
  });

  describe('loadFromHistory', () => {
    test('loads item from history', async () => {
      globalThis.fetch.mockRejectedValue(new Error('fallback'));

      const { result } = renderHook(() => useIALabSynthesizer());

      await act(async () => { await result.current.optimizePrompt('test'); });

      act(() => result.current.loadFromHistory(0));
      expect(result.current.input).toBe('test');
    });

    test('does nothing for invalid index', () => {
      const { result } = renderHook(() => useIALabSynthesizer());

      act(() => result.current.loadFromHistory(99));
      expect(result.current.input).toBe('');
    });
  });

  describe('copyToClipboard', () => {
    test('returns false for empty text', () => {
      const { result } = renderHook(() => useIALabSynthesizer());

      expect(result.current.copyToClipboard('')).toBe(false);
      expect(result.current.copyToClipboard(null)).toBe(false);
    });
  });

  describe('generateWithDeepSeek', () => {
    test('calls DeepSeek API and returns result', async () => {
      globalThis.fetch.mockResolvedValue(
        DEEPSEEK_OK(JSON.stringify({
          rol: 'expert', tarea: 'test', formato: 'json',
          prompt_maestro: 'prompt', analisis_tecnico: 'ok',
        }))
      );

      const { result } = renderHook(() => useIALabSynthesizer());

      let res;
      await act(async () => {
        res = await result.current.generateWithDeepSeek('test idea');
      });

      expect(res).not.toBeNull();
      expect(res.rol).toBe('expert');
      expect(result.current.deepSeekResult).not.toBeNull();
    });

    test('handles API error gracefully', async () => {
      globalThis.fetch.mockRejectedValue(new Error('API Error'));

      const { result } = renderHook(() => useIALabSynthesizer());

      let res;
      await act(async () => {
        res = await result.current.generateWithDeepSeek('test');
      });

      expect(res).toBeNull();
      expect(result.current.apiError).toBeTruthy();
    });

    test('handles HTTP error status', async () => {
      globalThis.fetch.mockResolvedValue({ ok: false, status: 401, text: vi.fn().mockResolvedValue('Unauthorized') });

      const { result } = renderHook(() => useIALabSynthesizer());

      let res;
      await act(async () => {
        res = await result.current.generateWithDeepSeek('test');
      });

      expect(res).toBeNull();
    });
  });
});
