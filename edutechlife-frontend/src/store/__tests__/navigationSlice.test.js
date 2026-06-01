import { useIALabStore } from '../ialabStore';

beforeEach(() => {
  useIALabStore.setState({
    activeMod: 1,
    activeTab: 'lab',
    visitedModules: [1],
    sidebarDropdowns: { videos: false, recursos: false },
    openAccordions: {},
    visibleAccordions: [],
    insightsExpanded: false,
    currentLessonIndex: 0,
    suggestedTime: 25 * 60,
    timeElapsed: 0,
    isTimerRunning: false,
    showTimeWarning: false,
    isTouchDevice: false,
    isIOS: false,
    isAndroid: false,
  });
});

describe('navigationSlice — activeMod', () => {
  test('initializes at 1', () => {
    expect(useIALabStore.getState().activeMod).toBe(1);
  });

  test('setActiveMod changes module', () => {
    useIALabStore.getState().setActiveMod(2);
    expect(useIALabStore.getState().activeMod).toBe(2);
  });
});

describe('navigationSlice — activeTab', () => {
  test('initializes as lab', () => {
    expect(useIALabStore.getState().activeTab).toBe('lab');
  });

  test('setActiveTab changes tab', () => {
    useIALabStore.getState().setActiveTab('forum');
    expect(useIALabStore.getState().activeTab).toBe('forum');
  });
});

describe('navigationSlice — visitedModules', () => {
  test('initializes with module 1', () => {
    expect(useIALabStore.getState().visitedModules).toEqual([1]);
  });

  test('setVisitedModules sets value directly', () => {
    useIALabStore.getState().setVisitedModules([1, 2, 3]);
    expect(useIALabStore.getState().visitedModules).toEqual([1, 2, 3]);
  });

  test('setVisitedModules accepts updater function', () => {
    useIALabStore.getState().setVisitedModules(prev => [...prev, 2]);
    expect(useIALabStore.getState().visitedModules).toEqual([1, 2]);
  });
});

describe('navigationSlice — sidebarDropdowns', () => {
  test('initializes with videos and recursos closed', () => {
    const dd = useIALabStore.getState().sidebarDropdowns;
    expect(dd.videos).toBe(false);
    expect(dd.recursos).toBe(false);
  });

  test('setSidebarDropdowns replaces state', () => {
    useIALabStore.getState().setSidebarDropdowns({ videos: true, recursos: true });
    expect(useIALabStore.getState().sidebarDropdowns).toEqual({ videos: true, recursos: true });
  });

  test('toggleSidebarDropdown toggles section', () => {
    useIALabStore.getState().toggleSidebarDropdown('videos');
    expect(useIALabStore.getState().sidebarDropdowns.videos).toBe(true);
    useIALabStore.getState().toggleSidebarDropdown('videos');
    expect(useIALabStore.getState().sidebarDropdowns.videos).toBe(false);
  });
});

describe('navigationSlice — accordions', () => {
  test('openAccordions initializes empty', () => {
    expect(useIALabStore.getState().openAccordions).toEqual({});
  });

  test('setOpenAccordions replaces state', () => {
    useIALabStore.getState().setOpenAccordions({ topic_1: true });
    expect(useIALabStore.getState().openAccordions).toEqual({ topic_1: true });
  });

  test('visibleAccordions initializes empty', () => {
    expect(useIALabStore.getState().visibleAccordions).toEqual([]);
  });

  test('setVisibleAccordions replaces state', () => {
    useIALabStore.getState().setVisibleAccordions(['topic_1']);
    expect(useIALabStore.getState().visibleAccordions).toEqual(['topic_1']);
  });
});

describe('navigationSlice — insightsExpanded', () => {
  test('initializes as false', () => {
    expect(useIALabStore.getState().insightsExpanded).toBe(false);
  });

  test('setInsightsExpanded toggles state', () => {
    useIALabStore.getState().setInsightsExpanded(true);
    expect(useIALabStore.getState().insightsExpanded).toBe(true);
  });
});

describe('navigationSlice — currentLessonIndex', () => {
  test('initializes at 0', () => {
    expect(useIALabStore.getState().currentLessonIndex).toBe(0);
  });

  test('setCurrentLessonIndex updates value', () => {
    useIALabStore.getState().setCurrentLessonIndex(2);
    expect(useIALabStore.getState().currentLessonIndex).toBe(2);
  });
});

describe('navigationSlice — timer', () => {
  test('suggestedTime initializes at 25 minutes', () => {
    expect(useIALabStore.getState().suggestedTime).toBe(1500);
  });

  test('timeElapsed initializes at 0', () => {
    expect(useIALabStore.getState().timeElapsed).toBe(0);
  });

  test('setTimeElapsed updates value', () => {
    useIALabStore.getState().setTimeElapsed(60);
    expect(useIALabStore.getState().timeElapsed).toBe(60);
  });

  test('isTimerRunning initializes as false', () => {
    expect(useIALabStore.getState().isTimerRunning).toBe(false);
  });

  test('setIsTimerRunning toggles state', () => {
    useIALabStore.getState().setIsTimerRunning(true);
    expect(useIALabStore.getState().isTimerRunning).toBe(true);
  });

  test('showTimeWarning initializes as false', () => {
    expect(useIALabStore.getState().showTimeWarning).toBe(false);
  });

  test('setShowTimeWarning toggles state', () => {
    useIALabStore.getState().setShowTimeWarning(true);
    expect(useIALabStore.getState().showTimeWarning).toBe(true);
  });
});

describe('navigationSlice — device detection', () => {
  test('isTouchDevice initializes as false', () => {
    expect(useIALabStore.getState().isTouchDevice).toBe(false);
  });

  test('setIsTouchDevice updates value', () => {
    useIALabStore.getState().setIsTouchDevice(true);
    expect(useIALabStore.getState().isTouchDevice).toBe(true);
  });

  test('isIOS initializes as false', () => {
    expect(useIALabStore.getState().isIOS).toBe(false);
  });

  test('setIsIOS updates value', () => {
    useIALabStore.getState().setIsIOS(true);
    expect(useIALabStore.getState().isIOS).toBe(true);
  });

  test('isAndroid initializes as false', () => {
    expect(useIALabStore.getState().isAndroid).toBe(false);
  });

  test('setIsAndroid updates value', () => {
    useIALabStore.getState().setIsAndroid(true);
    expect(useIALabStore.getState().isAndroid).toBe(true);
  });
});
