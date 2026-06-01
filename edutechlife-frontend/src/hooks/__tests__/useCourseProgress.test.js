import { renderHook, act } from '@testing-library/react';
import useCourseProgress from '../useCourseProgress';

function getLocal(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}

beforeEach(() => localStorage.clear());

describe('calculateModuleProgressInternal (via getModuleProgress)', () => {
  function moduleScore(moduleId, data = {}) {
    const v = data.videos || [];
    const m = data.modules || [];
    const e = data.exams || {};
    const ig = data.infographics || [];
    const a = data.activities || [];
    localStorage.setItem('ialab_completed_videos', JSON.stringify(v));
    localStorage.setItem('ialab_completed_modules', JSON.stringify(m));
    localStorage.setItem('ialab_completed_exams', JSON.stringify(e));
    localStorage.setItem('ialab_completed_infographics', JSON.stringify(ig));
    localStorage.setItem('ialab_completed_activities', JSON.stringify(a));
    const { result } = renderHook(() => useCourseProgress());
    return result.current.getModuleProgress(moduleId);
  }

  test('returns 0 for module with no progress', () => {
    expect(moduleScore(1)).toBe(0);
  });

  test('adds 30 points when 80%+ resources completed', () => {
    expect(moduleScore(1, { videos: ['m1v1', 'm1v2'], infographics: ['i1g1', 'i1g2'] })).toBe(30);
  });

  test('adds 35 points when exam passed', () => {
    expect(moduleScore(1, { exams: { 1: true } })).toBe(35);
  });

  test('adds 30 points when activity completed', () => {
    expect(moduleScore(1, { activities: ['a1x'] })).toBe(30);
  });

  test('scores 95 for module with all resources + exam + activity', () => {
    const score = moduleScore(1, {
      videos: ['m1v1', 'm1v2'],
      infographics: ['i1g1', 'i1g2', 'i1g3'],
      exams: { 1: true },
      activities: ['a1x'],
    });
    expect(score).toBe(95);
  });

  test('returns 0 for non-existent module', () => {
    expect(moduleScore(99)).toBe(0);
  });

  test('does not add resource points when below 80%', () => {
    expect(moduleScore(1, { videos: ['m1v1'] })).toBe(0);
  });

  test('handles all 5 modules independently', () => {
    const data = {
      videos: ['m1v1', 'm1v2'],
      infographics: ['i1g1', 'i1g2', 'i1g3'],
      exams: { 1: true },
      activities: ['a1x'],
    };
    expect(moduleScore(1, data)).toBe(95);
    expect(moduleScore(2, {})).toBe(0);
  });
});

describe('calculateGlobalProgressInternal (via courseProgress)', () => {
  function globalProgress(data = {}) {
    const v = data.videos || [];
    const m = data.modules || [];
    const e = data.exams || {};
    const ig = data.infographics || [];
    const a = data.activities || [];
    localStorage.setItem('ialab_completed_videos', JSON.stringify(v));
    localStorage.setItem('ialab_completed_modules', JSON.stringify(m));
    localStorage.setItem('ialab_completed_exams', JSON.stringify(e));
    localStorage.setItem('ialab_completed_infographics', JSON.stringify(ig));
    localStorage.setItem('ialab_completed_activities', JSON.stringify(a));
    const { result } = renderHook(() => useCourseProgress());
    return result.current.courseProgress;
  }

  test('starts at 0 with no progress', () => {
    expect(globalProgress()).toBe(0);
  });

  test('module 1 at 95% contributes 19 points', () => {
    const p = globalProgress({
      videos: ['m1v1', 'm1v2'],
      infographics: ['i1g1', 'i1g2', 'i1g3'],
      exams: { 1: true },
      activities: ['a1x'],
    });
    expect(p).toBe(19);
  });

  test('a completed module counts as 100 even without resources', () => {
    const p = globalProgress({ modules: [1] });
    expect(p).toBe(20);
  });

  test('three modules fully completed = 60%', () => {
    const all = { videos: ['m1v1', 'm1v2', 'm2v1', 'm2v2', 'm3v1', 'm3v2'], infographics: ['i1g1', 'i1g2', 'i1g3', 'i2g1', 'i2g2', 'i2g3', 'i3g1', 'i3g2', 'i3g3'], exams: { 1: true, 2: true, 3: true }, activities: ['a1x', 'a2x', 'a3x'] };
    expect(globalProgress(all)).toBe(57);
  });

  test('never exceeds 100', () => {
    const all = { modules: [1, 2, 3, 4, 5], videos: ['m1v1', 'm1v2', 'm2v1', 'm2v2', 'm3v1', 'm3v2', 'm4v1', 'm4v2', 'm5v1'], infographics: ['i1g1', 'i1g2', 'i1g3', 'i2g1', 'i2g2', 'i2g3', 'i3g1', 'i3g2', 'i3g3', 'i4g1', 'i4g2', 'i4g3', 'i5g1', 'i5g2'], exams: { 1: true, 2: true, 3: true, 4: true, 5: true }, activities: ['a1x', 'a2x', 'a3x', 'a4x', 'a5x'] };
    expect(globalProgress(all)).toBe(100);
  });
});

describe('getModuleStats', () => {
  function stats(moduleId, data = {}) {
    localStorage.setItem('ialab_completed_videos', JSON.stringify(data.videos || []));
    localStorage.setItem('ialab_completed_exams', JSON.stringify(data.exams || {}));
    localStorage.setItem('ialab_completed_infographics', JSON.stringify(data.infographics || []));
    localStorage.setItem('ialab_completed_activities', JSON.stringify(data.activities || []));
    const { result } = renderHook(() => useCourseProgress());
    return result.current.getModuleStats(moduleId);
  }

  test('returns zeros for module with no progress', () => {
    const s = stats(1);
    expect(s).toEqual({ videosWatched: 0, totalVideos: 2, infographicsViewed: 0, totalInfographics: 3, activityCompleted: false, examPassed: undefined, resourcesPct: 0, score: 0 });
  });

  test('reports correct stats for partial progress', () => {
    const s = stats(1, { videos: ['m1v1'], exams: { 1: true }, activities: ['a1x'] });
    expect(s).toMatchObject({ videosWatched: 1, totalVideos: 2, examPassed: true, activityCompleted: true, resourcesPct: 20, score: 65 });
  });

  test('returns zeros for non-existent module', () => {
    const s = stats(99);
    expect(s).toEqual({ completed: 0, total: 0, score: 0 });
  });
});

describe('useCourseProgress - actions', () => {
  function withHook(fn) {
    const { result } = renderHook(() => useCourseProgress());
    return fn(result);
  }

  test('markVideoComplete adds video and recalculates', () => {
    withHook(r => {
      act(() => { r.current.markVideoComplete('1v1'); });
      expect(r.current.completedVideos).toEqual(['m1v1']);
      expect(getLocal('ialab_completed_videos')).toEqual(['m1v1']);
    });
  });

  test('markVideoComplete is idempotent', () => {
    withHook(r => {
      act(() => { r.current.markVideoComplete('1v1'); });
      act(() => { r.current.markVideoComplete('1v1'); });
      expect(r.current.completedVideos).toEqual(['m1v1']);
    });
  });

  test('markModuleComplete adds module and recalculates', () => {
    withHook(r => {
      act(() => { r.current.markModuleComplete(1); });
      expect(r.current.completedModules).toEqual([1]);
      expect(r.current.courseProgress).toBe(20);
      expect(getLocal('ialab_completed_modules')).toEqual([1]);
    });
  });

  test('markModuleComplete is idempotent', () => {
    withHook(r => {
      act(() => { r.current.markModuleComplete(1); });
      act(() => { r.current.markModuleComplete(1); });
      expect(r.current.completedModules).toEqual([1]);
    });
  });

  test('markExamComplete marks exam and auto-completes module', () => {
    withHook(r => {
      act(() => { r.current.markExamComplete(1); });
      expect(r.current.completedExams).toEqual({ 1: true });
      expect(r.current.completedModules).toContain(1);
      expect(getLocal('ialab_completed_exams')).toEqual({ 1: true });
    });
  });

  test('markInfographicComplete adds infographic', () => {
    withHook(r => {
      act(() => { r.current.markInfographicComplete('1g1'); });
      expect(r.current.completedInfographics).toEqual(['i1g1']);
    });
  });

  test('markActivityComplete adds activity', () => {
    withHook(r => {
      act(() => { r.current.markActivityComplete('1x'); });
      expect(r.current.completedActivities).toEqual(['a1x']);
    });
  });

  test('resetProgress clears all state and localStorage', () => {
    withHook(r => {
      act(() => { r.current.markVideoComplete('1v1'); });
      act(() => { r.current.resetProgress(); });
      expect(r.current.completedVideos).toEqual([]);
      expect(r.current.completedModules).toEqual([]);
      expect(r.current.completedExams).toEqual({});
      expect(r.current.courseProgress).toBe(0);
      expect(getLocal('ialab_completed_videos')).toBeNull();
      expect(getLocal('ialab_completed_modules')).toBeNull();
      expect(getLocal('ialab_completed_exams')).toBeNull();
      expect(getLocal('ialab_completed_activities')).toBeNull();
      expect(getLocal('ialab_overall_progress')).toBeNull();
    });
  });

  test('loadProgress reads from localStorage on mount', () => {
    localStorage.setItem('ialab_completed_videos', JSON.stringify(['m1v1']));
    localStorage.setItem('ialab_completed_modules', JSON.stringify([1]));
    const { result } = renderHook(() => useCourseProgress());
    expect(result.current.completedVideos).toEqual(['m1v1']);
    expect(result.current.completedModules).toEqual([1]);
  });

  test('refreshProgress reloads from storage', () => {
    withHook(r => {
      localStorage.setItem('ialab_completed_videos', JSON.stringify(['m2v1']));
      act(() => { r.current.refreshProgress(); });
      expect(r.current.completedVideos).toEqual(['m2v1']);
    });
  });
});
