import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { useIALabStore } from '../../../store/ialabStore';
import TuRutaDeHoy from '../TuRutaDeHoy';

beforeEach(() => {
  useIALabStore.setState(useIALabStore.getInitialState());
});

test('renders with default store state without crashing', () => {
  const { container } = render(<TuRutaDeHoy onAction={vi.fn()} />);
  expect(container).toBeInTheDocument();
});

test('renders without crashing with basic module data', () => {
  useIALabStore.setState({
    modules: [
      { id: 1, title: 'Módulo 1', topics: ['Topic 1'] },
      { id: 2, title: 'Módulo 2', topics: ['Topic A'] },
    ],
    activeMod: 1,
    courseProgress: 10,
  });
  const { container } = render(<TuRutaDeHoy onAction={vi.fn()} />);
  expect(container).toBeInTheDocument();
});
