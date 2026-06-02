/**
 * TEST: PDFThumbnail Component
 * 
 * Verifica la funcionalidad completa del componente de miniatura PDF
 * con doble clic para visualización inmersiva
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import PDFThumbnail from './PDFThumbnail';

describe('PDFThumbnail Component', () => {
  const mockProps = {
    title: "Guía: Anatomía de un Prompt",
    pdfUrl: "/Doc/guia-anatomia-prompt.pdf",
    description: "Documento PDF con estructura detallada de prompts efectivos",
    size: "2.4 MB",
    pages: 12
  };

  beforeEach(() => {
    // Mock de document.body.style.overflow
    Object.defineProperty(document.body, 'style', {
      value: {
        overflow: ''
      },
      writable: true
    });
  });

  test('renders PDF thumbnail with correct information', () => {
    render(<PDFThumbnail {...mockProps} />);
    
    // Verifica que se renderice el título
    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
    
    // Verifica que se renderice la descripción
    expect(screen.getByText(mockProps.description)).toBeInTheDocument();
    
    // Verifica que se rendericen los metadatos
    expect(screen.getAllByText('ialab.pdf_thumbnail.pages_label').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(mockProps.size)).toBeInTheDocument();
    expect(screen.getByText('ialab.pdf_thumbnail.pdf_label')).toBeInTheDocument();
    
    // Verifica el indicador de doble clic
    expect(screen.getAllByText('ialab.pdf_thumbnail.double_click').length).toBeGreaterThanOrEqual(1);
  });

  test('shows immersive view on double click', async () => {
    render(<PDFThumbnail {...mockProps} />);
    
    // Encuentra el contenedor de la miniatura
    const thumbnail = screen.getByLabelText('ialab.pdf_thumbnail.aria_label');
    
    // Simula doble clic
    fireEvent.doubleClick(thumbnail);
    
    // Verifica que se abra la vista inmersiva
    await waitFor(() => {
      expect(screen.getByText('ialab.pdf_thumbnail.immersive_view')).toBeInTheDocument();
      expect(screen.getByText('ialab.pdf_thumbnail.close_viewer')).toBeInTheDocument();
      expect(screen.getByText('ialab.pdf_thumbnail.back')).toBeInTheDocument();
    });
  });

  test('closes immersive view when close button is clicked', async () => {
    render(<PDFThumbnail {...mockProps} />);
    
    // Abre la vista inmersiva
    const thumbnail = screen.getByLabelText('ialab.pdf_thumbnail.aria_label');
    fireEvent.doubleClick(thumbnail);
    
    // Verifica que esté abierta
    await waitFor(() => {
      expect(screen.getByText('ialab.pdf_thumbnail.close_viewer')).toBeInTheDocument();
    });
    
    // Cierra la vista inmersiva
    const closeButton = screen.getByText('ialab.pdf_thumbnail.close_viewer');
    fireEvent.click(closeButton);
    
    // Verifica que se cierre
    await waitFor(() => {
      expect(screen.queryByText('ialab.pdf_thumbnail.close_viewer')).not.toBeInTheDocument();
    });
  });

  test('closes immersive view when clicking outside', async () => {
    render(<PDFThumbnail {...mockProps} />);
    
    // Abre la vista inmersiva
    const thumbnail = screen.getByLabelText('ialab.pdf_thumbnail.aria_label');
    fireEvent.doubleClick(thumbnail);
    
    // Verifica que esté abierta
    await waitFor(() => {
      expect(screen.getByText('ialab.pdf_thumbnail.immersive_view')).toBeInTheDocument();
    });
    
    // Encuentra el overlay (background)
    const overlay = screen.getByRole('presentation');
    
    // Simula clic en el overlay
    fireEvent.click(overlay);
    
    // Verifica que se cierre
    await waitFor(() => {
      expect(screen.queryByText('ialab.pdf_thumbnail.immersive_view')).not.toBeInTheDocument();
    });
  });

  test('download button works correctly', () => {
    render(<PDFThumbnail {...mockProps} />);
    
    // Abre la vista inmersiva
    const thumbnail = screen.getByLabelText('ialab.pdf_thumbnail.aria_label');
    fireEvent.doubleClick(thumbnail);
    
    // Verifica que el botón de descarga tenga el atributo download
    const downloadButton = screen.getByText('ialab.pdf_thumbnail.download');
    expect(downloadButton.closest('a')).toHaveAttribute('href', mockProps.pdfUrl);
    expect(downloadButton.closest('a')).toHaveAttribute('download');
  });

  test('shows fullscreen button in immersive view', async () => {
    render(<PDFThumbnail {...mockProps} />);
    
    // Abre la vista inmersiva
    const thumbnail = screen.getByLabelText('ialab.pdf_thumbnail.aria_label');
    fireEvent.doubleClick(thumbnail);
    
    // Verifica que el botón de pantalla completa esté presente
    await waitFor(() => {
      expect(screen.getByText('ialab.pdf_thumbnail.fullscreen')).toBeInTheDocument();
    });
  });

  test('has correct accessibility attributes', () => {
    render(<PDFThumbnail {...mockProps} />);
    
    // Verifica atributos ARIA
    const thumbnail = screen.getByLabelText('ialab.pdf_thumbnail.aria_label');
    expect(thumbnail).toHaveAttribute('aria-label', 'ialab.pdf_thumbnail.aria_label');
    expect(thumbnail).toHaveAttribute('title', 'ialab.pdf_thumbnail.title_attr');
    
    // Verifica botones de cierre
    fireEvent.doubleClick(thumbnail);
    
    const closeButton = screen.getByText('ialab.pdf_thumbnail.close_viewer');
    expect(closeButton).toHaveAttribute('aria-label', 'ialab.pdf_thumbnail.close_aria');
  });

  test('blocks body scroll when immersive view is open', async () => {
    render(<PDFThumbnail {...mockProps} />);
    
    // Verifica estado inicial
    expect(document.body.style.overflow).toBe('');
    
    // Abre la vista inmersiva
    const thumbnail = screen.getByLabelText('ialab.pdf_thumbnail.aria_label');
    fireEvent.doubleClick(thumbnail);
    
    // Verifica que se bloquee el scroll
    await waitFor(() => {
      expect(document.body.style.overflow).toBe('hidden');
    });
    
    // Cierra la vista inmersiva
    const closeButton = screen.getByText('ialab.pdf_thumbnail.close_viewer');
    fireEvent.click(closeButton);
    
    // Verifica que se restaure el scroll
    await waitFor(() => {
      expect(document.body.style.overflow).toBe('auto');
    });
  });
});