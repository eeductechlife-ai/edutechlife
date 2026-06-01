import { useIALabStore } from '../ialabStore';

beforeEach(() => {
  useIALabStore.setState({
    showProfileDropdown: false,
    showEvaluationTooltip: false,
    isMarkingComplete: false,
    isSubmittingQuiz: false,
    isQuizValid: false,
    showBadgeGallery: false,
    showLeaderboard: false,
  });
});

describe('uiSlice — showProfileDropdown', () => {
  test('initializes as false', () => {
    expect(useIALabStore.getState().showProfileDropdown).toBe(false);
  });

  test('setShowProfileDropdown toggles', () => {
    useIALabStore.getState().setShowProfileDropdown(true);
    expect(useIALabStore.getState().showProfileDropdown).toBe(true);
  });
});

describe('uiSlice — showEvaluationTooltip', () => {
  test('initializes as false', () => {
    expect(useIALabStore.getState().showEvaluationTooltip).toBe(false);
  });

  test('setShowEvaluationTooltip toggles', () => {
    useIALabStore.getState().setShowEvaluationTooltip(true);
    expect(useIALabStore.getState().showEvaluationTooltip).toBe(true);
  });
});

describe('uiSlice — marking state', () => {
  test('isMarkingComplete initializes as false', () => {
    expect(useIALabStore.getState().isMarkingComplete).toBe(false);
  });

  test('setIsMarkingComplete toggles', () => {
    useIALabStore.getState().setIsMarkingComplete(true);
    expect(useIALabStore.getState().isMarkingComplete).toBe(true);
  });
});

describe('uiSlice — quiz state', () => {
  test('isSubmittingQuiz initializes as false', () => {
    expect(useIALabStore.getState().isSubmittingQuiz).toBe(false);
  });

  test('setIsSubmittingQuiz toggles', () => {
    useIALabStore.getState().setIsSubmittingQuiz(true);
    expect(useIALabStore.getState().isSubmittingQuiz).toBe(true);
  });

  test('isQuizValid initializes as false', () => {
    expect(useIALabStore.getState().isQuizValid).toBe(false);
  });

  test('setIsQuizValid toggles', () => {
    useIALabStore.getState().setIsQuizValid(true);
    expect(useIALabStore.getState().isQuizValid).toBe(true);
  });
});

describe('uiSlice — galleries', () => {
  test('showBadgeGallery initializes as false', () => {
    expect(useIALabStore.getState().showBadgeGallery).toBe(false);
  });

  test('setShowBadgeGallery toggles', () => {
    useIALabStore.getState().setShowBadgeGallery(true);
    expect(useIALabStore.getState().showBadgeGallery).toBe(true);
  });

  test('showLeaderboard initializes as false', () => {
    expect(useIALabStore.getState().showLeaderboard).toBe(false);
  });

  test('setShowLeaderboard toggles', () => {
    useIALabStore.getState().setShowLeaderboard(true);
    expect(useIALabStore.getState().showLeaderboard).toBe(true);
  });
});
