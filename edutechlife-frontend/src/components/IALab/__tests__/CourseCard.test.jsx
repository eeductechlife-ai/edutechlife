import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import CourseCard from '../CourseCard';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: vi.fn() };
});

vi.mock('../../../utils/iconMapping', () => ({
  Icon: () => null,
}));

vi.mock('framer-motion', async () => {
  const React = await import('react');
  const validHtmlAttrs = new Set([
    'children', 'className', 'style', 'id', 'key', 'ref',
    'tabIndex', 'role', 'aria-label', 'aria-hidden',
    'data-testid', 'data-testId',
    'onClick', 'onMouseDown', 'onMouseUp',
    'onKeyDown', 'onKeyUp', 'onChange', 'onBlur', 'onFocus',
    'disabled', 'type', 'href', 'src', 'alt', 'value', 'name',
  ]);
  const motion = new Proxy({}, {
    get: (_, tag) => {
      if (typeof tag !== 'string') return 'div';
      const tagName = ['div', 'button', 'span', 'p', 'h1', 'h2', 'h3', 'h4'].includes(tag) ? tag : 'div';
      return ({ children, ...props }) => {
        const filtered = {};
        for (const [key, val] of Object.entries(props)) {
          if (validHtmlAttrs.has(key)) {
            filtered[key] = val;
          }
        }
        return React.createElement(tagName, Object.keys(filtered).length > 0 ? filtered : null, children);
      };
    },
  });
  return {
    motion,
    AnimatePresence: ({ children }) => children,
    useReducedMotion: () => false,
    useSpring: (initial) => ({ get: () => initial, set: vi.fn() }),
    useTransform: (val, fn) => fn(val.get?.() ?? val ?? 0),
  };
});

const baseCourse = {
  id: 'test-1',
  title: 'Fundamentos de IA',
  description: 'Aprende los fundamentos de la inteligencia artificial.',
  status: 'active',
  progress: 60,
  rating: 4.8,
  duration: '10h',
  level: 'Principiante',
  modules: 5,
  hasCertificate: true,
  icon: 'fa-brain',
  features: ['Proyectos reales', 'Certificado IA', 'Soporte 24/7'],
  students: '2,500+',
  route: '/ialab',
};

function renderCard(course = baseCourse, isSignedIn = true) {
  return render(
    <BrowserRouter>
      <CourseCard course={course} isSignedIn={isSignedIn} />
    </BrowserRouter>
  );
}

describe('CourseCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders course title', () => {
    renderCard();
    expect(screen.getByText('Fundamentos de IA')).toBeInTheDocument();
  });

  test('shows progress bar for active courses with progress > 0', () => {
    renderCard();
    expect(screen.getByText('Progreso')).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();
  });

  test('hides progress bar when progress is 0', () => {
    renderCard({ ...baseCourse, progress: 0 });
    expect(screen.queryByText('Progreso')).not.toBeInTheDocument();
  });

  test('hides progress bar for coming-soon courses', () => {
    renderCard({ ...baseCourse, status: 'coming-soon' });
    expect(screen.queryByText('Progreso')).not.toBeInTheDocument();
  });

  test('shows coming-soon badge for coming-soon courses', () => {
    renderCard({ ...baseCourse, status: 'coming-soon' });
    expect(screen.getByText('Próximamente')).toBeInTheDocument();
  });

  test('navigates to /ialab when isSignedIn is true', () => {
    const navigate = vi.fn();
    useNavigate.mockReturnValue(navigate);
    renderCard(baseCourse, true);
    fireEvent.click(screen.getByText('Comenzar'));
    expect(navigate).toHaveBeenCalledWith('/ialab');
  });

  test('navigates to /login?returnTo=/ialab when isSignedIn is false', () => {
    const navigate = vi.fn();
    useNavigate.mockReturnValue(navigate);
    renderCard(baseCourse, false);
    fireEvent.click(screen.getByText('Inscríbete'));
    expect(navigate).toHaveBeenCalledWith('/login?returnTo=/ialab');
  });

  test('renders features list', () => {
    renderCard();
    expect(screen.getByText('Proyectos reales')).toBeInTheDocument();
    expect(screen.getByText('Certificado IA')).toBeInTheDocument();
    expect(screen.getByText('Soporte 24/7')).toBeInTheDocument();
  });

  test('shows star rating', () => {
    renderCard();
    expect(screen.getByText('4.8')).toBeInTheDocument();
  });

  test('shows modules count', () => {
    renderCard();
    expect(screen.getByText('5 módulos')).toBeInTheDocument();
  });

  test('shows certificate badge when hasCertificate is true', () => {
    renderCard();
    expect(screen.getByText('Certificado')).toBeInTheDocument();
  });

  test('shows level and duration', () => {
    renderCard();
    expect(screen.getByText('Principiante')).toBeInTheDocument();
    expect(screen.getByText('10h')).toBeInTheDocument();
  });
});
