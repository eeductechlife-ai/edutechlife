import React from 'react';
import { render, screen } from '@testing-library/react';
import SidebarProgressCircle from '../SidebarProgressCircle';

describe('SidebarProgressCircle', () => {
  const defaultProps = {
    progress: 33,
    completedModules: 1,
    totalModules: 5
  };

  test('renders with default props', () => {
    render(<SidebarProgressCircle {...defaultProps} />);
    
    // Verificar que se renderiza el título
    expect(screen.getByText('Progreso del Curso')).toBeInTheDocument();
    
    // Verificar que se muestra el porcentaje
    expect(screen.getByText('33%')).toBeInTheDocument();
    
    // Verificar que se muestra "completado"
    expect(screen.getByText('completado')).toBeInTheDocument();
  });

  test('displays correct progress percentage', () => {
    const { rerender } = render(<SidebarProgressCircle {...defaultProps} />);
    expect(screen.getByText('33%')).toBeInTheDocument();

    rerender(<SidebarProgressCircle {...defaultProps} progress={75} />);
    expect(screen.getByText('75%')).toBeInTheDocument();

    rerender(<SidebarProgressCircle {...defaultProps} progress={100} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  test('displays correct module counts', () => {
    render(<SidebarProgressCircle {...defaultProps} />);
    
    expect(screen.getByText('Completados')).toBeInTheDocument();
    expect(screen.getByText('1/5')).toBeInTheDocument();
  });

  test('shows time remaining', () => {
    render(<SidebarProgressCircle {...defaultProps} />);
    
    expect(screen.getByText('Tiempo restante')).toBeInTheDocument();
    expect(screen.getByText('~2h 30min')).toBeInTheDocument();
  });

  test('shows achievement badge when progress >= 50%', () => {
    const { rerender } = render(<SidebarProgressCircle {...defaultProps} progress={49} />);
    expect(screen.queryByText('¡Mitad del camino alcanzada!')).not.toBeInTheDocument();

    rerender(<SidebarProgressCircle {...defaultProps} progress={50} />);
    expect(screen.getByText('¡Mitad del camino alcanzada!')).toBeInTheDocument();

    rerender(<SidebarProgressCircle {...defaultProps} progress={75} />);
    expect(screen.getByText('¡Mitad del camino alcanzada!')).toBeInTheDocument();
  });

  test('shows appropriate progress message based on percentage', () => {
    const { rerender } = render(<SidebarProgressCircle {...defaultProps} progress={10} />);
    expect(screen.getByText('¡Recién comenzando!')).toBeInTheDocument();

    rerender(<SidebarProgressCircle {...defaultProps} progress={35} />);
    expect(screen.getByText('¡Buen progreso!')).toBeInTheDocument();

    rerender(<SidebarProgressCircle {...defaultProps} progress={65} />);
    expect(screen.getByText('¡Más de la mitad!')).toBeInTheDocument();

    rerender(<SidebarProgressCircle {...defaultProps} progress={85} />);
    expect(screen.getByText('¡Casi terminado!')).toBeInTheDocument();

    rerender(<SidebarProgressCircle {...defaultProps} progress={100} />);
    expect(screen.getByText('¡Curso completado!')).toBeInTheDocument();
  });

  test('applies custom className', () => {
    const customClass = 'custom-sidebar-progress';
    const { container } = render(
      <SidebarProgressCircle {...defaultProps} className={customClass} />
    );
    
    expect(container.firstChild).toHaveClass(customClass);
  });

  test('has proper accessibility attributes', () => {
    render(<SidebarProgressCircle {...defaultProps} />);
    
    // Verificar que los elementos tienen roles apropiados
    const progressElement = screen.getByText('33%');
    expect(progressElement).toBeInTheDocument();
    
    // Verificar que hay tooltips accesibles
    const tooltipTrigger = screen.getByText('¡Recién comenzando!');
    expect(tooltipTrigger).toHaveAttribute('class', expect.stringContaining('cursor-help'));
  });

  test('handles edge cases', () => {
    // Progress 0%
    const { rerender } = render(<SidebarProgressCircle {...defaultProps} progress={0} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByText('¡Recién comenzando!')).toBeInTheDocument();

    // Progress > 100% (should cap at 100)
    rerender(<SidebarProgressCircle {...defaultProps} progress={150} />);
    expect(screen.getByText('150%')).toBeInTheDocument();
    expect(screen.getByText('¡Curso completado!')).toBeInTheDocument();

    // No completed modules
    rerender(<SidebarProgressCircle progress={0} completedModules={0} totalModules={5} />);
    expect(screen.getByText('0/5')).toBeInTheDocument();
  });

  test('matches snapshot', () => {
    const { container } = render(<SidebarProgressCircle {...defaultProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});