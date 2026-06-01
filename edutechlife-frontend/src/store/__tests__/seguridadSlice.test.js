import { useIALabStore } from '../ialabStore';

beforeEach(() => {
  useIALabStore.setState({
    showExitConfirmation: false,
    showSecurityWarning: false,
    securityWarningCount: 0,
    screenshotProtectionActive: false,
    securityViolations: 0,
    attemptsPenalized: 0,
    keyboardLockActive: false,
    showSecurityStatus: false,
    securityMessage: '',
    showSecurityMessage: false,
  });
});

describe('seguridadSlice — exit confirmation', () => {
  test('showExitConfirmation initializes as false', () => {
    expect(useIALabStore.getState().showExitConfirmation).toBe(false);
  });

  test('setShowExitConfirmation toggles', () => {
    useIALabStore.getState().setShowExitConfirmation(true);
    expect(useIALabStore.getState().showExitConfirmation).toBe(true);
  });
});

describe('seguridadSlice — security warnings', () => {
  test('showSecurityWarning initializes as false', () => {
    expect(useIALabStore.getState().showSecurityWarning).toBe(false);
  });

  test('setShowSecurityWarning toggles', () => {
    useIALabStore.getState().setShowSecurityWarning(true);
    expect(useIALabStore.getState().showSecurityWarning).toBe(true);
  });

  test('securityWarningCount initializes at 0', () => {
    expect(useIALabStore.getState().securityWarningCount).toBe(0);
  });

  test('setSecurityWarningCount updates count', () => {
    useIALabStore.getState().setSecurityWarningCount(3);
    expect(useIALabStore.getState().securityWarningCount).toBe(3);
  });
});

describe('seguridadSlice — protections', () => {
  test('screenshotProtectionActive initializes as false', () => {
    expect(useIALabStore.getState().screenshotProtectionActive).toBe(false);
  });

  test('setScreenshotProtectionActive toggles', () => {
    useIALabStore.getState().setScreenshotProtectionActive(true);
    expect(useIALabStore.getState().screenshotProtectionActive).toBe(true);
  });

  test('keyboardLockActive initializes as false', () => {
    expect(useIALabStore.getState().keyboardLockActive).toBe(false);
  });

  test('setKeyboardLockActive toggles', () => {
    useIALabStore.getState().setKeyboardLockActive(true);
    expect(useIALabStore.getState().keyboardLockActive).toBe(true);
  });
});

describe('seguridadSlice — violations and penalties', () => {
  test('securityViolations initializes at 0', () => {
    expect(useIALabStore.getState().securityViolations).toBe(0);
  });

  test('setSecurityViolations updates', () => {
    useIALabStore.getState().setSecurityViolations(2);
    expect(useIALabStore.getState().securityViolations).toBe(2);
  });

  test('attemptsPenalized initializes at 0', () => {
    expect(useIALabStore.getState().attemptsPenalized).toBe(0);
  });

  test('setAttemptsPenalized updates', () => {
    useIALabStore.getState().setAttemptsPenalized(1);
    expect(useIALabStore.getState().attemptsPenalized).toBe(1);
  });
});

describe('seguridadSlice — security messages', () => {
  test('showSecurityStatus initializes as false', () => {
    expect(useIALabStore.getState().showSecurityStatus).toBe(false);
  });

  test('setShowSecurityStatus toggles', () => {
    useIALabStore.getState().setShowSecurityStatus(true);
    expect(useIALabStore.getState().showSecurityStatus).toBe(true);
  });

  test('securityMessage initializes empty', () => {
    expect(useIALabStore.getState().securityMessage).toBe('');
  });

  test('setSecurityMessage updates', () => {
    useIALabStore.getState().setSecurityMessage('Warning');
    expect(useIALabStore.getState().securityMessage).toBe('Warning');
  });

  test('showSecurityMessage initializes as false', () => {
    expect(useIALabStore.getState().showSecurityMessage).toBe(false);
  });

  test('setShowSecurityMessage toggles', () => {
    useIALabStore.getState().setShowSecurityMessage(true);
    expect(useIALabStore.getState().showSecurityMessage).toBe(true);
  });
});
