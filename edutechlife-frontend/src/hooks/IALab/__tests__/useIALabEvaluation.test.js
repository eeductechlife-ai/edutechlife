import { renderHook, act } from '@testing-library/react';
import useIALabEvaluation from '../useIALabEvaluation';

const mockUser = { id: 'test-user-456' };

let mockAuthUser;
const originalFetch = globalThis.fetch;

vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({ user: mockAuthUser }),
}));

const mockSupabase = {
  from: vi.fn(() => ({
    upsert: vi.fn(() => ({
      select: vi.fn(() => ({
        maybeSingle: vi.fn().mockResolvedValue({ data: { id: 1 }, error: null }),
      })),
    })),
  })),
};

vi.mock('../../../lib/supabase', () => ({
  createClerkSupabaseClient: vi.fn(() => mockSupabase),
}));

const DEEPSEEK_OK = (content) => ({
  ok: true,
  json: vi.fn().mockResolvedValue({
    choices: [{ message: { content } }],
  }),
});

const VALID_EXERCISES_JSON = JSON.stringify({
  ejercicio1: 'Escenario de prueba para ejercicio 1',
  ejercicio2: 'Prompt malo para optimizar',
  ejercicio3: 'Caso de uso complejo',
});

const VALID_EVALUATION_JSON = JSON.stringify({
  nota_ej1: 85,
  nota_ej2: 70,
  nota_ej3: 90,
  notaGlobal: 81.7,
  feedback_ej1: 'Buen trabajo en ej1',
  feedback_ej2: 'Sigue mejorando ej2',
  feedback_ej3: 'Excelente ej3',
});

beforeEach(() => {
  mockAuthUser = mockUser;
  globalThis.fetch = vi.fn();
  mockSupabase.from = vi.fn(() => ({
    upsert: vi.fn(() => ({
      select: vi.fn(() => ({
        maybeSingle: vi.fn().mockResolvedValue({ data: { id: 1 }, error: null }),
      })),
    })),
  }));
});

afterEach(() => {
  vi.clearAllMocks();
  globalThis.fetch = originalFetch;
});

describe('useIALabEvaluation', () => {
  test('returns initial state', () => {
    const { result } = renderHook(() => useIALabEvaluation());

    expect(result.current.state).toEqual({
      step: 1,
      exercises: null,
      responses: { ej1: '', ej2: '', ej3: '' },
      evaluation: null,
      loading: false,
      error: null,
    });
  });

  test('has all expected functions', () => {
    const { result } = renderHook(() => useIALabEvaluation());

    expect(result.current.generateExercises).toBeInstanceOf(Function);
    expect(result.current.evaluateAnswers).toBeInstanceOf(Function);
    expect(result.current.saveGradeToSupabase).toBeInstanceOf(Function);
    expect(result.current.setStep).toBeInstanceOf(Function);
    expect(result.current.setResponse).toBeInstanceOf(Function);
    expect(result.current.resetEvaluation).toBeInstanceOf(Function);
  });

  test('setStep changes step', () => {
    const { result } = renderHook(() => useIALabEvaluation());

    act(() => result.current.setStep(2));
    expect(result.current.state.step).toBe(2);

    act(() => result.current.setStep('results'));
    expect(result.current.state.step).toBe('results');
  });

  test('setResponse updates a single exercise response', () => {
    const { result } = renderHook(() => useIALabEvaluation());

    act(() => result.current.setResponse('ej1', 'mi respuesta'));
    expect(result.current.state.responses.ej1).toBe('mi respuesta');
    expect(result.current.state.responses.ej2).toBe('');
    expect(result.current.state.responses.ej3).toBe('');
  });

  test('setResponse preserves other responses', () => {
    const { result } = renderHook(() => useIALabEvaluation());

    act(() => result.current.setResponse('ej1', 'primera'));
    act(() => result.current.setResponse('ej2', 'segunda'));
    expect(result.current.state.responses.ej1).toBe('primera');
    expect(result.current.state.responses.ej2).toBe('segunda');
  });

  test('resetEvaluation resets all state to initial', () => {
    const { result } = renderHook(() => useIALabEvaluation());

    act(() => result.current.setStep(2));
    act(() => result.current.setResponse('ej1', 'algo'));

    act(() => result.current.resetEvaluation());

    expect(result.current.state).toEqual({
      step: 1,
      exercises: null,
      responses: { ej1: '', ej2: '', ej3: '' },
      evaluation: null,
      loading: false,
      error: null,
    });
  });

  describe('generateExercises', () => {
    test('calls DeepSeek API and sets exercises on success', async () => {
      globalThis.fetch.mockResolvedValue(
        DEEPSEEK_OK(JSON.stringify({ ejercicio1: 'test', ejercicio2: 'test2', ejercicio3: 'test3' }))
      );

      const { result } = renderHook(() => useIALabEvaluation());

      await act(async () => {
        await result.current.generateExercises();
      });

      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
      expect(globalThis.fetch).toHaveBeenCalledWith('https://api.deepseek.com/chat/completions', expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      }));

      expect(result.current.state.loading).toBe(false);
      expect(result.current.state.exercises).toEqual({
        ejercicio1: 'test',
        ejercicio2: 'test2',
        ejercicio3: 'test3',
      });
      expect(result.current.state.error).toBeNull();
    });

    test('falls back to predefined exercises on API error', async () => {
      globalThis.fetch.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useIALabEvaluation());

      await act(async () => {
        await result.current.generateExercises();
      });

      expect(result.current.state.loading).toBe(false);
      expect(result.current.state.exercises).toBeTruthy();
      expect(result.current.state.exercises.ejercicio1).toBeTruthy();
      expect(result.current.state.exercises.ejercicio2).toBeTruthy();
      expect(result.current.state.exercises.ejercicio3).toBeTruthy();
      expect(result.current.state.error).toContain('Usando ejercicios predefinidos');
    });

    test('falls back on HTTP error status', async () => {
      globalThis.fetch.mockResolvedValue({ ok: false, status: 429 });

      const { result } = renderHook(() => useIALabEvaluation());

      await act(async () => {
        await result.current.generateExercises();
      });

      expect(result.current.state.loading).toBe(false);
      expect(result.current.state.exercises).toBeTruthy();
      expect(result.current.state.error).toContain('ejercicios predefinidos');
    });

    test('falls back when JSON cannot be extracted', async () => {
      globalThis.fetch.mockResolvedValue(DEEPSEEK_OK('texto sin json'));

      const { result } = renderHook(() => useIALabEvaluation());

      await act(async () => {
        await result.current.generateExercises();
      });

      expect(result.current.state.loading).toBe(false);
      expect(result.current.state.exercises).toBeTruthy();
    });

    test('falls back when all exercises are empty strings', async () => {
      globalThis.fetch.mockResolvedValue(
        DEEPSEEK_OK(JSON.stringify({ ejercicio1: '', ejercicio2: '', ejercicio3: '' }))
      );

      const { result } = renderHook(() => useIALabEvaluation());

      await act(async () => {
        await result.current.generateExercises();
      });

      expect(result.current.state.loading).toBe(false);
      expect(result.current.state.exercises).toBeTruthy();
    });

    test('sets loading state correctly', async () => {
      let resolveFetch;
      globalThis.fetch.mockImplementation(() => new Promise((resolve) => { resolveFetch = resolve; }));

      const { result } = renderHook(() => useIALabEvaluation());

      act(() => {
        result.current.generateExercises();
      });

      act(() => {
        expect(result.current.state.loading).toBe(true);
      });

      await act(async () => {
        resolveFetch(
          DEEPSEEK_OK(JSON.stringify({ ejercicio1: 'a', ejercicio2: 'b', ejercicio3: 'c' }))
        );
      });

      expect(result.current.state.loading).toBe(false);
    });
  });

  describe('evaluateAnswers', () => {
    test('calls DeepSeek API and sets evaluation on success', async () => {
      globalThis.fetch
        .mockResolvedValueOnce(DEEPSEEK_OK(VALID_EXERCISES_JSON))
        .mockResolvedValueOnce(DEEPSEEK_OK(VALID_EVALUATION_JSON));

      const { result } = renderHook(() => useIALabEvaluation());

      await act(async () => {
        await result.current.generateExercises();
      });

      const responses = { ej1: 'mi respuesta larga', ej2: 'otra respuesta', ej3: 'tercera respuesta' };

      let evalResult;
      await act(async () => {
        evalResult = await result.current.evaluateAnswers(responses);
      });

      expect(globalThis.fetch).toHaveBeenCalledTimes(2);
      expect(result.current.state.loading).toBe(false);
      expect(result.current.state.evaluation).toBeTruthy();
      expect(result.current.state.evaluation.nota_ej1).toBe(85);
      expect(result.current.state.evaluation.notaGlobal).toBe(81.7);
      expect(evalResult).toEqual(result.current.state.evaluation);
    });

    test('applies defaults for missing evaluation fields', async () => {
      globalThis.fetch
        .mockResolvedValueOnce(DEEPSEEK_OK(VALID_EXERCISES_JSON))
        .mockResolvedValueOnce(DEEPSEEK_OK(JSON.stringify({ nota_ej1: 'not-a-number' })));

      const { result } = renderHook(() => useIALabEvaluation());

      await act(async () => {
        await result.current.generateExercises();
      });

      await act(async () => {
        await result.current.evaluateAnswers({ ej1: '', ej2: '', ej3: '' });
      });

      expect(result.current.state.evaluation.nota_ej1).toBe(0);
      expect(result.current.state.evaluation.notaGlobal).toBe(0);
    });

    test('falls back to local scoring on API error', async () => {
      globalThis.fetch
        .mockResolvedValueOnce(DEEPSEEK_OK(VALID_EXERCISES_JSON))
        .mockRejectedValueOnce(new Error('API error'));

      const { result } = renderHook(() => useIALabEvaluation());

      await act(async () => {
        await result.current.generateExercises();
      });

      let evalResult;
      await act(async () => {
        evalResult = await result.current.evaluateAnswers({
          ej1: JSON.stringify({ rol: 'experto', contexto: 'startup', tarea: 'crear' }),
          ej2: 'prompt optimizado con contexto y tarea',
          ej3: 'prompt completo desde cero con todas las secciones',
        });
      });

      expect(evalResult).toBeTruthy();
      expect(evalResult.nota_ej1).toBe(100);
      expect(evalResult.nota_ej2).toBeGreaterThan(50);
      expect(evalResult.nota_ej3).toBeGreaterThan(50);
      expect(result.current.state.error).toContain('evaluación local');
    });

    test('local fallback scores ej1 correctly for drag-and-drop JSON', async () => {
      globalThis.fetch
        .mockResolvedValueOnce(DEEPSEEK_OK(VALID_EXERCISES_JSON))
        .mockRejectedValueOnce(new Error('fallback'));

      const { result } = renderHook(() => useIALabEvaluation());

      await act(async () => {
        await result.current.setResponse('ej1', JSON.stringify({ rol: 'experto', contexto: '', tarea: '' }));
      });

      await act(async () => {
        await result.current.generateExercises();
      });

      let evalResult;
      await act(async () => {
        evalResult = await result.current.evaluateAnswers({
          ej1: result.current.state.responses.ej1,
          ej2: '',
          ej3: '',
        });
      });

      expect(evalResult.nota_ej1).toBe(33);
    });

    test('local fallback ej1: 0 score when no valid JSON', async () => {
      globalThis.fetch
        .mockResolvedValueOnce(DEEPSEEK_OK(VALID_EXERCISES_JSON))
        .mockRejectedValueOnce(new Error('fallback'));

      const { result } = renderHook(() => useIALabEvaluation());

      await act(async () => {
        await result.current.generateExercises();
      });

      let evalResult;
      await act(async () => {
        evalResult = await result.current.evaluateAnswers({ ej1: 'not-json', ej2: '', ej3: '' });
      });

      expect(evalResult.nota_ej1).toBe(0);
    });

    test('local fallback ej2: 50 for short answers', async () => {
      globalThis.fetch
        .mockResolvedValueOnce(DEEPSEEK_OK(VALID_EXERCISES_JSON))
        .mockRejectedValueOnce(new Error('fallback'));

      const { result } = renderHook(() => useIALabEvaluation());

      await act(async () => {
        await result.current.generateExercises();
      });

      let evalResult;
      await act(async () => {
        evalResult = await result.current.evaluateAnswers({ ej1: '{}', ej2: 'corto', ej3: '' });
      });

      expect(evalResult.nota_ej2).toBe(50);
    });

    test('local fallback ej3: 50 for short answers', async () => {
      globalThis.fetch
        .mockResolvedValueOnce(DEEPSEEK_OK(VALID_EXERCISES_JSON))
        .mockRejectedValueOnce(new Error('fallback'));

      const { result } = renderHook(() => useIALabEvaluation());

      await act(async () => {
        await result.current.generateExercises();
      });

      let evalResult;
      await act(async () => {
        evalResult = await result.current.evaluateAnswers({ ej1: '{}', ej2: 'x'.repeat(50), ej3: 'corto' });
      });

      expect(evalResult.nota_ej3).toBe(50);
    });

    test('sets loading true during evaluation', async () => {
      let resolveFetch;
      globalThis.fetch
        .mockResolvedValueOnce(DEEPSEEK_OK(VALID_EXERCISES_JSON))
        .mockImplementationOnce(() => new Promise((resolve) => { resolveFetch = resolve; }));

      const { result } = renderHook(() => useIALabEvaluation());

      await act(async () => {
        await result.current.generateExercises();
      });

      act(() => {
        result.current.evaluateAnswers({ ej1: 'a', ej2: 'b', ej3: 'c' });
      });

      act(() => {
        expect(result.current.state.loading).toBe(true);
      });

      await act(async () => {
        resolveFetch(DEEPSEEK_OK(VALID_EVALUATION_JSON));
      });

      expect(result.current.state.loading).toBe(false);
    });
  });

  describe('saveGradeToSupabase', () => {
    const mockEvaluation = {
      nota_ej1: 85,
      nota_ej2: 70,
      nota_ej3: 90,
      notaGlobal: 81.7,
      feedback_ej1: 'fb1',
      feedback_ej2: 'fb2',
      feedback_ej3: 'fb3',
    };

    test('saves grade to Supabase successfully', async () => {
      const { result } = renderHook(() => useIALabEvaluation());

      let saveResult;
      await act(async () => {
        saveResult = await result.current.saveGradeToSupabase(mockEvaluation, 3);
      });

      expect(saveResult.success).toBe(true);
      expect(mockSupabase.from).toHaveBeenCalledWith('user_progress');
    });

    test('returns error when user is null', async () => {
      mockAuthUser = null;

      const { result } = renderHook(() => useIALabEvaluation());

      let saveResult;
      await act(async () => {
        saveResult = await result.current.saveGradeToSupabase(mockEvaluation, 1);
      });

      expect(saveResult.success).toBe(false);
      expect(saveResult.error).toBe('Usuario no autenticado');
    });

    test('returns error on DB failure', async () => {
      mockSupabase.from = vi.fn(() => ({
        upsert: vi.fn(() => ({
          select: vi.fn(() => ({
            maybeSingle: vi.fn().mockRejectedValue(new Error('DB error')),
          })),
        })),
      }));

      const { result } = renderHook(() => useIALabEvaluation());

      let saveResult;
      await act(async () => {
        saveResult = await result.current.saveGradeToSupabase(mockEvaluation, 1);
      });

      expect(saveResult.success).toBe(false);
      expect(saveResult.error).toBe('DB error');
    });

    test('parses moduleId as number', async () => {
      const { result } = renderHook(() => useIALabEvaluation());

      await act(async () => {
        await result.current.saveGradeToSupabase(mockEvaluation, '5');
      });

      expect(mockSupabase.from).toHaveBeenCalledWith('user_progress');
    });

    test('defaults moduleId to 1 when invalid', async () => {
      const { result } = renderHook(() => useIALabEvaluation());

      await act(async () => {
        await result.current.saveGradeToSupabase(mockEvaluation, NaN);
      });

      expect(mockSupabase.from).toHaveBeenCalledWith('user_progress');
    });
  });
});
