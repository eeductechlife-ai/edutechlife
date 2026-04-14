import React, { useState } from 'react';
import { IALabProvider } from '../../context/IALabContext';
import IALabHeader from './IALabHeader';
import IALabSidebar from './IALabSidebar';
import IALabModuleHeader from './IALabModuleHeader';
import IALabContentAccordion from './IALabContentAccordion';
import IALabChallengeSection from './IALabChallengeSection';
import IALabForumSection from './IALabForumSection';
import IALabSynthesizer from './IALabSynthesizer';
import IALabEvaluationModal from './IALabEvaluationModal';
import IALabValerioPanel from './IALabValerioPanel';
import ErrorBoundary from '../ErrorBoundary';

/**
 * Componente principal wrapper para IALab - Arquitectura modular premium
 * Integra todos los componentes modulares manteniendo 100% la estructura visual original
 * Elimina componentes redundantes (cuadro "¿Listo para avanzar?" y quiz evaluación inline)
 * 
 * @returns {JSX.Element} Componente IALab completo
 */
const IALab = () => {
    const [showExamModal, setShowExamModal] = useState(false);
    const [showValerioPanel, setShowValerioPanel] = useState(false);

    // Handler para acciones globales
    const handleGlobalAction = (action, data) => {
        switch (action) {
            case 'OPEN_EVALUATION':
                setShowExamModal(true);
                break;
            case 'OPEN_VALERIO':
                setShowValerioPanel(true);
                break;
            case 'CLOSE_EVALUATION':
                setShowExamModal(false);
                break;
            case 'CLOSE_VALERIO':
                setShowValerioPanel(false);
                break;
            default:
                console.log('Acción global no manejada:', action, data);
        }
    };

    return (
        <IALabProvider>
            <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-white to-[#F8FAFC]/50">
                {/* Header principal */}
                <IALabHeader onAction={handleGlobalAction} />
                
                {/* Layout principal */}
                <div className="flex">
                    {/* Sidebar (20%) */}
                    <IALabSidebar />
                    
                    {/* Área de Contenido Principal (80%) */}
                    <main className="w-[80%] ml-[20%] px-4 py-6 h-[calc(100vh-5rem)] overflow-y-auto">
                        <div className="space-y-8 w-full max-w-[calc(100%-1rem)] pb-10">
                            {/* Module Header con botón de evaluación */}
                            <IALabModuleHeader onAction={handleGlobalAction} />
                            
                            {/* Cuadro de Introducción - Acordeón Interactivo */}
                            <IALabContentAccordion />
                            
                            {/* Sintetizador de Prompts Élite */}
                            <IALabSynthesizer />
                            
                            {/* Contenedor Grid: Desafío y Comunidad */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full mt-10">
                                {/* Columna Izquierda: Desafío del Curso */}
                                <ErrorBoundary>
                                    <IALabChallengeSection />
                                </ErrorBoundary>
                                
                                {/* Columna Derecha: Comunidad IALab */}
                                <ErrorBoundary>
                                    <IALabForumSection 
                                        compact={false}
                                        showHeader={true}
                                        showInput={true}
                                        showStats={true}
                                        limit={10}
                                    />
                                </ErrorBoundary>
                            </div>
                        </div>
                    </main>
                </div>
                
                {/* Modal de Evaluación */}
                {showExamModal && (
                    <ErrorBoundary>
                        <IALabEvaluationModal 
                            isOpen={showExamModal}
                            onClose={() => handleGlobalAction('CLOSE_EVALUATION')}
                        />
                    </ErrorBoundary>
                )}
                
                {/* Panel de Coach IA Valerio */}
                {showValerioPanel && (
                    <ErrorBoundary>
                        <IALabValerioPanel 
                            isOpen={showValerioPanel}
                            onClose={() => handleGlobalAction('CLOSE_VALERIO')}
                        />
                    </ErrorBoundary>
                )}
                
                {/* FAB de Valerio */}
                <button 
                    className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-white to-[#F8FAFC] border border-[#E2E8F0]/50 rounded-full shadow-[0_8px_30px_rgba(0,75,99,0.12)] hover:scale-105 transition-all duration-300 z-50 flex items-center justify-center group hover:shadow-[0_12px_40px_rgba(0,75,99,0.16)]"
                    onClick={() => handleGlobalAction('OPEN_VALERIO')}
                    aria-label="Abrir panel de coach IA Valerio"
                >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform duration-300">
                        <path d="M12 3C8.5 3 6 5.5 6 9C6 10.5 6.5 12 7.5 13C8.5 14 9.5 15 10 16C10.5 17 11 18 12 18C13 18 13.5 17 14 16C14.5 15 15.5 14 16.5 13C17.5 12 18 10.5 18 9C18 5.5 15.5 3 12 3Z" fill="#004B63" />
                        <path d="M9 7C8.5 7 8 7.5 8 8C8 8.5 8.5 9 9 9C9.5 9 10 8.5 10 8C10 7.5 9.5 7 9 7Z" fill="#00BCD4" />
                        <path d="M15 7C14.5 7 14 7.5 14 8C14 8.5 14.5 9 15 9C15.5 9 16 8.5 16 8C16 7.5 15.5 7 15 7Z" fill="#00BCD4" />
                        <path d="M12 5C11.5 5 11 5.5 11 6C11 6.5 11.5 7 12 7C12.5 7 13 6.5 13 6C13 5.5 12.5 5 12 5Z" fill="#00BCD4" className="animate-pulse" />
                    </svg>
                </button>
                
                {/* Estilos de protección anti-impresión (para modal de evaluación) */}
                <style>
                    {`
                        @media print {
                            .exam-protection-modal,
                            .exam-protection-modal * {
                                display: none !important;
                                visibility: hidden !important;
                                opacity: 0 !important;
                            }
                            
                            body::before {
                                content: "⚠️ IMPRESIÓN BLOQUEADA - Este examen está protegido por el protocolo de seguridad Edutechlife";
                                display: block !important;
                                font-size: 24px;
                                font-weight: bold;
                                text-align: center;
                                color: red;
                                padding: 40px;
                                background: white;
                            }
                        }
                        
                        /* Animación para mensajes temporales */
                        @keyframes fade-in {
                            from { opacity: 0; transform: translate(-50%, -10px); }
                            to { opacity: 1; transform: translate(-50%, 0); }
                        }
                        
                        .animate-fade-in {
                            animation: fade-in 0.3s ease-out;
                        }
                        
                        /* Efectos de botón premium */
                        .button-pulse {
                            animation: pulse 2s infinite;
                        }
                        
                        @keyframes pulse {
                            0%, 100% { box-shadow: 0 0 0 0 rgba(0, 188, 212, 0.4); }
                            50% { box-shadow: 0 0 0 10px rgba(0, 188, 212, 0); }
                        }
                        
                        /* Scrollbar personalizada */
                        ::-webkit-scrollbar {
                            width: 8px;
                            height: 8px;
                        }
                        
                        ::-webkit-scrollbar-track {
                            background: #F1F5F9;
                            border-radius: 4px;
                        }
                        
                        ::-webkit-scrollbar-thumb {
                            background: linear-gradient(to bottom, #004B63, #00BCD4);
                            border-radius: 4px;
                        }
                        
                        ::-webkit-scrollbar-thumb:hover {
                            background: linear-gradient(to bottom, #00374A, #0097A7);
                        }
                    `}
                </style>
            </div>
        </IALabProvider>
    );
};

export default IALab;