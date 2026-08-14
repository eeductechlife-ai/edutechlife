import { renderHook, act } from '@testing-library/react';
import { useSidebarState } from '../useSidebarState';
import { useIALabStore } from '../../../store/ialabStore';

const setWindowWidth = (width) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  window.dispatchEvent(new Event('resize'));
};

beforeEach(() => {
  useIALabStore.getState().removeSidebarState();
  useIALabStore.getState().setSidebarCollapsed(false);
});

describe('useSidebarState', () => {
  test('should initialize with default state', () => {
    const initialState = { videos: true, recursos: false };
    const { result } = renderHook(() => useSidebarState(initialState));

    expect(result.current.collapsedSections).toEqual(initialState);
  });

  test('should load persisted state from store', () => {
    const savedState = { videos: false, recursos: true };
    useIALabStore.getState().setSidebarState(savedState);

    const { result } = renderHook(() => useSidebarState({ videos: true, recursos: false }));

    expect(result.current.collapsedSections).toEqual(savedState);
  });

  test('should toggle section state and persist', () => {
    const initialState = { videos: true, recursos: false };
    const { result } = renderHook(() => useSidebarState(initialState));

    act(() => {
      result.current.toggleSection('videos');
    });

    expect(result.current.collapsedSections.videos).toBe(false);

    const stored = useIALabStore.getState().getSidebarState(null);
    expect(stored).toEqual({ videos: false, recursos: false });
  });

  test('should expand all sections', () => {
    const initialState = { videos: true, recursos: true, other: true };
    const { result } = renderHook(() => useSidebarState(initialState));

    act(() => {
      result.current.expandAll();
    });

    Object.values(result.current.collapsedSections).forEach(value => {
      expect(value).toBe(false);
    });
  });

  test('should collapse all sections', () => {
    const initialState = { videos: false, recursos: false, other: false };
    const { result } = renderHook(() => useSidebarState(initialState));

    act(() => {
      result.current.collapseAll();
    });

    Object.values(result.current.collapsedSections).forEach(value => {
      expect(value).toBe(true);
    });
  });

  test('should check if section is collapsed', () => {
    const initialState = { videos: true, recursos: false };
    const { result } = renderHook(() => useSidebarState(initialState));

    expect(result.current.isSectionCollapsed('videos')).toBe(true);
    expect(result.current.isSectionCollapsed('recursos')).toBe(false);
    expect(result.current.isSectionCollapsed('nonexistent')).toBe(false);
  });

  test('should reset to initial state', () => {
    const initialState = { videos: true, recursos: false };
    const { result } = renderHook(() => useSidebarState(initialState));

    act(() => {
      result.current.toggleSection('videos');
      result.current.toggleSection('recursos');
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.collapsedSections).toEqual(initialState);

    const stored = useIALabStore.getState().getSidebarState(null);
    expect(stored).toBeNull();
  });

  test('should get section data', () => {
    const { result } = renderHook(() => useSidebarState());

    const videosData = result.current.getSectionData('videos');
    expect(videosData).toHaveProperty('id', 'videos');
    expect(videosData).toHaveProperty('title', 'Videos del Módulo');
    expect(videosData.items).toHaveLength(4);

    const recursosData = result.current.getSectionData('recursos');
    expect(recursosData).toHaveProperty('id', 'recursos');
    expect(recursosData).toHaveProperty('title', 'Recursos Adicionales');
    expect(recursosData.items).toHaveLength(4);
  });

  test('should get module data', () => {
    const { result } = renderHook(() => useSidebarState());

    const modules = result.current.getModuleData();
    expect(modules).toHaveLength(5);
    // Data is derived from src/data/ialab.js — first module's fields.
    expect(modules[0]).toHaveProperty('title');
    expect(modules[0].title.length).toBeGreaterThan(0);
    expect(modules[0]).toHaveProperty('level');
    expect(modules[0]).toHaveProperty('id', 1);
  });

  test('should get course data', () => {
    const { result } = renderHook(() => useSidebarState());

    const courseData = result.current.getCourseData();
    expect(courseData).toHaveProperty('duration');
    expect(courseData).toHaveProperty('level');
    expect(courseData).toHaveProperty('rating', '4.8');
    expect(courseData).toHaveProperty('videos');
    expect(courseData).toHaveProperty('proyectos');
  });

  test('should calculate progress', () => {
    const { result } = renderHook(() => useSidebarState());

    const progress = result.current.getProgress();
    expect(typeof progress).toBe('number');
    expect(progress).toBeGreaterThanOrEqual(0);
    expect(progress).toBeLessThanOrEqual(100);
  });

  test('should get completed modules', () => {
    const { result } = renderHook(() => useSidebarState());

    // MODULE_DATA is derived from src/data/ialab.js with progress: 0 by default —
    // completion state lives in the store, not in the sidebar seed data.
    const completed = result.current.getCompletedModules();
    expect(Array.isArray(completed)).toBe(true);
  });

  test('should check if module is locked (default seed: all locked)', () => {
    const { result } = renderHook(() => useSidebarState());

    // Default MODULE_DATA seed marks every module as locked. Runtime unlock
    // happens elsewhere via user progress — this hook just reports the seed.
    expect(result.current.isModuleLocked(1)).toBe(true);
    expect(result.current.isModuleLocked(999)).toBe(true); // unknown → locked
  });

  describe('responsive behavior', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    test('should detect mobile on small screens', () => {
      setWindowWidth(375);

      const { result } = renderHook(() => useSidebarState());

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current.isMobile).toBe(true);
    });

    test('should detect desktop on large screens', () => {
      setWindowWidth(1024);

      const { result } = renderHook(() => useSidebarState());

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current.isMobile).toBe(false);
    });

    test('should auto-collapse on mobile', () => {
      setWindowWidth(375);

      const { result } = renderHook(() => useSidebarState());

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current.isCollapsed).toBe(true);
    });

    test('should toggle sidebar state', () => {
      setWindowWidth(1440);
      const { result } = renderHook(() => useSidebarState());

      act(() => {
        result.current.toggleSidebar();
      });

      expect(result.current.isCollapsed).toBe(true);

      act(() => {
        result.current.toggleSidebar();
      });

      expect(result.current.isCollapsed).toBe(false);
    });
  });
});
