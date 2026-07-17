import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

beforeAll(() => {
  window.matchMedia = window.matchMedia || (() => ({ matches: false, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {} }));
});

vi.mock('framer-motion', async () => {
  const React = await import('react');
  const motion = new Proxy({}, {
    get: (_, tag) => {
      const allowed = ['div', 'button', 'span', 'p', 'h1', 'h2', 'h3', 'h4'];
      const tagName = allowed.includes(tag) ? tag : 'div';
      return ({ children, ...props }) => {
        const valid = ['children', 'className', 'style', 'id', 'key', 'ref', 'tabIndex', 'role', 'aria-label', 'aria-hidden', 'data-testid', 'onClick', 'onMouseDown', 'onMouseUp', 'onKeyDown', 'onKeyUp', 'onChange', 'onBlur', 'onFocus', 'disabled', 'type', 'href', 'src', 'alt', 'value', 'name', 'title'];
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

vi.mock('../../lib/utils', () => ({
  cn: (...classes) => classes.filter(Boolean).join(' '),
}));

describe('Dashboard & Cards Accessibility', () => {
  it('GlassCard has no a11y violations', async () => {
    const GlassCard = (await import('../../components/GlassCard')).default;
    const { container } = render(
      <GlassCard>
        <p>Contenido de la tarjeta</p>
      </GlassCard>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }, 30000);

  it('BrandCard default variant has no a11y violations', async () => {
    const BrandCard = (await import('../../components/ui/BrandCard')).default;
    const { container } = render(
      <BrandCard variant="default">
        <h3>Título de tarjeta</h3>
        <p>Descripción de ejemplo</p>
      </BrandCard>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }, 30000);

  it('BrandButton primary has no a11y violations', async () => {
    const BrandButton = (await import('../../components/ui/BrandButton')).default;
    const { container } = render(
      <BrandButton variant="primary" size="md">Comenzar</BrandButton>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }, 30000);

  it('BrandBadge has no a11y violations', async () => {
    const BrandBadge = (await import('../../components/ui/BrandBadge')).default;
    const { container } = render(
      <BrandBadge variant="primary" size="md">Nuevo</BrandBadge>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }, 30000);

  it('SectionHeader has no a11y violations', async () => {
    const SectionHeader = (await import('../../components/ui/SectionHeader')).default;
    const { container } = render(<SectionHeader title="Mis Cursos" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }, 30000);
});
