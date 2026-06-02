import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmptyState } from '../shared/EmptyState';

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="No hay datos" />);
    expect(screen.getByText('No hay datos')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<EmptyState title="Vacío" description="No hay elementos para mostrar" />);
    expect(screen.getByText('No hay elementos para mostrar')).toBeInTheDocument();
  });

  it('renders action button when action provided', () => {
    const onClick = vi.fn();
    render(<EmptyState title="Vacío" action={{ label: 'Crear', onClick }} />);
    fireEvent.click(screen.getByText('Crear'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not render button when no action', () => {
    render(<EmptyState title="Vacío" />);
    expect(screen.queryByRole('button')).toBeNull();
  });
});
