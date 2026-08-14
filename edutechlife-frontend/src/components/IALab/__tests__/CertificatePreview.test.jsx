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

vi.mock('jspdf', () => ({
  default: vi.fn(() => ({
    internal: { pageSize: { getWidth: () => 297, getHeight: () => 210 } },
    setFillColor: vi.fn(),
    rect: vi.fn(),
    setDrawColor: vi.fn(),
    setLineWidth: vi.fn(),
    circle: vi.fn(),
    setFont: vi.fn(),
    setFontSize: vi.fn(),
    setTextColor: vi.fn(),
    text: vi.fn(),
    line: vi.fn(),
    getTextWidth: vi.fn(() => 50),
    addImage: vi.fn(),
    save: vi.fn(),
  })),
}));

describe('CertificatePreview', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
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
    const date = new Date('2026-06-01').toISOString();
    render(<CertificatePreview issuedAt={date} />);
    expect(screen.getByText(/ialab\.certificate_preview\.issue_date/)).toBeInTheDocument();
  });

  test('renders compact version with download button', () => {
    render(<CertificatePreview compact />);
    const btn = screen.getByRole('button');
    expect(btn).toBeInTheDocument();
    expect(screen.getByText(/ialab\.certificate_preview\.download/i)).toBeInTheDocument();
  });

  test('renders default cert number if not provided', () => {
    render(<CertificatePreview />);
    expect(screen.getByText(/EDL-2026/)).toBeInTheDocument();
  });

  test('renders full certificate view with title', () => {
    render(<CertificatePreview studentName="Carlos Ruiz" />);
    expect(screen.getByText(/ialab\.certificate_preview\.certificate_title_react/i)).toBeInTheDocument();
    expect(screen.getByText(/ialab\.certificate_preview\.issued_to/i)).toBeInTheDocument();
  });

  test('renders edutechlife logo in header', () => {
    render(<CertificatePreview studentName="María López" />);
    const logo = screen.getByAltText('Edutechlife');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/images/logo-edutechlife.webp');
  });

  test('shows generating state on download click', async () => {
    vi.stubGlobal('Image', class {
      constructor() {
        this.crossOrigin = null;
        this.src = '';
        setTimeout(() => {
          this.naturalWidth = 2972;
          this.naturalHeight = 392;
          this.onload?.();
        }, 0);
      }
    });
    render(<CertificatePreview studentName="Test User" />);
    fireEvent.click(screen.getByText(/ialab\.certificate_preview\.download/i));
    expect(screen.getByText(/ialab\.certificate_preview\.generating/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/ialab\.certificate_preview\.download/i)).toBeInTheDocument();
    });
  });
});
