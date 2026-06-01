import { useIALabStore } from '../ialabStore';

beforeEach(() => {
  useIALabStore.setState({
    certName: '',
    showNameModal: false,
    showCertificateModal: false,
    storedCertificate: null,
    certificateGenerating: false,
  });
});

describe('certificateSlice — name', () => {
  test('certName initializes empty', () => {
    expect(useIALabStore.getState().certName).toBe('');
  });

  test('setCertName updates', () => {
    useIALabStore.getState().setCertName('John Doe');
    expect(useIALabStore.getState().certName).toBe('John Doe');
  });
});

describe('certificateSlice — modals', () => {
  test('showNameModal initializes as false', () => {
    expect(useIALabStore.getState().showNameModal).toBe(false);
  });

  test('setShowNameModal toggles', () => {
    useIALabStore.getState().setShowNameModal(true);
    expect(useIALabStore.getState().showNameModal).toBe(true);
  });

  test('showCertificateModal initializes as false', () => {
    expect(useIALabStore.getState().showCertificateModal).toBe(false);
  });

  test('setShowCertificateModal toggles', () => {
    useIALabStore.getState().setShowCertificateModal(true);
    expect(useIALabStore.getState().showCertificateModal).toBe(true);
  });
});

describe('certificateSlice — storage', () => {
  test('storedCertificate initializes as null', () => {
    expect(useIALabStore.getState().storedCertificate).toBeNull();
  });

  test('setStoredCertificate stores data', () => {
    const data = { name: 'John', date: '2026-01-01' };
    useIALabStore.getState().setStoredCertificate(data);
    expect(useIALabStore.getState().storedCertificate).toEqual(data);
  });
});

describe('certificateSlice — generation', () => {
  test('certificateGenerating initializes as false', () => {
    expect(useIALabStore.getState().certificateGenerating).toBe(false);
  });

  test('setCertificateGenerating toggles', () => {
    useIALabStore.getState().setCertificateGenerating(true);
    expect(useIALabStore.getState().certificateGenerating).toBe(true);
  });
});
