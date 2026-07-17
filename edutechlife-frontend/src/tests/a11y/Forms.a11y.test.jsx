import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

beforeAll(() => {
  window.matchMedia = window.matchMedia || (() => ({ matches: false, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {} }));
});

vi.mock('../../utils/iconMapping', () => ({
  Icon: ({ name, className }) => <svg data-testid="mock-icon" data-icon={name} className={className} />,
}));

vi.mock('../../i18n/I18nProvider', () => ({
  I18nProvider: ({ children }) => children,
  useTranslation: () => ({ t: (key) => key, locale: 'es', setLocale: vi.fn() }),
}));

describe('Forms & Input Accessibility', () => {
  it('LoadingSpinner has no a11y violations', async () => {
    const LoadingSpinner = (await import('../../components/IALab/shared/LoadingSpinner')).default;
    const { container } = render(<LoadingSpinner loadingText="Cargando lecciones..." />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }, 30000);

  it('LoadingSpinner with retry has no a11y violations', async () => {
    const LoadingSpinner = (await import('../../components/IALab/shared/LoadingSpinner')).default;
    const { container } = render(
      <LoadingSpinner
        loadingText="Cargando recursos..."
        retryText="Reintentar"
        onRetry={() => {}}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }, 30000);

  it('EmptyState with title and description has no a11y violations', async () => {
    const EmptyState = (await import('../../components/IALab/shared/EmptyState')).default;
    const { container } = render(
      <EmptyState
        icon="fa-inbox"
        title="No hay resultados"
        description="Intenta ajustar los filtros de búsqueda."
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }, 30000);

  it('EmptyState with action button has no a11y violations', async () => {
    const EmptyState = (await import('../../components/IALab/shared/EmptyState')).default;
    const { container } = render(
      <EmptyState
        icon="fa-exclamation-circle"
        title="Error de conexión"
        description="No se pudieron cargar los datos."
        action={{ label: 'Reintentar', onClick: () => {} }}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }, 30000);

  it('TouchableIcon has no a11y violations', async () => {
    const TouchableIcon = (await import('../../components/IALab/shared/TouchableIcon')).TouchableIcon;
    const { container } = render(
      <TouchableIcon icon="fa-search" label="Buscar" onClick={() => {}} size="md" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }, 30000);

  it('ToastNotification success has no a11y violations', async () => {
    const ToastNotification = (await import('../../components/IALab/shared/ToastNotification')).default;
    const { container } = render(
      <ToastNotification
        toast={{ message: 'Cambios guardados correctamente', type: 'success' }}
        onDismiss={() => {}}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }, 30000);

  it('ToastNotification error has no a11y violations', async () => {
    const ToastNotification = (await import('../../components/IALab/shared/ToastNotification')).default;
    const { container } = render(
      <ToastNotification
        toast={{ message: 'Error al procesar la solicitud', type: 'error' }}
        onDismiss={() => {}}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }, 30000);
});
