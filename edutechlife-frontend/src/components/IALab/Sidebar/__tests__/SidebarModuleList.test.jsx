import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SidebarModuleList from '../SidebarModuleList';

describe('SidebarModuleList', () => {
  const mockModules = [
    { id: 1, title: 'Introducción a IA', duration: '45 min', level: 'Principiante' },
    { id: 2, title: 'Machine Learning Básico', duration: '60 min', level: 'Intermedio' },
    { id: 3, title: 'Redes Neuronales', duration: '90 min', level: 'Avanzado' },
    { id: 4, title: 'Deep Learning', duration: '75 min', level: 'Avanzado' },
    { id: 5, title: 'Proyecto Final', duration: '120 min', level: 'Intermedio' }
  ];

  const defaultProps = {
    modules: mockModules,
    activeMod: 1,
    completedModules: [1],
    onModuleSelect: jest.fn(),
    isModuleLocked: (id) => id > 2, // Bloquea módulos 3, 4, 5
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with default props', () => {
    render(<SidebarModuleList {...defaultProps} />);
    
    // Verificar título de sección
    expect(screen.getByText('Módulos del Curso')).toBeInTheDocument();
    
    // Verificar que todos los módulos se renderizan
    mockModules.forEach(module => {
      expect(screen.getByText(module.title)).toBeInTheDocument();
      expect(screen.getByText(module.duration)).toBeInTheDocument();
    });
    
    // Verificar estadísticas en footer
    expect(screen.getByText('Completados: 1')).toBeInTheDocument();
    expect(screen.getByText('Activo: 1')).toBeInTheDocument();
    expect(screen.getByText('5 módulos total')).toBeInTheDocument();
  });

  test('highlights active module correctly', () => {
    render(<SidebarModuleList {...defaultProps} />);
    
    // Módulo activo (id: 1) debe tener estilos especiales
    const activeModule = screen.getByText('Introducción a IA').closest('button');
    expect(activeModule).toHaveAttribute('aria-current', 'page');
    expect(activeModule).toHaveClass('bg-gradient-to-r');
    expect(activeModule).toHaveClass('from-cyan-600');
    expect(activeModule).toHaveClass('to-cyan-500');
  });

  test('shows completed modules with check icon', () => {
    render(<SidebarModuleList {...defaultProps} />);
    
    // Módulo completado (id: 1) debe tener icono de check
    const completedModule = screen.getByText('Introducción a IA').closest('button');
    const checkIcon = completedModule.querySelector('svg[data-icon="check-circle"]');
    expect(checkIcon).toBeInTheDocument();
  });

  test('shows locked modules with lock icon', () => {
    render(<SidebarModuleList {...defaultProps} />);
    
    // Módulos bloqueados (id: 3, 4, 5) deben tener icono de candado
    const lockedModules = mockModules.filter(m => m.id > 2);
    lockedModules.forEach(module => {
      const moduleElement = screen.getByText(module.title).closest('button');
      const lockIcon = moduleElement.querySelector('svg[data-icon="lock"]');
      expect(lockIcon).toBeInTheDocument();
      expect(moduleElement).toHaveClass('cursor-not-allowed');
      expect(moduleElement).toHaveClass('opacity-70');
    });
  });

  test('calls onModuleSelect when clicking non-locked module', () => {
    render(<SidebarModuleList {...defaultProps} />);
    
    // Click en módulo no bloqueado (id: 2)
    const module2 = screen.getByText('Machine Learning Básico').closest('button');
    fireEvent.click(module2);
    
    expect(defaultProps.onModuleSelect).toHaveBeenCalledWith(2);
    expect(defaultProps.onModuleSelect).toHaveBeenCalledTimes(1);
  });

  test('does not call onModuleSelect when clicking locked module', () => {
    render(<SidebarModuleList {...defaultProps} />);
    
    // Click en módulo bloqueado (id: 3)
    const module3 = screen.getByText('Redes Neuronales').closest('button');
    fireEvent.click(module3);
    
    expect(defaultProps.onModuleSelect).not.toHaveBeenCalled();
  });

  test('shows correct level badges', () => {
    render(<SidebarModuleList {...defaultProps} />);
    
    // Verificar badges de nivel
    const beginnerBadge = screen.getByText('Principiante');
    expect(beginnerBadge).toHaveClass('bg-emerald-500/10');
    expect(beginnerBadge).toHaveClass('text-emerald-600');
    
    const intermediateBadge = screen.getByText('Intermedio');
    expect(intermediateBadge).toHaveClass('bg-amber-500/10');
    expect(intermediateBadge).toHaveClass('text-amber-600');
    
    const advancedBadge = screen.getByText('Avanzado');
    expect(advancedBadge).toHaveClass('bg-purple-500/10');
    expect(advancedBadge).toHaveClass('text-purple-600');
  });

  test('applies custom className', () => {
    const customClass = 'custom-module-list';
    const { container } = render(
      <SidebarModuleList {...defaultProps} className={customClass} />
    );
    
    expect(container.firstChild).toHaveClass(customClass);
  });

  test('has proper accessibility attributes', () => {
    render(<SidebarModuleList {...defaultProps} />);
    
    // Verificar aria-label para módulos
    const module1 = screen.getByText('Introducción a IA').closest('button');
    expect(module1).toHaveAttribute('aria-label', expect.stringContaining('Introducción a IA'));
    expect(module1).toHaveAttribute('aria-label', expect.stringContaining('45 min'));
    
    // Verificar aria-label para módulos bloqueados
    const module3 = screen.getByText('Redes Neuronales').closest('button');
    expect(module3).toHaveAttribute('aria-label', expect.stringContaining('Bloqueado'));
    
    // Verificar focus styles
    expect(module1).toHaveClass('focus:outline-none');
    expect(module1).toHaveClass('focus:ring-1');
    expect(module1).toHaveClass('focus:ring-cyan-300/50');
  });

  test('handles empty modules array', () => {
    render(<SidebarModuleList modules={[]} />);
    
    // Debe renderizar el header pero no módulos
    expect(screen.getByText('Módulos del Curso')).toBeInTheDocument();
    expect(screen.getByText('0 módulos total')).toBeInTheDocument();
  });

  test('handles undefined isModuleLocked function', () => {
    const propsWithoutLockedFn = {
      ...defaultProps,
      isModuleLocked: undefined
    };
    
    render(<SidebarModuleList {...propsWithoutLockedFn} />);
    
    // Todos los módulos deben ser clickeables
    const module3 = screen.getByText('Redes Neuronales').closest('button');
    expect(module3).not.toHaveClass('cursor-not-allowed');
    expect(module3).not.toHaveClass('opacity-70');
  });

  test('shows play icon for active module', () => {
    render(<SidebarModuleList {...defaultProps} />);
    
    const activeModule = screen.getByText('Introducción a IA').closest('button');
    const playIcon = activeModule.querySelector('svg[data-icon="play-circle"]');
    expect(playIcon).toBeInTheDocument();
  });

  test('matches snapshot', () => {
    const { container } = render(<SidebarModuleList {...defaultProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});