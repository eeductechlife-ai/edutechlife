import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

expect.extend(toHaveNoViolations);

beforeAll(() => {
  window.matchMedia = window.matchMedia || (() => ({ matches: false, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {} }));
});

vi.mock('../../context/ThemeContext', () => ({
  ThemeProvider: ({ children }) => children,
  useTheme: () => ({ theme: 'light', toggleTheme: vi.fn() }),
}));

vi.mock('../../i18n/I18nProvider', () => ({
  I18nProvider: ({ children }) => children,
  useTranslation: () => ({ t: (key) => key, locale: 'es', setLocale: vi.fn() }),
}));

vi.mock('../../utils/iconMapping', () => ({
  Icon: ({ name, className, ...props }) => (
    <svg data-testid="mock-icon" data-icon={name} className={className} {...props} />
  ),
}));

vi.mock('../../data/footer/footerContent', () => ({
  getFooterContent: () => ({}),
}));

vi.mock('../../components/footer/modals/ModalVAK', () => ({ default: () => null }));
vi.mock('../../components/footer/modals/ModalCertificaciones', () => ({ default: () => null }));
vi.mock('../../components/footer/modals/ModalBlog', () => ({ default: () => null }));
vi.mock('../../components/footer/modals/ModalDocumentacion', () => ({ default: () => null }));
vi.mock('../../components/footer/modals/ModalPrivacidad', () => ({ default: () => null }));
vi.mock('../../components/footer/modals/ModalTerminos', () => ({ default: () => null }));
vi.mock('../../components/footer/modals/ModalContacto', () => ({ default: () => null }));

vi.mock('framer-motion', async () => {
  const React = await import('react');
  const motion = new Proxy({}, {
    get: (_, tag) => {
      const allowed = ['div', 'button', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'a', 'nav', 'ol', 'li', 'header'];
      const tagName = allowed.includes(tag) ? tag : 'div';
      return ({ children, ...props }) => {
        const valid = ['children', 'className', 'style', 'id', 'key', 'ref', 'tabIndex', 'role', 'aria-label', 'aria-hidden', 'data-testid', 'onClick', 'onMouseDown', 'onMouseUp', 'onKeyDown', 'onKeyUp', 'onChange', 'onBlur', 'onFocus', 'disabled', 'type', 'href', 'src', 'alt', 'value', 'name', 'title', 'htmlFor', 'initial', 'animate', 'exit', 'transition', 'layout', 'variants', 'whileHover', 'whileTap'];
        const filtered = {};
        for (const [k, v] of Object.entries(props)) {
          if (valid.includes(k)) filtered[k] = v;
        }
        return React.createElement(tagName, Object.keys(filtered).length > 0 ? filtered : null, children);
      };
    },
  });
  return {
    motion,
    AnimatePresence: ({ children }) => children,
    useReducedMotion: () => false,
  };
});

vi.mock('lucide-react', () => {
  const icons = ['Home', 'Target', 'BookOpen', 'Cpu', 'BarChart3', 'ChevronRight', 'Award', 'Clock', 'LogOut', 'ChevronLeft', 'Menu', 'X', 'Sun', 'Moon', 'Search'];
  const mock = {};
  icons.forEach(name => {
    mock[name] = (props) => {
      const { className, ...rest } = props || {};
      const safe = {};
      if (className) safe.className = className;
      if (rest['aria-hidden']) safe['aria-hidden'] = rest['aria-hidden'];
      return React.createElement('svg', Object.keys(safe).length > 0 ? safe : null);
    };
  });
  return mock;
});

describe('Navigation a11y', () => {
  test('NavigationBar has no violations', async () => {
    const { NavigationBar } = await import('../../components/IALab/IALabQuizModal/components/NavigationBar');
    const { container } = render(
      <BrowserRouter>
        <NavigationBar
          currentQuestion={0}
          totalQuestions={10}
          hasAnsweredCurrent={false}
          isSubmitting={false}
          answeredCount={0}
          onPrev={vi.fn()}
          onNext={vi.fn()}
          onSubmit={vi.fn()}
        />
      </BrowserRouter>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }, 30000);

  test('Footer has no violations', async () => {
    const Footer = (await import('../../components/Footer')).default;
    const { container } = render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }, 30000);

  test('Breadcrumbs has no violations', async () => {
    const Breadcrumbs = (await import('../../components/IALab/Breadcrumbs')).default;
    const segments = [
      { label: 'Inicio', onClick: () => {} },
      { label: 'IA Lab', onClick: () => {} },
      { label: 'Módulo 1' },
    ];
    const { container } = render(
      <HelmetProvider>
        <BrowserRouter>
          <Breadcrumbs segments={segments} />
        </BrowserRouter>
      </HelmetProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }, 30000);

  test('MobileHeader has no violations', async () => {
    const MobileHeader = (await import('../../components/IALab/shared/MobileHeader')).default;
    const { container } = render(
      <MobileHeader
        onOpenMobileMenu={() => {}}
        setIsSearchOpen={() => {}}
        searchQuery=""
        setSearchQuery={() => {}}
        isSearchOpen={false}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }, 30000);

  test('Button has no violations', async () => {
    const { Button } = await import('../../components/ui/button');
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }, 30000);
});
