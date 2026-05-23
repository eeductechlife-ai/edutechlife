import { useIALabStore } from '../ialabStore';
import { modules } from '@/data/ialab';

beforeEach(() => {
  useIALabStore.setState({
    xp: 0,
    streak: 0,
    badges: [],
    courseProgress: 0,
    courseCompleted: false,
    activeMod: 1,
    visitedModules: [],
    completedModules: [],
    moduleProgress: {},
    lessonProgress: {},
  });
});

describe('ialabStore — cross-cutting functions', () => {
  describe('getCurrentModule', () => {
    test('returns module matching activeMod', () => {
      const store = useIALabStore.getState();
      store.setActiveMod(2);
      const mod = store.getCurrentModule();
      expect(mod.id).toBe(2);
    });

    test('returns first module when activeMod is invalid', () => {
      const store = useIALabStore.getState();
      store.setActiveMod(99);
      const mod = store.getCurrentModule();
      expect(mod.id).toBe(1);
    });
  });

  describe('setActiveMod', () => {
    test('sets active module', () => {
      const store = useIALabStore.getState();
      store.setActiveMod(3);
      expect(useIALabStore.getState().activeMod).toBe(3);
    });
  });

  describe('setVisitedModules', () => {
    test('adds module to visited list', () => {
      const store = useIALabStore.getState();
      store.setVisitedModules([1]);
      expect(useIALabStore.getState().visitedModules).toEqual([1]);
    });

    test('accepts updater function', () => {
      const store = useIALabStore.getState();
      store.setVisitedModules([1]);
      store.setVisitedModules(prev => [...prev, 2]);
      expect(useIALabStore.getState().visitedModules).toEqual([1, 2]);
    });
  });

  describe('courseProgress', () => {
    test('initializes at 0', () => {
      expect(useIALabStore.getState().courseProgress).toBe(0);
    });

    test('updates via setCourseProgress', () => {
      useIALabStore.getState().setCourseProgress(50);
      expect(useIALabStore.getState().courseProgress).toBe(50);
    });
  });

  describe('sidebar state persistence', () => {
    test('setSidebarState stores and getSidebarState retrieves', () => {
      const store = useIALabStore.getState();
      store.setSidebarState({ videos: false, recursos: true });
      expect(store.getSidebarState(null)).toEqual({ videos: false, recursos: true });
    });

    test('removeSidebarState clears persisted state', () => {
      const store = useIALabStore.getState();
      store.setSidebarState({ videos: false });
      store.removeSidebarState();
      expect(store.getSidebarState(null)).toBeNull();
    });
  });

  describe('modules data', () => {
    test('has 5 modules with correct structure', () => {
      expect(modules).toHaveLength(5);
      modules.forEach(mod => {
        expect(mod).toHaveProperty('id');
        expect(mod).toHaveProperty('title');
      });
    });
  });
});

describe('ialabStore — gamification slice', () => {
  test('addXp increases xp', () => {
    const store = useIALabStore.getState();
    const initialXp = store.xp;
    store.addXp(50);
    expect(useIALabStore.getState().xp).toBe(initialXp + 50);
  });

  test('addXp with negative amount decreases xp', () => {
    const store = useIALabStore.getState();
    store.addXp(100);
    store.addXp(-30);
    expect(useIALabStore.getState().xp).toBe(70);
  });

  test('awardBadge adds to badges array', () => {
    const store = useIALabStore.getState();
    store.awardBadge('test_badge');
    expect(useIALabStore.getState().badges).toContain('test_badge');
  });

  test('awardBadge does not add duplicates', () => {
    const store = useIALabStore.getState();
    store.awardBadge('unique_badge');
    store.awardBadge('unique_badge');
    const badges = useIALabStore.getState().badges;
    expect(badges.filter(b => b === 'unique_badge')).toHaveLength(1);
  });

  test('getLevel starts at 1', () => {
    expect(useIALabStore.getState().getLevel()).toBe(1);
  });

  test('recordActivity starts streak at 1', () => {
    const store = useIALabStore.getState();
    store.recordActivity();
    expect(useIALabStore.getState().streak).toBe(1);
  });
});

describe('ialabStore — persistence slice', () => {
  test('getValerioWelcomed returns false initially', () => {
    expect(useIALabStore.getState().getValerioWelcomed()).toBe(false);
  });

  test('setValerioWelcomed marks as welcomed', () => {
    useIALabStore.getState().setValerioWelcomed();
    expect(useIALabStore.getState().getValerioWelcomed()).toBe(true);
  });

  test('getViewedResources returns empty array initially', () => {
    expect(useIALabStore.getState().getViewedResources()).toEqual([]);
  });

  test('calculateModuleScore returns 0 for unvisited module', () => {
    expect(useIALabStore.getState().calculateModuleScore(99)).toBe(0);
  });
});
