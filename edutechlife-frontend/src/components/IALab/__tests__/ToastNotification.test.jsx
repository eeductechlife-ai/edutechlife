import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToastNotification } from '../shared/ToastNotification';

describe('ToastNotification', () => {
  it('renders toast message', () => {
    render(<ToastNotification toast={{ message: 'Éxito', type: 'success' }} onDismiss={() => {}} />);
    expect(screen.getByText('Éxito')).toBeInTheDocument();
  });

  it('calls onDismiss when close button clicked', () => {
    const onDismiss = vi.fn();
    render(<ToastNotification toast={{ message: 'Test', type: 'info' }} onDismiss={onDismiss} />);
    fireEvent.click(screen.getByLabelText('Dismiss'));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('returns null when no toast', () => {
    const { container } = render(<ToastNotification toast={null} onDismiss={() => {}} />);
    expect(container.innerHTML).toBe('');
  });
});
