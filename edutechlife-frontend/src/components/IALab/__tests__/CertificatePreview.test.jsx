import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import CertificatePreview from '../CertificatePreview';

vi.mock('../../../utils/iconMapping', () => ({
  Icon: ({ name }) => <span data-testid="icon" data-icon={name} />,
}));

vi.mock('../../../i18n/I18nProvider', () => ({
  useTranslation: () => ({ t: (k) => k, locale: 'es', setLocale: vi.fn() }),
}));

vi.mock('framer-motion', () => {
  const motion = new Proxy({}, {
    get: () => {
      const comp = ({ children, ...props }) => {
        const filtered = {};
        for (const [key, val] of Object.entries(props)) {
          if (['children', 'className', 'style', 'onClick', 'disabled', 'href', 'target', 'rel', 'aria-label'].includes(key)) {
            filtered[key] = val;
          }
        }
        return React.createElement('div', filtered, children);
      };
      return comp;
    },
  });
  return { motion, AnimatePresence: ({ children }) => children };
});

const saveSpy = vi.fn();
const docStub = { save: saveSpy };
// `new jsPDF(...)` necesita un constructor real, no una arrow function.
vi.mock('jspdf', () => ({ default: vi.fn(function jsPDFStub() { return docStub; }) }));

const drawCertificate = vi.fn();
vi.mock('../../../utils/certificatePdf', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, drawCertificate: (...args) => drawCertificate(...args) };
});

vi.mock('../../../utils/certificateAssets', () => ({
  loadInstitutionLogos: vi.fn(async () => ({})),
  buildQrMatrix: vi.fn(async () => [[true, false], [false, true]]),
}));

const clickDownload = () =>
  fireEvent.click(screen.getByText(/ialab\.certificate_preview\.download/i));

describe('CertificatePreview', () => {
  beforeEach(() => {
    saveSpy.mockClear();
    drawCertificate.mockClear();
    drawCertificate.mockImplementation(() => {});
  });

  test('renders student name', () => {
    render(<CertificatePreview studentName="María López" />);
    expect(screen.getByText('María López')).toBeInTheDocument();
  });

  test('renders cert number', () => {
    render(<CertificatePreview certNumber="EDL-2026-001234" />);
    expect(screen.getByText('EDL-2026-001234')).toBeInTheDocument();
  });

  test('renders date section', () => {
    render(<CertificatePreview issuedAt={new Date('2026-06-01').toISOString()} />);
    expect(screen.getByText(/ialab\.certificate_preview\.issue_date|certificate\.issue_date_pdf/)).toBeInTheDocument();
  });

  test('falls back to the current year in the default cert number', () => {
    render(<CertificatePreview />);
    // Aparece en el nº de certificado y en la URL de verificación.
    expect(screen.getAllByText(new RegExp(`EDL-${new Date().getFullYear()}-`)).length).toBeGreaterThan(0);
  });

  test('ignores an invalid issue date instead of rendering NaN', () => {
    render(<CertificatePreview issuedAt="no-es-una-fecha" />);
    expect(screen.queryByText(/Invalid Date|NaN/)).not.toBeInTheDocument();
  });

  test('renders the three endorsing institutions', () => {
    render(<CertificatePreview studentName="Ana Ruiz" />);
    expect(screen.getByAltText('Edutechlife')).toBeInTheDocument();
    expect(screen.getByAltText('Ministerio TIC')).toBeInTheDocument();
    expect(screen.getByAltText('Alcaldía de Manizales')).toBeInTheDocument();
  });

  test('shows the on-line verification url', () => {
    render(<CertificatePreview certNumber="EDL-2026-001234" />);
    expect(
      screen.getByText('https://edutechlife.co/verificar/EDL-2026-001234'),
    ).toBeInTheDocument();
  });

  test('renders compact version with download button', () => {
    render(<CertificatePreview compact />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText(/ialab\.certificate_preview\.download/i)).toBeInTheDocument();
  });

  test('draws and saves the pdf on download', async () => {
    render(<CertificatePreview studentName="Test User" certNumber="EDL-2026-000001" />);
    clickDownload();
    expect(screen.getByText(/ialab\.certificate_preview\.generating/i)).toBeInTheDocument();

    await waitFor(() => expect(saveSpy).toHaveBeenCalled());

    const options = drawCertificate.mock.calls[0][1];
    expect(options.studentName).toBe('Test User');
    expect(options.certNumber).toBe('EDL-2026-000001');
    expect(options.verifyUrl).toBe('https://edutechlife.co/verificar/EDL-2026-000001');
    expect(options.qrMatrix).toHaveLength(2);
    expect(options.signatures).toHaveLength(2);
    expect(saveSpy.mock.calls[0][0]).toMatch(/\.pdf$/);
  });

  test('surfaces an error instead of failing silently', async () => {
    drawCertificate.mockImplementation(() => {
      throw new Error('boom');
    });
    render(<CertificatePreview studentName="Test User" />);
    clickDownload();

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent('certificate.error_generating'),
    );
    expect(saveSpy).not.toHaveBeenCalled();
  });
});
