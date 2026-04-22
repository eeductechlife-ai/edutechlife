import React, { useState } from 'react';
import { IALabProvider, useIALabContext } from '../../context/IALabContext';
import IALabHeader from './IALabHeader';
import IALabSidebar from './IALabSidebar';
import IALabModuleHeader from './IALabModuleHeader';
import ModuleOverviewCard from './ModuleOverviewCard';
import ModuleInfoSection from './ModuleInfoSection';
import IALabContentAccordion from './IALabContentAccordion';
import IALabChallengeSection from './IALabChallengeSection';
import IALabForumSection from './IALabForumSection';
import IALabForumOptimized from './IALabForumOptimized';
import IALabSynthesizer from './IALabSynthesizer';
import ReactivePromptStation from './ReactivePromptStation';
import IALabEvaluationModal from './IALabEvaluationModal';
import IALabEvaluationModalPremium from './IALabEvaluationModalPremium';
import IALabValerioPanel from './IALabValerioPanel';
import ErrorBoundary from '../forum/ErrorBoundary';

/**
 * Componente principal wrapper para IALab - Arquitectura modular premium
 * Integra todos los componentes modulares manteniendo 100% la estructura visual original
 * Elimina componentes redundantes (cuadro "¿Listo para avanzar?" y quiz evaluación inline)
 * 
 * @returns {JSX.Element} Componente IALab completo
 */
const IALabContent = () => {
    const { showPremiumEvaluationModal, setShowPremiumEvaluationModal } = useIALabContext();
    const [showExamModal, setShowExamModal] = useState(false);
    const [showValerioPanel, setShowValerioPanel] = useState(false);

    // Debug logging
    React.useEffect(() => {
        console.log('🎯 [DEBUG] IALabContent montado');
        console.log('🎯 [DEBUG] Estado showPremiumEvaluationModal:', showPremiumEvaluationModal);
    }, []);

    React.useEffect(() => {
        console.log('🎯 [DEBUG] showPremiumEvaluationModal actualizado:', showPremiumEvaluationModal);
    }, [showPremiumEvaluationModal]);

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
        <div className="flex flex-col h-screen overflow-visible bg-gradient-to-br from-[#F8FAFC] via-white to-[#F8FAFC]/50">
                {/* Header principal - ocupa altura natural y no flota sobre contenido */}
                <IALabHeader onAction={handleGlobalAction} />
                
                {/* Layout principal - Flexbox estricto para evitar overlap */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar - ancho fijo 256px (w-64) */}
                    <IALabSidebar />
                    
                    {/* Área de Contenido Principal - ocupa resto con scroll */}
                    <main className="flex-1 overflow-y-auto px-4 py-6">
                        <div className="space-y-10 w-full max-w-[calc(100%-1rem)] pb-10">
                            {/* 1. PRIMERO: TÍTULO PRINCIPAL ARRIBA DEL TODO */}
                            <div className="relative z-30">
                              <IALabModuleHeader onAction={handleGlobalAction} />
                            </div>

                            {/* 2. SEGUNDO: SECCIÓN INFORMATIVA DEL MÓDULO */}
                            <div className="mt-8">
                              <ModuleInfoSection />
                            </div>

                            {/* 3. TERCERO: TARJETA DE RESUMEN EN EL MEDIO */}
                            <ModuleOverviewCard />

                            {/* 3. TERCERO: ACORDEONES/LECCIONES ABAJO */}
                            <div className="mt-6">
                              <IALabContentAccordion />
                            </div>
                            
                            {/* Estación Reactiva de Prompts - Fusión Sintetizador + Dashboard */}
                            <div className="mt-10">
                              <ReactivePromptStation />
                            </div>
                            
                            {/* Contenedor Grid: Desafío y Comunidad */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full mt-12">
                                {/* Columna Izquierda: Desafío del Curso */}
                                <ErrorBoundary>
                                    <IALabChallengeSection />
                                </ErrorBoundary>
                                
                                {/* Columna Derecha: Comunidad IALab Optimizada */}
                                <ErrorBoundary>
                                    <IALabForumOptimized 
                                        compact={false}
                                        initialLimit={5}
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
                
                {/* Modal de Evaluación Premium (Nuevo Desafío) */}
                {showPremiumEvaluationModal && (
                    <>
                        {console.log('🎯 [DEBUG] Condición showPremiumEvaluationModal es TRUE, renderizando modal...')}
                        <ErrorBoundary>
                            <IALabEvaluationModalPremium 
                                isOpen={showPremiumEvaluationModal}
                                onClose={() => setShowPremiumEvaluationModal(false)}
                            />
                        </ErrorBoundary>
                    </>
                )}
                
                 {/* FAB de Valerio - posicionado relativo al viewport */}
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
    );
};

/**
 * Componente principal wrapper que provee el contexto
 */
const IALab = () => {
    return (
        <IALabProvider>
            <IALabContent />
        </IALabProvider>
    );
};

export default IALab;