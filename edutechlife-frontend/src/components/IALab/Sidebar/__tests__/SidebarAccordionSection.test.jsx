import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SidebarAccordionSection from '../SidebarAccordionSection';

// Mock para Icon component
jest.mock('../../../utils/iconMapping.jsx', () => ({
  Icon: ({ name, className }) => <div data-testid={`icon-${name}`} className={className} />
}));

describe('SidebarAccordionSection', () => {
  const mockItems = [
    { id: 1, title: 'Video 1: Introducción', type: 'video', duration: '15 min', level: 'Principiante' },
    { id: 2, title: 'PDF: Guía de ML', type: 'pdf', size: '2.5 MB', level: 'Intermedio', popular: true },
    { id: 3, title: 'Template: Proyecto', type: 'templates', size: '1.2 MB', level: 'Avanzado' },
    { id: 4, title: 'Caso de estudio', type: 'caseStudies', duration: '30 min', level: 'Experto', description: 'Análisis de caso real' }
  ];

  const defaultProps = {
    title: 'Recursos del Módulo',
    icon: 'fa-folder',
    defaultOpen: false,
    items: mockItems,
    type: 'recursos',
    onItemClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with default props (closed)', () => {
    render(<SidebarAccordionSection {...defaultProps} />);
    
    // Verificar título
    expect(screen.getByText('Recursos del Módulo')).toBeInTheDocument();
    
    // Verificar contador de items
    expect(screen.getByText('4')).toBeInTheDocument();
    
    // Verificar que el contenido está oculto inicialmente
    const content = screen.getByRole('region', { hidden: true });
    expect(content).toHaveClass('max-h-0');
    expect(content).toHaveClass('opacity-0');
  });

  test('renders with defaultOpen true', () => {
    render(<SidebarAccordionSection {...defaultProps} defaultOpen={true} />);
    
    // Verificar que el contenido está visible
    const content = screen.getByRole('region', { hidden: true });
    expect(content).toHaveClass('max-h-[500px]');
    expect(content).toHaveClass('opacity-100');
    
    // Verificar que los items se muestran
    mockItems.forEach(item => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    });
  });

  test('toggles accordion when clicking header', () => {
    render(<SidebarAccordionSection {...defaultProps} />);
    
    const headerButton = screen.getByRole('button', { name: /Recursos del Módulo/i });
    
    // Inicialmente cerrado
    let content = screen.getByRole('region', { hidden: true });
    expect(content).toHaveClass('max-h-0');
    
    // Click para abrir
    fireEvent.click(headerButton);
    content = screen.getByRole('region', { hidden: true });
    expect(content).toHaveClass('max-h-[500px]');
    
    // Click para cerrar
    fireEvent.click(headerButton);
    content = screen.getByRole('region', { hidden: true });
    expect(content).toHaveClass('max-h-0');
  });

  test('calls onItemClick when clicking item', () => {
    render(<SidebarAccordionSection {...defaultProps} defaultOpen={true} />);
    
    // Click en primer item
    const firstItem = screen.getByText('Video 1: Introducción').closest('button');
    fireEvent.click(firstItem);
    
    expect(defaultProps.onItemClick).toHaveBeenCalledWith(mockItems[0]);
    expect(defaultProps.onItemClick).toHaveBeenCalledTimes(1);
  });

  test('shows correct icons for different resource types', () => {
    render(<SidebarAccordionSection {...defaultProps} defaultOpen={true} />);
    
    // Verificar iconos específicos por tipo
    const pdfItem = screen.getByText('PDF: Guía de ML').closest('button');
    expect(pdfItem.querySelector('svg[data-icon="file-text"]')).toBeInTheDocument();
    
    const templateItem = screen.getByText('Template: Proyecto').closest('button');
    expect(templateItem.querySelector('svg[data-icon="clipboard"]')).toBeInTheDocument();
  });

  test('shows correct level badges', () => {
    render(<SidebarAccordionSection {...defaultProps} defaultOpen={true} />);
    
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
    
    const expertBadge = screen.getByText('Experto');
    expect(expertBadge).toHaveClass('bg-rose-500/10');
    expect(expertBadge).toHaveClass('text-rose-600');
  });

  test('shows popular badge for popular items', () => {
    render(<SidebarAccordionSection {...defaultProps} defaultOpen={true} />);
    
    // Verificar badge "Popular" para item popular
    expect(screen.getByText('Popular')).toBeInTheDocument();
    expect(screen.getByText('Popular')).toHaveClass('text-amber-600');
  });

  test('shows description when available', () => {
    render(<SidebarAccordionSection {...defaultProps} defaultOpen={true} />);
    
    // Verificar descripción para item con descripción
    expect(screen.getByText('Análisis de caso real')).toBeInTheDocument();
  });

  test('shows empty state when no items', () => {
    render(<SidebarAccordionSection {...defaultProps} items={[]} defaultOpen={true} />);
    
    expect(screen.getByText('No hay recursos del módulo disponibles')).toBeInTheDocument();
  });

  test('shows action buttons in footer when items exist', () => {
    render(<SidebarAccordionSection {...defaultProps} defaultOpen={true} />);
    
    expect(screen.getByText('Descargar todos')).toBeInTheDocument();
    expect(screen.getByText('Ver más')).toBeInTheDocument();
  });

  test('hides footer when no items', () => {
    render(<SidebarAccordionSection {...defaultProps} items={[]} defaultOpen={true} />);
    
    expect(screen.queryByText('Descargar todos')).not.toBeInTheDocument();
    expect(screen.queryByText('Ver más')).not.toBeInTheDocument();
  });

  test('applies custom className', () => {
    const customClass = 'custom-accordion';
    const { container } = render(
      <SidebarAccordionSection {...defaultProps} className={customClass} />
    );
    
    expect(container.firstChild).toHaveClass(customClass);
  });

  test('has proper accessibility attributes', () => {
    render(<SidebarAccordionSection {...defaultProps} />);
    
    const headerButton = screen.getByRole('button', { name: /Recursos del Módulo/i });
    expect(headerButton).toHaveAttribute('aria-expanded', 'false');
    expect(headerButton).toHaveAttribute('aria-controls', expect.stringContaining('accordion-content'));
    
    // Verificar aria-label para items
    const firstItem = screen.getByText('Video 1: Introducción').closest('button');
    expect(firstItem).toHaveAttribute('aria-label', expect.stringContaining('Video 1: Introducción'));
    expect(firstItem).toHaveAttribute('aria-label', expect.stringContaining('15 min'));
  });

  test('handles videos type correctly', () => {
    const videoProps = {
      ...defaultProps,
      type: 'videos',
      items: [
        { id: 1, title: 'Video tutorial', duration: '10 min' }
      ]
    };
    
    render(<SidebarAccordionSection {...videoProps} defaultOpen={true} />);
    
    const videoItem = screen.getByText('Video tutorial').closest('button');
    expect(videoItem.querySelector('svg[data-icon="play"]')).toBeInTheDocument();
  });

  test('handles custom type correctly', () => {
    const customProps = {
      ...defaultProps,
      type: 'custom',
      items: [
        { id: 1, title: 'Custom item' }
      ]
    };
    
    render(<SidebarAccordionSection {...customProps} defaultOpen={true} />);
    
    const customItem = screen.getByText('Custom item').closest('button');
    expect(customItem.querySelector('svg[data-icon="zap"]')).toBeInTheDocument();
  });

  test('shows action icons for items with actions', () => {
    const itemsWithActions = [
      { id: 1, title: 'Downloadable PDF', type: 'pdf', action: 'download' },
      { id: 2, title: 'Playable Video', type: 'video', action: 'play' },
      { id: 3, title: 'External Link', type: 'link', action: 'open' }
    ];
    
    render(<SidebarAccordionSection {...defaultProps} items={itemsWithActions} defaultOpen={true} />);
    
    // Verificar iconos de acción
    expect(screen.getByText('Downloadable PDF').closest('button').querySelector('svg[data-icon="download"]')).toBeInTheDocument();
    expect(screen.getByText('Playable Video').closest('button').querySelector('svg[data-icon="play"]')).toBeInTheDocument();
    expect(screen.getByText('External Link').closest('button').querySelector('svg[data-icon="external-link"]')).toBeInTheDocument();
  });

  test('matches snapshot (closed)', () => {
    const { container } = render(<SidebarAccordionSection {...defaultProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('matches snapshot (open)', () => {
    const { container } = render(<SidebarAccordionSection {...defaultProps} defaultOpen={true} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});