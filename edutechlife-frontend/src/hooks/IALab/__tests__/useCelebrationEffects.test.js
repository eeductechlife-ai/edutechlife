import { renderHook, act } from '@testing-library/react';
import { useIALabStore } from '../../../store/ialabStore';
import { useCelebrationEffects } from '../useCelebrationEffects';

const mockFireConfetti = vi.fn();
const mockSpeakText = vi.fn();

vi.mock('../../../utils/speech', () => ({
  fireConfetti: (...args) => mockFireConfetti(...args),
  speakTextConversational: (...args) => mockSpeakText(...args),
}));

const mockT = vi.fn((key) => key);

vi.mock('../../../i18n/I18nProvider', () => ({
  useTranslation: () => ({ t: mockT }),
}));

const partialMod = { exam: true, challenge: true, resourcesCompleted: true, community: false, currentScore: 70, isUnlocked: true };
const allMods = {};
for (let i = 1; i <= 5; i++) allMods[i] = { ...partialMod };

const freshState = {
  xp: 0,
  streak: 0,
  badges: [],
  courseProgress: 50,
  courseCompleted: false,
  activeMod: 1,
  visitedModules: [1],
  completedModules: [],
  moduleProgress: allMods,
  lessonProgress: {},
};

beforeEach(() => {
  vi.clearAllMocks();
  useIALabStore.setState(freshState);
});

describe('useCelebrationEffects', () => {
  test('fires confetti when module becomes fully approved', () => {
    useIALabStore.setState({
      moduleProgress: {
        1: { ...partialMod, currentScore: 70 },
        2: { ...partialMod },
        3: { ...partialMod },
        4: { ...partialMod },
        5: { ...partialMod },
      },
    });

    renderHook(() => useCelebrationEffects(1, vi.fn()));

    act(() => {
      const mp = useIALabStore.getState().moduleProgress;
      useIALabStore.setState({
        moduleProgress: { ...mp, 1: { ...mp[1], currentScore: 100 } },
      });
    });
  });

  test('speaks text on module approval', () => {
    useIALabStore.setState({
      moduleProgress: {
        1: { ...partialMod, currentScore: 70 },
        2: { ...partialMod },
        3: { ...partialMod },
        4: { ...partialMod },
        5: { ...partialMod },
      },
    });

    renderHook(() => useCelebrationEffects(1, vi.fn()));

    act(() => {
      const mp = useIALabStore.getState().moduleProgress;
      useIALabStore.setState({
        moduleProgress: { ...mp, 1: { ...mp[1], currentScore: 100 } },
      });
    });
  });

  test('fires confetti on course completion', () => {
    const handleGlobalAction = vi.fn();

    renderHook(() => useCelebrationEffects(1, handleGlobalAction));

    act(() => {
      const completed = { exam: true, challenge: true, resourcesCompleted: true, community: false, currentScore: 100, isUnlocked: true };
      useIALabStore.setState({
        moduleProgress: { 1: completed, 2: completed, 3: completed, 4: completed, 5: completed },
      });
    });
  });

  test('calls OPEN_CERTIFICATE after course completion delay', () => {
    vi.useFakeTimers();
    const handleGlobalAction = vi.fn();

    renderHook(() => useCelebrationEffects(1, handleGlobalAction));

    act(() => {
      const completed = { exam: true, challenge: true, resourcesCompleted: true, community: false, currentScore: 100, isUnlocked: true };
      useIALabStore.setState({
        moduleProgress: { 1: completed, 2: completed, 3: completed, 4: completed, 5: completed },
      });
    });

    act(() => {
      vi.runAllTimers();
    });

    expect(handleGlobalAction).toHaveBeenCalledWith('OPEN_CERTIFICATE');
    vi.useRealTimers();
  });

  test('does not fire confetti on initial render with already-approved module', () => {
    renderHook(() => useCelebrationEffects(1, vi.fn()));
  });
});
