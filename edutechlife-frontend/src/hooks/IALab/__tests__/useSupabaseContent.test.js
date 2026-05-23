import { renderHook, act, waitFor } from '@testing-library/react';
import { useSupabaseContent } from '../useSupabaseContent';

let mockHardcodedContent;
let mockHardcodedResources;
let localStorageStore = {};

vi.mock('../../../components/IALab/constants/moduleContent', () => ({
  moduleContent: { 1: { objective: 'test objective', learningPoints: [] }, 2: { objective: 'mod 2', learningPoints: [] } },
}));

vi.mock('../../../components/IALab/constants/moduleResources', () => ({
  moduleResources: {},
}));

const defaultSupabaseResponse = { data: [], error: null };
let supabaseTableResponses = {};

function getSupabaseResponse(table) {
  return supabaseTableResponses[table] || defaultSupabaseResponse;
}

vi.mock('../../../lib/supabase', () => ({
  supabase: {
    from: (table) => {
      const resp = getSupabaseResponse(table);
      return {
        select: () => ({
          eq: () => ({
            order: () => Promise.resolve(resp),
            in: () => ({
              eq: () => ({
                order: () => Promise.resolve(resp),
              }),
              order: () => Promise.resolve(resp),
            }),
          }),
          in: () => ({
            eq: () => ({
              order: () => Promise.resolve(resp),
            }),
            order: () => Promise.resolve(resp),
          }),
        }),
      };
    },
  },
}));

function buildSupabaseMock(responses = {}) {
  supabaseTableResponses = { ...responses };
}

beforeEach(async () => {
  const { moduleContent } = await import('../../../components/IALab/constants/moduleContent');
  const { moduleResources } = await import('../../../components/IALab/constants/moduleResources');
  mockHardcodedContent = moduleContent;
  mockHardcodedResources = moduleResources;

  localStorageStore = {};
  supabaseTableResponses = {};
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => localStorageStore[key] || null);
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, val) => { localStorageStore[key] = val; });
  vi.spyOn(Storage.prototype, 'removeItem').mockImplementation((key) => { delete localStorageStore[key]; });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useSupabaseContent', () => {
  test('returns hardcoded content as default', async () => {
    buildSupabaseMock();
    const { result } = renderHook(() => useSupabaseContent());

    await act(async () => { await new Promise((r) => setTimeout(r, 0)); });

    expect(result.current.moduleContent).toBeTruthy();
    expect(result.current.moduleContent[1]).toBeTruthy();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.fromCache).toBe(false);
  });

  test('loads from cache when available', async () => {
    const cachedContent = { 1: { objective: 'cached' } };
    const cachedResources = { topic1: [] };
    localStorageStore['ialab_content_cache_moduleContent'] = JSON.stringify({ data: cachedContent, ts: Date.now() });
    localStorageStore['ialab_content_cache_moduleResources'] = JSON.stringify({ data: cachedResources, ts: Date.now() });

    buildSupabaseMock();
    const { result } = renderHook(() => useSupabaseContent());

    await act(async () => { await new Promise((r) => setTimeout(r, 0)); });

    expect(result.current.moduleContent).toEqual(cachedContent);
    expect(result.current.moduleResources).toEqual(cachedResources);
    expect(result.current.fromCache).toBe(true);
    expect(result.current.loading).toBe(false);
  });

  test('expired cache is ignored and falls back to hardcoded', async () => {
    const oldTs = Date.now() - 10 * 60 * 1000;
    localStorageStore['ialab_content_cache_moduleContent'] = JSON.stringify({ data: { 1: { objective: 'stale' } }, ts: oldTs });

    buildSupabaseMock({
      module_content: { data: [], error: null },
    });

    const { result } = renderHook(() => useSupabaseContent());

    await act(async () => { await new Promise((r) => setTimeout(r, 0)); });

    expect(result.current.fromCache).toBe(false);
    expect(result.current.moduleContent[1].objective).toBe('test objective');
  });

  test('fetches from Supabase and builds content structure', async () => {
    const modules = [
      { id: 1, objective: 'Mod 1 obj', learning_points: ['point1'], overview_data: null },
    ];
    const lessons = [
      { module_id: 1, lesson_index: 1, title: 'Lesson 1', description: 'desc',
        detailed_description: 'detail', duration: 10, format: 'video', icon: 'play',
        badge_color: 'blue', theme_color: 'blue', accordion_content: { key: 'val' } },
    ];
    const topics = [
      { id: 10, module_id: 1, title: 'Topic 1', description: 'desc',
        learning_objectives: ['obj1'], estimated_time: 5, difficulty: 'easy', sort_order: 1 },
    ];

    buildSupabaseMock({
      module_content: { data: modules, error: null },
      module_lessons: { data: lessons, error: null },
      module_topics: { data: topics, error: null },
      module_resources: { data: [], error: null },
    });

    const { result } = renderHook(() => useSupabaseContent());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.moduleContent[1].objective).toBe('Mod 1 obj');
  });

  test('falls back to hardcoded on Supabase error', async () => {
    buildSupabaseMock({
      module_content: { data: null, error: new Error('Connection failed') },
    });

    const { result } = renderHook(() => useSupabaseContent());

    await act(async () => { await new Promise((r) => setTimeout(r, 0)); });

    expect(result.current.moduleContent[1].objective).toBeTruthy();
    expect(result.current.error).toBeTruthy();
    expect(result.current.loading).toBe(false);
  });

  test('reload function exists and is callable', async () => {
    buildSupabaseMock({
      module_content: { data: [], error: null },
    });

    const { result } = renderHook(() => useSupabaseContent());

    await act(async () => { await new Promise((r) => setTimeout(r, 0)); });

    expect(result.current.reload).toBeInstanceOf(Function);
  });
});
