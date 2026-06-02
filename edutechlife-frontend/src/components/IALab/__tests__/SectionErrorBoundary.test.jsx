import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SectionErrorBoundary from '../SectionErrorBoundary';

describe('SectionErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <SectionErrorBoundary name="test" t={(key) => key}>
        <div>Contenido normal</div>
      </SectionErrorBoundary>
    );
    expect(screen.getByText('Contenido normal')).toBeInTheDocument();
  });
});
