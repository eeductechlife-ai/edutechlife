import { useIALabStore } from '../ialabStore';

beforeEach(() => {
  useIALabStore.setState({
    coachQ: '',
    coachMsg: '',
    coachLoad: false,
    isListening: false,
    avatarState: 'idle',
    showValerioDrawer: false,
    isSynthesizerOpen: false,
  });
});

describe('synthesizerSlice — coach state', () => {
  test('coachQ initializes empty', () => {
    expect(useIALabStore.getState().coachQ).toBe('');
  });

  test('setCoachQ updates', () => {
    useIALabStore.getState().setCoachQ('How to study?');
    expect(useIALabStore.getState().coachQ).toBe('How to study?');
  });

  test('coachMsg initializes empty', () => {
    expect(useIALabStore.getState().coachMsg).toBe('');
  });

  test('setCoachMsg updates', () => {
    useIALabStore.getState().setCoachMsg('Here is advice');
    expect(useIALabStore.getState().coachMsg).toBe('Here is advice');
  });

  test('coachLoad initializes as false', () => {
    expect(useIALabStore.getState().coachLoad).toBe(false);
  });

  test('setCoachLoad toggles', () => {
    useIALabStore.getState().setCoachLoad(true);
    expect(useIALabStore.getState().coachLoad).toBe(true);
  });
});

describe('synthesizerSlice — voice & UI state', () => {
  test('isListening initializes as false', () => {
    expect(useIALabStore.getState().isListening).toBe(false);
  });

  test('setIsListening toggles', () => {
    useIALabStore.getState().setIsListening(true);
    expect(useIALabStore.getState().isListening).toBe(true);
  });

  test('avatarState initializes as idle', () => {
    expect(useIALabStore.getState().avatarState).toBe('idle');
  });

  test('setAvatarState updates', () => {
    useIALabStore.getState().setAvatarState('speaking');
    expect(useIALabStore.getState().avatarState).toBe('speaking');
  });

  test('showValerioDrawer initializes as false', () => {
    expect(useIALabStore.getState().showValerioDrawer).toBe(false);
  });

  test('setShowValerioDrawer toggles', () => {
    useIALabStore.getState().setShowValerioDrawer(true);
    expect(useIALabStore.getState().showValerioDrawer).toBe(true);
  });
});

describe('synthesizerSlice — isSynthesizerOpen', () => {
  test('initializes as false', () => {
    expect(useIALabStore.getState().isSynthesizerOpen).toBe(false);
  });

  test('setIsSynthesizerOpen toggles', () => {
    useIALabStore.getState().setIsSynthesizerOpen(true);
    expect(useIALabStore.getState().isSynthesizerOpen).toBe(true);
  });
});
