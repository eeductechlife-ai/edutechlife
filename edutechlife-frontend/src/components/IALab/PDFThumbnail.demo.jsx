/**
 * DEMO: PDFThumbnail Component
 * 
 * Componente de demostración para probar la funcionalidad
 * del PDFThumbnail de forma aislada
 */

import React from 'react';
import PDFThumbnail from './PDFThumbnail';

const PDFThumbnailDemo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-[#004B63] mb-4">
            🎯 PDFThumbnail Demo
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Componente premium de miniatura PDF con doble clic para visualización inmersiva.
            Diseñado para la plataforma Edutechlife.
          </p>
        </div>

        {/* Grid de demostración */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Demo 1: Miniatura básica */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800">1. Miniatura Básica</h2>
            <PDFThumbnail
              title="Guía: Anatomía de un Prompt"
              pdfUrl="/guia-anatomia-prompt.pdf"
              description="Documento PDF con estructura detallada de prompts efectivos"
              size="4.0 MB"
              pages={12}
            />
            <div className="text-sm text-slate-600 p-4 bg-white/50 rounded-lg">
              <p className="font-medium mb-2">📋 Instrucciones:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Haz <strong>doble clic</strong> en la miniatura</li>
                <li>Se abrirá la vista inmersiva</li>
                <li>Prueba los controles de navegación</li>
                <li>Cierra con el botón "Cerrar Visor"</li>
              </ul>
            </div>
          </div>

          {/* Demo 2: Con diferentes metadatos */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800">2. Documento Largo</h2>
            <PDFThumbnail
              title="Manual Completo de IA Generativa"
              pdfUrl="/guia-anatomia-prompt.pdf"
              description="Guía extensa con 50+ páginas de contenido avanzado sobre IA Generativa y sus aplicaciones en educación."
              size="15.2 MB"
              pages={52}
            />
            <div className="text-sm text-slate-600 p-4 bg-white/50 rounded-lg">
              <p className="font-medium mb-2">🎯 Características:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Documento de 52 páginas</li>
                <li>Navegación por páginas integrada</li>
                <li>Zoom con rueda del mouse</li>
                <li>Botón de pantalla completa</li>
              </ul>
            </div>
          </div>

          {/* Demo 3: Documento técnico */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800">3. Cheatsheet Técnica</h2>
            <PDFThumbnail
              title="Cheatsheet: Prompt Engineering"
              pdfUrl="/guia-anatomia-prompt.pdf"
              description="Referencia rápida con patrones, estructuras y ejemplos de prompts para diferentes modelos de IA."
              size="3.1 MB"
              pages={8}
            />
            <div className="text-sm text-slate-600 p-4 bg-white/50 rounded-lg">
              <p className="font-medium mb-2">🚀 Funcionalidades:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Vista previa instantánea</li>
                <li>Descarga directa del PDF</li>
                <li>Diseño responsive</li>
                <li>Accesibilidad WCAG AA</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sección de características */}
        <div className="mt-12 p-8 bg-white rounded-2xl border border-slate-200 shadow-lg">
          <h2 className="text-2xl font-bold text-[#004B63] mb-6 text-center">
            ✨ Características Premium
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#004B63] to-[#006D8F] rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">🎯</span>
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Doble Clic</h3>
              <p className="text-slate-600 text-sm">
                Interacción intuitiva con doble clic para abrir vista inmersiva
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00BCD4] to-[#4DD0E1] rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">📱</span>
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Pantalla Completa</h3>
              <p className="text-slate-600 text-sm">
                Visor a pantalla completa con controles nativos del navegador
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">🎨</span>
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Diseño Premium</h3>
              <p className="text-slate-600 text-sm">
                Estética Edutechlife con gradientes corporativos y animaciones
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">♿</span>
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Accesibilidad</h3>
              <p className="text-slate-600 text-sm">
                Navegación por teclado, ARIA labels y contraste WCAG AA
              </p>
            </div>
          </div>
        </div>

        {/* Instrucciones de uso */}
        <div className="mt-8 p-6 bg-gradient-to-r from-[#004B63]/5 to-[#00BCD4]/5 rounded-2xl border border-[#004B63]/10">
          <h3 className="text-lg font-bold text-[#004B63] mb-3">📖 Cómo Usar en tu Proyecto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-slate-700 mb-2">1. Importación</h4>
              <pre className="bg-slate-800 text-slate-100 p-3 rounded-lg text-sm overflow-x-auto">
{`import PDFThumbnail from './components/IALab/PDFThumbnail';`}
              </pre>
            </div>
            
            <div>
              <h4 className="font-medium text-slate-700 mb-2">2. Uso Básico</h4>
              <pre className="bg-slate-800 text-slate-100 p-3 rounded-lg text-sm overflow-x-auto">
{`<PDFThumbnail
  title="Mi Documento PDF"
  pdfUrl="/docs/mi-documento.pdf"
  description="Descripción del contenido"
  size="5.2 MB"
  pages={24}
/>`}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-200 text-center">
          <p className="text-slate-600">
            Componente desarrollado para <span className="font-bold text-[#004B63]">Edutechlife Platform v2.0</span>
          </p>
          <p className="text-sm text-slate-500 mt-2">
            © 2024 Edutechlife - Sistema de miniatura PDF con visualización inmersiva
          </p>
        </div>
      </div>
    </div>
  );
};

export default PDFThumbnailDemo;