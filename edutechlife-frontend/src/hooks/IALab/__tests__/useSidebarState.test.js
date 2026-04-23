import { renderHook, act } from '@testing-library/react';
import { useSidebarState } from '../useSidebarState';

// Mock localStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// Mock window.innerWidth para responsive testing
const setWindowWidth = (width) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width
  });
  window.dispatchEvent(new Event('resize'));
};

describe('useSidebarState', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('should initialize with default state', () => {
    const initialState = { videos: true, recursos: false };
    const { result } = renderHook(() => useSidebarState(initialState));

    expect(result.current.collapsedSections).toEqual(initialState);
  });

  test('should load state from localStorage', () => {
    const savedState = { videos: false, recursos: true };
    localStorage.setItem('ialab-sidebar-state', JSON.stringify(savedState));

    const { result } = renderHook(() => useSidebarState({ videos: true, recursos: false }));

    expect(result.current.collapsedSections).toEqual(savedState);
    expect(localStorage.getItem).toHaveBeenCalledWith('ialab-sidebar-state');
  });

  test('should toggle section state', () => {
    const initialState = { videos: true, recursos: false };
    const { result } = renderHook(() => useSidebarState(initialState));

    act(() => {
      result.current.toggleSection('videos');
    });

    expect(result.current.collapsedSections.videos).toBe(false);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'ialab-sidebar-state',
      JSON.stringify({ videos: false, recursos: false })
    );
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

    // Cambiar estado
    act(() => {
      result.current.toggleSection('videos');
      result.current.toggleSection('recursos');
    });

    // Resetear
    act(() => {
      result.current.reset();
    });

    expect(result.current.collapsedSections).toEqual(initialState);
    expect(localStorage.removeItem).toHaveBeenCalledWith('ialab-sidebar-state');
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
    expect(modules[0]).toHaveProperty('title', 'Introducción a IA Generativa');
    expect(modules[0]).toHaveProperty('level', 'Principiante');
  });

  test('should get course data', () => {
    const { result } = renderHook(() => useSidebarState());

    const courseData = result.current.getCourseData();
    expect(courseData).toHaveProperty('duration', '2h 30min');
    expect(courseData).toHaveProperty('level', 'Intermedio');
    expect(courseData).toHaveProperty('rating', '4.8');
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

    const completed = result.current.getCompletedModules();
    expect(Array.isArray(completed)).toBe(true);
    expect(completed).toEqual([1, 2]);
  });

  test('should check if module is locked', () => {
    const { result } = renderHook(() => useSidebarState());

    expect(result.current.isModuleLocked(1)).toBe(false);
    expect(result.current.isModuleLocked(2)).toBe(false);
    expect(result.current.isModuleLocked(4)).toBe(true);
    expect(result.current.isModuleLocked(5)).toBe(true);
  });

  describe('responsive behavior', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('should detect mobile on small screens', () => {
      setWindowWidth(375); // Mobile width

      const { result } = renderHook(() => useSidebarState());

      // Avanzar timers para que se ejecute el effect
      act(() => {
        jest.advanceTimersByTime(100);
      });

      expect(result.current.isMobile).toBe(true);
    });

    test('should detect desktop on large screens', () => {
      setWindowWidth(1024); // Desktop width

      const { result } = renderHook(() => useSidebarState());

      act(() => {
        jest.advanceTimersByTime(100);
      });

      expect(result.current.isMobile).toBe(false);
    });

    test('should auto-collapse on mobile', () => {
      setWindowWidth(375);

      const { result } = renderHook(() => useSidebarState());

      act(() => {
        jest.advanceTimersByTime(100);
      });

      expect(result.current.isCollapsed).toBe(true);
    });

    test('should toggle sidebar state', () => {
      const { result } = renderHook(() => useSidebarState());

      expect(result.current.isCollapsed).toBe(false);

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

  describe('error handling', () => {
    test('should handle localStorage errors gracefully', () => {
      // Simular error en localStorage
      localStorage.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });

      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const initialState = { videos: true };

      const { result } = renderHook(() => useSidebarState(initialState));

      act(() => {
        result.current.toggleSection('videos');
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'No se pudo guardar estado del sidebar:',
        expect.any(Error)
      );

      // El estado debería seguir funcionando aunque falle localStorage
      expect(result.current.collapsedSections.videos).toBe(false);

      consoleWarnSpy.mockRestore();
    });

    test('should handle invalid JSON in localStorage', () => {
      localStorage.getItem.mockReturnValue('invalid json');

      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const initialState = { videos: true };

      const { result } = renderHook(() => useSidebarState(initialState));

      // Debería usar el estado inicial cuando el JSON es inválido
      expect(result.current.collapsedSections).toEqual(initialState);

      consoleWarnSpy.mockRestore();
    });
  });
});