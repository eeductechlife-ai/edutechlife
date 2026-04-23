/**
 * TEST: PDFThumbnail Component
 * 
 * Verifica la funcionalidad completa del componente de miniatura PDF
 * con doble clic para visualización inmersiva
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PDFThumbnail from './PDFThumbnail';

describe('PDFThumbnail Component', () => {
  const mockProps = {
    title: "Guía: Anatomía de un Prompt",
    pdfUrl: "/Docs/guia_edutechlife_modulo1.pdf",
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
    expect(screen.getByText(`${mockProps.pages} páginas`)).toBeInTheDocument();
    expect(screen.getByText(mockProps.size)).toBeInTheDocument();
    expect(screen.getByText('PDF')).toBeInTheDocument();
    
    // Verifica el indicador de doble clic
    expect(screen.getByText('Doble clic')).toBeInTheDocument();
    expect(screen.getByText('Haz doble clic para abrir')).toBeInTheDocument();
  });

  test('shows immersive view on double click', async () => {
    render(<PDFThumbnail {...mockProps} />);
    
    // Encuentra el contenedor de la miniatura
    const thumbnail = screen.getByLabelText(`Abrir ${mockProps.title} en vista inmersiva (doble clic)`);
    
    // Simula doble clic
    fireEvent.doubleClick(thumbnail);
    
    // Verifica que se abra la vista inmersiva
    await waitFor(() => {
      expect(screen.getByText('Vista inmersiva')).toBeInTheDocument();
      expect(screen.getByText('Cerrar Visor')).toBeInTheDocument();
      expect(screen.getByText('Volver al Dashboard')).toBeInTheDocument();
    });
  });

  test('closes immersive view when close button is clicked', async () => {
    render(<PDFThumbnail {...mockProps} />);
    
    // Abre la vista inmersiva
    const thumbnail = screen.getByLabelText(`Abrir ${mockProps.title} en vista inmersiva (doble clic)`);
    fireEvent.doubleClick(thumbnail);
    
    // Verifica que esté abierta
    await waitFor(() => {
      expect(screen.getByText('Cerrar Visor')).toBeInTheDocument();
    });
    
    // Cierra la vista inmersiva
    const closeButton = screen.getByText('Cerrar Visor');
    fireEvent.click(closeButton);
    
    // Verifica que se cierre
    await waitFor(() => {
      expect(screen.queryByText('Cerrar Visor')).not.toBeInTheDocument();
    });
  });

  test('closes immersive view when clicking outside', async () => {
    render(<PDFThumbnail {...mockProps} />);
    
    // Abre la vista inmersiva
    const thumbnail = screen.getByLabelText(`Abrir ${mockProps.title} en vista inmersiva (doble clic)`);
    fireEvent.doubleClick(thumbnail);
    
    // Verifica que esté abierta
    await waitFor(() => {
      expect(screen.getByText('Vista inmersiva')).toBeInTheDocument();
    });
    
    // Encuentra el overlay (background)
    const overlay = screen.getByRole('presentation');
    
    // Simula clic en el overlay
    fireEvent.click(overlay);
    
    // Verifica que se cierre
    await waitFor(() => {
      expect(screen.queryByText('Vista inmersiva')).not.toBeInTheDocument();
    });
  });

  test('download button works correctly', () => {
    render(<PDFThumbnail {...mockProps} />);
    
    // Abre la vista inmersiva
    const thumbnail = screen.getByLabelText(`Abrir ${mockProps.title} en vista inmersiva (doble clic)`);
    fireEvent.doubleClick(thumbnail);
    
    // Verifica que el botón de descarga tenga el atributo download
    const downloadButton = screen.getByText('Descargar');
    expect(downloadButton.closest('a')).toHaveAttribute('href', mockProps.pdfUrl);
    expect(downloadButton.closest('a')).toHaveAttribute('download');
  });

  test('shows fullscreen button in immersive view', async () => {
    render(<PDFThumbnail {...mockProps} />);
    
    // Abre la vista inmersiva
    const thumbnail = screen.getByLabelText(`Abrir ${mockProps.title} en vista inmersiva (doble clic)`);
    fireEvent.doubleClick(thumbnail);
    
    // Verifica que el botón de pantalla completa esté presente
    await waitFor(() => {
      expect(screen.getByText('Pantalla completa')).toBeInTheDocument();
    });
  });

  test('has correct accessibility attributes', () => {
    render(<PDFThumbnail {...mockProps} />);
    
    // Verifica atributos ARIA
    const thumbnail = screen.getByLabelText(`Abrir ${mockProps.title} en vista inmersiva (doble clic)`);
    expect(thumbnail).toHaveAttribute('aria-label', `Abrir ${mockProps.title} en vista inmersiva (doble clic)`);
    expect(thumbnail).toHaveAttribute('title', 'Doble clic para abrir en vista inmersiva');
    
    // Verifica botones de cierre
    fireEvent.doubleClick(thumbnail);
    
    const closeButton = screen.getByText('Cerrar Visor');
    expect(closeButton).toHaveAttribute('aria-label', 'Cerrar visor y volver al dashboard');
  });

  test('blocks body scroll when immersive view is open', async () => {
    render(<PDFThumbnail {...mockProps} />);
    
    // Verifica estado inicial
    expect(document.body.style.overflow).toBe('');
    
    // Abre la vista inmersiva
    const thumbnail = screen.getByLabelText(`Abrir ${mockProps.title} en vista inmersiva (doble clic)`);
    fireEvent.doubleClick(thumbnail);
    
    // Verifica que se bloquee el scroll
    await waitFor(() => {
      expect(document.body.style.overflow).toBe('hidden');
    });
    
    // Cierra la vista inmersiva
    const closeButton = screen.getByText('Cerrar Visor');
    fireEvent.click(closeButton);
    
    // Verifica que se restaure el scroll
    await waitFor(() => {
      expect(document.body.style.overflow).toBe('auto');
    });
  });
});