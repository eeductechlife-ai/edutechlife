import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { I18nProvider } from '../../i18n/I18nProvider';
import { ThemeProvider } from '../../context/ThemeContext';

beforeAll(() => {
  window.matchMedia = window.matchMedia || (() => ({ matches: false, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {} }));
});

expect.extend(toHaveNoViolations);

vi.mock('../../utils/iconMapping', () => ({
  Icon: ({ name, className }) => <svg data-testid="mock-icon" data-icon={name} className={className} />,
}));

vi.mock('../../data/ialab', () => ({
  getBadgeInfo: () => ({ first_lesson: { label: 'Test Badge', desc: 'A test badge', icon: 'fa-star', color: '#FBBF24' } }),
}));

vi.mock('../../context/IALabContext', () => ({
  useIALabUIContext: () => ({ onBack: vi.fn(), courseCompleted: false, setShowCertificateModal: vi.fn() }),
  useIALabProgressContext: () => ({ modules: [], activeMod: null, setActiveMod: vi.fn(), openResourceById: vi.fn() }),
}));

vi.mock('../../context/NotificationContext', () => ({
  useNotification: () => ({ unreadCount: 0, createNotification: vi.fn() }),
}));

vi.mock('../../hooks/useCourseReminders', () => ({
  useCourseReminders: () => {},
}));

vi.mock('../../hooks/useBrowserNotifications', () => ({
  useBrowserNotifications: () => {},
}));

vi.mock('../../hooks/IALab/forum/useForumNotifications', () => ({
  default: () => ({ unreadCount: 0 }),
}));

vi.mock('../../components/IALab/GlobalSearchBar', () => ({
  default: () => null,
}));

vi.mock('../../components/UserDropdownMenuSimplified', () => ({
  default: () => null,
}));

vi.mock('../../components/NotificationPanel', () => ({
  default: () => null,
}));

vi.mock('../../components/LocaleSwitcher', () => ({
  default: () => null,
}));

describe('IALab Accessibility', () => {
  it('IALabHeader has no a11y violations', async () => {
    const IALabHeader = (await import('../../components/IALab/IALabHeader')).default;
    const { container } = render(
      <ThemeProvider>
        <I18nProvider>
          <IALabHeader />
        </I18nProvider>
      </ThemeProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }, 30000);

  it('BadgeCard earned state has no a11y violations', async () => {
    const BadgeCard = (await import('../../components/IALab/BadgeCard')).default;
    const badge = { id: 'test', label: 'Test Badge', desc: 'A test description', icon: 'fa-star', color: '#FBBF24' };
    const { container } = render(
      <I18nProvider>
        <BadgeCard badge={badge} earned dateEarned="2025-01-15" onClick={vi.fn()} />
      </I18nProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }, 30000);

  it('BadgeCard locked state has no a11y violations', async () => {
    const BadgeCard = (await import('../../components/IALab/BadgeCard')).default;
    const badge = { id: 'test', label: 'Test Badge', desc: 'A test description', icon: 'fa-star', color: '#FBBF24' };
    const { container } = render(
      <I18nProvider>
        <BadgeCard badge={badge} earned={false} onClick={vi.fn()} />
      </I18nProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }, 30000);
});
