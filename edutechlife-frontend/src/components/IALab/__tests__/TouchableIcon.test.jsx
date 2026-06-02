import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TouchableIcon } from '../shared/TouchableIcon';

describe('TouchableIcon', () => {
  it('renders with aria-label', () => {
    render(<TouchableIcon icon="fa-search" label="Buscar" onClick={() => {}} />);
    expect(screen.getByLabelText('Buscar')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<TouchableIcon icon="fa-x" label="Cerrar" onClick={onClick} />);
    fireEvent.click(screen.getByLabelText('Cerrar'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('has min 44px touch target classes', () => {
    render(<TouchableIcon icon="fa-search" label="Buscar" onClick={() => {}} />);
    const btn = screen.getByLabelText('Buscar');
    expect(btn.className).toContain('min-w-[44px]');
    expect(btn.className).toContain('min-h-[44px]');
  });
});
